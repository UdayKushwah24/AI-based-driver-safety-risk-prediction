import { useEffect, useState } from 'react';
import api from '../lib/api';
import '../styles/alerthistory.css';

export default function AlertHistory() {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const resp = await api.get('/alerts');
        setAlerts(resp.data.alerts || []);
      } catch (e) {
        setError(e.response?.data?.error || 'Unable to fetch alerts');
      }
    };

    loadAlerts();
  }, []);

  return (
    <div className="page-wrapper alert-history-page">
      <div className="page-header">
        <h1>Alert History</h1>
        <p>AI-Based Driver Safety Risk Prediction System</p>
      </div>

      {error && <div className="alert-history-error">{error}</div>}

      <div className="alert-history-table-wrap">
        <table className="alert-history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Alert Type</th>
              <th>Severity</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-row">No alerts available</td>
              </tr>
            ) : (
              alerts.map((alert) => {
                const dt = new Date(alert.timestamp);
                return (
                  <tr key={alert.id}>
                    <td>{dt.toLocaleDateString()}</td>
                    <td>{alert.alert_type}</td>
                    <td className={`severity-${alert.severity}`}>{alert.severity}</td>
                    <td>{dt.toLocaleTimeString()}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
