import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('avisauto_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('avisauto_token');
      localStorage.removeItem('avisauto_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  me: () => api.get('/api/auth/me'),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/api/auth/reset-password', { token, password }),
  changePassword: (current_password, new_password) =>
    api.post('/api/auth/change-password', { current_password, new_password }),
};

export const companiesApi = {
  list: () => api.get('/api/companies'),
  create: (data) => api.post('/api/companies', data),
  get: (id) => api.get(`/api/companies/${id}`),
  update: (id, data) => api.put(`/api/companies/${id}`, data),
  sync: (id, data) => api.post(`/api/companies/${id}/sync`, data),
  getStats: (id) => api.get(`/api/companies/${id}/stats`),
  getReviews: (id, params) => api.get(`/api/companies/${id}/reviews`, { params }),
  generateResponse: (companyId, reviewId, data) =>
    api.post(`/api/companies/${companyId}/reviews/${reviewId}/generate`, data),
  updateResponse: (companyId, reviewId, data) =>
    api.put(`/api/companies/${companyId}/reviews/${reviewId}/response`, data),
  generateAll: (companyId, data) =>
    api.post(`/api/companies/${companyId}/reviews/generate-all`, data),
  publishAll: (companyId) =>
    api.post(`/api/companies/${companyId}/responses/publish-all`),
  exportCSV: (companyId) =>
    api.get(`/api/companies/${companyId}/reviews/export`, { responseType: 'blob' }),
  analyse: (companyId) => api.post(`/api/companies/${companyId}/analyse`),
};

// Stripe / subscription API
export const stripeApi = {
  // Public — no auth required
  getPlans: () => api.get('/api/stripe/plans'),

  // Authenticated
  createCheckoutSession: (data) =>
    api.post('/api/stripe/create-checkout-session', data),
  // data: { planId: 'starter' | 'pro' | 'business', company_id?: string }

  createSetupSession: () =>
    api.post('/api/stripe/create-setup-session'),

  getSubscription: (companyId) =>
    api.get('/api/stripe/subscription', { params: { company_id: companyId } }),

  cancelSubscription: (companyId) =>
    api.post('/api/stripe/cancel', { company_id: companyId }),

  reactivateSubscription: (companyId) =>
    api.post('/api/stripe/reactivate', { company_id: companyId }),

  createPortalSession: (companyId) =>
    api.post('/api/stripe/create-portal', { company_id: companyId }),
};

export const googleApi = {
  getAuthUrl: (companyId, token) =>
    `${API_URL}/api/google/auth?company_id=${encodeURIComponent(companyId)}&token=${encodeURIComponent(token)}`,
  getStatus: (companyId) => api.get('/api/google/status', { params: { company_id: companyId } }),
  getLocations: (companyId) => api.get('/api/google/locations', { params: { company_id: companyId } }),
  selectLocation: (data) => api.post('/api/google/select-location', data),
  publishReply: (data) => api.post('/api/google/publish-reply', data),
  disconnect: (companyId) => api.delete('/api/google/disconnect', { params: { company_id: companyId } }),
};

export default api;
