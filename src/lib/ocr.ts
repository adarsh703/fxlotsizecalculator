import type { ExtractedTradeData, TradeDirection } from './types';

/**
 * Extract trade data from a TradingView position tool screenshot.
 * Uses Tesseract.js for client-side OCR - no server required.
 */
export async function extractFromScreenshot(
  imageFile: File,
): Promise<ExtractedTradeData> {
  const { createWorker } = await import('tesseract.js');
  const worker = await createWorker('eng');

  try {
    const {
      data: { text },
    } = await worker.recognize(imageFile);
    return parseTradeData(text);
  } finally {
    await worker.terminate();
  }
}

/**
 * Parse OCR-extracted text to find trade data.
 * Handles various TradingView position tool screenshot formats.
 */
export function parseTradeData(text: string): ExtractedTradeData {
  const result: ExtractedTradeData = {
    entryPrice: null,
    slPrice: null,
    tpPrice: null,
    direction: null,
    confidence: 0,
  };

  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  let matchCount = 0;
  
  let currentSection: 'profit' | 'stop' | null = null;

  for (const line of lines) {
    const lower = line.toLowerCase();

    // Track sections for TradingView Settings modal format
    if (lower.includes('profit level')) {
      currentSection = 'profit';
    } else if (lower.includes('stop level')) {
      currentSection = 'stop';
    }

    // Handle "Price X" inside a section
    if (currentSection && lower.includes('price')) {
      const p = matchPricePattern(line, ['price']);
      if (p !== null) {
        if (currentSection === 'profit' && result.tpPrice === null) {
          result.tpPrice = p;
          matchCount++;
        } else if (currentSection === 'stop' && result.slPrice === null) {
          result.slPrice = p;
          matchCount++;
        }
      }
    }

    // Try to extract entry price
    if (result.entryPrice === null) {
      const entryMatch = matchPricePattern(line, [
        'entry',
        'open',
        'entry price',
        'open price',
      ]);
      if (entryMatch !== null) {
        result.entryPrice = entryMatch;
        matchCount++;
      }
    }

    // Fallback: Try to extract stop loss price on same line
    if (result.slPrice === null) {
      const slMatch = matchPricePattern(line, [
        'stop loss',
        'stop',
        'sl',
        's/l',
        'stoploss',
      ]);
      if (slMatch !== null) {
        result.slPrice = slMatch;
        matchCount++;
      }
    }

    // Fallback: Try to extract take profit price on same line
    if (result.tpPrice === null) {
      const tpMatch = matchPricePattern(line, [
        'take profit',
        'profit',
        'tp',
        't/p',
        'target',
        'takeprofit',
      ]);
      // Avoid matching "PROFIT LEVEL" heading itself if it has no numbers
      if (tpMatch !== null && !lower.includes('profit level')) {
        result.tpPrice = tpMatch;
        matchCount++;
      }
    }

    // Try to detect direction
    if (result.direction === null) {
      if (
        lower.includes('long') ||
        lower.includes('buy') ||
        lower.includes('bullish')
      ) {
        result.direction = 'long';
        matchCount++;
      } else if (
        lower.includes('short') ||
        lower.includes('sell') ||
        lower.includes('bearish')
      ) {
        result.direction = 'short';
        matchCount++;
      }
    }
  }

  // If we didn't find labeled prices, try to find standalone price patterns
  if (matchCount < 2) {
    const allPrices = extractAllPrices(text);
    if (allPrices.length >= 2) {
      // Sort by value - for a long trade, typically entry < TP and SL < entry
      const sorted = [...allPrices].sort((a, b) => a - b);

      if (result.entryPrice === null && sorted.length >= 2) {
        // Middle value is likely the entry
        const midIdx = Math.floor(sorted.length / 2);
        result.entryPrice = sorted[midIdx];
        matchCount++;
      }
    }
  }

  // Infer direction from prices if not explicitly found
  if (
    result.direction === null &&
    result.entryPrice !== null &&
    result.slPrice !== null
  ) {
    result.direction =
      result.slPrice < result.entryPrice ? 'long' : 'short';
    matchCount++;
  }

  // Calculate confidence (0-1) based on how many fields we found
  const maxFields = 4; // entry, sl, tp, direction
  result.confidence = Math.min(matchCount / maxFields, 1);

  return result;
}

/**
 * Match a price value in a line that contains one of the given keywords.
 */
function matchPricePattern(
  line: string,
  keywords: string[],
): number | null {
  const lower = line.toLowerCase();
  const hasKeyword = keywords.some((kw) => lower.includes(kw));
  if (!hasKeyword) return null;

  // Match decimal numbers like 1.08500, 1850.50, 0.6543, 42153.25
  const priceRegex = /(\d+\.?\d*)/g;
  const matches = [...line.matchAll(priceRegex)];

  // Filter out very small numbers that are probably not prices (e.g., percentages)
  const prices = matches
    .map((m) => parseFloat(m[1]))
    .filter((p) => p > 0.001);

  // Return the largest number found (most likely the price, not a label number)
  if (prices.length > 0) {
    return prices[prices.length - 1];
  }

  return null;
}

/**
 * Extract all price-like numbers from the text.
 */
function extractAllPrices(text: string): number[] {
  const priceRegex = /\b(\d{1,6}\.\d{1,5})\b/g;
  const matches = [...text.matchAll(priceRegex)];
  return matches.map((m) => parseFloat(m[1])).filter((p) => p > 0.001);
}
