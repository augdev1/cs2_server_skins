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
  Sparkles,
  X
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
  const [selectedWeaponDefindexes, setSelectedWeaponDefindexes] = useState([]);
  
  const [isWeaponsOpen, setIsWeaponsOpen] = useState(true);
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

  // Popular quick-filter weapons
  const POPULAR_WEAPONS = [
    { defindex: 7, name: 'AK-47' },
    { defindex: 16, name: 'M4A4' },
    { defindex: 60, name: 'M4A1-S' },
    { defindex: 9, name: 'AWP' },
    { defindex: 1, name: 'Desert Eagle' },
    { defindex: 61, name: 'USP-S' },
    { defindex: 4, name: 'Glock-18' },
    { defindex: 40, name: 'SSG 08' }
  ];

  // All weapon options for sidebar
  const ALL_WEAPONS = [
    // Rifles
    { defindex: 7, name: 'AK-47', category: 'Rifles' },
    { defindex: 16, name: 'M4A4', category: 'Rifles' },
    { defindex: 60, name: 'M4A1-S', category: 'Rifles' },
    { defindex: 9, name: 'AWP', category: 'Snipers' },
    { defindex: 40, name: 'SSG 08 (Scout)', category: 'Snipers' },
    { defindex: 13, name: 'Galil AR', category: 'Rifles' },
    { defindex: 10, name: 'FAMAS', category: 'Rifles' },
    { defindex: 8, name: 'AUG', category: 'Rifles' },
    { defindex: 39, name: 'SG 553', category: 'Rifles' },
    { defindex: 38, name: 'SCAR-20', category: 'Snipers' },
    { defindex: 11, name: 'G3SG1', category: 'Snipers' },
    // Pistols
    { defindex: 1, name: 'Desert Eagle', category: 'Pistolas' },
    { defindex: 61, name: 'USP-S', category: 'Pistolas' },
    { defindex: 4, name: 'Glock-18', category: 'Pistolas' },
    { defindex: 36, name: 'P250', category: 'Pistolas' },
    { defindex: 3, name: 'Five-SeveN', category: 'Pistolas' },
    { defindex: 30, name: 'Tec-9', category: 'Pistolas' },
    { defindex: 63, name: 'CZ75-Auto', category: 'Pistolas' },
    { defindex: 2, name: 'Dual Berettas', category: 'Pistolas' },
    { defindex: 64, name: 'R8 Revolver', category: 'Pistolas' },
    { defindex: 32, name: 'P2000', category: 'Pistolas' },
    { defindex: 31, name: 'Zeus x27', category: 'Pistolas' },
    // SMGs
    { defindex: 17, name: 'MAC-10', category: 'SMGs' },
    { defindex: 34, name: 'MP9', category: 'SMGs' },
    { defindex: 19, name: 'P90', category: 'SMGs' },
    { defindex: 33, name: 'MP7', category: 'SMGs' },
    { defindex: 23, name: 'MP5-SD', category: 'SMGs' },
    { defindex: 24, name: 'UMP-45', category: 'SMGs' },
    { defindex: 26, name: 'PP-Bizon', category: 'SMGs' },
    // Heavy / Shotguns
    { defindex: 35, name: 'Nova', category: 'Espingardas' },
    { defindex: 25, name: 'XM1014', category: 'Espingardas' },
    { defindex: 27, name: 'MAG-7', category: 'Espingardas' },
    { defindex: 29, name: 'Sawed-Off', category: 'Espingardas' },
    { defindex: 28, name: 'Negev', category: 'Metralhadoras' },
    { defindex: 14, name: 'M249', category: 'Metralhadoras' }
  ];

  const toggleRarity = (rarityId) => {
    setSelectedRarities(prev => 
      prev.includes(rarityId) ? prev.filter(r => r !== rarityId) : [...prev, rarityId]
    );
  };

  const toggleWeaponDefindex = (defindex) => {
    setSelectedWeaponDefindexes(prev => 
      prev.includes(defindex) ? prev.filter(d => d !== defindex) : [...prev, defindex]
    );
  };

  // Filter items based on active tab and sidebar filters
  const filteredList = useMemo(() => {
    let source = [];
    if (selectedSubTab === 'skins') {
      source = skins.filter(s => {
        // Exclude gloves from regular skins tab
        return !s.weapon_name?.startsWith('gloves_') && !s.weapon_name?.startsWith('weapon_knife') && !s.weapon_name?.startsWith('weapon_bayonet');
      });
    } else if (selectedSubTab === 'knives') {
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

      // 3. Individual Weapon Filter
      if (selectedSubTab === 'skins' && selectedWeaponDefindexes.length > 0) {
        if (!selectedWeaponDefindexes.includes(Number(item.weapon_defindex))) {
          return false;
        }
      }

      return true;
    });
  }, [selectedSubTab, skins, gloves, knives, agents, music, search, selectedRarities, selectedWeaponDefindexes]);

  return (
    <div className="min-h-screen bg-[#09090b] text-gray-200 flex flex-col selection:bg-[#ff5500] selection:text-white">
      {/* Top Header */}
      <header className="border-b border-[#18181c] bg-[#0d0d10] px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Criar Item
            </h2>
            <p className="text-[11px] text-gray-400">
              Passo 1 de 2 &bull; escolha a skin ou arma
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#141418] border border-[#22222a] hover:bg-[#1a1a20] text-gray-300 transition-all cursor-pointer"
        >
          Cancelar
        </button>
      </header>

      {/* Sub-navigation Categories Tabs */}
      <div className="border-b border-[#18181c] bg-[#0a0a0d] px-6 py-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'skins', label: 'Skins de Armas' },
            { id: 'facas', label: 'Facas', target: 'knives' },
            { id: 'luvas', label: 'Luvas', target: 'gloves' },
            { id: 'agentes', label: 'Agentes', target: 'agents' },
            { id: 'musica', label: 'Kit de música', target: 'music' }
          ].map(tab => {
            const activeId = tab.target || tab.id;
            const isSelected = selectedSubTab === activeId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedSubTab(activeId);
                  setSelectedWeaponDefindexes([]);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar & Quick Weapon Pills */}
      <div className="px-6 py-3 border-b border-[#18181c] bg-[#09090b] flex flex-col gap-2.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search size={15} className="absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome da skin ou arma..."
              className="w-full bg-[#111114] border border-[#1e1e24] pl-9 pr-4 py-1.5 rounded-lg text-xs text-white placeholder-gray-500 outline-none focus:border-[#ff5500] transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end text-xs">
            <div className="flex items-center bg-[#111114] border border-[#1e1e24] rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setGridMode('large')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  gridMode === 'large' ? 'bg-[#ff5500] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Grande
              </button>
              <button
                type="button"
                onClick={() => setGridMode('compact')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  gridMode === 'compact' ? 'bg-[#ff5500] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Compacto
              </button>
            </div>

            <span className="text-gray-400 font-medium">
              <strong className="text-white font-bold">{filteredList.length.toLocaleString('pt-BR')}</strong> itens
            </span>
          </div>
        </div>

        {/* Quick Weapon Filter Pills (AK-47, M4A4, M4A1-S, AWP, Deagle, USP-S, Glock-18) */}
        {selectedSubTab === 'skins' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider shrink-0 mr-1">
              Filtro Rápido:
            </span>
            {POPULAR_WEAPONS.map(pw => {
              const isSelected = selectedWeaponDefindexes.includes(pw.defindex);
              return (
                <button
                  key={pw.defindex}
                  type="button"
                  onClick={() => toggleWeaponDefindex(pw.defindex)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#ff5500] text-white shadow-sm'
                      : 'bg-[#121216] text-gray-400 border border-[#1e1e24] hover:text-white hover:border-gray-500'
                  }`}
                >
                  {pw.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Body: Skin Grid + Right Filter Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* CENTER / LEFT: Skins Grid */}
        <div className="flex-1 p-5 overflow-y-auto bg-[#09090b]">
          {filteredList.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-xs">
              Nenhum item encontrado com os filtros selecionados.
            </div>
          ) : (
            <div className={`grid gap-3 ${
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
                    className="group bg-[#101014] hover:bg-[#15151a] border border-[#1d1d24] hover:border-[#ff5500]/60 rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 relative overflow-hidden"
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
                        className="max-w-[145px] max-h-[80px] object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-200"
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

        {/* RIGHT: Filter Sidebar with individual weapon filter without horizontal scrolling */}
        <aside className="w-64 bg-[#0d0d10] border-l border-[#18181c] p-4 flex flex-col justify-between overflow-y-auto shrink-0 select-none">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#1c1e24]">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                <SlidersHorizontal size={13} className="text-[#ff5500]" /> Filtros
              </span>
              {(selectedRarities.length > 0 || selectedWeaponDefindexes.length > 0 || search) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRarities([]);
                    setSelectedWeaponDefindexes([]);
                    setSearch('');
                  }}
                  className="text-[11px] text-[#ff5500] hover:underline cursor-pointer"
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
                className="w-full flex items-center justify-between text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2 cursor-pointer"
              >
                <span>Raridades</span>
                {isRaritiesOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>

              {isRaritiesOpen && (
                <div className="space-y-1">
                  {RARITIES.map(r => {
                    const isChecked = selectedRarities.includes(r.id);
                    return (
                      <label
                        key={r.id}
                        onClick={() => toggleRarity(r.id)}
                        className="flex items-center gap-2 text-xs text-gray-300 hover:text-white cursor-pointer py-0.5 px-1 rounded hover:bg-white/5 transition-all"
                      >
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                          isChecked ? 'bg-[#ff5500] border-[#ff5500]' : 'border-[#2d2d38] bg-[#121216]'
                        }`}>
                          {isChecked && <Check size={10} className="text-white" strokeWidth={3} />}
                        </div>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                        <span>{r.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Armas Section (Direct individual weapon filter without horizontal scrolling) */}
            {selectedSubTab === 'skins' && (
              <div>
                <button
                  type="button"
                  onClick={() => setIsWeaponsOpen(!isWeaponsOpen)}
                  className="w-full flex items-center justify-between text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2 cursor-pointer"
                >
                  <span>Armas ({ALL_WEAPONS.length})</span>
                  {isWeaponsOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>

                {isWeaponsOpen && (
                  <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                    {ALL_WEAPONS.map(w => {
                      const isChecked = selectedWeaponDefindexes.includes(w.defindex);
                      return (
                        <label
                          key={w.defindex}
                          onClick={() => toggleWeaponDefindex(w.defindex)}
                          className="flex items-center justify-between text-xs text-gray-300 hover:text-white cursor-pointer py-0.5 px-1 rounded hover:bg-white/5 transition-all"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-all ${
                              isChecked ? 'bg-[#ff5500] border-[#ff5500]' : 'border-[#2d2d38] bg-[#121216]'
                            }`}>
                              {isChecked && <Check size={10} className="text-white" strokeWidth={3} />}
                            </div>
                            <span className="truncate">{w.name}</span>
                          </div>
                          <span className="text-[9px] text-gray-500 uppercase">{w.category}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Action Button */}
          <div className="pt-3 mt-4 border-t border-[#1c1e24]">
            <button
              type="button"
              className="w-full bg-[#ff5500] hover:bg-[#e64d00] text-white font-bold py-2 px-3 rounded-lg text-xs shadow-sm transition-all cursor-pointer"
            >
              Ver {filteredList.length.toLocaleString('pt-BR')} resultados
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
