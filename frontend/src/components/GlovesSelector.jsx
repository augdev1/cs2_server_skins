import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { playerService } from '../services/api';

export default function GlovesSelector({ 
  gloves, 
  team, 
  equippedGlovesDefindex, 
  equippedSkins,
  onGlovesChanged,
  onOpenSkinCustomizer 
}) {
  const [saving, setSaving] = useState(false);
  const [selectedType, setSelectedType] = useState('all');

  const handleSelectGloves = async (glove) => {
    setSaving(true);
    try {
      const defindex = Number(glove.weapon_defindex || glove.defindex);
      const paintId = Number(glove.paint || 0);

      // 1. Atualiza o modelo da luva em wp_player_gloves
      await playerService.updateGloves(team, defindex);

      // 2. Se a luva tiver uma skin/pintura específica, salva em wp_player_skins também
      if (paintId > 0) {
        await playerService.updateSkin({
          weapon_team: team,
          weapon_defindex: defindex,
          weapon_paint_id: paintId,
          weapon_wear: 0.001,
          weapon_seed: 0
        });
      }

      onGlovesChanged(defindex);
    } catch (err) {
      console.error('Erro ao salvar luvas:', err);
    } finally {
      setSaving(false);
    }
  };

  const gloveList = Array.isArray(gloves) ? gloves : [];
  
  // Categorias de tipos de luvas para filtro
  const gloveTypes = ['all', '★ Sport Gloves', '★ Driver Gloves', '★ Hand Wraps', '★ Moto Gloves', '★ Specialist Gloves', '★ Hydra Gloves', '★ Bloodhound Gloves', '★ Broken Fang Gloves'];

  const filteredGloves = selectedType === 'all' 
    ? gloveList 
    : gloveList.filter(g => (g.glove_type || g.name || '').includes(selectedType.replace('★ ', '')));


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

      {/* Filter Tabs by Glove Family */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.75rem',
        marginBottom: '1.25rem',
        scrollbarWidth: 'none'
      }}>
        {gloveTypes.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setSelectedType(type)}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              border: selectedType === type ? '1px solid var(--cs-gold)' : '1px solid var(--border-color)',
              background: selectedType === type ? 'rgba(240, 178, 50, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              color: selectedType === type ? 'var(--cs-gold)' : 'var(--text-muted)'
            }}
          >
            {type === 'all' ? '★ Todas as Luvas' : type}
          </button>
        ))}
      </div>

      {/* Gloves Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        {filteredGloves.map((g) => {
          const defindex = Number(g.weapon_defindex || g.defindex);
          const paintId = Number(g.paint || 0);
          const currentEquippedSkin = equippedSkins?.[String(defindex)];
          
          const isModelEquipped = Number(equippedGlovesDefindex) === defindex;
          const isSkinEquipped = isModelEquipped && (
            paintId === 0 || Number(currentEquippedSkin?.weapon_paint_id) === paintId
          );

          return (
            <div
              key={`${defindex}_${paintId}`}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: isSkinEquipped ? '2px solid var(--cs-gold)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                position: 'relative',
                background: isSkinEquipped 
                  ? 'linear-gradient(180deg, rgba(240, 178, 50, 0.12) 0%, rgba(18, 24, 38, 0.85) 100%)' 
                  : 'var(--bg-card)'
              }}
            >
              {isSkinEquipped && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'var(--cs-gold)',
                  color: '#000',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '20px',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}>
                  <Check size={11} strokeWidth={3} /> EQUIPADA
                </div>
              )}

              <img
                src={g.image || 'https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_butterfly.png'}
                alt={g.name || 'Luvas'}
                style={{
                  maxWidth: '170px',
                  maxHeight: '110px',
                  objectFit: 'contain',
                  margin: '0.75rem 0',
                  filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.6))'
                }}
                onError={(e) => {
                  e.target.src = 'https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_butterfly.png';
                }}
              />

              <div style={{ textAlign: 'center', width: '100%', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                  {g.name || g.paint_name || `Luvas (${defindex})`}
                </h4>
                <span style={{ fontSize: '0.7rem', color: 'var(--cs-gold)', fontWeight: 600 }}>
                  {g.glove_type || '★ Luvas'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleSelectGloves(g)}
                className={isSkinEquipped ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem' }}
                disabled={saving}
              >
                <span>{isSkinEquipped ? 'Equipada' : 'Equipar Esta Luva'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

