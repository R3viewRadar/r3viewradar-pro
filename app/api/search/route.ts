import { NextRequest, NextResponse } from "next/server";
import { geocodeLocation, haversineDistance, milesToMeters, formatDistance } from "@/lib/geo";
import type { LatLng } from "@/lib/geo";

/**
 * /api/search — Real-time business search using Google Places Text Search API.
 *
 * Query params:
 *   q        — search query (e.g., "personal injury lawyer")
 *   lat      — user latitude (from browser geolocation)
 *   lng      — user longitude
 *   location — city/zip fallback (geocoded to lat/lng if lat/lng not provided)
 *   radius   — search radius in miles (default 25)
 *   category — filter category (lawyer, insurance, finance, real-estate)
 *   sort     — ranking: relevance | rating | distance | review_count
 *   limit    — max results (default 20)
 */

interface PlacesResult {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  googleMapsUri?: string;
  currentOpeningHours?: { openNow?: boolean; weekdayDescriptions?: string[] };
  types?: string[];
  location?: { latitude: number; longitude: number };
  primaryTypeDisplayName?: { text: string };
  photos?: Array<{ name: string }>;
}

interface SearchResultItem {
  id: string;
  name: string;
  address: string;
  category: string;
  rating: number;
  review_count: number;
  phone: string;
  website: string;
  maps_url: string;
  hours_status: string;
  distance_miles: number;
  distance_label: string;
  is_open: boolean | null;
  lat: number;
  lng: number;
  photo_url: string;
  types: string[];
}

const CATEGORY_QUERIES: Record<string, string> = {
  lawyer: "lawyer attorney legal",
  insurance: "insurance agent broker",
  finance: "financial advisor planner",
  "real-estate": "real estate agent realtor",
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const latStr = searchParams.get("lat");
  const lngStr = searchParams.get("lng");
  const locationStr = searchParams.get("location") ?? "";
  const radiusMiles = parseInt(searchParams.get("radius") ?? "25");
  const category = searchParams.get("category") ?? "";
  const sortBy = searchParams.get("sort") ?? "relevance";
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  // Resolve user location
  let userLocation: LatLng | null = null;

  if (latStr && lngStr) {
    userLocation = { lat: parseFloat(latStr), lng: parseFloat(lngStr) };
  } else if (locationStr) {
    userLocation = await geocodeLocation(locationStr, apiKey);
  }

  // Build search query with category context
  let searchQuery = query;
  if (category && CATEGORY_QUERIES[category]) {
    if (!query) {
      searchQuery = CATEGORY_QUERIES[category];
    } else {
      searchQuery = `${query} ${CATEGORY_QUERIES[category]}`;
    }
  }

  if (!searchQuery) {
    return NextResponse.json(
      { results: [], total: 0, error: "Please provide a search query." },
      { status: 400 }
    );
  }

  // If Google Places API is available, use it
  if (apiKey) {
    try {
      const results = await searchGooglePlaces(
        searchQuery,
        userLocation,
        radiusMiles,
        limit,
        apiKey
      );

      // Sort results
      const sorted = sortResults(results, sortBy, userLocation);

      return NextResponse.json({
        results: sorted,
        total: sorted.length,
        query: searchQuery,
        user_location: userLocation,
        radius_miles: radiusMiles,
        source: "google_places",
      });
    } catch (err) {
      console.error("Google Places search error:", err);
      // Fall through to mock data
    }
  }

  // Fallback: generate mock results based on query
  const mockResults = generateMockSearchResults(searchQuery, category, userLocation, limit);
  const sorted = sortResults(mockResults, sortBy, userLocation);

  return NextResponse.json({
    results: sorted,
    total: sorted.length,
    query: searchQuery,
    user_location: userLocation,
    radius_miles: radiusMiles,
    source: "mock",
  });
}

