import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

export const SERVER_IP = '179.199.129.51:27015';
export const SERVER_CONNECT_CMD = `connect ${SERVER_IP}`;

export default function ServerConnectButton({ variant = 'default', className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(SERVER_CONNECT_CMD);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = SERVER_CONNECT_CMD;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  // Compact Variant (used in Criar Item header)
  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        title="Clique para copiar: connect 179.199.129.51:27015"
        className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer select-none font-display text-[11px] tracking-wider uppercase bg-[#080808] ${
          copied
            ? 'border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            : 'border-[#ff2020]/50 hover:border-[#ff2020] text-white hover:shadow-[0_0_15px_rgba(255,32,32,0.35)]'
        } ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${copied ? 'bg-emerald-400' : 'bg-[#ff2020]'}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${copied ? 'bg-emerald-500' : 'bg-[#ff2020]'}`} />
        </span>

        {copied ? (
          <>
            <Check size={13} className="text-emerald-400" />
            <span className="font-bold text-emerald-300">IP Copiado!</span>
          </>
        ) : (
          <>
            <Terminal size={13} className="text-[#ff2020]" />
            <span className="font-bold">Conecte-se ao Servidor</span>
          </>
        )}
      </button>
    );
  }

  // Refined, Compact & 100% Solid Black Variant (for bottom banner)
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <button
        type="button"
        onClick={handleCopy}
        title="Clique para copiar o comando de conexão para o console do CS2"
        className={`group relative flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-200 cursor-pointer select-none font-display tracking-wider uppercase bg-[#050505] active:scale-98 ${
          copied
            ? 'border-emerald-500 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
            : 'border-[#ff2020]/50 hover:border-[#ff2020] text-white hover:shadow-[0_0_20px_rgba(255,32,32,0.3)]'
        }`}
      >
        {/* Pulse Dot */}
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${copied ? 'bg-emerald-400' : 'bg-[#ff2020]'}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${copied ? 'bg-emerald-500' : 'bg-[#ff2020]'}`} />
        </span>

        {/* Text / Info */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-white tracking-wide">
            {copied ? 'IP Copiado!' : 'Conecte-se ao Servidor'}
          </span>
          <span className="text-[10px] text-gray-400 font-mono lowercase bg-[#111111] px-2 py-0.5 rounded border border-[#222222]">
            connect {SERVER_IP}
          </span>
        </div>

        {/* Action Icon */}
        <div className="pl-1">
          {copied ? (
            <Check size={14} className="text-emerald-400" />
          ) : (
            <Copy size={13} className="text-[#ff2020] group-hover:scale-110 transition-transform" />
          )}
        </div>
      </button>
    </div>
  );
}
