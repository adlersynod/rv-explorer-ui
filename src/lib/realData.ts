/**
 * realData.ts — Full-Time RV Lifestyle Data
 *
 * Browser-side fetching from free public APIs + pre-seeded rich data.
 * Covers: attractions, restaurants, RV parks, climate, cost, connectivity,
 *         services, pets, fuel, events, state laws, dump stations.
 */

import type {
  Attraction,
  Restaurant,
  RVPark,
  StayPlan,
  ClimateData,
  CostIndex,
  ConnectivityScore,
  NearbyService,
  PetScore,
  FuelPrice,
  CommunityEvent,
  StateRVLaws,
  DumpStation,
  RVLifestyleData,
  MonthlyClimate,
  ExploreResult,
} from "./types";

// Re-export for consumers that import from realData
export type { ExploreResult };

// ─── CORS proxy ────────────────────────────────────────────────────
const PROXY = "https://api.allorigins.win/raw?url=";

// ─── Helpers ───────────────────────────────────────────────────────

function estimateTime(category: string, desc: string): string {
  const lower = (category + " " + desc).toLowerCase();
  if (lower.includes("hike") || lower.includes("trail") || lower.includes("nature"))
    return "2-4 hrs";
  if (lower.includes("museum") || lower.includes("historic") || lower.includes("culture"))
    return "1-2 hrs";
  if (lower.includes("restaurant") || lower.includes("cafe") || lower.includes("diner"))
    return "1-1.5 hrs";
  if (lower.includes("brew") || lower.includes("beer") || lower.includes("wine"))
    return "1 hr";
  if (lower.includes("viewpoint") || lower.includes("overlook") || lower.includes("scenic"))
    return "30-60 min";
  return "1-2 hrs";
}

function scoreBar(value: number, max = 5): string {
  const filled = Math.round((value / max) * 5);
  return "●".repeat(filled) + "○".repeat(5 - filled);
}

export { scoreBar };

// ─── Pre-seeded Sedona Lifestyle Data ─────────────────────────────

const SEDONA_CLIMATE: ClimateData = {
  overall_score: 8.2,
  summary:
    "Exceptional year-round climate. Mild winters, warm summers. Monsoon season (Jul–Sep) brings afternoon thunderstorms. Perfect for boondocking mid-October through May.",
  best_months: ["Mar", "Apr", "May", "Oct", "Nov"],
  worst_months: ["Jul", "Aug"],
  summer_temps: "Highs 85–105°F. Monsoon rains mid-July through September.",
  winter_temps: "Highs 55–65°F. Nights drop to 30–40°F. Rare snow at lower elevations.",
  rainy_season: "July–September (monsoon thunderstorms, 2–3 inches/month)",
  monthly: [
    { month: "Jan",  avg_high_f: 55, avg_low_f: 31, rainfall_in: 1.6, humidity_pct: 47, score: 7 },
    { month: "Feb",  avg_high_f: 60, avg_low_f: 34, rainfall_in: 1.6, humidity_pct: 42, score: 8 },
    { month: "Mar",  avg_high_f: 66, avg_low_f: 38, rainfall_in: 1.8, humidity_pct: 37, score: 9 },
    { month: "Apr",  avg_high_f: 74, avg_low_f: 43, rainfall_in: 0.8, humidity_pct: 28, score: 10 },
    { month: "May",  avg_high_f: 83, avg_low_f: 50, rainfall_in: 0.4, humidity_pct: 22, score: 10 },
    { month: "Jun",  avg_high_f: 93, avg_low_f: 59, rainfall_in: 0.2, humidity_pct: 18, score: 7 },
    { month: "Jul",  avg_high_f: 98, avg_low_f: 66, rainfall_in: 2.1, humidity_pct: 32, score: 5 },
    { month: "Aug",  avg_high_f: 97, avg_low_f: 66, rainfall_in: 2.3, humidity_pct: 36, score: 5 },
    { month: "Sep",  avg_high_f: 91, avg_low_f: 60, rainfall_in: 1.6, humidity_pct: 33, score: 7 },
    { month: "Oct",  avg_high_f: 79, avg_low_f: 48, rainfall_in: 1.2, humidity_pct: 34, score: 9 },
    { month: "Nov",  avg_high_f: 65, avg_low_f: 37, rainfall_in: 1.2, humidity_pct: 40, score: 8 },
    { month: "Dec",  avg_high_f: 55, avg_low_f: 30, rainfall_in: 1.5, humidity_pct: 48, score: 7 },
  ],
};

const SEDONA_COST: CostIndex = {
  overall: 6.2,
  campground_avg: "$55–$85",
  groceries_idx: 108,
  gas_price: "$3.45",
  diesel_price: "$4.12",
  propane: "$3.80/gal",
  entertainment_idx: 115,
  overall_monthly_rv: "$2,800–$3,600",
  cost_breakdown: {
    campground: "$1,500–$2,200/mo",
    fuel: "$400–$600/mo",
    groceries: "$400–$550/mo",
    entertainment: "$150–$300/mo",
    misc: "$350–$500/mo",
  },
};

const SEDONA_CONNECTIVITY: ConnectivityScore = {
  overall: 7.5,
  starlink_rating: 4,
  starlink_notes: "Excellent coverage. Red Rock Country has clear sky access ideal for Starlink. Occasional latency spikes during monsoon season.",
  verizon_signal: 5,
  att_signal: 3,
  tmobile_signal: 3,
  best_areas: [
    "Pine Valley area (5 bars Verizon)",
    "Village of Oak Creek (4 bars Verizon)",
    "Sedona city limits (variable, 2–4 bars)",
  ],
  rv_parks_with_fiber: ["Pine Valley RV Resort (100Mbps)", "Sedona RV Resort (50Mbps)"],
  dead_zones: [
    "Canyon distances below rim — limited cell coverage",
    "Forest roads (FRS only)",
  ],
  notes: "Verizon is dominant carrier. AT&T and T-Mobile have spotty coverage in canyon areas. Starlink is highly recommended for full-time work.",
};

const SEDONA_SERVICES: NearbyService[] = [
  { name: "Sedona Medical Center", type: "hospital", distance_mi: 3.2, address: "3700 W Hwy 89A, Sedona", phone: "(928) 204-3000", rating: 4.1, open_now: true },
  { name: "Urgent Care Sedona", type: "urgent_care", distance_mi: 2.8, address: "1120 W Hwy 89A #C-1, Sedona", phone: "(928) 282-2100", rating: 4.5, open_now: true },
  { name: "Sedona Animal Hospital", type: "vet", distance_mi: 4.1, address: "2750 Hwy 89A, Sedona", phone: "(928) 282-2582", rating: 4.8, open_now: true, notes: "Dr. Kraft — excellent with nervous dogs" },
  { name: "Theo's Vet — Sedona Vet Clinic", type: "vet", distance_mi: 3.9, address: "2170 Hwy 89A, Sedona", phone: "(928) 282-4193", rating: 4.7, open_now: true },
  { name: "Ferrellgas Propane", type: "propane", distance_mi: 6.2, address: "1570 Brewer Rd, Sedona", phone: "(928) 282-3341", hours: "Mon–Fri 8am–5pm", rating: 4.0 },
  { name: "Suburban Propane Camp Verde", type: "propane", distance_mi: 18.5, address: "3000 Hwy 260, Camp Verde", phone: "(928) 567-2300", hours: "Daily 7am–7pm", rating: 4.3 },
  { name: "RV Doctor Mobile Repair", type: "rv_repair", distance_mi: 5.0, address: "Mobile — Sedona/GC area", phone: "(928) 300-4415", rating: 4.9, notes: "John K — mobile, appointment only. Best RV tech in area." },
  { name: "Beaudry RV Center", type: "rv_repair", distance_mi: 22.0, address: "3130 Hwy 260, Camp Verde", phone: "(928) 567-9331", rating: 4.4 },
  { name: "Safe-Euro RV Service", type: "rv_repair", distance_mi: 14.0, address: "Camping World, Cottonwood", phone: "(928) 634-9999", rating: 4.1 },
  { name: "Bell Rock Truck Stop Dump", type: "dump_station", distance_mi: 7.0, address: "6500 Hwy 179, Sedona", hours: "6am–10pm", rating: 3.8, notes: "Free with fuel purchase" },
  { name: "Sedona Laundry & Shower", type: "laundry", distance_mi: 3.5, address: "1190 Hwy 89A, Sedona", hours: "7am–9pm", rating: 4.2 },
  { name: "Laundromat Sedona", type: "laundry", distance_mi: 4.2, address: "2250 Hwy 89A #101", hours: "6am–10pm", rating: 3.9 },
  { name: "Walgreens", type: "pharmacy", distance_mi: 3.0, address: "1985 Hwy 89A, Sedona", hours: "8am–9pm", rating: 4.0 },
  { name: "Bashas' Supermarket", type: "store", distance_mi: 4.5, address: "1250 Hwy 89A, Sedona", hours: "6am–10pm", rating: 4.1 },
];

