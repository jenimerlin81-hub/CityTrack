import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext.tsx';
import { Bus, BusRoute } from '../types/index.ts';
import {
  Navigation,
  Search,
  Radio,
  Clock,
  ShieldCheck,
  Smartphone,
  Gauge,
  ArrowRight,
  Compass,
  CheckCircle2,
  Bus as BusIcon,
  Zap,
  MapPin
} from 'lucide-react';

interface LandingPageProps {
  onExploreMap: () => void;
  onGoPassenger: () => void;
  onGoDriver: () => void;
  onGoAdmin: () => void;
  onOpenAuth: () => void;
  onSelectBus: (bus: Bus) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExploreMap,
  onGoPassenger,
  onGoDriver,
  onGoAdmin,
  onOpenAuth,
  onSelectBus
}) => {
  const { buses, routes, stops } = useSocket();
  const [searchQuery, setSearchQuery] = useState('');

  const activeBuses = buses.filter(b => b.status === 'active');

  const filteredBuses = buses.filter(
    b =>
      b.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.routeName && b.routeName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="relative min-h-screen text-slate-100 overflow-x-hidden">
      {/* Background Decorative Mesh & Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-12 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Next-Gen Smart Transit for Small Cities</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Your City. Your Bus.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Real-Time.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
            Eliminate commuter uncertainty. CityTrack delivers live GPS telemetry, second-by-second bus tracking,
            and precise estimated arrival times designed specifically for small-city public transport networks.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExploreMap}
              className="px-7 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-cyan-500/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <Navigation className="w-4 h-4 fill-current" />
              <span>Track a Bus Live</span>
            </button>

            <button
              onClick={onGoPassenger}
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700/80 shadow-lg flex items-center gap-2 transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>

            <button
              onClick={onOpenAuth}
              className="px-6 py-3.5 rounded-2xl bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold text-sm border border-slate-800 transition-all"
            >
              Sign In
            </button>
          </div>

          {/* Quick Search Bar */}
          <div className="mt-10 w-full max-w-xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-2 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-3 px-3">
              <Search className="w-5 h-5 text-cyan-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Where do you want to go? Search bus (101), stop, or destination..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none py-2"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick search dropdown preview if typing */}
            {searchQuery && (
              <div className="mt-2 pt-2 border-t border-slate-800 max-h-48 overflow-y-auto text-left">
                {filteredBuses.length === 0 ? (
                  <div className="p-3 text-xs text-slate-400 text-center">No matching buses found</div>
                ) : (
                  filteredBuses.map(b => (
                    <div
                      key={b.id}
                      onClick={() => {
                        onSelectBus(b);
                        onExploreMap();
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 font-black text-xs flex items-center justify-center">
                          {b.busNumber}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white">{b.routeName}</div>
                          <div className="text-[11px] text-slate-400">To {b.destination}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-emerald-400">ETA ~{b.nextStopEtaMinutes}m</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Live System Stats Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Active Fleet</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <div className="mt-2 text-3xl font-extrabold text-white font-mono">{activeBuses.length} Buses</div>
            <div className="mt-1 text-xs text-emerald-400 font-medium flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>Real-time GPS online</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Smart Stops</span>
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-white font-mono">{stops.length} Stops</div>
            <div className="mt-1 text-xs text-slate-400">Geofenced city junctions</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Transit Lines</span>
              <Compass className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-white font-mono">{routes.length} Routes</div>
            <div className="mt-1 text-xs text-slate-400">Arterial small-city links</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Wait Time Reduced</span>
              <Clock className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-white font-mono">68%</div>
            <div className="mt-1 text-xs text-cyan-400">Live ETA confidence</div>
          </div>
        </div>
      </section>

      {/* Live Fleet Preview Section */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-850">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-cyan-400 font-bold">Live Telemetry</div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Buses Currently on Duty</h2>
          </div>
          <button
            onClick={onExploreMap}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View Full Interactive Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buses.slice(0, 3).map(bus => (
            <div
              key={bus.id}
              onClick={() => onSelectBus(bus)}
              className="group p-5 rounded-3xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 shadow-xl transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 group-hover:bg-cyan-500 group-hover:text-slate-950 text-cyan-400 flex items-center justify-center font-black text-lg transition-colors">
                    {bus.busNumber}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base group-hover:text-cyan-300 transition-colors">
                      Bus {bus.busNumber}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">{bus.registrationNumber}</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {bus.speed} km/h
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Route:</span>
                  <span className="font-medium text-slate-200 truncate max-w-[200px]">{bus.routeName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Next Stop:</span>
                  <span className="font-bold text-cyan-400">{bus.nextStopName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Arrival ETA:</span>
                  <span className="font-mono font-bold text-emerald-400">~{bus.nextStopEtaMinutes} minutes</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs text-slate-400">
                <span>Driver: {bus.driverName?.split(' ')[0]}</span>
                <span className="text-cyan-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Track Bus <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Roles Features Section */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-850">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-widest text-cyan-400 font-bold">Multi-Role Architecture</div>
          <h2 className="text-3xl font-black text-white mt-1">Built for the Entire Transport Ecosystem</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Passenger App Card */}
          <div
            onClick={onGoPassenger}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 shadow-xl cursor-pointer group transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
              1. Passenger App
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Mobile-optimized dashboard with nearby bus stops, live tracking map, search destination, ETA predictions,
              and notifications.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center text-xs font-bold text-cyan-400 gap-1">
              <span>Launch Passenger App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Driver Panel Card */}
          <div
            onClick={onGoDriver}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 shadow-xl cursor-pointer group transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
              <Gauge className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white group-hover:text-blue-300 transition-colors">
              2. Driver Console
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Assigned bus cockpit with Start/Stop Trip controls, device GPS broadcasting, live stop sequence checklists,
              and speed telemetry.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center text-xs font-bold text-blue-400 gap-1">
              <span>Open Driver Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Admin Dashboard Card */}
          <div
            onClick={onGoAdmin}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 shadow-xl cursor-pointer group transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white group-hover:text-purple-300 transition-colors">
              3. Admin Control
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Full transit management portal for adding buses, creating custom routes with stop sequences, managing drivers,
              and monitoring active trips.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center text-xs font-bold text-purple-400 gap-1">
              <span>Open Admin Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
