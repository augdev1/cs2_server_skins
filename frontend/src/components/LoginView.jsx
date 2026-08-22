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
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background Glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ff2020]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full flex flex-col items-center text-center relative z-10 space-y-8 animate-fade-in">
        {/* Logo CS PLAY */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-[#0a0a0a] border border-[#222222] flex items-center justify-center shadow-[0_0_30px_rgba(255,32,32,0.4)]">
            <span className="font-black text-2xl tracking-tighter text-[#ff2020] font-display">
              CS
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-wider text-white uppercase font-display mt-1">
            CS PLAY <span className="text-[#ff2020]">SKINS</span>
          </h1>
          <p className="text-xs text-gray-400 max-w-sm">
            Gerencie e personalize seu inventário de skins, facas e luvas no servidor de Counter-Strike 2.
          </p>
        </div>

        {/* Login Action Card */}
        <div className="w-full bg-[#080808] border border-[#1a1a1a] rounded-2xl p-6 shadow-[0_15px_40px_rgba(0,0,0,0.9)] space-y-4">
          <div className="text-left border-b border-[#161616] pb-3">
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
            className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold py-3.5 px-5 rounded-xl text-xs flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,32,32,0.45)] transition-all cursor-pointer hover:scale-[1.02] active:scale-95 group font-display tracking-wider"
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

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-[#1a1a1a]" />
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">OU</span>
            <div className="flex-1 h-px bg-[#1a1a1a]" />
          </div>

          {/* Dev / Manual SteamID Button */}
          <button
            type="button"
            onClick={onOpenDevLogin}
            className="w-full bg-[#0d0d0d] hover:bg-[#141414] border border-[#222222] hover:border-amber-500/50 text-gray-300 hover:text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Terminal size={15} className="text-amber-400" />
            <span>Entrar com SteamID manual (Dev Login)</span>
          </button>
        </div>

        {/* Feature badges */}
        <div className="grid grid-cols-3 gap-3 w-full text-left">
          <div className="bg-[#080808] border border-[#141414] p-3 rounded-xl">
            <Zap size={16} className="text-[#ff2020] mb-1.5" />
            <div className="text-xs font-bold text-white">Sincronização</div>
            <div className="text-[10px] text-gray-500">Comando !ws no chat do servidor</div>
          </div>

          <div className="bg-[#080808] border border-[#141414] p-3 rounded-xl">
            <Layers size={16} className="text-[#ff2020] mb-1.5" />
            <div className="text-xs font-bold text-white">+2.000 Skins</div>
            <div className="text-[10px] text-gray-500">Facas, Luvas e Armas oficiais</div>
          </div>

          <div className="bg-[#080808] border border-[#141414] p-3 rounded-xl">
            <Sparkles size={16} className="text-[#ff2020] mb-1.5" />
            <div className="text-xs font-bold text-white">Customização</div>
            <div className="text-[10px] text-gray-500">Float, StatTrak e Seeds</div>
          </div>
        </div>
      </div>
    </div>
  );
}
