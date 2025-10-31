
import axios from 'axios';

// Use a consistent API URL format - remove the '/api' from the base URL
// since our backend routes already include it
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('API URL being used:', API_URL); // Log the API URL being used

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent long-hanging requests
  timeout: 15000,
});

// Add a request interceptor to inject the auth token
api.interceptors.request.use((config) => {
  // Log outgoing requests for debugging
  console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log(`Received response from ${response.config.url}:`, response.status);
    return response;
  },
  async (error) => {
    if (error.response) {
      console.error(`API request error: ${error.response.status} ${error.response.statusText} for ${error.config.url}`);
    } else if (error.request) {
      console.error(`Network error: No response received for ${error.config.url}`);
    } else {
      console.error('API request error:', error.message);
    }
    
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/api/auth/refresh`, {
          refreshToken,
        });

        const { token } = response.data;
        localStorage.setItem('token', token);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (err) {
        // Refresh token is invalid, user needs to login again
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
