import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 5000,
});

//attach token to every requests
API.interceptors.request.use((config) => {
  const raw = localStorage.getItem('bd_token');
  if (raw) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${raw}`;
  }
  return config;
},error => Promise.reject(error));

export default API;
