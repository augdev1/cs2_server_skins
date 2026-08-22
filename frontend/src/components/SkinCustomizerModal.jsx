import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Search, 
  Check, 
  RotateCcw, 
  Tag, 
  Sliders, 
  Activity, 
  ShieldAlert,
  Flame,
  Shield
} from 'lucide-react';
import { itemsService, playerService } from '../services/api';

export default function SkinCustomizerModal({ 
  weapon, 
  team, 
  currentSkin, 
  initialPaintId,
  isOpen, 
  onClose, 
  onSkinEquipped 
}) {
  const [skins, setSkins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('all');
  
  // Customization States
  const [selectedPaintId, setSelectedPaintId] = useState(initialPaintId || currentSkin?.weapon_paint_id || 0);
  const [wear, setWear] = useState(currentSkin?.weapon_wear || 0.001);
  const [seed, setSeed] = useState(currentSkin?.weapon_seed || 0);
  const [nametag, setNametag] = useState(currentSkin?.weapon_nametag || '');
  const [stattrak, setStattrak] = useState(currentSkin?.weapon_stattrak === 1);
  const [stattrakCount, setStattrakCount] = useState(currentSkin?.weapon_stattrak_count || 0);
  const [selectedTeam, setSelectedTeam] = useState(team || 2);
  
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!isOpen || !weapon) return;
    
    setSelectedPaintId(initialPaintId || currentSkin?.weapon_paint_id || 0);
    setWear(currentSkin?.weapon_wear ?? 0.001);
    setSeed(currentSkin?.weapon_seed ?? 0);
    setNametag(currentSkin?.weapon_nametag || '');
    setStattrak(currentSkin?.weapon_stattrak === 1);
    setStattrakCount(currentSkin?.weapon_stattrak_count || 0);
    setSelectedTeam(team || 2);
    setSuccessMsg('');
    setSelectedRarity('all');

    const fetchSkins = async () => {
      setLoading(true);
      try {
        const data = await itemsService.getSkins({ defindex: weapon.defindex });
        setSkins(data);
        if (initialPaintId) {
          setSelectedPaintId(initialPaintId);
        }
      } catch (err) {
        console.error('Erro ao carregar skins:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkins();
  }, [isOpen, weapon, currentSkin, initialPaintId, team]);

  if (!isOpen || !weapon) return null;

  const filteredSkins = skins.filter(s => {
    const matchesSearch = s.paint_name.toLowerCase().includes(search.toLowerCase());
    const matchesRarity = selectedRarity === 'all' || s.rarity_name?.toLowerCase().includes(selectedRarity.toLowerCase());
    return matchesSearch && matchesRarity;
  });

  const selectedSkinObj = skins.find(s => Number(s.paint) === Number(selectedPaintId)) || skins[0];

  const getWearLabel = (w) => {
    const val = parseFloat(w);
    if (val < 0.07) return { label: 'Nova de Fábrica (FN)', color: '#22c55e' };
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
      const defindex = Number(weapon.defindex || weapon.weapon_defindex);
      const isGlove = weapon.isGlove || weapon.weapon_name?.startsWith('gloves_') || (defindex >= 5027 && defindex <= 5035);
      const isKnife = weapon.isKnife || !!weapon.knife || (defindex >= 500 && defindex <= 526);

      // 1. Se for faca, atualiza o modelo em wp_player_knife
      if (isKnife && weapon.knife) {
        await playerService.updateKnife(selectedTeam, weapon.knife);
      }

      // 2. Se for luva, atualiza o modelo em wp_player_gloves
      if (isGlove) {
        await playerService.updateGloves(selectedTeam, defindex);
      }

      // 3. Salva a skin/pintura em wp_player_skins
      const payload = {
        weapon_team: selectedTeam,
        weapon_defindex: defindex,
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
      setSuccessMsg('Skin equipada e salva com sucesso!');
      onSkinEquipped(payload);
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      console.error('Falha ao salvar skin:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreDefault = async () => {
    setSaving(true);
    try {
      await playerService.deleteSkin(selectedTeam, weapon.defindex);
      setSuccessMsg('Arma restaurada para o padrão.');
      onSkinEquipped({ weapon_team: selectedTeam, weapon_defindex: weapon.defindex, isDefault: true });
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error('Falha ao restaurar padrão:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#101118] border border-[#20222f] rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1c1e28] bg-[#14151f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-extrabold text-white font-display">
              {weapon.name || weapon.weaponTitle}
            </h3>
            
            {/* Team Toggle */}
            <div className="flex items-center bg-[#0c0d12] p-1 rounded-xl border border-white/10 gap-1">
              <button
                type="button"
                onClick={() => setSelectedTeam(2)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedTeam === 2 ? 'bg-[#ff5500] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Flame size={13} /> TR
              </button>
              <button
                type="button"
                onClick={() => setSelectedTeam(3)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedTeam === 3 ? 'bg-[#3d78f5] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Shield size={13} /> CT
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Grid: Left (Skins Catalog) + Right (Preview & Settings) */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* LEFT: Skins Grid (5 cols) */}
          <div className="md:col-span-6 border-r border-[#1c1e28] p-5 flex flex-col overflow-hidden bg-[#0d0e14]">
            {/* Search Input */}
            <div className="relative mb-3">
              <Search size={15} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar textura ou pintura..."
                className="w-full bg-[#141620] border border-[#232636] pl-9 pr-3 py-2 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-[#ff5500] transition-all"
              />
            </div>

            {/* Rarity Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
              {[
                { id: 'all', label: 'Todas' },
                { id: 'Covert', label: '★ Covert' },
                { id: 'Classified', label: 'Classified' },
                { id: 'Restricted', label: 'Restricted' },
                { id: 'Mil-Spec', label: 'Mil-Spec' }
              ].map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRarity(r.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    selectedRarity === r.id
                      ? 'bg-white/15 text-white border border-white/30'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Skins List Container */}
            <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-2.5 pr-1">
              {loading ? (
                <div className="col-span-3 text-center py-12 text-gray-500 text-xs">
                  Carregando catálogo de skins...
                </div>
              ) : filteredSkins.length === 0 ? (
                <div className="col-span-3 text-center py-12 text-gray-500 text-xs">
                  Nenhuma skin encontrada para o filtro.
                </div>
              ) : (
                filteredSkins.map((s) => {
                  const isSelected = Number(s.paint) === Number(selectedPaintId);
                  const rarityColor = s.rarity_color || '#d32ce6';

                  return (
                    <div
                      key={s.paint}
                      onClick={() => setSelectedPaintId(s.paint)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-between cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-[#ff5500]/15 border-[#ff5500] shadow-[0_0_12px_rgba(255,85,0,0.3)]' 
                          : 'bg-[#141620] border-[#222534] hover:border-white/20'
                      }`}
                      style={{
                        borderBottomColor: isSelected ? '#ff5500' : rarityColor,
                        borderBottomWidth: '2.5px'
                      }}
                    >
                      <img
                        src={s.image}
                        alt={s.paint_name}
                        className="w-20 h-14 object-contain drop-shadow my-1"
                        onError={(e) => {
                          e.target.src = 'https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_ak47.png';
                        }}
                      />
                      <span className="text-[11px] font-bold text-white text-center line-clamp-1 leading-tight">
                        {s.paint_name.replace(/.*\|/, '').trim() || s.paint_name}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT: Live Preview & Settings (7 cols) */}
          <div className="md:col-span-6 p-6 flex flex-col justify-between overflow-y-auto bg-[#101118]">
            {/* Live Preview Display */}
            <div>
              <div className="w-full bg-gradient-to-b from-[#171924] to-[#12131b] border border-[#232638] rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden mb-6">
                <img
                  src={selectedSkinObj?.image || weapon.image}
                  alt="Preview"
                  className="max-w-[260px] max-h-[140px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
                />

                <div className="text-center mt-3">
                  <h4 className="text-base font-extrabold text-white">
                    {selectedSkinObj?.paint_name || weapon.name}
                  </h4>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span 
                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/50"
                      style={{ color: selectedSkinObj?.rarity_color || '#ff5500' }}
                    >
                      {selectedSkinObj?.rarity_name?.replace('★ ', '') || 'Covert'}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      Paint ID: {selectedPaintId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customizer Controls: Wear Slider, Seed, StatTrak, Nametag */}
              <div className="space-y-4">
                {/* Wear / Float Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-gray-300">Desgaste (Float / Wear)</span>
                    <span className="font-bold text-xs" style={{ color: wearInfo.color }}>
                      {wearInfo.label} ({Number(wear).toFixed(4)})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.0001"
                    max="1.0000"
                    step="0.001"
                    value={wear}
                    onChange={(e) => setWear(e.target.value)}
                    className="w-full accent-[#ff5500] cursor-pointer"
                  />
                </div>

                {/* Seed & Nametag Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">
                      Pattern Seed (0 - 1000)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={seed}
                      onChange={(e) => setSeed(e.target.value)}
                      className="w-full bg-[#161824] border border-[#26293c] px-3 py-2 rounded-xl text-xs text-white outline-none focus:border-[#ff5500]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">
                      Nametag (Nome gravado)
                    </label>
                    <input
                      type="text"
                      maxLength={20}
                      value={nametag}
                      onChange={(e) => setNametag(e.target.value)}
                      placeholder="Ex: Minha Skin"
                      className="w-full bg-[#161824] border border-[#26293c] px-3 py-2 rounded-xl text-xs text-white outline-none focus:border-[#ff5500]"
                    />
                  </div>
                </div>

                {/* StatTrak Row */}
                <div className="flex items-center justify-between p-3 bg-[#161824] border border-[#26293c] rounded-xl">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="stattrak-check"
                      checked={stattrak}
                      onChange={(e) => setStattrak(e.target.checked)}
                      className="w-4 h-4 accent-[#ff5500] rounded cursor-pointer"
                    />
                    <label htmlFor="stattrak-check" className="text-xs font-bold text-orange-400 cursor-pointer">
                      Equipar StatTrak™ (Contador de Kills)
                    </label>
                  </div>

                  {stattrak && (
                    <input
                      type="number"
                      min="0"
                      value={stattrakCount}
                      onChange={(e) => setStattrakCount(e.target.value)}
                      className="w-24 bg-[#0d0e14] border border-[#26293c] px-2 py-1 rounded-lg text-xs text-white text-right font-mono"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-6 border-t border-[#1c1e28] flex items-center gap-3">
              <button
                type="button"
                onClick={handleRestoreDefault}
                disabled={saving}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <RotateCcw size={14} /> Restaurar Padrão
              </button>

              <button
                type="button"
                onClick={handleEquipSkin}
                disabled={saving}
                className="flex-1 bg-[#ff5500] hover:bg-[#e64d00] text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-[0_4px_20px_rgba(255,85,0,0.35)] transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <Check size={16} strokeWidth={3} />
                <span>{saving ? 'Salvando...' : 'Salvar e Equipar Skin'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
