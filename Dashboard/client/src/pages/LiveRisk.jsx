import { useState } from 'react';
import '../styles/liverisk.css';

export default function LiveRisk() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="page-wrapper liverisk-page">
      <div className={`risk-bg-glow${isActive ? ' active' : ''}`}></div>

      <div className="page-header">
        <h1>Live Risk Detection</h1>
        <p>Toggle AI-powered real-time accident risk monitoring system</p>
      </div>

      <div className="risk-control-panel">
        {/* Torch Toggle — exact Uiverse component */}
        <label className="torch-container">
          <div className="torch-text">Activate AI Monitoring</div>
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
          />
          <div className="checkmark"></div>
          <div className="torch">
            <div className="torch-head">
              <div className="torch-face top">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div className="torch-face left">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div className="torch-face right">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div className="torch-stick">
              <div className="torch-side side-left">
                <div></div><div></div><div></div><div></div>
                <div></div><div></div><div></div><div></div>
                <div></div><div></div><div></div><div></div>
                <div></div><div></div><div></div><div></div>
              </div>
              <div className="torch-side side-right">
                <div></div><div></div><div></div><div></div>
                <div></div><div></div><div></div><div></div>
                <div></div><div></div><div></div><div></div>
                <div></div><div></div><div></div><div></div>
              </div>
            </div>
          </div>
        </label>

        {/* Status Panel */}
        <div className={`risk-status-panel ${isActive ? 'active' : 'inactive'}`}>
          <div className="risk-status-label">AI Monitoring Status</div>
          <div
            className={`risk-status-value ${isActive ? 'active' : 'inactive'}`}
            key={isActive ? 'active' : 'inactive'}
          >
            {isActive ? '● ACTIVE' : '○ INACTIVE'}
          </div>
        </div>

        {/* Info Cards */}
        <div className="risk-info-row">
          <div className="risk-info-card">
            <div className="info-icon">🎯</div>
            <div className="info-title">Accuracy</div>
            <div className="info-value">{isActive ? '94.7%' : '—'}</div>
          </div>
          <div className="risk-info-card">
            <div className="info-icon">⚡</div>
            <div className="info-title">Latency</div>
            <div className="info-value">{isActive ? '12ms' : '—'}</div>
          </div>
          <div className="risk-info-card">
            <div className="info-icon">📡</div>
            <div className="info-title">Data Points</div>
            <div className="info-value">{isActive ? '1.2M' : '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
