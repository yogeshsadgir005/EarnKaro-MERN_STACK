import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { FaArrowLeft } from 'react-icons/fa';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', age: '', referralCode: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [otpAlreadySent, setOtpAlreadySent] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSendOtp = async e => {
  e.preventDefault();
  if (otpAlreadySent) return;

  setMessage({ type: '', text: '' });
  setLoading(true);

  try {

    const emailCheck = await axios.post('/auth/check-email', {
      email: formData.email,
    });

    if (emailCheck.data.exists) {
      setMessage({ type: 'error', text: 'Email is already registered. Please log in instead.' });
      setLoading(false);
      return;
    }

   
    await axios.post('/auth/send-otp', {
      email: formData.email
    });

    localStorage.setItem('signupData', JSON.stringify(formData));
    setOtpAlreadySent(true);
    setMessage({ type: 'success', text: 'OTP sent to your email ✅' });

    setTimeout(() => navigate('/verify-otp'), 1000);
  } catch (err) {
    setMessage({
      type: 'error',
      text: err?.response?.data?.message || 'Failed to send OTP.'
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
     
      <div className="bg-yellow-400 text-black text-sm text-center py-2 font-semibold">
        Join a platform where students and graduates find real tasks, land internships, and earn while building valuable skills
      </div>

    
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-blue-400 px-6 mt-4 hover:underline"
      >
        <FaArrowLeft /> Back
      </button>

      
      {message.text && (
        <div className={`mx-auto mt-4 max-w-md px-4 py-3 rounded-md text-center text-sm font-medium ${
          message.type === 'success'
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {message.text}
        </div>
      )}

      
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div className="bg-[#0a0a0a] border border-blue-500 rounded-xl w-full max-w-md p-6 space-y-5 shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-400 text-center">
            👋 Create Your Account
          </h2>

          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              onChange={handleChange}
              className="bg-[#222] text-white px-4 py-3 rounded-md placeholder-gray-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              required
              onChange={handleChange}
              className="bg-[#222] text-white px-4 py-3 rounded-md placeholder-gray-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="bg-[#222] text-white px-4 py-3 rounded-md placeholder-gray-400"
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              required
              onChange={handleChange}
              className="bg-[#222] text-white px-4 py-3 rounded-md placeholder-gray-400"
            />
            <input
              type="text"
              name="referralCode"
              placeholder="Referral Code (optional)"
              onChange={handleChange}
              className="bg-[#222] text-white px-4 py-3 rounded-md placeholder-gray-400"
            />

            <button
              type="submit"
              disabled={otpAlreadySent}
              className={`${
                otpAlreadySent ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              } text-white font-semibold py-3 rounded-md transition flex items-center justify-center`}
            >
              {loading ? (
                <span className="animate-spin border-t-2 border-white rounded-full h-5 w-5"></span>
              ) : otpAlreadySent ? 'OTP Sent' : 'Send OTP'}
            </button>
          </form>

          <p className="text-sm text-center">
            Already have an account?{' '}
            <a href="/login" className="text-blue-400 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
