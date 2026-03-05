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
  getPlans: () => api.get('/workouts/plans'),
  generatePlan: (goal: string, level: string) => api.post(`/workouts/generate?goal=${goal}&fitness_level=${level}`),
  getPlanDetails: (id: number) => api.get(`/workouts/plans/${id}`),
};

export const nutritionApi = {
  getTargets: () => api.get('/nutrition/targets'),
  searchRecipes: (query: string) => api.get(`/nutrition/recipes/search?query=${query}`),
  logMeal: (data: any) => api.post('/nutrition/log', data),
};

export const healthApi = {
  submitAssessment: (data: any) => api.post('/health/assessment', data),
  getTrends: () => api.get('/health/trends'),
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
