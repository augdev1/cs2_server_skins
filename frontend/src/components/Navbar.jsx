import React from 'react';
import { Shield, User, LogOut, Terminal, Sparkles } from 'lucide-react';
import { authService } from '../services/api';

export default function Navbar({ user, onOpenDevLogin, onLogout }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-cs-bg/85 backdrop-blur-2xl px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-gold">
            <Shield size={22} className="text-cs-bg" strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg sm:text-xl font-extrabold text-white tracking-wider">
                CS2 <span className="text-cs-gold">WEAPONPAINTS</span>
              </span>
              <span className="text-[10px] font-extrabold uppercase bg-amber-500/15 text-cs-gold px-1.5 py-0.5 rounded border border-amber-500/30">
                v2.0
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">
              Personalizador de Skins &bull; Sincronização em Tempo Real
            </p>
          </div>
        </div>

        {/* User Account / Login Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Profile Card */}
              <div className="flex items-center gap-2.5 bg-white/5 pl-1.5 pr-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
                <img
                  src={user.avatarfull || user.avatarmedium || 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg'}
                  alt={user.personaname}
                  className="w-8 h-8 rounded-full border-2 border-cs-gold object-cover"
                  onError={(e) => {
                    e.target.src = 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg';
                  }}
                />
                <div>
                  <div className="text-xs font-bold text-white leading-tight">
                    {user.personaname}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    ID: {user.steamid.slice(0, 4)}...{user.steamid.slice(-4)}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40 transition-all cursor-pointer"
                title="Sair da conta"
              >
                <LogOut size={14} />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Dev Login */}
              <button
                id="btn-dev-login"
                type="button"
                onClick={onOpenDevLogin}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cs-card border border-dashed border-amber-500/40 text-xs font-bold text-cs-gold hover:bg-amber-500/10 transition-all cursor-pointer"
                title="Testar com SteamID direto (modo desenvolvimento)"
              >
                <Terminal size={14} />
                <span>Dev Login</span>
              </button>

              {/* Official Steam OpenID Button */}
              <a
                id="btn-steam-login"
                href={authService.getSteamLoginUrl()}
                className="inline-block transition-transform hover:scale-105 active:scale-95"
              >
                <img
                  src="https://community.cloudflare.steamstatic.com/public/images/signinthroughsteam/sits_01.png"
                  alt="Sign in through Steam"
                  className="h-8"
                />
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
