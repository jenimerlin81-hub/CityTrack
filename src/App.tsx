import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { SocketProvider, useSocket } from './context/SocketContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { PassengerDashboard } from './pages/PassengerDashboard.tsx';
import { DriverPanel } from './pages/DriverPanel.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { LiveTransportMap } from './components/Map/LiveTransportMap.tsx';
import { DemoTrackerControls } from './components/DemoTrackerControls.tsx';
import { BusDetailsModal } from './components/BusDetailsModal.tsx';
import { AuthModal } from './pages/AuthModal.tsx';
import { TripHistoryModal } from './pages/TripHistoryModal.tsx';
import { NotificationsPanel } from './pages/NotificationsPanel.tsx';
import { Bus } from './types/index.ts';
import {
  Home,
  MapPin,
  Route,
  Bell,
  User,
  Compass,
  Bus as BusIcon,
  ShieldAlert,
  Search,
  ArrowRight,
  Sparkles
} from 'lucide-react';

function MainApp() {
  const { role, user, isAuthenticated } = useAuth();
  const { buses, selectedBusId, setSelectedBusId } = useSocket();

  const [currentTab, setCurrentTab] = useState<'home' | 'map' | 'passenger' | 'driver' | 'admin'>('home');
  const [selectedBusForModal, setSelectedBusForModal] = useState<Bus | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTripHistory, setShowTripHistory] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Synchronize selected bus modal with socket context
  const activeModalBus =
    selectedBusForModal ||
    (selectedBusId ? buses.find(b => b.id === selectedBusId) || null : null);

  const handleOpenBusModal = (bus: Bus) => {
    setSelectedBusForModal(bus);
    setSelectedBusId(bus.id);
  };

  const handleCloseBusModal = () => {
    setSelectedBusForModal(null);
    setSelectedBusId(null);
  };

  const handleFocusBusOnMap = (bus: Bus) => {
    setCurrentTab('map');
    setSelectedBusId(bus.id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Primary Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuthModal={() => setShowAuthModal(true)}
      />

      {/* Main Content Pages */}
      <main className="flex-1 pb-20 md:pb-8">
        {currentTab === 'home' && (
          <LandingPage
            onExploreMap={() => setCurrentTab('map')}
            onGoPassenger={() => setCurrentTab('passenger')}
            onGoDriver={() => setCurrentTab('driver')}
            onGoAdmin={() => setCurrentTab('admin')}
            onOpenAuth={() => setShowAuthModal(true)}
            onSelectBus={handleOpenBusModal}
          />
        )}

        {currentTab === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h1 className="text-2xl font-black text-white">Full-Screen Transit Radar</h1>
                </div>
                <p className="text-xs text-slate-400">
                  Tracking {buses.length} small-city buses live across key arterial stops
                </p>
              </div>

              <div className="w-full sm:w-auto">
                <DemoTrackerControls />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Map Canvas (3 cols) */}
              <div className="lg:col-span-3">
                <LiveTransportMap
                  className="h-[620px] w-full"
                  onSelectBus={handleOpenBusModal}
                  focusBusId={selectedBusId}
                />
              </div>

              {/* Live Buses Sidebar (1 col) */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col h-[620px]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-bold text-xs uppercase tracking-wider text-cyan-400">
                    Live Telemetry ({buses.length})
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">2.5s Sync</span>
                </div>

                <div className="mt-3 flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {buses.map(bus => (
                    <div
                      key={bus.id}
                      onClick={() => {
                        setSelectedBusId(bus.id);
                        handleOpenBusModal(bus);
                      }}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        selectedBusId === bus.id
                          ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-850/60 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center font-mono">
                            {bus.busNumber}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-white">Line {bus.routeNumber || bus.busNumber}</div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[110px]">{bus.destination}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-emerald-400">
                            ~{bus.nextStopEtaMinutes}m
                          </div>
                          <div className="text-[9px] text-slate-400 font-mono">{bus.speed} km/h</div>
                        </div>
                      </div>

                      <div className="mt-2 text-[10px] text-slate-400 truncate flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                        <span>Next: {bus.nextStopName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'passenger' && (
          <PassengerDashboard
            onSelectBus={handleOpenBusModal}
            onOpenTripHistory={() => setShowTripHistory(true)}
            onOpenNotifications={() => setShowNotifications(true)}
          />
        )}

        {currentTab === 'driver' && <DriverPanel />}

        {currentTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Modals */}
      <BusDetailsModal
        bus={activeModalBus}
        onClose={handleCloseBusModal}
        onFocusOnMap={handleFocusBusOnMap}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <TripHistoryModal
        isOpen={showTripHistory}
        onClose={() => setShowTripHistory(false)}
      />

      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Bottom Navigation Bar (Mobile / Responsive App experience) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-2 py-2 flex items-center justify-around text-[10px] text-slate-400">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center gap-1 p-1 ${
            currentTab === 'home' ? 'text-cyan-400 font-bold' : 'hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentTab('map')}
          className={`flex flex-col items-center gap-1 p-1 ${
            currentTab === 'map' ? 'text-cyan-400 font-bold' : 'hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Map</span>
        </button>

        <button
          onClick={() => setCurrentTab('passenger')}
          className={`flex flex-col items-center gap-1 p-1 ${
            currentTab === 'passenger' ? 'text-cyan-400 font-bold' : 'hover:text-white'
          }`}
        >
          <BusIcon className="w-4 h-4" />
          <span>Routes</span>
        </button>

        <button
          onClick={() => setShowNotifications(true)}
          className="flex flex-col items-center gap-1 p-1 hover:text-white"
        >
          <Bell className="w-4 h-4" />
          <span>Alerts</span>
        </button>

        <button
          onClick={() => (isAuthenticated ? setCurrentTab('admin') : setShowAuthModal(true))}
          className={`flex flex-col items-center gap-1 p-1 ${
            currentTab === 'admin' ? 'text-cyan-400 font-bold' : 'hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </nav>

      {/* Modern Footer */}
      <footer className="hidden md:block border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">CityTrack</span>
            <span>• Real-Time Public Transport Tracking System for Small Cities</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>React + Express + Socket.IO + Leaflet</span>
            <span className="text-cyan-400 font-mono">Status: All Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <MainApp />
      </SocketProvider>
    </AuthProvider>
  );
}
