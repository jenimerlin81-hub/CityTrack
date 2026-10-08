import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext.tsx';
import { X, Bell, Info, AlertTriangle, CheckCircle2, Clock, Filter } from 'lucide-react';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const { notifications } = useSocket();
  const [filterType, setFilterType] = useState<'all' | 'info' | 'warning' | 'success'>('all');

  if (!isOpen) return null;

  const filtered = notifications.filter(n => (filterType === 'all' ? true : n.type === filterType));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100 max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Live Transit Notifications</h2>
              <p className="text-xs text-slate-400">Instant ETA triggers, trip alerts & advisories</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4 text-xs">
          {(['all', 'info', 'warning', 'success'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 rounded-xl capitalize font-bold transition-all ${
                filterType === f
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-850 text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="mt-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No notifications in this category.</div>
          ) : (
            filtered.map(notif => {
              const icon = {
                info: <Info className="w-4 h-4 text-cyan-400" />,
                warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
                success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
                alert: <AlertTriangle className="w-4 h-4 text-rose-400" />
              }[notif.type] || <Info className="w-4 h-4 text-cyan-400" />;

              return (
                <div
                  key={notif.id}
                  className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {icon}
                      <span className="font-bold text-xs text-white">{notif.title}</span>
                      {notif.busNumber && (
                        <span className="text-[10px] font-mono font-bold bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded">
                          Bus {notif.busNumber}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 pl-6 leading-relaxed">{notif.message}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
