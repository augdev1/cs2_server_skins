import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LoginView from './components/LoginView';
import InventoryView from './components/InventoryView';
import AddItemView from './components/AddItemView';
import DevLoginModal from './components/DevLoginModal';
import SkinCustomizerModal from './components/SkinCustomizerModal';
import { authService, itemsService, playerService } from './services/api';
import { Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [isDevLoginOpen, setIsDevLoginOpen] = useState(false);
  const [currentView, setCurrentView] = useState('inventory'); // 'inventory' | 'add'
  const [team, setTeam] = useState(2); // 2 = TR, 3 = CT

  // Data states
  const [categories, setCategories] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [knives, setKnives] = useState([]);
  const [gloves, setGloves] = useState([]);
  const [agents, setAgents] = useState([]);
  const [music, setMusic] = useState([]);
  const [allSkins, setAllSkins] = useState([]);
  const [skinsMap, setSkinsMap] = useState({});

  // Player Loadout
  const [equipment, setEquipment] = useState(() => {
    try {
      const cached = localStorage.getItem('cs2_equipment_cache');
      return cached ? JSON.parse(cached) : {
        t: { knife: null, gloves: null, agent: null, music: null, skins: {} },
        ct: { knife: null, gloves: null, agent: null, music: null, skins: {} }
      };
    } catch {
      return {
        t: { knife: null, gloves: null, agent: null, music: null, skins: {} },
        ct: { knife: null, gloves: null, agent: null, music: null, skins: {} }
      };
    }
  });

  // Modal Customizer State
  const [customizingWeapon, setCustomizingWeapon] = useState(null);
  const [initialCustomizerPaint, setInitialCustomizerPaint] = useState(null);
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
          setCurrentView('inventory');
        } catch {
          authService.logout();
          setUser(null);
        }
      } else {
        setUser(null);
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
        setAllSkins(allSkinsData);

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
      if (data && (data.t || data.ct)) {
        setEquipment(data);
        localStorage.setItem('cs2_equipment_cache', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Erro ao buscar inventário do jogador:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEquipment();
    }
  }, [user]);

  // Logout Handler
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('cs2_equipment_cache');
    setEquipment({
      t: { knife: null, gloves: null, agent: null, music: null, skins: {} },
      ct: { knife: null, gloves: null, agent: null, music: null, skins: {} }
    });
    showToast('Sessão encerrada com sucesso.');
  };

  // Login Success Handler
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentView('inventory');
    showToast(`Bem-vindo, ${userData.personaname}!`);
  };

  // Quando o usuário seleciona um item na aba "Criar Item"
  const handleSelectSkinFromAddView = async (item) => {
    if (!user) {
      setIsDevLoginOpen(true);
      return;
    }

    // 1. Se for Agente (Personagem)
    if (item.isAgent || item.agent_id) {
      const agentTeam = item.team === 'ct' ? 3 : 2;
      try {
        await playerService.updateAgent(agentTeam, item.name);
        setEquipment(prev => {
          const next = JSON.parse(JSON.stringify(prev || {}));
          const tKey = agentTeam === 3 ? 'ct' : 't';
          if (!next[tKey]) next[tKey] = { skins: {} };
          next[tKey].agent = item.name;
          localStorage.setItem('cs2_equipment_cache', JSON.stringify(next));
          return next;
        });
        showToast(`Agente '${item.name}' equipado com sucesso para o lado ${agentTeam === 3 ? 'CT' : 'TR'}!`);
      } catch (err) {
        console.error('Erro ao equipar agente:', err);
        showToast('Erro ao equipar agente no servidor.', 'error');
      }
      return;
    }

    // 2. Se for Kit de Música
    if (item.isMusic || item.music_id) {
      try {
        await playerService.updateMusic(team, item.music_id);
        setEquipment(prev => {
          const next = JSON.parse(JSON.stringify(prev || {}));
          const tKey = team === 3 ? 'ct' : 't';
          if (!next[tKey]) next[tKey] = { skins: {} };
          next[tKey].music = item.music_id;
          localStorage.setItem('cs2_equipment_cache', JSON.stringify(next));
          return next;
        });
        showToast(`Trilha Sonora '${item.name}' equipada com sucesso!`);
      } catch (err) {
        console.error('Erro ao equipar trilha sonora:', err);
        showToast('Erro ao equipar trilha sonora.', 'error');
      }
      return;
    }
    
    // 3. Se for Faca, Luva ou Arma regular
    const baseWeapon = weapons.find(w => w.defindex === item.weapon_defindex) || 
                       knives.find(k => k.defindex === item.weapon_defindex) ||
                       item;

    const isKnife = item.weapon_name?.startsWith('weapon_knife') || 
                    item.weapon_name?.startsWith('weapon_bayonet') || 
                    (Number(item.weapon_defindex) >= 500 && Number(item.weapon_defindex) <= 526);

    const isGlove = item.isGlove || item.weapon_name?.startsWith('gloves_') || 
                    (Number(item.weapon_defindex) >= 5027 && Number(item.weapon_defindex) <= 5035);

    setInitialCustomizerPaint(item.paint);
    setCustomizingWeapon({
      ...baseWeapon,
      defindex: item.weapon_defindex,
      name: item.paint_name || item.name,
      weaponTitle: item.paint_name || item.name,
      isKnife,
      knife: item.weapon_name,
      isGlove
    });
  };

  // Handler de salvamento otimista imediato
  const handleSkinEquipped = (payload) => {
    if (payload) {
      setEquipment(prev => {
        const next = JSON.parse(JSON.stringify(prev || {}));
        const tKey = (payload.weapon_team || payload.team) === 2 ? 't' : 'ct';
        if (!next[tKey]) next[tKey] = { skins: {} };
        if (!next[tKey].skins) next[tKey].skins = {};

        if (payload.isDefault) {
          delete next[tKey].skins[String(payload.weapon_defindex)];
        } else {
          next[tKey].skins[String(payload.weapon_defindex)] = payload;
          if (payload.knife_name || payload.knife) {
            next[tKey].knife = payload.knife_name || payload.knife;
          }
          if (payload.gloves_defindex) {
            next[tKey].gloves = payload.gloves_defindex;
          }
        }
        localStorage.setItem('cs2_equipment_cache', JSON.stringify(next));
        return next;
      });
    }
    // Sincroniza em background com o banco de dados
    fetchEquipment();
    showToast('Skin configurada e salva com sucesso!');
  };

  return (
    <div className="min-h-screen flex bg-[#000000] text-white selection:bg-[#ff2020] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Toast Notification */}
      {toast && (
        <div 
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-xl font-semibold text-xs shadow-2xl backdrop-blur-xl animate-fade-in border ${
            toast.type === 'error' 
              ? 'bg-red-950/90 text-red-200 border-red-500/50 shadow-red-900/50' 
              : 'bg-[#0d0d0d]/95 text-white border-[#ff2020] shadow-[0_0_20px_rgba(255,32,32,0.4)]'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle size={16} /> : <Sparkles size={16} className="text-[#ff2020]" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Se o usuário NÃO estiver logado: Exibe a tela inicial de login em tela cheia */}
      {!user ? (
        <div className="flex-1 flex flex-col min-w-0">
          <LoginView onOpenDevLogin={() => setIsDevLoginOpen(true)} />
        </div>
      ) : (
        /* Se o usuário ESTIVER logado: Exibe a sidebar do usuário com Inventário e Catálogo */
        <>
          <Sidebar
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
            user={user}
            onOpenDevLogin={() => setIsDevLoginOpen(false)}
            onLogout={handleLogout}
          />

          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#000000]">
            {currentView === 'add' ? (
              /* View 2: "Criar Item / Passo 1 de 2" */
              <AddItemView
                skins={allSkins}
                weapons={weapons}
                knives={knives}
                gloves={gloves}
                agents={agents}
                music={music}
                onBack={() => setCurrentView('inventory')}
                onSelectSkin={handleSelectSkinFromAddView}
              />
            ) : (
              /* View 1: "Meu Inventário" */
              <div className="p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-6 bg-[#000000]">
                <InventoryView
                  weapons={weapons}
                  knives={knives}
                  gloves={gloves}
                  agents={agents}
                  music={music}
                  team={team}
                  setTeam={setTeam}
                  equipment={equipment}
                  skinsMap={skinsMap}
                  onOpenAdd={() => setCurrentView('add')}
                  onCustomizeWeapon={(weaponObj) => {
                    setInitialCustomizerPaint(null);
                    setCustomizingWeapon(weaponObj);
                  }}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal Customizer */}
      <SkinCustomizerModal
        weapon={customizingWeapon}
        team={team}
        initialPaintId={initialCustomizerPaint}
        currentSkin={customizingWeapon ? (
          equipment[team === 2 ? 't' : 'ct']?.skins?.[String(customizingWeapon.defindex)]
        ) : null}
        isOpen={!!customizingWeapon}
        onClose={() => {
          setCustomizingWeapon(null);
          setInitialCustomizerPaint(null);
        }}
        onSkinEquipped={handleSkinEquipped}
      />

      {/* Dev Login Modal */}
      <DevLoginModal
        isOpen={isDevLoginOpen}
        onClose={() => setIsDevLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
