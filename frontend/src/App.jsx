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
import { Search, Sparkles, AlertCircle, Shield, Flame } from 'lucide-react';

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

  // 2. Fetch Catalog Items
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [cats, weaps, knfs, glvs, agts, mus] = await Promise.all([
          itemsService.getCategories(),
          itemsService.getWeapons(),
          itemsService.getKnives(),
          itemsService.getGloves(),
          itemsService.getAgents(),
          itemsService.getMusic()
        ]);
        setCategories(cats);
        setWeapons(weaps);
        setKnives(knfs);
        setGloves(glvs);
        setAgents(agts);
        setMusic(mus);
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 200,
          background: toast.type === 'error' ? 'rgba(235, 75, 75, 0.95)' : 'rgba(18, 24, 38, 0.95)',
          border: toast.type === 'error' ? '1px solid #eb4b4b' : '1px solid var(--cs-gold)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
          borderRadius: '10px',
          padding: '0.85rem 1.4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.9rem',
          backdropFilter: 'blur(12px)'
        }} className="animate-fade-in">
          {toast.type === 'error' ? <AlertCircle size={18} /> : <Sparkles size={18} color="var(--cs-gold)" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        user={user}
        onOpenDevLogin={() => setIsDevLoginOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem', width: '100%', flex: 1 }}>
        {/* Hero & Team Selector Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '2rem',
          padding: '1.75rem 2rem',
          borderRadius: '16px',
          background: team === 2 
            ? 'linear-gradient(135deg, rgba(232, 119, 34, 0.12) 0%, rgba(12, 16, 26, 0.6) 100%)'
            : 'linear-gradient(135deg, rgba(61, 120, 245, 0.12) 0%, rgba(12, 16, 26, 0.6) 100%)',
          border: team === 2 ? '1px solid rgba(232, 119, 34, 0.3)' : '1px solid rgba(61, 120, 245, 0.3)',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              {team === 2 ? (
                <span className="team-badge-t" style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Flame size={14} /> LADO TERRORISTA
                </span>
              ) : (
                <span className="team-badge-ct" style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Shield size={14} /> LADO CONTRA-TERRORISTA
                </span>
              )}
            </div>
            <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', letterSpacing: '0.5px' }}>
              ESCOLHA SUAS SKINS DO CS2
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Selecione o time, escolha armas ou facas e configure Wear/Float, StatTrak™, Nametag e Adesivos.
            </p>
          </div>

          {/* Team Toggle */}
          <TeamSelector team={team} onChangeTeam={setTeam} />
        </div>

        {/* Categories Bar & Search */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Search Box */}
          {selectedCategory !== 'knives' && selectedCategory !== 'gloves' && selectedCategory !== 'agents' && selectedCategory !== 'music' && (
            <div style={{ position: 'relative', minWidth: '260px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                id="search-weapons"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar arma..."
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  padding: '0.65rem 1rem 0.65rem 2.3rem',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
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
          />
        ) : selectedCategory === 'agents' ? (
          <AgentSelector
            agents={agents}
            team={team}
            equippedAgent={currentTeamEquipment.agent}
            onAgentChanged={(agentId) => {
              fetchEquipment();
              showToast('Agente equipado!');
            }}
          />
        ) : selectedCategory === 'music' ? (
          <MusicSelector
            musicKits={music}
            team={team}
            equippedMusicId={currentTeamEquipment.music}
            onMusicChanged={(musicId) => {
              fetchEquipment();
              showToast('Music Kit equipado!');
            }}
          />
        ) : (
          /* Standard Weapons Grid */
          <div>
            {filteredWeapons.length === 0 ? (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                Nenhuma arma encontrada para os filtros selecionados.
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '1.25rem'
              }}>
                {filteredWeapons.map((w) => {
                  const equipped = currentTeamEquipment?.skins?.[String(w.defindex)];
                  return (
                    <WeaponCard
                      key={w.defindex}
                      weapon={w}
                      equippedSkin={equipped}
                      onCustomize={() => {
                        if (!user) {
                          setIsDevLoginOpen(true);
                          return;
                        }
                        setCustomizingWeapon(w);
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Skin Customizer Modal */}
      {customizingWeapon && (
        <SkinCustomizerModal
          weapon={customizingWeapon}
          team={team}
          currentSkin={currentTeamEquipment?.skins?.[String(customizingWeapon.defindex)]}
          isOpen={!!customizingWeapon}
          onClose={() => setCustomizingWeapon(null)}
          onSkinEquipped={(payload) => {
            fetchEquipment();
            showToast('Skin atualizada no servidor!');
          }}
        />
      )}

      {/* Dev Login Modal */}
      <DevLoginModal
        isOpen={isDevLoginOpen}
        onClose={() => setIsDevLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '1.5rem 2rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        background: 'rgba(9, 12, 16, 0.9)'
      }}>
        <p>CS2 WeaponPaints Web &bull; Desenvolvido para servidores de Counter-Strike 2 com CounterStrikeSharp</p>
      </footer>
    </div>
  );
}
