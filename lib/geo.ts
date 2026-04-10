/**
 * Geolocation utilities: distance calculation, geocoding, radius filtering.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Calculate distance between two coordinates using the Haversine formula.
 * Returns distance in miles.
 */
export function haversineDistance(a: LatLng, b: LatLng): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sin2Lat = Math.sin(dLat / 2) ** 2;
  const sin2Lng = Math.sin(dLng / 2) ** 2;
  const h = sin2Lat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sin2Lng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Convert radius in miles to meters (for Google Places API).
 */
export function milesToMeters(miles: number): number {
  return Math.round(miles * 1609.34);
}

/**
 * Format distance for display.
 */
export function formatDistance(miles: number): string {
  if (miles < 0.1) return "< 0.1 mi";
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}

/**
 * Geocode a city/zip string to lat/lng using Google Geocoding API.
 * Falls back to a hardcoded map for common US cities when API is unavailable.
 */
export async function geocodeLocation(
  location: string,
  apiKey?: string
): Promise<LatLng | null> {
  // Try Google Geocoding API first
  if (apiKey) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`
      );
      const data = await res.json() as { results: Array<{ geometry: { location: { lat: number; lng: number } } }> };
      if (data.results?.[0]?.geometry?.location) {
        return {
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng,
        };
      }
    } catch (err) {
      console.error("Geocoding API error:", err);
    }
  }

  // Fallback: common US cities
  const cityMap: Record<string, LatLng> = {
    "new york": { lat: 40.7128, lng: -73.9712 },
    "nyc": { lat: 40.7128, lng: -73.9712 },
    "los angeles": { lat: 34.0522, lng: -118.2437 },
    "la": { lat: 34.0522, lng: -118.2437 },
    "chicago": { lat: 41.8781, lng: -87.6298 },
    "houston": { lat: 29.7604, lng: -95.3698 },
    "phoenix": { lat: 33.4484, lng: -112.074 },
    "philadelphia": { lat: 39.9526, lng: -75.1652 },
    "san antonio": { lat: 29.4241, lng: -98.4936 },
    "san diego": { lat: 32.7157, lng: -117.1611 },
    "dallas": { lat: 32.7767, lng: -96.7970 },
    "san jose": { lat: 37.3382, lng: -121.8863 },
    "austin": { lat: 30.2672, lng: -97.7431 },
    "jacksonville": { lat: 30.3322, lng: -81.6557 },
    "san francisco": { lat: 37.7749, lng: -122.4194 },
    "sf": { lat: 37.7749, lng: -122.4194 },
    "columbus": { lat: 39.9612, lng: -82.9988 },
    "indianapolis": { lat: 39.7684, lng: -86.1581 },
    "charlotte": { lat: 35.2271, lng: -80.8431 },
    "seattle": { lat: 47.6062, lng: -122.3321 },
    "denver": { lat: 39.7392, lng: -104.9903 },
    "washington": { lat: 38.9072, lng: -77.0369 },
    "dc": { lat: 38.9072, lng: -77.0369 },
    "nashville": { lat: 36.1627, lng: -86.7816 },
    "boston": { lat: 42.3601, lng: -71.0589 },
    "miami": { lat: 25.7617, lng: -80.1918 },
    "atlanta": { lat: 33.749, lng: -84.388 },
    "las vegas": { lat: 36.1699, lng: -115.1398 },
    "portland": { lat: 45.5152, lng: -122.6784 },
    "detroit": { lat: 42.3314, lng: -83.0458 },
    "memphis": { lat: 35.1495, lng: -90.049 },
    "baltimore": { lat: 39.2904, lng: -76.6122 },
    "milwaukee": { lat: 43.0389, lng: -87.9065 },
    "minneapolis": { lat: 44.9778, lng: -93.265 },
    "tampa": { lat: 27.9506, lng: -82.4572 },
    "orlando": { lat: 28.5383, lng: -81.3792 },
    "pittsburgh": { lat: 40.4406, lng: -79.9959 },
    "st. louis": { lat: 38.627, lng: -90.1994 },
    "cleveland": { lat: 41.4993, lng: -81.6944 },
    "kansas city": { lat: 39.0997, lng: -94.5786 },
    "new orleans": { lat: 29.9511, lng: -90.0715 },
    "sacramento": { lat: 38.5816, lng: -121.4944 },
    "salt lake city": { lat: 40.7608, lng: -111.891 },
    "raleigh": { lat: 35.7796, lng: -78.6382 },
  };

  const normalized = location.toLowerCase().trim();
  if (cityMap[normalized]) return cityMap[normalized];

  // Check if any key is contained in the input
  for (const [key, coords] of Object.entries(cityMap)) {
    if (normalized.includes(key)) return coords;
  }

  return null;
}
