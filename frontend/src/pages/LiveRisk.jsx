import { useEffect, useMemo, useRef, useState } from 'react';
import api from '../lib/api';
import { createLiveRiskSocket } from '../lib/ws';
import '../styles/liverisk.css';

function getRiskLevel(score) {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 35) return 'moderate';
  return 'low';
}

function getRiskColor(level) {
  switch (level) {
    case 'critical':
      return '#ff2b2b';
    case 'high':
      return '#ff8c00';
    case 'moderate':
      return '#ffd700';
    case 'low':
      return '#00e676';
    default:
      return '#666';
  }
}

export default function LiveRisk() {
  const [isActive, setIsActive] = useState(false);
  const [connected, setConnected] = useState(false);
  const [wsData, setWsData] = useState(null);
  const [lastPrediction, setLastPrediction] = useState(null);
  const [error, setError] = useState('');
  const wsRef = useRef(null);
  const simulationRef = useRef(null);

  useEffect(() => {
    if (!isActive) {
      setConnected(false);
      setWsData(null);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
        simulationRef.current = null;
      }
      return;
    }

    const ws = createLiveRiskSocket();
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setError('');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setWsData(data);
      } catch {
        // Ignore malformed frames.
      }
    };

    ws.onerror = () => {
      setConnected(false);
      setError('WebSocket connection error');
    };

    ws.onclose = () => {
      setConnected(false);
    };

    const pushSimulatedData = async () => {
      try {
        const payload = {
          speed: Number((45 + Math.random() * 80).toFixed(2)),
          visibility: Number((20 + Math.random() * 80).toFixed(2)),
          driver_state: Math.random() > 0.75 ? 'drowsy' : 'alert',
        };
        const resp = await api.post('/risk/predict', payload);
        setLastPrediction(resp.data);
      } catch (e) {
        setError(e.response?.data?.error || 'Prediction API failed');
      }
    };

    pushSimulatedData();
    simulationRef.current = setInterval(pushSimulatedData, 4000);

    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
        simulationRef.current = null;
      }
      ws.close();
      wsRef.current = null;
    };
  }, [isActive]);

  const riskScore = wsData?.riskScore ?? 0;
  const riskLevel = useMemo(() => getRiskLevel(riskScore), [riskScore]);
  const riskColor = getRiskColor(riskLevel);

  return (
    <div className="page-wrapper liverisk-page">
      <div className={`risk-bg-glow${isActive ? ' active' : ''}`}></div>

      <div className="page-header">
        <h1>Live Risk Detection</h1>
        <p>Authenticated WebSocket streaming with real-time risk signals</p>
      </div>

      {error && <div className="analytics-error">{error}</div>}

      <div className="risk-control-panel">
        <label className="torch-container">
          <div className="torch-text">Activate AI Monitoring</div>
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => setIsActive((v) => !v)}
          />
          <div className="checkmark"></div>
          <div className="torch">
            <div className="torch-head">
              <div className="torch-face top"><div></div><div></div><div></div><div></div></div>
              <div className="torch-face left"><div></div><div></div><div></div><div></div></div>
              <div className="torch-face right"><div></div><div></div><div></div><div></div></div>
            </div>
            <div className="torch-stick">
              <div className="torch-side side-left"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              <div className="torch-side side-right"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
          </div>
        </label>

        <div className={`risk-status-panel ${isActive ? 'active' : 'inactive'}`}>
          <div className="risk-status-label">AI Monitoring Status</div>
          <div className={`risk-status-value ${isActive ? 'active' : 'inactive'}`}>
            {isActive ? (connected ? '● CONNECTED' : '● CONNECTING…') : '○ INACTIVE'}
          </div>
        </div>

        {isActive && (
          <div className="risk-live-section">
            <div className="risk-score-gauge" style={{ borderColor: riskColor }}>
              <div className="risk-score-number" style={{ color: riskColor }}>
                {riskScore.toFixed(2)}
              </div>
              <div className="risk-score-label">Driver Risk Score</div>
              <div className="risk-level-badge" style={{ background: riskColor }}>
                {riskLevel.toUpperCase()}
              </div>
            </div>

            <div className="risk-modules-row">
              <div className="risk-module-card online">
                <div className="module-header">
                  <span className="module-icon">📡</span>
                  <span className="module-title">WebSocket Payload</span>
                  <span className="module-dot on"></span>
                </div>
                <div className="module-body">
                  <div className="module-metric"><span>User</span><strong>{wsData?.userId || '—'}</strong></div>
                  <div className="module-metric"><span>Timestamp</span><strong>{wsData?.timestamp || '—'}</strong></div>
                  <div className="module-metric"><span>Signals</span><strong>{wsData?.signals?.length ?? 0}</strong></div>
                </div>
              </div>

              <div className="risk-module-card online">
                <div className="module-header">
                  <span className="module-icon">🧠</span>
                  <span className="module-title">Risk API Prediction</span>
                  <span className="module-dot on"></span>
                </div>
                <div className="module-body">
                  <div className="module-metric">
                    <span>riskScore</span>
                    <strong>{lastPrediction?.riskScore?.toFixed?.(2) ?? '—'}</strong>
                  </div>
                  <div className="module-metric">
                    <span>accidentProbability</span>
                    <strong>{lastPrediction?.accidentProbability ?? '—'}</strong>
                  </div>
                  <div className="module-metric">
                    <span>signals</span>
                    <strong>{lastPrediction?.signals?.length ?? 0}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
