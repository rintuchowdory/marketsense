import { useEffect, useMemo, useState } from "react";
import { ASSETS, generateHistory, type AssetSymbol, type Candle } from "../lib/market";

const REFRESH_SECONDS = 20;

export function useMarketData(selectedSymbol: AssetSymbol, timeframe: string) {
  const [tick, setTick] = useState(0);
  const [countdown, setCountdown] = useState(REFRESH_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setTick((t) => t + 1);
          return REFRESH_SECONDS;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live 1D history per asset (for header cards + sparklines), re-derived on each refresh tick
  const liveHistories = useMemo(() => {
    const map = new Map<AssetSymbol, Candle[]>();
    for (const asset of ASSETS) {
      map.set(asset.symbol, jitter(generateHistory(asset, "1D", 40), tick, asset.symbol));
    }
    return map;
  }, [tick]);

  // History for the chart panel, driven by selected asset + timeframe
  const chartHistory = useMemo(() => {
    const asset = ASSETS.find((a) => a.symbol === selectedSymbol)!;
    return jitter(generateHistory(asset, timeframe, 160), tick, asset.symbol + timeframe);
  }, [selectedSymbol, timeframe, tick]);

  return { liveHistories, chartHistory, countdown };
}

// Nudges the last close by a small deterministic-per-tick amount so numbers move on refresh
// without needing a network call, echoing the "auto refresh" behavior of the original app.
function jitter(candles: Candle[], tick: number, seed: string): Candle[] {
  if (candles.length === 0 || tick === 0) return candles;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i) + tick * 7) >>> 0;
  const rand = (h % 2000) / 100000 - 0.01; // +/-1%
  const copy = candles.slice();
  const last = copy[copy.length - 1];
  const newClose = Math.max(0.01, last.close * (1 + rand));
  copy[copy.length - 1] = {
    ...last,
    close: newClose,
    high: Math.max(last.high, newClose),
    low: Math.min(last.low, newClose),
  };
  return copy;
}
