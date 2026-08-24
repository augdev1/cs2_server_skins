import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  SlidersHorizontal,
  Flame,
  Shield,
  X
} from 'lucide-react';
import KnifeIcon from './KnifeIcon';
import ServerConnectButton from './ServerConnectButton';

export default function AddItemView({ 
  skins = [], 
  weapons = [], 
  knives = [], 
  gloves = [], 
  agents = [], 
  music = [], 
  onBack, 
  onSelectSkin,
  initialSubTab = 'skins'
}) {
  const [selectedSubTab, setSelectedSubTab] = useState(initialSubTab); // skins, knives, gloves, agents, music
  const [search, setSearch] = useState('');
  const [gridMode, setGridMode] = useState('large'); // large | compact
  
  // Right sidebar filter states
  const [selectedRarities, setSelectedRarities] = useState([]);
  const [selectedWeaponDefindex, setSelectedWeaponDefindex] = useState(null); // single or multi
  const [selectedKnifeDefindex, setSelectedKnifeDefindex] = useState(null);
  const [selectedGloveType, setSelectedGloveType] = useState(null);
  const [selectedAgentTeam, setSelectedAgentTeam] = useState(null);

  const [isTypeSectionOpen, setIsTypeSectionOpen] = useState(true);
  const [isRaritiesOpen, setIsRaritiesOpen] = useState(true);

  useEffect(() => {
    if (initialSubTab) {
      setSelectedSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Rarities definition
  const RARITIES = [
    { id: 'Consumer', label: 'Consumer', color: '#b0c3d9' },
    { id: 'Industrial', label: 'Industrial', color: '#5e98d9' },
    { id: 'Mil-Spec', label: 'Mil-Spec', color: '#4b69ff' },
    { id: 'Restricted', label: 'Restricted', color: '#8847ff' },
    { id: 'Classified', label: 'Classified', color: '#d32ce6' },
    { id: 'Covert', label: 'Covert', color: '#eb4b4b' },
    { id: 'Contraband', label: 'Contraband', color: '#ffd700' }
  ];

  // List of all Knife Types
  const KNIFE_TYPES = useMemo(() => [
    { defindex: 500, name: 'Bayonet', matchStr: 'Bayonet', isBayonet: true },
    { defindex: 503, name: 'Classic Knife', matchStr: 'Classic' },
    { defindex: 505, name: 'Flip Knife', matchStr: 'Flip' },
    { defindex: 506, name: 'Gut Knife', matchStr: 'Gut' },
    { defindex: 507, name: 'Karambit', matchStr: 'Karambit' },
    { defindex: 508, name: 'M9 Bayonet', matchStr: 'M9 Bayonet' },
    { defindex: 509, name: 'Huntsman', matchStr: 'Huntsman' },
    { defindex: 512, name: 'Falchion', matchStr: 'Falchion' },
    { defindex: 514, name: 'Bowie', matchStr: 'Bowie' },
    { defindex: 515, name: 'Butterfly', matchStr: 'Butterfly' },
    { defindex: 516, name: 'Shadow Daggers', matchStr: 'Shadow Daggers' },
    { defindex: 517, name: 'Paracord', matchStr: 'Paracord' },
    { defindex: 518, name: 'Survival Knife', matchStr: 'Survival' },
    { defindex: 519, name: 'Ursus', matchStr: 'Ursus' },
    { defindex: 520, name: 'Navaja', matchStr: 'Navaja' },
    { defindex: 521, name: 'Nomad', matchStr: 'Nomad' },
    { defindex: 522, name: 'Stiletto', matchStr: 'Stiletto' },
    { defindex: 523, name: 'Talon', matchStr: 'Talon' },
    { defindex: 525, name: 'Skeleton', matchStr: 'Skeleton' },
    { defindex: 526, name: 'Kukri', matchStr: 'Kukri' }
  ], []);

  // Primary Weapons for filter pills
  const PRIMARY_WEAPONS = useMemo(() => [
    { defindex: 7, name: 'AK-47' },
    { defindex: 16, name: 'M4A4' },
    { defindex: 60, name: 'M4A1-S' },
    { defindex: 9, name: 'AWP' },
    { defindex: 1, name: 'Desert Eagle' },
    { defindex: 61, name: 'USP-S' },
    { defindex: 4, name: 'Glock-18' },
    { defindex: 40, name: 'SSG 08' },
    { defindex: 13, name: 'Galil AR' },
    { defindex: 10, name: 'FAMAS' },
    { defindex: 8, name: 'AUG' },
    { defindex: 39, name: 'SG 553' },
    { defindex: 38, name: 'SCAR-20' },
    { defindex: 11, name: 'G3SG1' },
    { defindex: 36, name: 'P250' },
    { defindex: 3, name: 'Five-SeveN' },
    { defindex: 30, name: 'Tec-9' },
    { defindex: 63, name: 'CZ75-Auto' },
    { defindex: 2, name: 'Dual Berettas' },
    { defindex: 64, name: 'R8 Revolver' },
    { defindex: 32, name: 'P2000' },
    { defindex: 17, name: 'MAC-10' },
    { defindex: 34, name: 'MP9' },
    { defindex: 19, name: 'P90' },
    { defindex: 33, name: 'MP7' },
    { defindex: 23, name: 'MP5-SD' },
    { defindex: 24, name: 'UMP-45' }
  ], []);

  // Glove Types
  const GLOVE_TYPES = useMemo(() => [
    { id: 'Sport Gloves', name: 'Sport Gloves' },
    { id: 'Driver Gloves', name: 'Driver Gloves' },
    { id: 'Specialist Gloves', name: 'Specialist Gloves' },
    { id: 'Moto Gloves', name: 'Moto Gloves' },
    { id: 'Hand Wraps', name: 'Hand Wraps' },
    { id: 'Bloodhound Gloves', name: 'Bloodhound' },
    { id: 'Hydra Gloves', name: 'Hydra' },
    { id: 'Broken Fang Gloves', name: 'Broken Fang' }
  ], []);

  // Toggle Rarity Selection
  const toggleRarity = (rarityId) => {
    setSelectedRarities(prev => 
      prev.includes(rarityId) 
        ? prev.filter(r => r !== rarityId) 
        : [...prev, rarityId]
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setSelectedWeaponDefindex(null);
    setSelectedKnifeDefindex(null);
    setSelectedGloveType(null);
    setSelectedAgentTeam(null);
    setSelectedRarities([]);
  };

  // Filter items based on active tab and sidebar filters
  const filteredList = useMemo(() => {
    let source = [];

    // 1. Skins Tab (Regular Weapons)
    if (selectedSubTab === 'skins') {
      const knifeDefindexes = new Set(KNIFE_TYPES.map(k => k.defindex));
      source = skins.filter(s => {
        const def = Number(s.weapon_defindex);
        return !knifeDefindexes.has(def) && !s.weapon_name?.startsWith('gloves_') && !s.weapon_name?.startsWith('weapon_knife');
      });

      if (selectedWeaponDefindex) {
        source = source.filter(s => Number(s.weapon_defindex) === Number(selectedWeaponDefindex));
      }
    } 
    // 2. Knives Tab
    else if (selectedSubTab === 'knives') {
      const knifeDefindexes = new Set(KNIFE_TYPES.map(k => k.defindex));
      source = skins.filter(s => {
        const def = Number(s.weapon_defindex);
        return knifeDefindexes.has(def) || s.weapon_name?.startsWith('weapon_knife') || s.weapon_name?.startsWith('weapon_bayonet');
      });

      if (selectedKnifeDefindex) {
        source = source.filter(s => Number(s.weapon_defindex) === Number(selectedKnifeDefindex));
      }
    } 
    // 3. Gloves Tab
    else if (selectedSubTab === 'gloves') {
      source = gloves.map(g => ({
        weapon_defindex: g.weapon_defindex,
        weapon_name: `gloves_${g.weapon_defindex}`,
        paint: g.paint,
        paint_name: g.paint_name || g.name,
        name: g.name,
        image: g.image,
        glove_type: g.glove_type,
        rarity_name: '★ Extraordinary',
        rarity_color: '#ffd700',
        isGlove: true
      }));

      if (selectedGloveType) {
        source = source.filter(g => g.glove_type?.toLowerCase().includes(selectedGloveType.toLowerCase()) || g.name?.toLowerCase().includes(selectedGloveType.toLowerCase()));
      }
    } 
    // 4. Agents Tab
    else if (selectedSubTab === 'agents') {
      source = agents.map(a => ({
        agent_id: a.agent_id,
        name: a.name,
        paint_name: a.name,
        image: a.image,
        model: a.model,
        rarity_name: a.rarity || 'Superior Agent',
        rarity_color: '#d32ce6',
        isAgent: true,
        team: a.team
      }));

      if (selectedAgentTeam) {
        source = source.filter(a => a.team === selectedAgentTeam);
      }
    } 
    // 5. Music Kits Tab
    else if (selectedSubTab === 'music') {
      source = music.map(m => ({
        music_id: m.music_id,
        name: m.name,
        paint_name: m.name,
        image: m.image,
        rarity_name: 'Music Kit',
        rarity_color: '#4b69ff',
        isMusic: true
      }));
    }

    return source.filter(item => {
      // 1. Search Query
      const itemName = item.paint_name || item.name || '';
      if (search && !itemName.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // 2. Rarity Filter
      if (selectedRarities.length > 0) {
        const itemRarity = item.rarity_name || '';
        const matchesRarity = selectedRarities.some(r => itemRarity.toLowerCase().includes(r.toLowerCase()));
        if (!matchesRarity) return false;
      }

      return true;
    });
  }, [selectedSubTab, skins, gloves, agents, music, search, selectedRarities, selectedWeaponDefindex, selectedKnifeDefindex, selectedGloveType, selectedAgentTeam, KNIFE_TYPES]);

  // Função para exibir nomes limpos e oficiais (sem identificadores brutos como gloves_5034)
  const getItemCategoryLabel = (item) => {
    if (item.isGlove || item.glove_type) {
      return (item.glove_type || item.name?.split('|')[0] || 'LUVAS').trim().toUpperCase();
    }
    if (item.isAgent) {
      return '★ AGENTE';
    }
    if (item.isMusic) {
      return 'KIT DE MÚSICA';
    }
    if (item.weapon_name) {
      if (item.weapon_name.startsWith('gloves_')) {
        return (item.glove_type || item.name?.split('|')[0] || 'LUVAS').trim().toUpperCase();
      }
      return item.weapon_name
        .replace('weapon_knife_', '★ ')
        .replace('weapon_bayonet', '★ BAYONET')
        .replace('weapon_', '')
        .replace('knife_', '★ ')
        .replace('_', ' ')
        .toUpperCase();
    }
    return item.rarity_name || 'ITEM';
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-200 flex flex-col selection:bg-[#ff2020] selection:text-white">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md px-3 sm:px-6 py-3 flex items-center justify-between gap-2 sticky top-0 z-30">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white leading-tight font-display tracking-wide">
              Criar Item
            </h2>
            <p className="text-[10px] sm:text-[11px] text-gray-500 font-semibold hidden sm:block">
              Passo 1 de 2 • escolha a base
            </p>
          </div>
        </div>

        {/* Centered Server IP Connect Button */}
        <div className="flex-1 flex justify-center px-1 sm:px-4 min-w-0">
          <ServerConnectButton variant="compact" />
        </div>

        <div className="shrink-0 flex justify-end">
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-gray-400 hover:text-white px-2.5 sm:px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/5 transition-all cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Central Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-transparent p-5 space-y-4 overflow-y-auto">
          {/* Top Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10">
            {[
              { id: 'skins', label: 'Skins' },
              { id: 'luvas', label: 'Luvas', tabId: 'gloves' },
              { id: 'facas', label: 'Facas', tabId: 'knives' },
              { id: 'agentes', label: 'Agentes', tabId: 'agents' },
              { id: 'musica', label: 'Kit de música', tabId: 'music' }
            ].map(tab => {
              const currentTabId = tab.tabId || tab.id;
              const isActive = selectedSubTab === currentTabId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setSelectedSubTab(currentTabId);
                    handleClearFilters();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-[#ff2020] text-white shadow-[0_0_15px_rgba(255,32,32,0.4)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search and Grid Control Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3 top-2.5 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Buscar em ${selectedSubTab}...`}
                className="w-full bg-black/50 border border-white/10 pl-9 pr-3 py-2 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-[#ff2020] transition-all"
              />
            </div>

            {/* Grid display mode toggles & count */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setGridMode('large')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    gridMode === 'large'
                      ? 'bg-[#ff2020] text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Grande
                </button>
                <button
                  type="button"
                  onClick={() => setGridMode('compact')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    gridMode === 'compact'
                      ? 'bg-[#ff2020] text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Compacto
                </button>
              </div>

              <span className="text-xs text-gray-500 font-semibold px-2">
                {filteredList.length} itens
              </span>
            </div>
          </div>

          {/* Items Grid */}
          {filteredList.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-500 text-xs">
              <p>Nenhum item encontrado com os filtros selecionados.</p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-3 text-[#ff2020] hover:underline cursor-pointer"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className={`grid gap-3.5 ${
              gridMode === 'large'
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
                : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8'
            }`}>
              {filteredList.map((item, idx) => (
                <div
                  key={`${item.weapon_defindex || item.agent_id || item.music_id}_${item.paint || idx}`}
                  onClick={() => onSelectSkin(item)}
                  className="group relative bg-black/35 hover:bg-black/55 backdrop-blur-sm border border-white/10 hover:border-[#ff2020] rounded-2xl p-3 flex flex-col items-center justify-between min-h-[175px] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(255,32,32,0.25)] select-none overflow-hidden"
                >
                  {/* Top Item Category / Model */}
                  <div className="w-full flex items-center justify-between z-10">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider truncate max-w-[80%]">
                      {getItemCategoryLabel(item)}
                    </span>
                    {item.team && (
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase font-display ${
                        item.team === 't' ? 'bg-[#ff2020]/20 text-[#ff2020] border border-[#ff2020]/40' : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      }`}>
                        {item.team.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Item Image */}
                  <div className="my-auto w-full flex items-center justify-center py-2 relative">
                    <img
                      src={item.image}
                      alt={item.paint_name || item.name}
                      className="max-h-[85px] max-w-[120px] object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.7)] group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_karambit.png';
                      }}
                    />
                  </div>

                  {/* Item Details */}
                  <div className="w-full text-center z-10 pt-1.5 border-t border-white/10">
                    <p className="text-xs font-bold text-white truncate group-hover:text-[#ff2020] transition-colors">
                      {item.paint_name || item.name}
                    </p>
                    <div className="flex items-center justify-center gap-1.5 mt-0.5">
                      <span 
                        className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{ backgroundColor: item.rarity_color || '#ff2020' }}
                      />
                      <span className="text-[9px] text-gray-500 truncate">
                        {item.rarity_name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar Filters */}
        <aside className="w-72 bg-black/45 backdrop-blur-md border-l border-white/10 p-4 flex flex-col justify-between hidden lg:flex select-none overflow-y-auto">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#141414] pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-[#ff2020]" />
                <span className="text-xs font-black uppercase text-white font-display tracking-wider">
                  Filtros
                </span>
              </div>

              {(selectedWeaponDefindex || selectedKnifeDefindex || selectedGloveType || selectedAgentTeam || selectedRarities.length > 0) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-[10px] text-[#ff2020] hover:underline font-bold cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* SubTab Specific Filters (Armas, Facas, Luvas, Agentes) */}
            <div>
              <div 
                onClick={() => setIsTypeSectionOpen(!isTypeSectionOpen)}
                className="flex items-center justify-between text-xs font-extrabold text-gray-300 uppercase font-display cursor-pointer mb-2.5"
              >
                <span>
                  {selectedSubTab === 'skins' ? 'Armas' : 
                   selectedSubTab === 'knives' ? 'Modelos de Facas' : 
                   selectedSubTab === 'gloves' ? 'Tipos de Luvas' : 
                   selectedSubTab === 'agents' ? 'Times de Agentes' : 'Categorias'}
                </span>
                {isTypeSectionOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>

              {isTypeSectionOpen && (
                <div className="flex flex-wrap gap-1.5 max-h-[300px] overflow-y-auto pr-1">
                  {/* 1. Skins Tab (Armas) */}
                  {selectedSubTab === 'skins' && PRIMARY_WEAPONS.map((wpn) => {
                    const isSelected = selectedWeaponDefindex === wpn.defindex;
                    return (
                      <button
                        key={wpn.defindex}
                        type="button"
                        onClick={() => setSelectedWeaponDefindex(isSelected ? null : wpn.defindex)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#ff2020] text-white shadow-[0_0_10px_rgba(255,32,32,0.4)]'
                            : 'bg-[#0d0d0d] text-gray-400 border border-[#1a1a1a] hover:text-white hover:border-gray-700'
                        }`}
                      >
                        <span>{wpn.name}</span>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </button>
                    );
                  })}

                  {/* 2. Knives Tab (Modelos de Facas) */}
                  {selectedSubTab === 'knives' && KNIFE_TYPES.map((knife) => {
                    const isSelected = selectedKnifeDefindex === knife.defindex;
                    return (
                      <button
                        key={knife.defindex}
                        type="button"
                        onClick={() => setSelectedKnifeDefindex(isSelected ? null : knife.defindex)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#ff2020] text-white shadow-[0_0_10px_rgba(255,32,32,0.4)]'
                            : 'bg-[#0d0d0d] text-gray-400 border border-[#1a1a1a] hover:text-white hover:border-gray-700'
                        }`}
                      >
                        <KnifeIcon knifeType={knife.name} size={14} className="opacity-80" />
                        <span>{knife.name}</span>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </button>
                    );
                  })}

                  {/* 3. Gloves Tab */}
                  {selectedSubTab === 'gloves' && GLOVE_TYPES.map((glove) => {
                    const isSelected = selectedGloveType === glove.id;
                    return (
                      <button
                        key={glove.id}
                        type="button"
                        onClick={() => setSelectedGloveType(isSelected ? null : glove.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#ff2020] text-white shadow-[0_0_10px_rgba(255,32,32,0.4)]'
                            : 'bg-[#0d0d0d] text-gray-400 border border-[#1a1a1a] hover:text-white hover:border-gray-700'
                        }`}
                      >
                        <span>{glove.name}</span>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </button>
                    );
                  })}

                  {/* 4. Agents Tab */}
                  {selectedSubTab === 'agents' && [
                    { id: 't', label: 'Terroristas (TR)', icon: Flame, color: 'text-[#ff2020]' },
                    { id: 'ct', label: 'Contra-Terroristas (CT)', icon: Shield, color: 'text-blue-400' }
                  ].map((team) => {
                    const isSelected = selectedAgentTeam === team.id;
                    const IconComp = team.icon;
                    return (
                      <button
                        key={team.id}
                        type="button"
                        onClick={() => setSelectedAgentTeam(isSelected ? null : team.id)}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#ff2020] text-white shadow-[0_0_10px_rgba(255,32,32,0.4)]'
                            : 'bg-[#0d0d0d] text-gray-400 border border-[#1a1a1a] hover:text-white hover:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <IconComp size={14} className={isSelected ? 'text-white' : team.color} />
                          <span>{team.label}</span>
                        </div>
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Rarities Filter Checklist */}
            <div>
              <div 
                onClick={() => setIsRaritiesOpen(!isRaritiesOpen)}
                className="flex items-center justify-between text-xs font-extrabold text-gray-300 uppercase font-display cursor-pointer mb-2.5"
              >
                <span>Raridades</span>
                {isRaritiesOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>

              {isRaritiesOpen && (
                <div className="space-y-1.5">
                  {RARITIES.map((rarity) => {
                    const isChecked = selectedRarities.includes(rarity.id);
                    return (
                      <div
                        key={rarity.id}
                        onClick={() => toggleRarity(rarity.id)}
                        className="flex items-center gap-2.5 py-1 px-1.5 rounded-lg hover:bg-white/5 cursor-pointer text-xs"
                      >
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                          isChecked 
                            ? 'bg-[#ff2020] border-[#ff2020]' 
                            : 'border-[#333333] bg-[#0c0c0c]'
                        }`}>
                          {isChecked && <Check size={11} strokeWidth={3} className="text-white" />}
                        </div>
                        <span 
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ backgroundColor: rarity.color }}
                        />
                        <span className={`text-xs ${isChecked ? 'text-white font-semibold' : 'text-gray-400'}`}>
                          {rarity.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-4 border-t border-[#141414]">
            <button
              type="button"
              onClick={onBack}
              className="w-full bg-[#ff2020] hover:bg-[#e01515] text-white font-extrabold py-2.5 rounded-xl text-xs shadow-[0_0_15px_rgba(255,32,32,0.4)] transition-all cursor-pointer font-display tracking-wider"
            >
              Ver {filteredList.length} resultados
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
