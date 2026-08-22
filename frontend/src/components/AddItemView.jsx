import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  SlidersHorizontal,
  Flame,
  Shield,
  Zap,
  Radio,
  Layers,
  Target,
  Sparkles
} from 'lucide-react';
import KnifeIcon from './KnifeIcon';

export default function AddItemView({ 
  skins, 
  weapons, 
  knives, 
  gloves, 
  agents, 
  music, 
  onBack, 
  onSelectSkin 
}) {
  const [selectedSubTab, setSelectedSubTab] = useState('skins'); // skins, gloves, knives, agents, music
  const [search, setSearch] = useState('');
  const [gridMode, setGridMode] = useState('large'); // large | compact
  
  // Right sidebar filters
  const [selectedRarities, setSelectedRarities] = useState([]);
  const [selectedWeaponTypes, setSelectedWeaponTypes] = useState([]);
  
  const [isWeaponTypesOpen, setIsWeaponTypesOpen] = useState(true);
  const [isRaritiesOpen, setIsRaritiesOpen] = useState(true);

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

  // Weapon category definition matching backend
  const WEAPON_TYPES = [
    { id: 'pistols', label: 'Pistola' },
    { id: 'rifles', label: 'Rifle de Assalto' },
    { id: 'smg', label: 'Submetralhadora' },
    { id: 'shotguns', label: 'Escopeta' },
    { id: 'machine_guns', label: 'Metralhadora' },
    { id: 'sniper_rifles', label: 'Rifle de Precisão' }
  ];

  const toggleRarity = (rarityId) => {
    setSelectedRarities(prev => 
      prev.includes(rarityId) ? prev.filter(r => r !== rarityId) : [...prev, rarityId]
    );
  };

  const toggleWeaponType = (typeId) => {
    setSelectedWeaponTypes(prev => 
      prev.includes(typeId) ? prev.filter(t => t !== typeId) : [...prev, typeId]
    );
  };

  // Map weapons by weapon_name / defindex for category resolution
  const weaponCategoryMap = useMemo(() => {
    const map = {};
    weapons.forEach(w => {
      map[w.defindex] = w.category;
      map[w.weapon_name] = w.category;
    });
    return map;
  }, [weapons]);

  // Filter items based on active tab and sidebar filters
  const filteredList = useMemo(() => {
    let source = [];
    if (selectedSubTab === 'skins') {
      source = skins.filter(s => {
        // Exclude default gloves if in weapon skins tab
        return !s.weapon_name?.startsWith('gloves_');
      });
    } else if (selectedSubTab === 'knives') {
      // Return skins of knives
      const knifeDefindexes = new Set(knives.map(k => Number(k.defindex)));
      source = skins.filter(s => knifeDefindexes.has(Number(s.weapon_defindex)));
    } else if (selectedSubTab === 'gloves') {
      source = gloves.map(g => ({
        weapon_defindex: g.weapon_defindex,
        weapon_name: `gloves_${g.weapon_defindex}`,
        paint: g.paint,
        paint_name: g.paint_name || g.name,
        name: g.name,
        image: g.image,
        rarity_name: '★ Extraordinary',
        rarity_color: '#ffd700',
        isGlove: true
      }));
    } else if (selectedSubTab === 'agents') {
      source = agents.map(a => ({
        agent_id: a.agent_id,
        name: a.name,
        paint_name: a.name,
        image: a.image,
        rarity_name: a.rarity || 'Superior Agent',
        rarity_color: '#d32ce6',
        isAgent: true,
        team: a.team
      }));
    } else if (selectedSubTab === 'music') {
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

      // 3. Weapon Type Filter (Only for regular weapon skins)
      if (selectedSubTab === 'skins' && selectedWeaponTypes.length > 0) {
        const cat = weaponCategoryMap[item.weapon_defindex] || weaponCategoryMap[item.weapon_name];
        if (!cat || !selectedWeaponTypes.includes(cat)) {
          return false;
        }
      }

      return true;
    });
  }, [selectedSubTab, skins, gloves, knives, agents, music, search, selectedRarities, selectedWeaponTypes, weaponCategoryMap]);

  return (
    <div className="min-h-screen bg-[#0d0e14] text-gray-200 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-[#1c1e28] bg-[#11121a] px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-base font-bold text-white leading-tight">
              Criar Item
            </h2>
            <p className="text-xs text-gray-400">
              Passo 1 de 2 &bull; escolha a base
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="text-xs font-semibold px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 transition-all"
        >
          Cancelar
        </button>
      </header>

      {/* Sub-navigation Categories Tabs */}
      <div className="border-b border-[#1c1e28] bg-[#0f1017] px-6 py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'skins', label: 'Skins' },
            { id: 'gloves', label: 'Luvas' },
            { id: 'knives', label: 'Facas' },
            { id: 'agents', label: 'Agentes' },
            { id: 'music', label: 'Kit de música' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setSelectedSubTab(tab.id);
                setSelectedWeaponTypes([]);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedSubTab === tab.id
                  ? 'bg-white text-black shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar & Grid Controls */}
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#1c1e28]/60 bg-[#0d0e14]">
        <div className="relative w-full sm:max-w-md">
          <Search size={16} className="absolute left-3.5 top-3 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar skins, armas ou facas..."
            className="w-full bg-[#141620] border border-[#232636] pl-10 pr-4 py-2 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] transition-all"
          />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center bg-[#141620] border border-[#232636] rounded-lg p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setGridMode('large')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                gridMode === 'large' ? 'bg-[#ff5500] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Grande
            </button>
            <button
              type="button"
              onClick={() => setGridMode('compact')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                gridMode === 'compact' ? 'bg-[#ff5500] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Compacto
            </button>
          </div>

          <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
            {filteredList.length.toLocaleString('pt-BR')} itens
          </span>
        </div>
      </div>

      {/* Main Body: Skin Grid + Right Filter Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* CENTER / LEFT: Skins Grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          {filteredList.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-sm">
              Nenhum item encontrado com os filtros selecionados.
            </div>
          ) : (
            <div className={`grid gap-3.5 ${
              gridMode === 'large'
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
                : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8'
            }`}>
              {filteredList.map((item, index) => {
                const parts = (item.paint_name || item.name || '').split('|');
                const weaponTitle = parts[0]?.trim() || item.name;
                const skinTitle = parts[1]?.trim() || '';
                const rarityColor = item.rarity_color || '#d32ce6';

                return (
                  <div
                    key={`${item.weapon_defindex}_${item.paint || index}`}
                    onClick={() => onSelectSkin(item)}
                    className="group bg-[#13141b] hover:bg-[#181a24] border border-[#20222e] hover:border-[#ff5500]/60 rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 relative overflow-hidden"
                    style={{
                      borderBottomColor: rarityColor,
                      borderBottomWidth: '2.5px'
                    }}
                  >
                    {/* Skin Image */}
                    <div className="w-full h-24 flex items-center justify-center my-1">
                      <img
                        src={item.image}
                        alt={item.paint_name}
                        className="max-w-[150px] max-h-[85px] object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.target.src = 'https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_ak47.png';
                        }}
                      />
                    </div>

                    {/* Skin Text Details */}
                    <div className="mt-2 pt-2 border-t border-white/5">
                      <div className="text-xs font-black text-white truncate leading-tight group-hover:text-[#ff5500] transition-colors">
                        {weaponTitle}
                      </div>
                      <div className="text-[11px] text-gray-400 truncate mt-0.5 font-medium">
                        {skinTitle || 'Padrão'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT: Filter Sidebar */}
        <aside className="w-72 bg-[#11121a] border-l border-[#1c1e28] p-5 flex flex-col justify-between overflow-y-auto shrink-0 select-none">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#20222e]">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <SlidersHorizontal size={15} className="text-[#ff5500]" /> Filtros
              </span>
              {(selectedRarities.length > 0 || selectedWeaponTypes.length > 0 || search) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRarities([]);
                    setSelectedWeaponTypes([]);
                    setSearch('');
                  }}
                  className="text-[11px] text-[#ff5500] hover:underline"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Raridades Section */}
            <div>
              <button
                type="button"
                onClick={() => setIsRaritiesOpen(!isRaritiesOpen)}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-300 uppercase tracking-wider mb-2.5"
              >
                <span>Raridades</span>
                {isRaritiesOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {isRaritiesOpen && (
                <div className="space-y-1.5">
                  {RARITIES.map(r => {
                    const isChecked = selectedRarities.includes(r.id);
                    return (
                      <label
                        key={r.id}
                        onClick={() => toggleRarity(r.id)}
                        className="flex items-center gap-2.5 text-xs text-gray-300 hover:text-white cursor-pointer py-1 px-1.5 rounded hover:bg-white/5 transition-all"
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          isChecked ? 'bg-[#ff5500] border-[#ff5500]' : 'border-[#333647] bg-[#161822]'
                        }`}>
                          {isChecked && <Check size={11} className="text-white" strokeWidth={3} />}
                        </div>
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                        <span>{r.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Armas Section (Formatted cleanly in vertical stack without lateral scroll) */}
            {selectedSubTab === 'skins' && (
              <div>
                <button
                  type="button"
                  onClick={() => setIsWeaponTypesOpen(!isWeaponTypesOpen)}
                  className="w-full flex items-center justify-between text-xs font-bold text-gray-300 uppercase tracking-wider mb-2.5"
                >
                  <span>Armas</span>
                  {isWeaponTypesOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {isWeaponTypesOpen && (
                  <div className="space-y-1.5">
                    {WEAPON_TYPES.map(type => {
                      const isChecked = selectedWeaponTypes.includes(type.id);
                      return (
                        <label
                          key={type.id}
                          onClick={() => toggleWeaponType(type.id)}
                          className="flex items-center gap-2.5 text-xs text-gray-300 hover:text-white cursor-pointer py-1 px-1.5 rounded hover:bg-white/5 transition-all"
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                            isChecked ? 'bg-[#ff5500] border-[#ff5500]' : 'border-[#333647] bg-[#161822]'
                          }`}>
                            {isChecked && <Check size={11} className="text-white" strokeWidth={3} />}
                          </div>
                          <span>{type.label}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Action Button */}
          <div className="pt-4 mt-6 border-t border-[#20222e]">
            <button
              type="button"
              className="w-full bg-[#ff5500] hover:bg-[#e64d00] text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-[0_4px_15px_rgba(255,85,0,0.3)] transition-all cursor-pointer"
            >
              Ver {filteredList.length.toLocaleString('pt-BR')} resultados
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
