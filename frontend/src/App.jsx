import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DevLoginModal from './components/DevLoginModal';
import TeamSelector from './components/TeamSelector';
import CategoryTabs from './components/CategoryTabs';
import WeaponCard from './components/WeaponCard';
import SkinCustomizerModal from './components/SkinCustomizerModal';
import KnifeSelector from './components/KnifeSelector';
import GlovesSelector from './components/GlovesSelector';
import AgentSelector from './components/AgentSelector';
import MusicSelector from './components/MusicSelector';
import { authService, itemsService, playerService } from './services/api';
import { Search, Sparkles, AlertCircle, Shield, Flame, Crosshair } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [isDevLoginOpen, setIsDevLoginOpen] = useState(false);
  const [team, setTeam] = useState(2); // 2 = TR, 3 = CT
  const [selectedCategory, setSelectedCategory] = useState('rifles');
  const [search, setSearch] = useState('');

  // Data states
  const [categories, setCategories] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [knives, setKnives] = useState([]);
  const [gloves, setGloves] = useState([]);
  const [agents, setAgents] = useState([]);
  const [music, setMusic] = useState([]);
  const [skinsMap, setSkinsMap] = useState({});

  // Player Loadout
  const [equipment, setEquipment] = useState({
    t: { knife: null, gloves: null, agent: null, music: null, skins: {} },
    ct: { knife: null, gloves: null, agent: null, music: null, skins: {} }
  });

  // Modal Customizer State
  const [customizingWeapon, setCustomizingWeapon] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // 1. Check for token in URL hash (Steam callback) or localStorage
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('token=')) {
      const token = hash.split('token=')[1]?.split('&')[0];
      if (token) {
        authService.setToken(token);
        window.history.replaceState(null, '', window.location.pathname);
      }
    }

    const initAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch {
          authService.logout();
          setUser(null);
        }
      }
    };
    initAuth();
  }, []);

  // 2. Fetch Catalog Items and Build Fast Skins Lookup Map
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [cats, weaps, knfs, glvs, agts, mus, allSkinsData] = await Promise.all([
          itemsService.getCategories(),
          itemsService.getWeapons(),
          itemsService.getKnives(),
          itemsService.getGloves(),
          itemsService.getAgents(),
          itemsService.getMusic(),
          itemsService.getSkins()
        ]);
        setCategories(cats);
        setWeapons(weaps);
        setKnives(knfs);
        setGloves(glvs);
        setAgents(agts);
        setMusic(mus);

        const map = {};
        if (Array.isArray(allSkinsData)) {
          allSkinsData.forEach((s) => {
            map[`${s.weapon_defindex}_${s.paint}`] = s;
          });
        }
        setSkinsMap(map);
      } catch (err) {
        console.error('Erro ao carregar catálogo de itens:', err);
      }
    };
    loadCatalog();
  }, []);

  // 3. Fetch Player Equipment when logged in
  const fetchEquipment = async () => {
    if (!user) return;
    try {
      const data = await playerService.getEquipment();
      setEquipment(data);
    } catch (err) {
      console.error('Erro ao buscar inventário do jogador:', err);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, [user]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setEquipment({
      t: { knife: null, gloves: null, agent: null, music: null, skins: {} },
      ct: { knife: null, gloves: null, agent: null, music: null, skins: {} }
    });
    showToast('Sessão encerrada com sucesso.');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    showToast(`Bem-vindo, ${userData.personaname}!`);
  };

  // Team-specific loadout references
  const currentTeamKey = team === 2 ? 't' : 'ct';
  const currentTeamEquipment = equipment[currentTeamKey] || { skins: {} };

  // Filter weapons based on category, team, and search
  const filteredWeapons = weapons.filter((w) => {
    const matchesCategory = selectedCategory === 'all' || w.category === selectedCategory;
    const matchesTeam = w.team === 'any' || (team === 2 && w.team === 't') || (team === 3 && w.team === 'ct');
    const matchesSearch = !search || w.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesTeam && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-cs-bg text-gray-100 selection:bg-cs-gold selection:text-black">
      {/* Toast Notification */}
      {toast && (
        <div 
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-xl font-semibold text-sm shadow-2xl backdrop-blur-xl animate-fade-in border ${
            toast.type === 'error' 
              ? 'bg-red-950/90 text-red-200 border-red-500/50 shadow-red-900/50' 
              : 'bg-cs-surface/90 text-white border-cs-gold shadow-gold'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle size={18} /> : <Sparkles size={18} className="text-cs-gold" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        user={user}
        onOpenDevLogin={() => setIsDevLoginOpen(true)}
        onLogout={handleLogout}
      />

      {/* Hero Banner / Quick Summary */}
      <div className="relative border-b border-white/10 bg-gradient-to-b from-cs-surface/80 to-transparent py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-cs-gold font-bold text-xs uppercase tracking-widest mb-1 font-display">
              <Sparkles size={14} /> Servidor CS2 WeaponPaints
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-wide">
              PERSONALIZADOR DE SKINS
            </h1>
            <p className="text-gray-400 text-sm max-w-xl mt-1">
              Escolha suas skins, facas, luvas e agentes com suporte a Float/Wear, StatTrak™, Nametags e sincronização direta no servidor.
            </p>
          </div>

          {/* Team Switcher Tabs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <TeamSelector selectedTeam={team} onSelectTeam={setTeam} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 flex-1">
        {/* Categories Bar & Search Input */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Search bar for regular weapons */}
          {!['knives', 'gloves', 'agents', 'music'].includes(selectedCategory) && (
            <div className="relative min-w-[260px]">
              <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar arma pelo nome..."
                className="w-full bg-cs-card/80 border border-white/10 pl-10 pr-4 py-2.5 rounded-xl text-white text-sm outline-none focus:border-cs-gold focus:ring-1 focus:ring-cs-gold transition-all"
              />
            </div>
          )}
        </div>

        {/* Content Views by Selected Category */}
        {selectedCategory === 'knives' ? (
          <KnifeSelector
            knives={knives}
            team={team}
            equippedKnifeModel={currentTeamEquipment.knife}
            equippedSkins={currentTeamEquipment.skins}
            skinsMap={skinsMap}
            onKnifeChanged={(knifeModel) => {
              fetchEquipment();
              showToast(`Faca equipada para o time ${team === 2 ? 'TR' : 'CT'}!`);
            }}
            onOpenSkinCustomizer={(knifeObj) => {
              if (!user) {
                setIsDevLoginOpen(true);
                return;
              }
              setCustomizingWeapon(knifeObj);
            }}
          />
        ) : selectedCategory === 'gloves' ? (
          <GlovesSelector
            gloves={gloves}
            team={team}
            equippedGlovesDefindex={currentTeamEquipment.gloves}
            equippedSkins={currentTeamEquipment.skins}
            onGlovesChanged={(defindex) => {
              fetchEquipment();
              showToast('Luvas equipadas com sucesso!');
            }}
            onOpenSkinCustomizer={(gloveObj) => {
              if (!user) {
                setIsDevLoginOpen(true);
                return;
              }
              setCustomizingWeapon(gloveObj);
            }}
          />
        ) : selectedCategory === 'agents' ? (
          <AgentSelector
            agents={agents}
            team={team}
            equippedAgent={team === 2 ? currentTeamEquipment.agent_t : currentTeamEquipment.agent_ct}
            onAgentChanged={() => {
              fetchEquipment();
              showToast('Agente equipado com sucesso!');
            }}
          />
        ) : selectedCategory === 'music' ? (
          <MusicSelector
            musicList={music}
            team={team}
            equippedMusicId={currentTeamEquipment.music}
            onMusicChanged={() => {
              fetchEquipment();
              showToast('Trilha sonora equipada com sucesso!');
            }}
          />
        ) : (
          /* Weapons Grid */
          <div>
            {filteredWeapons.length === 0 ? (
              <div className="text-center py-16 text-gray-400 bg-cs-card/40 rounded-2xl border border-white/5">
                Nenhuma arma encontrada para esta categoria ou filtro.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredWeapons.map((weapon) => {
                  const equippedSkin = currentTeamEquipment.skins?.[String(weapon.defindex)];
                  const equippedSkinInfo = equippedSkin 
                    ? skinsMap[`${weapon.defindex}_${equippedSkin.weapon_paint_id}`] 
                    : null;

                  return (
                    <WeaponCard
                      key={weapon.defindex}
                      weapon={weapon}
                      equippedSkin={equippedSkin}
                      equippedSkinInfo={equippedSkinInfo}
                      onCustomize={() => {
                        if (!user) {
                          setIsDevLoginOpen(true);
                          return;
                        }
                        setCustomizingWeapon(weapon);
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal Customizer */}
      <SkinCustomizerModal
        weapon={customizingWeapon}
        team={team}
        currentSkin={customizingWeapon ? currentTeamEquipment.skins?.[String(customizingWeapon.defindex)] : null}
        isOpen={!!customizingWeapon}
        onClose={() => setCustomizingWeapon(null)}
        onSkinEquipped={() => {
          fetchEquipment();
          showToast('Skin configurada e salva com sucesso!');
        }}
      />

      {/* Dev Login Modal */}
      <DevLoginModal
        isOpen={isDevLoginOpen}
        onClose={() => setIsDevLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-gray-500 bg-cs-bg/90 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Counter-Strike 2 WeaponPaints Web System</span>
          <span className="text-gray-400">Desenvolvido para a comunidade CS2</span>
        </div>
      </footer>
    </div>
  );
}
