import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ setIsAdmin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data;

      if (!user.isAdmin) {
        alert('Access denied: Not an admin');
        return;
      }

      // ✅ Save in localStorage and set state
      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', 'true');
      setIsAdmin(true); // 🔥 This is what triggers re-render in App.jsx

      navigate('/admin');
    } catch (err) {
      alert('Login failed');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleAdminLogin} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
        <input
          type="email"
          placeholder="Admin Email"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
        <p className="text-sm text-center mt-4">
          Back to{' '}
          <a href="/login" className="text-yellow-500 hover:underline">
            User Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;
