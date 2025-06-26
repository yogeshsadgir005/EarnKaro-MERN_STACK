// src/utils/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://skillmint-backend1-uhjb.onrender.com/api', // ✅ Live backend URL
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
