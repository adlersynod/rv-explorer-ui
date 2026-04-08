import { tabular } from "../lib/utils";

interface MetricCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  accent?: boolean;
  badge?: string;
  badgeVariant?: "default" | "success" | "alert";
}

export function MetricCard({
  value,
  label,
  icon,
  accent = false,
  badge,
  badgeVariant = "default",
}: MetricCardProps) {
  const valueStyle: React.CSSProperties = tabular(value);

  return (
    <div
      className="surface-tier-2"
      style={{
        borderRadius: "10px",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span className="metric-label">{label}</span>
        {icon && (
          <span style={{ color: "#71717a", display: "flex" }}>{icon}</span>
        )}
      </div>

      {/* Value */}
      <div
        style={{
          ...valueStyle,
          fontSize: "1.75rem",
          fontWeight: 500,
          color: accent ? "#60a5fa" : "#fafafa",
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </div>

      {/* Badge */}
      {badge && (
        <div
          style={{
            display: "inline-flex",
            alignSelf: "flex-start",
            marginTop: "2px",
          }}
        >
          {badgeVariant === "success" ? (
            <span className="success-badge">{badge}</span>
          ) : badgeVariant === "alert" ? (
            <span className="alert-badge">{badge}</span>
          ) : (
            <span className="badge-noir">{badge}</span>
          )}
        </div>
      )}

      {/* Accent glow strip */}
      {accent && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, #3b82f6, rgba(59,130,246,0.3), transparent)",
            borderRadius: "0 0 10px 10px",
          }}
        />
      )}
    </div>
  );
}
