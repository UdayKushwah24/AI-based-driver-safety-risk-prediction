import '../styles/dashboard.css';

const cards = [
  {
    title: 'Live Risk Status',
    icon: '🔴',
    desc: 'Real-time accident risk level monitoring across zones',
    color: '252, 142, 142',
  },
  {
    title: 'Weather Monitor',
    icon: '🌧',
    desc: 'Weather condition tracking affecting road safety',
    color: '142, 202, 252',
  },
  {
    title: 'Traffic Density',
    icon: '🚗',
    desc: 'Vehicle density analysis on major road segments',
    color: '142, 252, 204',
  },
  {
    title: 'Road Classification',
    icon: '🛣',
    desc: 'Highway, urban, rural road type categorization',
    color: '215, 252, 142',
  },
  {
    title: 'Peak Hour Status',
    icon: '⏰',
    desc: 'Rush hour pattern detection and prediction',
    color: '252, 208, 142',
  },
  {
    title: 'Accident Zone Heat',
    icon: '🔥',
    desc: 'Heatmap of high-frequency accident locations',
    color: '204, 142, 252',
  },
];

const stats = [
  { label: 'Active Zones', value: '2,847', change: '+12.5%', positive: true },
  { label: 'Predictions Today', value: '14,203', change: '+8.2%', positive: true },
  { label: 'Risk Alerts', value: '37', change: '-5.1%', positive: false },
];

export default function Dashboard() {
  return (
    <div className="page-wrapper dashboard-page">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Traffic Stress & Accident Risk Prediction — Real-time monitoring</p>
      </div>

      <div className="stats-row">
        {stats.map((s, i) => (
          <div className="stat-box" key={i}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-change ${s.positive ? 'positive' : 'negative'}`}>
              {s.change} from last week
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
