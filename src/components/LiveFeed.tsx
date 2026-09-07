import { useState } from "react";
import { NEWS_FEED, NEWS_SOURCES, timeAgo } from "../lib/news";

const SENTIMENT_STYLE: Record<string, string> = {
  BULLISH: "text-bull bg-bull/10",
  BEARISH: "text-bear bg-bear/10",
  NEUTRAL: "text-accent bg-accent/10",
};

export default function LiveFeed() {
  const [source, setSource] = useState("All");
  const items = source === "All" ? NEWS_FEED : NEWS_FEED.filter((n) => n.source === source);

  return (
    <div className="rounded-xl border border-border bg-panel p-4">
      <div className="flex items-center gap-2 text-accent text-[11px] font-bold tracking-widest mb-1">
        <span className="w-4 h-[2px] bg-accent inline-block" /> LIVE FEED
      </div>
      <h3 className="text-lg font-bold text-white mb-3">News &amp; Social</h3>
      <div className="flex gap-2 overflow-x-auto pb-3 mb-2">
        {NEWS_SOURCES.map((s) => (
          <button
            key={s}
            onClick={() => setSource(s)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border ${
              source === s ? "bg-accent text-black border-accent" : "text-slate-400 border-border hover:border-slate-600"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {items.map((n) => (
          <div key={n.id} className="border-b border-border/60 pb-3 last:border-0">
            <div className="flex items-center gap-2 mb-1.5 text-xs">
              {n.kind === "social" ? (
                <span className="w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center font-bold text-[10px]">
                  {n.source[0]}
                </span>
              ) : null}
              <span className="font-semibold text-slate-300">{n.source}</span>
              {n.handle && <span className="text-slate-600">{n.handle}</span>}
              <span className="text-slate-600">· {timeAgo(n.hoursAgo)}</span>
              <span className={`ml-auto px-2 py-0.5 rounded font-bold text-[10px] ${SENTIMENT_STYLE[n.sentiment]}`}>
                {n.sentiment}
              </span>
            </div>
            <p className="text-sm text-slate-200 leading-snug">{n.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
