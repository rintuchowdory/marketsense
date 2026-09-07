// Simulated "delayed public market feed" engine — same spirit as the original
// MarketSense demo: educational simulation, not real trading data.

export type AssetSymbol = "BTCUSD" | "XAUUSD" | "AAPL" | "US30";

export interface AssetConfig {
  symbol: AssetSymbol;
  label: string;
  name: string;
  icon: string; // short glyph shown in the avatar circle
  basePrice: number;
  volatility: number; // % stddev per tick
  decimals: number;
}

export const ASSETS: AssetConfig[] = [
  { symbol: "BTCUSD", label: "BTC/USD", name: "Bitcoin", icon: "₿", basePrice: 79214, volatility: 0.006, decimals: 0 },
  { symbol: "XAUUSD", label: "XAU/USD", name: "Gold", icon: "Au", basePrice: 4405, volatility: 0.002, decimals: 0 },
  { symbol: "AAPL", label: "AAPL", name: "Apple Inc.", icon: "A", basePrice: 319.97, volatility: 0.003, decimals: 2 },
  { symbol: "US30", label: "US30", name: "Dow Jones", icon: "DJ", basePrice: 53000, volatility: 0.002, decimals: 0 },
];

export interface Candle {
  time: number; // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
}

// Deterministic-ish PRNG so charts look stable within a session but differ per symbol
function makeRng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function seedFromSymbol(symbol: string) {
  let h = 0;
  for (let i = 0; i < symbol.length; i++) h = (h * 31 + symbol.charCodeAt(i)) >>> 0;
  return h || 1;
}

const TIMEFRAME_SECONDS: Record<string, number> = {
  "15m": 15 * 60,
  "1H": 60 * 60,
  "4H": 4 * 60 * 60,
  "1D": 24 * 60 * 60,
  "1M": 30 * 24 * 60 * 60,
};

export function generateHistory(asset: AssetConfig, timeframe: string, points = 180): Candle[] {
  const rng = makeRng(seedFromSymbol(asset.symbol + timeframe));
  const stepSeconds = TIMEFRAME_SECONDS[timeframe] ?? TIMEFRAME_SECONDS["1D"];
  const now = Math.floor(Date.now() / 1000);
  const candles: Candle[] = [];

  // Start further back in the past and random-walk toward the current base price
  let price = asset.basePrice * (1 - (asset.volatility * 12));
  const drift = Math.pow(asset.basePrice / price, 1 / points) - 1;

  for (let i = points - 1; i >= 0; i--) {
    const time = now - i * stepSeconds;
    const shock = (rng() - 0.5) * 2 * asset.volatility;
    const open = price;
    price = Math.max(0.01, price * (1 + drift + shock));
    const close = price;
    const high = Math.max(open, close) * (1 + rng() * asset.volatility * 0.6);
    const low = Math.min(open, close) * (1 - rng() * asset.volatility * 0.6);
    candles.push({ time, open, high, low, close });
  }
  // force last candle close to exactly basePrice for consistency with header cards
  candles[candles.length - 1].close = asset.basePrice;
  return candles;
}

export function rsi(candles: Candle[], period = 14): number {
  if (candles.length < period + 1) return 50;
  const closes = candles.map((c) => c.close);
  let gains = 0;
  let losses = 0;
  const slice = closes.slice(-period - 1);
  for (let i = 1; i < slice.length; i++) {
    const diff = slice[i] - slice[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

export function sma(candles: Candle[], period: number): number {
  const closes = candles.map((c) => c.close);
  const slice = closes.slice(-period);
  if (slice.length === 0) return 0;
  return slice.reduce((a, b) => a + b, 0) / slice.length;
}

export interface Signal {
  time: number;
  price: number;
  type: "buy" | "sell";
}

export function detectSignals(candles: Candle[]): Signal[] {
  const signals: Signal[] = [];
  for (let i = 20; i < candles.length; i++) {
    const window = candles.slice(0, i + 1);
    const fast = sma(window, 10);
    const slow = sma(window, 20);
    const prevWindow = candles.slice(0, i);
    const prevFast = sma(prevWindow, 10);
    const prevSlow = sma(prevWindow, 20);
    if (prevFast <= prevSlow && fast > slow) {
      signals.push({ time: candles[i].time, price: candles[i].close, type: "buy" });
    } else if (prevFast >= prevSlow && fast < slow) {
      signals.push({ time: candles[i].time, price: candles[i].close, type: "sell" });
    }
  }
  return signals.slice(-6);
}

export function pctChange(candles: Candle[]): number {
  if (candles.length < 2) return 0;
  const first = candles[0].open;
  const last = candles[candles.length - 1].close;
  return ((last - first) / first) * 100;
}

export function fmtPrice(value: number, decimals: number): string {
  return value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function verdictFromState(rsiValue: number, cross: "golden" | "death", sentiment: number): "BUY" | "SELL" | "HOLD" {
  let score = 0;
  if (rsiValue > 60) score += 1;
  if (rsiValue < 40) score -= 1;
  if (cross === "golden") score += 1;
  else score -= 1;
  if (sentiment > 60) score += 1;
  if (sentiment < 40) score -= 1;
  if (score >= 2) return "BUY";
  if (score <= -2) return "SELL";
  return "HOLD";
}
