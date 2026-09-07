const TABS = ["Dashboard", "Research", "Strategies", "Backtest", "Paper Trading", "Portfolio"];

export default function Header({
  active,
  onChange,
}: {
  active: string;
  onChange: (tab: string) => void;
}) {
  return (
    <header className="w-full border-b border-border bg-bg px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-extrabold tracking-tight text-white">MarketSense</span>
          <span className="text-[10px] font-semibold tracking-widest text-slate-500">AI TRADING OS</span>
        </div>
      </div>
      <nav className="flex items-center gap-1 bg-panel rounded-full p-1 border border-border overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              active === tab
                ? "bg-accent text-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </header>
  );
}
