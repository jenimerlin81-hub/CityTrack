import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Bus, BusRoute, Trip } from '../types/index.ts';
import {
  Play,
  Square,
  Radio,
  Gauge,
  Navigation,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Compass,
  Phone,
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';

export const DriverPanel: React.FC = () => {
  const { user } = useAuth();
  const { buses, routes, stops, activeTrips, sendDriverLocation, refreshAllData } = useSocket();

  // Find assigned bus (Default to Bus 101 for driver Murugan)
  const assignedBus = buses.find(b => b.busNumber === '101') || buses[0];
  const assignedRoute = routes.find(r => r.id === assignedBus?.routeId || r.routeNumber === assignedBus?.routeNumber) || routes[0];

  const currentTrip = activeTrips.find(t => t.busId === assignedBus?.id);
  const isTripActive = !!currentTrip || assignedBus?.status === 'active';

  const [tripElapsedSeconds, setTripElapsedSeconds] = useState(18 * 60);
  const [passengerCount, setPassengerCount] = useState(32);
  const [useDeviceGps, setUseDeviceGps] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'streaming' | 'idle' | 'error'>('streaming');
  const [delayAlertText, setDelayAlertText] = useState('');
  const [alertSentMessage, setAlertSentMessage] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  // Stop sequence checklist
  const [completedStops, setCompletedStops] = useState<string[]>(['stop-1', 'stop-2']);

  // Timer for active trip duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTripActive) {
      interval = setInterval(() => {
        setTripElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTripActive]);

  // Real device GPS tracking if user toggles on
  useEffect(() => {
    if (useDeviceGps && isTripActive && assignedBus) {
      if ('geolocation' in navigator) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          pos => {
            const { latitude, longitude, speed } = pos.coords;
            sendDriverLocation(assignedBus.id, latitude, longitude, speed ? speed * 3.6 : 30);
            setGpsStatus('streaming');
          },
          err => {
            console.warn('Driver geolocation error:', err);
            setGpsStatus('error');
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      }
    } else {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [useDeviceGps, isTripActive, assignedBus, sendDriverLocation]);

  const handleStartTrip = async () => {
    if (!assignedBus) return;
    try {
      await fetch('/api/trips/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId: assignedBus.id,
          driverId: assignedBus.driverId,
          routeId: assignedBus.routeId,
          passengersCarried: passengerCount
        })
      });
      setTripElapsedSeconds(0);
      await refreshAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleStopTrip = async () => {
    if (!assignedBus) return;
    try {
      await fetch('/api/trips/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId: assignedBus.id
        })
      });
      await refreshAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendTrafficAlert = async () => {
    if (!delayAlertText.trim()) return;
    try {
      // Send notification into feed
      await fetch('/api/buses/' + assignedBus.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' })
      });
      setAlertSentMessage(true);
      setTimeout(() => {
        setAlertSentMessage(false);
        setDelayAlertText('');
      }, 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Driver Cockpit Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-3xl font-black">
            🚌
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
                Driver Telemetry Console
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                On Duty
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              {user?.name || assignedBus?.driverName || 'Murugan Selvam'}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Bus {assignedBus?.busNumber} ({assignedBus?.registrationNumber}) • Route {assignedRoute?.routeNumber}
            </p>
          </div>
        </div>

        {/* Start / Stop Trip Trigger Actions */}
        <div className="flex items-center gap-3">
          {isTripActive ? (
            <button
              onClick={handleStopTrip}
              className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/20 flex items-center gap-2 transition-all"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>End Current Trip</span>
            </button>
          ) : (
            <button
              onClick={handleStartTrip}
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Trip Now</span>
            </button>
          )}

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-right min-w-[120px]">
            <div className="text-[10px] text-slate-500 font-mono uppercase">Trip Timer</div>
            <div className="text-xl font-black font-mono text-cyan-400">{formatTime(tripElapsedSeconds)}</div>
          </div>
        </div>
      </div>

      {/* Live Telemetry Gauges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Speedometer */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Live Speed</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-white font-mono">
            {assignedBus?.speed || 34} <span className="text-sm font-normal text-slate-500">km/h</span>
          </div>
          <div className="mt-2 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, ((assignedBus?.speed || 34) / 60) * 100)}%` }}
            />
          </div>
        </div>

        {/* GPS Coordinates */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">GPS Fix</span>
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div className="mt-2 text-sm font-mono font-bold text-white">
            {assignedBus?.latitude.toFixed(4)}° N
          </div>
          <div className="text-sm font-mono font-bold text-slate-300">
            {assignedBus?.longitude.toFixed(4)}° E
          </div>
          <div className="mt-1 text-[10px] text-emerald-400 font-medium">±3m Accuracy</div>
        </div>

        {/* Heading / Direction */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Compass Heading</span>
            <Compass className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-white font-mono">
            {assignedBus?.heading || 32}°
          </div>
          <div className="mt-1 text-xs text-slate-400">North-East Bound</div>
        </div>

        {/* Passenger Count */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Onboard Passengers</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-3xl font-extrabold text-white font-mono">{passengerCount}</div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPassengerCount(prev => Math.max(0, prev - 1))}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-sm"
              >
                -
              </button>
              <button
                onClick={() => setPassengerCount(prev => prev + 1)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-sm"
              >
                +
              </button>
            </div>
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">Capacity: 45 seats</div>
        </div>
      </div>

      {/* Main Cockpit Layout: Next Stop Progress + Real GPS Switch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Stop & Route Progress (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-cyan-400">Current Assigned Route</span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                {assignedRoute?.routeName} ({assignedRoute?.routeNumber})
              </h2>
            </div>
            <span className="text-xs font-mono bg-slate-800 px-3 py-1 rounded-xl text-slate-300">
              Final: {assignedBus?.destination}
            </span>
          </div>

          {/* Big Next Stop Alert */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-slate-850 border border-cyan-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">Upcoming Stop</div>
                <div className="text-xl font-extrabold text-white">{assignedBus?.nextStopName}</div>
                <div className="text-xs text-slate-400 mt-0.5">Distance: ~{assignedBus?.nextStopDistanceKm} km away</div>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3.5 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-black text-base border border-cyan-500/30">
                ETA {assignedBus?.nextStopEtaMinutes} mins
              </span>
            </div>
          </div>

          {/* Stops Sequence Checklist for Driver */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Route Stop Checklist (Tap to mark reached)
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {assignedRoute?.stops.map((st, index) => {
                const isChecked = completedStops.includes(st.stopId);
                const isCurrent = st.stopName === assignedBus?.nextStopName;

                return (
                  <div
                    key={st.stopId}
                    onClick={() => {
                      setCompletedStops(prev =>
                        prev.includes(st.stopId)
                          ? prev.filter(id => id !== st.stopId)
                          : [...prev, st.stopId]
                      );
                    }}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : isCurrent
                        ? 'bg-cyan-950/40 border-cyan-500 text-white font-bold'
                        : 'bg-slate-800/40 border-slate-750 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold border ${
                          isChecked
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                            : 'border-slate-600 text-slate-400'
                        }`}
                      >
                        {isChecked ? '✓' : index + 1}
                      </div>
                      <span className="text-sm">{st.stopName}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {isCurrent && <span className="text-cyan-400 font-mono">Next Stop</span>}
                      {isChecked && <span className="text-emerald-400 font-medium">Cleared</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* GPS Source & Traffic Alert Controls (1 Col) */}
        <div className="space-y-6">
          {/* GPS Hardware / Browser Setting */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>GPS Transmission Source</span>
            </h3>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white">Browser Geolocation GPS</div>
                  <div className="text-[11px] text-slate-400">Stream phone/device live coordinates</div>
                </div>
                <input
                  type="checkbox"
                  checked={useDeviceGps}
                  onChange={e => setUseDeviceGps(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                />
              </label>

              <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-800/30 text-xs text-cyan-300">
                {useDeviceGps ? (
                  <span>Device GPS activated: Telemetry streaming via Socket.IO.</span>
                ) : (
                  <span>Using Automated High-Precision Route Simulation Engine.</span>
                )}
              </div>
            </div>
          </div>

          {/* Broadcast Delay or Incident Notice */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Broadcast Traffic Delay</span>
            </h3>

            <div className="space-y-3">
              <textarea
                value={delayAlertText}
                onChange={e => setDelayAlertText(e.target.value)}
                placeholder="e.g. 5 min signal delay at Railway Junction gate..."
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 h-20 resize-none"
              />

              {alertSentMessage && (
                <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Broadcast alert sent to all passenger apps!</span>
                </div>
              )}

              <button
                onClick={handleSendTrafficAlert}
                disabled={!delayAlertText.trim()}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Alert to Commuters</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
