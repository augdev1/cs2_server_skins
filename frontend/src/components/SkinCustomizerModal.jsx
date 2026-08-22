import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Check, 
  Sparkles, 
  RotateCcw, 
  Sliders, 
  Layers, 
  Type, 
  Hash,
  Shield,
  Flame,
  Info
} from 'lucide-react';
import { itemsService, playerService } from '../services/api';

const WEAR_RANGES = [
  { label: 'Nova de Fábrica (FN)', min: 0.00, max: 0.07, color: '#4ade80' },
  { label: 'Pouco Usada (MW)', min: 0.07, max: 0.15, color: '#86efac' },
  { label: 'Testada em Campo (FT)', min: 0.15, max: 0.38, color: '#fde047' },
  { label: 'Bem Desgastada (WW)', min: 0.38, max: 0.45, color: '#fb923c' },
  { label: 'Veterana de Guerra (BS)', min: 0.45, max: 1.00, color: '#f87171' },
];

export default function SkinCustomizerModal({ 
  weapon, 
  knives = [],
  team, 
  currentSkin, 
  initialPaintId,
  isOpen, 
  onClose, 
  onSkinEquipped 
}) {
  const [activeWeapon, setActiveWeapon] = useState(weapon);
  const [allKnivesList, setAllKnivesList] = useState(knives || []);
  const [skins, setSkins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
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

  // Sincroniza facas caso não tenham sido passadas por props
  useEffect(() => {
    if (knives && knives.length > 0) {
      setAllKnivesList(knives);
    } else {
      itemsService.getKnives().then(k => {
        if (Array.isArray(k)) setAllKnivesList(k);
      });
    }
  }, [knives]);

  // Inicializa a arma/faca ativa quando o modal abre
  useEffect(() => {
    if (!isOpen || !weapon) return;
    setActiveWeapon(weapon);
    setSelectedPaintId(initialPaintId || currentSkin?.weapon_paint_id || 0);
    setWear(currentSkin?.weapon_wear ?? 0.001);
    setSeed(currentSkin?.weapon_seed ?? 0);
    setNametag(currentSkin?.weapon_nametag || '');
    setStattrak(currentSkin?.weapon_stattrak === 1);
    setStattrakCount(currentSkin?.weapon_stattrak_count || 0);
    setSelectedTeam(team || 2);
    setSuccessMsg('');
    setSearch('');
  }, [isOpen, weapon, currentSkin, initialPaintId, team]);

  // Carrega as skins da arma/faca ativa
  useEffect(() => {
    if (!isOpen || !activeWeapon) return;

    const fetchSkins = async () => {
      setLoading(true);
      try {
        const def = activeWeapon.defindex || activeWeapon.weapon_defindex;
        const data = await itemsService.getSkins({ defindex: def });
        const list = Array.isArray(data) ? data : [];
        setSkins(list);
        if (initialPaintId) {
          setSelectedPaintId(initialPaintId);
        } else if (list.length > 0 && !selectedPaintId) {
          setSelectedPaintId(list[0].paint);
        }
      } catch (err) {
        console.error('Erro ao carregar skins:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkins();
  }, [isOpen, activeWeapon]);

  if (!isOpen || !activeWeapon) return null;

  const isKnife = activeWeapon.isKnife || 
                  !!activeWeapon.knife || 
                  activeWeapon.weapon_name?.startsWith('weapon_knife') ||
                  (Number(activeWeapon.defindex) >= 500 && Number(activeWeapon.defindex) <= 526);

  const filteredSkins = skins.filter(s => {
    const pName = s.paint_name || s.name || '';
    return pName.toLowerCase().includes(search.toLowerCase());
  });

  const selectedSkinObj = skins.find(s => Number(s.paint) === Number(selectedPaintId)) || 
                          (activeWeapon.image ? activeWeapon : skins[0]);

  const getWearLabel = (val) => {
    const found = WEAR_RANGES.find(r => val >= r.min && val <= r.max);
    return found || WEAR_RANGES[0];
  };

  const wearInfo = getWearLabel(wear);

  // Troca de Faca no modal
  const handleSelectKnifeType = (knifeObj) => {
    setActiveWeapon({
      ...knifeObj,
      isKnife: true,
      weaponTitle: knifeObj.name,
      weapon_name: knifeObj.knife || knifeObj.weapon_name
    });
  };

  const handleEquipSkin = async () => {
    setSaving(true);
    setSuccessMsg('');
    try {
      const defindex = Number(activeWeapon.defindex || activeWeapon.weapon_defindex);

      // 1. Se for faca, atualiza o modelo em wp_player_knife
      if (isKnife && (activeWeapon.knife || activeWeapon.weapon_name)) {
        await playerService.updateKnife(selectedTeam, activeWeapon.knife || activeWeapon.weapon_name);
      }

      // 2. Salva a skin/pintura em wp_player_skins
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
        weapon_keychain: '0;0;0;0;0',
        knife_name: isKnife ? (activeWeapon.knife || activeWeapon.weapon_name) : null
      };

      await playerService.updateSkin(payload);
      setSuccessMsg('Skin equipada e salva com sucesso!');
      onSkinEquipped(payload);
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error('Falha ao salvar skin:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreDefault = async () => {
    setSaving(true);
    try {
      const defindex = Number(activeWeapon.defindex || activeWeapon.weapon_defindex);
      await playerService.deleteSkin(selectedTeam, defindex);
      setSuccessMsg('Arma restaurada para o padrão.');
      onSkinEquipped({ weapon_team: selectedTeam, weapon_defindex: defindex, isDefault: true });
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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#070707] border border-[#1a1a1a] rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-[#141414] bg-[#0a0a0a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-extrabold text-white font-display flex items-center gap-2">
              <span>{activeWeapon.name || activeWeapon.weaponTitle}</span>
            </h3>
            
            {/* Team Toggle */}
            <div className="flex items-center bg-[#000000] p-1 rounded-lg border border-[#1e1e1e] gap-1">
              <button
                type="button"
                onClick={() => setSelectedTeam(2)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  selectedTeam === 2 
                    ? 'bg-[#ff2020] text-white shadow-[0_0_10px_rgba(255,32,32,0.4)]' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Flame size={13} />
                <span>TR</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTeam(3)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  selectedTeam === 3 
                    ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Shield size={13} />
                <span>CT</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Skins Grid Selector & Knife Model Switcher */}
          <div className="w-full md:w-1/2 p-5 border-r border-[#141414] flex flex-col bg-[#050505] overflow-y-auto">
            {/* Search Input */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar textura ou pintura..."
                  className="w-full bg-[#0d0d0d] border border-[#1e1e1e] pl-9 pr-3 py-1.5 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-[#ff2020] transition-all"
                />
              </div>

              {/* Se for Faca: Categorias / Tipos de Facas (Karambit, Butterfly, M9, etc.) */}
              {isKnife && allKnivesList.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Escolha o Modelo da Faca:
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                    {allKnivesList.map(k => {
                      const isCurrentKnife = Number(k.defindex) === Number(activeWeapon.defindex);
                      const cleanKnifeName = k.name.replace('★', '').replace('Knife', '').trim();
                      return (
                        <button
                          key={k.defindex}
                          type="button"
                          onClick={() => handleSelectKnifeType(k)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-extrabold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                            isCurrentKnife
                              ? 'bg-[#ff2020] text-white shadow-[0_0_12px_rgba(255,32,32,0.45)] border border-[#ff2020]'
                              : 'bg-[#0d0d0d] text-gray-300 hover:text-white hover:bg-[#181818] border border-[#1f1f1f]'
                          }`}
                        >
                          <span>{cleanKnifeName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Skins Grid */}
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-xs text-gray-400">
                Carregando pinturas...
              </div>
            ) : filteredSkins.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-xs text-gray-500">
                Nenhuma pintura encontrada.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5 overflow-y-auto pr-1">
                {filteredSkins.map((s) => {
                  const isSelected = Number(selectedPaintId) === Number(s.paint);
                  return (
                    <div
                      key={s.paint}
                      onClick={() => setSelectedPaintId(s.paint)}
                      className={`relative bg-[#090909] hover:bg-[#121212] border rounded-xl p-2 flex flex-col items-center justify-between min-h-[110px] cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-[#ff2020] bg-[#ff2020]/10 shadow-[0_0_15px_rgba(255,32,32,0.3)]' 
                          : 'border-[#171717] hover:border-gray-600'
                      }`}
                    >
                      {/* Selection Badge */}
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 bg-[#ff2020] text-white p-0.5 rounded-full shadow-md">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}

                      <img
                        src={s.image || activeWeapon.image}
                        alt={s.paint_name}
                        className="max-h-[60px] max-w-[85px] object-contain my-auto drop-shadow-md"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_karambit.png';
                        }}
                      />

                      <div className="w-full text-center mt-1">
                        <p className="text-[11px] font-bold text-white truncate">
                          {s.paint_name?.split('|')[1]?.trim() || s.paint_name || 'Padrão'}
                        </p>
                        <span 
                          className="w-1.5 h-1.5 rounded-full inline-block mt-0.5"
                          style={{ backgroundColor: s.rarity_color || '#ff2020' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Live Preview & Advanced Customization */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-[#080808] overflow-y-auto">
            <div className="space-y-5">
              {/* Preview Card */}
              <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden shadow-inner min-h-[170px]">
                <img
                  src={selectedSkinObj?.image || activeWeapon.image}
                  alt="Preview"
                  className="max-h-[110px] max-w-[210px] object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.9)] animate-fade-in"
                  onError={(e) => {
                    e.target.src = 'https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_karambit.png';
                  }}
                />

                <div className="text-center mt-3">
                  <h4 className="text-xs font-bold text-white tracking-wide">
                    {selectedSkinObj?.paint_name || activeWeapon.name}
                  </h4>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-400 font-semibold">
                      {selectedSkinObj?.rarity_name || 'Item do CS2'}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      Paint ID: {selectedPaintId || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Wear (Float) Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-300">Desgaste (Float / Wear)</span>
                  <span className="font-bold text-[11px]" style={{ color: wearInfo.color }}>
                    {wearInfo.label} ({Number(wear).toFixed(4)})
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0001"
                  max="1.0000"
                  step="0.0001"
                  value={wear}
                  onChange={(e) => setWear(e.target.value)}
                  className="w-full accent-[#ff2020] bg-[#141414] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Seed & Nametag Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-1">
                    Pattern Seed (0 - 1000)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    className="w-full bg-[#0e0e0e] border border-[#222222] px-3 py-1.5 rounded-xl text-xs text-white outline-none focus:border-[#ff2020] font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-1">
                    Nametag (Nome gravado)
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    value={nametag}
                    onChange={(e) => setNametag(e.target.value)}
                    placeholder="Ex: Minha Skin"
                    className="w-full bg-[#0e0e0e] border border-[#222222] px-3 py-1.5 rounded-xl text-xs text-white outline-none focus:border-[#ff2020] transition-all"
                  />
                </div>
              </div>

              {/* StatTrak Toggle */}
              <div className="bg-[#0e0e0e] border border-[#1e1e1e] p-3 rounded-xl flex items-center justify-between">
                <label className="flex items-center gap-2.5 text-xs font-bold text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={stattrak}
                    onChange={(e) => setStattrak(e.target.checked)}
                    className="w-4 h-4 accent-[#ff2020] rounded cursor-pointer"
                  />
                  <span>Equipar StatTrak™ (Contador de Kills)</span>
                </label>

                {stattrak && (
                  <input
                    type="number"
                    min="0"
                    value={stattrakCount}
                    onChange={(e) => setStattrakCount(e.target.value)}
                    placeholder="0"
                    className="w-20 bg-[#161616] border border-[#333333] px-2 py-1 rounded-lg text-xs text-amber-400 font-mono text-center outline-none focus:border-amber-400 transition-all"
                  />
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#141414] mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRestoreDefault}
                disabled={saving}
                className="text-xs text-gray-400 hover:text-white px-3 py-2 rounded-xl border border-[#222222] hover:bg-white/5 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw size={13} />
                <span>Restaurar Padrão</span>
              </button>

              <button
                type="button"
                onClick={handleEquipSkin}
                disabled={saving}
                className="flex-1 bg-[#ff2020] hover:bg-[#e01515] text-white font-extrabold py-2.5 px-4 rounded-xl text-xs shadow-[0_0_18px_rgba(255,32,32,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 font-display tracking-wider hover:scale-[1.01] active:scale-98"
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
