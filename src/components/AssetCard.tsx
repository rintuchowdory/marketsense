import type { AssetConfig } from "../lib/market";
import { fmtPrice } from "../lib/market";
import Sparkline from "./Sparkline";

export default function AssetCard({
  asset,
  price,
  change,
  spark,
  selected,
  onClick,
}: {
  asset: AssetConfig;
  price: number;
  change: number;
  spark: number[];
  selected: boolean;
  onClick: () => void;
}) {
  const positive = change >= 0;
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-xl border p-4 bg-panel transition-all ${
        selected ? "border-accent shadow-[0_0_0_1px_rgba(247,148,29,0.5),0_0_24px_rgba(247,148,29,0.15)]" : "border-border hover:border-slate-600"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center text-sm font-bold">
            {asset.icon}
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-white">{asset.label}</div>
            <div className="text-[11px] text-slate-500">{asset.name}</div>
          </div>
        </div>
        <Sparkline values={spark} positive={positive} />
      </div>
      <div className="flex items-baseline justify-between">
        <span className="mono text-xl font-bold text-white">${fmtPrice(price, asset.decimals)}</span>
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${positive ? "text-bull bg-bull/10" : "text-bear bg-bear/10"}`}>
          {positive ? "+" : ""}
          {change.toFixed(2)}%
        </span>
      </div>
    </button>
  );
}
