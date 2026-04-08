/**
 * DumpStationCard.tsx — Nearby dump stations
 */

import { DumpStation } from "../lib/types";

interface DumpStationCardProps {
  stations: DumpStation[];
}

const TYPE_LABELS = {
  free: { label: "FREE", color: "#22c55e" },
  paid: { label: "PAID", color: "#f59e0b" },
  campground_only: { label: "RESORT", color: "#3b82f6" },
};

export function DumpStationCard({ stations }: DumpStationCardProps) {
  return (
    <div className="surface-tier-2" style={{ padding: "20px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <p className="label-noir">🚿 Dump Stations</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {stations.map((station, i) => {
          const type = TYPE_LABELS[station.type];
          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 12px",
                background: "#09090b",
                borderRadius: "8px",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <p style={{ color: "#fafafa", fontSize: "0.8125rem", fontWeight: 500 }}>{station.name}</p>
                  <span style={{ background: `${type.color}20`, border: `1px solid ${type.color}40`, color: type.color, fontSize: "0.5625rem", padding: "2px 6px", borderRadius: "9999px", fontWeight: 700 }}>
                    {type.label}
                  </span>
                </div>
                <p style={{ color: "#52525b", fontSize: "0.6875rem" }}>{station.address}</p>
                {station.notes && (
                  <p style={{ color: "#71717a", fontSize: "0.6875rem", marginTop: "1px" }}>{station.notes}</p>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px", flexShrink: 0 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#a1a1aa", fontSize: "0.8125rem" }}>{station.distance_mi} mi</span>
                {station.price && station.type !== "free" && (
                  <span style={{ color: "#f59e0b", fontSize: "0.625rem" }}>{station.price}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
