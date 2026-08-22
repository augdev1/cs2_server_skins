import React from 'react';
import { Sparkles, Edit3 } from 'lucide-react';

export default function WeaponCard({ weapon, equippedSkin, onCustomize }) {
  const hasCustomSkin = !!equippedSkin && Number(equippedSkin.weapon_paint_id) > 0;

  return (
    <div
      onClick={onCustomize}
      className="glass-panel glass-panel-hover"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        position: 'relative',
        minHeight: '220px',
        border: hasCustomSkin ? '1px solid rgba(240, 178, 50, 0.4)' : '1px solid var(--border-color)',
        background: hasCustomSkin 
          ? 'linear-gradient(180deg, rgba(240, 178, 50, 0.08) 0%, rgba(18, 24, 38, 0.75) 100%)' 
          : 'var(--bg-card)'
      }}
    >
      {/* Top badges */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem'
      }}>
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          color: 'var(--text-muted)'
        }}>
          {weapon.category}
        </span>

        {hasCustomSkin ? (
          <span style={{
            fontSize: '0.65rem',
            fontWeight: 800,
            background: 'rgba(240, 178, 50, 0.2)',
            color: 'var(--cs-gold)',
            padding: '0.15rem 0.5rem',
            borderRadius: '4px',
            border: '1px solid rgba(240, 178, 50, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Sparkles size={11} /> Equipado
          </span>
        ) : (
          <span style={{
            fontSize: '0.65rem',
            color: 'var(--text-dim)'
          }}>
            Padrão
          </span>
        )}
      </div>

      {/* Weapon Image */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem 0',
        width: '100%'
      }}>
        <img
          src={weapon.image}
          alt={weapon.name}
          style={{
            maxWidth: '180px',
            maxHeight: '90px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5))',
            transition: 'transform 0.25s ease'
          }}
          onError={(e) => {
            e.target.src = 'https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_ak47.png';
          }}
        />
      </div>

      {/* Weapon & Skin Title */}
      <div style={{ width: '100%', textAlign: 'center', marginTop: '0.5rem' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginBottom: '0.2rem' }}>
          {weapon.name}
        </h4>
        <div style={{
          fontSize: '0.75rem',
          color: hasCustomSkin ? 'var(--cs-gold)' : 'var(--text-muted)',
          fontWeight: hasCustomSkin ? 700 : 400
        }}>
          {hasCustomSkin ? `Paint ID: ${equippedSkin.weapon_paint_id}` : 'Sem skin customizada'}
        </div>
      </div>

      {/* Hover action overlay indicator */}
      <div style={{
        marginTop: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        opacity: 0.8
      }}>
        <Edit3 size={13} />
        <span>Clique para personalizar</span>
      </div>
    </div>
  );
}
