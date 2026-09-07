export default function StatusBar({ countdown }: { countdown: number }) {
  const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="flex items-center justify-end gap-4 px-4 sm:px-6 py-3 text-xs">
      <div className="flex items-center gap-2 text-slate-400">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bull opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-bull" />
        </span>
        <span className="font-semibold text-slate-300">Live Market Feed</span>
        <span className="mono text-slate-500">{time}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full border-2 border-accent flex items-center justify-center text-[11px] font-bold text-accent">
          {countdown}
        </div>
        <span className="text-[10px] font-semibold tracking-widest text-slate-500 leading-tight">
          AUTO
          <br />
          REFRESH
        </span>
      </div>
    </div>
  );
}
