import type { AssetConfig } from "../lib/market";
import { fmtPrice } from "../lib/market";

export default function MainAssetPanel({
  asset,
  price,
  change,
  rsiValue,
  ma20,
  ma50,
}: {
  asset: AssetConfig;
  price: number;
  change: number;
  rsiValue: number;
  ma20: number;
  ma50: number;
}) {
  const positive = change >= 0;
  const cross: "Golden" | "Death" = ma20 >= ma50 ? "Golden" : "Death";
  const rsiZone = rsiValue > 70 ? "Overbought" : rsiValue < 30 ? "Oversold" : "Neutral zone";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-3 mb-4">
      <div className="rounded-xl border border-border bg-panel p-4 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
          <div className="w-6 h-6 rounded-full bg-accent/15 text-accent flex items-center justify-center text-[11px] font-bold">
            {asset.icon}
          </div>
          {asset.label}
          <span className="text-slate-600">{asset.name}</span>
        </div>
        <div className="flex items-end gap-3">
          <span className="mono text-3xl font-extrabold text-white">${fmtPrice(price, asset.decimals)}</span>
          <span className={`mb-1 text-xs font-bold px-2 py-1 rounded-md ${positive ? "text-bull bg-bull/10" : "text-bear bg-bear/10"}`}>
            {positive ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%{" "}
            <span className="text-slate-500 font-medium">24H</span>
          </span>
        </div>
      </div>

      <StatTile
        label="RSI (14)"
        value={rsiValue.toFixed(1)}
        sub={rsiZone}
        subColor={rsiValue > 70 ? "text-bear" : rsiValue < 30 ? "text-bull" : "text-slate-500"}
      />
      <StatTile label="MA 20" value={`$${fmtPrice(ma20, asset.decimals)}`} sub="" />
      <StatTile label="MA 50" value={`$${fmtPrice(ma50, asset.decimals)}`} sub="" />
      <StatTile
        label="MA CROSS"
        value={cross}
        valueColor={cross === "Golden" ? "text-bull" : "text-bear"}
        sub={cross === "Golden" ? "MA20 above MA50" : "MA20 below MA50"}
      />
    </div>
  );
}

function StatTile({
  label,
  value,
  sub,
  subColor,
  valueColor,
}: {
  label: string;
  value: string;
  sub: string;
  subColor?: string;
  valueColor?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-panel p-4 flex flex-col justify-center gap-1.5">
      <span className="text-[11px] font-semibold text-slate-500 tracking-wide">{label}</span>
      <span className={`mono text-xl font-bold ${valueColor ?? "text-white"}`}>{value}</span>
      {sub && <span className={`text-[11px] font-medium ${subColor ?? "text-slate-500"}`}>{sub}</span>}
    </div>
  );
}
