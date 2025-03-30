// apiClient.js
import axios from 'axios';

// We'll store tokens in localStorage for demo purposes.
// In production, consider HttpOnly cookies for better security.
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';


const apiClient = axios.create({
  baseURL: `${ API_BASE_URL }`,
  withCredentials: true,
});


// Attach the access token to every request
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  // console.log('Attaching token:', token);
  if (token) {
    config.headers['Authorization'] = `Bearer ${token.trim()}`;
  }
  return config;
});

// Response interceptor for automatic token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401, try to refresh the token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Mark the request to avoid infinite loops
      originalRequest._retry = true;ws://localhost:8080/ws/435/sova3cay/websocket

      // Only start the refresh process once
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = getRefreshToken();

        try {
          // Call your refresh endpoint
          const { data } = await axios.post(
            `${process.env.VITE_API_BASE_URL}/api/auth/refresh`,
            {
              refreshToken,
            },
            { withCredentials: true }
          );

          // Store new access token (and possibly refresh token if it changed)
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);

          // Notify all subscribers that we have a new token
          isRefreshing = false;
          onRefreshed(data.accessToken);
        } catch (refreshError) {
          // Refresh failed, force logout or handle gracefully
          isRefreshing = false;
          console.error('Refresh token error:', refreshError);
          // Optionally clear localStorage and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // Return a promise that resolves once the token is refreshed
      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          // Update the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          resolve(axios(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
