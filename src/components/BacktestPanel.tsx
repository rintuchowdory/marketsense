import { useMemo } from "react";
import { backtestMaCross, type AssetConfig, type Candle } from "../lib/market";

/**
 * Educational MA(10/20) crossover backtest over the visible chart history.
 * Compares the strategy against passive buy & hold on the same window.
 */
export default function BacktestPanel({ candles, asset }: { candles: Candle[]; asset: AssetConfig }) {
  const result = useMemo(() => backtestMaCross(candles), [candles]);

  const path = useMemo(() => buildPaths(result), [result]);
  const better = result.totalPct >= result.buyHoldPct;
  const pf = result.profitFactor === Infinity ? "∞" : result.profitFactor.toFixed(2);

  return (
    <div className="rounded-xl border border-border bg-panel p-4 mb-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h3 className="text-sm font-bold text-white">
          Strategy Backtest <span className="text-slate-500 font-medium">· MA(10/20) crossover on {asset.label}</span>
        </h3>
        <span className="text-[10px] font-semibold tracking-widest text-slate-500">SIMULATED · NOT FINANCIAL ADVICE</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4">
        {/* Equity curves */}
        <div className="rounded-lg bg-panel2 border border-border p-3">
          <div className="flex items-center gap-4 mb-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <svg width="14" height="8"><line x1="0" y1="4" x2="14" y2="4" stroke="#22c55e" strokeWidth="2" /></svg>
              Strategy
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="14" height="8"><line x1="0" y1="4" x2="14" y2="4" stroke="#64748b" strokeWidth="2" strokeDasharray="3 3" /></svg>
              Buy &amp; Hold
            </span>
          </div>
          <svg viewBox={`0 0 ${path.width} ${path.height}`} className="w-full h-40" preserveAspectRatio="none">
            {/* zero line */}
            <line x1="0" y1={path.zeroY} x2={path.width} y2={path.zeroY} stroke="#1c2432" strokeWidth="1" />
            <polyline points={path.buyHoldPoints} fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" />
            <polyline
              points={path.equityPoints}
              fill="none"
              stroke={better ? "#22c55e" : "#ef4444"}
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 content-start">
          <Stat label="Trades" value={String(result.trades)} />
          <Stat label="Win rate" value={`${result.winRate.toFixed(0)}%`} tone={result.winRate >= 50 ? "bull" : "bear"} />
          <Stat
            label="Strategy P/L"
            value={`${result.totalPct >= 0 ? "+" : ""}${result.totalPct.toFixed(2)}%`}
            tone={result.totalPct >= 0 ? "bull" : "bear"}
          />
          <Stat
            label="Buy & Hold"
            value={`${result.buyHoldPct >= 0 ? "+" : ""}${result.buyHoldPct.toFixed(2)}%`}
            tone={result.buyHoldPct >= 0 ? "bull" : "bear"}
          />
          <Stat label="Profit factor" value={pf} tone={result.profitFactor >= 1 ? "bull" : "bear"} />
          <Stat label="Max drawdown" value={`-${result.maxDrawdownPct.toFixed(1)}%`} tone="bear" />
          <Stat label="Avg win" value={`+${result.avgWinPct.toFixed(2)}%`} tone="bull" />
          <Stat label="Avg loss" value={`${result.avgLossPct.toFixed(2)}%`} tone="bear" />
          <Stat
            label="Best / Worst"
            value={`${result.bestPct >= 0 ? "+" : ""}${result.bestPct.toFixed(1)} / ${result.worstPct.toFixed(1)}%`}
          />
        </div>
      </div>

      <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
        Backtest runs long-only over the {candles.length} candles currently in view: enter at close on a golden cross,
        exit at close on a death cross (or at the last candle). Simulated data — the point is to show how crossover
        strategies behave, not to rate them as advice.
      </p>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "bull" | "bear" }) {
  return (
    <div className="rounded-lg bg-panel2 border border-border px-2.5 py-2">
      <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">{label}</div>
      <div className={`mono text-sm font-bold mt-0.5 ${tone === "bull" ? "text-bull" : tone === "bear" ? "text-bear" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}

function buildPaths(result: ReturnType<typeof backtestMaCross>) {
  const width = 600;
  const height = 160;
  const pad = 8;
  const series = [...result.equity, ...result.buyHold];
  const min = Math.min(100, ...series);
  const max = Math.max(100, ...series);
  const span = Math.max(max - min, 0.01);
  const toPoints = (values: number[]) =>
    values
      .map((v, i) => {
        const x = pad + (i / (values.length - 1)) * (width - 2 * pad);
        const y = pad + (1 - (v - min) / span) * (height - 2 * pad);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  const zeroY = pad + (1 - (100 - min) / span) * (height - 2 * pad);
  return { width, height, zeroY, equityPoints: toPoints(result.equity), buyHoldPoints: toPoints(result.buyHold) };
}
