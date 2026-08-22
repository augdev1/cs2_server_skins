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
  const [selectedSubTab, setSelectedSubTab] = useState('skins'); // skins, knives, gloves, agents, music
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
    { defindex: 500, label: 'Bayonet' },
    { defindex: 514, label: 'Bowie' },
    { defindex: 515, label: 'Butterfly' },
    { defindex: 503, label: 'Classic' },
    { defindex: 512, label: 'Falchion' },
    { defindex: 505, label: 'Flip' },
    { defindex: 506, label: 'Gut' },
    { defindex: 509, label: 'Huntsman' },
    { defindex: 507, label: 'Karambit' },
    { defindex: 508, label: 'M9 Bayonet' },
    { defindex: 520, label: 'Navaja' },
    { defindex: 521, label: 'Nomad' },
    { defindex: 517, label: 'Paracord' },
    { defindex: 516, label: 'Shadow Daggers' },
    { defindex: 525, label: 'Skeleton' },
    { defindex: 522, label: 'Stiletto' },
    { defindex: 518, label: 'Survival' },
    { defindex: 523, label: 'Talon' },
    { defindex: 519, label: 'Ursus' },
    { defindex: 526, label: 'Kukri' }
  ], []);

  // List of all Glove Types
  const GLOVE_TYPES = useMemo(() => [
    { type: 'Sport Gloves', label: 'Sport Gloves' },
    { type: 'Driver Gloves', label: 'Driver Gloves' },
    { type: 'Specialist Gloves', label: 'Specialist Gloves' },
    { type: 'Moto Gloves', label: 'Moto Gloves' },
    { type: 'Hand Wraps', label: 'Hand Wraps' },
    { type: 'Bloodhound Gloves', label: 'Bloodhound' },
    { type: 'Hydra Gloves', label: 'Hydra' },
    { type: 'Broken Fang Gloves', label: 'Broken Fang' }
  ], []);

  // List of all Weapons
  const WEAPON_OPTIONS = useMemo(() => [
    { defindex: 7, label: 'AK-47' },
    { defindex: 16, label: 'M4A4' },
    { defindex: 60, label: 'M4A1-S' },
    { defindex: 9, label: 'AWP' },
    { defindex: 1, label: 'Desert Eagle' },
    { defindex: 61, label: 'USP-S' },
    { defindex: 4, label: 'Glock-18' },
    { defindex: 40, label: 'SSG 08' },
    { defindex: 13, label: 'Galil AR' },
    { defindex: 10, label: 'FAMAS' },
    { defindex: 8, label: 'AUG' },
    { defindex: 39, label: 'SG 553' },
    { defindex: 38, label: 'SCAR-20' },
    { defindex: 11, label: 'G3SG1' },
    { defindex: 36, label: 'P250' },
    { defindex: 3, label: 'Five-SeveN' },
    { defindex: 30, label: 'Tec-9' },
    { defindex: 63, label: 'CZ75-Auto' },
    { defindex: 2, label: 'Dual Berettas' },
    { defindex: 64, label: 'R8 Revolver' },
    { defindex: 32, label: 'P2000' },
    { defindex: 17, label: 'MAC-10' },
    { defindex: 34, label: 'MP9' },
    { defindex: 19, label: 'P90' },
    { defindex: 33, label: 'MP7' },
    { defindex: 23, label: 'MP5-SD' },
    { defindex: 24, label: 'UMP-45' },
    { defindex: 26, label: 'PP-Bizon' },
    { defindex: 35, label: 'Nova' },
    { defindex: 25, label: 'XM1014' },
    { defindex: 27, label: 'MAG-7' },
    { defindex: 29, label: 'Sawed-Off' },
    { defindex: 28, label: 'Negev' },
    { defindex: 14, label: 'M249' }
  ], []);

  const toggleRarity = (rarityId) => {
    setSelectedRarities(prev => 
      prev.includes(rarityId) ? prev.filter(r => r !== rarityId) : [...prev, rarityId]
    );
  };

  // Reset filters when switching main subtab
  const handleTabChange = (newTab) => {
    setSelectedSubTab(newTab);
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

  return (
    <div className="min-h-screen bg-[#000000] text-gray-200 flex flex-col selection:bg-[#ff2020] selection:text-white">
      {/* Top Header */}
      <header className="border-b border-[#141414] bg-[#070707] px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight font-display tracking-wide">
              Criar Item
            </h2>
            <p className="text-[11px] text-gray-400">
              Passo 1 de 2 &bull; escolha a base
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#0e0e0e] border border-[#1e1e1e] hover:bg-[#161616] text-gray-300 transition-all cursor-pointer"
        >
          Cancelar
        </button>
      </header>

      {/* Sub-navigation Categories Tabs */}
      <div className="border-b border-[#141414] bg-[#040404] px-6 py-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'skins', label: 'Skins' },
            { id: 'luvas', label: 'Luvas', target: 'gloves' },
            { id: 'facas', label: 'Facas', target: 'knives' },
            { id: 'agentes', label: 'Agentes', target: 'agents' },
            { id: 'musica', label: 'Kit de música', target: 'music' }
          ].map(tab => {
            const activeId = tab.target || tab.id;
            const isSelected = selectedSubTab === activeId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(activeId)}
                className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#ff2020] text-white shadow-[0_0_15px_rgba(255,32,32,0.5)] scale-[1.02]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar & Grid Controls */}
      <div className="px-6 py-3 border-b border-[#141414] bg-[#000000] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search size={15} className="absolute left-3 top-2.5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Buscar em ${selectedSubTab === 'knives' ? 'facas' : selectedSubTab === 'gloves' ? 'luvas' : 'skins'}...`}
            className="w-full bg-[#0a0a0a] border border-[#1a1a1a] pl-9 pr-4 py-1.5 rounded-lg text-xs text-white placeholder-gray-500 outline-none focus:border-[#ff2020] transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end text-xs">
          <div className="flex items-center bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setGridMode('large')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                gridMode === 'large' ? 'bg-[#ff2020] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Grande
            </button>
            <button
              type="button"
              onClick={() => setGridMode('compact')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                gridMode === 'compact' ? 'bg-[#ff2020] text-white' : 'text-gray-400 hover:text-white'
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

      {/* Main Body: Items Grid + Right Filter Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* CENTER / LEFT: Items Grid */}
        <div className="flex-1 p-5 overflow-y-auto bg-[#000000]">
          {filteredList.length === 0 ? (
            <div className="text-center py-24 text-gray-500 text-xs">
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
                const rarityColor = item.rarity_color || '#ffd700';

                return (
                  <div
                    key={`${item.weapon_defindex || item.agent_id || item.music_id}_${item.paint || index}`}
                    onClick={() => onSelectSkin(item)}
                    className="group bg-[#090909] hover:bg-[#111111] border border-[#161616] hover:border-[#ff2020]/70 rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 relative overflow-hidden"
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
                        className="max-w-[145px] max-h-[80px] object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.target.src = 'https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_ak47.png';
                        }}
                      />
                    </div>

                    {/* Skin Text Details */}
                    <div className="mt-2 pt-2 border-t border-white/5">
                      <div className="text-xs font-black text-white truncate leading-tight group-hover:text-[#ff2020] transition-colors">
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

        {/* RIGHT: Filter Sidebar matching Firegames exactly */}
        <aside className="w-64 bg-[#060606] border-l border-[#141414] p-4 flex flex-col justify-between overflow-y-auto shrink-0 select-none">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#181818]">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider font-display">
                <SlidersHorizontal size={13} className="text-[#ff2020]" /> Filtros
              </span>
              {(selectedRarities.length > 0 || selectedWeaponDefindex || selectedKnifeDefindex || selectedGloveType || selectedAgentTeam || search) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRarities([]);
                    setSelectedWeaponDefindex(null);
                    setSelectedKnifeDefindex(null);
                    setSelectedGloveType(null);
                    setSelectedAgentTeam(null);
                    setSearch('');
                  }}
                  className="text-[11px] text-[#ff2020] hover:underline cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* DYNAMIC SECTION: FACAS / ARMAS / LUVAS / AGENTES PILLS */}
            <div>
              <button
                type="button"
                onClick={() => setIsTypeSectionOpen(!isTypeSectionOpen)}
                className="w-full flex items-center justify-between text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2.5 cursor-pointer"
              >
                <span>
                  {selectedSubTab === 'knives' ? 'Facas' :
                   selectedSubTab === 'gloves' ? 'Luvas' :
                   selectedSubTab === 'agents' ? 'Agentes' :
                   selectedSubTab === 'music' ? 'Músicas' : 'Armas'}
                </span>
                {isTypeSectionOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>

              {isTypeSectionOpen && (
                <div className="flex flex-wrap gap-1.5 max-h-80 overflow-y-auto pr-1">
                  {/* 1. KNIFE PILLS */}
                  {selectedSubTab === 'knives' && KNIFE_TYPES.map(k => {
                    const isSelected = Number(selectedKnifeDefindex) === Number(k.defindex);
                    return (
                      <button
                        key={k.defindex}
                        type="button"
                        onClick={() => setSelectedKnifeDefindex(isSelected ? null : k.defindex)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                          isSelected
                            ? 'bg-[#ff2020] text-white shadow-[0_0_10px_rgba(255,32,32,0.4)]'
                            : 'bg-[#0e0e0e] text-gray-300 border border-[#1e1e1e] hover:text-white hover:border-gray-500'
                        }`}
                      >
                        {k.label}
                      </button>
                    );
                  })}

                  {/* 2. WEAPON PILLS */}
                  {selectedSubTab === 'skins' && WEAPON_OPTIONS.map(w => {
                    const isSelected = Number(selectedWeaponDefindex) === Number(w.defindex);
                    return (
                      <button
                        key={w.defindex}
                        type="button"
                        onClick={() => setSelectedWeaponDefindex(isSelected ? null : w.defindex)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                          isSelected
                            ? 'bg-[#ff2020] text-white shadow-[0_0_10px_rgba(255,32,32,0.4)]'
                            : 'bg-[#0e0e0e] text-gray-300 border border-[#1e1e1e] hover:text-white hover:border-gray-500'
                        }`}
                      >
                        {w.label}
                      </button>
                    );
                  })}

                  {/* 3. GLOVE PILLS */}
                  {selectedSubTab === 'gloves' && GLOVE_TYPES.map(g => {
                    const isSelected = selectedGloveType === g.type;
                    return (
                      <button
                        key={g.type}
                        type="button"
                        onClick={() => setSelectedGloveType(isSelected ? null : g.type)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                          isSelected
                            ? 'bg-[#ff2020] text-white shadow-[0_0_10px_rgba(255,32,32,0.4)]'
                            : 'bg-[#0e0e0e] text-gray-300 border border-[#1e1e1e] hover:text-white hover:border-gray-500'
                        }`}
                      >
                        {g.label}
                      </button>
                    );
                  })}

                  {/* 4. AGENT PILLS */}
                  {selectedSubTab === 'agents' && [
                    { team: 't', label: 'Terroristas (TR)' },
                    { team: 'ct', label: 'Contra-Terroristas (CT)' }
                  ].map(a => {
                    const isSelected = selectedAgentTeam === a.team;
                    return (
                      <button
                        key={a.team}
                        type="button"
                        onClick={() => setSelectedAgentTeam(isSelected ? null : a.team)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                          isSelected
                            ? 'bg-[#ff2020] text-white shadow-[0_0_10px_rgba(255,32,32,0.4)]'
                            : 'bg-[#0e0e0e] text-gray-300 border border-[#1e1e1e] hover:text-white hover:border-gray-500'
                        }`}
                      >
                        {a.label}
                      </button>
                    );
                  })}
                </div>
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
                          isChecked ? 'bg-[#ff2020] border-[#ff2020]' : 'border-[#242424] bg-[#0c0c0c]'
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
          </div>

          {/* Bottom Action Button in Vivid Red */}
          <div className="pt-3 mt-4 border-t border-[#181818]">
            <button
              type="button"
              className="w-full bg-[#ff2020] hover:bg-[#e01515] text-white font-bold py-2 px-3 rounded-lg text-xs shadow-[0_0_15px_rgba(255,32,32,0.4)] transition-all cursor-pointer font-display tracking-wider"
            >
              Ver {filteredList.length.toLocaleString('pt-BR')} resultados
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
