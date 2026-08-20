import React, { useState } from 'react';
import type { CalculationResult, RiskMode, TradeDirection } from '../../lib/types';
import { formatNumber, generateTradeSummary } from '../../lib/calculator';
import { getInstrument } from '../../data/instruments';
import { Button } from '../ui/Button';

interface ResultsPanelProps {
  result: CalculationResult | null;
  instrumentSymbol: string;
  direction: TradeDirection;
  entryPrice: string;
  slPrice: string;
  tpPrice: string;
  riskMode: RiskMode;
  riskPercentage: string;
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-body">{label}</span>
      <span className={`text-sm font-medium ${highlight ? 'text-link' : 'text-ink'}`}>{value}</span>
    </div>
  );
}

export function ResultsPanel(props: ResultsPanelProps) {
  const { result } = props;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result) return;

    const summary = generateTradeSummary({
      instrument: props.instrumentSymbol,
      direction: props.direction,
      entryPrice: props.entryPrice ? parseFloat(props.entryPrice) : null,
      slPrice: props.slPrice ? parseFloat(props.slPrice) : null,
      tpPrice: props.tpPrice ? parseFloat(props.tpPrice) : null,
      slPips: result.slPips,
      riskPercentage: props.riskMode === 'percentage' ? parseFloat(props.riskPercentage) : null,
      riskAmount: result.riskAmount,
      lotSize: result.standardLots,
      rrRatio: result.rrRatio,
    });

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy summary:', err);
    }
  };

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
        <div className="w-16 h-16 rounded-full bg-canvas-soft-2 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-mute" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-mute text-sm">Enter your trade parameters<br/>to see position sizing results.</p>
      </div>
    );
  }

  return (
    <div className="lg:sticky lg:top-24">
      {/* Eyebrow */}
      <span className="font-mono text-xs uppercase tracking-wider text-mute">Recommended Trade Size</span>
      
      {/* Big number */}
      <div className="mt-3 flex flex-col">
        <div className="flex items-baseline">
          <span className="text-5xl font-semibold tracking-[-0.04em] text-ink">{result.standardLots}</span>
          <span className="ml-2 text-base font-medium text-body">
            {getInstrument(props.instrumentSymbol)?.category === 'futures' ? 'Contracts' : 'Lots'}
          </span>
        </div>
        <p className="text-xs text-mute mt-2 max-w-[250px]">
          Enter this exact number into MetaTrader, cTrader, or your broker's platform.
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-hairline my-5"></div>

      {/* Detail rows */}
      <div className="space-y-3">
        {getInstrument(props.instrumentSymbol)?.category !== 'futures' && (
          <>
            <DetailRow label="Mini Lots" value={formatNumber(result.miniLots, 2)} />
            <DetailRow label="Micro Lots" value={formatNumber(result.microLots, 2)} />
          </>
        )}
        <DetailRow label="Units" value={formatNumber(result.units, 0)} />
      </div>

      {/* Divider */}
      <div className="border-t border-hairline my-5"></div>

      {/* Financial details */}
      <div className="space-y-3">
        <DetailRow label="Pip Value" value={`$${formatNumber(result.pipValue, 2)}`} />
        <DetailRow label="Risk Amount" value={`$${formatNumber(result.riskAmount, 2)}`} />
        {result.rrRatio && <DetailRow label="Risk : Reward" value={`1 : ${result.rrRatio}`} highlight />}
        <DetailRow label="SL Distance" value={`${formatNumber(result.slPips, 1)} pips`} />
      </div>

      {/* Divider */}
      <div className="border-t border-hairline my-5"></div>

      {/* Copy button */}
      <Button variant="primary" size="sm" onClick={handleCopy} className="w-full">
        {copied ? 'Copied!' : 'Copy Trade Summary'}
      </Button>
    </div>
  );
}
