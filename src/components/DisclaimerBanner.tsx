import { TriangleAlert } from "lucide-react";

export default function DisclaimerBanner() {
  return (
    <div className="w-full bg-accent/10 border-b border-accent/30 text-accent text-[11px] sm:text-xs font-medium py-2 px-4 flex items-center justify-center gap-2 text-center">
      <TriangleAlert size={13} className="shrink-0" />
      <span>
        For Educational &amp; Visual Simulation Purposes Only — not financial advice, no real trades are placed
      </span>
    </div>
  );
}
