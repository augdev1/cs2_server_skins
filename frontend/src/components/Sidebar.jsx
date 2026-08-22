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
    <aside className="w-16 bg-[#09090b] border-r border-[#1e1e24] flex flex-col items-center py-4 justify-between select-none z-40 shrink-0 min-h-screen">
      {/* Top CS PLAY Logo */}
      <div className="flex flex-col items-center gap-6">
        <div 
          onClick={() => onNavigate('inventory')}
          className="flex flex-col items-center cursor-pointer group"
          title="CS PLAY"
        >
          <div className="w-10 h-10 rounded-xl bg-[#141418] border border-[#2b2b36] group-hover:border-[#ff5500] flex items-center justify-center shadow-lg transition-all">
            <span className="font-black text-sm tracking-tighter text-[#ff5500] font-display">
              CS
            </span>
          </div>
          <span className="text-[9px] font-black tracking-wider text-gray-300 mt-1 uppercase group-hover:text-[#ff5500] transition-colors font-display">
            PLAY
          </span>
        </div>

        {/* Essential Navigation Icons */}
        <nav className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('inventory')}
            className={`p-3 rounded-xl transition-all ${
              currentView === 'inventory'
                ? 'text-[#ff5500] bg-[#ff5500]/10 border border-[#ff5500]/30 shadow-[0_0_12px_rgba(255,85,0,0.2)]'
                : 'text-gray-400 hover:text-white hover:bg-[#141418]'
            }`}
            title="Meu Inventário"
          >
            <Box size={20} />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('add')}
            className={`p-3 rounded-xl transition-all ${
              currentView === 'add'
                ? 'text-[#ff5500] bg-[#ff5500]/10 border border-[#ff5500]/30 shadow-[0_0_12px_rgba(255,85,0,0.2)]'
                : 'text-gray-400 hover:text-white hover:bg-[#141418]'
            }`}
            title="Adicionar / Escolher Skin"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onOpenDevLogin}
          className="p-2.5 rounded-xl text-amber-400/80 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
          title="Dev Login (SteamID)"
        >
          <Terminal size={18} />
        </button>

        {user && (
          <button
            type="button"
            onClick={onLogout}
            className="p-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Desconectar"
          >
            <LogOut size={18} />
          </button>
        )}

        <button
          type="button"
          className="p-2.5 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-[#141418] transition-all"
          title="Ajuda"
        >
          <HelpCircle size={18} />
        </button>
      </div>
    </aside>
  );
}
