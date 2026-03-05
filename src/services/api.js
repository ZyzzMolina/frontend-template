const API_URL = "http://localhost:4000/api"; // Importante colocar la url de tu api

export const api = {
  post: async (endpoint, body) => {
    try {
      const token = localStorage.getItem('token');
      console.log(`POST a: ${API_URL}${endpoint}, Token: ${token}`);
      
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      });
      console.log(`Response status: ${response.status}`);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      console.log(`Datos recibidos:`, data);
      return data;
    } catch (error) {
      console.error("Error en POST:", error);
      throw error;
    }
  },
  get: async (endpoint) => {
    try {
      const token = localStorage.getItem('token');
      console.log(`GET a: ${API_URL}${endpoint}, Token: ${token}`);
      
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: headers
      });
      console.log(`Response status: ${response.status}`);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      console.log(`Datos recibidos:`, data);
      return data;
    } catch (error) {
      console.error("Error en GET:", error);
      throw error;
    }
  }
};