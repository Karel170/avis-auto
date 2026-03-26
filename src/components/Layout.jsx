import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import EmailVerificationBanner from './EmailVerificationBanner';
import useAuthStore from '../store/authStore';
import { authApi, companiesApi } from '../lib/api';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setCompany, setCompanies, company, user } = useAuthStore();

  useEffect(() => {
    if (!company) {
      authApi.me().then(res => {
        if (res.data.company) setCompany(res.data.company);
      }).catch(() => {});
      companiesApi.list().then(res => {
        if (res.data?.length) {
          setCompanies(res.data);
          setCompany(res.data[0]);
        }
      }).catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-[260px] min-h-screen overflow-y-auto pt-14 lg:pt-0">
        {user && user.email_verified === false && <EmailVerificationBanner />}
        <Outlet />
      </main>
    </div>
  );
}
