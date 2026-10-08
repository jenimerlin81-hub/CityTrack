import React from 'react';
import { X, History, MapPin, Calendar, Clock, IndianRupee, ArrowRight, CheckCircle2 } from 'lucide-react';

interface TripHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const sampleTripHistory = [
  {
    id: 'TKT-9021',
    date: 'Today, 07:45 AM',
    routeNumber: '101',
    routeName: 'Central Bus Stand ⇄ Srirangam Temple',
    boarding: 'Central Bus Stand',
    destination: 'Rockfort Uchi Pillayar',
    fare: 15,
    busNumber: '101',
    status: 'Completed',
    durationMinutes: 18
  },
  {
    id: 'TKT-8842',
    date: 'Yesterday, 05:20 PM',
    routeNumber: '204',
    routeName: 'Chathiram Bus Stand ⇄ Airport',
    boarding: 'Thillai Nagar Main Cross',
    destination: 'Bishop Heber College',
    fare: 12,
    busNumber: '204',
    status: 'Completed',
    durationMinutes: 14
  },
  {
    id: 'TKT-7619',
    date: 'Oct 06, 09:10 AM',
    routeNumber: '102',
    routeName: 'Railway Junction ⇄ NIT Trichy',
    boarding: 'Tiruchirappalli Railway Junction',
    destination: 'BHEL Township Kailasapuram',
    fare: 22,
    busNumber: '102',
    status: 'Completed',
    durationMinutes: 32
  },
  {
    id: 'TKT-6501',
    date: 'Oct 04, 06:05 PM',
    routeNumber: '305',
    routeName: 'Central Bus Stand ⇄ BHEL Township',
    boarding: 'Anna Stadium Sports Complex',
    destination: 'Ponmalai Golden Rock',
    fare: 18,
    busNumber: '305',
    status: 'Completed',
    durationMinutes: 20
  }
];

export const TripHistoryModal: React.FC<TripHistoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100 max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Commuter Trip History</h2>
              <p className="text-xs text-slate-400">Past bus journeys & digital receipts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {sampleTripHistory.map(trip => (
            <div
              key={trip.id}
              className="p-4 rounded-2xl bg-slate-850/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center">
                    {trip.routeNumber}
                  </span>
                  <span className="text-xs font-bold text-white">Line {trip.routeNumber}</span>
                  <span className="text-[10px] font-mono text-slate-400">#{trip.id}</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">₹{trip.fare} Paid</span>
              </div>

              <div className="text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>Boarded: <b className="text-white">{trip.boarding}</b></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Alighted: <b className="text-white">{trip.destination}</b></span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>{trip.date}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Completed ({trip.durationMinutes} min)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