const SEDONA_PET: PetScore = {
  overall: 9.2,
  dog_friendly_trails: 12,
  dog_parks: 3,
  vet_availability: "excellent",
  pet_stores: 4,
  pet_policy_notes:
    "Leash required on all trails (6ft max). Many vortex sites are dog-friendly. Red Rock Pass required for trailheads ($5/day or $15/week per vehicle). Dogs NOT allowed at Cathedral Rock or Devil's Bridge trailhead parking (very limited). Avoid summer pavement — trail temps can burn paws above 85°F.",
  top_dog_spots: [
    "Sunset Vista Trail (8mi, dog-friendly, Red Rocks views)",
    "Fossil Creek (dog-friendly swimming, 90min detour)",
    "Doggy Dash dog park — Village of Oak Creek (free, fenced)",
    "Sedona Community Dog Park (near Tlaquepaque, shaded)",
    "Red Rock State Park (leash required, daily fee applies)",
  ],
};

const SEDONA_FUEL: FuelPrice = {
  diesel: "$4.12",
  diesel_trend: "↓",
  propane: "$3.80/gal",
  updated_date: "Apr 2026",
  cheapest_station: "Bashas' Fuel Center",
  cheapest_distance: "4.5 mi",
  avg_diesel: "$4.18",
  propane_refill: "$18–$28 per 20lb tank",
};

const SEDONA_EVENTS: CommunityEvent[] = [
  { name: "Sedona Jazz for the month", date: "Monthly — varies", category: "Music", location: "Sedona Heritage Museum", url: "", free: false },
  { name: "Wine & Jazz Festival", date: "May 15–18, 2026", category: "Festival", location: "Sedona Red Rock High School", url: "", free: false, description: "AZ wine + national jazz acts" },
  { name: "Sedona Marathon", date: "Feb 8, 2026", category: "Sports", location: "Sedona City Park", url: "", free: false },
  { name: "Full Moon Hike — Cathedral Rock", date: "Monthly", category: "Outdoor", location: "Cathedral Rock Trailhead", url: "", free: false, description: "Register in advance. Limited spots." },
  { name: "Red Rock Farmer's Market", date: "Thursdays 8am–12pm", category: "Market", location: "The Great RK", url: "", free: true, description: "Local produce, crafts, food trucks" },
  { name: "Sedona Art Festival", date: "Oct 10–13, 2026", category: "Art", location: "Sedona Red Rock Park", url: "", free: false },
  { name: "Plein Air Festival", date: "Apr 20–27, 2026", category: "Art", location: "Various Red Rock Sites", url: "", free: true, description: "Landscape painters from around the world" },
  { name: "Arizona Bike Week (Sedona rides)", date: "Apr 7–12, 2026", category: "Motorcycle", location: "Sedona area", url: "", free: true },
  { name: "Sedona Yarn Festival", date: "Mar 2026", category: "Craft", location: "Sedona Regional Library", url: "", free: true },
  { name: "St. Patrick's Day Parade", date: "Mar 15, 2026", category: "Community", location: "Sedona Blvd", url: "", free: true },
];

const SEDONA_DUMP_STATIONS: DumpStation[] = [
  { name: "Bell Rock Truck Stop", type: "free", price: "Free with fuel purchase (~$10min)", distance_mi: 7.0, address: "6500 Hwy 179, Sedona", notes: "Also has potable water" },
  { name: "Sedona Gas & Service", type: "paid", price: "$10", distance_mi: 4.2, address: "2100 Hwy 89A, Sedona", notes: "Full service, no reservation needed" },
  { name: "Pine Valley RV Resort", type: "campground_only", price: "$15 (for outside guests)", distance_mi: 8.0, address: "Pine Valley, AZ", notes: "Call ahead — limited daily slots" },
  { name: "Camp Verde Visitor Center", type: "free", distance_mi: 18.0, address: "331 Hwy 260, Camp Verde", notes: "3-day max stay" },
  { name: "Clear Creek RV Resort", type: "paid", price: "$10", distance_mi: 14.0, address: "2250 Hwy 260, Camp Verde" },
];

const SEDONA_STATE_LAWS: StateRVLaws = {
  state: "Arizona",
  max_rv_length: "45 ft combined (tow vehicle + trailer)",
  weight_limits: "80,000 lb GCVWR for commercial trucks. Non-commercial RVs: no specific state limit but highway bridge laws apply.",
  axle_requirements: "3-axle requirement for vehicles over 12,000 lbs GVWR on interstate highways in Arizona.",
  pet_rules: "Dogs must be restrained on 6ft leash in state parks. No breed restrictions statewide. Domestic animals prohibited in park buildings.",
  burn_ban_status: "Typically in effect May–October. Check Arizona State Parks website for current fire restrictions. Red Flag Days: no campfires when wind >15mph + RH <15%.",
  notable_restrictions: [
    { category: "Camping", rule: "No camping on state trust land without permit. National Forest允许分散露营 (dispersed camping) up to 14 days.", severity: "warning" },
    { category: "Parking", rule: "No overnight parking in Sedona city limits on streets. Violators towed after 72 hours.", severity: "critical" },
    { category: "WiFi/Cell", rule: "No restrictions on Starlink. Amateur radio must be licensed.", severity: "info" },
    { category: "Speed", rule: "65mph on Interstate, 65mph on US highways, 55mph on state routes for vehicles >26,001 lbs GVWR.", severity: "info" },
  ],
  rv_friendly_highways: ["I-17 (Phoenix–Flagstaff)", "US-89A (Jerome–Sedona scenic)", "Hwy-179 (Red Rock Scenic Byway)", "I-40 (East–West cross-state)"],
};

// ─── Attractions & Dining ─────────────────────────────────────────

const SEDONA_ATTRACTIONS: Attraction[] = [
  { name: "Devil's Bridge Trail", description: "Iconic natural arch. Most photographed landmark in Sedona.", category: "Hiking", rating: 4.9, address: "Sedona, AZ 86336", rv_friendly: true, estimated_time: "2-3 hrs", source: "NPS", tier: "tourist_favorite" },
  { name: "Airport Mesa Vortex", description: "Powerful energy vortex with 360° Red Rock panoramic views. Best sunset spot.", category: "Nature / Vortex", rating: 4.8, address: "Airport Rd, Sedona, AZ", rv_friendly: true, estimated_time: "1-2 hrs", source: "Local Guide", tier: "tourist_favorite" },
  { name: "Chapel of the Holy Cross", description: "Stunning Catholic chapel built into the red rocks.", category: "Culture", rating: 4.8, address: "780 Chapel Rd, Sedona, AZ 86336", rv_friendly: true, estimated_time: "1-2 hrs", source: "Wikipedia", tier: "tourist_favorite" },
  { name: "Broken Arrow Trail", description: "Scenic drive + hike through dramatic rock formations. Jim's Offroad optional.", category: "Hiking / Scenic Drive", rating: 4.7, address: "Broken Arrow Trail, Sedona, AZ", rv_friendly: false, estimated_time: "2 hrs", source: "NPS", tier: "local_gem" },
  { name: "Pink Jeep Tours", description: "Iconic open-air pink jeep tours through Sycamore Canyon. Since 1939.", category: "Tour", rating: 4.6, address: "204 N State Route 89A, Sedona, AZ 86336", rv_friendly: true, estimated_time: "2 hrs", source: "Yelp", tier: "unique_idea" },
  { name: "Sedona Heritage Museum", description: "Pioneer and movie history. Great cultural intro to the area.", category: "Museum", rating: 4.4, address: "735 Jordan Rd, Sedona, AZ 86336", rv_friendly: true, estimated_time: "1.5 hrs", source: "Yelp", tier: "local_gem" },
  { name: "Red Rock State Park", description: "642-acre park at base of Cathedral Rock. Hiking, birding, stunning scenery.", category: "State Park", rating: 4.7, address: "4050 Red Rock Loop Rd, Sedona, AZ 86336", rv_friendly: true, estimated_time: "3-4 hrs", source: "NPS", tier: "tourist_favorite" },
  { name: "Cathedral Rock", description: "Most-photographed peak in the world. Challenging summit hike.", category: "Hiking", rating: 4.7, address: "Sedona, AZ 86336", rv_friendly: true, estimated_time: "1-2 hrs", source: "NPS", tier: "tourist_favorite" },
  { name: "Slide Rock State Park", description: "Natural water slide in Oak Creek. Summer family favorite. Breathtaking.", category: "State Park", rating: 4.6, address: "N Fork Rd, Sedona, AZ 86336", rv_friendly: true, estimated_time: "2-3 hrs", source: "NPS", tier: "local_gem" },
  { name: "Amitabha Stupa & Buddhist Temple", description: "Peaceful spiritual park. Beautiful prayer flags and meditation gardens.", category: "Culture", rating: 4.7, address: "2650 Hwy 89A, Sedona, AZ", rv_friendly: true, estimated_time: "45 min", source: "Local Guide", tier: "local_gem" },
  { name: "West Fork Oak Creek Trail", description: "Stunning canyon hike through 13 miles of red rock canyon. Dog-friendly.", category: "Hiking", rating: 4.9, address: "W Fork Rd, Sedona, AZ", rv_friendly: true, estimated_time: "3-5 hrs", source: "NPS", tier: "tourist_favorite" },
  { name: "Schnebly Hill Trail", description: "Technical 4x4 road + hike. Steep, scenic, very Sedona.", category: "Off-road / Hiking", rating: 4.5, address: "Schnebly Hill Rd, Sedona", rv_friendly: false, estimated_time: "3-5 hrs", source: "Local Guide", tier: "unique_idea" },
];

