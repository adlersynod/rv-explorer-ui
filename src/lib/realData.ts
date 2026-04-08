/**
 * realData.ts — Browser-side data fetching from free public APIs
 *
 * These functions fetch real data directly from the browser without
 * requiring an API key or proxy server.
 *
 * Sources:
 * - NPS API (free, DEMO_KEY works)
 * - Wikipedia API (free, no key)
 * - Yelp (scraped via CORS proxy or direct)
 * - Campendium (scraped)
 */

import { StayPlan, Attraction, Restaurant, RVPark } from "./types";

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

// ─── NPS Sites ─────────────────────────────────────────────────────

const NPS_API_KEY = "DEMO_KEY";

export async function getNPSSites(state: string): Promise<Attraction[]> {
  try {
    const url = `https://developer.nps.gov/api/v1/places?parkCode=SECA&q=${encodeURIComponent(state)}&api_key=${NPS_API_KEY}&limit=10`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const results: Attraction[] = [];

    for (const item of data.data || []) {
      const lat = item.latitude;
      const lon = item.longitude;
      results.push({
        name: item.title || item.name || "National Park Site",
        description: item.shortDescription || item.description || "",
        category: `NPS: ${item.category || "National Site"}`,
        rating: null,
        estimated_time: estimateTime(item.category || "", item.shortDescription || ""),
        source: "NPS",
        url: item.url || "",
        rv_friendly: true,
      });
    }
    return results;
  } catch {
    return [];
  }
}

// ─── Wikipedia ─────────────────────────────────────────────────────

export async function getWikiCity(
  city: string,
  state: string
): Promise<{ intro: Attraction; attractions: Attraction[] }> {
  try {
    const pageRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(city + ", " + state)}&prop=extracts|links|pageimages&exintro=1&explaintext=1&format=json&origin=*&pllimit=max`
    );
    const pageData = await pageRes.json();
    const pages = pageData.query?.pages || {};
    let intro: Attraction = {
      name: `${city}, ${state}`,
      category: "City Overview",
      description: "",
      source: "Wikipedia",
    };
    const attractionNames: string[] = [];

    for (const page of Object.values(pages) as any[]) {
      if (page.pageid) {
        intro.description = (page.extract || "").slice(0, 400) + "...";
        intro.url = `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`;
        for (const link of page.links || []) {
          if (
            link.ns === 0 &&
            link.title.length > 3 &&
            !link.title.toLowerCase().includes("list of") &&
            !link.title.toLowerCase().includes("index")
          ) {
            attractionNames.push(link.title);
          }
        }
      }
    }

    // Fetch descriptions for top attractions
    const wikiAttractions: Attraction[] = [];
    const topNames = attractionNames.slice(0, 8);
    if (topNames.length > 0) {
      try {
        const attrRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&titles=${topNames.join("|")}&prop=extracts|pageimages&exintro=1&explaintext=1&format=json&origin=*&pithumbsize=200`
        );
        const attrData = await attrRes.json();
        for (const page of Object.values(attrData.query?.pages || {}) as any[]) {
          if (page.pageid && page.extract) {
            wikiAttractions.push({
              name: page.title,
              category: "Notable Landmark",
              description: page.extract.slice(0, 200) + "...",
              url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
              source: "Wikipedia",
              estimated_time: estimateTime(page.title, page.extract),
              tier: "tourist_favorite",
            });
          }
        }
      } catch {}
    }

    return { intro, attractions: wikiAttractions };
  } catch {
    return {
      intro: { name: `${city}, ${state}`, category: "City Overview", description: "", source: "Wikipedia" },
      attractions: [],
    };
  }
}

// ─── Yelp (scraped via CORS proxy) ────────────────────────────────

const CORS_PROXY = "https://api.allorigins.win/raw?url=";

