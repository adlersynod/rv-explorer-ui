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
  geometry: [number, number][]; // [lat, lon][]
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

// ─── Full-Time RV Lifestyle Data ─────────────────────────────────

export interface MonthlyClimate {
  month: string;
  avg_high_f: number;
  avg_low_f: number;
  rainfall_in: number;
  humidity_pct: number;
  score: number; // 1-10 RV livability score
}

export interface ClimateData {
  overall_score: number;
  best_months: string[];
  worst_months: string[];
  summer_temps: string;
  winter_temps: string;
  monthly: MonthlyClimate[];
}

export interface CostIndex {
  overall: number; // 1-10 (10 = cheapest)
  campground_avg: string; // per night
  groceries_idx: number; // vs national avg (100)
  gas_price: string; // per gallon
  propane: string; // per gallon
  overall_monthly: string; // estimated monthly RV total
}

export interface ConnectivityScore {
  overall: number; // 1-10
  starlink_rating: number; // 1-5
  verizon_signal: number; // 1-5 bars
  att_signal: number;
  tmobile_signal: number;
  top_rv_parks_wifi: string[];
  notes: string;
}

export interface NearbyService {
  name: string;
  type: "hospital" | "vet" | "propane" | "rv_repair" | "dump_station" | "laundry" | "store";
  distance_mi: number;
  address: string;
  open_now?: boolean;
}

export interface PetScore {
  overall: number; // 1-10
  dog_parks_nearby: number;
  pet_trails: number;
  vet_available: boolean;
  pet_stores: number;
  notes: string;
}

export interface FuelPrice {
  diesel: string;
  propane: string;
  updated: string;
  cheapest_station: string;
}

export interface CommunityEvent {
  name: string;
  date: string;
  category: string;
  url: string;
  free: boolean;
}

export interface RVLifestyleData {
  climate: ClimateData;
  cost: CostIndex;
  connectivity: ConnectivityScore;
  nearby_services: NearbyService[];
  pet_score: PetScore;
  fuel: FuelPrice;
  community_events: CommunityEvent[];
}
