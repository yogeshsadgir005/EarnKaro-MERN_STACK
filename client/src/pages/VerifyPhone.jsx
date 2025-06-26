import { useState } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

export default function VerifyPhone() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      await axios.post('/auth/send-otp', { phone }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStep(2);
    } catch {
      alert('Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post('/auth/verify-otp', { phone, otp }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('✅ Phone Verified');
      navigate('/payout');
    } catch {
      alert('❌ Invalid OTP');
    }
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen flex items-center justify-center">
      <div className="max-w-sm w-full bg-gray-800 p-6 rounded-xl shadow-lg">
        {step === 1 ? (
          <>
            <label className="block mb-2">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone"
              className="w-full p-3 rounded bg-gray-700 text-white mb-4"
            />
            <button
              onClick={sendOtp}
              className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <label className="block mb-2">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full p-3 rounded bg-gray-700 text-white mb-4"
            />
            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 py-2 rounded hover:bg-green-700"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}
