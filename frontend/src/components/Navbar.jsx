import React from 'react';
import { Shield, User, LogOut, Terminal, Sparkles } from 'lucide-react';
import { authService } from '../services/api';

export default function Navbar({ user, onOpenDevLogin, onLogout }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(9, 12, 16, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.85rem 2rem'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #f0b232 0%, #e87722 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(240, 178, 50, 0.35)'
          }}>
            <Shield size={24} color="#090c10" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="font-display" style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>
                CS2 <span style={{ color: 'var(--cs-gold)' }}>WEAPONPAINTS</span>
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                background: 'rgba(240, 178, 50, 0.15)',
                color: 'var(--cs-gold)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                border: '1px solid rgba(240, 178, 50, 0.3)'
              }}>
                v2.0
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Personalizador de Skins Web &bull; Sincronização em Tempo Real
            </span>
          </div>
        </div>

        {/* User Account / Login Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Profile Card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.35rem 0.85rem 0.35rem 0.45rem',
                borderRadius: '30px',
                border: '1px solid var(--border-color)'
              }}>
                <img
                  src={user.avatarfull || user.avatarmedium || 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg'}
                  alt={user.personaname}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '2px solid var(--cs-gold)'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg';
                  }}
                />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                    {user.personaname}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    ID: {user.steamid.slice(0, 4)}...{user.steamid.slice(-4)}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="btn-secondary"
                style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}
                title="Sair da conta"
              >
                <LogOut size={15} />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {/* Dev Login for local testing */}
              <button
                id="btn-dev-login"
                onClick={onOpenDevLogin}
                className="btn-secondary"
                style={{ fontSize: '0.85rem', border: '1px dashed rgba(240, 178, 50, 0.4)' }}
                title="Testar com SteamID direto (modo desenvolvimento)"
              >
                <Terminal size={15} color="var(--cs-gold)" />
                <span>Dev Login</span>
              </button>

              {/* Official Steam OpenID Button */}
              <a
                id="btn-steam-login"
                href={authService.getSteamLoginUrl()}
                className="btn-steam"
              >
                <img
                  src="https://community.cloudflare.steamstatic.com/public/images/signinthroughsteam/sits_01.png"
                  alt="Sign in through Steam"
                  style={{ height: '26px' }}
                />
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
