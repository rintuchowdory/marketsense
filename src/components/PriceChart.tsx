import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  AreaSeries,
  type IChartApi,
  type ISeriesApi,
} from "lightweight-charts";
import type { Candle, Signal } from "../lib/market";

const TIMEFRAMES = ["15m", "1H", "4H", "1D", "1M"];

export default function PriceChart({
  candles,
  signals,
  timeframe,
  onTimeframe,
}: {
  candles: Candle[];
  signals: Signal[];
  timeframe: string;
  onTimeframe: (tf: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick" | "Area"> | null>(null);
  const [mode, setMode] = useState<"area" | "candles">("area");

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#8b95a7",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.04)" },
        horzLines: { color: "rgba(255,255,255,0.04)" },
      },
      rightPriceScale: { borderColor: "#1c2432" },
      timeScale: { borderColor: "#1c2432", timeVisible: true },
      crosshair: { mode: 0 },
      autoSize: true,
    });
    chartRef.current = chart;
    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    if (seriesRef.current) {
      chart.removeSeries(seriesRef.current);
      seriesRef.current = null;
    }

    if (mode === "candles") {
      const series = chart.addSeries(CandlestickSeries, {
        upColor: "#22c55e",
        downColor: "#ef4444",
        borderVisible: false,
        wickUpColor: "#22c55e",
        wickDownColor: "#ef4444",
      });
      series.setData(
        candles.map((c) => ({ time: c.time as any, open: c.open, high: c.high, low: c.low, close: c.close }))
      );
      seriesRef.current = series;
    } else {
      const series = chart.addSeries(AreaSeries, {
        lineColor: "#f7941d",
        topColor: "rgba(247,148,29,0.35)",
        bottomColor: "rgba(247,148,29,0.02)",
        lineWidth: 2,
      });
      series.setData(candles.map((c) => ({ time: c.time as any, value: c.close })));
      seriesRef.current = series;
    }

    const markers = signals.map((s) => ({
      time: s.time as any,
      position: s.type === "buy" ? ("belowBar" as const) : ("aboveBar" as const),
      color: s.type === "buy" ? "#22c55e" : "#ef4444",
      shape: s.type === "buy" ? ("arrowUp" as const) : ("arrowDown" as const),
      text: s.type === "buy" ? "BUY" : "SELL",
    }));
    // markers plugin API varies by version; attach via series if available
    // @ts-ignore
    if (seriesRef.current && (seriesRef.current as any).setMarkers) {
      (seriesRef.current as any).setMarkers(markers);
    }

    chart.timeScale().fitContent();
  }, [candles, signals, mode]);

  return (
    <div className="rounded-xl border border-border bg-panel p-4 flex flex-col h-full">
      <div className="flex items-center gap-2 text-accent text-[11px] font-bold tracking-widest mb-1">
        <span className="w-4 h-[2px] bg-accent inline-block" /> PRICE ACTION
      </div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        <h3 className="text-lg font-bold text-white">Price &amp; Signal Chart</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-panel2 rounded-full p-1 border border-border">
            {(["area", "candles"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  mode === m ? "bg-accent text-black" : "text-slate-400"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="flex bg-panel2 rounded-full p-1 border border-border">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframe(tf)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  timeframe === tf ? "bg-accent text-black" : "text-slate-400"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 text-[11px] text-slate-500 font-semibold mb-2">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-[2px] bg-accent inline-block" /> PRICE
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-bull inline-block" /> BUY SIGNAL
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-bear inline-block" /> SELL SIGNAL
        </span>
        <span className="ml-auto text-slate-600">Scroll to zoom · drag to pan</span>
      </div>
      <div ref={containerRef} className="flex-1 min-h-[280px]" />
    </div>
  );
}
