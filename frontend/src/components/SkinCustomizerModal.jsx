import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  Sliders, 
  Hash, 
  Tag, 
  Zap, 
  Check, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { itemsService, playerService } from '../services/api';

export default function SkinCustomizerModal({ 
  weapon, 
  team, 
  currentSkin, 
  isOpen, 
  onClose, 
  onSkinEquipped 
}) {
  const [skins, setSkins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('all');
  
  // Customization States
  const [selectedPaintId, setSelectedPaintId] = useState(currentSkin?.weapon_paint_id || 0);
  const [wear, setWear] = useState(currentSkin?.weapon_wear || 0.001);
  const [seed, setSeed] = useState(currentSkin?.weapon_seed || 0);
  const [nametag, setNametag] = useState(currentSkin?.weapon_nametag || '');
  const [stattrak, setStattrak] = useState(currentSkin?.weapon_stattrak === 1);
  const [stattrakCount, setStattrakCount] = useState(currentSkin?.weapon_stattrak_count || 0);
  
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!isOpen || !weapon) return;
    
    // Reset or initialize from equipped skin
    setSelectedPaintId(currentSkin?.weapon_paint_id || 0);
    setWear(currentSkin?.weapon_wear ?? 0.001);
    setSeed(currentSkin?.weapon_seed ?? 0);
    setNametag(currentSkin?.weapon_nametag || '');
    setStattrak(currentSkin?.weapon_stattrak === 1);
    setStattrakCount(currentSkin?.weapon_stattrak_count || 0);
    setSuccessMsg('');
    setSelectedRarity('all');

    const fetchSkins = async () => {
      setLoading(true);
      try {
        const data = await itemsService.getSkins({ defindex: weapon.defindex });
        setSkins(data);
      } catch (err) {
        console.error('Erro ao carregar skins:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkins();
  }, [isOpen, weapon, currentSkin]);

  if (!isOpen || !weapon) return null;

  const filteredSkins = skins.filter(s => {
    const matchesSearch = s.paint_name.toLowerCase().includes(search.toLowerCase());
    const matchesRarity = selectedRarity === 'all' || s.rarity_name?.toLowerCase().includes(selectedRarity.toLowerCase());
    return matchesSearch && matchesRarity;
  });


  const selectedSkinObj = skins.find(s => Number(s.paint) === Number(selectedPaintId)) || skins[0];

  const getWearLabel = (val) => {
    if (val < 0.07) return { label: 'Nova de Fábrica (FN)', color: '#4ade80' };
    if (val < 0.15) return { label: 'Pouco Usada (MW)', color: '#60a5fa' };
    if (val < 0.38) return { label: 'Testada em Campo (FT)', color: '#facc15' };
    if (val < 0.45) return { label: 'Bem Desgastada (WW)', color: '#fb923c' };
    return { label: 'Veterana de Guerra (BS)', color: '#f87171' };
  };

  const wearInfo = getWearLabel(wear);

  const handleEquipSkin = async () => {
    setSaving(true);
    setSuccessMsg('');
    try {
      const payload = {
        weapon_team: team,
        weapon_defindex: weapon.defindex,
        weapon_paint_id: Number(selectedPaintId),
        weapon_wear: parseFloat(wear),
        weapon_seed: parseInt(seed) || 0,
        weapon_nametag: nametag.trim() ? nametag.trim() : null,
        weapon_stattrak: stattrak ? 1 : 0,
        weapon_stattrak_count: parseInt(stattrakCount) || 0,
        weapon_sticker_0: '0;0;0;0;0;0;0',
        weapon_sticker_1: '0;0;0;0;0;0;0',
        weapon_sticker_2: '0;0;0;0;0;0;0',
        weapon_sticker_3: '0;0;0;0;0;0;0',
        weapon_sticker_4: '0;0;0;0;0;0;0',
        weapon_keychain: '0;0;0;0;0'
      };
      await playerService.updateSkin(payload);
      setSuccessMsg('Skin equipada e salva no servidor!');
      onSkinEquipped(payload);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error('Falha ao salvar skin:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreDefault = async () => {
    setSaving(true);
    try {
      await playerService.deleteSkin(team, weapon.defindex);
      setSuccessMsg('Arma restaurada para o padrão.');
      onSkinEquipped({ weapon_team: team, weapon_defindex: weapon.defindex, isDefault: true });
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      console.error('Falha ao restaurar padrão:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 10, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      padding: '1.5rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        maxWidth: '1100px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 20, 30, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="font-display" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              {weapon.name}
            </span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '4px',
              textTransform: 'uppercase',
              background: team === 2 ? 'rgba(232, 119, 34, 0.2)' : 'rgba(61, 120, 245, 0.2)',
              color: team === 2 ? '#ff9d42' : '#6da2ff',
              border: team === 2 ? '1px solid rgba(232, 119, 34, 0.4)' : '1px solid rgba(61, 120, 245, 0.4)'
            }}>
              {team === 2 ? 'Lado Terrorista (TR)' : 'Lado Contra-Terrorista (CT)'}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.3rem',
              borderRadius: '6px'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Body: Split into Left (Skin Catalog) and Right (Customization & Live Preview) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          flex: 1,
          overflow: 'hidden'
        }}>
          {/* LEFT: Skins Grid */}
          <div style={{
            padding: '1.5rem',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'hidden'
          }}>
            {/* Search Input */}
            <div style={{
              position: 'relative',
              marginBottom: '0.75rem'
            }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar skin por nome..."
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  padding: '0.65rem 1rem 0.65rem 2.4rem',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Rarity Filter Tabs */}
            <div style={{
              display: 'flex',
              gap: '0.35rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
              marginBottom: '0.75rem',
              scrollbarWidth: 'none'
            }}>
              {[
                { id: 'all', label: 'Todas', color: '#fff' },
                { id: 'Covert', label: '★ Covert / Gold', color: '#ffd700' },
                { id: 'Classified', label: 'Classified (Rosa)', color: '#d32ce6' },
                { id: 'Restricted', label: 'Restricted (Roxo)', color: '#8847ff' },
                { id: 'Mil-Spec', label: 'Mil-Spec (Azul)', color: '#4b69ff' }
              ].map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRarity(r.id)}
                  style={{
                    padding: '0.3rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: selectedRarity === r.id ? `1px solid ${r.color}` : '1px solid var(--border-color)',
                    background: selectedRarity === r.id ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    color: selectedRarity === r.id ? r.color : 'var(--text-muted)'
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Skins List Container */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))',
              gap: '0.75rem',
              paddingRight: '0.5rem'
            }}>
              {loading ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Carregando skins...
                </div>
              ) : filteredSkins.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Nenhuma skin encontrada para o filtro selecionado.
                </div>
              ) : (
                filteredSkins.map((s) => {
                  const isSelected = Number(s.paint) === Number(selectedPaintId);
                  const rarityColor = s.rarity_color || '#d32ce6';

                  return (
                    <div
                      key={s.paint}
                      onClick={() => setSelectedPaintId(s.paint)}
                      className="glass-panel-hover"
                      style={{
                        background: isSelected ? 'rgba(240, 178, 50, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected 
                          ? '2px solid var(--cs-gold)' 
                          : `1px solid rgba(255, 255, 255, 0.08)`,
                        borderBottom: isSelected ? '2px solid var(--cs-gold)' : `3px solid ${rarityColor}`,
                        borderRadius: '10px',
                        padding: '0.75rem 0.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                        textAlign: 'center',
                        position: 'relative'
                      }}
                    >
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          background: 'var(--cs-gold)',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Check size={12} color="#000" strokeWidth={3} />
                        </div>
                      )}

                      <img
                        src={s.image}
                        alt={s.paint_name}
                        style={{
                          width: '100px',
                          height: '65px',
                          objectFit: 'contain',
                          marginBottom: '0.4rem',
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_ak47.png';
                        }}
                      />

                      <div style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: isSelected ? 'var(--cs-gold)' : '#fff',
                        lineHeight: 1.2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {s.paint_name.replace(/.*\|/, '').trim() || s.paint_name}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem' }}>
                        <span style={{
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          color: rarityColor,
                          background: 'rgba(0,0,0,0.4)',
                          padding: '0.1rem 0.35rem',
                          borderRadius: '3px'
                        }}>
                          {s.rarity_name?.replace('★ ', '') || 'Skin'}
                        </span>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>
                          #{s.paint}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* RIGHT: Live Preview & Customizer Controls */}
          <div style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflowY: 'auto',
            background: 'rgba(10, 14, 22, 0.4)'
          }}>
            <div>
              {/* Preview Box */}
              <div style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(240, 178, 50, 0.1) 0%, rgba(12, 16, 26, 0.8) 80%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
                marginBottom: '1.25rem',
                position: 'relative'
              }}>
                {stattrak && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: '#ff6600',
                    border: '1px solid rgba(255, 102, 0, 0.4)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    background: 'rgba(255, 102, 0, 0.1)'
                  }}>
                    StatTrak™: {stattrakCount}
                  </div>
                )}

                {nametag && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#fff',
                    fontFamily: 'monospace',
                    background: 'rgba(0, 0, 0, 0.7)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    "{nametag}"
                  </div>
                )}

                <img
                  src={selectedSkinObj?.image || weapon.image}
                  alt={selectedSkinObj?.paint_name || weapon.name}
                  style={{
                    width: '100%',
                    maxHeight: '160px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 15px 25px rgba(0, 0, 0, 0.7))'
                  }}
                />

                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '0.5rem' }}>
                  {selectedSkinObj?.paint_name || weapon.name}
                </h4>
              </div>

              {/* Slider: Float / Wear */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Sliders size={14} /> Float / Desgaste
                  </label>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: wearInfo.color }}>
                    {wearInfo.label} ({parseFloat(wear).toFixed(4)})
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0001"
                  max="1.0"
                  step="0.0001"
                  value={wear}
                  onChange={(e) => setWear(e.target.value)}
                  style={{
                    width: '100%',
                    accentColor: 'var(--cs-gold)',
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* Pattern Seed */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    Pattern Seed (0 - 1000)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                {/* Nametag Input */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    Nametag (Nome Gravado)
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="Ex: Minha Skin"
                    value={nametag}
                    onChange={(e) => setNametag(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              {/* StatTrak Controls */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="stattrak-check"
                    checked={stattrak}
                    onChange={(e) => setStattrak(e.target.checked)}
                    style={{ accentColor: '#ff6600', cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                  <label htmlFor="stattrak-check" style={{ fontSize: '0.8rem', fontWeight: 700, color: stattrak ? '#ff6600' : 'var(--text-muted)', cursor: 'pointer' }}>
                    StatTrak™ Habilitado
                  </label>
                </div>

                {stattrak && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Kills:</span>
                    <input
                      type="number"
                      min="0"
                      value={stattrakCount}
                      onChange={(e) => setStattrakCount(e.target.value)}
                      style={{
                        width: '70px',
                        background: 'var(--bg-input)',
                        border: '1px solid rgba(255, 102, 0, 0.3)',
                        color: '#ff6600',
                        fontWeight: 700,
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Actions & Feedback */}
            <div>
              {successMsg && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#4ade80',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '0.75rem'
                }}>
                  <CheckCircle2 size={16} />
                  <span>{successMsg}</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={handleRestoreDefault}
                  className="btn-secondary"
                  style={{ fontSize: '0.85rem', padding: '0.65rem 1rem' }}
                  title="Restaurar skin padrão original do CS2"
                >
                  <RotateCcw size={15} />
                  <span>Padrão</span>
                </button>

                <button
                  id="btn-equip-skin"
                  type="button"
                  onClick={handleEquipSkin}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  disabled={saving}
                >
                  <Sparkles size={16} />
                  <span>{saving ? 'Equipando...' : 'Equipar Esta Skin'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
