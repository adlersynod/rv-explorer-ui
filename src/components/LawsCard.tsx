/**
 * LawsCard.tsx — State RV laws and regulations
 */

import { StateRVLaws, RVLaw } from "../lib/types";

interface LawsCardProps {
  state_laws: StateRVLaws;
}

const SEVERITY_COLORS: Record<string, string> = {
  info: "#3b82f6",
  warning: "#f59e0b",
  critical: "#ef4444",
};

function LawRow({ law }: { law: RVLaw }) {
  const color = SEVERITY_COLORS[law.severity || "info"];
  const icon = law.severity === "critical" ? "🛑" : law.severity === "warning" ? "⚠️" : "ℹ️";
  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
      <span style={{ color, fontSize: "0.75rem", flexShrink: 0, paddingTop: "1px" }}>{icon}</span>
      <div>
        <p style={{ color: "#d4d4d8", fontSize: "0.8125rem", fontWeight: 500 }}>{law.category}</p>
        <p style={{ color: "#71717a", fontSize: "0.75rem", marginTop: "1px", lineHeight: 1.4 }}>{law.rule}</p>
      </div>
    </div>
  );
}

export function LawsCard({ state_laws }: LawsCardProps) {
  return (
    <div className="surface-tier-2" style={{ padding: "20px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p className="label-noir" style={{ marginBottom: "4px" }}>📋 {state_laws.state} RV Laws</p>
          <p style={{ color: "#52525b", fontSize: "0.75rem" }}>Full-time RV legal reference</p>
        </div>
        {state_laws.burn_ban_status && (
          <span style={{
            background: state_laws.burn_ban_status.toLowerCase().includes("in effect")
              ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)",
            border: `1px solid ${state_laws.burn_ban_status.toLowerCase().includes("in effect") ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
            color: state_laws.burn_ban_status.toLowerCase().includes("in effect") ? "#f87171" : "#4ade80",
            fontSize: "0.625rem",
            padding: "3px 8px",
            borderRadius: "9999px",
            fontWeight: 600,
          }}>
            🔥 {state_laws.burn_ban_status}
          </span>
        )}
      </div>

      {/* Key specs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div style={{ background: "#09090b", borderRadius: "8px", padding: "10px 12px" }}>
          <p className="label-noir" style={{ fontSize: "0.5625rem" }}>Max RV Length</p>
          <p style={{ color: "#fafafa", fontSize: "0.8125rem", marginTop: "2px" }}>{state_laws.max_rv_length}</p>
        </div>
        <div style={{ background: "#09090b", borderRadius: "8px", padding: "10px 12px" }}>
          <p className="label-noir" style={{ fontSize: "0.5625rem" }}>Weight Limits</p>
          <p style={{ color: "#fafafa", fontSize: "0.8125rem", marginTop: "2px" }}>{state_laws.weight_limits}</p>
        </div>
        <div style={{ background: "#09090b", borderRadius: "8px", padding: "10px 12px" }}>
          <p className="label-noir" style={{ fontSize: "0.5625rem" }}>Axle Req.</p>
          <p style={{ color: "#fafafa", fontSize: "0.8125rem", marginTop: "2px" }}>{state_laws.axle_requirements}</p>
        </div>
        <div style={{ background: "#09090b", borderRadius: "8px", padding: "10px 12px" }}>
          <p className="label-noir" style={{ fontSize: "0.5625rem" }}>Pet Rules</p>
          <p style={{ color: "#fafafa", fontSize: "0.8125rem", marginTop: "2px" }}>{state_laws.pet_rules}</p>
        </div>
      </div>

      {/* Laws */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <p className="label-noir" style={{ fontSize: "0.625rem" }}>Notable Restrictions</p>
        {state_laws.notable_restrictions.map((law, i) => (
          <LawRow key={i} law={law} />
        ))}
      </div>

      {/* RV-friendly highways */}
      {state_laws.rv_friendly_highways.length > 0 && (
        <div>
          <p className="label-noir" style={{ fontSize: "0.625rem", marginBottom: "6px" }}>🛣️ RV-Friendly Highways</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {state_laws.rv_friendly_highways.map((hw, i) => (
              <span key={i} style={{ background: "#09090b", border: "1px solid #27272a", color: "#a1a1aa", fontSize: "0.6875rem", padding: "4px 10px", borderRadius: "6px" }}>
                {hw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
