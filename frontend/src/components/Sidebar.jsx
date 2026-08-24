import React from 'react';
import { 
  Box, 
  Plus, 
  Terminal, 
  LogOut
} from 'lucide-react';

export default function Sidebar({ 
  currentView, 
  onNavigate, 
  user, 
  onOpenDevLogin, 
  onLogout 
}) {
  return (
    <aside className="fixed bottom-0 left-0 right-0 h-16 w-full flex-row border-t border-white/10 bg-[#060606]/95 backdrop-blur-2xl flex items-center justify-around px-4 select-none z-50 shadow-2xl md:sticky md:top-0 md:h-screen md:w-16 md:flex-col md:justify-between md:py-4 md:px-2 md:border-t-0 md:border-r md:border-white/10 shrink-0">
      {/* Brand & Main Nav */}
      <div className="flex items-center md:flex-col gap-4 sm:gap-6 md:gap-5 w-auto md:w-full justify-center">
        {/* CS PLAY Brand Badge */}
        <div 
          onClick={() => onNavigate('inventory')}
          className="flex flex-col items-center select-none cursor-pointer hidden md:flex"
          title="CS PLAY"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] border border-[#222222] flex items-center justify-center shadow-[0_0_15px_rgba(255,32,32,0.35)]">
            <span className="font-black text-xs tracking-tighter text-[#ff2020] font-display">
              CS
            </span>
          </div>
          <span className="text-[8px] font-black tracking-wider text-gray-300 mt-0.5 uppercase font-display">
            PLAY
          </span>
        </div>

        {/* Navigation Menu (Inventário e Adicionar Skin) */}
        <nav className="flex items-center md:flex-col gap-3 sm:gap-4 md:gap-2 w-auto md:w-full justify-center">
          {/* Meu Inventário */}
          <button
            type="button"
            onClick={() => onNavigate('inventory')}
            className={`h-10 px-3.5 md:px-0 md:w-10 rounded-xl flex items-center gap-2 justify-center transition-all cursor-pointer ${
              currentView === 'inventory'
                ? 'text-[#ff2020] bg-[#ff2020]/15 border border-[#ff2020]/40 shadow-[0_0_12px_rgba(255,32,32,0.35)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title="Meu Inventário"
          >
            <Box size={18} />
            <span className="text-xs font-bold font-display md:hidden">Inventário</span>
          </button>

          {/* Adicionar / Catálogo */}
          <button
            type="button"
            onClick={() => onNavigate('add')}
            className={`h-10 px-3.5 md:px-0 md:w-10 rounded-xl flex items-center gap-2 justify-center transition-all cursor-pointer ${
              currentView === 'add'
                ? 'text-[#ff2020] bg-[#ff2020]/15 border border-[#ff2020]/40 shadow-[0_0_12px_rgba(255,32,32,0.35)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title="Catálogo & Adicionar Skin"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span className="text-xs font-bold font-display md:hidden">Catálogo</span>
          </button>
        </nav>
      </div>

      {/* User Avatar & Logout */}
      <div className="flex items-center md:flex-col gap-3 w-auto md:w-full justify-center">
        {user ? (
          <>
            {/* User Avatar */}
            <div 
              className="w-9 h-9 md:w-10 md:h-10 rounded-xl border border-[#ff2020]/50 overflow-hidden shadow-[0_0_12px_rgba(255,32,32,0.25)] relative group cursor-pointer"
              title={`Logado como: ${user.personaname || user.steamid}`}
            >
              <img
                src={user.avatar || 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg'}
                alt={user.personaname || 'Avatar'}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-950/20 transition-all cursor-pointer"
              title="Encerrar Sessão"
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onOpenDevLogin}
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            title="Login Direto (Dev/Teste)"
          >
            <Terminal size={16} />
          </button>
        )}
      </div>
    </aside>
  );
}
