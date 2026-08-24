import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Sparkles,
  Sliders,
  UserCheck,
  Music,
  Eye
} from 'lucide-react';
import TeamSelector from './TeamSelector';
import ServerConnectButton from './ServerConnectButton';

export default function InventoryView({ 
  weapons = [], 
  knives = [], 
  gloves = [], 
  agents = [], 
  music = [], 
  team = 2, 
  setTeam, 
  equipment = {}, 
  skinsMap = {}, 
  onOpenAdd, 
  onCustomizeWeapon 
}) {
  const [search, setSearch] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  const currentTeamKey = team === 2 ? 't' : 'ct';
  const currentTeamEquipment = equipment[currentTeamKey] || { skins: {} };
  const equippedSkins = currentTeamEquipment.skins || {};

  // Build the list of active/equipped items for this team
  const inventoryItems = [];

  // 1. Equipped Knife
  const equippedKnifeName = currentTeamEquipment.knife || (team === 2 ? 'weapon_knife_t' : 'weapon_knife');
  const knifeDefObj = knives.find(k => k.knife === equippedKnifeName || k.weapon_name === equippedKnifeName) || 
                      knives.find(k => k.defindex === 507) || // Karambit fallback
                      knives[0];

  if (knifeDefObj) {
    const knifeSkin = equippedSkins[String(knifeDefObj.defindex)];
    const skinInfo = knifeSkin ? skinsMap[`${knifeDefObj.defindex}_${knifeSkin.weapon_paint_id}`] : null;
    inventoryItems.push({
      id: `knife_${knifeDefObj.defindex}`,
      type: 'knife',
      category: 'knives',
      defindex: knifeDefObj.defindex,
      weapon_name: knifeDefObj.knife || knifeDefObj.weapon_name,
      weaponTitle: knifeDefObj.name,
      skinTitle: skinInfo?.paint_name?.split('|')[1]?.trim() || (knifeSkin ? `Paint #${knifeSkin.weapon_paint_id}` : 'Padrão'),
      image: skinInfo?.image || knifeDefObj.image,
      rarityColor: skinInfo?.rarity_color || '#ffd700',
      itemObj: knifeDefObj,
      isKnife: true,
      hasCustom: !!knifeSkin
    });
  }

  // 2. Equipped Gloves
  const equippedGloveDef = currentTeamEquipment.gloves || 5030;
  const gloveSkin = equippedSkins[String(equippedGloveDef)];
  const gloveItem = gloves.find(g => Number(g.weapon_defindex) === Number(equippedGloveDef) && (!gloveSkin || String(g.paint) === String(gloveSkin.weapon_paint_id))) || 
                    gloves.find(g => Number(g.weapon_defindex) === Number(equippedGloveDef)) ||
                    gloves[0];
  if (gloveItem) {
    inventoryItems.push({
      id: `glove_${equippedGloveDef}`,
      type: 'glove',
      category: 'gloves',
      defindex: equippedGloveDef,
      weaponTitle: gloveItem.glove_type || '★ Luvas',
      skinTitle: gloveItem.paint_name?.split('|')[1]?.trim() || gloveItem.name,
      image: gloveItem.image,
      rarityColor: '#ffd700',
      itemObj: gloveItem,
      isGlove: true,
      hasCustom: !!gloveSkin
    });
  }

  // 3. Equipped Agent (Matches by exact CS2 model string, name or team)
  const equippedAgentModel = currentTeamEquipment.agent;
  const agentItem = agents.find(a => a.model === equippedAgentModel) || 
                    agents.find(a => a.name === equippedAgentModel) || 
                    agents.find(a => a.team === (team === 2 ? 't' : 'ct'));
  if (agentItem) {
    inventoryItems.push({
      id: `agent_${agentItem.agent_id || 'default'}`,
      type: 'agent',
      category: 'agents',
      defindex: 0,
      weaponTitle: '★ Agente',
      skinTitle: agentItem.name,
      image: agentItem.image,
      rarityColor: '#d32ce6',
      itemObj: agentItem,
      isAgent: true,
      hasCustom: !!equippedAgentModel
    });
  }

  // 4. Equipped Music Kit
  const equippedMusicId = currentTeamEquipment.music;
  const musicItem = music.find(m => Number(m.music_id) === Number(equippedMusicId));
  if (musicItem) {
    inventoryItems.push({
      id: `music_${musicItem.music_id}`,
      type: 'music',
      category: 'music',
      defindex: 0,
      weaponTitle: 'Kit de Música',
      skinTitle: musicItem.name,
      image: musicItem.image,
      rarityColor: '#4b69ff',
      itemObj: musicItem,
      isMusic: true,
      hasCustom: true
    });
  }

  // 5. Regular Weapons with strict team segregation (TR vs CT)
  const currentTeamStr = team === 2 ? 't' : 'ct';

  // Primary loadout weapons for each team
  const primaryWeaponNamesTR = [
    'weapon_ak47', 'weapon_galilar', 'weapon_glock', 'weapon_tec9',
    'weapon_mac10', 'weapon_sg556', 'weapon_awp', 'weapon_deagle', 'weapon_ssg08'
  ];

  const primaryWeaponNamesCT = [
    'weapon_m4a1_silencer', 'weapon_m4a1', 'weapon_famas', 'weapon_aug',
    'weapon_usp_silencer', 'weapon_mp9', 'weapon_fiveseven', 'weapon_awp', 'weapon_deagle', 'weapon_ssg08'
  ];

  const primaryWeaponNames = team === 2 ? primaryWeaponNamesTR : primaryWeaponNamesCT;

  weapons.forEach(w => {
    // Strict Team Exclusion: skip weapons of the opposing team!
    if (w.team && w.team !== 'any' && w.team !== currentTeamStr) {
      return;
    }

    const skin = equippedSkins[String(w.defindex)];
    const hasCustom = skin && Number(skin.weapon_paint_id) > 0;
    
    // Include if weapon has custom skin, or is one of primary loadout weapons for this team
    if (hasCustom || primaryWeaponNames.includes(w.weapon_name)) {
      const skinInfo = hasCustom ? skinsMap[`${w.defindex}_${skin.weapon_paint_id}`] : null;
      inventoryItems.push({
        id: `weapon_${w.defindex}`,
        type: 'weapon',
        category: w.category || 'rifles',
        defindex: w.defindex,
        weapon_name: w.weapon_name,
        weaponTitle: w.name,
        skinTitle: skinInfo?.paint_name?.split('|')[1]?.trim() || (hasCustom ? `Paint #${skin.weapon_paint_id}` : 'Padrão'),
        image: skinInfo?.image || w.image,
        rarityColor: skinInfo?.rarity_color || (hasCustom ? '#ff2020' : 'transparent'),
        itemObj: w,
        hasCustom,
        stattrak: skin?.weapon_stattrak === 1,
        stattrakCount: skin?.weapon_stattrak_count || 0
      });
    }
  });

  // Strict Category Filter
  const filteredItems = inventoryItems.filter(item => {
    // 1. Search Query
    const term = search.trim().toLowerCase();
    if (term) {
      const matchSearch = item.weaponTitle.toLowerCase().includes(term) || item.skinTitle.toLowerCase().includes(term);
      if (!matchSearch) return false;
    }

    // 2. Strict Filter Pills
    if (activeCategoryFilter === 'all') return true;
    if (activeCategoryFilter === 'knives') return item.type === 'knife';
    if (activeCategoryFilter === 'gloves') return item.type === 'glove';
    if (activeCategoryFilter === 'agents') return item.type === 'agent';
    if (activeCategoryFilter === 'custom') return item.hasCustom;
    return item.category === activeCategoryFilter;
  });

  return (
    <div className="space-y-5 bg-transparent text-white">
      {/* Top Action Bar in Translucent Glass */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 bg-black/40 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shadow-xl">
        {/* Left Side: + Adicionar Item button & Filter Pills */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onOpenAdd('skins')}
            className="flex items-center gap-2 bg-[#ff2020] hover:bg-[#e01515] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-[0_0_15px_rgba(255,32,32,0.4)] transition-all cursor-pointer hover:scale-[1.02] active:scale-95 font-display tracking-wider"
          >
            <Plus size={16} strokeWidth={3} />
            <span>Adicionar Skin</span>
          </button>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'custom', label: '★ Personalizados' },
              { id: 'knives', label: 'Facas' },
              { id: 'gloves', label: 'Luvas' },
              { id: 'agents', label: 'Agentes' },
            ].map(pill => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setActiveCategoryFilter(pill.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCategoryFilter === pill.id
                    ? 'bg-[#ff2020] text-white shadow-[0_0_10px_rgba(255,32,32,0.4)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center / Right: Team Selector & Search Input */}
        <div className="flex items-center flex-wrap gap-3 justify-end">
          <TeamSelector selectedTeam={team} onSelectTeam={setTeam} />

          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search size={15} className="absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar no inventário..."
              className="w-full bg-black/50 border border-white/10 pl-9 pr-3 py-2 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-[#ff2020] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Item Counter Bar */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-1">
        <span className="font-semibold">
          Inventário <span className="text-white font-bold">{team === 2 ? 'Terrorista (TR)' : 'Contra-Terrorista (CT)'}</span>
        </span>
        <span className="text-gray-500">
          Mostrando <strong className="text-[#ff2020]">{filteredItems.length}</strong> itens {activeCategoryFilter !== 'all' ? `em ${activeCategoryFilter}` : 'equipados'}
        </span>
      </div>

      {/* Grid of Equipped Items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (item.isAgent) {
                onOpenAdd('agents');
              } else if (item.isGlove) {
                onOpenAdd('gloves');
              } else if (item.isMusic) {
                onOpenAdd('music');
              } else {
                onCustomizeWeapon(item.itemObj);
              }
            }}
            className="group relative bg-black/35 hover:bg-black/55 backdrop-blur-sm border border-white/10 hover:border-[#ff2020] rounded-2xl p-3.5 flex flex-col items-center justify-between min-h-[210px] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,32,32,0.25)] select-none overflow-hidden"
          >
            {/* Top Bar inside Card */}
            <div className="w-full flex items-center justify-between z-10">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate max-w-[80%]">
                {item.weaponTitle}
              </span>
              
              {item.stattrak && (
                <span className="bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold text-[9px] px-1.5 py-0.5 rounded font-mono">
                  ST™ {item.stattrakCount}
                </span>
              )}
            </div>

            {/* Weapon / Skin Image */}
            <div className="my-auto w-full flex items-center justify-center py-2 relative">
              <img
                src={item.image}
                alt={item.skinTitle}
                className="max-h-[110px] max-w-[135px] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_karambit.png';
                }}
              />
            </div>

            {/* Bottom Details */}
            <div className="w-full text-center z-10 pt-2 border-t border-white/10">
              <p className="text-xs font-bold text-white truncate group-hover:text-[#ff2020] transition-colors">
                {item.skinTitle}
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <span 
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: item.rarityColor }}
                />
                <span className="text-[10px] text-gray-400">
                  {item.hasCustom ? 'Personalizada' : 'Padrão'}
                </span>
              </div>
            </div>

            {/* Hover Action Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl z-20">
              <div className="flex items-center gap-1.5 bg-[#ff2020] text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                {item.isAgent ? <UserCheck size={13} /> : item.isGlove ? <Eye size={13} /> : item.isMusic ? <Music size={13} /> : <Sliders size={13} />}
                <span>{item.isAgent ? 'Trocar Agente' : item.isGlove ? 'Trocar Luvas' : item.isMusic ? 'Trocar Música' : 'Personalizar'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Centered Server IP Connect Bar at Bottom */}
      <div className="w-full pt-8 pb-4 flex justify-center items-center">
        <ServerConnectButton />
      </div>
    </div>
  );
}
