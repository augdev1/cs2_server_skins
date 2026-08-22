import React from 'react';
import { Flame, Shield } from 'lucide-react';

export default function TeamSelector({ team, selectedTeam, onChangeTeam, onSelectTeam }) {
  const currentTeam = selectedTeam !== undefined ? selectedTeam : team;
  const setTeamHandler = onSelectTeam || onChangeTeam;

  const isT = currentTeam === 2;
  const isCT = currentTeam === 3;

  return (
    <div className="inline-flex bg-[#080808] p-1.5 rounded-xl border border-[#1c1c1c] gap-1.5 shadow-md">
      {/* Terrorists Button - Vivid Red */}
      <button
        id="btn-team-t"
        type="button"
        onClick={() => setTeamHandler && setTeamHandler(2)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-extrabold text-xs transition-all duration-200 cursor-pointer font-display tracking-wider ${
          isT
            ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-[1.02]'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Flame size={16} className={isT ? 'text-white animate-pulse' : 'text-red-500'} />
        <span>TERRORISTAS (TR)</span>
      </button>

      {/* Counter-Terrorists Button - Blue */}
      <button
        id="btn-team-ct"
        type="button"
        onClick={() => setTeamHandler && setTeamHandler(3)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-extrabold text-xs transition-all duration-200 cursor-pointer font-display tracking-wider ${
          isCT
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-[1.02]'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Shield size={16} className={isCT ? 'text-white animate-pulse' : 'text-blue-500'} />
        <span>CONTRA-TERRORISTAS (CT)</span>
      </button>
    </div>
  );
}
