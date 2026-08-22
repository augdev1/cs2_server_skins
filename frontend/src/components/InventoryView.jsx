import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Info, 
  X, 
  Eye, 
  Trash2, 
  Sparkles,
  SlidersHorizontal,
  Flame,
  Shield,
  Palette
} from 'lucide-react';
import TeamSelector from './TeamSelector';

export default function InventoryView({ 
  weapons, 
  knives, 
  gloves, 
  agents, 
  music, 
  team, 
  setTeam, 
  equipment, 
  skinsMap, 
  onOpenAdd, 
  onCustomizeWeapon 
}) {
  const [search, setSearch] = useState('');
  const [showNotice, setShowNotice] = useState(true);
  const [inspect3d, setInspect3d] = useState(true);
  const [fastAdd, setFastAdd] = useState(false);

  const currentTeamKey = team === 2 ? 't' : 'ct';
  const currentTeamEquipment = equipment[currentTeamKey] || { skins: {} };
  const equippedSkins = currentTeamEquipment.skins || {};

  // Build the list of active/equipped items for this team
  const inventoryItems = [];

  // 1. Equipped Knife
  const equippedKnifeName = currentTeamEquipment.knife || 'weapon_knife_butterfly';
  const knifeDefObj = knives.find(k => k.knife === equippedKnifeName) || knives[0];
  if (knifeDefObj) {
    const knifeSkin = equippedSkins[String(knifeDefObj.defindex)];
    const skinInfo = knifeSkin ? skinsMap[`${knifeDefObj.defindex}_${knifeSkin.weapon_paint_id}`] : null;
    inventoryItems.push({
      id: `knife_${knifeDefObj.defindex}`,
      type: 'knife',
      defindex: knifeDefObj.defindex,
      weapon_name: knifeDefObj.knife,
      weaponTitle: knifeDefObj.name,
      skinTitle: skinInfo?.paint_name?.split('|')[1]?.trim() || (knifeSkin ? `Paint #${knifeSkin.weapon_paint_id}` : 'Padrão'),
      image: skinInfo?.image || knifeDefObj.image,
      rarityColor: skinInfo?.rarity_color || '#ffd700',
      itemObj: knifeDefObj,
      isKnife: true
    });
  }

  // 2. Equipped Gloves
  const equippedGloveDef = currentTeamEquipment.gloves || 5030;
  const gloveSkin = equippedSkins[String(equippedGloveDef)];
  const gloveItem = gloves.find(g => Number(g.weapon_defindex) === Number(equippedGloveDef) && (!gloveSkin || String(g.paint) === String(gloveSkin.weapon_paint_id))) || gloves[0];
  if (gloveItem) {
    inventoryItems.push({
      id: `glove_${equippedGloveDef}`,
      type: 'glove',
      defindex: equippedGloveDef,
      weaponTitle: gloveItem.glove_type || '★ Gloves',
      skinTitle: gloveItem.paint_name?.split('|')[1]?.trim() || gloveItem.name,
      image: gloveItem.image,
      rarityColor: '#ffd700',
      itemObj: gloveItem,
      isGlove: true
    });
  }

  // 3. Regular Weapons with equipped skins or common weapons (AK, M4, AWP, Deagle, USP, Glock)
  weapons.forEach(w => {
    const skin = equippedSkins[String(w.defindex)];
    const hasCustom = skin && Number(skin.weapon_paint_id) > 0;
    
    // If has custom skin OR is a primary weapon, show in inventory
    if (hasCustom || ['weapon_ak47', 'weapon_m4a1_silencer', 'weapon_m4a1', 'weapon_awp', 'weapon_deagle', 'weapon_usp_silencer', 'weapon_glock'].includes(w.weapon_name)) {
      const skinInfo = hasCustom ? skinsMap[`${w.defindex}_${skin.weapon_paint_id}`] : null;
      inventoryItems.push({
        id: `weapon_${w.defindex}`,
        type: 'weapon',
        defindex: w.defindex,
        weapon_name: w.weapon_name,
        weaponTitle: w.name,
        skinTitle: skinInfo?.paint_name?.split('|')[1]?.trim() || (hasCustom ? `Paint #${skin.weapon_paint_id}` : 'Padrão'),
        image: skinInfo?.image || w.image,
        rarityColor: skinInfo?.rarity_color || (hasCustom ? '#f0b232' : 'transparent'),
        itemObj: w,
        hasCustom
      });
    }
  });

  const filteredItems = inventoryItems.filter(item => {
    const term = search.toLowerCase();
    return item.weaponTitle.toLowerCase().includes(term) || item.skinTitle.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-5">
      {/* Top Action Bar (Matching Image 1) */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 bg-[#111218] p-4 rounded-2xl border border-[#1d1f2b]">
        {/* Left Side: + Adicionar Item button & Toggles */}
        <div className="flex items-center flex-wrap gap-3">
          <button
            type="button"
            onClick={onOpenAdd}
            className="flex items-center gap-2 bg-[#ff5500] hover:bg-[#e64d00] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(255,85,0,0.35)] transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus size={16} strokeWidth={3} />
            <span>Adicionar Item</span>
          </button>

          {/* 3D Inspect Toggle */}
          <div 
            onClick={() => setInspect3d(!inspect3d)}
            className="flex items-center gap-2 bg-[#171822] border border-[#262838] px-3 py-2 rounded-xl text-xs cursor-pointer hover:border-white/20 transition-all select-none"
          >
            <span className="text-gray-300 font-semibold">Inspecionar 3D</span>
            <span className="bg-[#ff5500] text-white text-[8px] font-extrabold px-1 rounded uppercase">NOVO</span>
            <div className={`w-8 h-4 rounded-full transition-colors relative ${inspect3d ? 'bg-[#ff5500]' : 'bg-gray-700'}`}>
              <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${inspect3d ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </div>

          {/* Fast Add Toggle */}
          <div 
            onClick={() => setFastAdd(!fastAdd)}
            className="flex items-center gap-2 bg-[#171822] border border-[#262838] px-3 py-2 rounded-xl text-xs cursor-pointer hover:border-white/20 transition-all select-none"
          >
            <span className="text-gray-300 font-semibold">Adição rápida</span>
            <div className={`w-8 h-4 rounded-full transition-colors relative ${fastAdd ? 'bg-[#ff5500]' : 'bg-gray-700'}`}>
              <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${fastAdd ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </div>
        </div>

        {/* Center / Right: Team Selector & Search Input */}
        <div className="flex items-center flex-wrap gap-3 justify-end">
          <TeamSelector selectedTeam={team} onSelectTeam={setTeam} />

          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search size={15} className="absolute left-3.5 top-3 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou modelo..."
              className="w-full bg-[#171822] border border-[#262838] pl-9 pr-3 py-2 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-[#ff5500] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Secondary Action Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <button type="button" className="px-3 py-1.5 rounded-lg bg-[#14151e] border border-[#222434] hover:text-white hover:border-white/20 transition-all">
            Selecionar Itens
          </button>
          <button type="button" className="px-3 py-1.5 rounded-lg bg-[#14151e] border border-[#222434] hover:text-white hover:border-white/20 transition-all">
            Criar Coleção
          </button>
          <button type="button" className="px-3 py-1.5 rounded-lg bg-[#14151e] border border-[#222434] hover:text-white hover:border-white/20 transition-all">
            Visualizar no Servidor
          </button>
          <button type="button" className="px-3 py-1.5 rounded-lg bg-[#14151e] border border-[#222434] hover:text-red-400 hover:border-red-500/30 transition-all flex items-center gap-1">
            <Trash2 size={13} /> Limpar
          </button>
        </div>

        <div className="text-gray-500 font-medium">
          <strong className="text-gray-300 font-bold">{filteredItems.length} itens</strong> &bull; ordenado por Mais Novos
        </div>
      </div>

      {/* Chat Command Notification Banner */}
      {showNotice && (
        <div className="bg-[#14151e] border border-[#222434] px-4 py-2.5 rounded-xl flex items-center justify-between text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <Info size={15} className="text-[#ff5500] shrink-0" />
            <span>
              Para atualizar suas skins no jogo, use o comando <strong className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded">!ws</strong> no chat ou aguarde a troca de round.
            </span>
          </div>
          <button 
            type="button" 
            onClick={() => setShowNotice(false)} 
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Main Inventory Grid (6 Columns like in Image 1) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
        {filteredItems.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => onCustomizeWeapon(item.itemObj)}
              className="group bg-[#121217] hover:bg-[#181920] border border-[#1e202b] hover:border-[#ff5500]/60 rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 relative overflow-hidden"
              style={{
                borderBottomColor: item.rarityColor !== 'transparent' ? item.rarityColor : '#222434',
                borderBottomWidth: '2.5px'
              }}
            >
              {/* Top Team Indicator Dots */}
              <div className="flex justify-end gap-1 mb-1">
                <span className={`w-2 h-2 rounded-full ${team === 2 ? 'bg-orange-500' : 'bg-blue-500'}`} />
                <span className="w-2 h-2 rounded-full bg-blue-500 opacity-60" />
              </div>

              {/* Weapon / Skin Image */}
              <div className="w-full h-24 flex items-center justify-center my-1.5">
                <img
                  src={item.image}
                  alt={item.weaponTitle}
                  className="max-w-[150px] max-h-[85px] object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    e.target.src = 'https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_ak47.png';
                  }}
                />
              </div>

              {/* Title and Skin info */}
              <div className="mt-2 pt-2 border-t border-white/5">
                <div className="text-xs font-black text-white truncate leading-tight group-hover:text-[#ff5500] transition-colors">
                  {item.weaponTitle}
                </div>
                <div className="text-[11px] text-gray-400 truncate mt-0.5 font-medium">
                  {item.skinTitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
