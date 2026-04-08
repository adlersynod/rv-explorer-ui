/**
 * api.ts — RV Explorer API client
 *
 * Strategy:
 * 1. Try Railway backend API first (if accessible)
 * 2. Fall back to direct browser-side free APIs (NPS, Wikipedia, Yelp)
 */

import { StayPlan } from "./types";
import { fetchFromFreeAPIs, ExploreResult } from "./realData";

const API_BASE = "https://rv-trip-optimizer.railway.app";

export interface ExploreResponse {
  destination: string;
  attractions: any[];
  restaurants: any[];
  rv_parks: any[];
  itinerary: StayPlan;
}

/**
 * Main entry point for fetching destination data.
 * Tries Railway API → falls back to browser-side free APIs.
 */
export async function fetchDestination(
  city: string,
  state: string,
  nights: number
): Promise<ExploreResult> {
  // Try Railway API first
  try {
    const url = `${API_BASE}/api/explore?destination=${encodeURIComponent(city)},${encodeURIComponent(state)}&nights=${nights}`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        destination: data.destination || `${city}, ${state}`,
        attractions: data.attractions || [],
        restaurants: data.restaurants || [],
        rv_parks: data.rv_parks || [],
        itinerary: data.itinerary || buildFallbackItinerary(city, state, nights),
      };
    }
  } catch {
    // Railway unreachable — fall through to free APIs
  }

  // Fallback: fetch from free APIs directly in browser
  return fetchFromFreeAPIs(city, state, nights);
}

function buildFallbackItinerary(city: string, state: string, nights: number): StayPlan {
  return {
    destination: `${city}, ${state}`,
    stay_duration: `${nights}-night stay`,
    estimated_hours: 0,
    available_hours: nights * 6,
    days: [],
    rv_parks: [],
    tips: [],
  };
}
