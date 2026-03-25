export function createLiveRiskSocket() {
  const token = localStorage.getItem('auth_token');
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const url = `${protocol}://${window.location.host}/ws/live-risk?token=${encodeURIComponent(token || '')}`;
  return new WebSocket(url);
}