async function searchGooglePlaces(
  query: string,
  userLocation: LatLng | null,
  radiusMiles: number,
  maxResults: number,
  apiKey: string
): Promise<SearchResultItem[]> {
  const requestBody: Record<string, unknown> = {
    textQuery: query,
    maxResultCount: Math.min(maxResults, 20),
    languageCode: "en",
    rankPreference: "RELEVANCE",
  };

  // Apply location bias if we have coordinates
  if (userLocation) {
    requestBody.locationBias = {
      circle: {
        center: {
          latitude: userLocation.lat,
          longitude: userLocation.lng,
        },
        radius: milesToMeters(radiusMiles),
      },
    };
  }

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.googleMapsUri,places.currentOpeningHours,places.types,places.location,places.primaryTypeDisplayName",
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`Google Places error ${res.status}:`, errText);
    throw new Error(`Google Places API error: ${res.status}`);
  }

  const data = (await res.json()) as { places?: PlacesResult[] };
  const places = data.places ?? [];

  return places.map((p) => {
    const placeLat = p.location?.latitude ?? 0;
    const placeLng = p.location?.longitude ?? 0;
    const dist = userLocation
      ? haversineDistance(userLocation, { lat: placeLat, lng: placeLng })
      : 0;

    return {
      id: p.id ?? crypto.randomUUID(),
      name: p.displayName?.text ?? "Unknown",
      address: p.formattedAddress ?? "",
      category: p.primaryTypeDisplayName?.text ?? formatTypes(p.types),
      rating: p.rating ?? 0,
      review_count: p.userRatingCount ?? 0,
      phone: p.nationalPhoneNumber ?? p.internationalPhoneNumber ?? "",
      website: p.websiteUri ?? "",
      maps_url: p.googleMapsUri ?? "",
      hours_status: p.currentOpeningHours?.openNow === true
        ? "Open now"
        : p.currentOpeningHours?.openNow === false
        ? "Closed"
        : "",
      distance_miles: Math.round(dist * 10) / 10,
      distance_label: userLocation ? formatDistance(dist) : "",
      is_open: p.currentOpeningHours?.openNow ?? null,
      lat: placeLat,
      lng: placeLng,
      photo_url: "",
      types: p.types ?? [],
    };
  });
}

function formatTypes(types?: string[]): string {
  if (!types?.length) return "Business";
  const map: Record<string, string> = {
    lawyer: "Lawyer",
    attorney: "Attorney",
    law_firm: "Law Firm",
    insurance_agency: "Insurance Agency",
    financial_planner: "Financial Planner",
    accounting: "Accountant",
    real_estate_agency: "Real Estate Agency",
    real_estate_agent: "Real Estate Agent",
    restaurant: "Restaurant",
    doctor: "Doctor",
    dentist: "Dentist",
    hospital: "Hospital",
    pharmacy: "Pharmacy",
    store: "Store",
    cafe: "Cafe",
  };
  for (const t of types) {
    if (map[t]) return map[t];
  }
  return types[0]?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ?? "Business";
}

function sortResults(
  results: SearchResultItem[],
  sortBy: string,
  userLocation: LatLng | null
): SearchResultItem[] {
  const sorted = [...results];
  switch (sortBy) {
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating || b.review_count - a.review_count);
      break;
    case "distance":
      if (userLocation) {
        sorted.sort((a, b) => a.distance_miles - b.distance_miles);
      }
      break;
    case "review_count":
      sorted.sort((a, b) => b.review_count - a.review_count);
      break;
    case "relevance":
    default:
      // Composite score: rating weight + review volume + distance penalty
      sorted.sort((a, b) => {
        const scoreA = computeRelevanceScore(a, userLocation);
        const scoreB = computeRelevanceScore(b, userLocation);
        return scoreB - scoreA;
      });
      break;
  }
  return sorted;
}

