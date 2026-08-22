import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { playerService } from '../services/api';

export default function GlovesSelector({ 
  gloves, 
  team, 
  equippedGlovesDefindex, 
  onGlovesChanged,
  onOpenSkinCustomizer 
}) {
  const [saving, setSaving] = useState(false);

  const handleSelectGloves = async (glove) => {
    setSaving(true);
    try {
      const defindex = glove.defindex || glove.weapon_defindex;
      await playerService.updateGloves(team, Number(defindex));
      onGlovesChanged(Number(defindex));
    } catch (err) {
      console.error('Erro ao salvar luvas:', err);
    } finally {
      setSaving(false);
    }
  };

  const gloveList = Array.isArray(gloves) ? gloves : [];

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 className="font-display" style={{ fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} color="var(--cs-gold)" />
          <span>★ LUVAS DO CS2</span>
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Selecione o modelo de luvas para equipar no seu inventário do servidor.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        {gloveList.map((g, idx) => {
          const defindex = g.defindex || g.weapon_defindex || (5030 + idx);
          const isEquipped = Number(equippedGlovesDefindex) === Number(defindex);

          return (
            <div
              key={defindex}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: isEquipped ? '2px solid var(--cs-gold)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                position: 'relative'
              }}
            >
              {isEquipped && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'var(--cs-gold)',
                  color: '#000',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '20px',
                  fontSize: '0.65rem',
                  fontWeight: 800
                }}>
                  EQUIPADA
                </div>
              )}

              <img
                src={g.image || 'https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/default_generated/weapon_gloves_sporty_light_png.png'}
                alt={g.name || 'Luvas'}
                style={{
                  maxWidth: '160px',
                  maxHeight: '100px',
                  objectFit: 'contain',
                  margin: '1rem 0'
                }}
                onError={(e) => {
                  e.target.src = 'https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/default_generated/weapon_gloves_sporty_light_png.png';
                }}
              />

              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: '0.75rem' }}>
                {g.name || g.paint_name || `Luvas (ID ${defindex})`}
              </h4>

              <button
                type="button"
                onClick={() => handleSelectGloves(g)}
                className={isEquipped ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem' }}
                disabled={saving}
              >
                <span>{isEquipped ? 'Equipada' : 'Equipar Luvas'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
