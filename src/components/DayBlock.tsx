import { Day } from "../lib/types";
import { cn } from "../lib/utils";

const TIME_COLORS: Record<string, string> = {
  Morning: "#fbbf24",
  Afternoon: "#60a5fa",
  Midday: "#34d399",
  Evening: "#c084fc",
};

const TIME_ICONS: Record<string, string> = {
  Morning: "🌅",
  Afternoon: "☀️",
  Midday: "🍽",
  Evening: "🌙",
};

interface DayBlockProps {
  day: Day;
  defaultOpen?: boolean;
}

export function DayBlock({ day, defaultOpen = true }: DayBlockProps) {
  return (
    <div className="day-block animate-slide-up">
      {/* Day header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: "1px solid rgba(39,39,42,0.8)",
        }}
      >
        <span
          style={{
            color: "#fafafa",
            fontSize: "0.875rem",
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          {day.label}
        </span>
        <span
          style={{
            color: "#52525b",
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.03em",
          }}
        >
          {day.slots.length} {day.slots.length === 1 ? "stop" : "stops"}
        </span>
      </div>

      {/* Slots */}
      {day.slots.map((slot, i) => {
        const timeColor = TIME_COLORS[slot.time] ?? "#71717a";
        const timeIcon = TIME_ICONS[slot.time] ?? "📍";

        return (
          <div key={i} className="slot-row">
            {/* Time + icon */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                paddingTop: "2px",
              }}
            >
              <span style={{ fontSize: "0.75rem" }}>{timeIcon}</span>
              <span className="slot-time" style={{ color: timeColor }}>
                {slot.time}
              </span>
              {slot.duration && (
                <span
                  style={{
                    color: "#3f3f46",
                    fontSize: "0.625rem",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                  }}
                >
                  {slot.duration}
                </span>
              )}
            </div>

            {/* Activity */}
            <div>
              <p className="slot-activity">{slot.activity}</p>
              {slot.item && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "4px",
                  }}
                >
                  {slot.item.rating && (
                    <span
                      style={{
                        color: "#fbbf24",
                        fontSize: "0.6875rem",
                        fontWeight: 500,
                      }}
                    >
                      ★ {slot.item.rating}
                    </span>
                  )}
                  {slot.item.source && (
                    <span className="badge-noir">{slot.item.source}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