function computeRelevanceScore(item: SearchResultItem, userLocation: LatLng | null): number {
  let score = 0;

  // Rating: 0-50 points
  score += (item.rating / 5) * 50;

  // Review volume: 0-30 points (log scale)
  const reviewScore = Math.min(30, Math.log10(Math.max(1, item.review_count)) * 10);
  score += reviewScore;

  // Distance penalty: closer is better (0 to -20 points)
  if (userLocation && item.distance_miles > 0) {
    const distPenalty = Math.min(20, item.distance_miles * 0.5);
    score -= distPenalty;
  }

  // Open bonus: +5 for currently open businesses
  if (item.is_open === true) score += 5;

  return score;
}

// ─── Mock Data Fallback ──────────────────────────────────────────────────

function generateMockSearchResults(
  query: string,
  category: string,
  userLocation: LatLng | null,
  limit: number
): SearchResultItem[] {
  const baseLat = userLocation?.lat ?? 40.7128;
  const baseLng = userLocation?.lng ?? -73.9712;

  const names = [
    "Smith & Associates", "Johnson Legal Group", "Park Financial",
    "Chen Insurance Services", "Rodriguez Realty", "Thompson Law Firm",
    "Williams Advisory", "Davis & Partners", "Martinez Insurance Group",
    "Anderson Financial Planning", "Taylor Real Estate", "Lee Legal Services",
    "Wilson Insurance Agency", "Brown Wealth Management", "Garcia & Associates",
    "Miller Law Office", "Jones Financial Group", "Clark Insurance Advisors",
    "Hall Realty Group", "Wright Legal Counsel",
  ];

  const categoryLabels: Record<string, string> = {
    lawyer: "Law Firm",
    insurance: "Insurance Agency",
    finance: "Financial Advisor",
    "real-estate": "Real Estate Agency",
  };

  const streets = [
    "Main St", "Broadway", "Market St", "Oak Ave", "5th Ave", "Park Dr",
    "Commerce Blvd", "Liberty Ave", "Court St", "Federal Blvd", "State St",
    "Center Ave", "Court Square", "Wall St", "Madison Ave",
  ];

  const cityState = userLocation
    ? "Local Area"
    : "New York, NY";

  return Array.from({ length: Math.min(limit, 20) }, (_, i) => {
    // Scatter locations around user within radius
    const latOffset = (Math.random() - 0.5) * 0.3;
    const lngOffset = (Math.random() - 0.5) * 0.3;
    const placeLat = baseLat + latOffset;
    const placeLng = baseLng + lngOffset;
    const dist = userLocation
      ? haversineDistance(userLocation, { lat: placeLat, lng: placeLng })
      : i * 1.2 + Math.random() * 2;

    const rating = Math.round((3.5 + Math.random() * 1.5) * 10) / 10;
    const reviewCount = Math.floor(20 + Math.random() * 500);
    const streetNum = Math.floor(100 + Math.random() * 9000);
    const isOpen = Math.random() > 0.2;

    return {
      id: `mock-${i}`,
      name: names[i % names.length],
      address: `${streetNum} ${streets[i % streets.length]}, ${cityState}`,
      category: categoryLabels[category] ?? "Professional Services",
      rating,
      review_count: reviewCount,
      phone: `(${200 + Math.floor(Math.random() * 800)}) ${200 + Math.floor(Math.random() * 800)}-${1000 + Math.floor(Math.random() * 9000)}`,
      website: `https://www.${names[i % names.length].toLowerCase().replace(/[^a-z]+/g, "")}.com`,
      maps_url: `https://www.google.com/maps/search/${encodeURIComponent(query + " " + cityState)}`,
      hours_status: isOpen ? "Open now" : "Closed",
      distance_miles: Math.round(dist * 10) / 10,
      distance_label: formatDistance(dist),
      is_open: isOpen,
      lat: placeLat,
      lng: placeLng,
      photo_url: "",
      types: [],
    };
  }).sort((a, b) => a.distance_miles - b.distance_miles);
}
