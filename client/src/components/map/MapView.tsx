import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useGoogleMaps } from '../../context/GoogleMapsContext';

interface MapMarker {
  id: string;
  name: string;
  description: string;
  position: {
    lat: number;
    lng: number;
  };
  memberCount?: number;
  category?: string;
  iconUrl?: string;
}

interface MapViewProps {
  center: { lat: number; lng: number };
  markers: MapMarker[];
  zoom?: number;
  onMarkerClick?: (markerId: string) => void;
  height?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const MapView: React.FC<MapViewProps> = ({
  center,
  markers,
  zoom = 13,
  onMarkerClick,
  height = '400px',
}) => {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  const { isLoaded, loadError } = useGoogleMaps();

  const onLoad = useCallback(() => {
    // Map loaded successfully
  }, []);

  const onUnmount = useCallback(() => {
    // Map unmounted
  }, []);

  if (loadError) {
    return (
      <div
        className="flex items-center justify-center bg-red-50 border border-red-200 rounded-2xl"
        style={{ height }}
      >
        <div className="text-center p-8">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-red-700 font-semibold">Error loading map</p>
          <p className="text-red-600 text-sm mt-1">Please check your API key</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className="flex items-center justify-center bg-gray-50 rounded-2xl"
        style={{ height }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 font-medium">Loading map...</p>
        </div>
      </div>
    );
  }

  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
    ],
  };

  return (
    <div style={{ height }} className="rounded-2xl overflow-hidden shadow-lg">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* User location marker */}
        <Marker
          position={center}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: '#9333ea',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          }}
          title="You are here"
        />

        {/* Community markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            onClick={() => {
              setSelectedMarker(marker);
              if (onMarkerClick) {
                onMarkerClick(marker.id);
              }
            }}
            icon={marker.iconUrl ? {
              url: marker.iconUrl,
              scaledSize: new google.maps.Size(40, 40),
            } : {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#dc2626" stroke="white" stroke-width="3"/>
                  <text x="20" y="27" font-size="20" text-anchor="middle" fill="white">👥</text>
                </svg>
              `),
              scaledSize: new google.maps.Size(40, 40),
            }}
          />
        ))}

        {/* Info window for selected marker */}
        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-bold text-gray-900 mb-1">{selectedMarker.name}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {selectedMarker.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>👥 {selectedMarker.memberCount || 0} members</span>
                {selectedMarker.category && (
                  <>
                    <span>•</span>
                    <span>{selectedMarker.category}</span>
                  </>
                )}
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapView;
