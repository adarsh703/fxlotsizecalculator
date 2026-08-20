import { useState, useMemo, useEffect } from 'react';
import type { RiskMode, SLMode, TradeDirection, AccountCurrency, ExtractedTradeData } from '../../lib/types';
import { CATEGORY_LABELS } from '../../lib/types';
import { calculateLotSize, calculatePipsFromPrice, calculateTpPips } from '../../lib/calculator';
import { instruments, getInstrument } from '../../data/instruments';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Toggle } from '../ui/Toggle';
import { Button } from '../ui/Button';
import { ResultsPanel } from './ResultsPanel';
import { ScreenshotUpload } from './ScreenshotUpload';

export function Calculator({ initialInstrument = '' }: { initialInstrument?: string }) {
  const [accountBalance, setAccountBalance] = useState('');
  const [accountCurrency, setAccountCurrency] = useState<AccountCurrency>('USD');
  const [riskMode, setRiskMode] = useState<RiskMode>('percentage');
  const [riskPercentage, setRiskPercentage] = useState('');
  const [riskAmount, setRiskAmount] = useState('');
  const [instrument, setInstrument] = useState(initialInstrument);
  const [slMode, setSlMode] = useState<SLMode>('pips');
  const [slPips, setSlPips] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [slPrice, setSlPrice] = useState('');
  const [tpPips, setTpPips] = useState('');
  const [tpPrice, setTpPrice] = useState('');
  const [direction, setDirection] = useState<TradeDirection>('long');
  const [showScreenshotUpload, setShowScreenshotUpload] = useState(false);
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('fx_calculator_template');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.accountBalance) setAccountBalance(data.accountBalance);
        if (data.accountCurrency) setAccountCurrency(data.accountCurrency);
        if (data.riskMode) setRiskMode(data.riskMode);
        if (data.riskPercentage) setRiskPercentage(data.riskPercentage);
        if (data.riskAmount) setRiskAmount(data.riskAmount);
        if (data.instrument && !initialInstrument) setInstrument(data.instrument);
        if (data.slMode) setSlMode(data.slMode);
        if (data.direction) setDirection(data.direction);
      } catch (e) {}
    }
  }, [initialInstrument]);

  const saveTemplate = () => {
    const data = {
      accountBalance,
      accountCurrency,
      riskMode,
      riskPercentage,
      riskAmount,
      instrument,
      slMode,
      direction
    };
    localStorage.setItem('fx_calculator_template', JSON.stringify(data));
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 2000);
  };

  const currencyOptions = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF'].map((c) => ({
    value: c,
    label: c,
  }));

  const instrumentOptions = instruments.map((inst) => ({
    value: inst.symbol,
    label: `${inst.symbol} - ${inst.name}`,
    group: CATEGORY_LABELS[inst.category],
  }));

  // ─── Live calculation ───
  const result = useMemo(() => {
    const balance = parseFloat(accountBalance);
    const inst = getInstrument(instrument);
    
    if (!inst) return null;
    if (riskMode === 'percentage' && (isNaN(balance) || balance <= 0)) return null;

    let slPipsValue: number;
    if (slMode === 'pips') {
      slPipsValue = parseFloat(slPips);
    } else {
      const entry = parseFloat(entryPrice);
      const sl = parseFloat(slPrice);
      if (isNaN(entry) || isNaN(sl)) return null;
      slPipsValue = calculatePipsFromPrice(entry, sl, inst.pipSize);
    }

    if (isNaN(slPipsValue) || slPipsValue <= 0) return null;

    let tpPipsValue: number | null = null;
    if (slMode === 'pips') {
      const tp = parseFloat(tpPips);
      if (!isNaN(tp) && tp > 0) tpPipsValue = tp;
    } else {
      const tp = parseFloat(tpPrice);
      const entry = parseFloat(entryPrice);
      if (!isNaN(tp) && !isNaN(entry)) {
        tpPipsValue = calculateTpPips(entry, tp, inst.pipSize);
      }
    }

    return calculateLotSize({
      accountBalance: balance,
      riskMode,
      riskPercentage: parseFloat(riskPercentage) || 0,
      riskAmount: parseFloat(riskAmount) || 0,
      slPips: slPipsValue,
      pipValuePerLot: inst.pipValuePerLot,
      tpPips: tpPipsValue,
    });
  }, [accountBalance, riskMode, riskPercentage, riskAmount, instrument, slMode, slPips, entryPrice, slPrice, tpPips, tpPrice]);

  // ─── Screenshot extraction handler ───
  const handleScreenshotExtracted = (data: ExtractedTradeData) => {
    if (data.entryPrice !== null) {
      setEntryPrice(String(data.entryPrice));
    }
    if (data.slPrice !== null) {
      setSlPrice(String(data.slPrice));
    }
    if (data.tpPrice !== null) {
      setTpPrice(String(data.tpPrice));
    }
    if (data.direction !== null) {
      setDirection(data.direction);
    }
    // Switch to price mode since we have actual prices
    setSlMode('price');
    setShowScreenshotUpload(false);
  };

  return (
    <>
      <section id="calculator" className="-mt-8 relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="bg-canvas rounded-xl shadow-card-float p-6 md:p-8">
            <div className="flex flex-col lg:grid lg:grid-cols-5 gap-8">
              {/* ─── LEFT: Form (3 cols) ─── */}
              <div className="lg:col-span-3 space-y-6">

                {/* Row 1: Account Balance + Account Currency */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Input
                      label="Account Balance"
                      type="text"
                      inputMode="decimal"
                      placeholder="10000"
                      suffix={accountCurrency}
                      value={accountBalance}
                      onChange={(e) => setAccountBalance(e.target.value)}
                    />
                  </div>
                  <Select
                    label="Currency"
                    options={currencyOptions}
                    value={accountCurrency}
                    onChange={(v) => setAccountCurrency(v as AccountCurrency)}
                    searchable={false}
                  />
                </div>

                {/* Row 2: Risk Mode Toggle + Risk Input */}
                <div className="space-y-3">
                  <Toggle
                    options={['Risk %', 'Risk $']}
                    value={riskMode === 'percentage' ? 'Risk %' : 'Risk $'}
                    onChange={(v) => setRiskMode(v === 'Risk %' ? 'percentage' : 'amount')}
                    size="sm"
                  />
                  {riskMode === 'percentage' ? (
                    <Input
                      label="Risk Percentage"
                      type="text"
                      inputMode="decimal"
                      suffix="%"
                      placeholder="1"
                      value={riskPercentage}
                      onChange={(e) => setRiskPercentage(e.target.value)}
                      hint="Percentage of your account balance to risk per trade"
                    />
                  ) : (
                    <Input
                      label="Risk Amount"
                      type="text"
                      inputMode="decimal"
                      suffix={accountCurrency}
                      placeholder="100"
                      value={riskAmount}
                      onChange={(e) => setRiskAmount(e.target.value)}
                      hint="Fixed dollar amount to risk per trade"
                    />
                  )}
                </div>

                {/* Row 3: Instrument Select */}
                <Select
                  label="Instrument"
                  options={instrumentOptions}
                  value={instrument}
                  onChange={setInstrument}
                  placeholder="Search instruments..."
                  searchable
                />

                {/* Row 4: Direction Toggle */}
                <div className="space-y-3">
                  <Toggle
                    options={['Long', 'Short']}
                    value={direction === 'long' ? 'Long' : 'Short'}
                    onChange={(v) => setDirection(v === 'Long' ? 'long' : 'short')}
                    size="sm"
                    activeClassMap={{
                      'Long': 'bg-green-500 text-white shadow-sm',
                      'Short': 'bg-red-500 text-white shadow-sm'
                    }}
                  />
                </div>

                {/* Row 5: SL Mode Toggle + SL Input(s) */}
                <div className="space-y-3">
                  {slMode === 'pips' ? (
                    <Input
                      label="Stop Loss Distance"
                      type="text"
                      inputMode="decimal"
                      placeholder="50"
                      suffix="pips"
                      value={slPips}
                      onChange={(e) => setSlPips(e.target.value)}
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Entry Price"
                        type="text"
                        inputMode="decimal"
                        placeholder="1.08500"
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(e.target.value)}
                      />
                      <Input
                        label="Stop Loss Price"
                        type="text"
                        inputMode="decimal"
                        placeholder="1.08000"
                        value={slPrice}
                        onChange={(e) => setSlPrice(e.target.value)}
                      />
                    </div>
                  )}
                  <Toggle
                    options={['Pips', 'Price']}
                    value={slMode === 'pips' ? 'Pips' : 'Price'}
                    onChange={(v) => setSlMode(v === 'Pips' ? 'pips' : 'price')}
                    size="sm"
                    activeClassMap={{
                      'Pips': 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm',
                      'Price': 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-sm'
                    }}
                  />
                </div>

                {/* Row 6: Take Profit */}
                {slMode === 'pips' ? (
                  <Input
                    label="Take Profit Distance"
                    type="text"
                    inputMode="decimal"
                    placeholder="Optional (e.g. 100)"
                    suffix="pips"
                    hint="Optional - used for Risk:Reward ratio calculation"
                    value={tpPips}
                    onChange={(e) => setTpPips(e.target.value)}
                  />
                ) : (
                  <Input
                    label="Take Profit Price"
                    type="text"
                    inputMode="decimal"
                    placeholder="Optional"
                    hint="Optional - used for Risk:Reward ratio calculation"
                    value={tpPrice}
                    onChange={(e) => setTpPrice(e.target.value)}
                  />
                )}

                {/* Row 7: Screenshot Upload trigger */}
              </div>

              {/* ─── RIGHT: Results (2 cols) ─── */}
              <div className="lg:col-span-2 lg:row-span-2">
                <ResultsPanel
                  result={result}
                  instrumentSymbol={instrument}
                  direction={direction}
                  entryPrice={entryPrice}
                  slPrice={slPrice}
                  tpPrice={tpPrice}
                  riskMode={riskMode}
                  riskPercentage={riskPercentage}
                />
              </div>

              {/* ─── Utilities (Screenshot & Template) ─── */}
              <div className="lg:col-span-3 lg:col-start-1 pt-6 lg:pt-8 border-t border-hairline mt-2 lg:mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-hairline-strong bg-canvas-soft p-4 text-center transition-all hover:border-ink hover:bg-canvas group h-full"
                    onClick={() => setShowScreenshotUpload(true)}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-body group-hover:text-ink">
                      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Upload TV Screenshot
                    </div>
                    <p className="mt-2 text-xs text-mute leading-relaxed">
                      Double-click TV long/short tool for settings box.
                    </p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={saveTemplate}
                    className="flex w-full flex-col items-center justify-center rounded-lg border border-hairline bg-transparent p-4 text-center transition-all hover:bg-canvas-soft-2 hover:border-hairline-strong group h-full"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-body group-hover:text-ink">
                      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      {showSavedMsg ? 'Template Saved!' : 'Save as Template'}
                    </div>
                    <p className="mt-2 text-xs text-mute leading-relaxed">
                      Save current inputs to auto-load on next visit.
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshot Upload Modal */}
      {showScreenshotUpload && (
        <ScreenshotUpload
          onExtracted={handleScreenshotExtracted}
          onClose={() => setShowScreenshotUpload(false)}
        />
      )}
    </>
  );
}
