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

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onOpenDevLogin}
          className="p-2.5 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
          title="Dev Login (SteamID)"
        >
          <Terminal size={18} />
        </button>

        {user && (
          <button
            type="button"
            onClick={onLogout}
            className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
            title="Desconectar"
          >
            <LogOut size={18} />
          </button>
        )}

        <button
          type="button"
          className="p-2.5 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-[#111111] transition-all cursor-pointer"
          title="Ajuda"
        >
          <HelpCircle size={18} />
        </button>
      </div>
    </aside>
  );
}
