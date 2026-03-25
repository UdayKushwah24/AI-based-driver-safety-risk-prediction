import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ParticlesBg from './components/ParticlesBg';
import Dashboard from './pages/Dashboard';
import LiveRisk from './pages/LiveRisk';
import Analytics from './pages/Analytics';
import AlertHistory from './pages/AlertHistory';
import ModelUpload from './pages/ModelUpload';
import Settings from './pages/Settings';
import AccidentPrediction from './pages/AccidentPrediction';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import './styles/global.css';

// ── Protected Route wrapper ──────────────────────────────────────────
function ProtectedRoute({ user }) {
  const token = localStorage.getItem('auth_token');
  if (!user || !token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

// ── Authenticated shell (sidebar + content) ──────────────────────────
function AppShell({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <ParticlesBg />

      <button
        className="sidebar-mobile-toggle"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={onLogout}
      />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* ── Public auth routes ─────────────────────────── */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <Register onLogin={handleLogin} />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ── Protected dashboard routes ──────────────────── */}
        <Route element={<ProtectedRoute user={user} />}>
          <Route element={<AppShell user={user} onLogout={handleLogout} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/live-risk" element={<LiveRisk />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/alerts" element={<AlertHistory />} />
            <Route path="/upload" element={<ModelUpload />} />
            <Route path="/accident" element={<AccidentPrediction />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
      </Routes>
    </Router>
  );
}

