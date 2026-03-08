import { NavLink, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '◉' },
  { path: '/live-risk', label: 'Live Risk Detection', icon: '⚡' },
  { path: '/analytics', label: 'Analytics & Insights', icon: '📊' },
<<<<<<< HEAD
=======
  { path: '/alerts', label: 'Alert History', icon: '🧾' },
>>>>>>> origin/Aman
  { path: '/accident', label: 'Accident Predictor', icon: '🚨' },
  { path: '/upload', label: 'Model Upload', icon: '📁' },
  { path: '/settings', label: 'Settings', icon: '⚙' },
];

<<<<<<< HEAD
export default function Sidebar({ isOpen, onClose }) {
=======
export default function Sidebar({ isOpen, onClose, user, onLogout }) {
>>>>>>> origin/Aman
  const location = useLocation();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar${isOpen ? ' open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">DS</div>
          <div className="sidebar-brand-text">
<<<<<<< HEAD
            <h2>Driver Safety AI</h2>
=======
            <h2>AI-Based Driver Safety</h2>
>>>>>>> origin/Aman
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
<<<<<<< HEAD
=======
          {user && (
            <div className="sidebar-user">
              <div className="sidebar-user-avatar">
                {(user.name || 'U')[0].toUpperCase()}
              </div>
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user.name || user.email}</span>
                <span className="sidebar-user-email">{user.email}</span>
              </div>
            </div>
          )}

>>>>>>> origin/Aman
          <div className="sidebar-status">
            <div className="status-dot"></div>
            <div className="status-text">
              System Status
              <strong>All Systems Operational</strong>
            </div>
          </div>
<<<<<<< HEAD
=======

          {onLogout && (
            <button className="sidebar-logout" onClick={onLogout}>
              Sign Out
            </button>
          )}
>>>>>>> origin/Aman
        </div>
      </aside>
    </>
  );
}
<<<<<<< HEAD
=======

>>>>>>> origin/Aman
