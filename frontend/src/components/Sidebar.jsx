import React from 'react';
import { 
  Flame, 
  Gamepad2, 
  Crown, 
  Box, 
  Trophy, 
  Gift, 
  Crosshair, 
  Settings, 
  Terminal, 
  LogOut,
  HelpCircle,
  Share2
} from 'lucide-react';

export default function Sidebar({ 
  currentView, 
  onNavigate, 
  user, 
  onOpenDevLogin, 
  onLogout 
}) {
  return (
    <aside className="w-16 bg-[#0c0d12] border-r border-[#1a1c24] flex flex-col items-center py-4 justify-between select-none z-40 shrink-0 min-h-screen">
      {/* Top Logo */}
      <div className="flex flex-col items-center gap-6">
        <div 
          onClick={() => onNavigate('inventory')}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff5500] to-[#e63e00] flex items-center justify-center shadow-[0_0_15px_rgba(255,85,0,0.4)] cursor-pointer hover:scale-105 transition-transform"
          title="CS2 WeaponPaints"
        >
          <Flame size={24} className="text-white fill-white" />
        </div>

        {/* Navigation Icons */}
        <nav className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('inventory')}
            className={`p-2.5 rounded-xl transition-all ${
              currentView === 'inventory'
                ? 'text-[#ff5500] bg-[#ff5500]/10 shadow-[0_0_10px_rgba(255,85,0,0.2)]'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
            title="Meu Inventário"
          >
            <Box size={20} />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('add')}
            className={`p-2.5 rounded-xl transition-all relative ${
              currentView === 'add'
                ? 'text-[#ff5500] bg-[#ff5500]/10 shadow-[0_0_10px_rgba(255,85,0,0.2)]'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
            title="Adicionar / Criar Item"
          >
            <Crosshair size={20} />
            <span className="absolute -top-1 -right-1 bg-[#ff5500] text-[8px] font-extrabold text-white px-1 py-0.2 rounded-full uppercase">
              +
            </span>
          </button>

          <button
            type="button"
            className="p-2.5 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all relative"
            title="VIP & Passes"
          >
            <Crown size={20} />
            <span className="absolute -top-1 -right-1 bg-amber-500 text-[7px] font-black text-black px-1 rounded">
              NOVO
            </span>
          </button>

          <button
            type="button"
            className="p-2.5 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
            title="Servidores"
          >
            <Gamepad2 size={20} />
          </button>

          <button
            type="button"
            className="p-2.5 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
            title="Conquistas"
          >
            <Trophy size={20} />
          </button>

          <button
            type="button"
            className="p-2.5 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
            title="Recompensas"
          >
            <Gift size={20} />
          </button>
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onOpenDevLogin}
          className="p-2.5 rounded-xl text-amber-400 hover:bg-amber-400/10 transition-all"
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
          className="p-2.5 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
          title="Ajuda"
        >
          <HelpCircle size={18} />
        </button>
      </div>
    </aside>
  );
}
