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
  const [equipment, setEquipment] = useState({
    t: { knife: null, gloves: null, agent: null, music: null, skins: {} },
    ct: { knife: null, gloves: null, agent: null, music: null, skins: {} }
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
      setEquipment(data);
    } catch (err) {
      console.error('Erro ao buscar inventário do jogador:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEquipment();
    }
  }, [user]);

  // Logout Handler: Clears session and returns to full-screen login
  const handleLogout = () => {
    authService.logout();
    setUser(null);
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

  // Quando o usuário seleciona uma skin na aba "Criar Item"
  const handleSelectSkinFromAddView = (item) => {
    if (!user) {
      setIsDevLoginOpen(true);
      return;
    }
    
    const baseWeapon = weapons.find(w => w.defindex === item.weapon_defindex) || 
                       knives.find(k => k.defindex === item.weapon_defindex) ||
                       item;

    setInitialCustomizerPaint(item.paint);
    setCustomizingWeapon({
      ...baseWeapon,
      defindex: item.weapon_defindex,
      name: item.paint_name || item.name,
      weaponTitle: item.paint_name || item.name,
      isKnife: item.weapon_name?.startsWith('weapon_knife') || item.weapon_name?.startsWith('weapon_bayonet'),
      knife: item.weapon_name,
      isGlove: item.isGlove || item.weapon_name?.startsWith('gloves_')
    });
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
            onOpenDevLogin={() => setIsDevLoginOpen(true)}
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
        onSkinEquipped={() => {
          fetchEquipment();
          showToast('Skin configurada e sincronizada com o servidor!');
        }}
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
