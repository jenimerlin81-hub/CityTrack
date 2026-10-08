import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useSocket } from '../context/SocketContext.tsx';
import { UserRole } from '../types/index.ts';
import {
  Bus,
  Compass,
  LayoutDashboard,
  ShieldAlert,
  Bell,
  LogOut,
  User,
  Radio,
  CheckCircle,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'map' | 'passenger' | 'driver' | 'admin';
  setCurrentTab: (tab: 'home' | 'map' | 'passenger' | 'driver' | 'admin') => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenAuthModal }) => {
  const { user, role, logout, quickLogin, isAuthenticated } = useAuth();
  const { isConnected, notifications } = useSocket();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadNotifs = notifications.slice(0, 4);

  const handleRoleSwitch = (newRole: UserRole) => {
    quickLogin(newRole);
    if (newRole === 'admin') setCurrentTab('admin');
    else if (newRole === 'driver') setCurrentTab('driver');
    else setCurrentTab('passenger');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('home')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/25">
            <Bus className="w-5 h-5 text-slate-950 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
              CITYTRACK
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            </span>
            <span className="text-[10px] font-mono tracking-wider uppercase text-cyan-400 font-semibold -mt-1">
              Live Transit Network
            </span>
          </div>
        </div>

        {/* Center Navigation Tabs (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800/80 p-1 rounded-2xl">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentTab === 'home'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentTab('map')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentTab === 'map'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Map
          </button>
          <button
            onClick={() => setCurrentTab('passenger')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentTab === 'passenger'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Passenger App
          </button>
          <button
            onClick={() => setCurrentTab('driver')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentTab === 'driver'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Driver Console
          </button>
          <button
            onClick={() => setCurrentTab('admin')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentTab === 'admin'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Admin Panel
          </button>
        </nav>

        {/* Right Section: Socket Status + Role Switcher + Notifs + User */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Socket status */}
          <div
            title={isConnected ? 'Real-Time WebSocket Sync Active' : 'Connecting to transit gateway...'}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="hidden lg:inline">{isConnected ? 'LIVE SYNC' : 'OFFLINE'}</span>
          </div>

          {/* Quick Role Tester Pills */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-xl text-[11px]">
            <span className="text-[10px] text-slate-500 uppercase font-mono px-1.5">Role:</span>
            {(['passenger', 'driver', 'admin'] as UserRole[]).map(r => (
              <button
                key={r}
                onClick={() => handleRoleSwitch(r)}
                className={`px-2 py-0.5 rounded-lg capitalize font-bold transition-all ${
                  role === r
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(prev => !prev)}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">Live Alerts</span>
                  <span className="text-cyan-400 text-[10px] font-mono">Real-time</span>
                </div>
                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                  {unreadNotifs.map(n => (
                    <div key={n.id} className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{n.title}</span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Auth */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-white max-w-[120px] truncate">{user?.name}</span>
                <span className="text-[10px] font-mono capitalize text-cyan-400">{role}</span>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-2 rounded-xl bg-slate-900 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-850 bg-slate-950 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setCurrentTab('home');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-900 text-left font-bold text-xs text-white"
            >
              Overview
            </button>
            <button
              onClick={() => {
                setCurrentTab('map');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-900 text-left font-bold text-xs text-white"
            >
              Live Map
            </button>
            <button
              onClick={() => {
                setCurrentTab('passenger');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-900 text-left font-bold text-xs text-cyan-300"
            >
              Passenger App
            </button>
            <button
              onClick={() => {
                setCurrentTab('driver');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-900 text-left font-bold text-xs text-cyan-300"
            >
              Driver Console
            </button>
            <button
              onClick={() => {
                setCurrentTab('admin');
                setMobileMenuOpen(false);
              }}
              className="col-span-2 p-2.5 rounded-xl bg-slate-900 text-left font-bold text-xs text-cyan-300"
            >
              Admin Dashboard
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Switch Role:</span>
            <div className="flex gap-1.5">
              {(['passenger', 'driver', 'admin'] as UserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => {
                    handleRoleSwitch(r);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                    role === r ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
