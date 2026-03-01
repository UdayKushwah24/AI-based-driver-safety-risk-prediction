import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ParticlesBg from './components/ParticlesBg';
import Dashboard from './pages/Dashboard';
import LiveRisk from './pages/LiveRisk';
import Analytics from './pages/Analytics';
import ModelUpload from './pages/ModelUpload';
import Settings from './pages/Settings';
import './styles/global.css';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
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
        />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/live-risk" element={<LiveRisk />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/upload" element={<ModelUpload />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
