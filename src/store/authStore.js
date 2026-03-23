import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('avisauto_user') || 'null'),
  company: JSON.parse(localStorage.getItem('avisauto_company') || 'null'),
  companies: JSON.parse(localStorage.getItem('avisauto_companies') || '[]'),
  token: localStorage.getItem('avisauto_token') || null,
  isAuthenticated: !!localStorage.getItem('avisauto_token'),

  login: ({ token, user, company }) => {
    localStorage.setItem('avisauto_token', token);
    localStorage.setItem('avisauto_user', JSON.stringify(user));
    if (company) localStorage.setItem('avisauto_company', JSON.stringify(company));
    set({ token, user, company: company || null, isAuthenticated: true });
  },

  setCompany: (company) => {
    localStorage.setItem('avisauto_company', JSON.stringify(company));
    set({ company });
  },

  setCompanies: (companies) => {
    localStorage.setItem('avisauto_companies', JSON.stringify(companies));
    set({ companies });
  },

  switchCompany: (company) => {
    localStorage.setItem('avisauto_company', JSON.stringify(company));
    set({ company });
  },

  logout: () => {
    localStorage.removeItem('avisauto_token');
    localStorage.removeItem('avisauto_user');
    localStorage.removeItem('avisauto_company');
    localStorage.removeItem('avisauto_companies');
    set({ token: null, user: null, company: null, companies: [], isAuthenticated: false });
  },
}));

export default useAuthStore;
