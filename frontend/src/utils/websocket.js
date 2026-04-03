/**
 * WebSocket client for real-time risk updates
 */

class WebSocketClient {
  constructor(url, handlers = {}) {
    this.url = url;
    this.handlers = {
      onOpen: handlers.onOpen || (() => {}),
      onMessage: handlers.onMessage || (() => {}),
      onClose: handlers.onClose || (() => {}),
      onError: handlers.onError || (() => {}),
    };
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.reconnectAttempts = 0;
        this.handlers.onOpen();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handlers.onMessage(data);
        } catch {
          console.warn("Failed to parse WebSocket message");
        }
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.handlers.onClose();
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.handlers.onError(error);
      };
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      this.handlers.onError(error);
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), this.reconnectDelay);
    }
  }

  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

export default WebSocketClient;
