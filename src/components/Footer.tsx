export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-6 text-center">
      <div className="text-[11px] font-bold text-slate-500 tracking-widest mb-1">EDUCATIONAL USE ONLY</div>
      <p className="text-xs text-slate-500 max-w-3xl mx-auto leading-relaxed">
        MarketSense visualizes market sentiment and signal analysis for learning purposes. Prices and candles come
        from a simulated market feed and may differ from your broker. Nothing here constitutes financial advice or a
        recommendation to buy or sell any security. Always do your own research.
      </p>
    </footer>
  );
}
