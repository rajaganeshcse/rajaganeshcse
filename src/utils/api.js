import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
export const MEDIA = process.env.REACT_APP_MEDIA_URL || 'http://localhost:8000';

const API = axios.create({ baseURL: BASE });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
