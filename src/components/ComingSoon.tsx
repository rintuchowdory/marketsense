export default function ComingSoon({ tab }: { tab: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-2xl font-extrabold text-white mb-2">{tab}</div>
      <p className="text-slate-500 max-w-md">
        This section is a placeholder in this open-source clone — wire it up to real data or your own logic. The
        Dashboard tab has the full MarketSense experience.
      </p>
    </div>
  );
}
