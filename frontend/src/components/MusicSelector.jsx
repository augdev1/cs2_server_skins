import React, { useState } from 'react';
import { Music, Check } from 'lucide-react';
import { playerService } from '../services/api';

export default function MusicSelector({ 
  musicKits, 
  team, 
  equippedMusicId, 
  onMusicChanged 
}) {
  const [saving, setSaving] = useState(false);
  const musicList = Array.isArray(musicKits) ? musicKits : [];

  const handleSelectMusic = async (m) => {
    setSaving(true);
    try {
      const musicId = Number(m.id || m.music_id || 1);
      await playerService.updateMusic(team, musicId);
      onMusicChanged(musicId);
    } catch (err) {
      console.error('Erro ao salvar Music Kit:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 className="font-display" style={{ fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Music size={20} color="var(--cs-gold)" />
          <span>TRILHAS SONORAS (MUSIC KITS)</span>
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Selecione a trilha sonora oficial que tocará no MVP e nas rodadas.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        {musicList.map((m, idx) => {
          const musicId = Number(m.id || m.music_id || idx + 1);
          const isEquipped = Number(equippedMusicId) === musicId;

          return (
            <div
              key={musicId}
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
                  EQUIPADO
                </div>
              )}

              <img
                src={m.image || 'https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/music_kits/valve_csgo_01_png.png'}
                alt={m.name || 'Music Kit'}
                style={{
                  maxWidth: '120px',
                  maxHeight: '120px',
                  objectFit: 'contain',
                  margin: '1rem 0'
                }}
              />

              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: '0.75rem' }}>
                {m.name || `Music Kit #${musicId}`}
              </h4>

              <button
                type="button"
                onClick={() => handleSelectMusic(m)}
                className={isEquipped ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem' }}
                disabled={saving}
              >
                <span>{isEquipped ? 'Equipado' : 'Equipar Kit'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
