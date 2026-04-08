// ─── Attraction ──────────────────────────────────────────────────
export interface Attraction {
  name: string;
  description?: string;
  category?: string;
  rating?: number | null;
  reviews?: string;
  address?: string;
  rv_friendly?: boolean;
  estimated_time?: string;
  source?: string;
  url?: string;
  tier?: "tourist_favorite" | "local_gem" | "unique_idea" | "food";
}

// ─── Restaurant ───────────────────────────────────────────────────
export interface Restaurant {
  name: string;
  description?: string;
  category?: string;
  rating?: number | null;
  reviews?: string;
  address?: string;
  rv_friendly?: boolean;
  estimated_time?: string;
  source?: string;
  url?: string;
}

// ─── RV Park ──────────────────────────────────────────────────────
export interface RVPark {
  name: string;
  price?: string;
  rating?: number | null;
  category?: string;
  big_rig_friendly?: boolean;
  url?: string;
  wifi?: boolean;
  wifi_strength?: number; // 1-5
  cell_signal?: {
    verizon?: number;
    att?: number;
    tmobile?: number;
  };
  amenities?: string[];
  pet_policy?: string;
  distance_to_town?: string;
}

// ─── Itinerary ───────────────────────────────────────────────────
export interface Slot {
  time: "Morning" | "Afternoon" | "Midday" | "Evening" | string;
  activity: string;
  duration?: string;
  item?: Attraction | Restaurant;
}

export interface Day {
  label: string;
  slots: Slot[];
}

// ─── Stay Plan (full explorer result) ─────────────────────────────
export interface StayPlan {
  destination: string;
  stay_duration: string;
  estimated_hours: number;
  available_hours: number;
  days: Day[];
  rv_parks: RVPark[];
  tips?: string[];
  remaining_attractions?: Attraction[];
}

// ─── Route (trip planner) ──────────────────────────────────────────
export interface Route {
  id: string;
  name: "Primary" | "Scenic" | "Alternate";
  distance_mi: number;
  duration_h: number;
  score: number;
  is_toll?: boolean;
  toll_note?: string;
  warnings?: string[];
  geometry: [number, number][];
}

// ─── 7-day Weather Forecast ────────────────────────────────────────
export interface DayForecast {
  date: string;
  day_name: string;
  high_f: number;
  low_f: number;
  precipitation_pct: number;
  condition: string;
}

export interface ForecastData {
  location: string;
  days: DayForecast[];
  source: string;
}

// ─── Live Fuel Prices ───────────────────────────────────────────────
export interface FuelPrices {
  diesel: string;
  diesel_trend: "↑" | "↓" | "→";
  regular: string;
  midgrade: string;
  premium: string;
  avg_diesel_national: string;
  updated: string;
  source: string;
}

// ─── Saved Trip ───────────────────────────────────────────────────
export interface SavedTrip {
  id: string;
  name: string;
  city: string;
  state: string;
  nights: number;
  date_saved: string;
  result: ExploreResult;
}

// ─── Leg ───────────────────────────────────────────────────────────
export interface Leg {
  leg_index: number;
  distance_mi: number;
  route_geometry: [number, number][];
  park?: {
    name: string;
    city: string;
    state: string;
    rating: number | null;
    review_count: number | null;
    price_low: number | null;
    price_high: number | null;
    url: string;
    starlink_verified: boolean;
    primary_carrier: string;
    cellular_bars: number;
    pet_friendly: boolean;
    diesel_nearby: boolean;
    notes: string[];
  };
}

// ═══════════════════════════════════════════════════════════════════
// FULL-TIME RV LIFESTYLE DATA MODEL
// ═══════════════════════════════════════════════════════════════════

// ─── Climate ───────────────────────────────────────────────────────
export interface MonthlyClimate {
  month: string;
  avg_high_f: number;
  avg_low_f: number;
  rainfall_in: number;
  humidity_pct: number;
  score: number; // 1-10 RV livability
}

