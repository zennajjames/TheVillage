// Minneapolis, MN coordinates
export const MINNEAPOLIS_CENTER = {
  lat: 44.9778,
  lng: -93.2650
};

// Community locations — schools, neighborhoods, and suburbs (approximate coordinates)
export const COMMUNITY_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  // === SCHOOLS — North Minneapolis ===
  'Anwatin': { lat: 44.9740, lng: -93.3020 },
  'Burroughs': { lat: 44.9930, lng: -93.2960 },
  'Cityview': { lat: 44.9980, lng: -93.2940 },
  'Dowling': { lat: 44.9920, lng: -93.2850 },
  'Folwell': { lat: 44.9890, lng: -93.2990 },
  'Jenny Lind': { lat: 44.9870, lng: -93.2870 },
  'Nellie Stone Johnson': { lat: 44.9960, lng: -93.3010 },
  'Sheridan': { lat: 44.9950, lng: -93.2880 },
  'Webber Park': { lat: 45.0100, lng: -93.2940 },

  // === SCHOOLS — Northeast ===
  'Northeast Middle': { lat: 44.9990, lng: -93.2470 },
  'Sullivan': { lat: 44.9950, lng: -93.2360 },
  'Marcy': { lat: 44.9770, lng: -93.2430 },

  // === SCHOOLS — Central / Downtown ===
  'Downtown Open': { lat: 44.9710, lng: -93.2740 },
  'Loring': { lat: 44.9690, lng: -93.2800 },

  // === SCHOOLS — South Minneapolis ===
  'Anthony': { lat: 44.9430, lng: -93.2290 },
  'Bancroft': { lat: 44.9380, lng: -93.2670 },
  'Barton': { lat: 44.9270, lng: -93.2690 },
  'Emerson': { lat: 44.9350, lng: -93.2460 },
  'Green Central': { lat: 44.9580, lng: -93.2600 },
  'Howe': { lat: 44.9198, lng: -93.2145 },
  'Lyndale': { lat: 44.9500, lng: -93.2750 },
  'Pillsbury': { lat: 44.9530, lng: -93.2700 },
  'Pratt': { lat: 44.9360, lng: -93.2400 },
  'Sanford': { lat: 44.9480, lng: -93.2670 },
  'Seward Montessori': { lat: 44.9550, lng: -93.2310 },
  'Whittier International': { lat: 44.9490, lng: -93.2730 },

  // === SCHOOLS — Southwest Minneapolis ===
  'Armatage': { lat: 44.9080, lng: -93.3140 },
  'Lake Harriet - Lower': { lat: 44.9195, lng: -93.3098 },
  'Lake Harriet - Upper': { lat: 44.9230, lng: -93.3070 },
  'Field Elementary - Lower': { lat: 44.9210, lng: -93.2780 },
  'Field Elementary - Upper': { lat: 44.9240, lng: -93.2750 },
  'Northrop': { lat: 44.9140, lng: -93.2970 },
  'Washburn': { lat: 44.9160, lng: -93.3190 },

  // === SCHOOLS — Southeast / Nokomis area ===
  'Hale STEM School - Lower': { lat: 44.9190, lng: -93.2420 },
  'Hale STEM School - Upper': { lat: 44.9210, lng: -93.2400 },
  'Lake Nokomis - Wenonah': { lat: 44.9089, lng: -93.2278 },
  'Lake Nokomis - Keewaydin': { lat: 44.9165, lng: -93.2256 },
  'Minneapolis Kids': { lat: 44.9400, lng: -93.2260 },
  'Minnehaha Academy': { lat: 44.9370, lng: -93.2190 },
  'Morris Park Elementary': { lat: 44.9065, lng: -93.2145 },
  'Waite Park': { lat: 44.9100, lng: -93.2500 },
  'Windom': { lat: 44.9060, lng: -93.2560 },
  'Hiawatha Leadership': { lat: 44.9225, lng: -93.2118 },
  'Nokomis Montessori': { lat: 44.9130, lng: -93.2580 },

  // === MINNEAPOLIS NEIGHBORHOODS ===
  'Downtown Minneapolis': { lat: 44.9778, lng: -93.2650 },
  'North Loop': { lat: 44.9850, lng: -93.2740 },
  'Northeast Minneapolis': { lat: 44.9990, lng: -93.2470 },
  'St. Anthony Main': { lat: 44.9840, lng: -93.2560 },
  'Uptown Minneapolis': { lat: 44.9480, lng: -93.2980 },
  'Lyn-Lake': { lat: 44.9490, lng: -93.2870 },
  'Whittier': { lat: 44.9530, lng: -93.2720 },
  'Stevens Square': { lat: 44.9620, lng: -93.2740 },
  'Loring Park': { lat: 44.9690, lng: -93.2800 },
  'Lowry Hill': { lat: 44.9640, lng: -93.2940 },
  'Kenwood': { lat: 44.9680, lng: -93.3070 },
  'Bryn Mawr': { lat: 44.9730, lng: -93.3130 },
  'Linden Hills': { lat: 44.9220, lng: -93.3120 },
  'Fulton': { lat: 44.9270, lng: -93.3190 },
  'Lynnhurst': { lat: 44.9220, lng: -93.2920 },
  'Tangletown': { lat: 44.9180, lng: -93.2820 },
  'Kenny': { lat: 44.9120, lng: -93.2920 },
  'Nokomis': { lat: 44.9110, lng: -93.2420 },
  'Minnehaha': { lat: 44.9160, lng: -93.2100 },
  'Hiawatha': { lat: 44.9380, lng: -93.2170 },
  'Longfellow': { lat: 44.9340, lng: -93.2230 },
  'Seward': { lat: 44.9500, lng: -93.2360 },
  'Prospect Park': { lat: 44.9690, lng: -93.2190 },
  'Marcy-Holmes': { lat: 44.9770, lng: -93.2430 },
  'Powderhorn': { lat: 44.9380, lng: -93.2570 },
  'Corcoran': { lat: 44.9330, lng: -93.2570 },
  'Phillips': { lat: 44.9590, lng: -93.2610 },
  'Elliot Park': { lat: 44.9680, lng: -93.2620 },
  'North Minneapolis - Camden': { lat: 45.0190, lng: -93.3040 },
  'North Minneapolis - Victory': { lat: 45.0250, lng: -93.3200 },
  'North Minneapolis - Willard-Hay': { lat: 44.9970, lng: -93.3070 },
  'Harrison': { lat: 44.9790, lng: -93.3000 },
  'Diamond Lake': { lat: 44.9080, lng: -93.2640 },
  'Kingfield': { lat: 44.9280, lng: -93.2810 },

  // === ST. PAUL NEIGHBORHOODS ===
  'Downtown St. Paul': { lat: 44.9440, lng: -93.0900 },
  'Cathedral Hill': { lat: 44.9470, lng: -93.1130 },
  'Summit Hill': { lat: 44.9390, lng: -93.1270 },
  'Highland Park': { lat: 44.9160, lng: -93.1680 },
  'Mac-Groveland': { lat: 44.9310, lng: -93.1660 },
  'Merriam Park': { lat: 44.9510, lng: -93.1680 },
  'Snelling-Hamline': { lat: 44.9540, lng: -93.1570 },
  'Como Park': { lat: 44.9740, lng: -93.1420 },
  'St. Anthony Park': { lat: 44.9670, lng: -93.1930 },
  'Hamline-Midway': { lat: 44.9620, lng: -93.1560 },
  'Frogtown': { lat: 44.9600, lng: -93.1280 },
  'Payne-Phalen': { lat: 44.9640, lng: -93.0680 },
  "Dayton's Bluff": { lat: 44.9500, lng: -93.0620 },
  'West Side St. Paul': { lat: 44.9280, lng: -93.0870 },
  'West 7th - Fort Road': { lat: 44.9280, lng: -93.1280 },
  'Battle Creek - Highwood': { lat: 44.9370, lng: -93.0200 },
  'North End St. Paul': { lat: 44.9780, lng: -93.1070 },

  // === FIRST-RING SUBURBS ===
  'Richfield': { lat: 44.8830, lng: -93.2830 },
  'St. Louis Park': { lat: 44.9480, lng: -93.3480 },
  'Golden Valley': { lat: 44.9920, lng: -93.3590 },
  'Robbinsdale': { lat: 45.0320, lng: -93.3380 },
  'Crystal': { lat: 45.0320, lng: -93.3600 },
  'New Hope': { lat: 45.0380, lng: -93.3870 },
  'Columbia Heights': { lat: 45.0480, lng: -93.2470 },
  'Fridley': { lat: 45.0860, lng: -93.2630 },
  'South St. Paul': { lat: 44.8930, lng: -93.0380 },
  'West St. Paul': { lat: 44.8940, lng: -93.1010 },
  'Mendota Heights': { lat: 44.8830, lng: -93.1380 },
  'Roseville': { lat: 45.0060, lng: -93.1560 },
  'Maplewood': { lat: 44.9530, lng: -93.0250 },

  // === SECOND-RING SUBURBS ===
  'Edina': { lat: 44.8890, lng: -93.3500 },
  'Bloomington': { lat: 44.8410, lng: -93.2980 },
  'Eden Prairie': { lat: 44.8540, lng: -93.4710 },
  'Minnetonka': { lat: 44.9210, lng: -93.4680 },
  'Hopkins': { lat: 44.9250, lng: -93.4050 },
  'Plymouth': { lat: 45.0100, lng: -93.4550 },
  'Maple Grove': { lat: 45.0720, lng: -93.4560 },
  'Brooklyn Park': { lat: 45.0940, lng: -93.3560 },
  'Brooklyn Center': { lat: 45.0760, lng: -93.3320 },
  'Blaine': { lat: 45.1610, lng: -93.2350 },
  'Coon Rapids': { lat: 45.1200, lng: -93.3030 },
  'Burnsville': { lat: 44.7670, lng: -93.2780 },
  'Eagan': { lat: 44.8040, lng: -93.1660 },
  'Apple Valley': { lat: 44.7320, lng: -93.2180 },
  'Lakeville': { lat: 44.6500, lng: -93.2430 },
  'Inver Grove Heights': { lat: 44.8480, lng: -93.0430 },
  'Cottage Grove': { lat: 44.8280, lng: -92.9440 },
  'Woodbury': { lat: 44.9240, lng: -92.9590 },
  'Oakdale': { lat: 44.9630, lng: -92.9640 },
  'White Bear Lake': { lat: 45.0840, lng: -93.0100 },
  'Shoreview': { lat: 45.0790, lng: -93.1470 },
  'Arden Hills': { lat: 45.0720, lng: -93.1570 },
  'New Brighton': { lat: 45.0650, lng: -93.2020 },
  'Mounds View': { lat: 45.1040, lng: -93.2090 },
  'Wayzata': { lat: 44.9740, lng: -93.5070 },
  'Excelsior': { lat: 44.9030, lng: -93.5660 },
  'Chanhassen': { lat: 44.8620, lng: -93.5310 },
  'Savage': { lat: 44.7790, lng: -93.3360 },
  'Prior Lake': { lat: 44.7130, lng: -93.4230 },
  'Shakopee': { lat: 44.7980, lng: -93.5270 },
  'Stillwater': { lat: 45.0560, lng: -92.8060 },
};

// Keep backward-compatible alias
export const SCHOOL_LOCATIONS = COMMUNITY_LOCATIONS;

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
 * Get approximate coordinates for a community by matching name
 */
export function getSchoolCoordinates(name: string): { lat: number; lng: number } | null {
  for (const [key, coords] of Object.entries(COMMUNITY_LOCATIONS)) {
    if (name.toLowerCase().includes(key.toLowerCase())) {
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