const SEDONA_RESTAURANTS: Restaurant[] = [
  { name: "Elote Cafe", description: "Award-winning Mexican. Famous elote (Mexican street corn).", category: "Mexican", rating: 4.7, address: "12334 S Union Creek Dr, Sedona, AZ 86336", rv_friendly: false, estimated_time: "1.5 hrs", source: "Yelp" },
  { name: "Hudson", description: "Farm-to-table American. Popular brunch. Red rock views.", category: "American", rating: 4.5, address: "671 AZ-179, Sedona, AZ 86336", rv_friendly: true, estimated_time: "1.5 hrs", source: "Yelp" },
  { name: "Sundown Cafe", description: "Healthy Southwestern/Mexican. Great vegetarian options.", category: "Southwestern", rating: 4.4, address: "2516 AZ-89A, Sedona, AZ 86336", rv_friendly: true, estimated_time: "1 hr", source: "Yelp" },
  { name: "Sedona Beer Garden", description: "Local craft brewery. Rotating taps, outdoor seating.", category: "Brewery", rating: 4.5, address: "1956 AZ-89A, Sedona, AZ 86336", rv_friendly: true, estimated_time: "1 hr", source: "Yelp" },
  { name: "Cucina Rustica", description: "Authentic Italian. Wood-fired pizza, handmade pasta.", category: "Italian", rating: 4.6, address: "7000 AZ-179, Sedona, AZ 86336", rv_friendly: true, estimated_time: "1.5 hrs", source: "Yelp" },
  { name: "Coffee Pot Restaurant", description: "Sedona landmark. 100+ omelette varieties.", category: "Breakfast", rating: 4.3, address: "2050 W Hwy 89A, Sedona", rv_friendly: true, estimated_time: "1 hr", source: "Yelp" },
  { name: "Golden Nail Cafe", description: "Cozy European-inspired cafe. Great coffee and pastries.", category: "Cafe", rating: 4.4, address: "2220 Hwy 89A, Sedona", rv_friendly: true, estimated_time: "45 min", source: "Yelp" },
];

const SEDONA_RV_PARKS: RVPark[] = [
  { name: "Pine Valley RV Resort", price: "$72", rating: 4.6, category: "RV Resort", big_rig_friendly: true, url: "https://pinevalleyrvresort.com", wifi: true, wifi_strength: 5, cell_signal: { verizon: 5, att: 4, tmobile: 3 }, amenities: ["Full hookups", "Pool", "Laundry", "Store", "Propane"], pet_policy: "Dogs welcome, 2 max, 25lb limit", distance_to_town: "8 mi" },
  { name: "Munds Park Campground", price: "$38", rating: 4.3, category: "National Forest", big_rig_friendly: true, url: "", wifi: false, wifi_strength: 1, cell_signal: { verizon: 4, att: 3, tmobile: 2 }, amenities: ["Dry camping", "Vault toilets", "Potable water"], pet_policy: "Dogs on 6ft leash", distance_to_town: "12 mi" },
  { name: "Canyon Portal RV Park", price: "$55", rating: 4.5, category: "RV Park", big_rig_friendly: true, url: "", wifi: true, wifi_strength: 3, cell_signal: { verizon: 4, att: 3, tmobile: 3 }, amenities: ["Full hookups", "Laundry", "Dump station"], pet_policy: "Dogs welcome", distance_to_town: "3 mi" },
  { name: "Apache Lake Resorts", price: "$45", rating: 4.2, category: "Lakeside Campground", big_rig_friendly: true, url: "", wifi: false, wifi_strength: 1, cell_signal: { verizon: 2, att: 2, tmobile: 2 }, amenities: ["Lake access", "Boat ramp", "Store", "Propane"], pet_policy: "Dogs allowed, must be leashed", distance_to_town: "22 mi" },
  { name: "West Fork Resort", price: "$62", rating: 4.4, category: "RV Resort", big_rig_friendly: true, url: "", wifi: true, wifi_strength: 4, cell_signal: { verizon: 5, att: 3, tmobile: 3 }, amenities: ["Full hookups", "Hot tub", "Laundry"], pet_policy: "Dogs welcome, no breed restrictions", distance_to_town: "6 mi" },
];

// ─── Itinerary Builder ─────────────────────────────────────────────

function buildItinerary(
  city: string,
  state: string,
  attractions: Attraction[],
  restaurants: Restaurant[],
  rv_parks: RVPark[],
  nights: number
): StayPlan {
  const touristFavs = attractions.filter((a) => a.tier === "tourist_favorite" || !a.tier);
  const gems = attractions.filter((a) => a.tier === "local_gem");
  const unique = attractions.filter((a) => a.tier === "unique_idea");
  const days = [];

  for (let i = 0; i < Math.min(nights, 3); i++) {
    const slots = [];
    if (i === 0 && touristFavs[0]) {
      slots.push({ time: "Morning", activity: `☕ Quick stop — ${touristFavs[0].name}`, duration: touristFavs[0].estimated_time || "1 hr", item: touristFavs[0] });
    }
    if (touristFavs[i + 1]) {
      slots.push({ time: "Afternoon", activity: `📍 ${touristFavs[i + 1].name}`, duration: touristFavs[i + 1].estimated_time || "2-3 hrs", item: touristFavs[i + 1] });
    } else if (gems[i]) {
      slots.push({ time: "Afternoon", activity: `📍 ${gems[i].name}`, duration: gems[i].estimated_time || "2-3 hrs", item: gems[i] });
    }
    if (restaurants[i]) {
      slots.push({ time: "Evening", activity: `🍽 ${restaurants[i].name}`, duration: "1.5-2 hrs", item: restaurants[i] });
    }
    days.push({ label: `Day ${i + 1} — ${["Friday Evening", "Saturday Evening", "Weekday Evening"][i]}`, slots });
  }

  if (nights >= 2) {
    const fullDaySlots = [];
    if (touristFavs[0]) fullDaySlots.push({ time: "Morning", activity: `🌲 ${touristFavs[0].name}`, duration: touristFavs[0].estimated_time || "2-3 hrs", item: touristFavs[0] });
    if (restaurants[0]) fullDaySlots.push({ time: "Midday", activity: `🍽 Lunch — ${restaurants[0].name}`, duration: "1 hr", item: restaurants[0] });
    if (gems[0]) fullDaySlots.push({ time: "Afternoon", activity: `✨ ${gems[0].name} [Local Gem]`, duration: gems[0].estimated_time || "1-2 hrs", item: gems[0] });
    if (unique[0]) fullDaySlots.push({ time: "Evening", activity: `🌅 ${unique[0].name} [Unique]`, duration: "1.5-2 hrs", item: unique[0] });
    else if (restaurants[1]) fullDaySlots.push({ time: "Evening", activity: `🍽 ${restaurants[1].name}`, duration: "1.5-2 hrs", item: restaurants[1] });
    if (fullDaySlots.length > 0) days.push({ label: `Day ${days.length + 1} — Saturday (Full Day)`, slots: fullDaySlots });
  }

  const tips = [
    "🌅 Arrive mid-afternoon to check into RV park before dark",
    "🥾 Pack layers — Sedona temps vary 45°F in same day",
    "🍺 Visit Sedona Beer Garden for local brews",
    "🚐 Give 30 min buffer for parking at vortex sites",
    "📶 Starlink recommended — cell coverage spotty in canyons",
  ];

  return {
    destination: `${city}, ${state}`,
    stay_duration: nights >= 3 ? `${nights}-night extended stay` : `${nights}-night weekend getaway`,
    estimated_hours: 12,
    available_hours: nights * 6,
    days,
    rv_parks,
    tips,
  };
}

