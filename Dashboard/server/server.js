import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// ─── Health / Status Endpoint ────────────────────────────────────────
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    project: 'Traffic Stress & Accident Risk Prediction System',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    modules: {
      riskDetection: 'active',
      weatherMonitor: 'active',
      trafficDensity: 'active',
      modelInference: 'standby',
    },
  });
});

// ─── Dummy Risk Data ──────────────────────────────────────────────────
app.get('/api/risk', (_req, res) => {
  res.json({
    overallRisk: 'moderate',
    score: 0.63,
    zones: [
      { id: 1, name: 'Zone A - Highway 101', risk: 0.82 },
      { id: 2, name: 'Zone B - Downtown', risk: 0.45 },
      { id: 3, name: 'Zone C - Suburban Ring', risk: 0.31 },
    ],
  });
});

// ─── Start Server ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🚀 TrafficSense API Server running at http://localhost:${PORT}\n`);
});
