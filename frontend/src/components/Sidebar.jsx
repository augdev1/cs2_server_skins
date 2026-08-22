import React from 'react';
import { 
  Box, 
  Plus, 
  Terminal, 
  LogOut,
  HelpCircle,
  LogIn
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
      {/* Top CS PLAY Logo in Vivid Red */}
      <div className="flex flex-col items-center gap-6">
        <div 
          onClick={() => onNavigate('inventory')}
          className="flex flex-col items-center cursor-pointer group"
          title="CS PLAY"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0d0d0d] border border-[#222222] group-hover:border-[#ff2020] flex items-center justify-center shadow-[0_0_15px_rgba(255,32,32,0.3)] transition-all">
            <span className="font-black text-sm tracking-tighter text-[#ff2020] font-display">
              CS
            </span>
          </div>
          <span className="text-[9px] font-black tracking-wider text-gray-200 mt-1 uppercase group-hover:text-[#ff2020] transition-colors font-display">
            PLAY
          </span>
        </div>

        {/* Essential Navigation Icons */}
        <nav className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('inventory')}
            className={`p-3 rounded-xl transition-all cursor-pointer ${
              currentView === 'inventory'
                ? 'text-[#ff2020] bg-[#ff2020]/15 border border-[#ff2020]/40 shadow-[0_0_12px_rgba(255,32,32,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-[#111111]'
            }`}
            title="Meu Inventário"
          >
            <Box size={20} />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('add')}
            className={`p-3 rounded-xl transition-all cursor-pointer ${
              currentView === 'add'
                ? 'text-[#ff2020] bg-[#ff2020]/15 border border-[#ff2020]/40 shadow-[0_0_12px_rgba(255,32,32,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-[#111111]'
            }`}
            title="Adicionar / Escolher Skin"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </nav>
      </div>

      {/* Bottom Actions: Steam Login & Dev Login side by side */}
      <div className="flex flex-col items-center gap-2.5">
        {user ? (
          /* User Logged In: Avatar & Logout */
          <div className="flex flex-col items-center gap-2">
            <div 
              className="relative group cursor-pointer"
              title={`${user.personaname} (${user.steamid})`}
            >
              <img 
                src={user.avatar || `https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg`} 
                alt={user.personaname}
                className="w-9 h-9 rounded-xl border border-[#ff2020] shadow-[0_0_12px_rgba(255,32,32,0.4)] object-cover"
                onError={(e) => {
                  e.target.src = 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg';
                }}
              />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-black absolute -bottom-0.5 -right-0.5" />
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onOpenDevLogin}
                className="p-1.5 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-[#111111] transition-all cursor-pointer"
                title="Trocar Conta Dev"
              >
                <Terminal size={14} />
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                title="Desconectar"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        ) : (
          /* User NOT Logged In: Steam Login and Dev Login side-by-side */
          <div className="flex flex-col items-center gap-2">
            {/* Steam Login Button */}
            <button
              type="button"
              onClick={handleSteamLogin}
              className="p-2.5 rounded-xl bg-[#111111] border border-[#222222] hover:border-[#ff2020] text-gray-300 hover:text-white hover:bg-[#ff2020]/20 hover:shadow-[0_0_15px_rgba(255,32,32,0.4)] transition-all cursor-pointer flex items-center justify-center group"
              title="Entrar com a Steam (Oficial)"
            >
              {/* Steam Icon SVG */}
              <svg 
                className="w-5 h-5 fill-current text-gray-300 group-hover:text-[#ff2020] transition-colors" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489l2.671-3.874a3.003 3.003 0 0 1-.51-.865l-3.66.732A8.006 8.006 0 0 1 6 12c0-3.314 2.686-6 6-6s6 2.686 6 6c0 3.186-2.484 5.792-5.617 5.98l1.668 2.451A10.003 10.003 0 0 0 22 12c0-5.523-4.477-10-10-10zm3.5 10a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm-7 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
              </svg>
            </button>

            {/* Dev Login Terminal Button */}
            <button
              type="button"
              onClick={onOpenDevLogin}
              className="p-2 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-[#111111] transition-all cursor-pointer"
              title="Dev Login (SteamID manual)"
            >
              <Terminal size={16} />
            </button>
          </div>
        )}

        <button
          type="button"
          className="p-2 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-[#111111] transition-all cursor-pointer mt-1"
          title="Ajuda"
        >
          <HelpCircle size={16} />
        </button>
      </div>
    </aside>
  );
}