export interface ClimateData {
  overall_score: number; // 1-10
  summary: string;
  best_months: string[];
  worst_months: string[];
  summer_temps: string;
  winter_temps: string;
  rainy_season: string;
  monthly: MonthlyClimate[];
}

// ─── Cost Index ────────────────────────────────────────────────────
export interface CostIndex {
  overall: number; // 1-10 (10 = cheapest)
  campground_avg: string;
  groceries_idx: number; // vs national avg (100)
  gas_price: string;
  diesel_price: string;
  propane: string;
  entertainment_idx: number;
  overall_monthly_rv: string;
  cost_breakdown: {
    campground: string;
    fuel: string;
    groceries: string;
    entertainment: string;
    misc: string;
  };
}

// ─── Connectivity ──────────────────────────────────────────────────
export interface ConnectivityScore {
  overall: number; // 1-10
  starlink_rating: number; // 1-5
  starlink_notes: string;
  verizon_signal: number; // 1-5 bars
  att_signal: number;
  tmobile_signal: number;
  best_areas: string[];
  rv_parks_with_fiber: string[];
  dead_zones: string[];
  notes: string;
}

// ─── Nearby Services ──────────────────────────────────────────────
export type ServiceType =
  | "hospital"
  | "urgent_care"
  | "vet"
  | "propane"
  | "rv_repair"
  | "dump_station"
  | "laundry"
  | "store"
  | "pharmacy";

export interface NearbyService {
  name: string;
  type: ServiceType;
  distance_mi: number;
  address: string;
  phone?: string;
  hours?: string;
  rating?: number | null;
  open_now?: boolean;
  notes?: string;
}

// ─── Pet Score ─────────────────────────────────────────────────────
export interface PetScore {
  overall: number; // 1-10
  dog_friendly_trails: number;
  dog_parks: number;
  vet_availability: "excellent" | "good" | "limited" | "none";
  pet_stores: number;
  pet_policy_notes: string;
  top_dog_spots: string[];
}

// ─── Fuel Prices ───────────────────────────────────────────────────
export interface FuelPrice {
  diesel: string;
  diesel_trend: "↑" | "↓" | "→";
  propane: string;
  updated_date: string;
  cheapest_station: string;
  cheapest_distance: string;
  avg_diesel: string;
  propane_refill: string;
}

// ─── Community / Events ───────────────────────────────────────────
export interface CommunityEvent {
  name: string;
  date: string;
  category: string;
  location: string;
  url: string;
  free: boolean;
  description?: string;
}

// ─── State RV Laws ────────────────────────────────────────────────
export interface RVLaw {
  category: string;
  rule: string;
  severity?: "info" | "warning" | "critical";
}

export interface StateRVLaws {
  state: string;
  max_rv_length: string;
  weight_limits: string;
  axle_requirements: string;
  pet_rules: string;
  burn_ban_status: string;
  notable_restrictions: RVLaw[];
  rv_friendly_highways: string[];
}

// ─── Dump Station ──────────────────────────────────────────────────
export interface DumpStation {
  name: string;
  type: "free" | "paid" | "campground_only";
  price?: string;
  distance_mi: number;
  address: string;
  notes?: string;
}

// ─── FULL-TIME RV LIFE ────────────────────────────────────────────
export interface RVLifestyleData {
  climate: ClimateData;
  cost: CostIndex;
  connectivity: ConnectivityScore;
  nearby_services: NearbyService[];
  pet_score: PetScore;
  fuel: FuelPrice;
  community_events: CommunityEvent[];
  state_laws: StateRVLaws;
  dump_stations: DumpStation[];
}

// ─── Master Explore Result ─────────────────────────────────────────
export interface ExploreResult {
  destination: string;
  attractions: Attraction[];
  restaurants: Restaurant[];
  rv_parks: RVPark[];
  itinerary: StayPlan;
  lifestyle?: RVLifestyleData; // populated when full-time mode enabled
}
