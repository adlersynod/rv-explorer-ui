/**
 * PetCard.tsx — Pet-friendliness score (Theo!)
 */

import { PetScore } from "../lib/types";

interface PetCardProps {
  pet_score: PetScore;
}

function VetBadge({ availability }: { availability: PetScore["vet_availability"] }) {
  const config = {
    excellent: { color: "#22c55e", label: "Excellent" },
    good: { color: "#3b82f6", label: "Good" },
    limited: { color: "#f59e0b", label: "Limited" },
    none: { color: "#ef4444", label: "None" },
  };
  const { color, label } = config[availability];
  return (
    <span style={{ background: `${color}20`, border: `1px solid ${color}40`, color, fontSize: "0.6875rem", padding: "3px 8px", borderRadius: "9999px", fontWeight: 600 }}>
      Vet: {label}
    </span>
  );
}

export function PetCard({ pet_score }: PetCardProps) {
  const scoreColor = pet_score.overall >= 8 ? "#22c55e" : pet_score.overall >= 6 ? "#f59e0b" : "#ef4444";

  return (
    <div className="surface-tier-2" style={{ padding: "20px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p className="label-noir" style={{ marginBottom: "4px" }}>🐾 Pet-Friendliness</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 500, color: scoreColor }}>
              {pet_score.overall}
            </span>
            <span style={{ color: "#71717a", fontSize: "0.75rem" }}>/10 for Theo 🐕</span>
          </div>
        </div>
        <VetBadge availability={pet_score.vet_availability} />
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
        <div style={{ background: "#09090b", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", color: "#fafafa", fontSize: "1.375rem" }}>{pet_score.dog_friendly_trails}</p>
          <p style={{ color: "#71717a", fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: "2px" }}>Dog Trails</p>
        </div>
        <div style={{ background: "#09090b", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", color: "#fafafa", fontSize: "1.375rem" }}>{pet_score.dog_parks}</p>
          <p style={{ color: "#71717a", fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: "2px" }}>Dog Parks</p>
        </div>
        <div style={{ background: "#09090b", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", color: "#fafafa", fontSize: "1.375rem" }}>{pet_score.pet_stores}</p>
          <p style={{ color: "#71717a", fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: "2px" }}>Pet Stores</p>
        </div>
      </div>

      {/* Policy notes */}
      <div style={{ background: "#09090b", borderRadius: "8px", padding: "12px" }}>
        <p className="label-noir" style={{ fontSize: "0.625rem", marginBottom: "6px" }}>Policy Notes</p>
        <p style={{ color: "#a1a1aa", fontSize: "0.8125rem", lineHeight: 1.5 }}>{pet_score.pet_policy_notes}</p>
      </div>

      {/* Top dog spots */}
      <div>
        <p className="label-noir" style={{ fontSize: "0.625rem", marginBottom: "8px" }}>🏆 Top Spots for Theo</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {pet_score.top_dog_spots.map((spot, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <span style={{ color: "#a78bfa", fontSize: "0.75rem", minWidth: "16px", paddingTop: "1px" }}>●</span>
              <p style={{ color: "#d4d4d8", fontSize: "0.8125rem", lineHeight: 1.4 }}>{spot}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
