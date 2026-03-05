import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    const { state } = JSON.parse(authStorage);
    if (state.token) {
      config.headers.Authorization = `Bearer ${state.token}`;
    }
  }
  return config;
});

export const authApi = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const workoutApi = {
  getPlans: () => api.get('/workouts'),
  generatePlan: (data: any) => api.post('/workouts/generate', data),
};

export const nutritionApi = {
  getPlans: () => api.get('/nutrition'),
  generatePlan: (data: any) => api.post('/nutrition/generate', data),
};

export const progressApi = {
  getStats: () => api.get('/progress'),
};

export const userApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: any) => api.patch('/users/me', data),
};

export const adminApi = {
  diagnoseGroq: () => api.get('/admin/diagnose/groq'),
  diagnoseGemini: () => api.get('/admin/diagnose/gemini'),
  diagnoseYouTube: () => api.get('/admin/diagnose/youtube'),
  diagnoseSpoonacular: () => api.get('/admin/diagnose/spoonacular'),
  diagnoseOpenAI: () => api.get('/admin/diagnose/openai'),
  diagnoseCalendar: () => api.get('/admin/diagnose/calendar'),
  diagnoseDB: () => api.get('/admin/diagnose/db'),
};

export default api;
