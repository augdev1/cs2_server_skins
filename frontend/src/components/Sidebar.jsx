import React from 'react';
import { 
  Home,
  Box, 
  Plus, 
  Terminal, 
  LogOut,
  HelpCircle
} from 'lucide-react';
import { authService } from '../services/api';

export default function Sidebar({ 
  currentView, 
  onNavigate, 
  user, 
  onOpenDevLogin, 
  onLogout 
}) {
  const handleSteamLogin = () => {
    window.location.href = authService.getSteamLoginUrl();
  };

  return (
    <aside className="w-16 bg-[#000000] border-r border-[#141414] flex flex-col items-center py-4 justify-between select-none z-40 shrink-0 min-h-screen">
      {/* Top: Logo & Main Navigation Group */}
      <div className="flex flex-col items-center gap-4 w-full px-2">
        {/* CS PLAY Logo */}
        <div 
          onClick={() => onNavigate(user ? 'inventory' : 'login')}
          className="flex flex-col items-center cursor-pointer group mb-1"
          title="CS PLAY"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] border border-[#222222] group-hover:border-[#ff2020] flex items-center justify-center shadow-[0_0_12px_rgba(255,32,32,0.3)] transition-all">
            <span className="font-black text-xs tracking-tighter text-[#ff2020] font-display">
              CS
            </span>
          </div>
          <span className="text-[8px] font-black tracking-wider text-gray-300 mt-0.5 uppercase group-hover:text-[#ff2020] transition-colors font-display">
            PLAY
          </span>
        </div>

        {/* Compact Navigation Menu */}
        <nav className="flex flex-col items-center gap-1.5 w-full">
          {/* Home / Início */}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              currentView === 'login'
                ? 'text-[#ff2020] bg-[#ff2020]/15 border border-[#ff2020]/40 shadow-[0_0_10px_rgba(255,32,32,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-[#0e0e0e]'
            }`}
            title="Página Inicial"
          >
            <Home size={18} />
          </button>

          {/* Inventário */}
          <button
            type="button"
            onClick={() => {
              if (user) {
                onNavigate('inventory');
              } else {
                onNavigate('login');
              }
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              currentView === 'inventory'
                ? 'text-[#ff2020] bg-[#ff2020]/15 border border-[#ff2020]/40 shadow-[0_0_10px_rgba(255,32,32,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-[#0e0e0e]'
            }`}
            title={user ? "Meu Inventário" : "Faça login para ver o inventário"}
          >
            <Box size={18} />
          </button>

          {/* Adicionar / Catálogo */}
          <button
            type="button"
            onClick={() => {
              if (user) {
                onNavigate('add');
              } else {
                onNavigate('login');
              }
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              currentView === 'add'
                ? 'text-[#ff2020] bg-[#ff2020]/15 border border-[#ff2020]/40 shadow-[0_0_10px_rgba(255,32,32,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-[#0e0e0e]'
            }`}
            title={user ? "Adicionar / Escolher Skin" : "Faça login para escolher skins"}
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </nav>
      </div>

      {/* Bottom Actions: Compact, neatly aligned */}
      <div className="flex flex-col items-center gap-2 w-full px-2">
        {user ? (
          /* User Logged In: Avatar & Controls */
          <div className="flex flex-col items-center gap-1.5 w-full">
            <div 
              onClick={() => onNavigate('inventory')}
              className="relative cursor-pointer group"
              title={`${user.personaname} (${user.steamid})`}
            >
              <img 
                src={user.avatar || `https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg`} 
                alt={user.personaname}
                className="w-8 h-8 rounded-xl border border-[#ff2020] shadow-[0_0_10px_rgba(255,32,32,0.4)] object-cover"
                onError={(e) => {
                  e.target.src = 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg';
                }}
              />
              <div className="w-2 h-2 rounded-full bg-green-500 border border-black absolute -bottom-0.5 -right-0.5" />
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onOpenDevLogin}
                className="p-1.5 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-[#0e0e0e] transition-all cursor-pointer"
                title="Trocar Conta Dev"
              >
                <Terminal size={14} />
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                title="Desconectar (Logout)"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        ) : (
          /* User NOT Logged In: Steam & Dev Login */
          <div className="flex flex-col items-center gap-1.5 w-full">
            {/* Steam Login */}
            <button
              type="button"
              onClick={handleSteamLogin}
              className="w-10 h-10 rounded-xl bg-[#0a0a0a] border border-[#1e1e1e] hover:border-[#ff2020] text-gray-300 hover:text-white hover:bg-[#ff2020]/20 hover:shadow-[0_0_12px_rgba(255,32,32,0.4)] transition-all cursor-pointer flex items-center justify-center group"
              title="Entrar com a Steam"
            >
              <svg 
                className="w-4 h-4 fill-current text-gray-300 group-hover:text-[#ff2020] transition-colors" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489l2.671-3.874a3.003 3.003 0 0 1-.51-.865l-3.66.732A8.006 8.006 0 0 1 6 12c0-3.314 2.686-6 6-6s6 2.686 6 6c0 3.186-2.484 5.792-5.617 5.98l1.668 2.451A10.003 10.003 0 0 0 22 12c0-5.523-4.477-10-10-10zm3.5 10a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm-7 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
              </svg>
            </button>

            {/* Dev Login */}
            <button
              type="button"
              onClick={onOpenDevLogin}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-amber-400 hover:bg-[#0e0e0e] transition-all cursor-pointer"
              title="Dev Login"
            >
              <Terminal size={14} />
            </button>
          </div>
        )}

        <button
          type="button"
          className="p-1 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-[#0e0e0e] transition-all cursor-pointer"
          title="Ajuda"
        >
          <HelpCircle size={14} />
        </button>
      </div>
    </aside>
  );
}
