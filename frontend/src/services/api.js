import axios from 'axios';
import localWeapons from '../data/weapons.json';
import localKnives from '../data/knives.json';
import localGloves from '../data/gloves.json';
import localAgents from '../data/agents.json';
import localMusic from '../data/music.json';
import localSkins from '../data/skins.json';

const API_BASE = import.meta.env.VITE_API_URL || 'https://cs2-server-skins.onrender.com';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o token JWT em todas as requisições autenticadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cs2_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  getSteamLoginUrl: () => {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${API_BASE}/auth/steam?redirect_to=${encodeURIComponent(currentOrigin)}`;
  },
  
  devLogin: async (steamid, personaname = 'Player') => {
    const res = await api.post('/auth/dev-login', { steamid, personaname });
    if (res.data?.access_token) {
      localStorage.setItem('cs2_token', res.data.access_token);
      localStorage.setItem('cs2_user', JSON.stringify(res.data.user));
      localStorage.setItem('cs2_auth_type', 'dev');
    }
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('cs2_token');
    localStorage.removeItem('cs2_user');
    localStorage.removeItem('cs2_auth_type');
  },

  getStoredUser: () => {
    try {
      const user = localStorage.getItem('cs2_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  getToken: () => localStorage.getItem('cs2_token'),
  
  setToken: (token, user) => {
    localStorage.setItem('cs2_token', token);
    localStorage.setItem('cs2_auth_type', 'steam');
    if (user) localStorage.setItem('cs2_user', JSON.stringify(user));
  }
};

export const itemsService = {
  getCategories: async () => {
    try {
      const res = await api.get('/items/categories');
      return res.data;
    } catch {
      return [
        { id: "rifles", name: "Rifles" },
        { id: "sniper_rifles", name: "Rifles de Precisão" },
        { id: "pistols", name: "Pistolas" },
        { id: "smg", name: "Submetralhadoras" },
        { id: "shotguns", name: "Espingardas" },
        { id: "machine_guns", name: "Metralhadoras" },
        { id: "knives", name: "Facas" },
        { id: "gloves", name: "Luvas" },
        { id: "agents", name: "Agentes" },
        { id: "music", name: "Kit de música" }
      ];
    }
  },

  getWeapons: async (category = null) => {
    try {
      const params = category ? { category } : {};
      const res = await api.get('/items/weapons', { params });
      return res.data;
    } catch {
      if (category) {
        return localWeapons.filter(w => w.category === category);
      }
      return localWeapons;
    }
  },

  getSkins: async (filters = {}) => {
    try {
      const res = await api.get('/items/skins', { params: filters });
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return localSkins;
    } catch {
      return localSkins;
    }
  },

  getKnives: async () => {
    try {
      const res = await api.get('/items/knives');
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return localKnives;
    } catch {
      return localKnives;
    }
  },

  getGloves: async () => {
    try {
      const res = await api.get('/items/gloves');
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return localGloves;
    } catch {
      return localGloves;
    }
  },

  getAgents: async (team = null) => {
    try {
      const params = team ? { team } : {};
      const res = await api.get('/items/agents', { params });
      return res.data;
    } catch {
      return localAgents;
    }
  },

  getMusic: async () => {
    try {
      const res = await api.get('/items/music');
      return res.data;
    } catch {
      return localMusic;
    }
  },

  getRarities: async () => {
    try {
      const res = await api.get('/items/rarities');
      return res.data;
    } catch {
      return [];
    }
  }
};

export const playerService = {
  getEquipment: async () => {
    const res = await api.get('/player/equipment');
    return res.data;
  },

  updateSkin: async (skinData) => {
    const res = await api.post('/player/skin', skinData);
    return res.data;
  },

  deleteSkin: async (team, defindex) => {
    const res = await api.delete(`/player/skin/${team}/${defindex}`);
    return res.data;
  },

  updateKnife: async (team, knifeName) => {
    const res = await api.post('/player/knife', { team, knife_name: knifeName });
    return res.data;
  },

  updateGloves: async (team, glovesDefindex) => {
    const res = await api.post('/player/gloves', { team, gloves_defindex: glovesDefindex });
    return res.data;
  },

  updateAgent: async (team, agentModel) => {
    const res = await api.post('/player/agent', { team, agent_model: agentModel });
    return res.data;
  },

  updateMusic: async (team, musicId) => {
    const res = await api.post('/player/music', { team, music_id: musicId });
    return res.data;
  },

  clearAllEquipment: async () => {
    const res = await api.post('/player/clear-all');
    return res.data;
  }
};
