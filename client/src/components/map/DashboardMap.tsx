import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from './MapView';
import { getUserLocation, getSchoolCoordinates, calculateDistance, MINNEAPOLIS_CENTER } from '../../utils/geocoding';
import { useAuth } from '../../context/AuthContext';

interface CommunityMapItem {
  id: string;
  name: string;
  description: string;
  category?: string | null;
  location?: string;
  _count?: {
    members: number;
  };
}

interface DashboardMapProps {
  communities: CommunityMapItem[];
  radius: number;
}

// SVG marker icons as data URIs
const schoolIconUrl = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
  <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="#dc2626" stroke="white" stroke-width="3"/>
    <path d="M20 11 L12 16 L12 26 L28 26 L28 16 Z" fill="none" stroke="white" stroke-width="1.8" stroke-linejoin="round"/>
    <rect x="18" y="22" width="4" height="4" fill="white" rx="0.5"/>
    <polygon points="20,8 10,14 20,14 30,14" fill="white"/>
  </svg>
`);

const neighborhoodIconUrl = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
  <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="#f87171" stroke="white" stroke-width="3"/>
    <path d="M20 12 L12 18 L12 28 L28 28 L28 18 Z" fill="none" stroke="white" stroke-width="1.8" stroke-linejoin="round"/>
    <rect x="16" y="21" width="3" height="3" fill="white" rx="0.5"/>
    <rect x="21" y="21" width="3" height="3" fill="white" rx="0.5"/>
  </svg>
`);

const DashboardMap: React.FC<DashboardMapProps> = ({ communities, radius }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mapCenter, setMapCenter] = useState(MINNEAPOLIS_CENTER);
  const [mapMarkers, setMapMarkers] = useState<any[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Get user's location
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        // Use structured address fields
        const coords = await getUserLocation(
          user?.zipCode,
          user?.street,
          user?.city,
          user?.state
        );
        setMapCenter(coords);
      } catch (error) {
        console.error('Error getting user location:', error);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    fetchUserLocation();
  }, [user?.zipCode, user?.street, user?.city, user?.state]);

  // Convert communities to map markers, filtering by distance from user
  useEffect(() => {
    const markers = communities
      .map((community) => {
        const coords = getSchoolCoordinates(community.name) || getSchoolCoordinates(community.location || '');
        if (!coords) return null;

        const distance = calculateDistance(mapCenter.lat, mapCenter.lng, coords.lat, coords.lng);
        if (distance > radius) return null;

        return {
          id: community.id,
          name: community.name,
          description: community.description,
          position: coords,
          memberCount: community._count?.members || 0,
          category: community.category,
          iconUrl: community.category === 'School' ? schoolIconUrl : neighborhoodIconUrl,
        };
      })
      .filter((marker): marker is NonNullable<typeof marker> => marker !== null);

    setMapMarkers(markers);
  }, [communities, mapCenter, radius]);

  // Calculate zoom based on radius
  const getZoomLevel = () => {
    if (radius <= 5) return 14;
    if (radius <= 10) return 13;
    if (radius <= 25) return 11;
    return 10;
  };

  const handleMarkerClick = (markerId: string) => {
    navigate(`/communities/${markerId}`);
  };

  if (isLoadingLocation) {
    return (
      <div className="h-96 bg-gray-50 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 font-medium">Loading your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <MapView
        center={mapCenter}
        markers={mapMarkers}
        zoom={getZoomLevel()}
        onMarkerClick={handleMarkerClick}
        height="384px"
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-600 rounded-full border-2 border-white"></div>
            <span className="text-gray-700 font-medium">You</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white"></div>
            <span className="text-gray-700 font-medium">School</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded-full border-2 border-white"></div>
            <span className="text-gray-700 font-medium">Neighborhood</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMap;
