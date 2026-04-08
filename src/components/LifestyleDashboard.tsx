/**
 * LifestyleDashboard.tsx — Full-Time RV Life operations dashboard
 *
 * Shows: Climate, Cost, Connectivity, Services, Pets, Fuel,
 *         Events, Dump Stations, State Laws
 */

import { RVLifestyleData, ExploreResult } from "../lib/types";
import { ClimateCard } from "./ClimateCard";
import { CostCard } from "./CostCard";
import { ConnectivityCard } from "./ConnectivityCard";
import { ServicesCard } from "./ServicesCard";
import { PetCard } from "./PetCard";
import { FuelCard } from "./FuelCard";
import { EventsCard } from "./EventsCard";
import { LawsCard } from "./LawsCard";
import { DumpStationCard } from "./DumpStationCard";
import { RVParkCard } from "./RVParkCard";
import { BentoGrid } from "./BentoCard";

interface LifestyleDashboardProps {
  result: ExploreResult;
}

export function LifestyleDashboard({ result }: LifestyleDashboardProps) {
  const { lifestyle, rv_parks } = result;

  if (!lifestyle) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div className="surface-tier-2" style={{ padding: "32px", borderRadius: "10px", textAlign: "center" }}>
          <p style={{ color: "#71717a", fontSize: "0.875rem" }}>
            Full-time RV lifestyle data not available for this destination.
            <br />
            Try searching for a major US destination like Sedona, AZ.
          </p>
        </div>
      </div>
    );
  }

  const { climate, cost, connectivity, nearby_services, pet_score, fuel, community_events, state_laws, dump_stations } = lifestyle;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Top KPIs ────────────────────────────────────────────── */}
      <BentoGrid cols={4}>
        <KpiCard
          label="🌡️ Climate"
          value={climate.overall_score.toString()}
          max="/10"
          sublabel={climate.best_months.slice(0, 2).join(", ")}
          color={climate.overall_score >= 8 ? "#22c55e" : climate.overall_score >= 6 ? "#f59e0b" : "#ef4444"}
        />
        <KpiCard
          label="💰 Cost Index"
          value={cost.overall.toString()}
          max="/10"
          sublabel={cost.overall >= 7 ? "Affordable" : cost.overall >= 5 ? "Moderate" : "Costly"}
          color={cost.overall >= 7 ? "#22c55e" : cost.overall >= 5 ? "#f59e0b" : "#ef4444"}
        />
        <KpiCard
          label="📶 Connectivity"
          value={connectivity.overall.toString()}
          max="/10"
          sublabel={`Verizon ${'●'.repeat(connectivity.verizon_signal)}${'○'.repeat(5 - connectivity.verizon_signal)}`}
          color={connectivity.overall >= 7 ? "#22c55e" : connectivity.overall >= 4 ? "#f59e0b" : "#ef4444"}
        />
        <KpiCard
          label="🐾 Pet Score"
          value={pet_score.overall.toString()}
          max="/10"
          sublabel={pet_score.vet_availability + " vet access"}
          color={pet_score.overall >= 8 ? "#22c55e" : pet_score.overall >= 6 ? "#f59e0b" : "#ef4444"}
        />
      </BentoGrid>

      {/* ── Climate + Cost ──────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <ClimateCard climate={climate} />
        <CostCard cost={cost} />
      </div>

      {/* ── Connectivity + Fuel ──────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <ConnectivityCard connectivity={connectivity} />
        <FuelCard fuel={fuel} />
      </div>

      {/* ── Services + Pets ─────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <ServicesCard services={nearby_services} />
        <PetCard pet_score={pet_score} />
      </div>

      {/* ── RV Parks (Top Picks) ─────────────────────────────────── */}
      {rv_parks.length > 0 && (
        <div>
          <p className="label-noir" style={{ marginBottom: "10px" }}>🏕️ RV Parks — Big Rig Friendly</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {rv_parks.slice(0, 3).map((park, i) => (
              <RVParkCard key={i} park={park} nights={3} />
            ))}
          </div>
        </div>
      )}

      {/* ── Dump Stations + Events ───────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <DumpStationCard stations={dump_stations} />
        <EventsCard events={community_events} />
      </div>

      {/* ── State Laws ──────────────────────────────────────────── */}
      <LawsCard state_laws={state_laws} />
    </div>
  );
}

// ─── Small KPI Card ────────────────────────────────────────────────
interface KpiCardProps {
  label: string;
  value: string;
  max?: string;
  sublabel: string;
  color?: string;
}

function KpiCard({ label, value, max = "", sublabel, color = "#fafafa" }: KpiCardProps) {
  return (
    <div className="surface-tier-2" style={{ padding: "18px 20px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
      <p className="label-noir" style={{ fontSize: "0.625rem" }}>{label}</p>
      <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.875rem", fontWeight: 500, color, letterSpacing: "-0.03em" }}>
          {value}
        </span>
        {max && <span style={{ color: "#52525b", fontSize: "0.875rem" }}>{max}</span>}
      </div>
      <p style={{ color: "#52525b", fontSize: "0.6875rem" }}>{sublabel}</p>
    </div>
  );
}
