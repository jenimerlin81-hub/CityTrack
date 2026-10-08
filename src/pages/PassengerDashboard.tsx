import React, { useState, useMemo } from 'react';
import { useSocket } from '../context/SocketContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Bus, BusStop, BusRoute } from '../types/index.ts';
import { LiveTransportMap } from '../components/Map/LiveTransportMap.tsx';
import { DemoTrackerControls } from '../components/DemoTrackerControls.tsx';
import {
  Search,
  MapPin,
  Clock,
  Compass,
  Star,
  History,
  Route as RouteIcon,
  Navigation,
  ArrowRight,
  Filter,
  CheckCircle2,
  Bell,
  Sparkles,
  Users
} from 'lucide-react';

interface PassengerDashboardProps {
  onSelectBus: (bus: Bus) => void;
  onOpenTripHistory: () => void;
  onOpenNotifications: () => void;
}

export const PassengerDashboard: React.FC<PassengerDashboardProps> = ({
  onSelectBus,
  onOpenTripHistory,
  onOpenNotifications
}) => {
  const { buses, routes, stops, userLocation, setSelectedBusId } = useSocket();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'nearby' | 'favorites'>('all');
  const [favoriteRouteIds, setFavoriteRouteIds] = useState<string[]>(['route-1', 'route-3']);
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string | null>(null);

  const toggleFavorite = (routeId: string) => {
    setFavoriteRouteIds(prev =>
      prev.includes(routeId) ? prev.filter(id => id !== routeId) : [...prev, routeId]
    );
  };

  // Calculate nearby bus stops sorted by distance from user location
  const nearbyStopsWithDistance = useMemo(() => {
    if (!userLocation) return stops.slice(0, 5);

    const userLat = userLocation.lat;
    const userLng = userLocation.lng;

    return [...stops]
      .map(stop => {
        // Haversine calculation
        const R = 6371;
        const dLat = ((stop.latitude - userLat) * Math.PI) / 180;
        const dLon = ((stop.longitude - userLng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((userLat * Math.PI) / 180) *
            Math.cos((stop.latitude * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = Number((R * c).toFixed(2));
        return { ...stop, distanceKm };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [stops, userLocation]);

  // Filtered buses based on search, route, or favorites
  const displayedBuses = useMemo(() => {
    let result = buses;

    if (selectedRouteFilter) {
      result = result.filter(b => b.routeId === selectedRouteFilter || b.routeNumber === selectedRouteFilter);
    }

    if (activeFilterTab === 'favorites') {
      result = result.filter(b => favoriteRouteIds.includes(b.routeId));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        b =>
          b.busNumber.toLowerCase().includes(q) ||
          b.destination.toLowerCase().includes(q) ||
          (b.routeName && b.routeName.toLowerCase().includes(q)) ||
          (b.nextStopName && b.nextStopName.toLowerCase().includes(q))
      );
    }

    return result;
  }, [buses, selectedRouteFilter, activeFilterTab, favoriteRouteIds, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Commuter Welcome Banner & Search Destination */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Passenger Commuter Hub</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Where do you want to go, {user?.name?.split(' ')[0] || 'Commuter'}?
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Real-time GPS tracking for Tiruchirappalli city buses with arrival forecasts.
          </p>

          {/* Large Search Input */}
          <div className="mt-5 relative">
            <div className="flex items-center gap-3 bg-slate-950/90 border border-slate-700/80 rounded-2xl p-2 px-4 shadow-xl focus-within:border-cyan-400 transition-all">
              <Search className="w-5 h-5 text-cyan-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search bus line (e.g. 101, 204), stop name, or final destination..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Decorative corner element */}
        <div className="absolute right-4 bottom-4 opacity-15 pointer-events-none hidden sm:block text-8xl font-black text-cyan-500">
          101
        </div>
      </div>

      {/* Quick Action Navigation Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveFilterTab('all')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeFilterTab === 'all' && !selectedRouteFilter
              ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2">
            <Navigation className="w-4 h-4" />
          </div>
          <div className="font-bold text-sm text-white">Track All Buses</div>
          <div className="text-xs text-slate-400 mt-0.5">{buses.length} active fleet</div>
        </button>

        <button
          onClick={() => setActiveFilterTab('nearby')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeFilterTab === 'nearby'
              ? 'bg-blue-500/10 border-blue-500 text-blue-300 shadow-lg shadow-blue-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="font-bold text-sm text-white">Nearby Stops</div>
          <div className="text-xs text-slate-400 mt-0.5">{stops.length} locations</div>
        </button>

        <button
          onClick={() => setActiveFilterTab('favorites')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeFilterTab === 'favorites'
              ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
            <Star className="w-4 h-4" />
          </div>
          <div className="font-bold text-sm text-white">My Routes</div>
          <div className="text-xs text-slate-400 mt-0.5">{favoriteRouteIds.length} saved lines</div>
        </button>

        <button
          onClick={onOpenTripHistory}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700 text-left transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2">
            <History className="w-4 h-4" />
          </div>
          <div className="font-bold text-sm text-white">Trip History</div>
          <div className="text-xs text-slate-400 mt-0.5">Past tickets & routes</div>
        </button>
      </div>

      {/* Demo Controls Bar */}
      <DemoTrackerControls />

      {/* Main Grid: Live Map + Live Telemetry Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Map */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h2 className="text-lg font-bold text-white">Live City Transit Map</h2>
            </div>
            <span className="text-xs text-slate-400">Click any bus or stop pin for info</span>
          </div>

          <LiveTransportMap
            className="h-[520px] w-full"
            onSelectBus={bus => onSelectBus(bus)}
            focusRouteId={selectedRouteFilter}
          />

          {/* Quick Route Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Filter Route:</span>
            <button
              onClick={() => setSelectedRouteFilter(null)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                !selectedRouteFilter
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Routes
            </button>
            {routes.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRouteFilter(selectedRouteFilter === r.id ? null : r.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedRouteFilter === r.id
                    ? 'bg-slate-100 text-slate-950 font-black'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                <span>Line {r.routeNumber}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Live Buses Feed & Nearby Stops */}
        <div className="space-y-6">
          {/* Active Buses Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Active Buses ({displayedBuses.length})</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400">Live GPS</span>
            </div>

            <div className="mt-3 space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {displayedBuses.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No active buses matching filter criteria.
                </div>
              ) : (
                displayedBuses.map(bus => (
                  <div
                    key={bus.id}
                    onClick={() => {
                      setSelectedBusId(bus.id);
                      onSelectBus(bus);
                    }}
                    className="p-3.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 font-black text-xs flex items-center justify-center">
                          {bus.busNumber}
                        </span>
                        <div>
                          <div className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                            Line {bus.routeNumber || bus.busNumber}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                            To {bus.destination}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-emerald-400">
                          ~{bus.nextStopEtaMinutes} min
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{bus.speed} km/h</div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[11px] text-slate-300">
                      <div className="flex items-center gap-1 truncate max-w-[180px]">
                        <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate">Next: <b>{bus.nextStopName}</b></span>
                      </div>
                      <span className="text-cyan-400 text-[10px] font-semibold flex items-center gap-0.5">
                        Details <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Nearby Stops Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Nearby Stops</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Distance</span>
            </div>

            <div className="mt-3 space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {nearbyStopsWithDistance.slice(0, 4).map(stop => (
                <div
                  key={stop.id}
                  className="p-3 rounded-2xl bg-slate-850/60 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-white">{stop.name}</div>
                    <div className="text-[10px] text-slate-400">{stop.landmark || 'City Junction'}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {'distanceKm' in stop ? `${(stop as any).distanceKm} km` : 'Near'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
