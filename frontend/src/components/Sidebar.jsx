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
    <aside className="w-16 bg-[#060606]/90 backdrop-blur-xl border-r border-[#1a1a1a]/80 flex flex-col items-center py-4 justify-between select-none z-40 shrink-0 min-h-screen shadow-2xl">
      {/* Top: CS PLAY Logo & Navigation Icons */}
      <div className="flex flex-col items-center gap-5 w-full px-2">
        {/* CS PLAY Brand Badge (Visual only) */}
        <div 
          className="flex flex-col items-center select-none"
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

        {/* Navigation Menu (Apenas Inventário e Adicionar Skin) */}
        <nav className="flex flex-col items-center gap-2 w-full">
          {/* Meu Inventário */}
          <button
            type="button"
            onClick={() => onNavigate('inventory')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              currentView === 'inventory'
                ? 'text-[#ff2020] bg-[#ff2020]/15 border border-[#ff2020]/40 shadow-[0_0_12px_rgba(255,32,32,0.35)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
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
                ? 'text-[#ff2020] bg-[#ff2020]/15 border border-[#ff2020]/40 shadow-[0_0_12px_rgba(255,32,32,0.35)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title="Catálogo & Adicionar Skin"
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </nav>
      </div>

      {/* Bottom: User Avatar & Logout */}
      <div className="flex flex-col items-center gap-3 w-full px-2">
        {user ? (
          <>
            {/* User Avatar */}
            <div 
              className="w-10 h-10 rounded-xl border border-[#ff2020]/50 overflow-hidden shadow-[0_0_12px_rgba(255,32,32,0.25)] relative group cursor-pointer"
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
              className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-950/20 transition-all cursor-pointer"
              title="Encerrar Sessão"
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onOpenDevLogin}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            title="Login Direto (Dev/Teste)"
          >
            <Terminal size={16} />
          </button>
        )}
      </div>
    </aside>
  );
}
