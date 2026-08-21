import type { Instrument, InstrumentCategory } from '../lib/types';

export const instruments: Instrument[] = [
  // ─── Forex Majors ───
  { symbol: 'EURUSD', name: 'Euro / US Dollar', category: 'forex-major', pipSize: 0.0001, quoteCurrency: 'USD', contractSize: 100000 },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', category: 'forex-major', pipSize: 0.0001, quoteCurrency: 'USD', contractSize: 100000 },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', category: 'forex-major', pipSize: 0.01, quoteCurrency: 'JPY', contractSize: 100000 },
  { symbol: 'USDCHF', name: 'US Dollar / Swiss Franc', category: 'forex-major', pipSize: 0.0001, quoteCurrency: 'CHF', contractSize: 100000 },
  { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', category: 'forex-major', pipSize: 0.0001, quoteCurrency: 'USD', contractSize: 100000 },
  { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', category: 'forex-major', pipSize: 0.0001, quoteCurrency: 'CAD', contractSize: 100000 },
  { symbol: 'NZDUSD', name: 'New Zealand Dollar / US Dollar', category: 'forex-major', pipSize: 0.0001, quoteCurrency: 'USD', contractSize: 100000 },

  // ─── Forex Minors ───
  { symbol: 'EURGBP', name: 'Euro / British Pound', category: 'forex-minor', pipSize: 0.0001, quoteCurrency: 'GBP', contractSize: 100000 },
  { symbol: 'EURJPY', name: 'Euro / Japanese Yen', category: 'forex-minor', pipSize: 0.01, quoteCurrency: 'JPY', contractSize: 100000 },
  { symbol: 'GBPJPY', name: 'British Pound / Japanese Yen', category: 'forex-minor', pipSize: 0.01, quoteCurrency: 'JPY', contractSize: 100000 },
  { symbol: 'EURAUD', name: 'Euro / Australian Dollar', category: 'forex-minor', pipSize: 0.0001, quoteCurrency: 'AUD', contractSize: 100000 },
  { symbol: 'EURCAD', name: 'Euro / Canadian Dollar', category: 'forex-minor', pipSize: 0.0001, quoteCurrency: 'CAD', contractSize: 100000 },
  { symbol: 'EURCHF', name: 'Euro / Swiss Franc', category: 'forex-minor', pipSize: 0.0001, quoteCurrency: 'CHF', contractSize: 100000 },
  { symbol: 'GBPAUD', name: 'British Pound / Australian Dollar', category: 'forex-minor', pipSize: 0.0001, quoteCurrency: 'AUD', contractSize: 100000 },
  { symbol: 'GBPCAD', name: 'British Pound / Canadian Dollar', category: 'forex-minor', pipSize: 0.0001, quoteCurrency: 'CAD', contractSize: 100000 },
  { symbol: 'GBPCHF', name: 'British Pound / Swiss Franc', category: 'forex-minor', pipSize: 0.0001, quoteCurrency: 'CHF', contractSize: 100000 },
  { symbol: 'AUDCAD', name: 'Australian Dollar / Canadian Dollar', category: 'forex-minor', pipSize: 0.0001, quoteCurrency: 'CAD', contractSize: 100000 },
  { symbol: 'AUDCHF', name: 'Australian Dollar / Swiss Franc', category: 'forex-minor', pipSize: 0.0001, quoteCurrency: 'CHF', contractSize: 100000 },
  { symbol: 'AUDJPY', name: 'Australian Dollar / Japanese Yen', category: 'forex-minor', pipSize: 0.01, quoteCurrency: 'JPY', contractSize: 100000 },
  { symbol: 'AUDNZD', name: 'Australian Dollar / New Zealand Dollar', category: 'forex-minor', pipSize: 0.0001, quoteCurrency: 'NZD', contractSize: 100000 },
  { symbol: 'NZDJPY', name: 'New Zealand Dollar / Japanese Yen', category: 'forex-minor', pipSize: 0.01, quoteCurrency: 'JPY', contractSize: 100000 },
  { symbol: 'NZDCAD', name: 'New Zealand Dollar / Canadian Dollar', category: 'forex-minor', pipSize: 0.0001, quoteCurrency: 'CAD', contractSize: 100000 },
  { symbol: 'CADJPY', name: 'Canadian Dollar / Japanese Yen', category: 'forex-minor', pipSize: 0.01, quoteCurrency: 'JPY', contractSize: 100000 },
  { symbol: 'CADCHF', name: 'Canadian Dollar / Swiss Franc', category: 'forex-minor', pipSize: 0.0001, quoteCurrency: 'CHF', contractSize: 100000 },
  { symbol: 'CHFJPY', name: 'Swiss Franc / Japanese Yen', category: 'forex-minor', pipSize: 0.01, quoteCurrency: 'JPY', contractSize: 100000 },

  // ─── Forex Exotics ───
  { symbol: 'USDMXN', name: 'US Dollar / Mexican Peso', category: 'forex-exotic', pipSize: 0.0001, quoteCurrency: 'MXN', contractSize: 100000 },
  { symbol: 'USDZAR', name: 'US Dollar / South African Rand', category: 'forex-exotic', pipSize: 0.0001, quoteCurrency: 'ZAR', contractSize: 100000 },
  { symbol: 'USDTRY', name: 'US Dollar / Turkish Lira', category: 'forex-exotic', pipSize: 0.0001, quoteCurrency: 'TRY', contractSize: 100000 },
  { symbol: 'USDSGD', name: 'US Dollar / Singapore Dollar', category: 'forex-exotic', pipSize: 0.0001, quoteCurrency: 'SGD', contractSize: 100000 },
  { symbol: 'USDHKD', name: 'US Dollar / Hong Kong Dollar', category: 'forex-exotic', pipSize: 0.0001, quoteCurrency: 'HKD', contractSize: 100000 },
  { symbol: 'USDNOK', name: 'US Dollar / Norwegian Krone', category: 'forex-exotic', pipSize: 0.0001, quoteCurrency: 'NOK', contractSize: 100000 },

  // ─── Metals ───
  { symbol: 'XAUUSD', name: 'Gold / US Dollar', category: 'metals', pipSize: 0.01, quoteCurrency: 'USD', contractSize: 100 },
  { symbol: 'XAGUSD', name: 'Silver / US Dollar', category: 'metals', pipSize: 0.001, quoteCurrency: 'USD', contractSize: 5000 },
  { symbol: 'XPTUSD', name: 'Platinum / US Dollar', category: 'metals', pipSize: 0.01, quoteCurrency: 'USD', contractSize: 100 },

  // ─── Indices ───
  { symbol: 'US30', name: 'Dow Jones Industrial Average', category: 'indices', pipSize: 1, quoteCurrency: 'USD', contractSize: 1 },
  { symbol: 'US100', name: 'NASDAQ 100', category: 'indices', pipSize: 1, quoteCurrency: 'USD', contractSize: 1 },
  { symbol: 'US500', name: 'S&P 500', category: 'indices', pipSize: 1, quoteCurrency: 'USD', contractSize: 1 },
  { symbol: 'GER40', name: 'DAX 40', category: 'indices', pipSize: 1, quoteCurrency: 'EUR', contractSize: 1 },
  { symbol: 'UK100', name: 'FTSE 100', category: 'indices', pipSize: 1, quoteCurrency: 'GBP', contractSize: 1 },
  { symbol: 'JPN225', name: 'Nikkei 225', category: 'indices', pipSize: 1, quoteCurrency: 'JPY', contractSize: 100 },

  // ─── Crypto ───
  { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', category: 'crypto', pipSize: 1, quoteCurrency: 'USD', contractSize: 1 },
  { symbol: 'ETHUSD', name: 'Ethereum / US Dollar', category: 'crypto', pipSize: 0.1, quoteCurrency: 'USD', contractSize: 1 },
  { symbol: 'LTCUSD', name: 'Litecoin / US Dollar', category: 'crypto', pipSize: 0.01, quoteCurrency: 'USD', contractSize: 1 },
  { symbol: 'XRPUSD', name: 'Ripple / US Dollar', category: 'crypto', pipSize: 0.0001, quoteCurrency: 'USD', contractSize: 1 },

  // ─── Futures ───
  { symbol: 'USOIL', name: 'WTI Crude Oil', category: 'futures', pipSize: 0.01, quoteCurrency: 'USD', contractSize: 1000 },
  { symbol: 'UKOIL', name: 'Brent Crude Oil', category: 'futures', pipSize: 0.01, quoteCurrency: 'USD', contractSize: 1000 },
  { symbol: 'NGAS', name: 'Natural Gas', category: 'futures', pipSize: 0.001, quoteCurrency: 'USD', contractSize: 10000 },
  { symbol: 'VIX', name: 'Volatility Index', category: 'futures', pipSize: 0.01, quoteCurrency: 'USD', contractSize: 1000 },
  { symbol: 'ES', name: 'E-mini S&P 500', category: 'futures', pipSize: 0.25, quoteCurrency: 'USD', contractSize: 50 },
  { symbol: 'NQ', name: 'E-mini NASDAQ 100', category: 'futures', pipSize: 0.25, quoteCurrency: 'USD', contractSize: 20 },
  { symbol: 'YM', name: 'E-mini Dow', category: 'futures', pipSize: 1, quoteCurrency: 'USD', contractSize: 5 },
  { symbol: 'RTY', name: 'E-mini Russell 2000', category: 'futures', pipSize: 0.1, quoteCurrency: 'USD', contractSize: 50 },
  { symbol: 'GC', name: 'Gold Futures', category: 'futures', pipSize: 0.1, quoteCurrency: 'USD', contractSize: 100 },
  { symbol: 'SI', name: 'Silver Futures', category: 'futures', pipSize: 0.005, quoteCurrency: 'USD', contractSize: 5000 },
  { symbol: 'HG', name: 'Copper Futures', category: 'futures', pipSize: 0.0005, quoteCurrency: 'USD', contractSize: 25000 },
  { symbol: 'ZC', name: 'Corn Futures', category: 'futures', pipSize: 0.25, quoteCurrency: 'USD', contractSize: 5000 },
  { symbol: 'ZW', name: 'Wheat Futures', category: 'futures', pipSize: 0.25, quoteCurrency: 'USD', contractSize: 5000 },
  { symbol: 'ZS', name: 'Soybean Futures', category: 'futures', pipSize: 0.25, quoteCurrency: 'USD', contractSize: 5000 },
  { symbol: 'ZN', name: '10-Year T-Note', category: 'futures', pipSize: 0.015625, quoteCurrency: 'USD', contractSize: 1000 },
  { symbol: 'ZB', name: 'U.S. Treasury Bond', category: 'futures', pipSize: 0.03125, quoteCurrency: 'USD', contractSize: 1000 },
  { symbol: 'DXY', name: 'U.S. Dollar Index', category: 'futures', pipSize: 0.005, quoteCurrency: 'USD', contractSize: 1000 },
  { symbol: 'SIL', name: 'Micro Silver', category: 'futures', pipSize: 0.001, quoteCurrency: 'USD', contractSize: 1000 },
  { symbol: 'MGC', name: 'Micro Gold', category: 'futures', pipSize: 0.1, quoteCurrency: 'USD', contractSize: 10 },
  { symbol: 'MHG', name: 'Micro Copper', category: 'futures', pipSize: 0.0005, quoteCurrency: 'USD', contractSize: 2500 },
  { symbol: 'MCL', name: 'Micro Crude Oil', category: 'futures', pipSize: 0.01, quoteCurrency: 'USD', contractSize: 100 },
  { symbol: 'PL', name: 'Platinum', category: 'futures', pipSize: 0.1, quoteCurrency: 'USD', contractSize: 50 },
  { symbol: 'MNQ', name: 'Micro E-mini NASDAQ', category: 'futures', pipSize: 0.25, quoteCurrency: 'USD', contractSize: 2 },
  { symbol: 'MES', name: 'Micro E-mini S&P 500', category: 'futures', pipSize: 0.25, quoteCurrency: 'USD', contractSize: 5 },
  { symbol: '6E', name: 'Euro FX', category: 'futures', pipSize: 0.0001, quoteCurrency: 'USD', contractSize: 125000 },
];

export function getInstrument(symbol: string): Instrument | undefined {
  return instruments.find((i) => i.symbol === symbol);
}

export function getInstrumentsByCategory(): Map<InstrumentCategory, Instrument[]> {
  const map = new Map<InstrumentCategory, Instrument[]>();
  for (const instrument of instruments) {
    if (!map.has(instrument.category)) {
      map.set(instrument.category, []);
    }
    map.get(instrument.category)!.push(instrument);
  }
  return map;
}
