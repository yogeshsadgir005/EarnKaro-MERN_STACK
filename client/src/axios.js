import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api', // 🔁 change this to match your backend
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`
  }
});

export default instance;
