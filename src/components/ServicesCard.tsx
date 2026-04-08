/**
 * ServicesCard.tsx — Nearby services (hospital, vet, propane, etc.)
 */

import { NearbyService, ServiceType } from "../lib/types";

interface ServicesCardProps {
  services: NearbyService[];
}

const SERVICE_ICONS: Record<ServiceType, string> = {
  hospital: "🏥",
  urgent_care: "🚑",
  vet: "🐾",
  propane: "🔥",
  rv_repair: "🔧",
  dump_station: "🚿",
  laundry: "👕",
  store: "🛒",
  pharmacy: "💊",
};

const SERVICE_COLORS: Record<ServiceType, string> = {
  hospital: "#ef4444",
  urgent_care: "#f59e0b",
  vet: "#a78bfa",
  propane: "#fb923c",
  rv_repair: "#60a5fa",
  dump_station: "#34d399",
  laundry: "#38bdf8",
  store: "#fbbf24",
  pharmacy: "#f472b6",
};

const TYPE_LABELS: Record<ServiceType, string> = {
  hospital: "Hospital",
  urgent_care: "Urgent Care",
  vet: "Vet",
  propane: "Propane",
  rv_repair: "RV Repair",
  dump_station: "Dump Station",
  laundry: "Laundry",
  store: "Store",
  pharmacy: "Pharmacy",
};

export function ServicesCard({ services }: ServicesCardProps) {
  const sorted = [...services].sort((a, b) => a.distance_mi - b.distance_mi);

  return (
    <div className="surface-tier-2" style={{ padding: "20px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p className="label-noir">🏥 Nearby Services</p>
        <span style={{ color: "#3f3f46", fontSize: "0.6875rem" }}>{services.length} found</span>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {Object.entries(SERVICE_ICONS).map(([type, icon]) => (
          <span key={type} style={{ color: SERVICE_COLORS[type as ServiceType], fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "3px" }}>
            {icon} {TYPE_LABELS[type as ServiceType]}
          </span>
        ))}
      </div>

      {/* Services list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {sorted.slice(0, 12).map((svc, i) => {
          const color = SERVICE_COLORS[svc.type] || "#71717a";
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                background: "#09090b",
                borderRadius: "8px",
                borderLeft: `3px solid ${color}`,
              }}
            >
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>{SERVICE_ICONS[svc.type]}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                  <p style={{ color: "#fafafa", fontSize: "0.8125rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{svc.name}</p>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#a1a1aa", fontSize: "0.6875rem", flexShrink: 0 }}>
                    {svc.distance_mi} mi
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                  <span style={{ color: "#52525b", fontSize: "0.6875rem" }}>{svc.address}</span>
                  {svc.open_now !== undefined && (
                    <span style={{ color: svc.open_now ? "#22c55e" : "#ef4444", fontSize: "0.5625rem", fontWeight: 600, flexShrink: 0 }}>
                      {svc.open_now ? "● OPEN" : "○ CLOSED"}
                    </span>
                  )}
                </div>
                {svc.notes && <p style={{ color: "#52525b", fontSize: "0.6875rem", marginTop: "2px" }}>{svc.notes}</p>}
              </div>
              {svc.rating && (
                <span style={{ color: "#fbbf24", fontSize: "0.6875rem", flexShrink: 0 }}>★ {svc.rating}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
