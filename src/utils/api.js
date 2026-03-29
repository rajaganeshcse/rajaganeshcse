import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'https://website-backend-8v6m.onrender.com/api';
export const MEDIA = process.env.REACT_APP_MEDIA_URL || 'https://website-backend-8v6m.onrender.com';

const API = axios.create({ baseURL: BASE });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