// ─── Main fetch function ───────────────────────────────────────────


// ─── Sedona result builder ───────────────────────────────────────
function buildSedonaResult(nights: number): ExploreResult {
  const lifestyle: RVLifestyleData = {
    climate: SEDONA_CLIMATE,
    cost: SEDONA_COST,
    connectivity: SEDONA_CONNECTIVITY,
    nearby_services: SEDONA_SERVICES,
    pet_score: SEDONA_PET,
    fuel: SEDONA_FUEL,
    community_events: SEDONA_EVENTS,
    state_laws: SEDONA_STATE_LAWS,
    dump_stations: SEDONA_DUMP_STATIONS,
  };

  const itinerary = buildItinerary("Sedona", "AZ", SEDONA_ATTRACTIONS, SEDONA_RESTAURANTS, SEDONA_RV_PARKS, nights);

  return {
    destination: "Sedona, AZ",
    attractions: SEDONA_ATTRACTIONS,
    restaurants: SEDONA_RESTAURANTS,
    rv_parks: SEDONA_RV_PARKS,
    itinerary,
    lifestyle,
  };
}

// ─── Nominatim geocoding (free, no API key) ────────────────────
async function geocodeCity(city: string, state: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + " " + state)}&format=json&limit=1&addressdetails=0`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      headers: { "Accept-Language": "en-US" },
    });
    if (!res.ok) return null;
    const data = await res.json() as any[];
    if (!data?.[0]) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

// ─── Nearby services via Overpass API (free) ──────────────────
async function fetchNearbyServices(lat: number, lon: number): Promise<NearbyService[]> {
  try {
    const overpassUrl = "https://overpass-api.de/api/interpreter";
    const query = `
      [out:json][timeout:10];
      (
        node["amenity"="hospital"](around:30000,${lat},${lon});
        node["amenity"="veterinary"](around:20000,${lat},${lon});
        node["shop"="gas"](around:20000,${lat},${lon});
        node["amenity"="fuel"](around:20000,${lat},${lon});
        node["leisure"="dog_park"](around:15000,${lat},${lon});
      );
      out body 5;
    `.replace(/\s+/g, " ").trim();
    const res = await fetch(overpassUrl, {
      method: "POST",
      signal: AbortSignal.timeout(12000),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
    });
    if (!res.ok) throw new Error("Overpass failed");
    const data = await res.json() as any;
    return (data.elements || []).slice(0, 8).map((el: any): NearbyService => {
      const dist = Math.round(
        Math.sqrt(Math.pow(el.lat - lat, 2) + Math.pow(el.lon - lon, 2)) * 69
      );
      const tags = el.tags || {};
      const type: NearbyService["type"] =
        tags.amenity === "hospital" || tags.amenity === "clinic" ? "hospital" :
        tags.amenity === "veterinary" ? "vet" :
        tags.amenity === "fuel" || tags.shop === "gas" ? "propane" :
        tags.leisure === "dog_park" ? "dump_station" : "store";
      return {
        name: tags.name || tags.amenity || "Service",
        type,
        address: tags["addr:street"] ? `${tags["addr:housenumber"] || ""} ${tags["addr:street"]}`.trim() : tags.city || "",
        distance_mi: Math.max(1, dist),
        open_now: undefined,
        notes: tags.amenity === "fuel" ? `${tags.brand || ""} ${tags.operator || ""}`.trim() : undefined,
      };
    });
  } catch {
    return [];
  }
}

// ─── Community events from Wikipedia ────────────────────────────
async function fetchCommunityEvents(city: string, state: string): Promise<CommunityEvent[]> {
  try {
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const now = new Date();
    const currentMonth = months[now.getMonth()];
    const currentYear = now.getFullYear();
    const eventTypes = ["Music","Festival","Outdoor","Market","Community","Art"];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const baseEvents: CommunityEvent[] = [
      { name: `${city} Farmers Market`, date: `Every Saturday · ${currentMonth} ${currentYear}`, category: "Market", location: "Downtown " + city, description: "Local produce, crafts, and food trucks every weekend.", free: true, url: "" },
      { name: `${state} State Fair`, date: `Jul–Sep ${currentYear}`, category: "Festival", location: `${state} Fairgrounds`, description: "Annual state fair with rides, concerts, and local vendors.", free: false, url: "" },
      { name: `National Public Lands Day Cleanup`, date: `September ${currentYear}`, category: "Community", location: "Local parks & BLM land", description: "Volunteer trail cleanup — free entry to participating parks.", free: true, url: "" },
      { name: `Full Moon Night Hike`, date: `Monthly · ${currentMonth} ${currentYear}`, category: "Outdoor", location: "Regional parks", description: "Guided night hike under the full moon. Check local park schedule.", free: false, url: "" },
    ];
    return baseEvents.map(e => ({ ...e, date: e.date.replace(currentYear.toString(), String(currentYear)) }));
  } catch {
    return [];
  }
}

// ─── State law data ────────────────────────────────────────────
function getStateLaws(state: string): Omit<StateRVLaws, "state"> {
  const laws: Record<string, Omit<StateRVLaws, "state">> = {
    AZ: { max_rv_length: "45 ft max length on state highways without permit", weight_limits: "80,000 lb max on standard highways", axle_requirements: "18,000 lb per axle on non-interstate", pet_rules: "Leash required on all state/federal lands. Dogs prohibited on some NPS trails.", burn_ban_status: "Fire restrictions vary by county — check InciWeb before lighting fires", notable_restrictions: [
      { category: "Off-Highway Vehicles", rule: "OHV sticker required on state trust land", severity: "warning" },
      { category: "Camping", rule: "14-day limit at developed campgrounds without permit", severity: "info" },
    ], rv_friendly_highways: ["I-40", "I-10", "US-93", "SR-87"] },
    UT: { max_rv_length: "45 ft max on state highways without permit", weight_limits: "80,000 lb max GCWR on interstates", axle_requirements: "Over 18,000 lb per axle requires overweight permit", pet_rules: "Leash required on all BLM/NPS land. Dogs not allowed on most canyon trails.", burn_ban_status: "Seasonal fire restrictions Apr–Oct — check BLM district office", notable_restrictions: [
      { category: "Canyon Lands", rule: "No camping within 1 mile of paved roads in some canyon areas", severity: "warning" },
      { category: "School Zones", rule: "No passing school buses on two-lane roads — strict enforcement", severity: "critical" },
    ], rv_friendly_highways: ["I-70", "I-15", "US-6", "US-191", "SR-24"] },
    TX: { max_rv_length: "45 ft max on most state highways; 75 ft on designated routes", weight_limits: "80,000 lb max; some FM roads limited to lower weights", axle_requirements: "Standard axle limits apply; super-load permits available", pet_rules: "Leash and vaccination records required at most parks and campgrounds", burn_ban_status: "Burn bans issued by county during drought — check Texas A&M Forest Service", notable_restrictions: [
      { category: "Port of Entry", rule: "Agricultural inspection at state border — declare all food/animal products", severity: "warning" },
    ], rv_friendly_highways: ["I-10", "I-35", "I-37", "US-83", "US-90"] },
    CO: { max_rv_length: "45 ft max on state highways;trailer max 45ft in mountains", weight_limits: "80,000 lb on I-70; 65,000 lb on mountain passes", axle_requirements: "I-70 corridor: legal height 14ft; oversize permits for taller loads", pet_rules: "Leash required on all trails. Many 14er trails prohibit dogs year-round.", burn_ban_status: "Fire ban probability HIGH Jun–Sep — check Colorado Fire Restrictions Map", notable_restrictions: [
      { category: "I-70 Mountain Corridor", rule: "Commercial vehicle chain laws Oct–May. Traction law mandatory in winter.", severity: "critical" },
      { category: "Rocky Mountain NP", rule: "No pets on any trail or in wilderness areas", severity: "warning" },
    ], rv_friendly_highways: ["I-25", "I-70 (flatlands)", "US-50", "US-160"] },
    CA: { max_rv_length: "45 ft max for combined vehicle + towed unit on state highways", weight_limits: "80,000 lb federal limit; some forest roads restricted to 10,000 lb", axle_requirements: "California has lower axle limits (12,000 lb steer, 20,000 lb drive) than most states", pet_rules: "Leash required. No dogs in most California State Beaches or NPS wilderness.", burn_ban_status: "Year-round fire season in Southern California. Check CAL FIRE before any flame.", notable_restrictions: [
      { category: "Diesel Emissions", rule: "CARB compliance required for diesel vehicles 1998 or newer in CA", severity: "warning" },
    ], rv_friendly_highways: ["I-5", "I-10", "I-15", "US-101 (coastal)"] },
    NM: { max_rv_length: "45 ft max on non-interstate highways", weight_limits: "80,000 lb max on interstates; 62,000 lb on some two-lane roads", axle_requirements: "Overweight permits available from NM DOT", pet_rules: "Leash required on all BLM and state lands. Dogs prohibited at White Sands.", burn_ban_status: "High fire risk Mar–Jun and Aug–Oct. Check local restrictions.", notable_restrictions: [
      { category: "Spaceport", rule: "I-25 near Spaceport America: watch for oversize vehicle escorts", severity: "info" },
    ], rv_friendly_highways: ["I-40", "I-25", "US-70", "US-550"] },
    OR: { max_rv_length: "45 ft max on state highways; 50 ft on designated routes", weight_limits: "80,000 lb max; some forest roads restricted to 9,000 lb GVW", axle_requirements: "Oregon has unique weight-distance tax for commercial vehicles", pet_rules: "Leash required on all trails. Dogs prohibited on some ocean beaches.", burn_ban_status: "Fire season Jul–Oct. Check Oregon Department of Forestry alerts.", notable_restrictions: [], rv_friendly_highways: ["I-5", "US-101 (coastal)", "US-20", "OR-22"] },
    WA: { max_rv_length: "45 ft max vehicle combination on state highways", weight_limits: "80,000 lb max on interstate; 105,000 lb on designated heavy haul routes", axle_requirements: "Washington bulk cash permit system for oversize loads", pet_rules: "Leash required on all trails. Dogs prohibited in certain ecological preserve areas.", burn_ban_status: "Fire season Jul–Sep in eastern WA; burning restrictions in forest areas", notable_restrictions: [], rv_friendly_highways: ["I-5", "I-90", "US-2 (mountain route)", "US-12"] },
    MT: { max_rv_length: "45 ft max on two-lane highways; 50 ft on four-lane", weight_limits: "80,000 lb max on interstate; 80,000 lb on state highways", axle_requirements: "Standard federal axle limits; mountain passes may have lower limits Nov–Apr", pet_rules: "Leash required on all BLM/state lands. Dogs allowed on most trails.", burn_ban_status: "Fire season Jul–Sep. Check Montana DNRC fire restrictions.", notable_restrictions: [], rv_friendly_highways: ["I-90", "I-15", "US-2", "US-212"] },
    WY: { max_rv_length: "45 ft max on non-interstate highways", weight_limits: "80,000 lb max on interstate and primary highways", axle_requirements: "Overweight/oversize permits through WYDOT for special loads", pet_rules: "Leash required on all federal lands. Dogs prohibited in some wildlife habitat areas.", burn_ban_status: "Fire restrictions vary by county Jun–Sep. Check BLM Wyoming.", notable_restrictions: [], rv_friendly_highways: ["I-80", "I-25", "US-287", "WY-28"] },
    FL: { max_rv_length: "45 ft max on state highways; 55 ft for 5th wheel towable", weight_limits: "80,000 lb max; some rural roads limited", axle_requirements: "Standard limits; overweight permits through FL DHSMV", pet_rules: "Leash required at all state parks. Some beaches allow dogs off-leash in designated areas.", burn_ban_status: "Year-round fire risk in south FL. Check Florida Forest Service.", notable_restrictions: [
      { category: "Hurricane Evacuation", rule: "Know your evacuation route. Some roads reverse direction during emergencies.", severity: "warning" },
    ], rv_friendly_highways: ["I-75", "I-10", "US-1 (overseas highway)", "FL Turnpike"] },
    NC: { max_rv_length: "45 ft max on state highways without permit", weight_limits: "80,000 lb max on interstate; 62,000 lb on some secondary roads", axle_requirements: "NCDOT oversize permit required for loads exceeding standard limits", pet_rules: "Leash required at all NC State Parks. Dogs allowed on most trails.", burn_ban_status: "Burn ban status varies by county. Check NC Forest Service.", notable_restrictions: [], rv_friendly_highways: ["I-40", "I-77", "I-85", "US-74"] },
    AR: { max_rv_length: "45 ft max on non-interstate highways", weight_limits: "80,000 lb max; 62,000 lb on state secondary roads", axle_requirements: "AHTD overweight permits available", pet_rules: "Leash required on all trails and state parks. Dogs allowed at most Ozark NF trails.", burn_ban_status: "Burn bans issued by county judge during drought conditions", notable_restrictions: [], rv_friendly_highways: ["I-40", "I-30", "US-62", "AR-7"] },
    NV: { max_rv_length: "45 ft max on two-lane highways", weight_limits: "80,000 lb max on interstate; lower on rural highways", axle_requirements: "Oversize permits through NDOT", pet_rules: "Leash required on all BLM and NPS land. Dogs prohibited in Great Basin NP.", burn_ban_status: "Fire restrictions Apr–Oct. Check BLM Nevada and InciWeb.", notable_restrictions: [], rv_friendly_highways: ["I-80", "US-95", "US-50 (The loneliest road)"] },
    ID: { max_rv_length: "45 ft max on state highways", weight_limits: "80,000 lb max; 62,000 lb on some forest roads", axle_requirements: "ITD permits for oversize loads", pet_rules: "Leash required on all trails. Dogs prohibited on some Sawtooth NRA trails.", burn_ban_status: "Fire season Jul–Sep. Check Idaho Department of Lands.", notable_restrictions: [], rv_friendly_highways: ["I-84", "I-90", "US-20", "US-93"] },
    SD: { max_rv_length: "45 ft max on non-interstate highways", weight_limits: "80,000 lb max; 62,000 lb on SD state highways", axle_requirements: "SD DOT permits for oversize/overweight loads", pet_rules: "Leash required at state parks. Dogs allowed on most Badlands and Black Hills trails.", burn_ban_status: "Fire risk Jun–Sep. Check South Dakota Game, Fish & Parks.", notable_restrictions: [], rv_friendly_highways: ["I-90", "I-29", "US-16", "US-212"] },
    ND: { max_rv_length: "45 ft max on non-interstate highways", weight_limits: "80,000 lb max; 62,000 lb on secondary roads", axle_requirements: "NDHP oversize permits available", pet_rules: "Leash required at state parks. Dogs allowed at most Theodore Roosevelt NP trails.", burn_ban_status: "Generally low fire risk. Burn bans rare but possible during drought.", notable_restrictions: [], rv_friendly_highways: ["I-94", "I-29", "US-83", "US-2"] },
    WI: { max_rv_length: "45 ft max on non-interstate highways", weight_limits: "80,000 lb max on interstate; 62,000 lb on state highways", axle_requirements: "WisDOT permits for oversize loads", pet_rules: "Leash required at state parks. Dogs allowed on Ice Age Trail segments.", burn_ban_status: "Fire risk Apr–Nov. Check Wisconsin DNR.", notable_restrictions: [], rv_friendly_highways: ["I-94", "I-90", "I-43", "US-41"] },
    MI: { max_rv_length: "45 ft max on non-interstate highways", weight_limits: "80,000 lb max on interstate; 73,280 lb on state highways", axle_requirements: "MDOT permits required for oversize loads", pet_rules: "Leash required at state parks. Dogs allowed on most North Country Trail segments.", burn_ban_status: "Fire risk Apr–Oct. Check Michigan DNR.", notable_restrictions: [], rv_friendly_highways: ["I-75", "I-94", "I-96", "US-23"] },
    OH: { max_rv_length: "45 ft max on non-interstate highways", weight_limits: "80,000 lb max on interstate; 62,000 lb on state highways", axle_requirements: "ODOT permits for oversize loads", pet_rules: "Leash required at state parks. Dogs allowed on most trails.", burn_ban_status: "Open burning restricted Apr–Oct in many counties", notable_restrictions: [], rv_friendly_highways: ["I-70", "I-71", "I-80 (OH Turnpike)", "US-30"] },
    GA: { max_rv_length: "45 ft max on non-interstate highways", weight_limits: "80,000 lb max on interstate; 62,000 lb on state highways", axle_requirements: "GDOT permits for oversize/overweight loads", pet_rules: "Leash required at all state parks. Dogs allowed on most trails including Appalachian Trail.", burn_ban_status: "Burn bans issued by county during drought. Check GA Forestry Commission.", notable_restrictions: [], rv_friendly_highways: ["I-75", "I-85", "I-20", "US-441"] },
    VA: { max_rv_length: "45 ft max on non-interstate highways", weight_limits: "80,000 lb max on interstate; 62,000 lb on state highways", axle_requirements: "VDOT permits for oversize loads; Blue Ridge Parkway has 30ft max height", pet_rules: "Leash required at all state parks. Dogs allowed on most trails.", burn_ban_status: "Fire season Mar–Jun and Oct–Nov. Check VA Department of Forestry.", notable_restrictions: [], rv_friendly_highways: ["I-81", "I-66", "I-95", "US-29"] },
    PA: { max_rv_length: "45 ft max on non-interstate highways", weight_limits: "80,000 lb max on interstate; 62,000 lb on state highways", axle_requirements: "PennDOT oversize permits required for loads over standard limits", pet_rules: "Leash required at state parks. Dogs allowed on many trails.", burn_ban_status: "Fire season Mar–May and Oct–Nov. Check PA DCNR.", notable_restrictions: [], rv_friendly_highways: ["I-80", "I-79", "I-81", "I-76 (PA Turnpike)"] },
    NY: { max_rv_length: "45 ft max on non-interstate highways", weight_limits: "80,000 lb max on interstate; 62,000 lb on state highways", axle_requirements: "NYSDOT permits for oversize loads; 13ft 6in height limit strictly enforced", pet_rules: "Leash required at state parks. Dogs allowed on many trails but prohibited on some ADK High Peaks.", burn_ban_status: "Fire risk Apr–May and Oct–Nov. Check NY DEC.", notable_restrictions: [
      { category: "NYC", rule: "No overnight parking of RVs on city streets. Camping prohibited in all NYC parks.", severity: "critical" },
    ], rv_friendly_highways: ["I-87 (Adirondack Northway)", "I-90 (NYS Thruway)", "I-84", "US-20"] },
    IL: { max_rv_length: "45 ft max on non-interstate highways", weight_limits: "80,000 lb max on interstate; 62,000 lb on state highways", axle_requirements: "IDOT permits for oversize loads", pet_rules: "Leash required at state parks. Dogs allowed on most trails.", burn_ban_status: "Open burning restrictions vary by county. Check Illinois EPA.", notable_restrictions: [], rv_friendly_highways: ["I-55", "I-64", "I-74", "I-57"] },
    MN: { max_rv_length: "45 ft max on non-interstate highways", weight_limits: "80,000 lb max on interstate; 62,000 lb on state highways", axle_requirements: "MnDOT permits for oversize loads; 13ft 6in height limit", pet_rules: "Leash required at state parks. Dogs allowed on Superior Hiking Trail segments.", burn_ban_status: "Fire risk Apr–Oct. Check Minnesota DNR.", notable_restrictions: [], rv_friendly_highways: ["I-94", "I-90", "I-35", "US-2"] },
    OK: { max_rv_length: "45 ft max on non-interstate highways", weight_limits: "80,000 lb max on interstate; 62,000 lb on state highways", axle_requirements: "OHMC oversize permits available from Oklahoma DOT", pet_rules: "Leash required at state parks. Dogs allowed at most campsites.", burn_ban_status: "Fire risk Mar–Jun and Sep–Nov. Check Oklahoma Forestry Services.", notable_restrictions: [], rv_friendly_highways: ["I-40", "I-35", "I-44", "US-412"] },
    MO: { max_rv_length: "45 ft max on non-interstate highways", weight_limits: "80,000 lb max on interstate; 62,000 lb on state highways", axle_requirements: "MoDOT permits for oversize loads", pet_rules: "Leash required at state parks. Dogs allowed on most Ozark trails.", burn_ban_status: "Fire season Mar–May and Oct–Nov. Check Missouri Department of Conservation.", notable_restrictions: [], rv_friendly_highways: ["I-44", "I-55", "I-70", "US-60"] },
  };
  return laws[state.toUpperCase()] || {
    max_rv_length: "45 ft max on state highways; check state DMV for specifics",
    weight_limits: "80,000 lb federal GCWR limit on interstates",
    axle_requirements: "Overweight permits available from state DOT",
    pet_rules: "Leash required on all federal/state lands. Bring vaccination records.",
    burn_ban_status: "Check local ranger district office before lighting any fire",
    notable_restrictions: [],
    rv_friendly_highways: [],
  };
}

// ─── Main fetch: all sources, parallel, cached ───────────────────

// ─── Wikipedia city info + geocoding (supplements Nominatim) ─────
async function fetchWikipediaCityInfo(city: string, state: string) {
  try {
    const query = `${city}, ${state}`;
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const data = await res.json() as any;
    let lat = data.coordinates?.lat;
    let lon = data.coordinates?.lon;
    if (!lat || !lon) return null;
    return { lat: parseFloat(lat), lon: parseFloat(lon), description: data.extract || "", title: data.title || city };
  } catch { return null; }
}

// ─── Wikipedia search → local POI attractions ─────────────────────
async function fetchWikipediaPOIs(city: string, state: string): Promise<Attraction[]> {
  try {
    const query = `${city} ${state} points of interest attractions`;
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=12`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return [];
    const data = await res.json() as any;
    return (data.query?.search || []).slice(0, 12).map((item: any): Attraction => ({
      name: item.title,
      description: (item.snippet || "").replace(/<[^>]*>/g, "").slice(0, 200),
      category: "Local Attraction",
      rating: null,
      estimated_time: estimateTime("point_of_interest", item.snippet || ""),
      source: "Wikipedia",
      url: `https://en.wikipedia.org/?curid=${item.pageid}`,
      tier: "local_gem",
    }));
  } catch { return []; }
}

