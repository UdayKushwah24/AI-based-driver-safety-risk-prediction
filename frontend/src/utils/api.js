/**
 * API client utility for consistent request handling
 */

const API_BASE = "";

class APIClient {
  static async request(method, endpoint, body = null, headers = {}) {
    const url = `${API_BASE}${endpoint}`;
    const token = localStorage.getItem("auth_token");
    
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || "Request failed");
      }

      return data;
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  static get(endpoint) {
    return this.request("GET", endpoint);
  }

  static post(endpoint, body) {
    return this.request("POST", endpoint, body);
  }

  static put(endpoint, body) {
    return this.request("PUT", endpoint, body);
  }

  static delete(endpoint) {
    return this.request("DELETE", endpoint);
  }
}

export default APIClient;
