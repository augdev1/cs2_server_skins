import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://cs2-server-skins.onrender.com';

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
    const res = await api.get('/items/categories');
    return res.data;
  },

  getWeapons: async (category = null) => {
    const params = category ? { category } : {};
    const res = await api.get('/items/weapons', { params });
    return res.data;
  },

  getSkins: async (filters = {}) => {
    const res = await api.get('/items/skins', { params: filters });
    return res.data;
  },

  getKnives: async () => {
    const res = await api.get('/items/knives');
    return res.data;
  },

  getGloves: async () => {
    const res = await api.get('/items/gloves');
    return res.data;
  },

  getAgents: async (team = null) => {
    const params = team ? { team } : {};
    const res = await api.get('/items/agents', { params });
    return res.data;
  },

  getMusic: async () => {
    const res = await api.get('/items/music');
    return res.data;
  },

  getRarities: async () => {
    const res = await api.get('/items/rarities');
    return res.data;
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