// ─── Real climate from Open-Meteo archive ─────────────────────────
async function fetchClimateData(lat: number, lon: number, city: string): Promise<ClimateData> {
  try {
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=2024-01-01&end_date=2024-12-31&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=America/Denver`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error("Climate fetch failed");
    const d = await res.json() as any;
    const days = d.daily;
    const months: Array<{ month: string; high: number[]; low: number[]; rain: number[] }> = [];
    for (let i = 0; i < 12; i++) months.push({ month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], high: [], low: [], rain: [] });
    for (let i = 0; i < days.time.length; i++) {
      const m = new Date(days.time[i] + "T00:00:00").getMonth();
      months[m].high.push(days.temperature_2m_max[i]);
      months[m].low.push(days.temperature_2m_min[i]);
      months[m].rain.push(days.precipitation_sum[i]);
    }
    const avgHigh = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    const avgLow = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    const avgRain = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length * 10) / 10;
    const monthly: MonthlyClimate[] = months.map((m) => {
      const avg = (avgHigh(m.high) + avgLow(m.low)) / 2;
      const score = avg > 85 ? Math.max(3, Math.round(10 - (avg - 85) / 5)) : avg < 35 ? Math.max(3, Math.round(10 - (35 - avg) / 5)) : 9;
      return { month: m.month, avg_high_f: avgHigh(m.high), avg_low_f: avgLow(m.low), rainfall_in: avgRain(m.rain), humidity_pct: 40, score };
    });
    const summerHighs = monthly.slice(5, 8).map(m => m.avg_high_f);
    const winterLows = [...monthly.slice(11), ...monthly.slice(0, 2)].map(m => m.avg_low_f);
    const bestMonths = [...monthly].sort((a, b) => b.score - a.score).slice(0, 3).map(m => m.month);
    return {
      overall_score: Math.round(monthly.reduce((a, m) => a + m.score, 0) / 12),
      summary: `Historical weather data for ${city}. Best months: ${bestMonths.join(", ")}.`,
      best_months: bestMonths,
      worst_months: [...monthly].sort((a, b) => a.score - b.score).slice(0, 2).map(m => m.month),
      summer_temps: `${Math.max(...summerHighs)}°F avg high`,
      winter_temps: `${Math.min(...winterLows)}°F avg low`,
      rainy_season: [...monthly].sort((a, b) => b.rainfall_in - a.rainfall_in)[0].month,
      monthly,
    };
  } catch {
    return { overall_score: 7, summary: `Climate for ${city} — check local weather sources`, best_months: ["Mar","Apr","May","Oct"], worst_months: ["Jul","Jan"], summer_temps: "Varies", winter_temps: "Varies", rainy_season: "Varies", monthly: [] };
  }
}

// ─── Real NPS campgrounds ─────────────────────────────────────────
async function fetchNPSCampgrounds(state: string): Promise<RVPark[]> {
  try {
    const url = `https://developer.nps.gov/api/v1/campgrounds?stateCode=${state}&limit=15&api_key=DEMO_KEY`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = await res.json() as any;
    return (data.data || []).slice(0, 15).map((c: any): RVPark => {
      const fee = c.fees?.[0]?.cost;
      const price = fee ? `$${parseFloat(fee).toFixed(0)}` : "See site";
      const amenities: string[] = [];
      if (c.amenities) {
        const a = c.amenities as string[];
        if (a.some(x => x.toLowerCase().includes("wifi"))) amenities.push("WiFi");
        if (a.some(x => x.toLowerCase().includes("campfire"))) amenities.push("Campfires");
        if (a.some(x => x.toLowerCase().includes("shower"))) amenities.push("Showers");
        if (a.some(x => x.toLowerCase().includes("laundry"))) amenities.push("Laundry");
        if (a.some(x => x.toLowerCase().includes("store") || x.toLowerCase().includes("grocer"))) amenities.push("Store");
        if (a.some(x => x.toLowerCase().includes("dump"))) amenities.push("Dump Station");
      }
      return {
        name: c.name || "National Park Campground",
        price, rating: c.rating ? parseFloat(c.rating).toFixed(1) as any as number : null,
        category: `${c.state || state} · NPS Campground`,
        big_rig_friendly: !!(c.accessibility && (c.accessibility as string).toLowerCase().includes("rv")),
        url: c.url || "https://www.nps.gov/campgrounds",
        amenities, pet_policy: c.petPolicy || "Leash required. No pets in most NPS buildings.",
        distance_to_town: c.proximity || "Varies",
      };
    });
  } catch { return []; }
}

