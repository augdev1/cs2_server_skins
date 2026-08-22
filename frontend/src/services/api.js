import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE,
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
  getSteamLoginUrl: () => `${API_BASE}/auth/steam`,
  
  devLogin: async (steamid, personaname = 'Player') => {
    const res = await api.post('/auth/dev-login', { steamid, personaname });
    if (res.data?.access_token) {
      localStorage.setItem('cs2_token', res.data.access_token);
      localStorage.setItem('cs2_user', JSON.stringify(res.data.user));
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
    if (user) localStorage.setItem('cs2_user', JSON.stringify(user));
  }
};

export const itemsService = {
  getCategories: async () => {
    const res = await api.get('/api/items/categories');
    return res.data;
  },

  getWeapons: async (category = null) => {
    const res = await api.get('/api/items/weapons', { params: { category } });
    return res.data;
  },

  getSkins: async (params = {}) => {
    const res = await api.get('/api/items/skins', { params });
    return res.data;
  },

  getKnives: async () => {
    const res = await api.get('/api/items/knives');
    return res.data;
  },

  getGloves: async () => {
    const res = await api.get('/api/items/gloves');
    return res.data;
  },

  getAgents: async (team = null) => {
    const res = await api.get('/api/items/agents', { params: { team } });
    return res.data;
  },

  getMusic: async () => {
    const res = await api.get('/api/items/music');
    return res.data;
  },

  search: async (q) => {
    const res = await api.get('/api/items/search', { params: { q } });
    return res.data;
  }
};

export const playerService = {
  getEquipment: async () => {
    const res = await api.get('/api/player/equipment');
    return res.data;
  },

  updateSkin: async (skinData) => {
    const res = await api.post('/api/player/skin', skinData);
    return res.data;
  },

  deleteSkin: async (weapon_team, weapon_defindex) => {
    const res = await api.delete('/api/player/skin', { data: { weapon_team, weapon_defindex } });
    return res.data;
  },

  updateKnife: async (weapon_team, knife) => {
    const res = await api.post('/api/player/knife', { weapon_team, knife });
    return res.data;
  },

  deleteKnife: async (team) => {
    const res = await api.delete('/api/player/knife', { params: { team } });
    return res.data;
  },

  updateGloves: async (weapon_team, weapon_defindex) => {
    const res = await api.post('/api/player/gloves', { weapon_team, weapon_defindex });
    return res.data;
  },

  updateAgent: async (agent_ct, agent_t) => {
    const res = await api.post('/api/player/agent', { agent_ct, agent_t });
    return res.data;
  },

  updateMusic: async (weapon_team, music_id) => {
    const res = await api.post('/api/player/music', { weapon_team, music_id });
    return res.data;
  }
};

export default api;
