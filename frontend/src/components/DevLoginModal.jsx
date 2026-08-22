import React, { useState } from 'react';
import { X, Key, UserCheck, Sparkles, Terminal, AlertTriangle } from 'lucide-react';
import { authService } from '../services/api';

export default function DevLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [steamid, setSteamid] = useState('76561198232682580');
  const [name, setName] = useState('Dev Player');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentAuthType = localStorage.getItem('cs2_auth_type');
  const isSteamActive = currentAuthType === 'steam';

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

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in select-none">
      <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl w-full max-w-md p-6 shadow-[0_25px_60px_rgba(0,0,0,0.95)] relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#141414] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Terminal size={18} className="text-amber-400" />
            <h3 className="text-sm font-extrabold text-white uppercase font-display tracking-wider">
              Login Dev (SteamID Manual)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Steam Priority Notice */}
        {isSteamActive && (
          <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 mb-4 flex items-start gap-2.5 text-xs text-amber-200">
            <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Atenção:</strong> Você está conectado com a conta oficial da Steam. O login Dev é apenas secundário para testes.
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">
              SteamID64
            </label>
            <input
              type="text"
              value={steamid}
              onChange={(e) => setSteamid(e.target.value)}
              placeholder="76561198..."
              className="w-full bg-[#0e0e0e] border border-[#222222] px-3 py-2 rounded-xl text-xs text-white outline-none focus:border-[#ff2020] font-mono transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">
              Nome do Jogador
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Jogador 1"
              className="w-full bg-[#0e0e0e] border border-[#222222] px-3 py-2 rounded-xl text-xs text-white outline-none focus:border-[#ff2020] transition-all"
            />
          </div>

          {error && (
            <div className="text-xs text-red-400 bg-red-950/40 border border-red-500/30 p-2.5 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#222222] text-gray-400 hover:text-white hover:bg-white/5 text-xs font-semibold transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#ff2020] hover:bg-[#e01515] text-white font-bold py-2 px-4 rounded-xl text-xs shadow-[0_0_15px_rgba(255,32,32,0.4)] transition-all cursor-pointer font-display tracking-wider"
            >
              {loading ? 'Entrando...' : 'Entrar como Dev'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
