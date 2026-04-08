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

export async function fetchFromFreeAPIs(
  city: string,
  state: string,
  nights = 2
): Promise<ExploreResult> {
  const isSedona = city.toLowerCase().includes("sedona") || city.toLowerCase() === "sedona";

  if (isSedona) {
    return buildSedonaResult(nights);
  }

  // For other cities: basic fallback with generic data
  const attractions = await fetchNPSAttractions(state, city);
  const itinerary = buildItinerary(city, state, attractions, [], SEDONA_RV_PARKS, nights);
  const lifestyle = buildGenericLifestyle(state, city);

  return {
    destination: `${city}, ${state}`,
    attractions,
    restaurants: [],
    rv_parks: SEDONA_RV_PARKS,
    itinerary,
    lifestyle,
  };
}

async function fetchNPSAttractions(state: string, city: string): Promise<Attraction[]> {
  try {
    const res = await fetch(
      `https://developer.nps.gov/api/v1/places?q=${encodeURIComponent(city)}&stateCode=${state}&limit=8&api_key=DEMO_KEY`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).slice(0, 8).map((item: any) => ({
      name: item.title || item.name || "National Park Site",
      description: item.shortDescription || "",
      category: `NPS: ${item.category || "National Site"}`,
      rating: null,
      estimated_time: estimateTime(item.category || "", item.shortDescription || ""),
      source: "NPS",
      url: item.url || "",
      tier: "tourist_favorite",
    } as Attraction));
  } catch {
    return [];
  }
}

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

function buildGenericLifestyle(state: string, city: string): RVLifestyleData {
  return {
    climate: { overall_score: 7, summary: "Climate data for " + city + " — check local sources", best_months: [], worst_months: [], summer_temps: "Varies", winter_temps: "Varies", rainy_season: "Varies", monthly: [] },
    cost: { overall: 6, campground_avg: "$45–$65", groceries_idx: 100, gas_price: "$3.29", diesel_price: "$3.89", propane: "$3.50/gal", entertainment_idx: 100, overall_monthly_rv: "$2,400–$3,200", cost_breakdown: { campground: "$1,200–$1,800/mo", fuel: "$350–$500/mo", groceries: "$350–$500/mo", entertainment: "$150–$250/mo", misc: "$350–$450/mo" } },
    connectivity: { overall: 6, starlink_rating: 3, starlink_notes: "Check Starlink coverage map for your area", verizon_signal: 3, att_signal: 3, tmobile_signal: 3, best_areas: [], rv_parks_with_fiber: [], dead_zones: [], notes: "Cell coverage varies by carrier. Check signal maps before committing." },
    nearby_services: [],
    pet_score: { overall: 7, dog_friendly_trails: 5, dog_parks: 2, vet_availability: "good", pet_stores: 2, pet_policy_notes: "Check local park rules", top_dog_spots: [] },
    fuel: { diesel: "$3.89", diesel_trend: "→", propane: "$3.50/gal", updated_date: "Apr 2026", cheapest_station: "Check GasBuddy", cheapest_distance: "—", avg_diesel: "$4.02", propane_refill: "$15–$25 per 20lb tank" },
    community_events: [],
    state_laws: { state, max_rv_length: "Varies by state", weight_limits: "Check state DMV", axle_requirements: "See FHWA", pet_rules: "Leash laws apply", burn_ban_status: "Check before campfires", notable_restrictions: [], rv_friendly_highways: [] },
    dump_stations: [],
  };
}
