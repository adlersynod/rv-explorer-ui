/**
 * ClimateCard.tsx — Monthly climate grid with RV livability scores
 */

import { ClimateData, MonthlyClimate } from "../lib/types";

interface ClimateCardProps {
  climate: ClimateData;
}

const MONTH_ORDER = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function ScoreDot({ score }: { score: number }) {
  const color = score >= 8 ? "#22c55e" : score >= 6 ? "#f59e0b" : "#ef4444";
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      fontSize: "0.75rem",
      color,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
      {score}/10
    </span>
  );
}

function MonthBar({ month }: { month: MonthlyClimate }) {
  const widthPct = (month.avg_high_f / 110) * 100;
  const lowPct = (month.avg_low_f / 110) * 100;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ color: "#71717a", fontSize: "0.6875rem", width: "28px", fontWeight: 500 }}>{month.month}</span>
        <div style={{ flex: 1, height: "6px", borderRadius: "3px", background: "#18181b", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: `${lowPct}%`, width: `${widthPct - lowPct}%`, top: 0, bottom: 0, background: "linear-gradient(90deg, #3b82f6, #fbbf24, #ef4444)", borderRadius: "3px" }} />
        </div>
        <div style={{ display: "flex", gap: "4px", minWidth: "60px", justifyContent: "flex-end" }}>
          <ScoreDot score={month.score} />
        </div>
      </div>
    </div>
  );
}

export function ClimateCard({ climate }: ClimateCardProps) {
  const sorted = [...climate.monthly].sort((a, b) => b.score - a.score);

  return (
    <div className="surface-tier-2" style={{ padding: "20px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p className="label-noir" style={{ marginBottom: "4px" }}>🌡️ Climate Score</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 500, color: climate.overall_score >= 8 ? "#22c55e" : climate.overall_score >= 6 ? "#f59e0b" : "#ef4444" }}>
              {climate.overall_score}
            </span>
            <span style={{ color: "#71717a", fontSize: "0.75rem" }}>/10 RV Livability</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
          {climate.best_months.slice(0, 3).map((m) => (
            <span key={m} style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)", color: "#4ade80", fontSize: "0.625rem", padding: "2px 8px", borderRadius: "9999px", fontWeight: 600 }}>BEST: {m}</span>
          ))}
        </div>
      </div>

      {/* Summary */}
      <p style={{ color: "#a1a1aa", fontSize: "0.8125rem", lineHeight: 1.5 }}>{climate.summary}</p>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
        <div style={{ background: "#09090b", borderRadius: "8px", padding: "12px" }}>
          <p className="label-noir" style={{ fontSize: "0.625rem" }}>Summer</p>
          <p style={{ color: "#fafafa", fontSize: "0.8125rem", marginTop: "2px" }}>{climate.summer_temps}</p>
        </div>
        <div style={{ background: "#09090b", borderRadius: "8px", padding: "12px" }}>
          <p className="label-noir" style={{ fontSize: "0.625rem" }}>Winter</p>
          <p style={{ color: "#fafafa", fontSize: "0.8125rem", marginTop: "2px" }}>{climate.winter_temps}</p>
        </div>
        <div style={{ background: "#09090b", borderRadius: "8px", padding: "12px" }}>
          <p className="label-noir" style={{ fontSize: "0.625rem" }}>Rainy Season</p>
          <p style={{ color: "#fafafa", fontSize: "0.8125rem", marginTop: "2px" }}>{climate.rainy_season}</p>
        </div>
      </div>

      {/* Monthly bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <p className="label-noir" style={{ fontSize: "0.625rem" }}>Monthly RV Score — temp range (blue→yellow→red)</p>
        {sorted.map((m) => <MonthBar key={m.month} month={m} />)}
      </div>
    </div>
  );
}
