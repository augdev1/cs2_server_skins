import React from 'react';
import { Flame, Shield } from 'lucide-react';

export default function TeamSelector({ team, selectedTeam, onChangeTeam, onSelectTeam }) {
  const currentTeam = selectedTeam !== undefined ? selectedTeam : team;
  const setTeamHandler = onSelectTeam || onChangeTeam;

  const isT = currentTeam === 2;
  const isCT = currentTeam === 3;

  return (
    <div className="inline-flex bg-cs-surface/90 p-1.5 rounded-2xl border border-white/10 gap-1.5 shadow-xl backdrop-blur-xl">
      {/* Terrorists Button */}
      <button
        id="btn-team-t"
        type="button"
        onClick={() => setTeamHandler && setTeamHandler(2)}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all duration-300 cursor-pointer font-display tracking-wider ${
          isT
            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.5)] scale-[1.02]'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Flame size={18} className={isT ? 'text-white animate-pulse' : 'text-orange-500'} />
        <span>TERRORISTAS (TR)</span>
      </button>

      {/* Counter-Terrorists Button */}
      <button
        id="btn-team-ct"
        type="button"
        onClick={() => setTeamHandler && setTeamHandler(3)}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all duration-300 cursor-pointer font-display tracking-wider ${
          isCT
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] scale-[1.02]'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Shield size={18} className={isCT ? 'text-white animate-pulse' : 'text-blue-500'} />
        <span>CONTRA-TERRORISTAS (CT)</span>
      </button>
    </div>
  );
}
