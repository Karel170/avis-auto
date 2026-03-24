import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, Settings, LogOut, Star,
  Building2, X, ChevronDown, Plus, CreditCard, LifeBuoy
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../store/authStore';
import { companiesApi } from '../lib/api';
import { cn } from '../lib/utils';

export default function Sidebar({ isOpen, onClose }) {
  const { user, company, companies, logout, switchCompany } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['stats', company?.id],
    queryFn: () => companiesApi.getStats(company.id).then(r => r.data),
    enabled: !!company?.id,
    refetchInterval: 60000,
  });
  const pendingCount = stats?.pending_reviews || 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    // Close sidebar on mobile when a nav link is clicked
    if (onClose) onClose();
  };

  const handleSwitchCompany = (c) => {
    switchCompany(c);
    setDropdownOpen(false);
  };

  const multipleCompanies = companies && companies.length > 1;

  return (
    <>
      {/* Backdrop - mobile only */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-[260px] bg-slate-900/95 border-r border-slate-800 flex flex-col z-50 backdrop-blur-md transition-transform duration-300 ease-in-out',
          // Mobile: slide in/out
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <a href="/dashboard" onClick={() => window.location.href = '/dashboard'} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">AvisAuto</h1>
              <p className="text-xs text-slate-500">Gestion automatisée des avis</p>
            </div>
          </a>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Company Switcher */}
        {company && (
          <div className="mx-4 mt-4">
            <div className="relative">
              <button
                onClick={() => multipleCompanies && setDropdownOpen(!dropdownOpen)}
                className={cn(
                  'w-full p-3 bg-slate-800/60 rounded-lg border border-slate-700/50 flex items-center gap-2 transition-all duration-200',
                  multipleCompanies && 'hover:border-slate-600 cursor-pointer',
                  !multipleCompanies && 'cursor-default'
                )}
              >
                <div className="w-7 h-7 bg-blue-500/20 rounded-md flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-sm font-medium text-slate-200 truncate">{company.name}</p>
                  <p className="text-xs text-slate-500 truncate">{company.sector || 'Entreprise'}</p>
                </div>
                {multipleCompanies && (
                  <ChevronDown className={cn('w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200', dropdownOpen && 'rotate-180')} />
                )}
              </button>

              {/* Dropdown */}
              {dropdownOpen && multipleCompanies && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10 overflow-hidden">
                  {companies.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSwitchCompany(c)}
                      className={cn(
                        'w-full px-3 py-2.5 flex items-center gap-2.5 text-left hover:bg-slate-700/50 transition-all duration-150',
                        c.id === company.id && 'bg-blue-600/10'
                      )}
                    >
                      <div className="w-6 h-6 bg-blue-500/20 rounded-md flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-3 h-3 text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <p className={cn('text-sm font-medium truncate', c.id === company.id ? 'text-blue-400' : 'text-slate-200')}>
                          {c.name}
                        </p>
                        {c.sector && <p className="text-xs text-slate-500 truncate">{c.sector}</p>}
                      </div>
                    </button>
                  ))}
                  <div className="border-t border-slate-700">
                    <button
                      onClick={() => { setDropdownOpen(false); navigate('/settings'); handleNavClick(); }}
                      className="w-full px-3 py-2.5 flex items-center gap-2.5 text-left hover:bg-slate-700/50 transition-all duration-150"
                    >
                      <div className="w-6 h-6 bg-slate-700 rounded-md flex items-center justify-center flex-shrink-0">
                        <Plus className="w-3 h-3 text-slate-400" />
                      </div>
                      <span className="text-sm text-slate-400">+ Nouvelle entreprise</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Add company button when only one company */}
              {!multipleCompanies && (
                <button
                  onClick={() => { navigate('/settings'); handleNavClick(); }}
                  className="w-full mt-1.5 px-3 py-1.5 flex items-center gap-1.5 text-left rounded-lg hover:bg-slate-800/60 transition-all duration-150"
                >
                  <Plus className="w-3 h-3 text-slate-500" />
                  <span className="text-xs text-slate-500 hover:text-slate-400">+ Nouvelle entreprise</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/reviews', icon: MessageSquare, label: 'Avis', badge: pendingCount },
            { to: '/settings', icon: Settings, label: 'Paramètres' },
            { to: '/subscription', icon: CreditCard, label: 'Abonnement' },
          ].map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300')} />
                  <span className="flex-1">{label}</span>
                  {badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-600/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-blue-400">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          {/* Support */}
          <a
            href="mailto:support@avisauto.app?subject=Demande de support — AvisAuto"
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200 mb-1"
          >
            <LifeBuoy className="w-4 h-4" />
            Support & aide
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
