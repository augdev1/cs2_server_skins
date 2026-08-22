import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  Zap, 
  Layers, 
  Crosshair,
  ArrowRight,
  Flame
} from 'lucide-react';
import { authService } from '../services/api';

export default function LoginView({ onOpenDevLogin }) {
  const [steamLoading, setSteamLoading] = useState(false);

  const handleSteamLogin = () => {
    setSteamLoading(true);
    window.location.href = authService.getSteamLoginUrl();
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-6 relative overflow-hidden select-none bg-black/40 backdrop-blur-[2px]">
      {/* Subtle Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ff2020]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full flex flex-col items-center text-center relative z-10 space-y-7 animate-fade-in">
        {/* Logo CS PLAY */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-[#090909]/90 border border-[#ff2020]/40 flex items-center justify-center shadow-[0_0_35px_rgba(255,32,32,0.5)] backdrop-blur-md">
            <span className="font-black text-2xl tracking-tighter text-[#ff2020] font-display">
              CS
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-wider text-white uppercase font-display mt-1 drop-shadow-md">
            CS PLAY <span className="text-[#ff2020]">SKINS</span>
          </h1>
          <p className="text-xs text-gray-300 max-w-sm drop-shadow">
            Gerencie e personalize seu inventário de skins, facas e luvas no servidor de Counter-Strike 2.
          </p>
        </div>

        {/* Login Action Card with Glassmorphism */}
        <div className="w-full bg-[#080808]/85 border border-[#222222]/80 backdrop-blur-xl rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-4">
          <div className="text-left border-b border-[#1c1c1c] pb-3">
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider font-display">
              Autenticação de Jogador
            </h2>
            <p className="text-[11px] text-gray-400">
              Faça login para carregar seu inventário e salvar skins no servidor.
            </p>
          </div>

          {/* Steam Official Login Button */}
          <button
            type="button"
            onClick={handleSteamLogin}
            disabled={steamLoading}
            className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold py-3.5 px-5 rounded-xl text-xs flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(255,32,32,0.5)] transition-all cursor-pointer hover:scale-[1.02] active:scale-95 group font-display tracking-wider"
          >
            {/* Official Steam Icon */}
            <svg 
              className="w-5 h-5 fill-current text-white group-hover:rotate-12 transition-transform" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489l2.671-3.874a3.003 3.003 0 0 1-.51-.865l-3.66.732A8.006 8.006 0 0 1 6 12c0-3.314 2.686-6 6-6s6 2.686 6 6c0 3.186-2.484 5.792-5.617 5.98l1.668 2.451A10.003 10.003 0 0 0 22 12c0-5.523-4.477-10-10-10zm3.5 10a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm-7 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
            </svg>
            <span>{steamLoading ? 'Redirecionando para Steam...' : 'ENTRAR COM A STEAM'}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Direct Developer Login (Quick Test) */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onOpenDevLogin}
              className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors cursor-pointer flex items-center justify-center gap-1.5 mx-auto hover:underline"
            >
              <Terminal size={12} />
              <span>Login Rápido de Teste (SteamID Direto)</span>
            </button>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-3 gap-3 w-full text-center">
          <div className="bg-[#0a0a0a]/70 border border-[#1a1a1a] backdrop-blur-md p-3 rounded-2xl">
            <Flame size={16} className="mx-auto text-[#ff2020] mb-1" />
            <p className="text-[10px] font-bold text-gray-200">Skins & Facas</p>
            <p className="text-[9px] text-gray-400">100% CS2 Atualizado</p>
          </div>

          <div className="bg-[#0a0a0a]/70 border border-[#1a1a1a] backdrop-blur-md p-3 rounded-2xl">
            <Zap size={16} className="mx-auto text-amber-400 mb-1" />
            <p className="text-[10px] font-bold text-gray-200">Instantâneo</p>
            <p className="text-[9px] text-gray-400">Salva direto no server</p>
          </div>

          <div className="bg-[#0a0a0a]/70 border border-[#1a1a1a] backdrop-blur-md p-3 rounded-2xl">
            <Crosshair size={16} className="mx-auto text-blue-400 mb-1" />
            <p className="text-[10px] font-bold text-gray-200">Agentes & Luvas</p>
            <p className="text-[9px] text-gray-400">TR e CT separados</p>
          </div>
        </div>
      </div>
    </div>
  );
}
