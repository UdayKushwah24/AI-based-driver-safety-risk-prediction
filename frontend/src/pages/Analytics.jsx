<<<<<<< HEAD
import '../styles/analytics.css';

const analyticsCards = [
  {
    icon: '📈',
    heading: 'Risk Distribution',
    line1: 'Powered by ML Model',
    line2: 'Real-time Intelligence',
    accent: 'View Analysis →',
  },
  {
    icon: '🌦',
    heading: 'Weather Impact',
    line1: 'Powered by ML Model',
    line2: 'Real-time Intelligence',
    accent: 'View Analysis →',
  },
  {
    icon: '🚦',
    heading: 'Traffic Correlation',
    line1: 'Powered by ML Model',
    line2: 'Real-time Intelligence',
    accent: 'View Analysis →',
  },
];

const analyticsStats = [
  { value: '3.2M', label: 'Records Analyzed' },
  { value: '847', label: 'Pattern Clusters' },
  { value: '99.1%', label: 'Model Uptime' },
  { value: '28', label: 'Active Models' },
];

const barHeights = [40, 65, 30, 80, 55, 45, 90, 70, 35, 60, 85, 50];

export default function Analytics() {
  return (
    <div className="page-wrapper analytics-page">
      <div className="page-header">
        <h1>Analytics & Insights</h1>
        <p>Accident Pattern Analysis — Deep learning powered intelligence</p>
      </div>

      {/* Neon Hover Cards */}
      <div className="analytics-cards-grid">
        {analyticsCards.map((card, i) => (
          <div className="neon-card" key={i}>
            <div className="neon-card-icon">{card.icon}</div>
            <p className="neon-heading">{card.heading}</p>
            <p>{card.line1}</p>
            <p>{card.line2}</p>
            <p className="neon-accent">{card.accent}</p>
          </div>
        ))}
      </div>

      {/* Stats Row */}
      <div className="analytics-stats">
        {analyticsStats.map((s, i) => (
          <div className="analytics-stat" key={i}>
            <div className="a-stat-value">{s.value}</div>
            <div className="a-stat-label">{s.label}</div>
=======
import { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import '../styles/analytics.css';

const dailyRiskData = [
  { day: 'Mon', score: 78 },
  { day: 'Tue', score: 74 },
  { day: 'Wed', score: 69 },
  { day: 'Thu', score: 72 },
  { day: 'Fri', score: 66 },
  { day: 'Sat', score: 81 },
  { day: 'Sun', score: 76 },
];

const alertFrequencyData = [
  { hour: '00', alerts: 1 },
  { hour: '04', alerts: 0 },
  { hour: '08', alerts: 3 },
  { hour: '12', alerts: 5 },
  { hour: '16', alerts: 4 },
  { hour: '20', alerts: 2 },
];

export default function Analytics() {
  const [summary, setSummary] = useState({
    drowsiness_today: 0,
    yawning_events: 0,
    fog_alerts: 0,
    safety_score: 100,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const resp = await fetch('/api/analytics/summary', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await resp.json();
        if (!resp.ok || data.error) {
          setError(data.error || 'Unable to fetch analytics summary');
          return;
        }
        setSummary(data);
      } catch {
        setError('Unable to fetch analytics summary');
      }
    };
    load();
  }, []);

  const totalAlerts = summary.drowsiness_today + summary.yawning_events + summary.fog_alerts;
  const cards = [
    { title: 'Driver Safety Score', value: `${summary.safety_score}` },
    { title: 'Total Alerts', value: `${totalAlerts}` },
    { title: 'Fog Predictions', value: `${summary.fog_alerts}` },
    { title: 'Drowsiness Events', value: `${summary.drowsiness_today}` },
  ];

  const heatmap = useMemo(
    () =>
      Array.from({ length: 24 }, (_, hour) => ({
        hour,
        intensity: Math.max(8, (summary.yawning_events * 6 + summary.fog_alerts * 8 + hour * 2) % 100),
      })),
    [summary.yawning_events, summary.fog_alerts]
  );

  return (
    <div className="page-wrapper analytics-page">
      <div className="page-header">
        <h1>AI-Based Driver Risk Scoring Engine</h1>
        <p>Real-Time Drowsiness, Fog Detection and AI Risk Scoring Platform</p>
      </div>

      {error && <div className="analytics-error">{error}</div>}

      <div className="analytics-stats">
        {cards.map((card) => (
          <div className="analytics-stat" key={card.title}>
            <div className="a-stat-value">{card.value}</div>
            <div className="a-stat-label">{card.title}</div>
>>>>>>> origin/Aman
          </div>
        ))}
      </div>

<<<<<<< HEAD
      {/* Chart Placeholder */}
      <div className="analytics-chart-area">
        <div className="chart-header">
          <h3>Monthly Accident Trends</h3>
          <span>Last 12 months</span>
        </div>
        <div className="chart-bars">
          {barHeights.map((h, i) => (
            <div
              className="chart-bar"
              key={i}
              style={{
                height: `${h}%`,
                animationDelay: `${i * 0.08}s`,
              }}
            ></div>
=======
      <div className="analytics-grid">
        <div className="analytics-chart-area">
          <div className="chart-header">
            <h3>Daily Risk Score</h3>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dailyRiskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#a0a0b8" />
                <YAxis stroke="#a0a0b8" domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#00e5ff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-chart-area">
          <div className="chart-header">
            <h3>Alert Frequency</h3>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={alertFrequencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="hour" stroke="#a0a0b8" />
                <YAxis stroke="#a0a0b8" />
                <Tooltip />
                <Line type="monotone" dataKey="alerts" stroke="#e81cff" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="analytics-chart-area">
        <div className="chart-header">
          <h3>Risk Intensity per Hour</h3>
        </div>
        <div className="heatmap-grid">
          {heatmap.map((slot) => (
            <div className="heatmap-cell" key={slot.hour}>
              <div
                className="heatmap-fill"
                style={{ opacity: slot.intensity / 100 }}
                title={`Hour ${slot.hour}:00 intensity ${slot.intensity}`}
              />
              <span>{slot.hour.toString().padStart(2, '0')}</span>
            </div>
>>>>>>> origin/Aman
          ))}
        </div>
      </div>
    </div>
  );
}
