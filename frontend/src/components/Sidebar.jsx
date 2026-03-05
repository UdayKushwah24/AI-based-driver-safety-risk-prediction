import { NavLink, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '◉' },
  { path: '/live-risk', label: 'Live Risk Detection', icon: '⚡' },
  { path: '/analytics', label: 'Analytics & Insights', icon: '📊' },
  { path: '/accident', label: 'Accident Predictor', icon: '🚨' },
  { path: '/upload', label: 'Model Upload', icon: '📁' },
  { path: '/settings', label: 'Settings', icon: '⚙' },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar${isOpen ? ' open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">DS</div>
          <div className="sidebar-brand-text">
            <h2>Driver Safety AI</h2>
            <span>Risk Prediction System</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`sidebar-link${location.pathname === item.path ? ' active' : ''}`}
              onClick={onClose}
              end={item.path === '/'}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-status">
            <div className="status-dot"></div>
            <div className="status-text">
              System Status
              <strong>All Systems Operational</strong>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
