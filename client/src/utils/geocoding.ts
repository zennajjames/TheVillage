// Minneapolis, MN coordinates
export const MINNEAPOLIS_CENTER = {
  lat: 44.9778,
  lng: -93.2650
};

// School locations (approximate - you can adjust these)
export const SCHOOL_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  // Lake Nokomis area
  'Wenonah': { lat: 44.9089, lng: -93.2278 }, // 5625 23rd Ave S, Minneapolis, MN 55417
  'Keewaydin': { lat: 44.9165, lng: -93.2256 },

  // Hiawatha area
  'Hiawatha': { lat: 44.9225, lng: -93.2118 },
  'Howe': { lat: 44.9198, lng: -93.2145 },

  // Lake Harriet area
  'Lake Harriet Lower': { lat: 44.9195, lng: -93.3098 },
  'Lake Harriet Upper': { lat: 44.9128, lng: -93.3089 },
};

/**
 * Geocode an address to coordinates using Google Maps Geocoding API
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('Google Maps API key not found');
      return null;
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    );

    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    }

    console.error('Geocoding failed:', data.status);
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

/**
 * Get approximate coordinates for a school by matching name
 */
export function getSchoolCoordinates(schoolName: string): { lat: number; lng: number } | null {
  // Try to find a matching school location
  for (const [key, coords] of Object.entries(SCHOOL_LOCATIONS)) {
    if (schoolName.toLowerCase().includes(key.toLowerCase())) {
      return coords;
    }
  }

  // Return Minneapolis center as fallback
  return MINNEAPOLIS_CENTER;
}

/**
 * Get user's approximate location from zip code or address components
 */
export async function getUserLocation(
  zipCode?: string,
  street?: string,
  city?: string,
  state?: string
): Promise<{ lat: number; lng: number }> {
  // Try full address first if we have street
  if (street) {
    const addressParts = [street, city, state, zipCode].filter(Boolean);
    if (addressParts.length > 0) {
      const fullAddress = addressParts.join(', ');
      const coords = await geocodeAddress(fullAddress);
      if (coords) return coords;
    }
  }

  // Try city and state
  if (city && state) {
    const coords = await geocodeAddress(`${city}, ${state}`);
    if (coords) return coords;
  }

  // Fall back to zip code
  if (zipCode) {
    const coords = await geocodeAddress(zipCode);
    if (coords) return coords;
  }

  // Default to Minneapolis center
  return MINNEAPOLIS_CENTER;
}

/**
 * Calculate distance between two points in miles
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
