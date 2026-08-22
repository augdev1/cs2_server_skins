import React, { useState } from 'react';
import { X, Key, UserCheck, Sparkles } from 'lucide-react';
import { authService } from '../services/api';

const SAMPLE_STEAM_IDS = [
  { id: '76561198232682580', name: 'Player Principal (Com Skins Salvas)' },
  { id: '76561198405728315', name: 'Player 2 (Com Facas)' },
  { id: '76561199004852794', name: 'Player 3 (M9 Bayonet)' }
];

export default function DevLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [steamid, setSteamid] = useState('76561198232682580');
  const [name, setName] = useState('Dev Player');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!steamid.trim()) {
      setError('Por favor insira um SteamID64.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await authService.devLogin(steamid.trim(), name.trim());
      onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao efetuar login.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSample = (sample) => {
    setSteamid(sample.id);
    setName(sample.name);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '2rem',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
        border: '1px solid rgba(240, 178, 50, 0.3)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{
            background: 'rgba(240, 178, 50, 0.15)',
            padding: '0.6rem',
            borderRadius: '10px',
            color: 'var(--cs-gold)'
          }}>
            <Key size={22} />
          </div>
          <div>
            <h3 className="font-display" style={{ fontSize: '1.15rem', color: '#fff' }}>
              MODO DESENVOLVIMENTO
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Autenticação direta via SteamID sem necessidade de redirecionar para a Valve.
            </p>
          </div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(235, 75, 75, 0.15)',
            border: '1px solid rgba(235, 75, 75, 0.4)',
            color: '#ff8585',
            padding: '0.65rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
              SteamID64 do Jogador
            </label>
            <input
              id="input-steamid"
              type="text"
              value={steamid}
              onChange={(e) => setSteamid(e.target.value)}
              placeholder="Ex: 76561198232682580"
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'monospace'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
              Nome de Exibição
            </label>
            <input
              id="input-player-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do jogador"
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Quick Select Accounts */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={13} color="var(--cs-gold)" />
              <span>Contas de teste encontradas no seu MySQL:</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {SAMPLE_STEAM_IDS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  style={{
                    background: steamid === sample.id ? 'rgba(240, 178, 50, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: steamid === sample.id ? '1px solid rgba(240, 178, 50, 0.4)' : '1px solid var(--border-color)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    color: steamid === sample.id ? 'var(--cs-gold)' : 'var(--text-main)',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{sample.name}</span>
                  <span style={{ fontFamily: 'monospace', opacity: 0.7 }}>{sample.id}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              id="btn-confirm-dev-login"
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              <UserCheck size={16} />
              <span>{loading ? 'Entrando...' : 'Entrar na Conta'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
