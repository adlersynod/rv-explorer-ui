import { MapPin, Compass, Calendar, Download } from "lucide-react";
import { BentoCard, BentoGrid } from "./components/BentoCard";
import { MetricCard } from "./components/MetricCard";
import { TabBar } from "./components/TabBar";
import { DayBlock } from "./components/DayBlock";
import { RVParkCard } from "./components/RVParkCard";
import { StayPlan } from "./lib/types";
import { formatDuration, formatMiles } from "./lib/utils";
import { useState } from "react";

// ─── Mock data ───────────────────────────────────────────────────
const MOCK_STAY: StayPlan = {
  destination: "Sedona, AZ",
  stay_duration: "3-night weekend getaway",
  estimated_hours: 12,
  available_hours: 18,
  days: [
    {
      label: "Day 1 — Friday Evening",
      slots: [
        { time: "Morning", activity: "Check intoRV park + settle", duration: "1 hr" },
        { time: "Afternoon", activity: "Sunset at Airport Mesa Vortex", duration: "2-3 hrs", item: { name: "Airport Mesa", category: "Nature", rating: 4.8, source: "Yelp" } },
        { time: "Evening", activity: "Dinner at Elote Cafe", duration: "1.5 hrs", item: { name: "Elote Cafe", category: "Restaurant", rating: 4.7, source: "Yelp" } },
      ],
    },
    {
      label: "Day 2 — Saturday (Full Day)",
      slots: [
        { time: "Morning", activity: "Devil's Bridge Trail", duration: "2-3 hrs", item: { name: "Devil's Bridge", category: "Hiking", rating: 4.9, source: "NPS" } },
        { time: "Midday", activity: "Lunch at Hudson", duration: "1 hr", item: { name: "Hudson", category: "Restaurant", rating: 4.5, source: "Yelp" } },
        { time: "Afternoon", activity: "Chapel of the Holy Cross", duration: "1-2 hrs", item: { name: "Chapel of the Holy Cross", category: "Culture", rating: 4.8, source: "Wikipedia" } },
        { time: "Evening", activity: "Pink Jeep Tour sunset", duration: "2 hrs", item: { name: "Pink Jeep Tours", category: "Tour", rating: 4.6, source: "Yelp" } },
      ],
    },
    {
      label: "Day 3 — Sunday (Half Day)",
      slots: [
        { time: "Morning", activity: "Coffee + Slideshow at Sedona Heritage Museum", duration: "1.5 hrs", item: { name: "Sedona Heritage Museum", category: "Museum", rating: 4.4, source: "NPS" } },
        { time: "Afternoon", activity: "Broken Arrow Trail (scenic drive + short hike)", duration: "2 hrs", item: { name: "Broken Arrow Trail", category: "Hiking", rating: 4.7, source: "NPS" } },
      ],
    },
  ],
  rv_parks: [
    {
      name: "Pine Valley RV Resort",
      price: "72",
      rating: 4.6,
      category: "RV Resort",
      big_rig_friendly: true,
      url: "#",
    },
    {
      name: "Munds Park Campground",
      price: "38",
      rating: 4.3,
      category: "National Forest",
      big_rig_friendly: true,
      url: "#",
    },
    {
      name: "Canyon Portal RV Park",
      price: "55",
      rating: 4.5,
      category: "RV Park",
      big_rig_friendly: true,
      url: "#",
    },
  ],
  tips: [
    "🌅 Arrive mid-afternoon to check in before dark",
    "🥾 Pack layers — Sedona varies 45°F in same day",
    "🍺 Visit Sedona Beer Garden for local brews",
    "🚐 Give 30 min buffer for parking at vortex sites",
  ],
};

