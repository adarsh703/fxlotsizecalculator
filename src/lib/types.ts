export interface Instrument {
  symbol: string;
  name: string;
  category: InstrumentCategory;
  pipSize: number;
  /** Pip value per standard lot in USD (approximate for cross pairs) */
  quoteCurrency: string;
  contractSize: number;
}

export type InstrumentCategory =
  | 'forex-major'
  | 'forex-minor'
  | 'forex-exotic'
  | 'metals'
  | 'indices'
  | 'crypto'
  | 'futures';

export const CATEGORY_LABELS: Record<InstrumentCategory, string> = {
  'forex-major': 'Forex Majors',
  'forex-minor': 'Forex Minors',
  'forex-exotic': 'Forex Exotics',
  metals: 'Metals',
  indices: 'Indices',
  crypto: 'Crypto',
  futures: 'Futures',
};

export type AccountCurrency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'CHF';

export type RiskMode = 'percentage' | 'amount';

export type SLMode = 'pips' | 'price';

export type TradeDirection = 'long' | 'short';

export interface CalculatorState {
  accountBalance: string;
  accountCurrency: AccountCurrency;
  riskMode: RiskMode;
  riskPercentage: string;
  riskAmount: string;
  instrument: string;
  slMode: SLMode;
  slPips: string;
  entryPrice: string;
  slPrice: string;
  tpPrice: string;
  direction: TradeDirection;
}

export interface CalculationResult {
  standardLots: number;
  miniLots: number;
  microLots: number;
  units: number;
  pipValue: number;
  riskAmount: number;
  slPips: number;
  rrRatio: number | null;
}

export interface ExtractedTradeData {
  entryPrice: number | null;
  slPrice: number | null;
  tpPrice: number | null;
  direction: TradeDirection | null;
  confidence: number;
}
