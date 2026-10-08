import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext.tsx';
import { Play, Pause, FastForward, RotateCcw, Activity, Sparkles } from 'lucide-react';

export const DemoTrackerControls: React.FC = () => {
  const { simulationActive, simulationSpeed, toggleSimulation, setSimulationSpeedMultiplier, refreshAllData } = useSocket();
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await fetch('/api/reset-data', { method: 'POST' });
      await refreshAllData();
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-2.5 px-4 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-100">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Demo GPS Mode</span>
        </div>
        <span
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
            simulationActive
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${simulationActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
          {simulationActive ? 'Live Broadcasting' : 'Paused'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Play / Pause Toggle Button */}
        <button
          onClick={() => toggleSimulation()}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
            simulationActive
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
          }`}
        >
          {simulationActive ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Demo</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Enable Demo Tracking</span>
            </>
          )}
        </button>

        {/* Speed Multipliers */}
        <div className="flex items-center bg-slate-950/80 rounded-xl p-1 border border-slate-800">
          {[1, 2, 4].map(spd => (
            <button
              key={spd}
              onClick={() => setSimulationSpeedMultiplier(spd)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold transition-all ${
                simulationSpeed === spd
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Reset */}
        <button
          onClick={handleReset}
          disabled={isResetting}
          title="Reset sample positions and initial data"
          className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};
