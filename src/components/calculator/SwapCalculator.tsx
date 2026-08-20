import { useState, useMemo } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Toggle } from '../ui/Toggle';
import { instruments, getInstrument } from '../../data/instruments';
import { CATEGORY_LABELS, type TradeDirection } from '../../lib/types';

export function SwapCalculator({ initialInstrument = '' }: { initialInstrument?: string }) {
  const [accountCurrency, setAccountCurrency] = useState('USD');
  const [instrument, setInstrument] = useState(initialInstrument);
  const [lotSize, setLotSize] = useState('1');
  const [direction, setDirection] = useState<TradeDirection>('long');
  const [swapLong, setSwapLong] = useState('-5.2');
  const [swapShort, setSwapShort] = useState('1.5');
  const [nights, setNights] = useState('1');

  const currencyOptions = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF'].map((c) => ({
    value: c,
    label: c,
  }));

  const instrumentOptions = instruments.map((inst) => ({
    value: inst.symbol,
    label: `${inst.symbol} - ${inst.name}`,
    group: CATEGORY_LABELS[inst.category],
  }));

  const swapFee = useMemo(() => {
    const inst = getInstrument(instrument);
    if (!inst) return null;

    const lots = parseFloat(lotSize);
    const numNights = parseFloat(nights);
    const swapRate = direction === 'long' ? parseFloat(swapLong) : parseFloat(swapShort);

    if (isNaN(lots) || isNaN(numNights) || isNaN(swapRate)) return null;

    // Standard swap formula based on pip value
    // Swap = (Lots * Swap Rate * Pip Value / 10) * Nights
    // Note: This assumes swap rate is provided in standard broker points.
    const pointValue = inst.pipValuePerLot / 10;
    const fee = lots * swapRate * pointValue * numNights;
    return fee;
  }, [instrument, lotSize, direction, swapLong, swapShort, nights]);

  return (
    <section id="swap-calculator" className="-mt-8 relative z-10">
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
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Swap Long (points)"
                  type="text"
                  inputMode="decimal"
                  placeholder="-5.2"
                  value={swapLong}
                  onChange={(e) => setSwapLong(e.target.value)}
                />
                <Input
                  label="Swap Short (points)"
                  type="text"
                  inputMode="decimal"
                  placeholder="1.5"
                  value={swapShort}
                  onChange={(e) => setSwapShort(e.target.value)}
                />
              </div>
              <Input
                label="Number of Nights"
                type="text"
                inputMode="decimal"
                placeholder="1"
                value={nights}
                onChange={(e) => setNights(e.target.value)}
              />
            </div>

            <div className="bg-canvas-soft rounded-xl p-6 flex flex-col justify-center items-center text-center border border-hairline relative overflow-hidden">
              <h3 className="text-lg font-medium text-body mb-2">Total Swap Fee</h3>
              <div className={`text-4xl md:text-5xl font-bold tracking-tight mb-2 ${swapFee !== null && swapFee > 0 ? 'text-green-500' : swapFee !== null && swapFee < 0 ? 'text-red-500' : 'text-ink'}`}>
                {swapFee !== null ? (
                  <>
                    <span className="text-2xl mr-1">{swapFee > 0 ? '+' : ''}$</span>
                    {swapFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </>
                ) : (
                  <span className="text-3xl text-mute">---</span>
                )}
              </div>
              <p className="text-sm text-mute">
                {swapFee !== null && swapFee < 0 ? 'This amount will be deducted from your account.' : swapFee !== null && swapFee > 0 ? 'This amount will be credited to your account.' : 'Estimated swap fee based on rollover nights.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