// ─── Explorer Tab ─────────────────────────────────────────────────
function ExplorerTab() {
  const [destination, setDestination] = useState("");
  const [nights, setNights] = useState(2);
  const [result, setResult] = useState<StayPlan | null>(null);

  function handleExplore() {
    if (!destination.trim()) return;
    // In production: call API → setResult(data)
    // Demo: use mock
    setResult(MOCK_STAY);
  }

  const nightsOptions = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* ── Search Block ─────────────────────────────────── */}
      <BentoCard hoverLift={false}>
        <p className="label-noir" style={{ marginBottom: "14px" }}>
          Where do you want to go?
        </p>

        <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{
                color: "#71717a",
                fontSize: "0.6875rem",
                fontWeight: 500,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Destination
            </label>
            <input
              className="input-noir"
              type="text"
              placeholder="City, State (e.g. Sedona, AZ)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleExplore()}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{
                color: "#71717a",
                fontSize: "0.6875rem",
                fontWeight: 500,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Nights
            </label>
            <div style={{ display: "flex", gap: "4px" }}>
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
            style={{ flexShrink: 0, height: "42px", alignSelf: "flex-end" }}
          >
            <MapPin size={15} />
            Explore
          </button>
        </div>
      </BentoCard>

      {/* ── Results ──────────────────────────────────────── */}
      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Summary Bento */}
          <BentoGrid cols={4}>
            <MetricCard
              value={result.destination}
              label="Destination"
              accent
            />
            <MetricCard
              value={result.stay_duration}
              label="Recommended"
            />
            <MetricCard
              value={result.days.length + " days"}
              label="Stay"
            />
            <MetricCard
              value={result.rv_parks.length}
              label="RV Parks"
              badge="Filtered"
              badgeVariant="success"
            />
          </BentoGrid>

          {/* Itinerary */}
          <div>
            <p className="label-noir" style={{ marginBottom: "10px" }}>
              Your Stay Plan
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {result.days.map((day, i) => (
                <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <DayBlock day={day} />
                </div>
              ))}
            </div>
          </div>

          {/* RV Parks */}
          {result.rv_parks.length > 0 && (
            <div>
              <p className="label-noir" style={{ marginBottom: "10px" }}>
                RV Parks — Big Rig Friendly
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {result.rv_parks.map((park, i) => (
                  <RVParkCard key={i} park={park} nights={nights} />
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {result.tips && result.tips.length > 0 && (
            <BentoCard>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <p className="label-noir">Travel Tips</p>
                {result.tips.map((tip, i) => (
                  <p
                    key={i}
                    style={{
                      color: "#a1a1aa",
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {tip}
                  </p>
                ))}
              </div>
            </BentoCard>
          )}

          {/* Download */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-ghost" type="button">
              <Download size={14} />
              Download Plan (.md)
            </button>
          </div>
        </div>
      )}

      {/* ── Empty State ───────────────────────────────────── */}
      {!result && (
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
                  <span style={{ color: "#3b82f6", fontSize: "0.75rem", fontWeight: 700, minWidth: "18px" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
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
      )}
    </div>
  );
}

// ─── Planner Tab ──────────────────────────────────────────────────
function PlannerTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <BentoCard>
        <p className="label-noir" style={{ marginBottom: "14px" }}>
          Plan a Multi-Day Route
        </p>

        {/* Route inputs */}
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", marginBottom: "16px" }}>
          <div style={{ flex: 1 }}>
            <label className="label-noir" style={{ marginBottom: "6px", display: "block" }}>Start</label>
            <input className="input-noir" type="text" placeholder="Bella Vista, AR" />
          </div>
          <div style={{ display: "flex", alignItems: "center", color: "#3f3f46", padding: "0 4px", paddingBottom: "10px" }}>
            →
          </div>
          <div style={{ flex: 1 }}>
            <label className="label-noir" style={{ marginBottom: "6px", display: "block" }}>Destination</label>
            <input className="input-noir" type="text" placeholder="Austin, TX" />
          </div>
          <button className="btn-primary" type="button" style={{ height: "42px", flexShrink: 0 }}>
            <Compass size={15} />
            Plan Route
          </button>
        </div>

        {/* Vehicle profile */}
        <details
          style={{
            border: "1px solid #27272a",
            borderRadius: "8px",
            padding: "14px 16px",
          }}
        >
          <summary
            style={{
              color: "#71717a",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            Vehicle Profile — Brinkley 4100
          </summary>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginTop: "14px",
            }}
          >
            {[
              { label: "Length", value: "43 ft (Fifth Wheel)" },
              { label: "Height", value: '13\' 6"' },
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

      {/* Placeholder results */}
      <BentoCard>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 24px",
            gap: "12px",
          }}
        >
          <Compass size={32} style={{ color: "#27272a" }} />
          <p style={{ color: "#3f3f46", fontSize: "0.875rem", textAlign: "center" }}>
            Enter start + destination above to generate route options
          </p>
        </div>
      </BentoCard>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("explorer");

  return (
    <div
      style={{
        backgroundColor: "#000000",
        minHeight: "100dvh",
        padding: "20px",
      }}
    >
      {/* Container */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* ── Header ──────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "#fafafa",
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
              }}
            >
              📍 RV Explorer
            </h1>
            <p
              style={{
                color: "#52525b",
                fontSize: "0.75rem",
                marginTop: "4px",
                letterSpacing: "0.01em",
              }}
            >
              Destination-first planning · Brinkley 4100 · Full-time RV life
            </p>
          </div>

          {/* Status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.15)",
              borderRadius: "9999px",
              padding: "6px 12px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#22c55e",
                boxShadow: "0 0 0 3px rgba(34,197,94,0.15)",
                flexShrink: 0,
              }}
              className="glow-pulse"
            />
            <span
              style={{
                color: "#4ade80",
                fontSize: "0.6875rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Deployed
            </span>
          </div>
        </div>

        {/* ── Tab Bar ─────────────────────────────────────── */}
        <TabBar
          tabs={[
            {
              id: "explorer",
              label: "RV Explorer",
              icon: <MapPin size={14} />,
              badge: "New",
            },
            {
              id: "planner",
              label: "Trip Planner",
              icon: <Compass size={14} />,
            },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* ── Tab Content ─────────────────────────────────── */}
        {activeTab === "explorer" ? <ExplorerTab /> : <PlannerTab />}

        {/* ── Footer ──────────────────────────────────────── */}
        <footer
          style={{
            borderTop: "1px solid #18181b",
            paddingTop: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <p style={{ color: "#3f3f46", fontSize: "0.6875rem" }}>
            Built for Adler Synod · Brinkley 4100 · Personal Use Only
          </p>
          <p
            style={{
              color: "#27272a",
              fontSize: "0.625rem",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "-0.01em",
            }}
          >
            ADLER NOIR v1.0.0
          </p>
        </footer>
      </div>
    </div>
  );
}
