import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from './MapView';
import { getUserLocation, getSchoolCoordinates, MINNEAPOLIS_CENTER } from '../../utils/geocoding';
import { useAuth } from '../../context/AuthContext';

interface Group {
  id: string;
  name: string;
  description: string;
  category?: string;
  location?: string;
  _count?: {
    members: number;
  };
}

interface DashboardMapProps {
  groups: Group[];
  radius: number;
}

const DashboardMap: React.FC<DashboardMapProps> = ({ groups, radius }) => {
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

  // Convert groups to map markers
  useEffect(() => {
    const markers = groups
      .map((group) => {
        // Try to get coordinates from school name or location
        const coords = getSchoolCoordinates(group.name) || getSchoolCoordinates(group.location || '');

        if (!coords) return null;

        return {
          id: group.id,
          name: group.name,
          description: group.description,
          position: coords,
          memberCount: group._count?.members || 0,
          category: group.category,
        };
      })
      .filter((marker): marker is NonNullable<typeof marker> => marker !== null);

    setMapMarkers(markers);
  }, [groups]);

  // Calculate zoom based on radius
  const getZoomLevel = () => {
    if (radius <= 5) return 14;
    if (radius <= 10) return 13;
    if (radius <= 25) return 11;
    return 10;
  };

  const handleMarkerClick = (markerId: string) => {
    navigate(`/groups/${markerId}`);
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
            <div className="w-4 h-4 bg-pink-500 rounded-full border-2 border-white"></div>
            <span className="text-gray-700 font-medium">Groups</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMap;
