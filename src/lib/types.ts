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
