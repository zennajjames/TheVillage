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

const COMMUNITY_SEARCH_QUERIES = [
  { query: 'community center near', category: 'Community Center' },
  { query: 'neighborhood association near', category: 'Neighborhood Association' },
  { query: 'community organization near', category: 'Community Organization' },
  { query: 'parent group near', category: 'Parent Group' },
  { query: 'youth center near', category: 'Youth Center' },
  { query: 'recreation center near', category: 'Recreation Center' },
];

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
    const searchPromises = COMMUNITY_SEARCH_QUERIES.map(async ({ query, category }) => {
      try {
        const response = await axios.get(
          'https://maps.googleapis.com/maps/api/place/textsearch/json',
          {
            params: {
              query: `${query} ${zipCode}`,
              key: apiKey,
            },
          }
        );

        if (response.data.status === 'OK') {
          return response.data.results.map((place: any) => ({
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

    // Sort by rating (highest first), then by number of ratings
    deduplicated.sort((a, b) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      if (ratingB !== ratingA) return ratingB - ratingA;
      return (b.userRatingsTotal || 0) - (a.userRatingsTotal || 0);
    });

    // Return top 20 results
    res.json(deduplicated.slice(0, 20));
  } catch (error) {
    console.error('Error searching for local communities:', error);
    res.status(500).json({ error: 'Failed to search for local communities' });
  }
};
