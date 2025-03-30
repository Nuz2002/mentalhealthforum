import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // read from .env

const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // e.g. "https://your-api-server.com"
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
