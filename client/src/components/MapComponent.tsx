
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';

// Define the ref interface that will be exposed to parent components
export interface MapComponentRef {
  flyTo: (lng: number, lat: number, zoom?: number) => void;
  getMap: () => mapboxgl.Map | null;
}

interface MapComponentProps {
  locations?: Array<{
    id: string;
    name: string;
    coordinates: { lat: number; lng: number };
    description?: string;
    type?: string;
  }>;
  height?: string;
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (locationId: string) => void;
}

const MapComponent = forwardRef<MapComponentRef, MapComponentProps>(({
  locations = [],
  height = '500px',
  center = [13.405, 52.52], // Berlin by default
  zoom = 11,
  onMarkerClick
}, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>('pk.eyJ1IjoiaXNtYWVpbC1zaGFqYXIiLCJhIjoiY202ODlsdjNtMDl6ZDJqc2RoOGl3eHp6bCJ9.cLGG1N6svL5MVckGUvqcig');

  // For development purposes, allow setting the token via input if the default one doesn't work
  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMapboxToken(e.target.value);
    localStorage.setItem('mapbox_token', e.target.value);

    // Reload map with new token if it exists
    if (e.target.value) {
      initializeMap(e.target.value);
    }
  };

  // Expose flyTo method to parent components via ref
  useImperativeHandle(ref, () => ({
    flyTo: (lng: number, lat: number, zoom = 15) => {
      if (map.current) {
        map.current.flyTo({
          center: [lng, lat],
          zoom: zoom,
          essential: true,
          duration: 2000
        });
      }
    },
    getMap: () => map.current
  }));

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;
    
    // Remove previous map instance if it exists
    if (map.current) {
      markers.current.forEach(marker => marker.remove());
      map.current.remove();
    }

    // Initialize map with token
    mapboxgl.accessToken = token;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Add markers for each location
      markers.current = locations.map(location => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.backgroundImage = 'url(https://img.icons8.com/color/48/000000/marker.png)';
        el.style.backgroundSize = 'cover';
        el.style.cursor = 'pointer';

        // Create popup - smaller size
        const popup = new mapboxgl.Popup({ 
          offset: 25,
          maxWidth: '220px' // Make popup smaller
        }).setHTML(
          `<h3 style="font-weight: bold; font-size: 14px">${location.name}</h3>
           ${location.description ? `<p style="font-size: 12px">${location.description}</p>` : ''}
           ${location.type ? `<p style="font-size: 12px"><strong>Type:</strong> ${location.type}</p>` : ''}`
        );

        // Create and add the marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat([location.coordinates.lng, location.coordinates.lat])
          .setPopup(popup)
          .addTo(map.current!);

        // Add click event
        el.addEventListener('click', () => {
          if (onMarkerClick) {
            onMarkerClick(location.id);
            // Open popup when clicking marker
            popup.addTo(map.current!);
          }
        });

        return marker;
      });
    } catch (error) {
      console.error('Error initializing Mapbox map:', error);
    }
  };

  // Initialize map on component mount
  useEffect(() => {
    // Initialize with the provided token
    if (mapboxToken) {
      initializeMap(mapboxToken);
    } else {
      // Try to get token from localStorage as fallback
      const savedToken = localStorage.getItem('mapbox_token');
      if (savedToken) {
        setMapboxToken(savedToken);
        initializeMap(savedToken);
      }
    }
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!map.current || !mapboxToken) return;

    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    if (locations.length > 0 && map.current) {
      markers.current = locations.map(location => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.backgroundImage = 'url(https://img.icons8.com/color/48/000000/marker.png)';
        el.style.backgroundSize = 'cover';
        el.style.cursor = 'pointer';

        const popup = new mapboxgl.Popup({ 
          offset: 25,
          maxWidth: '220px' // Make popup smaller
        }).setHTML(
          `<h3 style="font-weight: bold; font-size: 14px">${location.name}</h3>
           ${location.description ? `<p style="font-size: 12px">${location.description}</p>` : ''}
           ${location.type ? `<p style="font-size: 12px"><strong>Type:</strong> ${location.type}</p>` : ''}`
        );

        const marker = new mapboxgl.Marker(el)
          .setLngLat([location.coordinates.lng, location.coordinates.lat])
          .setPopup(popup)
          .addTo(map.current!);

        el.addEventListener('click', () => {
          if (onMarkerClick) {
            onMarkerClick(location.id);
            // Open popup when clicking marker
            popup.addTo(map.current!);
          }
        });

        return marker;
      });
    }
  }, [locations, mapboxToken]);

  return (
    <div className="flex flex-col w-full h-full">
      {!mapboxToken && (
        <div className="bg-yellow-100 p-4 mb-4 rounded-md">
          <p className="text-sm text-yellow-800 mb-2">
            Please enter your Mapbox public token to display the map.
            <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noreferrer" className="underline ml-1">
              Get it here
            </a>
          </p>
          <Input 
            type="text" 
            placeholder="Enter your Mapbox public token" 
            className="w-full p-2 border rounded" 
            value={mapboxToken}
            onChange={handleTokenChange}
          />
        </div>
      )}
      <div 
        ref={mapContainer} 
        style={{ height, width: '100%' }}
        className="rounded-md overflow-hidden flex-grow"
      />
    </div>
  );
});

MapComponent.displayName = 'MapComponent';

export default MapComponent;
