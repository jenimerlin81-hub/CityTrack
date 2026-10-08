import React from 'react';
import { Bus, BusRoute } from '../types/index.ts';
import { useSocket } from '../context/SocketContext.tsx';
import {
  X,
  Navigation,
  Clock,
  Gauge,
  User,
  Phone,
  Compass,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Share2,
  Users
} from 'lucide-react';

interface BusDetailsModalProps {
  bus: Bus | null;
  onClose: () => void;
  onFocusOnMap?: (bus: Bus) => void;
}

export const BusDetailsModal: React.FC<BusDetailsModalProps> = ({ bus, onClose, onFocusOnMap }) => {
  const { routes, stops } = useSocket();

  if (!bus) return null;

  const route = routes.find(r => r.id === bus.routeId || r.routeNumber === bus.routeNumber);

  // Compute stop timeline
  const routeStops = route?.stops || [];
  const currentIndex = bus.currentStopIndex || 0;

  const occupancyConfig = {
    low: { label: 'Low Crowding (< 30%)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    medium: { label: 'Medium Crowding (50%)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    high: { label: 'Crowded (85%)', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
    full: { label: 'Full Capacity', color: 'text-red-500 bg-red-500/20 border-red-500/40' }
  }[bus.occupancy || 'medium'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-slate-100 p-6 md:p-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/20">
              🚌
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight text-white">Bus {bus.busNumber}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {bus.registrationNumber}
                </span>
              </div>
              <p className="text-sm text-slate-400 font-medium mt-0.5">
                Route {bus.routeNumber || route?.routeNumber}: {bus.routeName || route?.routeName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Key Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          {/* Speed */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>Current Speed</span>
            </div>
            <div className="mt-1 text-xl font-bold font-mono text-white">
              {bus.speed} <span className="text-xs font-normal text-slate-400">km/h</span>
            </div>
          </div>

          {/* Next ETA */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Next Stop ETA</span>
            </div>
            <div className="mt-1 text-xl font-bold font-mono text-emerald-400">
              ~{bus.nextStopEtaMinutes} <span className="text-xs font-normal text-slate-400">min</span>
            </div>
          </div>

          {/* Distance */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Navigation className="w-3.5 h-3.5 text-blue-400" />
              <span>Distance</span>
            </div>
            <div className="mt-1 text-xl font-bold font-mono text-white">
              {bus.nextStopDistanceKm} <span className="text-xs font-normal text-slate-400">km</span>
            </div>
          </div>

          {/* Status */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              <span>Heading</span>
            </div>
            <div className="mt-1 text-xl font-bold font-mono text-white">
              {bus.heading}° <span className="text-xs font-normal text-slate-400">NE</span>
            </div>
          </div>
        </div>

        {/* Next Stop Spotlight Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/70 to-slate-900 border border-cyan-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Next Approaching Stop</div>
              <div className="text-lg font-bold text-white">{bus.nextStopName}</div>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-bold text-sm">
              in {bus.nextStopEtaMinutes} mins
            </span>
          </div>
        </div>

        {/* Driver & Occupancy Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-700 text-slate-300 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs text-slate-400">Assigned Driver</div>
              <div className="text-sm font-semibold text-white truncate">{bus.driverName || 'Murugan Selvam'}</div>
              {bus.driverPhone && (
                <div className="text-xs text-cyan-400 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" />
                  <span>{bus.driverPhone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-700 text-slate-300 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Current Occupancy</div>
              <span className={`inline-block px-2.5 py-0.5 mt-0.5 rounded-lg text-xs font-semibold border ${occupancyConfig.color}`}>
                {occupancyConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Route Stops Sequence Timeline */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Route Stop Sequence ({routeStops.length} stops)
            </h3>
            <span className="text-xs text-cyan-400 font-medium">Final: {bus.destination}</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {routeStops.map((s, idx) => {
              const isPast = idx < currentIndex;
              const isNext = s.stopName === bus.nextStopName || idx === currentIndex;
              const isFuture = idx > currentIndex && s.stopName !== bus.nextStopName;

              return (
                <div
                  key={s.stopId}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-sm transition-all ${
                    isNext
                      ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200'
                      : isPast
                      ? 'bg-slate-900/40 border-slate-800 text-slate-500'
                      : 'bg-slate-850 border-slate-750 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : isNext ? (
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                      </span>
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                    )}
                    <span className={`font-medium ${isNext ? 'font-bold text-white' : ''}`}>{s.stopName}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {isNext && (
                      <span className="font-mono text-cyan-400 font-bold">~{bus.nextStopEtaMinutes} min</span>
                    )}
                    {isFuture && (
                      <span className="text-slate-500">+{idx * 3 + 2} min</span>
                    )}
                    {isPast && <span className="text-slate-600">Passed</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-mono">
            Updated: {new Date(bus.lastUpdated).toLocaleTimeString()}
          </div>

          <div className="flex items-center gap-2">
            {onFocusOnMap && (
              <button
                onClick={() => {
                  onFocusOnMap(bus);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-500/20"
              >
                <Navigation className="w-4 h-4" />
                <span>Track on Map</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
