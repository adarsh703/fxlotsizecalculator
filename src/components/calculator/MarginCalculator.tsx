import { useState, useMemo } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { instruments, getInstrument } from '../../data/instruments';
import { CATEGORY_LABELS } from '../../lib/types';

export function MarginCalculator({ initialInstrument = '' }: { initialInstrument?: string }) {
  const [accountCurrency, setAccountCurrency] = useState('USD');
  const [instrument, setInstrument] = useState(initialInstrument);
  const [lotSize, setLotSize] = useState('1');
  const [leverage, setLeverage] = useState('100');
  const [currentPrice, setCurrentPrice] = useState('');

  const currencyOptions = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF'].map((c) => ({
    value: c,
    label: c,
  }));

  const instrumentOptions = instruments.map((inst) => ({
    value: inst.symbol,
    label: `${inst.symbol} - ${inst.name}`,
    group: CATEGORY_LABELS[inst.category],
  }));

  const marginRequired = useMemo(() => {
    const inst = getInstrument(instrument);
    if (!inst) return null;

    const lots = parseFloat(lotSize);
    const lev = parseFloat(leverage);
    const price = parseFloat(currentPrice);

    if (isNaN(lots) || isNaN(lev) || lev <= 0 || isNaN(price) || price <= 0) return null;

    // Basic standard margin formula:
    // Margin = (Lots * Contract Size * Market Price) / Leverage
    // *Note: Real world requires conversion to account currency. This is a simplified proxy.
    const margin = (lots * inst.contractSize * price) / lev;
    return margin;
  }, [instrument, lotSize, leverage, currentPrice]);

  return (
    <section id="margin-calculator" className="-mt-8 relative z-10">
      <div className="max-w-[1000px] mx-auto px-4 md:px-6">
        <div className="bg-canvas rounded-xl shadow-card-float p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Select
                label="Account Currency"
                options={currencyOptions}
                value={accountCurrency}
                onChange={setAccountCurrency}
                searchable={false}
              />
              <Select
                label="Instrument"
                options={instrumentOptions}
                value={instrument}
                onChange={setInstrument}
                placeholder="Select instrument..."
                searchable
              />
              <Input
                label="Trade Size (Lots)"
                type="text"
                inputMode="decimal"
                placeholder="1.0"
                value={lotSize}
                onChange={(e) => setLotSize(e.target.value)}
              />
              <Input
                label="Leverage (1:X)"
                type="text"
                inputMode="decimal"
                placeholder="100"
                value={leverage}
                onChange={(e) => setLeverage(e.target.value)}
                hint="Example: Enter 100 for 1:100 leverage"
              />
              <Input
                label="Current Market Price"
                type="text"
                inputMode="decimal"
                placeholder="1.0500"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
              />
            </div>

            <div className="bg-canvas-soft rounded-xl p-6 flex flex-col justify-center items-center text-center border border-hairline relative overflow-hidden">
              <h3 className="text-lg font-medium text-body mb-2">Required Margin</h3>
              <div className="text-4xl md:text-5xl font-bold text-ink tracking-tight mb-2">
                {marginRequired !== null ? (
                  <>
                    <span className="text-2xl mr-1 text-mute">$</span>
                    {marginRequired.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </>
                ) : (
                  <span className="text-3xl text-mute">---</span>
                )}
              </div>
              <p className="text-sm text-mute">Estimated margin needed to open this position.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