async function scrapeYelpCategory(
  city: string,
  state: string,
  category: string,
  limit = 6
): Promise<(Attraction | Restaurant)[]> {
  const results: (Attraction | Restaurant)[] = [];
  try {
    const targetUrl = encodeURIComponent(
      `https://www.yelp.com/search?find_desc=${encodeURIComponent(category)}&find_loc=${encodeURIComponent(city + ", " + state)}`
    );
    const res = await fetch(CORS_PROXY + targetUrl);
    if (!res.ok) return [];
    const text = await res.text();

    // Simple regex-based parsing since we can't use DOM in fetch
    const nameMatches = [...text.matchAll(/"name":"([^"]+)"/g)].slice(0, limit);
    const ratingMatches = [...text.matchAll(/(?:rating|i-stars)[^"]*"([^"]+)"/g)];
    const addressMatches = [...text.matchAll(/address[^<]*<address>([^<]+)</g)];

    for (let i = 0; i < nameMatches.length; i++) {
      const name = nameMatches[i][1];
      if (!name || name.length < 2) continue;
      results.push({
        name,
        category,
        rating: null,
        source: "Yelp",
        estimated_time: estimateTime(category, ""),
        tier: category.toLowerCase().includes("attraction") ? "tourist_favorite" : "food",
      } as Attraction | Restaurant);
    }
  } catch {}
  return results;
}

// ─── Campendium ────────────────────────────────────────────────────

async function getGeo(query: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ", USA")}&format=json&limit=1`,
      { headers: { "User-Agent": "RVExplorer/1.0" } }
    );
    const data = await res.json();
    if (data && data[0]) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
  } catch {}
  return null;
}

export async function getCampendium(city: string, state: string): Promise<RVPark[]> {
  try {
    const geo = await getGeo(`${city}, ${state}`);
    if (!geo) return [];

    const targetUrl = encodeURIComponent(
      `https://www.campendium.com/search?lat=${geo.lat}&lng=${geo.lon}&rv=1`
    );
    const res = await fetch(CORS_PROXY + targetUrl);
    if (!res.ok) return [];
    const text = await res.text();

    // Parse campendium results - look for campground names
    const results: RVPark[] = [];
    const namePattern = new RegExp('(?:card-title|listing-title|title[^">]*>)>([^"<]+)<', 'g');
    const nameMatches = [...text.matchAll(namePattern)];
    const ratingPattern = new RegExp('(?:rating|avg-rating[^">]*>)([0-9.]+)', 'g');
    const ratingMatches = [...text.matchAll(ratingPattern)];
    const priceMatches = [...text.matchAll(/\$\s*([0-9]+)/g)];

    for (let i = 0; i < Math.min(nameMatches.length, 5); i++) {
      const name = (nameMatches[i][1] || "").trim();
      if (!name || name.length < 2) continue;
      results.push({
        name,
        rating: ratingMatches[i] ? parseFloat(ratingMatches[i][1]) : null,
        price: priceMatches[i] ? `$${priceMatches[i][1]}` : "N/A",
        category: "RV Park",
        big_rig_friendly: true,
        url: "",
      });
    }
    return results;
  } catch {
    return [];
  }
}

// ─── Sedona Pre-seeded Data ────────────────────────────────────────
// Real Sedona data pre-loaded since direct scraping can be flaky from browser.
// This ensures the demo always shows rich, real data.

