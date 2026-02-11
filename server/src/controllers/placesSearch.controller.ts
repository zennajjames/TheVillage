import { Request, Response } from 'express';
import axios from 'axios';

interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  types: string[];
  rating?: number;
  userRatingsTotal?: number;
  category: string;
}

// Only search for neighborhoods, towns, and schools — no businesses
const COMMUNITY_SEARCH_QUERIES = [
  { query: 'neighborhood in', category: 'Neighborhood', type: 'neighborhood' },
  { query: 'elementary school in', category: 'School', type: 'school' },
  { query: 'middle school in', category: 'School', type: 'school' },
  { query: 'high school in', category: 'School', type: 'school' },
];

// Google Places types that are allowed — filter out businesses
const ALLOWED_TYPES = new Set([
  'neighborhood',
  'locality',
  'sublocality',
  'sublocality_level_1',
  'sublocality_level_2',
  'administrative_area_level_3',
  'school',
  'primary_school',
  'secondary_school',
  'university',
]);

export const searchLocalCommunities = async (req: Request, res: Response) => {
  try {
    const { zipCode } = req.query;

    if (!zipCode || typeof zipCode !== 'string' || zipCode.length !== 5 || !/^\d{5}$/.test(zipCode)) {
      return res.status(400).json({ error: 'A valid 5-digit zip code is required' });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Google Maps API key not configured' });
    }

    // Run all search queries in parallel
    const searchPromises = COMMUNITY_SEARCH_QUERIES.map(async ({ query, category, type }) => {
      try {
        const response = await axios.get(
          'https://maps.googleapis.com/maps/api/place/textsearch/json',
          {
            params: {
              query: `${query} ${zipCode}`,
              type,
              key: apiKey,
            },
          }
        );

        if (response.data.status === 'OK') {
          // Filter results to only include allowed place types
          return response.data.results
            .filter((place: any) => {
              const placeTypes: string[] = place.types || [];
              return placeTypes.some((t: string) => ALLOWED_TYPES.has(t));
            })
            .map((place: any) => ({
              placeId: place.place_id,
              name: place.name,
              address: place.formatted_address || '',
              types: place.types || [],
              rating: place.rating,
              userRatingsTotal: place.user_ratings_total,
              category,
            }));
        }
        return [];
      } catch (err) {
        console.error(`Places search failed for "${query} ${zipCode}":`, err);
        return [];
      }
    });

    const allResults = await Promise.all(searchPromises);
    const flatResults: PlaceResult[] = allResults.flat();

    // Deduplicate by placeId
    const seen = new Set<string>();
    const deduplicated: PlaceResult[] = [];
    for (const result of flatResults) {
      if (!seen.has(result.placeId)) {
        seen.add(result.placeId);
        deduplicated.push(result);
      }
    }

    // Sort: Schools first, then neighborhoods, alphabetically within each
    deduplicated.sort((a, b) => {
      // Schools before neighborhoods
      if (a.category === 'School' && b.category !== 'School') return -1;
      if (a.category !== 'School' && b.category === 'School') return 1;
      // Alphabetical within same category
      return a.name.localeCompare(b.name);
    });

    // Return top 20 results
    res.json(deduplicated.slice(0, 20));
  } catch (error) {
    console.error('Error searching for local communities:', error);
    res.status(500).json({ error: 'Failed to search for local communities' });
  }
};
