import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

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

  const isCompact = variant === 'compact';

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <button
        type="button"
        onClick={handleCopy}
        title="Clique para copiar: connect 179.199.129.51:27015"
        className={`group relative flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border transition-all duration-200 cursor-pointer select-none font-display text-[10px] sm:text-xs tracking-wider uppercase bg-[#050505] active:scale-95 shrink-0 ${
          copied
            ? 'border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
            : 'border-[#ff2020]/60 hover:border-[#ff2020] text-white hover:shadow-[0_0_15px_rgba(255,32,32,0.35)]'
        }`}
      >
        {/* Pulsing Live Dot */}
        <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${copied ? 'bg-emerald-400' : 'bg-[#ff2020]'}`} />
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 ${copied ? 'bg-emerald-500' : 'bg-[#ff2020]'}`} />
        </span>

        {/* Text */}
        <span className="font-bold whitespace-nowrap">
          {copied ? 'IP Copiado!' : 'Conecte-se ao Servidor'}
        </span>

        {/* Copy / Check Icon */}
        <div className="pl-0.5 shrink-0">
          {copied ? (
            <Check size={12} className="text-emerald-400 sm:w-3.5 sm:h-3.5" />
          ) : (
            <Copy size={11} className="text-[#ff2020] sm:w-3 sm:h-3 group-hover:scale-110 transition-transform" />
          )}
        </div>
      </button>
    </div>
  );
}
