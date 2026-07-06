import axios from 'axios';

const API_BASE = 'https://skillbridge-ai-3.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sb_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401s globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sb_token');
      localStorage.removeItem('sb_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/* ── Auth ─────────────────────────────────── */
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

/* ── Resume ───────────────────────────────── */
export const resumeAPI = {
  upload: (formData) =>
    api.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: () => api.get('/resumes'),
  getOne: (id) => api.get(`/resumes/${id}`),
  delete: (id) => api.delete(`/resumes/${id}`),
};

/* ── Analysis ─────────────────────────────── */
export const analysisAPI = {
  analyze: (data) => api.post('/analysis/analyze', data),
  getAll: () => api.get('/analysis'),
  getOne: (id) => api.get(`/analysis/${id}`),
};

/* ── Roadmap ──────────────────────────────── */
export const roadmapAPI = {
  generate: (data) => api.post('/roadmap/generate', data),
  getAll: () => api.get('/roadmap'),
  getOne: (id) => api.get(`/roadmap/${id}`),
  getDashboard: () => api.get('/roadmap/dashboard'),
  getRecommendations: (resumeId) => api.get(`/roadmap/recommendations/${resumeId}`),
};

export default api;
