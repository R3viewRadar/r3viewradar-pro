import { NextRequest, NextResponse } from "next/server";
import { geocodeLocation, haversineDistance, milesToMeters, formatDistance } from "@/lib/geo";
import type { LatLng } from "@/lib/geo";

/**
 * /api/search — LIVE Google Places Text Search API.
 * No mock data. No fallbacks. Real businesses only.
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
  currentOpeningHours?: { openNow?: boolean };
  types?: string[];
  location?: { latitude: number; longitude: number };
  primaryTypeDisplayName?: { text: string };
}

interface SearchResultItem {
  id: string;
  place_id: string;
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
  types: string[];
}

const CATEGORY_QUERIES: Record<string, string> = {
  lawyer: "lawyer attorney",
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

  // HARD REQUIREMENT: API key must be set
  if (!apiKey) {
    return NextResponse.json(
      { results: [], total: 0, error: "Google Places API key is not configured. Add GOOGLE_PLACES_API_KEY to Vercel environment variables.", source: "error" },
      { status: 503 }
    );
  }

  // Resolve user location
  let userLocation: LatLng | null = null;

  if (latStr && lngStr) {
    userLocation = { lat: parseFloat(latStr), lng: parseFloat(lngStr) };
  } else if (locationStr) {
    userLocation = await geocodeLocation(locationStr, apiKey);
  }

  // Build search query
  let searchQuery = query;
  if (category && CATEGORY_QUERIES[category]) {
    searchQuery = query ? `${query} ${CATEGORY_QUERIES[category]}` : CATEGORY_QUERIES[category];
  }

  // If user provided location text but no query + no category, search for businesses in that area
  if (!searchQuery && locationStr) {
    searchQuery = "businesses";
  }

  if (!searchQuery) {
    return NextResponse.json(
      { results: [], total: 0, error: "Please provide a search query." },
      { status: 400 }
    );
  }

  // If we have a location string but no coordinates, append it to the query for better results
  if (!userLocation && locationStr) {
    searchQuery = `${searchQuery} in ${locationStr}`;
  }

  try {
    const results = await searchGooglePlaces(
      searchQuery,
      userLocation,
      radiusMiles,
      limit,
      apiKey
    );

    // Filter out results with no rating (usually irrelevant or unreviewed)
    const filtered = results.filter((r) => r.rating > 0 && r.review_count > 0);

    // Sort
    const sorted = sortResults(filtered.length > 0 ? filtered : results, sortBy, userLocation);

    return NextResponse.json({
      results: sorted,
      total: sorted.length,
      query: searchQuery,
      user_location: userLocation,
      radius_miles: radiusMiles,
      source: "google_places",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Google Places search failed:", message);
    return NextResponse.json(
      { results: [], total: 0, error: `Search failed: ${message}`, source: "error" },
      { status: 502 }
    );
  }
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
  };

  // Apply location bias — this is critical for accurate local results
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
    // When we have location, rank by distance for better local results
    requestBody.rankPreference = "DISTANCE";
  } else {
    requestBody.rankPreference = "RELEVANCE";
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
    const errBody = await res.text();
    console.error(`Google Places API ${res.status}:`, errBody);
    throw new Error(`Google Places API returned ${res.status}`);
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
      id: p.id ?? "",
      place_id: p.id ?? "",
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
      types: p.types ?? [],
    };
  });
}

function formatTypes(types?: string[]): string {
  if (!types?.length) return "Business";
  const map: Record<string, string> = {
    lawyer: "Lawyer", attorney: "Attorney", law_firm: "Law Firm",
    insurance_agency: "Insurance Agency", financial_planner: "Financial Planner",
    accounting: "Accountant", real_estate_agency: "Real Estate Agency",
    real_estate_agent: "Real Estate Agent", restaurant: "Restaurant",
    doctor: "Doctor", dentist: "Dentist", hospital: "Hospital",
    pharmacy: "Pharmacy", store: "Store", cafe: "Cafe",
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
      if (userLocation) sorted.sort((a, b) => a.distance_miles - b.distance_miles);
      break;
    case "review_count":
      sorted.sort((a, b) => b.review_count - a.review_count);
      break;
    case "relevance":
    default:
      sorted.sort((a, b) => {
        const sa = (a.rating / 5) * 50 + Math.min(30, Math.log10(Math.max(1, a.review_count)) * 10)
          - (userLocation && a.distance_miles > 0 ? Math.min(20, a.distance_miles * 0.5) : 0)
          + (a.is_open === true ? 5 : 0);
        const sb = (b.rating / 5) * 50 + Math.min(30, Math.log10(Math.max(1, b.review_count)) * 10)
          - (userLocation && b.distance_miles > 0 ? Math.min(20, b.distance_miles * 0.5) : 0)
          + (b.is_open === true ? 5 : 0);
        return sb - sa;
      });
      break;
  }
  return sorted;
}