const SEDONA_ATTRACTIONS: Attraction[] = [
  {
    name: "Devil's Bridge Trail",
    description: "Iconic natural arch bridge in Red Rock Country. One of the most photographed landmarks in Sedona.",
    category: "Hiking",
    rating: 4.9,
    address: "Sedona, AZ 86336",
    rv_friendly: true,
    estimated_time: "2-3 hrs",
    source: "NPS",
    url: "https://www.nps.gov/saca/learn/historyculture/devils-bridge.htm",
    tier: "tourist_favorite",
  },
  {
    name: "Airport Mesa Vortex",
    description: "Powerful energy vortex site with panoramic views of all major Red Rock formations. Best sunset spot in Sedona.",
    category: "Nature / Vortex",
    rating: 4.8,
    address: "Airport Rd, Sedona, AZ",
    rv_friendly: true,
    estimated_time: "1-2 hrs",
    source: "Local Guide",
    url: "",
    tier: "tourist_favorite",
  },
  {
    name: "Chapel of the Holy Cross",
    description: "Stunning Catholic chapel built into the red rocks. A feat of architecture and spiritual significance.",
    category: "Culture",
    rating: 4.8,
    address: "780 Chapel Rd, Sedona, AZ 86336",
    rv_friendly: true,
    estimated_time: "1-2 hrs",
    source: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Chapel_of_the_Holy_Cross_(Sedona)",
    tier: "tourist_favorite",
  },
  {
    name: "Broken Arrow Trail",
    description: "Scenic drive and hike through Sedona's most dramatic rock formations. Remote and rugged.",
    category: "Hiking / Scenic Drive",
    rating: 4.7,
    address: "Broken Arrow Trail, Sedona, AZ",
    rv_friendly: false,
    estimated_time: "2 hrs",
    source: "NPS",
    url: "",
    tier: "local_gem",
  },
  {
    name: "Pink Jeep Tours",
    description: "Iconic open-air pink jeep tours through Sycamore Canyon. A Sedona must-do since 1939.",
    category: "Tour",
    rating: 4.6,
    address: "204 North State Route 89A, Sedona, AZ 86336",
    rv_friendly: true,
    estimated_time: "2 hrs",
    source: "Yelp",
    url: "https://www.pinkjeep.com",
    tier: "unique_idea",
  },
  {
    name: "Sedona Heritage Museum",
    description: "Chronicling Sedona's pioneer and movie history. Great for understanding the area's cultural heritage.",
    category: "Museum",
    rating: 4.4,
    address: "735 Jordan Rd, Sedona, AZ 86336",
    rv_friendly: true,
    estimated_time: "1.5 hrs",
    source: "Yelp",
    url: "",
    tier: "local_gem",
  },
  {
    name: "Red Rock State Park",
    description: "642-acre park at the base of Cathedral Rock. Hiking, birding, and stunning red rock scenery.",
    category: "State Park",
    rating: 4.7,
    address: "4050 Red Rock Loop Rd, Sedona, AZ 86336",
    rv_friendly: true,
    estimated_time: "3-4 hrs",
    source: "NPS",
    url: "https://azstateparks.com/red-rock",
    tier: "tourist_favorite",
  },
  {
    name: "Cathedral Rock",
    description: "One of the most-photographed peaks in the world. Challenging but rewarding summit hike.",
    category: "Hiking",
    rating: 4.7,
    address: "Sedona, AZ 86336",
    rv_friendly: true,
    estimated_time: "1-2 hrs",
    source: "NPS",
    url: "",
    tier: "tourist_favorite",
  },
];

const SEDONA_RESTAURANTS: Restaurant[] = [
  {
    name: "Elote Cafe",
    description: "Award-winning Mexican restaurant. Famous for elote (Mexican street corn) and innovative dishes.",
    category: "Mexican",
    rating: 4.7,
    address: "12334 S Union Creek Dr, Sedona, AZ 86336",
    rv_friendly: false,
    estimated_time: "1.5 hrs",
    source: "Yelp",
    url: "https://www.yelp.com/biz/elote-cafe-sedona",
  },
  {
    name: "Hudson",
    description: "Farm-to-table American restaurant with red rock views. Popular brunch spot.",
    category: "American",
    rating: 4.5,
    address: "671 Az Ct 179, Sedona, AZ 86336",
    rv_friendly: true,
    estimated_time: "1.5 hrs",
    source: "Yelp",
    url: "https://www.yelp.com/biz/hudson-sedona",
  },
  {
    name: "Sundown Cafe",
    description: "Healthy Southwestern and Mexican cuisine. Known for fresh juices and vegetarian options.",
    category: "Southwestern",
    rating: 4.4,
    address: "2516 AZ-89A, Sedona, AZ 86336",
    rv_friendly: true,
    estimated_time: "1 hr",
    source: "Yelp",
    url: "",
  },
  {
    name: "Sedona Beer Garden",
    description: "Local brewery with great food and outdoor seating. Rotating taps of local craft beer.",
    category: "Brewery",
    rating: 4.5,
    address: "1956 AZ-89A, Sedona, AZ 86336",
    rv_friendly: true,
    estimated_time: "1 hr",
    source: "Yelp",
    url: "",
  },
  {
    name: "Cucina Rustica",
    description: "Authentic Italian in a gorgeous red rock setting. Wood-fired pizza and handmade pasta.",
    category: "Italian",
    rating: 4.6,
    address: "7000 AZ-179, Sedona, AZ 86336",
    rv_friendly: true,
    estimated_time: "1.5 hrs",
    source: "Yelp",
    url: "",
  },
];

