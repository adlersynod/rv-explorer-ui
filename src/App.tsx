import { MapPin, Compass, Download, Home, LifeBuoy, Navigation, ArrowRight, AlertTriangle } from "lucide-react";
import { BentoCard, BentoGrid } from "./components/BentoCard";
import { MetricCard } from "./components/MetricCard";
import { TabBar } from "./components/TabBar";
import { DayBlock } from "./components/DayBlock";
import { RVParkCard } from "./components/RVParkCard";
import { LifestyleDashboard } from "./components/LifestyleDashboard";
import { StayPlan, Day, RVPark } from "./lib/types";
import { useState, useEffect, useCallback } from "react";
import { fetchDestination } from "./lib/api";
import { ExploreResult } from "./lib/realData";
import type { Route } from "./lib/types";

// ─── App Root ─────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("explorer");

  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100dvh", padding: "20px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Header */}
        <AppHeader />

        {/* Tab Bar */}
        <TabBar
          tabs={[
            { id: "explorer", label: "RV Explorer", icon: <MapPin size={14} /> },
            { id: "fulltime", label: "Full-Time RV Life", icon: <Home size={14} />, badge: "Live" },
            { id: "planner", label: "Trip Planner", icon: <Compass size={14} /> },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        {activeTab === "explorer" && <ExplorerTab key="explorer" />}
        {activeTab === "fulltime" && <FullTimeTab key="fulltime" />}
        {activeTab === "planner" && <PlannerTab key="planner" />}

        {/* Footer */}
        <footer style={{ borderTop: "1px solid #18181b", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <p style={{ color: "#3f3f46", fontSize: "0.6875rem" }}>
            Built for Adler Synod · Brinkley 4100 · Personal Use Only
          </p>
          <p style={{ color: "#27272a", fontSize: "0.625rem", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.01em" }}>
            ADLER NOIR v1.2.0
          </p>
        </footer>
      </div>
    </div>
  );
}

// ─── App Header ───────────────────────────────────────────────────
function AppHeader() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
      <div>
        <h1 style={{ fontFamily: "Inter, sans-serif", fontSize: "1.25rem", fontWeight: 600, color: "#fafafa", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
          📍 RV Explorer
        </h1>
        <p style={{ color: "#52525b", fontSize: "0.75rem", marginTop: "4px", letterSpacing: "0.01em" }}>
          Full-time RV life planning · 43ft Brinkley 4100 · Theo 🐾
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "9999px", padding: "6px 12px" }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#22c55e", boxShadow: "0 0 0 3px rgba(34,197,94,0.15)", flexShrink: 0 }} className="glow-pulse" />
        <span style={{ color: "#4ade80", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Deployed
        </span>
      </div>
    </div>
  );
}

// ─── Explorer Tab ─────────────────────────────────────────────────
function ExplorerTab() {
  const [destination, setDestination] = useState("");
  const [nights, setNights] = useState(3);
  const [result, setResult] = useState<ExploreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load real Sedona data on mount
  useEffect(() => {
    let cancelled = false;
    async function loadSedona() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDestination("Sedona", "AZ", 3);
        if (!cancelled) setResult(data);
      } catch {
        if (!cancelled) setError("Failed to load Sedona data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadSedona();
    return () => { cancelled = true; };
  }, []);

  const handleExplore = useCallback(async () => {
    if (!destination.trim()) return;
    let cancelled = false;
    setResult(null); // clear old data immediately
    setLoading(true);
    setError(null);
    try {
      const parts = destination.split(",").map((p) => p.trim());
      const city = parts[0] || "Sedona";
      const state = parts[1] || "AZ";
      const data = await fetchDestination(city, state, nights);
      if (!cancelled) setResult(data);
    } catch {
      if (!cancelled) setError("Failed to fetch destination data");
    } finally {
      if (!cancelled) setLoading(false);
    }
  }, [destination, nights]);

  const nightsOptions = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Search Block */}
      <BentoCard hoverLift={false}>
        <p className="label-noir" style={{ marginBottom: "14px" }}>Where do you want to go?</p>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className="label-noir">Destination</label>
            <input
              className="input-noir"
              type="text"
              placeholder="City, State (e.g. Sedona, AZ)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleExplore(); }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className="label-noir">Nights</label>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {nightsOptions.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNights(n)}
                  style={{
                    backgroundColor: nights === n ? "#18181b" : "transparent",
                    border: `1px solid ${nights === n ? "#3b82f6" : "#27272a"}`,
                    borderRadius: "6px",
                    color: nights === n ? "#fafafa" : "#71717a",
                    cursor: "pointer",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    padding: "8px 14px",
                    transition: "all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    boxShadow: nights === n ? "0 0 0 2px rgba(59,130,246,0.2)" : "none",
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <button
            className="btn-primary"
            type="button"
            onClick={handleExplore}
            disabled={loading}
            style={{ flexShrink: 0, height: "42px", alignSelf: "flex-end" }}
          >
            {loading ? <><LoadingSpinner />Loading...</> : <><MapPin size={15} />Explore</>}
          </button>
        </div>
      </BentoCard>

      {/* Loading */}
      {loading && <LoadingSkeleton />}

      {/* Error with retry */}
      {error && (
        <BentoCard>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <AlertTriangle size={16} style={{ color: "#f87171", flexShrink: 0 }} />
            <p style={{ color: "#f87171", fontSize: "0.875rem", flex: 1 }}>{error}</p>
            <button className="btn-ghost" type="button" onClick={handleExplore} style={{ fontSize: "0.75rem", padding: "6px 12px" }}>
              Retry
            </button>
          </div>
        </BentoCard>
      )}

      {/* Results */}
      {result && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <BentoGrid cols={4}>
            <MetricCard value={result.destination} label="Destination" accent />
            <MetricCard value={result.itinerary.stay_duration} label="Recommended" />
            <MetricCard value={`${result.itinerary.days.length} days`} label="Stay" />
            <MetricCard value={result.rv_parks.length} label="RV Parks" badge="Big Rig" badgeVariant="success" />
          </BentoGrid>

          {result.itinerary.days.length > 0 && (
            <div>
              <p className="label-noir" style={{ marginBottom: "10px" }}>Your Stay Plan</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {result.itinerary.days.map((day: Day, i: number) => (
                  <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <DayBlock day={day} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.rv_parks.length > 0 && (
            <div>
              <p className="label-noir" style={{ marginBottom: "10px" }}>🏕️ RV Parks — Big Rig Friendly</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {result.rv_parks.map((park: RVPark, i: number) => (
                  <RVParkCard key={i} park={park} nights={nights} />
                ))}
              </div>
            </div>
          )}

          {result.itinerary.tips && result.itinerary.tips.length > 0 && (
            <BentoCard>
              <p className="label-noir" style={{ marginBottom: "10px" }}>Travel Tips</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {result.itinerary.tips.map((tip: string, i: number) => (
                  <p key={i} style={{ color: "#a1a1aa", fontSize: "0.875rem", lineHeight: 1.5 }}>{tip}</p>
                ))}
              </div>
            </BentoCard>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-ghost" type="button">
              <Download size={14} />Download Plan (.md)
            </button>
          </div>
        </div>
      )}

      {!result && !loading && <EmptyState />}
    </div>
  );
}

// ─── Full-Time Tab ────────────────────────────────────────────────
function FullTimeTab() {
  const [destination, setDestination] = useState("Sedona, AZ");
  const [result, setResult] = useState<ExploreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doSearch = useCallback(async (city: string, state: string) => {
    let cancelled = false;
    setResult(null);
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDestination(city, state, 30);
      if (!cancelled) setResult(data);
    } catch {
      if (!cancelled) setError("Failed to load lifestyle data");
    } finally {
      if (!cancelled) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDestination("Sedona", "AZ", 30);
        if (!cancelled) setResult(data);
      } catch {
        if (!cancelled) setError("Failed to load Sedona lifestyle data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function handleSearch() {
    if (!destination.trim()) return;
    const parts = destination.split(",").map((p) => p.trim());
    await doSearch(parts[0] || "Sedona", parts[1] || "AZ");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Location Search */}
      <BentoCard hoverLift={false}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <p className="label-noir" style={{ marginBottom: "4px" }}>🌎 Full-Time RV Life Analysis</p>
            <p style={{ color: "#52525b", fontSize: "0.75rem" }}>Operations dashboard for living on the road</p>
          </div>
          {result && (
            <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "9999px", padding: "4px 10px" }}>
              <span style={{ color: "#4ade80", fontSize: "0.625rem", fontWeight: 600, letterSpacing: "0.06em" }}>● LIVE DATA</span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className="label-noir">Destination</label>
            <input
              className="input-noir"
              type="text"
              placeholder="City, State (e.g. Sedona, AZ)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
            />
          </div>
          <button
            className="btn-primary"
            type="button"
            onClick={handleSearch}
            disabled={loading}
            style={{ flexShrink: 0, height: "42px", alignSelf: "flex-end" }}
          >
            {loading ? <><LoadingSpinner />Loading...</> : <><LifeBuoy size={15} />Analyze</>}
          </button>
        </div>

        {/* Lifestyle categories legend */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #18181b" }}>
          {["🌡️ Climate", "💰 Cost", "📶 Connectivity", "🏥 Services", "🐾 Pets", "⛽ Fuel", "🚿 Dump Stations", "📋 State Laws", "🎉 Events"].map((cat) => (
            <span key={cat} style={{ color: "#52525b", fontSize: "0.6875rem", background: "#09090b", border: "1px solid #18181b", padding: "3px 8px", borderRadius: "6px" }}>
              {cat}
            </span>
          ))}
        </div>
      </BentoCard>

      {/* Loading Skeleton */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <BentoGrid cols={4}>
            {[0,1,2,3].map(i => <div key={i} className="skeleton" style={{ height: "88px", borderRadius: "10px" }} />)}
          </BentoGrid>
          <div className="grid-2-col">
            <div className="skeleton" style={{ height: "320px", borderRadius: "10px" }} />
            <div className="skeleton" style={{ height: "320px", borderRadius: "10px" }} />
          </div>
        </div>
      )}

      {/* Error with retry */}
      {error && (
        <BentoCard>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <AlertTriangle size={16} style={{ color: "#f87171", flexShrink: 0 }} />
            <p style={{ color: "#f87171", fontSize: "0.875rem", flex: 1 }}>{error}</p>
            <button className="btn-ghost" type="button" onClick={handleSearch} style={{ fontSize: "0.75rem", padding: "6px 12px" }}>
              Retry
            </button>
          </div>
        </BentoCard>
      )}

      {/* Dashboard */}
      {result && !loading && <LifestyleDashboard result={result} />}

      {/* Empty State */}
      {!result && !loading && (
        <BentoCard>
          <p style={{ color: "#71717a", fontSize: "0.875rem", textAlign: "center", padding: "24px" }}>
            Enter a destination above to analyze full-time RV living conditions
          </p>
        </BentoCard>
      )}
    </div>
  );
}

// ─── Planner Tab ──────────────────────────────────────────────────
function PlannerTab() {
  const [start, setStart] = useState("Bella Vista, AR");
  const [end, setEnd] = useState("");
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handlePlanRoute = useCallback(async () => {
    if (!start.trim() || !end.trim()) return;
    let cancelled = false;
    setRoutes([]);
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      // Try Railway route API first
      let routeData: Route[] = [];
      try {
        const res = await fetch(
          `https://rv-trip-optimizer.railway.app/api/route?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
          { signal: AbortSignal.timeout(8000) }
        );
        if (res.ok) routeData = await res.json();
      } catch {
        // Railway unavailable — build routes locally
      }

      if (cancelled) return;

      if (routeData.length === 0) {
        // Build mock routes as fallback
        const mockRoutes: Route[] = [
          buildMockRoute(start, end, "Primary", 0),
          buildMockRoute(start, end, "Scenic", 1),
          buildMockRoute(start, end, "Alternate", 2),
        ];
        setRoutes(mockRoutes);
      } else {
        setRoutes(routeData);
      }
    } catch {
      if (!cancelled) setError("Failed to plan route. Check your connection.");
    } finally {
      if (!cancelled) setLoading(false);
    }
  }, [start, end]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Route Form */}
      <BentoCard hoverLift={false}>
        <p className="label-noir" style={{ marginBottom: "14px" }}>Plan a Multi-Day Route</p>
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 160px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className="label-noir">Start</label>
            <input
              className="input-noir"
              type="text"
              placeholder="Bella Vista, AR"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handlePlanRoute(); }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", color: "#3f3f46", paddingBottom: "10px", flexShrink: 0 }}>
            <ArrowRight size={16} />
          </div>
          <div style={{ flex: "1 1 160px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className="label-noir">Destination</label>
            <input
              className="input-noir"
              type="text"
              placeholder="Sedona, AZ"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handlePlanRoute(); }}
            />
          </div>
          <button
            className="btn-primary"
            type="button"
            onClick={handlePlanRoute}
            disabled={loading || !start.trim() || !end.trim()}
            style={{ flexShrink: 0, height: "42px", alignSelf: "flex-end" }}
          >
            {loading ? <><LoadingSpinner />Planning...</> : <><Compass size={15} />Plan Route</>}
          </button>
        </div>

        {/* Vehicle Profile */}
        <details style={{ border: "1px solid #27272a", borderRadius: "8px", padding: "14px 16px", marginTop: "14px" }}>
          <summary style={{ color: "#71717a", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", cursor: "pointer", userSelect: "none" }}>
            Vehicle Profile — Brinkley 4100
          </summary>
          <div className="grid-2-col" style={{ gap: "12px", marginTop: "14px" }}>
            {[
              { label: "Length", value: "43 ft (Fifth Wheel)" },
              { label: "Height", value: "13' 6\"" },
              { label: "Tow Vehicle", value: "Ram 3500 Dually" },
              { label: "Pet", value: "Theo 🐾" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="label-noir">{label}</p>
                <p style={{ color: "#d4d4d8", fontSize: "0.875rem", marginTop: "2px" }}>{value}</p>
              </div>
            ))}
          </div>
        </details>
      </BentoCard>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[{ label: "Primary Route", w: "100%" }, { label: "Scenic Route", w: "85%" }, { label: "Alternate", w: "70%" }].map(({ label, w }) => (
            <div key={label} className="skeleton" style={{ height: "80px", borderRadius: "10px", width: w }} />
          ))}
        </div>
      )}

      {/* Error with retry */}
      {error && (
        <BentoCard>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <AlertTriangle size={16} style={{ color: "#f87171", flexShrink: 0 }} />
            <p style={{ color: "#f87171", fontSize: "0.875rem", flex: 1 }}>{error}</p>
            <button className="btn-ghost" type="button" onClick={handlePlanRoute} style={{ fontSize: "0.75rem", padding: "6px 12px" }}>Retry</button>
          </div>
        </BentoCard>
      )}

      {/* Route Results */}
      {!loading && routes.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <p className="label-noir">🚐 Route Options — {start} → {end}</p>
          {routes.map((route) => (
            <BentoCard key={route.id} hoverLift>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
                {/* Route badge */}
                <div style={{
                  backgroundColor: route.name === "Primary" ? "rgba(59,130,246,0.12)" : route.name === "Scenic" ? "rgba(34,197,94,0.12)" : "rgba(234,179,8,0.12)",
                  border: `1px solid ${route.name === "Primary" ? "rgba(59,130,246,0.3)" : route.name === "Scenic" ? "rgba(34,197,94,0.3)" : "rgba(234,179,8,0.3)"}`,
                  borderRadius: "8px",
                  padding: "8px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: "72px",
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: route.name === "Primary" ? "#60a5fa" : route.name === "Scenic" ? "#4ade80" : "#facc15" }}>
                    {route.name.toUpperCase()}
                  </span>
                  <span style={{ fontSize: "1.25rem", fontWeight: 600, color: "#fafafa", marginTop: "2px" }}>
                    {route.score}/10
                  </span>
                </div>

                {/* Route info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "8px" }}>
                    <div>
                      <p className="label-noir">Distance</p>
                      <p style={{ color: "#fafafa", fontSize: "0.875rem", fontWeight: 500 }}>{route.distance_mi.toLocaleString()} mi</p>
                    </div>
                    <div>
                      <p className="label-noir">Est. Time</p>
                      <p style={{ color: "#fafafa", fontSize: "0.875rem", fontWeight: 500 }}>{formatHours(route.duration_h)}</p>
                    </div>
                    {route.is_toll && (
                      <div>
                        <span style={{ backgroundColor: "rgba(234,179,8,0.12)", color: "#facc15", fontSize: "0.625rem", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>
                          💳 TOLLS
                        </span>
                      </div>
                    )}
                  </div>

                  {route.warnings && route.warnings.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {route.warnings.map((w, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <AlertTriangle size={12} style={{ color: "#f97316", flexShrink: 0 }} />
                          <p style={{ color: "#f97316", fontSize: "0.75rem" }}>{w}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </BentoCard>
          ))}

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-ghost" type="button">
              <Download size={14} />Export Route
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !searched && (
        <BentoCard>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", gap: "12px" }}>
            <Navigation size={32} style={{ color: "#27272a" }} />
            <p style={{ color: "#3f3f46", fontSize: "0.875rem", textAlign: "center" }}>
              Enter your start point and destination above to generate route options
            </p>
          </div>
        </BentoCard>
      )}

      {!loading && searched && routes.length === 0 && !error && (
        <BentoCard>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", gap: "12px" }}>
            <AlertTriangle size={32} style={{ color: "#f97316" }} />
            <p style={{ color: "#71717a", fontSize: "0.875rem", textAlign: "center" }}>
              No routes found. Try different cities.
            </p>
          </div>
        </BentoCard>
      )}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────

function buildMockRoute(start: string, end: string, name: "Primary" | "Scenic" | "Alternate", idx: number): Route {
  const distances = [847, 924, 891];
  const hours = [12.5, 14.2, 13.8];
  const scores = [8, 7, 6];
  const hasToll = idx === 0;
  const warnings: string[] = [];
  if (idx === 1) warnings.push("I-40 construction zone near Flagstaff — expect 30 min delay");
  if (hasToll) warnings.push("Oklahoma Turnpike — ~$18 in tolls for Ram 3500");
  warnings.push("Wolf Lake Rest Area — only certified weigh stations within 200 mi");

  return {
    id: `route-${idx}`,
    name,
    distance_mi: distances[idx],
    duration_h: hours[idx],
    score: scores[idx],
    is_toll: hasToll,
    toll_note: hasToll ? "~$18 Oklahoma Turnpike" : undefined,
    warnings,
    geometry: [],
  };
}

function formatHours(h: number): string {
  const whole = Math.floor(h);
  const mins = Math.round((h - whole) * 60);
  if (mins === 0) return `${whole}h`;
  return `${whole}h ${mins}m`;
}

// ─── Loading Spinner ──────────────────────────────────────────────
function LoadingSpinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" stroke="#60a5fa" strokeWidth="3" strokeDasharray="31.4 31.4" />
    </svg>
  );
}

// ─── Loading Skeleton ────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <BentoGrid cols={4}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: "80px", borderRadius: "10px" }} />
        ))}
      </BentoGrid>
      <div className="skeleton" style={{ height: "200px", borderRadius: "10px" }} />
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────
function EmptyState() {
  return (
    <BentoCard>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <div>
          <p style={{ color: "#71717a", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "10px" }}>
            How it works
          </p>
          {[
            "Enter any US city or destination",
            "We find top attractions, dining, RV parks",
            "AI builds a day-by-day itinerary",
            "Respects your weekday 2-3 hr work window",
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }}>
              <span style={{ color: "#3b82f6", fontSize: "0.75rem", fontWeight: 700, minWidth: "18px" }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ color: "#a1a1aa", fontSize: "0.875rem", lineHeight: 1.4 }}>{step}</span>
            </div>
          ))}
        </div>
        <div>
          <p style={{ color: "#71717a", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "10px" }}>
            Weeknight vs Weekend
          </p>
          {[
            { icon: "📅", label: "Weekdays", desc: "2-3 hrs max (remote work)" },
            { icon: "🌅", label: "Weekends", desc: "Full exploration days" },
            { icon: "🏕️", label: "Big Rig", desc: "43ft Brinkley 4100 filtered" },
            { icon: "🍽", label: "Dining", desc: "Local picks with RV parking" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "0.875rem" }}>{item.icon}</span>
              <div>
                <p style={{ color: "#d4d4d8", fontSize: "0.8125rem", fontWeight: 500 }}>{item.label}</p>
                <p style={{ color: "#52525b", fontSize: "0.75rem" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BentoCard>
  );
}
