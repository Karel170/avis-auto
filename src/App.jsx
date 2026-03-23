import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Reviews from './pages/Reviews';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import Legal from './pages/Legal';
import Pricing from './pages/Pricing';
import Subscription from './pages/Subscription';
import NotFound from './pages/NotFound';
import CookieBanner from './components/CookieBanner';

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicOnlyRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <CookieBanner />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Auth routes (redirect to dashboard if already logged in) */}
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={<ProtectedRoute><Layout /></ProtectedRoute>}
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="settings" element={<Settings />} />
          <Route path="subscription" element={<Subscription />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
