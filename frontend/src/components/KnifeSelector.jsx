import React, { useState } from 'react';
import { Sparkles, Check, Scissors, Palette } from 'lucide-react';
import { playerService } from '../services/api';

export default function KnifeSelector({ 
  knives, 
  team, 
  equippedKnifeModel, 
  equippedSkins, 
  onKnifeChanged,
  onOpenSkinCustomizer 
}) {
  const [saving, setSaving] = useState(false);

  const handleSelectKnifeModel = async (knifeObj, e) => {
    if (e) e.stopPropagation();
    setSaving(true);
    try {
      await playerService.updateKnife(team, knifeObj.knife);
      onKnifeChanged(knifeObj.knife);
    } catch (err) {
      console.error('Erro ao equipar faca:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div>
          <h3 className="font-display" style={{ fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Scissors size={20} color="var(--cs-gold)" />
            <span>★ FACAS DO COUNTER-STRIKE 2</span>
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Clique em qualquer faca para ver todas as skins disponíveis (Doppler, Fade, Crimson Web) ou equipe o modelo.
          </p>
        </div>
      </div>

      {/* Knives Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1.25rem'
      }}>
        {knives.map((k) => {
          const isEquipped = equippedKnifeModel === k.knife;
          const knifeSkin = equippedSkins?.[String(k.defindex)];
          const hasCustomSkin = !!knifeSkin && Number(knifeSkin.weapon_paint_id) > 0;

          return (
            <div
              key={k.defindex}
              onClick={() => onOpenSkinCustomizer(k)}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '1.25rem',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                cursor: 'pointer',
                border: isEquipped 
                  ? '2px solid var(--cs-gold)' 
                  : (hasCustomSkin ? '1px solid rgba(240, 178, 50, 0.4)' : '1px solid var(--border-color)'),
                background: isEquipped 
                  ? 'linear-gradient(180deg, rgba(240, 178, 50, 0.12) 0%, rgba(18, 24, 38, 0.85) 100%)' 
                  : 'var(--bg-card)'
              }}
            >
              {/* Top status */}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--cs-gold)', textTransform: 'uppercase' }}>
                  ★ FACA
                </span>

                {isEquipped && (
                  <span style={{
                    background: 'var(--cs-gold)',
                    color: '#000',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '20px',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <Check size={11} strokeWidth={3} /> MODELO ATIVO
                  </span>
                )}
              </div>

              {/* Knife Image */}
              <div style={{
                height: '110px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}>
                <img
                  src={k.image}
                  alt={k.name}
                  style={{
                    maxWidth: '190px',
                    maxHeight: '95px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.6))'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_butterfly.png';
                  }}
                />
              </div>

              {/* Knife Name */}
              <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                  {k.name}
                </h4>
                <span style={{ fontSize: '0.75rem', color: hasCustomSkin ? 'var(--cs-gold)' : 'var(--text-muted)', fontWeight: hasCustomSkin ? 700 : 400 }}>
                  {hasCustomSkin ? `Paint ID: ${knifeSkin.weapon_paint_id}` : `${k.skins_count || 35} skins disponíveis`}
                </span>
              </div>

              {/* Actions: Equip Model OR Customize Skin */}
              <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={(e) => handleSelectKnifeModel(k, e)}
                  className={isEquipped ? 'btn-primary' : 'btn-secondary'}
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem' }}
                  disabled={saving}
                >
                  <span>{isEquipped ? 'Equipada' : 'Usar Esta Faca'}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenSkinCustomizer(k);
                  }}
                  className="btn-secondary"
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.8rem',
                    borderColor: 'rgba(240, 178, 50, 0.4)',
                    color: 'var(--cs-gold)'
                  }}
                  title="Personalizar Pintura/Skin da Faca"
                >
                  <Palette size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

