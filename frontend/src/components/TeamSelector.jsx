import React from 'react';
import { Flame, Shield } from 'lucide-react';

export default function TeamSelector({ team, onChangeTeam }) {
  const isT = team === 2;
  const isCT = team === 3;

  return (
    <div style={{
      display: 'inline-flex',
      background: 'rgba(12, 16, 24, 0.9)',
      padding: '0.35rem',
      borderRadius: '12px',
      border: '1px solid var(--border-color)',
      gap: '0.35rem'
    }}>
      {/* Terrorists Button */}
      <button
        id="btn-team-t"
        onClick={() => onChangeTeam(2)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.65rem 1.4rem',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: '0.9rem',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          background: isT 
            ? 'linear-gradient(135deg, #e87722 0%, #b85507 100%)' 
            : 'transparent',
          color: isT ? '#fff' : 'var(--text-muted)',
          boxShadow: isT ? '0 0 20px rgba(232, 119, 34, 0.4)' : 'none'
        }}
      >
        <Flame size={18} color={isT ? '#fff' : '#e87722'} />
        <span>TERRORISTAS (TR)</span>
      </button>

      {/* Counter-Terrorists Button */}
      <button
        id="btn-team-ct"
        onClick={() => onChangeTeam(3)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.65rem 1.4rem',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: '0.9rem',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          background: isCT 
            ? 'linear-gradient(135deg, #3d78f5 0%, #1e4bb8 100%)' 
            : 'transparent',
          color: isCT ? '#fff' : 'var(--text-muted)',
          boxShadow: isCT ? '0 0 20px rgba(61, 120, 245, 0.4)' : 'none'
        }}
      >
        <Shield size={18} color={isCT ? '#fff' : '#4b82f8'} />
        <span>CONTRA-TERRORISTAS (CT)</span>
      </button>
    </div>
  );
}
