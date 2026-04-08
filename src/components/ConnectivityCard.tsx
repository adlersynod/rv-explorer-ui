/**
 * ConnectivityCard.tsx — Starlink + cellular signal dashboard
 */

import { ConnectivityScore } from "../lib/types";

interface ConnectivityCardProps {
  connectivity: ConnectivityScore;
}

function SignalBars({ bars, label, color = "#22c55e" }: { bars: number; label: string; color?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "24px" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              width: "6px",
              height: `${i * 4}px`,
              borderRadius: "2px",
              background: i <= bars ? color : "#27272a",
              transition: "background 0.2s ease",
            }}
          />
        ))}
      </div>
      <span style={{ color: "#71717a", fontSize: "0.5625rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
    </div>
  );
}

function StarlinkRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= rating ? "#fbbf24" : "#27272a"}>
          <path d="M12 2L14.5 9H22L16 13.5L18 21L12 16.5L6 21L8 13.5L2 9H9.5L12 2Z" />
        </svg>
      ))}
      <span style={{ color: "#fbbf24", fontSize: "0.6875rem", marginLeft: "4px" }}>{rating}/5</span>
    </div>
  );
}

export function ConnectivityCard({ connectivity }: ConnectivityCardProps) {
  const overallColor = connectivity.overall >= 7 ? "#22c55e" : connectivity.overall >= 4 ? "#f59e0b" : "#ef4444";

  return (
    <div className="surface-tier-2" style={{ padding: "20px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p className="label-noir" style={{ marginBottom: "4px" }}>📶 Connectivity</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 500, color: overallColor }}>
              {connectivity.overall}
            </span>
            <span style={{ color: "#71717a", fontSize: "0.75rem" }}>/10 for Remote Work</span>
          </div>
        </div>
        <div style={{ background: "#09090b", borderRadius: "8px", padding: "10px", display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
          <p className="label-noir" style={{ fontSize: "0.5625rem" }}>Starlink</p>
          <StarlinkRating rating={connectivity.starlink_rating} />
        </div>
      </div>

      {/* Notes */}
      <p style={{ color: "#a1a1aa", fontSize: "0.8125rem", lineHeight: 1.5 }}>{connectivity.starlink_notes}</p>

      {/* Cellular bars */}
      <div style={{ background: "#09090b", borderRadius: "8px", padding: "14px 16px" }}>
        <p className="label-noir" style={{ fontSize: "0.625rem", marginBottom: "12px" }}>Cellular Signal — Bars</p>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <SignalBars bars={connectivity.verizon_signal} label="Verizon" color="#dc2626" />
          <SignalBars bars={connectivity.att_signal} label="AT&T" color="#2563eb" />
          <SignalBars bars={connectivity.tmobile_signal} label="T-Mobile" color="#db2777" />
        </div>
      </div>

      {/* Best areas + dead zones */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <p className="label-noir" style={{ fontSize: "0.625rem", marginBottom: "8px" }}>✅ Best Areas</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {connectivity.best_areas.map((area, i) => (
              <p key={i} style={{ color: "#4ade80", fontSize: "0.75rem", lineHeight: 1.4 }}>{area}</p>
            ))}
          </div>
        </div>
        <div>
          <p className="label-noir" style={{ fontSize: "0.625rem", marginBottom: "8px" }}>⚠️ Dead Zones</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {connectivity.dead_zones.map((zone, i) => (
              <p key={i} style={{ color: "#f87171", fontSize: "0.75rem", lineHeight: 1.4 }}>{zone}</p>
            ))}
          </div>
        </div>
      </div>

      {/* RV Parks with fiber */}
      {connectivity.rv_parks_with_fiber.length > 0 && (
        <div>
          <p className="label-noir" style={{ fontSize: "0.625rem", marginBottom: "8px" }}>�odgeFiber Parks</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {connectivity.rv_parks_with_fiber.map((park, i) => (
              <p key={i} style={{ color: "#a1a1aa", fontSize: "0.75rem" }}>⚡ {park}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
