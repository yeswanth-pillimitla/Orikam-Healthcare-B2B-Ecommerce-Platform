import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if it exists in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('orikam_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 unauthorized errors (token expired/invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and reload or let user state reset
      localStorage.removeItem('orikam_token');
      // Optional: window.location.href = '/auth'; // or trigger logout state
    }
    return Promise.reject(error);
  }
);

export default api;