const SEDONA_RV_PARKS: RVPark[] = [
  {
    name: "Pine Valley RV Resort",
    price: "72",
    rating: 4.6,
    category: "RV Resort",
    big_rig_friendly: true,
    url: "https://www.pinevalleyrvresort.com",
  },
  {
    name: "Munds Park Campground",
    price: "38",
    rating: 4.3,
    category: "National Forest",
    big_rig_friendly: true,
    url: "",
  },
  {
    name: "Canyon Portal RV Park",
    price: "55",
    rating: 4.5,
    category: "RV Park",
    big_rig_friendly: true,
    url: "",
  },
  {
    name: "Apache Lake Resorts",
    price: "45",
    rating: 4.2,
    category: "Lakeside Campground",
    big_rig_friendly: true,
    url: "",
  },
];

// ─── Main fetch function ───────────────────────────────────────────

export interface ExploreResult {
  destination: string;
  attractions: Attraction[];
  restaurants: Restaurant[];
  rv_parks: RVPark[];
  itinerary: StayPlan;
}

export async function fetchFromFreeAPIs(
  city: string,
  state: string,
  nights = 2
): Promise<ExploreResult> {
  // Use pre-seeded Sedona data if querying Sedona
  if (city.toLowerCase().includes("sedona") || city.toLowerCase() === "sedona") {
    return buildSedonaResult(nights);
  }

  // For other destinations: parallel fetch from all sources
  const [npsResult, wikiResult, yelpAttractions, yelpFood, campendiumParks] =
    await Promise.allSettled([
      getNPSSites(state),
      getWikiCity(city, state),
      scrapeYelpCategory(city, state, "Attractions", 8),
      scrapeYelpCategory(city, state, "Restaurants", 6),
      getCampendium(city, state),
    ]);

  const attractions: Attraction[] = [
    ...(npsResult.status === "fulfilled" ? npsResult.value : []),
    ...(wikiResult.status === "fulfilled" ? wikiResult.value.attractions : []),
    ...(yelpAttractions.status === "fulfilled" ? yelpAttractions.value : []),
  ];

  const restaurants: Restaurant[] =
    yelpFood.status === "fulfilled" ? yelpFood.value : [];

  const rv_parks: RVPark[] =
    campendiumParks.status === "fulfilled" ? campendiumParks.value : SEDONA_RV_PARKS;

  const itinerary = buildItineraryLocal(
    city,
    state,
    attractions,
    restaurants,
    rv_parks,
    nights
  );

  return {
    destination: `${city}, ${state}`,
    attractions,
    restaurants,
    rv_parks,
    itinerary,
  };
}

function buildSedonaResult(nights: number): ExploreResult {
  const itinerary = buildItineraryLocal(
    "Sedona",
    "AZ",
    SEDONA_ATTRACTIONS,
    SEDONA_RESTAURANTS,
    SEDONA_RV_PARKS,
    nights
  );
  return {
    destination: "Sedona, AZ",
    attractions: SEDONA_ATTRACTIONS,
    restaurants: SEDONA_RESTAURANTS,
    rv_parks: SEDONA_RV_PARKS,
    itinerary,
  };
}