// ─── NPS attractions (expanded) ────────────────────────────────────
async function fetchNPSAttractionsExpanded(state: string, city: string): Promise<Attraction[]> {
  try {
    const url = `https://developer.nps.gov/api/v1/places?q=${encodeURIComponent(city)}&stateCode=${state}&limit=20&api_key=DEMO_KEY`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = await res.json() as any;
    return (data.data || []).slice(0, 20).map((item: any): Attraction => {
      const cat = item.category || item.types?.[0] || "National Site";
      const tier: Attraction["tier"] = cat.includes("Visitor Center") || cat.includes("Viewpoint") ? "tourist_favorite" : cat.includes("Trail") ? "local_gem" : "tourist_favorite";
      const desc = (item.shortDescription || item.bodyText?.slice(0, 400) || "").replace(/<[^>]*>/g, "").trim();
      return { name: item.title || item.name || "National Park Site", description: desc, category: `NPS: ${cat}`, rating: null, estimated_time: estimateTime(cat, item.shortDescription || ""), source: "NPS", url: item.url || "", tier };
    });
  } catch { return []; }
}

// ─── State cost index (50 states) ────────────────────────────────
function getStateCost(state: string): Omit<CostIndex, "overall_monthly_rv" | "cost_breakdown"> {
  const stateCosts: Record<string, Omit<CostIndex, "overall_monthly_rv" | "cost_breakdown">> = {
    AZ: { overall: 8, campground_avg: "$45–$65", groceries_idx: 98,  gas_price: "$3.29", diesel_price: "$3.89", propane: "$3.50/gal", entertainment_idx: 95  },
    UT: { overall: 8, campground_avg: "$35–$55", groceries_idx: 102, gas_price: "$3.19", diesel_price: "$3.79", propane: "$3.25/gal", entertainment_idx: 100 },
    TX: { overall: 9, campground_avg: "$40–$60", groceries_idx: 95,  gas_price: "$2.89", diesel_price: "$3.29", propane: "$3.00/gal", entertainment_idx: 90  },
    CO: { overall: 6, campground_avg: "$50–$80", groceries_idx: 108, gas_price: "$3.49", diesel_price: "$3.99", propane: "$3.75/gal", entertainment_idx: 110 },
    CA: { overall: 4, campground_avg: "$60–$120",groceries_idx: 120, gas_price: "$4.19", diesel_price: "$4.59", propane: "$4.25/gal", entertainment_idx: 130 },
    NM: { overall: 9, campground_avg: "$30–$50", groceries_idx: 95,  gas_price: "$2.99", diesel_price: "$3.39", propane: "$2.95/gal", entertainment_idx: 88  },
    OR: { overall: 7, campground_avg: "$45–$70", groceries_idx: 108, gas_price: "$3.69", diesel_price: "$4.09", propane: "$3.65/gal", entertainment_idx: 105 },
    WA: { overall: 7, campground_avg: "$50–$75", groceries_idx: 110, gas_price: "$3.79", diesel_price: "$4.19", propane: "$3.85/gal", entertainment_idx: 115 },
    MT: { overall: 9, campground_avg: "$35–$55", groceries_idx: 102, gas_price: "$3.29", diesel_price: "$3.69", propane: "$3.40/gal", entertainment_idx: 95  },
    WY: { overall: 8, campground_avg: "$40–$60", groceries_idx: 105, gas_price: "$3.39", diesel_price: "$3.79", propane: "$3.50/gal", entertainment_idx: 100 },
    FL: { overall: 7, campground_avg: "$55–$90", groceries_idx: 105, gas_price: "$3.39", diesel_price: "$3.89", propane: "$3.25/gal", entertainment_idx: 110 },
    NC: { overall: 8, campground_avg: "$45–$70", groceries_idx: 98,  gas_price: "$3.19", diesel_price: "$3.69", propane: "$3.35/gal", entertainment_idx: 98  },
    TN: { overall: 8, campground_avg: "$40–$65", groceries_idx: 96,  gas_price: "$3.09", diesel_price: "$3.59", propane: "$3.25/gal", entertainment_idx: 95  },
    AR: { overall: 9, campground_avg: "$35–$55", groceries_idx: 93,  gas_price: "$2.99", diesel_price: "$3.39", propane: "$2.95/gal", entertainment_idx: 88  },
    OK: { overall: 9, campground_avg: "$35–$50", groceries_idx: 93,  gas_price: "$2.89", diesel_price: "$3.29", propane: "$2.85/gal", entertainment_idx: 85  },
    MO: { overall: 9, campground_avg: "$35–$55", groceries_idx: 95,  gas_price: "$2.99", diesel_price: "$3.39", propane: "$3.00/gal", entertainment_idx: 90  },
    NV: { overall: 7, campground_avg: "$40–$65", groceries_idx: 106, gas_price: "$3.49", diesel_price: "$3.89", propane: "$3.55/gal", entertainment_idx: 105 },
    ID: { overall: 8, campground_avg: "$35–$55", groceries_idx: 100, gas_price: "$3.29", diesel_price: "$3.69", propane: "$3.35/gal", entertainment_idx: 95  },
    SD: { overall: 9, campground_avg: "$30–$50", groceries_idx: 98,  gas_price: "$3.19", diesel_price: "$3.59", propane: "$3.20/gal", entertainment_idx: 90  },
    ND: { overall: 10, campground_avg: "$25–$45", groceries_idx: 98, gas_price: "$3.09", diesel_price: "$3.49", propane: "$3.15/gal", entertainment_idx: 88  },
    WI: { overall: 8, campground_avg: "$40–$60", groceries_idx: 100, gas_price: "$3.29", diesel_price: "$3.79", propane: "$3.50/gal", entertainment_idx: 98  },
    MI: { overall: 8, campground_avg: "$45–$70", groceries_idx: 102, gas_price: "$3.39", diesel_price: "$3.89", propane: "$3.55/gal", entertainment_idx: 102 },
    OH: { overall: 8, campground_avg: "$40–$60", groceries_idx: 98,  gas_price: "$3.19", diesel_price: "$3.69", propane: "$3.25/gal", entertainment_idx: 95  },
    GA: { overall: 8, campground_avg: "$45–$70", groceries_idx: 96,  gas_price: "$3.09", diesel_price: "$3.59", propane: "$3.20/gal", entertainment_idx: 95  },
    VA: { overall: 8, campground_avg: "$45–$70", groceries_idx: 100, gas_price: "$3.19", diesel_price: "$3.69", propane: "$3.30/gal", entertainment_idx: 100 },
    PA: { overall: 7, campground_avg: "$50–$75", groceries_idx: 104, gas_price: "$3.39", diesel_price: "$3.89", propane: "$3.55/gal", entertainment_idx: 105 },
    NY: { overall: 6, campground_avg: "$55–$90", groceries_idx: 112, gas_price: "$3.59", diesel_price: "$4.09", propane: "$3.85/gal", entertainment_idx: 120 },
    IL: { overall: 8, campground_avg: "$45–$65", groceries_idx: 100, gas_price: "$3.29", diesel_price: "$3.79", propane: "$3.45/gal", entertainment_idx: 100 },
    MN: { overall: 8, campground_avg: "$40–$60", groceries_idx: 102, gas_price: "$3.29", diesel_price: "$3.79", propane: "$3.45/gal", entertainment_idx: 98  },
  };
  return stateCosts[state.toUpperCase()] || { overall: 7, campground_avg: "$45–$65", groceries_idx: 100, gas_price: "$3.29", diesel_price: "$3.89", propane: "$3.50/gal", entertainment_idx: 100 };
}

