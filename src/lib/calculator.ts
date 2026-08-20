import type { CalculationResult, Instrument } from './types';

/**
 * Round a number to specified decimal places
 */
export function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Calculate pips from entry and SL prices
 */
export function calculatePipsFromPrice(
  entryPrice: number,
  slPrice: number,
  pipSize: number,
): number {
  return Math.abs(entryPrice - slPrice) / pipSize;
}

/**
 * Calculate the take-profit pips from entry and TP prices
 */
export function calculateTpPips(
  entryPrice: number,
  tpPrice: number,
  pipSize: number,
): number {
  return Math.abs(entryPrice - tpPrice) / pipSize;
}

/**
 * Calculate Risk:Reward ratio. Returns null if TP is not set.
 */
export function calculateRRRatio(
  slPips: number,
  tpPips: number | null,
): number | null {
  if (tpPips === null || slPips <= 0) return null;
  return round(tpPips / slPips, 2);
}

/**
 * Main lot size calculation.
 * Returns null if inputs are invalid.
 */
export function calculateLotSize(params: {
  accountBalance: number;
  riskMode: 'percentage' | 'amount';
  riskPercentage: number;
  riskAmount: number;
  slPips: number;
  pipValuePerLot: number;
  tpPips: number | null;
}): CalculationResult | null {
  const { accountBalance, riskMode, riskPercentage, slPips, pipValuePerLot, tpPips } = params;
  let riskAmount = params.riskAmount;

  if (slPips <= 0 || pipValuePerLot <= 0) {
    return null;
  }

  if (riskMode === 'percentage') {
    if (accountBalance <= 0 || isNaN(accountBalance)) return null;
    riskAmount = accountBalance * (riskPercentage / 100);
  }

  if (riskAmount <= 0 || isNaN(riskAmount)) return null;

  const riskPerPip = riskAmount / slPips;
  const standardLots = riskPerPip / pipValuePerLot;

  const miniLots = standardLots * 10;
  const microLots = standardLots * 100;
  const units = standardLots * 100000;
  const pipValue = pipValuePerLot * standardLots;

  const rrRatio = calculateRRRatio(slPips, tpPips);

  return {
    standardLots: round(standardLots, 2),
    miniLots: round(miniLots, 2),
    microLots: round(microLots, 2),
    units: round(units, 0),
    pipValue: round(pipValue, 2),
    riskAmount: round(riskAmount, 2),
    slPips: round(slPips, 1),
    rrRatio,
  };
}

/**
 * Format a number with commas and specified decimal places
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Generate a copyable trade summary string
 */
export function generateTradeSummary(params: {
  instrument: string;
  direction: 'long' | 'short';
  entryPrice: number | null;
  slPrice: number | null;
  tpPrice: number | null;
  slPips: number;
  riskPercentage: number | null;
  riskAmount: number;
  lotSize: number;
  rrRatio: number | null;
}): string {
  const { instrument, direction, entryPrice, slPrice, tpPrice, slPips, riskPercentage, riskAmount, lotSize, rrRatio } = params;

  const title = `${instrument} ${direction.toUpperCase()}`;

  const formatPrice = (price: number | null) => (price !== null ? formatNumber(price, String(price).split('.')[1]?.length > 2 ? 5 : 2) : 'N/A');

  const entryStr = entryPrice !== null ? formatPrice(entryPrice) : 'Market';
  const slStr = slPrice !== null ? formatPrice(slPrice) : 'N/A';
  const tpStr = tpPrice !== null ? formatPrice(tpPrice) : 'N/A';

  const levels = `Entry: ${entryStr} | SL: ${slStr} | TP: ${tpStr}`;
  const distance = `SL Distance: ${formatNumber(slPips, 1)} pips`;

  const riskPctStr = riskPercentage !== null ? `${formatNumber(riskPercentage, 2)}%` : 'N/A';
  const riskStr = `Risk: ${riskPctStr} ($${formatNumber(riskAmount, 2)}) | Lot Size: ${formatNumber(lotSize, 2)}`;

  const rrStr = rrRatio !== null ? `R:R = 1:${formatNumber(rrRatio, 1)}` : 'R:R = N/A';

  return `${title}\n${levels}\n${distance}\n${riskStr}\n${rrStr}\n-\nCalculated on fxlotsizecalculator.com`;
}