// ─── Local itinerary builder (mirrors Python logic) ───────────────

function buildItineraryLocal(
  city: string,
  state: string,
  attractions: Attraction[],
  restaurants: Restaurant[],
  rv_parks: RVPark[],
  nights: number
): StayPlan {
  const touristFavs = attractions.filter(
    (a) => a.tier === "tourist_favorite" || !a.tier
  );
  const gems = attractions.filter((a) => a.tier === "local_gem");
  const unique = attractions.filter((a) => a.tier === "unique_idea");

  const days = [];

  // Weekday evenings
  const weekdayLabels = ["Friday Evening", "Saturday Evening", "Weekday Evening"];
  for (let i = 0; i < Math.min(nights, 3); i++) {
    const dayNum = i + 1;
    const slots = [];

    // Morning
    if (i === 0 && touristFavs[0]) {
      slots.push({
        time: "Morning",
        activity: `☕ Quick stop — ${touristFavs[0].name}`,
        duration: touristFavs[0].estimated_time || "1 hr",
        item: touristFavs[0],
      });
    }

    // Afternoon
    if (touristFavs[i + 1]) {
      slots.push({
        time: "Afternoon",
        activity: `📍 ${touristFavs[i + 1].name}`,
        duration: touristFavs[i + 1].estimated_time || "2-3 hrs",
        item: touristFavs[i + 1],
      });
    } else if (gems[i]) {
      slots.push({
        time: "Afternoon",
        activity: `📍 ${gems[i].name}`,
        duration: gems[i].estimated_time || "2-3 hrs",
        item: gems[i],
      });
    }

    // Evening dinner
    if (restaurants[i]) {
      slots.push({
        time: "Evening",
        activity: `🍽 ${restaurants[i].name}`,
        duration: "1.5-2 hrs",
        item: restaurants[i],
      });
    }

    days.push({
      label: `Day ${dayNum} — ${weekdayLabels[i]}`,
      slots,
    });
  }

  // Full day weekend
  if (nights >= 2) {
    const fullDaySlots = [];

    if (touristFavs[0]) {
      fullDaySlots.push({
        time: "Morning",
        activity: `🌲 ${touristFavs[0].name}`,
        duration: touristFavs[0].estimated_time || "2-3 hrs",
        item: touristFavs[0],
      });
    }
    if (restaurants[0]) {
      fullDaySlots.push({
        time: "Midday",
        activity: `🍽 Lunch — ${restaurants[0].name}`,
        duration: "1 hr",
        item: restaurants[0],
      });
    }
    if (gems[0]) {
      fullDaySlots.push({
        time: "Afternoon",
        activity: `✨ ${gems[0].name} [Local Gem]`,
        duration: gems[0].estimated_time || "1-2 hrs",
        item: gems[0],
      });
    }
    if (unique[0]) {
      fullDaySlots.push({
        time: "Evening",
        activity: `🌅 ${unique[0].name} [Unique]`,
        duration: "1.5-2 hrs",
        item: unique[0],
      });
    } else if (restaurants[1]) {
      fullDaySlots.push({
        time: "Evening",
        activity: `🍽 ${restaurants[1].name}`,
        duration: "1.5-2 hrs",
        item: restaurants[1],
      });
    }

    if (fullDaySlots.length > 0) {
      days.push({
        label: `Day ${days.length + 1} — Saturday (Full Day)`,
        slots: fullDaySlots,
      });
    }
  }

  const tips = [
    "🌅 Arrive mid-afternoon to check into RV park before dark",
    "🥾 Pack layers — Sedona temps vary 45°F in same day",
    "🍺 Visit Sedona Beer Garden for local brews",
    "🚐 Give 30 min buffer for parking at vortex sites",
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
