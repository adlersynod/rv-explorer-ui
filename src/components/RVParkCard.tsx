import { RVPark } from "../lib/types";
import { formatPrice } from "../lib/utils";

interface RVParkCardProps {
  park: RVPark;
  nights?: number;
  onClick?: () => void;
}

export function RVParkCard({ park, nights = 2, onClick }: RVParkCardProps) {
  const priceNum = park.price
    ? parseFloat(park.price.replace(/[^0-9.]/g, ""))
    : null;
  const totalCost = priceNum && !isNaN(priceNum) ? priceNum * nights : null;

  return (
    <div className="rv-park-card spring-hover" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" && onClick) onClick(); }}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
        <div style={{ flex: 1 }}>
          <p
            style={{
              color: "#fafafa",
              fontSize: "0.875rem",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
            }}
          >
            {park.name}
          </p>
          {park.category && (
            <p style={{ color: "#71717a", fontSize: "0.6875rem", marginTop: "3px" }}>
              {park.category}
            </p>
          )}
        </div>

        {/* Price */}
        {park.price && (
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: "#fafafa",
                letterSpacing: "-0.02em",
              }}
            >
              {formatPrice(park.price)}
            </p>
            <p style={{ color: "#52525b", fontSize: "0.625rem" }}>per night</p>
          </div>
        )}
      </div>

      {/* Badges row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "2px" }}>
        {park.big_rig_friendly ? (
          <span className="success-badge">✅ Big Rig</span>
        ) : (
          <span className="badge-noir">⚠️ Check length</span>
        )}
        {park.rating ? (
          <span
            style={{
              color: "#fbbf24",
              fontSize: "0.6875rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            ★ {park.rating}
          </span>
        ) : null}
      </div>

      {/* Cost estimate */}
      {totalCost !== null && (
        <div
          style={{
            borderTop: "1px solid rgba(39,39,42,0.6)",
            paddingTop: "10px",
            marginTop: "4px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#52525b", fontSize: "0.6875rem", fontWeight: 500 }}>
            Est. total ({nights} nights)
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "#a1a1aa",
              letterSpacing: "-0.02em",
            }}
          >
            ${totalCost.toFixed(0)}
          </span>
        </div>
      )}

      {/* CTA */}
      {park.url && (
        <div style={{ marginTop: "4px" }}>
          <a
            href={park.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="btn-ghost"
            style={{
              display: "inline-flex",
              fontSize: "0.6875rem",
              padding: "5px 10px",
              textDecoration: "none",
              borderRadius: "6px",
            }}
          >
            View Details →
          </a>
        </div>
      )}
    </div>
  );
}
