import type { AssetConfig } from "../lib/market";
import { fmtPrice } from "../lib/market";

interface TickerData {
  asset: AssetConfig;
  price: number;
  change: number;
}

export default function TickerTape({ data }: { data: TickerData[] }) {
  const items = [...data, ...data, ...data];
  return (
    <div className="w-full border-b border-border bg-panel2 overflow-hidden">
      <div className="flex w-max animate-marquee py-2">
        {items.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-5 text-xs font-semibold whitespace-nowrap border-r border-border/60"
          >
            <span className="text-slate-300">{t.asset.label}</span>
            <span className="mono text-white">${fmtPrice(t.price, t.asset.decimals)}</span>
            <span className={t.change >= 0 ? "text-bull" : "text-bear"}>
              {t.change >= 0 ? "+" : ""}
              {t.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
