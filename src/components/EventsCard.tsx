/**
 * EventsCard.tsx — Community events and festivals
 */

import { CommunityEvent } from "../lib/types";

interface EventsCardProps {
  events: CommunityEvent[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Music: "#a78bfa",
  Festival: "#f59e0b",
  Sports: "#34d399",
  Outdoor: "#60a5fa",
  Market: "#fbbf24",
  Art: "#f472b6",
  Craft: "#fb923c",
  Community: "#22c55e",
  Motorcycle: "#ef4444",
};

export function EventsCard({ events }: EventsCardProps) {
  return (
    <div className="surface-tier-2" style={{ padding: "20px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p className="label-noir">🎉 Community Events</p>
        <span style={{ color: "#3f3f46", fontSize: "0.6875rem" }}>{events.length} events</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {events.map((event, i) => {
          const color = CATEGORY_COLORS[event.category] || "#71717a";
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "12px",
                padding: "10px 12px",
                background: "#09090b",
                borderRadius: "8px",
                alignItems: "flex-start",
              }}
            >
              {/* Date badge */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "42px" }}>
                <span style={{ fontSize: "0.5625rem", color: "#52525b", textTransform: "uppercase", letterSpacing: "0.04em" }}>WHEN</span>
                <span style={{ color: "#fafafa", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", textAlign: "center", lineHeight: 1.2 }}>{event.date.split(" ")[0]}</span>
                <span style={{ color: "#71717a", fontSize: "0.6875rem" }}>{event.date.split(" ")[1]?.replace(",", "") || ""}</span>
              </div>

              {/* Event info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ background: `${color}20`, border: `1px solid ${color}40`, color, fontSize: "0.5625rem", padding: "2px 7px", borderRadius: "9999px", fontWeight: 600 }}>
                    {event.category}
                  </span>
                  {event.free && (
                    <span style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)", color: "#4ade80", fontSize: "0.5625rem", padding: "2px 7px", borderRadius: "9999px" }}>
                      FREE
                    </span>
                  )}
                </div>
                <p style={{ color: "#fafafa", fontSize: "0.8125rem", fontWeight: 500, marginTop: "4px" }}>{event.name}</p>
                {event.description && (
                  <p style={{ color: "#71717a", fontSize: "0.75rem", marginTop: "2px", lineHeight: 1.4 }}>{event.description}</p>
                )}
                <p style={{ color: "#52525b", fontSize: "0.6875rem", marginTop: "3px" }}>{event.location}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
