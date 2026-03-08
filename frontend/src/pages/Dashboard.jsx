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
<<<<<<< HEAD
=======
      {/* ── Hero Section with Nexbot Robot ── */}
      <div className="hero-section">
        <div className="hero-text">
          <h1>AI-Based Driver Safety Risk Prediction System</h1>
          <p>
            An intelligent system that detects drowsiness, stress, fog conditions,
            and predicts accident risk using machine learning — keeping drivers safe
            in real time.
          </p>
        </div>
        <div className="hero-robot">
          <iframe
            src="https://my.spline.design/nexbotrobotcharacterconcept-7ICIxCNdXljLTvR22p8TEpNA/"
            frameBorder="0"
            width="100%"
            height="500"
            title="Nexbot Robot Assistant"
            loading="lazy"
          />
        </div>
      </div>

      {/* ── System Workflow Diagram ── */}
      <section className="system-diagram">
        <h2>How the AI Driver Safety System Works</h2>
        <p className="diagram-desc">
          Explore the interactive workflow that powers the driver monitoring system —
          from live sensor input through AI modules to the real-time dashboard.
        </p>
        <div className="spline-container">
          <iframe
            src="https://my.spline.design/webdiagram-jDuKyuTJdw84DppJjkS7IrlS/"
            frameBorder="0"
            width="100%"
            height="600"
            title="System Workflow Diagram"
            loading="lazy"
          />
        </div>
      </section>

>>>>>>> origin/Aman
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
