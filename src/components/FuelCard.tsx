/**
 * FuelCard.tsx — Fuel prices (diesel + propane)
 */

import { FuelPrice } from "../lib/types";

interface FuelCardProps {
  fuel: FuelPrice;
}

export function FuelCard({ fuel }: FuelCardProps) {
  const trendIcon = fuel.diesel_trend === "↑" ? "↑" : fuel.diesel_trend === "↓" ? "↓" : "→";
  const trendColor = fuel.diesel_trend === "↑" ? "#ef4444" : fuel.diesel_trend === "↓" ? "#22c55e" : "#71717a";

  return (
    <div className="surface-tier-2" style={{ padding: "20px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p className="label-noir" style={{ marginBottom: "4px" }}>⛽ Fuel Prices</p>
          <p style={{ color: "#52525b", fontSize: "0.6875rem" }}>Updated: {fuel.updated_date}</p>
        </div>
        <span style={{ color: "#71717a", fontSize: "0.625rem" }}>Sedona Area</span>
      </div>

      {/* Main prices */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {/* Diesel */}
        <div style={{ background: "#09090b", borderRadius: "8px", padding: "16px", borderLeft: "3px solid #f59e0b" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <p className="label-noir" style={{ fontSize: "0.625rem" }}>Diesel</p>
            <span style={{ color: trendColor, fontSize: "0.875rem", fontWeight: 700 }}>{trendIcon}</span>
          </div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.625rem", color: "#fafafa", letterSpacing: "-0.03em" }}>{fuel.diesel}</p>
          <p style={{ color: "#52525b", fontSize: "0.6875rem", marginTop: "2px" }}>per gallon</p>
          <div style={{ borderTop: "1px solid #18181b", marginTop: "8px", paddingTop: "8px" }}>
            <p style={{ color: "#52525b", fontSize: "0.625rem" }}>Area avg: <span style={{ color: "#71717a" }}>{fuel.avg_diesel}</span></p>
          </div>
        </div>

        {/* Propane */}
        <div style={{ background: "#09090b", borderRadius: "8px", padding: "16px", borderLeft: "3px solid #fb923c" }}>
          <p className="label-noir" style={{ fontSize: "0.625rem", marginBottom: "8px" }}>Propane</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.625rem", color: "#fafafa", letterSpacing: "-0.03em" }}>{fuel.propane}</p>
          <p style={{ color: "#52525b", fontSize: "0.6875rem", marginTop: "2px" }}>per gallon</p>
          <div style={{ borderTop: "1px solid #18181b", marginTop: "8px", paddingTop: "8px" }}>
            <p style={{ color: "#52525b", fontSize: "0.625rem" }}>20lb refill: <span style={{ color: "#71717a" }}>{fuel.propane_refill}</span></p>
          </div>
        </div>
      </div>

      {/* Cheapest station */}
      <div style={{ background: "#09090b", borderRadius: "8px", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p className="label-noir" style={{ fontSize: "0.5625rem" }}>CHEAPEST DIESEL</p>
          <p style={{ color: "#fafafa", fontSize: "0.8125rem", marginTop: "2px" }}>{fuel.cheapest_station}</p>
        </div>
        <span style={{ color: "#22c55e", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace" }}>{fuel.cheapest_distance}</span>
      </div>
    </div>
  );
}
