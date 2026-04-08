import { cn } from "../lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header
      className="surface-tier-2"
      style={{
        borderRadius: "10px",
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h1
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "#fafafa",
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              color: "#71717a",
              fontSize: "0.75rem",
              fontWeight: 400,
              marginTop: "4px",
              letterSpacing: "0.01em",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Status indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "#22c55e",
            boxShadow: "0 0 0 3px rgba(34,197,94,0.15)",
            display: "inline-block",
          }}
        />
        <span
          style={{
            color: "#71717a",
            fontSize: "0.6875rem",
            fontWeight: 500,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Live
        </span>
      </div>
    </header>
  );
}
