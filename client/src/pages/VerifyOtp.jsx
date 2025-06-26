import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('signupData'));
    if (!storedData) {
      setMessage("Signup data missing.");
      navigate('/signup');
    } else {
      setFormData(storedData);
    }
  }, [navigate]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage('');
    setVerifying(true);
    try {
      const res = await axios.post('/auth/verify-otp', { ...formData, otp });
      localStorage.setItem('token', res.data.token);
      localStorage.removeItem('signupData');
      navigate('/home');
    } catch (err) {
      setMessage(err?.response?.data?.message || "Invalid OTP.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || resending || !formData?.email) return;

    setResending(true);
    try {
      await axios.post('/auth/send-otp', {
        email: formData.email,
        contact: formData.contact
      });
      setMessage("OTP resent to your email ✅");
      setResendTimer(30);
    } catch (err) {
      setMessage("Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="bg-[#0a0a0a] border border-blue-500 rounded-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-blue-400 text-center mb-6">Enter OTP</h2>
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="bg-[#222] text-white px-4 py-3 rounded-md"
          />

          <button
            type="submit"
            className={`${
              verifying ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-semibold py-3 rounded-md transition flex items-center justify-center`}
          >
            {verifying ? (
              <span className="animate-spin border-t-2 border-white rounded-full h-5 w-5 border-r-2 border-l-transparent border-b-transparent"></span>
            ) : (
              'Verify & Sign Up'
            )}
          </button>

          {message && (
            <p className="text-sm text-yellow-400 text-center mt-2 transition-opacity duration-300">
              {message}
            </p>
          )}

          <p className="text-sm text-center mt-2">
            Didn’t receive OTP?{' '}
            {resendTimer > 0 ? (
              <span className="text-gray-400">Resend in {resendTimer}s</span>
            ) : (
              <span
                onClick={handleResend}
                className={`text-blue-400 cursor-pointer hover:underline transition duration-300 ${
                  resending ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                {resending ? 'Sending...' : 'Resend'}
              </span>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
