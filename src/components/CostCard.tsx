/**
 * CostCard.tsx — RV lifestyle cost breakdown dashboard
 */

import { CostIndex } from "../lib/types";

interface CostCardProps {
  cost: CostIndex;
}

function CostBar({ label, value, max, unit = "" }: { label: string; value: string; max: number; unit?: string }) {
  const numericVal = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
  const pct = Math.min((numericVal / max) * 100, 100);
  const isHigh = pct > 70;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "#71717a", fontSize: "0.75rem" }}>{label}</span>
        <span style={{ color: isHigh ? "#f59e0b" : "#a1a1aa", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace" }}>{value}{unit}</span>
      </div>
      <div style={{ height: "4px", background: "#18181b", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: isHigh ? "#f59e0b" : "#3b82f6", borderRadius: "2px", transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

export function CostCard({ cost }: CostCardProps) {
  const scoreColor = cost.overall >= 7 ? "#22c55e" : cost.overall >= 5 ? "#f59e0b" : "#ef4444";

  const categories = [
    { label: "Campground", value: cost.cost_breakdown.campground, pct: 0.65 },
    { label: "Fuel", value: cost.cost_breakdown.fuel, pct: 0.18 },
    { label: "Groceries", value: cost.cost_breakdown.groceries, pct: 0.17 },
    { label: "Entertainment", value: cost.cost_breakdown.entertainment, pct: 0.08 },
    { label: "Misc", value: cost.cost_breakdown.misc, pct: 0.14 },
  ];

  return (
    <div className="surface-tier-2" style={{ padding: "20px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p className="label-noir" style={{ marginBottom: "4px" }}>💰 Cost Index</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 500, color: scoreColor }}>
              {cost.overall}
            </span>
            <span style={{ color: "#71717a", fontSize: "0.75rem" }}>/10 Affordability</span>
          </div>
          <p style={{ color: "#71717a", fontSize: "0.6875rem", marginTop: "2px" }}>{cost.overall >= 7 ? "✓ Affordable for full-timers" : cost.overall >= 5 ? "⚠ Moderate cost of living" : "⚠ Above average cost"}</p>
        </div>
        <div style={{ background: "#09090b", borderRadius: "8px", padding: "12px", textAlign: "right" }}>
          <p className="label-noir" style={{ fontSize: "0.625rem" }}>Est. Monthly</p>
          <p style={{ color: "#fafafa", fontSize: "0.875rem", fontFamily: "'JetBrains Mono', monospace", marginTop: "2px" }}>{cost.overall_monthly_rv}</p>
        </div>
      </div>

      {/* Cost comparison grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
        <div style={{ background: "#09090b", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
          <p style={{ color: "#71717a", fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Campground</p>
          <p style={{ color: "#fafafa", fontSize: "0.9375rem", fontFamily: "'JetBrains Mono', monospace", marginTop: "2px" }}>{cost.campground_avg}</p>
          <p style={{ color: "#52525b", fontSize: "0.5625rem" }}>/night avg</p>
        </div>
        <div style={{ background: "#09090b", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
          <p style={{ color: "#71717a", fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Diesel</p>
          <p style={{ color: "#fafafa", fontSize: "0.9375rem", fontFamily: "'JetBrains Mono', monospace", marginTop: "2px" }}>{cost.diesel_price}</p>
          <p style={{ color: "#52525b", fontSize: "0.5625rem" }}>/gallon</p>
        </div>
        <div style={{ background: "#09090b", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
          <p style={{ color: "#71717a", fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Groceries</p>
          <p style={{ color: "#fafafa", fontSize: "0.9375rem", fontFamily: "'JetBrains Mono', monospace", marginTop: "2px" }}>{cost.groceries_idx}</p>
          <p style={{ color: "#52525b", fontSize: "0.5625rem" }}>idx (100=avg)</p>
        </div>
        <div style={{ background: "#09090b", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
          <p style={{ color: "#71717a", fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Propane</p>
          <p style={{ color: "#fafafa", fontSize: "0.9375rem", fontFamily: "'JetBrains Mono', monospace", marginTop: "2px" }}>{cost.propane}</p>
          <p style={{ color: "#52525b", fontSize: "0.5625rem" }}>/gallon</p>
        </div>
      </div>

      {/* Monthly breakdown bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <p className="label-noir" style={{ fontSize: "0.625rem" }}>Monthly Budget Breakdown</p>
        {categories.map(({ label, value }) => (
          <CostBar key={label} label={label} value={value} max={2500} />
        ))}
      </div>
    </div>
  );
}
