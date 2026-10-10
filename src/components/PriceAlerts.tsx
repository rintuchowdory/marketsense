import { useMemo, useState } from "react";
import { Bell, BellRing, Plus, Trash2 } from "lucide-react";
import { fmtPrice, type AssetConfig } from "../lib/market";

interface Alert {
  id: string;
  symbol: string;
  direction: "above" | "below";
  target: number;
  createdAt: number;
  triggeredAt: number | null;
}

const STORAGE_KEY = "marketsense:alerts";

function loadAlerts(): Alert[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Alert[]) : [];
  } catch {
    return [];
  }
}

function saveAlerts(alerts: Alert[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  } catch {
    // storage unavailable — alerts just won't persist
  }
}

/**
 * Simulated price alerts: arm a threshold for any asset and the live feed
 * marks it triggered when the simulated price crosses. Persisted locally.
 */
export default function PriceAlerts({ asset, price }: { asset: AssetConfig; price: number }) {
  const [alerts, setAlerts] = useState<Alert[]>(loadAlerts);
  const [direction, setDirection] = useState<"above" | "below">("above");
  const [target, setTarget] = useState("");

  // Arm/trigger check: derived during render so a crossing price marks hits
  // immediately without an effect (React's setState-during-render pattern).
  const hitIds = useMemo(() => {
    const ids: string[] = [];
    for (const alert of alerts) {
      if (alert.triggeredAt) continue;
      if (alert.direction === "above" ? price >= alert.target : price <= alert.target) {
        ids.push(alert.id);
      }
    }
    return ids;
  }, [alerts, price]);

  if (hitIds.length > 0) {
    const now = Date.now();
    const next = alerts.map((a) => (hitIds.includes(a.id) ? { ...a, triggeredAt: now } : a));
    setAlerts(next);
    saveAlerts(next);
  }

  const assetAlerts = alerts.filter((a) => a.symbol === asset.symbol);
  const triggeredCount = assetAlerts.filter((a) => a.triggeredAt).length;

  function addAlert() {
    const value = Number(target);
    if (!Number.isFinite(value) || value <= 0) return;
    const next = [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        symbol: asset.symbol,
        direction,
        target: value,
        createdAt: Date.now(),
        triggeredAt: null,
      },
      ...alerts,
    ];
    setAlerts(next);
    saveAlerts(next);
    setTarget("");
  }

  function removeAlert(id: string) {
    const next = alerts.filter((a) => a.id !== id);
    setAlerts(next);
    saveAlerts(next);
  }

  return (
    <div className="rounded-xl border border-border bg-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="flex items-center gap-2 text-sm font-bold text-white">
          <Bell className="w-4 h-4 text-accent" />
          Price Alerts
          {triggeredCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-bull/15 text-bull">
              <BellRing className="w-3 h-3" /> {triggeredCount} HIT
            </span>
          )}
        </h3>
        <span className="text-[10px] font-semibold tracking-widest text-slate-500">SAVED LOCALLY</span>
      </div>

      <div className="flex gap-2 mb-3">
        <div className="flex rounded-lg border border-border bg-panel2 overflow-hidden text-xs font-semibold">
          <button
            onClick={() => setDirection("above")}
            className={`px-2.5 py-2 transition ${direction === "above" ? "bg-bull/15 text-bull" : "text-slate-500 hover:text-slate-300"}`}
          >
            ↑ Above
          </button>
          <button
            onClick={() => setDirection("below")}
            className={`px-2.5 py-2 transition ${direction === "below" ? "bg-bear/15 text-bear" : "text-slate-500 hover:text-slate-300"}`}
          >
            ↓ Below
          </button>
        </div>
        <input
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addAlert()}
          inputMode="decimal"
          placeholder={fmtPrice(price, asset.decimals)}
          className="mono flex-1 min-w-0 rounded-lg border border-border bg-panel2 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-accent"
        />
        <button
          onClick={addAlert}
          className="flex items-center gap-1 rounded-lg bg-accent text-black text-xs font-bold px-3 py-2 hover:opacity-90 transition"
        >
          <Plus className="w-3.5 h-3.5" /> Alert
        </button>
      </div>

      <div className="space-y-1.5">
        {assetAlerts.length === 0 && (
          <p className="text-xs text-slate-500 py-2">
            No alerts for {asset.label}. Arm one above and watch the simulated feed trigger it.
          </p>
        )}
        {assetAlerts.map((alert) => {
          const hit = alert.triggeredAt !== null;
          return (
            <div
              key={alert.id}
              className={`flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-xs ${
                hit ? "border-bull/40 bg-bull/10" : "border-border bg-panel2"
              }`}
            >
              <span className="flex items-center gap-1.5">
                {hit ? (
                  <BellRing className="w-3.5 h-3.5 text-bull shrink-0" />
                ) : (
                  <Bell className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                )}
                <span className={`font-bold ${hit ? "text-bull" : "text-white"}`}>
                  {alert.direction === "above" ? "↑" : "↓"} ${fmtPrice(alert.target, asset.decimals)}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span className={`font-semibold ${hit ? "text-bull" : "text-slate-500"}`}>
                  {hit
                    ? `TRIGGERED ${new Date(alert.triggeredAt!).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
                    : "ARMED"}
                </span>
                <button onClick={() => removeAlert(alert.id)} className="text-slate-600 hover:text-bear transition" aria-label="Remove alert">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
