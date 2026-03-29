// import express from 'express';
// import cors from 'cors';

// const app = express();
// const PORT = process.env.PORT || 5001;

// app.use(cors());
// app.use(express.json());

// // ─── Health / Status Endpoint ────────────────────────────────────────
// app.get('/api/status', (_req, res) => {
//   res.json({
//     status: 'online',
//     project: 'Traffic Stress & Accident Risk Prediction System',
//     version: '1.0.0',
//     uptime: process.uptime(),
//     timestamp: new Date().toISOString(),
//     modules: {
//       riskDetection: 'active',
//       weatherMonitor: 'active',
//       trafficDensity: 'active',
//       modelInference: 'standby',
//     },
//   });
// });

// // ─── Dummy Risk Data ──────────────────────────────────────────────────
// app.get('/api/risk', (_req, res) => {
//   res.json({
//     overallRisk: 'moderate',
//     score: 0.63,
//     zones: [
//       { id: 1, name: 'Zone A - Highway 101', risk: 0.82 },
//       { id: 2, name: 'Zone B - Downtown', risk: 0.45 },
//       { id: 3, name: 'Zone C - Suburban Ring', risk: 0.31 },
//     ],
//   });
// });

// // ─── Start Server ─────────────────────────────────────────────────────
// app.listen(PORT, () => {
//   console.log(`\n  🚀 TrafficSense API Server running at http://localhost:${PORT}\n`);
// });



// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================



// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================// ========================== IMPORTS ==========================
import express from 'express';
import cors from 'cors';

// ========================== APP INIT ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());

// ========================== LOGGER ==========================
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ========================== GLOBAL STORE ==========================
let events = [];
let trafficData = [];
let weatherData = [];
let alerts = [];

// ========================== UTIL FUNCTIONS ==========================
const generateId = () => Math.floor(Math.random() * 1000000);

const getRiskLevel = (score) => {
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'moderate';
  return 'low';
};

// ========================== HEALTH ==========================
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================== EVENTS ==========================
app.get('/api/events', (_req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const { name, priority } = req.body;
  const newEvent = {
    id: generateId(),
    name,
    priority,
  };
  events.push(newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;

  events = events.map((e) =>
    e.id === id ? { ...e, priority } : e
  );

  res.json({ message: 'Updated' });
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: 'Deleted' });
});

// ========================== TRAFFIC ==========================
app.get('/api/traffic', (_req, res) => {
  res.json(trafficData);
});

app.post('/api/traffic', (req, res) => {
  const data = {
    id: generateId(),
    density: req.body.density,
    zone: req.body.zone,
    timestamp: new Date(),
  };
  trafficData.push(data);
  res.json(data);
});

// ========================== WEATHER ==========================
app.get('/api/weather', (_req, res) => {
  res.json(weatherData);
});

app.post('/api/weather', (req, res) => {
  const data = {
    id: generateId(),
    rain: req.body.rain,
    visibility: req.body.visibility,
    timestamp: new Date(),
  };
  weatherData.push(data);
  res.json(data);
});

// ========================== ML SIMULATION ==========================
const calculateRisk = () => {
  return Math.random();
};

app.get('/api/risk', (_req, res) => {
  const score = calculateRisk();
  res.json({
    score,
    level: getRiskLevel(score),
  });
});

// ========================== ALERT SYSTEM ==========================
app.get('/api/alerts', (_req, res) => {
  res.json(alerts);
});

app.post('/api/alerts', (req, res) => {
  const alert = {
    id: generateId(),
    message: req.body.message,
    severity: req.body.severity,
  };
  alerts.push(alert);
  res.json(alert);
});

// ========================== ANALYTICS ==========================
app.get('/api/analytics/summary', (_req, res) => {
  res.json({
    totalEvents: events.length,
    trafficRecords: trafficData.length,
    weatherRecords: weatherData.length,
    alerts: alerts.length,
  });
});

// ========================== ERROR HANDLER ==========================
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ========================== SERVER ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ========================== EXTRA DUMMY MODULES ==========================

// Module 1
const module1 = () => {
  return "Module1 active";
};

// Module 2
const module2 = () => {
  return "Module2 active";
};

// Module 3
const module3 = () => {
  return "Module3 active";
};

// Module 4
const module4 = () => {
  return "Module4 active";
};

// Module 5
const module5 = () => {
  return "Module5 active";
};

// ========================== MORE ROUTES ==========================
app.get('/api/modules', (_req, res) => {
  res.json({
    m1: module1(),
    m2: module2(),
    m3: module3(),
    m4: module4(),
    m5: module5(),
  });
});

// ========================== FAKE LOAD ==========================
for (let i = 0; i < 100; i++) {
  events.push({
    id: generateId(),
    name: `Event-${i}`,
    priority: Math.random(),
  });
}

// ========================== MORE APIs ==========================
app.get('/api/debug', (_req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});

// ========================== SIMULATION ==========================
setInterval(() => {
  const newTraffic = {
    id: generateId(),
    density: Math.random(),
    zone: `Zone-${Math.floor(Math.random() * 5)}`,
    time: new Date(),
  };
  trafficData.push(newTraffic);
}, 5000);

// ========================== EVEN MORE ==========================
app.get('/api/full-report', (_req, res) => {
  res.json({
    events,
    trafficData,
    weatherData,
    alerts,
  });
});

// ========================== END ==========================
