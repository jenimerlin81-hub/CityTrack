import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Bus, BusRoute, BusStop, Driver } from '../types/index.ts';
import { LiveTransportMap } from '../components/Map/LiveTransportMap.tsx';
import {
  LayoutDashboard,
  Bus as BusIcon,
  Route as RouteIcon,
  Users,
  MapPin,
  Activity,
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  CheckCircle2,
  X,
  Radio,
  Search
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { buses, routes, stops, drivers, activeTrips, refreshAllData, setSelectedBusId } = useSocket();

  const [activeTab, setActiveTab] = useState<'overview' | 'buses' | 'routes' | 'drivers' | 'stops' | 'trips'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals for CRUD operations
  const [showAddBusModal, setShowAddBusModal] = useState(false);
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showAddStopModal, setShowAddStopModal] = useState(false);

  // New Bus form state
  const [newBus, setNewBus] = useState({
    busNumber: '501',
    registrationNumber: 'TN-45-ZZ-9999',
    routeId: 'route-1',
    driverId: '',
    status: 'active' as const
  });

  // New Route form state
  const [newRoute, setNewRoute] = useState({
    routeNumber: '500',
    routeName: 'Suburban Express: Junction ⇄ Samayapuram',
    startPoint: 'Railway Junction',
    endPoint: 'Samayapuram',
    fare: 20
  });

  // New Driver form state
  const [newDriver, setNewDriver] = useState({
    name: 'G. Mohanraj',
    phone: '+91 94436 66006',
    licenseNumber: 'TN-45-20190001234',
    assignedBusId: ''
  });

  // New Stop form state
  const [newStop, setNewStop] = useState({
    name: 'Cauvery Hospital Cross',
    code: 'CVH-21',
    latitude: 10.8140,
    longitude: 78.6850,
    zone: 'Central'
  });

  // Action handlers
  const handleCreateBus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/buses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBus)
      });
      setShowAddBusModal(false);
      await refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBus = async (busId: string) => {
    if (!confirm('Are you sure you want to decommission this bus?')) return;
    try {
      await fetch(`/api/buses/${busId}`, { method: 'DELETE' });
      await refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newRoute,
          stops: [
            { stopId: 'stop-1', stopName: newRoute.startPoint, sequenceOrder: 1, distanceFromStartKm: 0, estimatedMinutesFromStart: 0 },
            { stopId: 'stop-6', stopName: 'Chathiram Bus Stand', sequenceOrder: 2, distanceFromStartKm: 5, estimatedMinutesFromStart: 15 },
            { stopId: 'stop-20', stopName: newRoute.endPoint, sequenceOrder: 3, distanceFromStartKm: 12, estimatedMinutesFromStart: 32 }
          ],
          coordinates: [
            [10.7915, 78.6848],
            [10.8340, 78.6945],
            [10.9080, 78.7280]
          ]
        })
      });
      setShowAddRouteModal(false);
      await refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    if (!confirm('Delete this transit line route?')) return;
    try {
      await fetch(`/api/routes/${routeId}`, { method: 'DELETE' });
      await refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDriver)
      });
      setShowAddDriverModal(false);
      await refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDriver = async (driverId: string) => {
    if (!confirm('Remove this driver from roster?')) return;
    try {
      await fetch(`/api/drivers/${driverId}`, { method: 'DELETE' });
      await refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateStop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/stops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStop)
      });
      setShowAddStopModal(false);
      await refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Stats calculation
  const totalBuses = buses.length;
  const activeBuses = buses.filter(b => b.status === 'active').length;
  const totalDrivers = drivers.length;
  const totalRoutes = routes.length;
  const totalStops = stops.length;
  const activeTripsCount = activeTrips.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
              Fleet Authority Portal
            </span>
            <span className="text-xs text-slate-400 font-mono">City Code: TN-45 (TRZ)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Central Transport Management Console
          </h1>
          <p className="text-xs text-slate-400">
            Supervisor: {user?.name || 'Divya Sundaram (Chief Controller)'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddBusModal(true)}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Bus</span>
          </button>
          <button
            onClick={() => setShowAddRouteModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Route</span>
          </button>
        </div>
      </div>

      {/* 6 Key Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Total Buses</div>
          <div className="mt-1 text-2xl font-black font-mono text-white">{totalBuses}</div>
          <div className="text-[10px] text-slate-500 mt-1">Registered fleet</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Active Fleet</div>
          <div className="mt-1 text-2xl font-black font-mono text-emerald-400">{activeBuses}</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>GPS Tracking</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Total Drivers</div>
          <div className="mt-1 text-2xl font-black font-mono text-white">{totalDrivers}</div>
          <div className="text-[10px] text-slate-500 mt-1">Licensed staff</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Active Routes</div>
          <div className="mt-1 text-2xl font-black font-mono text-white">{totalRoutes}</div>
          <div className="text-[10px] text-cyan-400 mt-1">City corridors</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Bus Stops</div>
          <div className="mt-1 text-2xl font-black font-mono text-white">{totalStops}</div>
          <div className="text-[10px] text-slate-500 mt-1">Geofenced stops</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Active Trips</div>
          <div className="mt-1 text-2xl font-black font-mono text-cyan-400">{activeTripsCount}</div>
          <div className="text-[10px] text-slate-500 mt-1">In transit now</div>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-2xl overflow-x-auto">
        {[
          { id: 'overview', label: 'Live Fleet Radar', icon: Activity },
          { id: 'buses', label: `Buses (${buses.length})`, icon: BusIcon },
          { id: 'routes', label: `Routes (${routes.length})`, icon: RouteIcon },
          { id: 'drivers', label: `Drivers (${drivers.length})`, icon: Users },
          { id: 'stops', label: `Stops (${stops.length})`, icon: MapPin },
          { id: 'trips', label: `Trip Logs (${activeTrips.length})`, icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW LIVE RADAR MAP */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Real-Time Fleet Positioning Center</span>
            </h2>
            <span className="text-xs text-slate-400">Auto-syncing every 2.5s via WebSockets</span>
          </div>
          <LiveTransportMap className="h-[550px] w-full" />
        </div>
      )}

      {/* TAB 2: BUSES FLEET MANAGEMENT */}
      {activeTab === 'buses' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white">Fleet Inventory & Status</h2>
            <button
              onClick={() => setShowAddBusModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Bus</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3 rounded-l-xl">Bus Number</th>
                  <th className="p-3">Registration</th>
                  <th className="p-3">Route</th>
                  <th className="p-3">Driver</th>
                  <th className="p-3">Speed</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {buses.map(bus => (
                  <tr key={bus.id} className="hover:bg-slate-850 transition-colors">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono">
                        {bus.busNumber}
                      </span>
                      <span>Bus {bus.busNumber}</span>
                    </td>
                    <td className="p-3 font-mono text-cyan-400">{bus.registrationNumber}</td>
                    <td className="p-3">{bus.routeName || `Route ${bus.routeNumber}`}</td>
                    <td className="p-3">{bus.driverName || 'Unassigned'}</td>
                    <td className="p-3 font-mono font-bold text-white">{bus.speed} km/h</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          bus.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {bus.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteBus(bus.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Decommission Bus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ROUTES MANAGEMENT */}
      {activeTab === 'routes' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white">Transit Lines & Routes</h2>
            <button
              onClick={() => setShowAddRouteModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Route</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routes.map(route => (
              <div key={route.id} className="p-4 rounded-2xl bg-slate-850/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs text-white"
                      style={{ backgroundColor: route.color || '#3B82F6' }}
                    >
                      {route.routeNumber}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-white">{route.routeName}</h3>
                      <p className="text-xs text-slate-400">{route.startPoint} ⇄ {route.endPoint}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteRoute(route.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <div>
                    <span>Stops: </span>
                    <b className="text-white">{route.stops.length}</b>
                  </div>
                  <div>
                    <span>Distance: </span>
                    <b className="text-white">{route.totalDistanceKm} km</b>
                  </div>
                  <div>
                    <span>Fare: </span>
                    <b className="text-white">₹{route.fare}</b>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DRIVERS MANAGEMENT */}
      {activeTab === 'drivers' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white">Driver Roster</h2>
            <button
              onClick={() => setShowAddDriverModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Driver</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drivers.map(driver => (
              <div key={driver.id} className="p-4 rounded-2xl bg-slate-850/60 border border-slate-800 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white">{driver.name}</h3>
                    <p className="text-xs font-mono text-cyan-400">{driver.phone}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    ★ {driver.rating}
                  </span>
                </div>

                <div className="text-xs text-slate-400">
                  License: <span className="font-mono text-slate-300">{driver.licenseNumber}</span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Bus: <b>{driver.assignedBusNumber ? `Bus ${driver.assignedBusNumber}` : 'Unassigned'}</b>
                  </span>
                  <button
                    onClick={() => handleDeleteDriver(driver.id)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: BUS STOPS MANAGEMENT */}
      {activeTab === 'stops' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white">Geofenced Bus Stops ({stops.length})</h2>
            <button
              onClick={() => setShowAddStopModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Bus Stop</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {stops.map(st => (
              <div key={st.id} className="p-3.5 rounded-2xl bg-slate-850/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{st.name}</span>
                  <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-cyan-400">{st.code}</span>
                </div>
                <div className="text-[11px] text-slate-400">{st.landmark || 'Zone: ' + (st.zone || 'Central')}</div>
                <div className="text-[10px] font-mono text-slate-500 pt-1">
                  {st.latitude.toFixed(4)}, {st.longitude.toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: TRIPS LOGS */}
      {activeTab === 'trips' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white">Active Transit Operations & Trips</h2>
          <div className="space-y-3">
            {activeTrips.map(tr => (
              <div key={tr.id} className="p-4 rounded-2xl bg-slate-850/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">Bus {tr.busNumber}</span>
                    <span className="text-xs text-slate-400 font-mono">Trip #{tr.id}</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">{tr.routeName}</div>
                  <div className="text-[11px] text-slate-400">Driver: {tr.driverName}</div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    In Progress
                  </span>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Started: {new Date(tr.startTime).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD BUS */}
      {showAddBusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Add Bus to Fleet</h3>
              <button onClick={() => setShowAddBusModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBus} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Bus Line Number</label>
                <input
                  type="text"
                  value={newBus.busNumber}
                  onChange={e => setNewBus({ ...newBus, busNumber: e.target.value })}
                  placeholder="e.g. 501"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Registration Plate (TN RTO)</label>
                <input
                  type="text"
                  value={newBus.registrationNumber}
                  onChange={e => setNewBus({ ...newBus, registrationNumber: e.target.value })}
                  placeholder="e.g. TN-45-ZZ-9999"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Assign Route</label>
                <select
                  value={newBus.routeId}
                  onChange={e => setNewBus({ ...newBus, routeId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  {routes.map(r => (
                    <option key={r.id} value={r.id}>
                      Line {r.routeNumber} - {r.routeName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBusModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 font-bold text-slate-950"
                >
                  Save & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD ROUTE */}
      {showAddRouteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Create New Route</h3>
              <button onClick={() => setShowAddRouteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoute} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Route Line Number</label>
                <input
                  type="text"
                  value={newRoute.routeNumber}
                  onChange={e => setNewRoute({ ...newRoute, routeNumber: e.target.value })}
                  placeholder="e.g. 500"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Route Full Name</label>
                <input
                  type="text"
                  value={newRoute.routeName}
                  onChange={e => setNewRoute({ ...newRoute, routeName: e.target.value })}
                  placeholder="e.g. Sub-urban Loop Express"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Starting Point</label>
                  <input
                    type="text"
                    value={newRoute.startPoint}
                    onChange={e => setNewRoute({ ...newRoute, startPoint: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Destination Point</label>
                  <input
                    type="text"
                    value={newRoute.endPoint}
                    onChange={e => setNewRoute({ ...newRoute, endPoint: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRouteModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 font-bold text-slate-950"
                >
                  Create Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD DRIVER */}
      {showAddDriverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Register Driver</h3>
              <button onClick={() => setShowAddDriverModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDriver} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={newDriver.name}
                  onChange={e => setNewDriver({ ...newDriver, name: e.target.value })}
                  placeholder="e.g. G. Mohanraj"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newDriver.phone}
                  onChange={e => setNewDriver({ ...newDriver, phone: e.target.value })}
                  placeholder="+91 94436 66006"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Commercial Driver License</label>
                <input
                  type="text"
                  value={newDriver.licenseNumber}
                  onChange={e => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDriverModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 font-bold text-slate-950"
                >
                  Save Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD STOP */}
      {showAddStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Add Geofenced Bus Stop</h3>
              <button onClick={() => setShowAddStopModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStop} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Stop Name</label>
                <input
                  type="text"
                  value={newStop.name}
                  onChange={e => setNewStop({ ...newStop, name: e.target.value })}
                  placeholder="e.g. Cauvery Hospital Cross"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newStop.latitude}
                    onChange={e => setNewStop({ ...newStop, latitude: parseFloat(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newStop.longitude}
                    onChange={e => setNewStop({ ...newStop, longitude: parseFloat(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStopModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 font-bold text-slate-950"
                >
                  Create Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
