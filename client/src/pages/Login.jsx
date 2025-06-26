import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { FaArrowLeft } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [statusMsg, setStatusMsg] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatusMsg({}); // clear previous status

    try {
      const res = await axios.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('isAdmin', res.data.user.isAdmin);

      setStatusMsg({ type: 'success', message: 'Login successful!' });

      setTimeout(() => {
        if (res.data.user.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      }, 1000); // Give time to show prompt
    } catch (err) {
      console.error('Login error:', err);
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setStatusMsg({ type: 'error', message });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top Announcement */}
      <div className="bg-yellow-400 text-black text-sm text-center py-2 font-semibold">
        Join a platform where students and graduates find real tasks, land internships, and earn while building valuable skills
      </div>

      {/* Back Button */}
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="text-white flex items-center gap-2 hover:text-yellow-400 transition"
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      {/* Status Message */}
      {statusMsg.message && (
        <div
          className={`mx-auto mb-4 text-center px-4 py-3 rounded-md max-w-md w-full ${
            statusMsg.type === 'success'
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}
        >
          {statusMsg.message}
        </div>
      )}

      {/* Login Card */}
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div className="bg-[#0a0a0a] border border-blue-500 rounded-xl w-full max-w-md p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-400 text-center mb-6">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
              className="bg-[#222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="bg-[#222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition"
            >
              Log In
            </button>
          </form>

          {/* Signup & Admin Links */}
          <p className="text-sm text-center mt-4">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-blue-400 hover:underline">
              Sign up
            </a>
          </p>

          <p className="text-sm text-center mt-2">
            Are you an admin?{' '}
            <a href="/admin-login" className="text-red-400 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
