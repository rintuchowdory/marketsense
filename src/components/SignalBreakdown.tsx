const VERDICT_STYLE: Record<string, string> = {
  BUY: "text-bull border-bull/40 bg-bull/10",
  SELL: "text-bear border-bear/40 bg-bear/10",
  HOLD: "text-accent border-accent/40 bg-accent/10",
};

export default function SignalBreakdown({
  verdict,
  fundamental,
  technical,
  risk,
}: {
  verdict: "BUY" | "SELL" | "HOLD";
  fundamental: string;
  technical: string;
  risk: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-panel p-4">
      <div className="flex items-center gap-2 text-accent text-[11px] font-bold tracking-widest mb-1">
        <span className="w-4 h-[2px] bg-accent inline-block" /> SIGNAL BREAKDOWN
      </div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">Why this signal fired</h3>
          <p className="text-xs text-slate-500">AI verdict from live headlines + technical confluence</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-semibold text-slate-500 tracking-widest mb-1">VERDICT</div>
          <div className={`px-4 py-1.5 rounded-lg border text-lg font-extrabold ${VERDICT_STYLE[verdict]}`}>
            {verdict}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Block title="FUNDAMENTAL TRIGGER" text={fundamental} />
        <Block title="TECHNICAL CONFLUENCE" text={technical} />
        <Block title="RISK & EDUCATIONAL CONTEXT" text={risk} />
      </div>
    </div>
  );
}

function Block({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <div className="text-[11px] font-bold text-slate-400 tracking-wide mb-1">{title}</div>
      <p className="text-sm text-slate-300 leading-relaxed">{text}</p>
    </div>
  );
}
