export default function SentimentGauge({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  const angle = -90 + (clamped / 100) * 180; // -90..90 degrees
  const label = clamped > 60 ? "BULLISH" : clamped < 40 ? "BEARISH" : "NEUTRAL";
  const labelColor = clamped > 60 ? "text-bull" : clamped < 40 ? "text-bear" : "text-accent";

  const cx = 110;
  const cy = 110;
  const r = 88;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const needleX = cx + r * 0.8 * Math.cos(rad(angle - 90));
  const needleY = cy + r * 0.8 * Math.sin(rad(angle - 90));

  return (
    <div className="rounded-xl border border-border bg-panel p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 text-accent text-[11px] font-bold tracking-widest mb-4">
        <span className="w-4 h-[2px] bg-accent inline-block" /> SENTIMENT METER
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <svg width="220" height="130" viewBox="0 0 220 120">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f7941d" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="#1c2432"
            strokeWidth={14}
            strokeLinecap="round"
          />
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={`${(clamped / 100) * Math.PI * r} ${Math.PI * r}`}
          />
          <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke="#f7941d" strokeWidth={3} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={5} fill="#f7941d" />
          <text x={cx - r} y={cy + 18} fontSize={10} fill="#8b95a7" textAnchor="start">
            0%
          </text>
          <text x={cx + r} y={cy + 18} fontSize={10} fill="#8b95a7" textAnchor="end">
            100%
          </text>
        </svg>
        <div className="text-center -mt-2">
          <div className="mono text-3xl font-extrabold text-accent">{Math.round(clamped)}%</div>
          <div className={`text-sm font-bold ${labelColor}`}>{label}</div>
        </div>
      </div>
      <div className="text-center text-[11px] text-slate-500 mt-2">
        Extreme Bearish · Neutral · Extreme Bullish
      </div>
    </div>
  );
}
