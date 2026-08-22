import React from 'react';
import { 
  Box, 
  Plus, 
  Terminal, 
  LogOut,
  HelpCircle
} from 'lucide-react';

export default function Sidebar({ 
  currentView, 
  onNavigate, 
  user, 
  onOpenDevLogin, 
  onLogout 
}) {
  return (
    <aside className="w-16 bg-[#000000] border-r border-[#141414] flex flex-col items-center py-4 justify-between select-none z-40 shrink-0 min-h-screen">
      {/* Top: CS PLAY Logo & Navigation Icons */}
      <div className="flex flex-col items-center gap-5 w-full px-2">
        {/* CS PLAY Brand Badge (Visual only) */}
        <div 
          className="flex flex-col items-center select-none"
          title="CS PLAY"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] border border-[#222222] flex items-center justify-center shadow-[0_0_12px_rgba(255,32,32,0.3)]">
            <span className="font-black text-xs tracking-tighter text-[#ff2020] font-display">
              CS
            </span>
          </div>
          <span className="text-[8px] font-black tracking-wider text-gray-300 mt-0.5 uppercase font-display">
            PLAY
          </span>
        </div>

        {/* Navigation Menu (Apenas Inventário e Adicionar Skin) */}
        <nav className="flex flex-col items-center gap-2 w-full">
          {/* Meu Inventário */}
          <button
            type="button"
            onClick={() => onNavigate('inventory')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              currentView === 'inventory'
                ? 'text-[#ff2020] bg-[#ff2020]/15 border border-[#ff2020]/40 shadow-[0_0_10px_rgba(255,32,32,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-[#0e0e0e]'
            }`}
            title="Meu Inventário"
          >
            <Box size={18} />
          </button>

          {/* Adicionar / Catálogo */}
          <button
            type="button"
            onClick={() => onNavigate('add')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              currentView === 'add'
                ? 'text-[#ff2020] bg-[#ff2020]/15 border border-[#ff2020]/40 shadow-[0_0_10px_rgba(255,32,32,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-[#0e0e0e]'
            }`}
            title="Adicionar Skin / Catálogo"
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </nav>
      </div>

      {/* Bottom Actions: User Avatar & Logout */}
      <div className="flex flex-col items-center gap-2.5 w-full px-2">
        {user && (
          <div className="flex flex-col items-center gap-2 w-full">
            <div 
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
