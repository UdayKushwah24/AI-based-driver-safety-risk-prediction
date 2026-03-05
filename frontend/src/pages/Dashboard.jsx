import { useState, useEffect } from 'react';
import '../styles/dashboard.css';

const cards = [
  {
    title: 'Live Risk Status',
    icon: '🔴',
    desc: 'Real-time unified driver risk score from all modules',
    color: '252, 142, 142',
  },
  {
    title: 'Drowsiness Monitor',
    icon: '😴',
    desc: 'Eye aspect ratio & yawn detection via webcam',
    color: '142, 202, 252',
  },
  {
    title: 'Fog Detection',
    icon: '🌫',
    desc: 'Visibility analysis using EfficientNet-B0 model',
    color: '142, 252, 204',
  },
  {
    title: 'Road Classification',
    icon: '🛣',
    desc: 'Highway, urban, rural road type categorization',
    color: '215, 252, 142',
  },
  {
    title: 'Risk Engine',
    icon: '🧠',
    desc: 'Weighted risk aggregation from all detection modules',
    color: '252, 208, 142',
  },
  {
    title: 'Real-Time Dashboard',
    icon: '📡',
    desc: 'WebSocket-powered live risk updates to frontend',
    color: '204, 142, 252',
  },
];

export default function Dashboard() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const resp = await fetch('/api/status');
        const data = await resp.json();
        setStatus(data);
      } catch {
        setStatus(null);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const systemOnline = status?.status === 'online';
  const drowsinessActive = status?.modules?.drowsiness?.active ?? false;
  const fogActive = status?.modules?.fog?.active ?? false;
  const uptime = status?.uptime ?? 0;
  const activeModules = (drowsinessActive ? 1 : 0) + (fogActive ? 1 : 0);

  const stats = [
    {
      label: 'Active Modules',
      value: status ? `${activeModules} / 2` : '—',
      change: systemOnline ? 'System online' : 'Offline',
      positive: systemOnline,
    },
    {
      label: 'Risk Level',
      value: status?.risk_level?.toUpperCase() ?? '—',
      change: `Score: ${status?.risk_score ?? 0}`,
      positive: (status?.risk_score ?? 0) < 50,
    },
    {
      label: 'System Uptime',
      value: status ? `${Math.floor(status.uptime / 60)}m` : '—',
      change: status ? 'Running' : 'Stopped',
      positive: !!status,
    },
  ];

  return (
    <div className="page-wrapper dashboard-page">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>AI-based Driver Safety Risk Prediction — Real-time monitoring</p>
      </div>

      <div className="stats-row">
        {stats.map((s, i) => (
          <div className="stat-box" key={i}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-change ${s.positive ? 'positive' : 'negative'}`}>
              {s.change}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-cards-section">
        <h2>System Modules</h2>
        <div className="rotating-wrapper">
          <div
            className="rotating-inner"
            style={{ '--quantity': cards.length }}
          >
            {cards.map((card, index) => (
              <div
                className="rotating-card"
                key={index}
                style={{
                  '--index': index,
                  '--color-card': card.color,
                }}
              >
                <div className="rotating-card-bg">
                  <span className="card-icon">{card.icon}</span>
                  <span className="card-title">{card.title}</span>
                  <span className="card-desc">{card.desc}</span>
                  <div className="card-glow"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