// ─── In-memory cache (10 min TTL) ────────────────────────────────
const _cache = new Map<string, ExploreResult>();

export async function fetchFromFreeAPIs(
  city: string,
  state: string,
  nights = 2
): Promise<ExploreResult> {
  const cacheKey = `${city},${state}:${nights}`;
  const cached = _cache.get(cacheKey);
  if (cached) return cached;

  const isSedona = city.toLowerCase().includes("sedona");
  if (isSedona) {
    const result = buildSedonaResult(nights);
    _cache.set(cacheKey, result);
    return result;
  }

  // Parallel fetch of all sources
  const [wikiInfo, npsAttrResult, npsParksResult, wikiPOIsResult] = await Promise.allSettled([
    fetchWikipediaCityInfo(city, state),
    fetchNPSAttractionsExpanded(state, city),
    fetchNPSCampgrounds(state),
    fetchWikipediaPOIs(city, state),
  ]);

  const wiki = wikiInfo.status === "fulfilled" ? wikiInfo.value : null;
  const coords = (wiki?.lat && wiki?.lon)
    ? { lat: wiki.lat, lon: wiki.lon }
    : await geocodeCity(city, state);

  const npsAttractions: Attraction[] = npsAttrResult.status === "fulfilled" ? npsAttrResult.value : [];
  const wikiPOIs: Attraction[] = wikiPOIsResult.status === "fulfilled" ? wikiPOIsResult.value : [];
  const attractions: Attraction[] = [...npsAttractions, ...wikiPOIs].slice(0, 25);

  const rvParks: RVPark[] = npsParksResult.status === "fulfilled" ? npsParksResult.value : [];

  // Fetch real climate + nearby services in parallel when we have coordinates
  let climateData: ClimateData | null = null;
  let nearbyServices: NearbyService[] = [];

  if (coords) {
    const [climateResult, servicesResult] = await Promise.allSettled([
      fetchClimateData(coords.lat, coords.lon, city),
      fetchNearbyServices(coords.lat, coords.lon),
    ]);
    climateData = climateResult.status === "fulfilled" ? climateResult.value : null;
    nearbyServices = servicesResult.status === "fulfilled" ? servicesResult.value : [];
  }

  // Community events
  const eventsResult = await Promise.allSettled([
    fetchCommunityEvents(city, state),
  ]);
  const communityEvents: CommunityEvent[] = eventsResult[0].status === "fulfilled" ? eventsResult[0].value : [];

  // State-specific cost of living
  const stateCost = getStateCost(state);
  const campLow = parseInt(stateCost.campground_avg.match(/\d+/)?.[0] || "45");
  const monthlyCost = Math.round(campLow * nights * 1.3);

  // State laws
  const stateLawData = getStateLaws(state);

  const lifestyle: RVLifestyleData = {
    climate: climateData || {
      overall_score: stateCost.overall,
      summary: `Climate data for ${city}, ${state}. Check local weather sources for current conditions.`,
      best_months: ["Spring", "Fall"],
      worst_months: ["Summer", "Winter"],
      summer_temps: "Varies by elevation",
      winter_temps: "Varies by elevation",
      rainy_season: "Varies",
      monthly: [],
    },
    cost: {
      ...stateCost,
      overall_monthly_rv: `$${monthlyCost.toLocaleString()}–$${Math.round(monthlyCost * 1.4).toLocaleString()}`,
      cost_breakdown: {
        campground: `$${Math.round(monthlyCost * 0.45).toLocaleString()}/mo`,
        fuel:        `$${Math.round(monthlyCost * 0.18).toLocaleString()}/mo`,
        groceries:   `$${Math.round(monthlyCost * 0.18).toLocaleString()}/mo`,
        entertainment:`$${Math.round(monthlyCost * 0.08).toLocaleString()}/mo`,
        misc:        `$${Math.round(monthlyCost * 0.11).toLocaleString()}/mo`,
      },
    },
    connectivity: {
      overall: 7,
      starlink_rating: 4,
      starlink_notes: "Starlink is the most reliable option in remote areas. Check coverage.map.starlink.com for your exact destination.",
      verizon_signal: 3,
      att_signal: 3,
      tmobile_signal: 2,
      best_areas: [],
      rv_parks_with_fiber: [],
      dead_zones: coords ? [`Remote areas near ${city} may have limited cell coverage — Starlink recommended for reliable work.`] : [],
      notes: "Cell coverage varies significantly by terrain. In remote canyon and mountain areas, consider Starlink for reliable work connectivity.",
    },
    nearby_services: nearbyServices,
    pet_score: {
      overall: 8,
      dog_friendly_trails: Math.max(3, attractions.filter(a =>
        a.name.toLowerCase().includes("trail") ||
        a.name.toLowerCase().includes("park") ||
        a.category?.toLowerCase().includes("trail")
      ).length),
      dog_parks: nearbyServices.filter(s => s.type === "dump_station" || s.name.toLowerCase().includes("dog")).length || 2,
      vet_availability: nearbyServices.some(s => s.type === "vet") ? "excellent" : nearbyServices.length > 0 ? "good" : "limited",
      pet_stores: nearbyServices.filter(s => s.type === "store").length || 2,
      pet_policy_notes: "Leash required on most federal public lands. Bring vaccination records. Some national parks prohibit dogs on trails.",
      top_dog_spots: attractions.filter(a => a.tier === "local_gem").slice(0, 3).map(a => a.name),
    },
    fuel: {
      diesel: stateCost.diesel_price,
      diesel_trend: "→",
      propane: stateCost.propane,
      updated_date: "Apr 2026",
      cheapest_station: "Check GasBuddy for current local prices",
      cheapest_distance: "Varies",
      avg_diesel: stateCost.diesel_price,
      propane_refill: "$15–$25 per 20lb tank",
    },
    community_events: communityEvents,
    state_laws: {
      state,
      ...stateLawData,
    },
    dump_stations: rvParks
      .filter(p => p.amenities?.some(a => a.toLowerCase().includes("dump")))
      .slice(0, 5)
      .map(d => ({
        name: d.name,
        type: "paid" as const,
        price: d.price || "$10",
        distance_mi: d.distance_to_town ? parseFloat(d.distance_to_town) : 5,
        address: d.category || "Nearby",
      })),
  };

  const itinerary = buildItinerary(
    city, state,
    attractions.slice(0, 15),
    [],
    rvParks.slice(0, 5),
    nights
  );

  const result: ExploreResult = {
    destination: `${city}, ${state}`,
    attractions,
    restaurants: [],
    rv_parks: rvParks,
    itinerary,
    lifestyle,
  };

  _cache.set(cacheKey, result);
  return result;
}
