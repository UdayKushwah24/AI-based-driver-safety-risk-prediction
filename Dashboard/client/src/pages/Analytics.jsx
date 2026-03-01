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
          </div>
        ))}
      </div>

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
          ))}
        </div>
      </div>
    </div>
  );
}
