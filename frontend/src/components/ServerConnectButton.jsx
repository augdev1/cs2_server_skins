import React, { useState } from 'react';
import { Copy, Check, Radio, Terminal } from 'lucide-react';

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
        // Fallback for older browsers
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
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        title="Clique para copiar: connect 179.199.129.51:27015"
        className={`group relative flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-all duration-300 cursor-pointer select-none font-display text-xs tracking-wider uppercase backdrop-blur-md overflow-hidden ${
          copied
            ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
            : 'bg-[#ff2020]/15 hover:bg-[#ff2020] border-[#ff2020]/50 hover:border-[#ff2020] text-white hover:shadow-[0_0_25px_rgba(255,32,32,0.5)]'
        } ${className}`}
      >
        {/* Subtle Pulse Glow Animation */}
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${copied ? 'bg-emerald-400' : 'bg-[#ff2020]'}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${copied ? 'bg-emerald-500' : 'bg-[#ff2020] group-hover:bg-white'}`} />
        </span>

        {copied ? (
          <>
            <Check size={14} className="text-emerald-400 animate-bounce" />
            <span className="font-bold text-emerald-300">IP Copiado!</span>
          </>
        ) : (
          <>
            <Terminal size={14} className="text-[#ff2020] group-hover:text-white transition-colors" />
            <span className="font-bold">Conecte-se ao Servidor</span>
            <span className="text-[10px] text-gray-300/80 group-hover:text-white/90 font-mono lowercase bg-black/40 px-1.5 py-0.5 rounded border border-white/10 hidden sm:inline-block">
              {SERVER_IP}
            </span>
          </>
        )}
      </button>
    );
  }

  // Default / Large Variant (for bottom banner or prominent headers)
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <button
        type="button"
        onClick={handleCopy}
        title="Clique para copiar o comando de conexão para o console do CS2"
        className={`group relative flex items-center gap-3.5 px-6 py-3 rounded-2xl border transition-all duration-300 cursor-pointer select-none font-display tracking-wider uppercase backdrop-blur-xl shadow-2xl overflow-hidden active:scale-95 ${
          copied
            ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300 shadow-[0_0_35px_rgba(16,185,129,0.35)]'
            : 'bg-black/60 hover:bg-[#ff2020]/20 border-[#ff2020]/40 hover:border-[#ff2020] text-white hover:shadow-[0_0_35px_rgba(255,32,32,0.4)]'
        }`}
      >
        {/* Glow backdrop layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff2020]/10 via-transparent to-[#ff2020]/10 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Live Signal Pulse Dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${copied ? 'bg-emerald-400' : 'bg-[#ff2020]'}`} />
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${copied ? 'bg-emerald-500' : 'bg-[#ff2020]'}`} />
        </span>

        {/* Action / Text */}
        <div className="flex flex-col items-start text-left z-10">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-black text-white group-hover:text-white transition-colors">
              {copied ? 'Comando Copiado!' : 'Conecte-se ao Servidor'}
            </span>
            {copied ? (
              <Check size={16} className="text-emerald-400 animate-pulse" />
            ) : (
              <Copy size={14} className="text-[#ff2020] group-hover:translate-x-0.5 transition-transform" />
            )}
          </div>
          <span className="text-[11px] text-gray-400 group-hover:text-gray-200 font-mono tracking-normal lowercase flex items-center gap-1.5 mt-0.5">
            <span className="text-[#ff2020] font-bold">console:</span>
            <span>connect {SERVER_IP}</span>
          </span>
        </div>

        {/* Click Feedback Pill */}
        <div className="z-10 ml-2 hidden sm:flex">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
            copied
              ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
              : 'bg-[#ff2020]/20 text-[#ff2020] group-hover:bg-[#ff2020] group-hover:text-white border-[#ff2020]/40'
          }`}>
            {copied ? 'PRONTO PARA COLAR' : 'COPIAR IP'}
          </span>
        </div>
      </button>
    </div>
  );
}
