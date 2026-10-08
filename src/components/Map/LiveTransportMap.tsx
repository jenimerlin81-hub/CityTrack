import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useSocket } from '../../context/SocketContext.tsx';
import { Bus, BusRoute, BusStop } from '../../types/index.ts';
import { Navigation, Locate, Eye, Route, MapPin, Radio, AlertCircle } from 'lucide-react';

interface LiveTransportMapProps {
  onSelectBus?: (bus: Bus) => void;
  className?: string;
  focusBusId?: string | null;
  focusRouteId?: string | null;
  showStopsByDefault?: boolean;
}

export const LiveTransportMap: React.FC<LiveTransportMapProps> = ({
  onSelectBus,
  className = 'h-[550px] w-full',
  focusBusId,
  focusRouteId,
  showStopsByDefault = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const busMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const stopMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const polylineLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const { buses, routes, stops, userLocation, setUserLocation, setSelectedBusId } = useSocket();

  const [showStops, setShowStops] = useState(showStopsByDefault);
  const [showRoutes, setShowRoutes] = useState(true);
  const [isLocating, setIsLocating] = useState(false);

  // Default small-city center (Trichy, Tamil Nadu)
  const defaultCenter: [number, number] = [10.8125, 78.6920];

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    // Dark sleek OpenStreetMap tiles (CartoDB Dark Matter / Stadia / OSM Dark)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    polylineLayerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Route Polylines
  useEffect(() => {
    const map = mapInstanceRef.current;
    const polyGroup = polylineLayerGroupRef.current;
    if (!map || !polyGroup) return;

    polyGroup.clearLayers();

    if (!showRoutes) return;

    routes.forEach(route => {
      if (!route.coordinates || route.coordinates.length < 2) return;

      const isSelected = focusRouteId === route.id || focusRouteId === route.routeNumber;
      const opacity = focusRouteId ? (isSelected ? 1.0 : 0.25) : 0.85;
      const weight = isSelected ? 5 : 3.5;

      const polyline = L.polyline(route.coordinates as L.LatLngExpression[], {
        color: route.color || '#3B82F6',
        weight,
        opacity,
        dashArray: isSelected ? undefined : '2, 6',
        lineCap: 'round',
        lineJoin: 'round'
      });

      polyline.bindTooltip(
        `<div class="font-bold text-xs py-0.5 px-1.5 bg-slate-900 text-white rounded">
          Route ${route.routeNumber}: ${route.routeName}
        </div>`,
        { sticky: true, className: 'leaflet-custom-tooltip' }
      );

      polyGroup.addLayer(polyline);
    });
  }, [routes, showRoutes, focusRouteId]);

  // Update Bus Stop Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing stops if toggled off
    if (!showStops) {
      stopMarkersRef.current.forEach(marker => marker.remove());
      stopMarkersRef.current.clear();
      return;
    }

    stops.forEach(stop => {
      let marker = stopMarkersRef.current.get(stop.id);

      if (!marker) {
        // Create custom stop icon
        const stopIcon = L.divIcon({
          className: 'custom-stop-icon',
          html: `
            <div class="relative group cursor-pointer">
              <div class="w-3.5 h-3.5 bg-slate-800 border-2 border-cyan-400 rounded-full shadow-md flex items-center justify-center transition-transform hover:scale-150">
                <div class="w-1 h-1 bg-cyan-300 rounded-full"></div>
              </div>
            </div>
          `,
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });

        marker = L.marker([stop.latitude, stop.longitude], { icon: stopIcon }).addTo(map);

        marker.bindPopup(`
          <div class="p-2 min-w-[180px] text-slate-900 font-sans">
            <div class="flex items-center gap-1.5 text-xs font-bold text-cyan-700 uppercase tracking-wider mb-0.5">
              <span>🚏 Bus Stop</span>
              <span class="bg-cyan-100 text-cyan-800 px-1 rounded">${stop.code}</span>
            </div>
            <div class="font-bold text-sm text-slate-900">${stop.name}</div>
            ${stop.landmark ? `<div class="text-xs text-slate-500 mt-0.5">${stop.landmark}</div>` : ''}
            <div class="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span>Zone: <b>${stop.zone || 'Central'}</b></span>
              <span class="text-cyan-600 font-medium">${stop.routes?.length || 0} Routes</span>
            </div>
          </div>
        `);

        stopMarkersRef.current.set(stop.id, marker);
      } else {
        marker.setLatLng([stop.latitude, stop.longitude]);
      }
    });

    // Cleanup stops no longer in state
    const currentStopIds = new Set(stops.map(s => s.id));
    stopMarkersRef.current.forEach((marker, id) => {
      if (!currentStopIds.has(id)) {
        marker.remove();
        stopMarkersRef.current.delete(id);
      }
    });
  }, [stops, showStops]);

  // Update Live Bus Markers with Real-Time Smooth Animation
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    buses.forEach(bus => {
      let marker = busMarkersRef.current.get(bus.id);
      const isSelected = focusBusId === bus.id || focusBusId === bus.busNumber;

      const busIconHtml = `
        <div class="relative cursor-pointer transition-transform duration-300 hover:scale-110">
          <!-- Active radar pulse -->
          ${
            bus.status === 'active'
              ? `<div class="absolute -inset-2 bg-emerald-500/20 rounded-full animate-ping pointer-events-none"></div>`
              : ''
          }
          
          <div class="flex items-center gap-1.5 px-2 py-1 bg-slate-900 text-white rounded-lg border ${
            isSelected
              ? 'border-cyan-400 ring-2 ring-cyan-400/50 shadow-cyan-500/50'
              : bus.status === 'active'
              ? 'border-emerald-500 shadow-emerald-500/30'
              : 'border-slate-700 shadow-black'
          } shadow-lg">
            <!-- Bus Glyph -->
            <div class="w-4 h-4 rounded bg-cyan-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
              🚌
            </div>

            <!-- Bus Number & Speed -->
            <div class="flex flex-col">
              <span class="text-[11px] font-black tracking-tight leading-none text-white">${bus.busNumber}</span>
              <span class="text-[8px] font-mono text-cyan-300 leading-none mt-0.5">${bus.speed} km/h</span>
            </div>

            <!-- Heading arrow -->
            <div style="transform: rotate(${bus.heading || 0}deg)" class="text-[10px] text-cyan-400 font-bold leading-none ml-0.5">
              ▲
            </div>
          </div>
        </div>
      `;

      const busIcon = L.divIcon({
        className: 'custom-bus-marker',
        html: busIconHtml,
        iconSize: [70, 32],
        iconAnchor: [35, 16]
      });

      if (!marker) {
        marker = L.marker([bus.latitude, bus.longitude], {
          icon: busIcon,
          zIndexOffset: 1000
        }).addTo(map);

        marker.on('click', () => {
          setSelectedBusId(bus.id);
          if (onSelectBus) onSelectBus(bus);
        });

        busMarkersRef.current.set(bus.id, marker);
      } else {
        marker.setLatLng([bus.latitude, bus.longitude]);
        marker.setIcon(busIcon);
      }
    });

    // Cleanup deleted buses
    const busIds = new Set(buses.map(b => b.id));
    busMarkersRef.current.forEach((marker, id) => {
      if (!busIds.has(id)) {
        marker.remove();
        busMarkersRef.current.delete(id);
      }
    });
  }, [buses, focusBusId, onSelectBus, setSelectedBusId]);

  // Center on focused bus if provided
  useEffect(() => {
    if (!focusBusId || !mapInstanceRef.current) return;
    const targetBus = buses.find(b => b.id === focusBusId || b.busNumber === focusBusId);
    if (targetBus) {
      mapInstanceRef.current.flyTo([targetBus.latitude, targetBus.longitude], 15, {
        animate: true,
        duration: 1.0
      });
    }
  }, [focusBusId, buses]);

  // Center on focused route
  useEffect(() => {
    if (!focusRouteId || !mapInstanceRef.current) return;
    const targetRoute = routes.find(r => r.id === focusRouteId || r.routeNumber === focusRouteId);
    if (targetRoute && targetRoute.coordinates && targetRoute.coordinates.length > 0) {
      const bounds = L.latLngBounds(targetRoute.coordinates as L.LatLngTuple[]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [focusRouteId, routes]);

  // User Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div class="relative">
            <div class="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
              <div class="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div class="absolute -inset-1 bg-blue-400 rounded-full opacity-40 animate-ping"></div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      if (!userMarkerRef.current) {
        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
        userMarkerRef.current.bindTooltip('Your Location', { permanent: false, direction: 'top' });
      } else {
        userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      }
    }
  }, [userLocation]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 15);
        }
      },
      _err => {
        setIsLocating(false);
        // Fallback to demo location in central city
        setUserLocation({ lat: 10.8040, lng: 78.6890 });
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([10.8040, 78.6890], 14);
        }
      },
      { timeout: 7000 }
    );
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(defaultCenter, 13);
    }
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 ${className}`}>
      {/* Map Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Controls Floating Overlay */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        <button
          onClick={handleLocateMe}
          title="Locate My Position"
          disabled={isLocating}
          className="p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 shadow-lg transition-all"
        >
          <Locate className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={handleResetView}
          title="Recenter City Center"
          className="p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 shadow-lg transition-all"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {/* Layer Visibility Toggles Overlay */}
      <div className="absolute bottom-4 left-4 z-[400] flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl shadow-lg text-xs">
        <button
          onClick={() => setShowStops(prev => !prev)}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${
            showStops ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Stops ({stops.length})</span>
        </button>

        <button
          onClick={() => setShowRoutes(prev => !prev)}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${
            showRoutes ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Route className="w-3.5 h-3.5" />
          <span>Routes ({routes.length})</span>
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1"></div>

        <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{buses.filter(b => b.status === 'active').length} live</span>
        </div>
      </div>
    </div>
  );
};
