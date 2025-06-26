import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import axios from '../utils/axios';

export default function Payout() {
  const [method, setMethod] = useState('upi'); 
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bank, setBank] = useState({ holderName: '', accountNumber: '', ifsc: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUpiId(res.data.upiId || '');
        setBank(res.data.bank || { holderName: '', accountNumber: '', ifsc: '' });
      } catch (err) {
        console.error("Failed to load profile:", err.message);
      }
    };
    fetch();
  }, []);

const handleSubmit = async () => {
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    return alert('Please enter a valid payout amount.');
  }

  setLoading(true);
  setStatus('');

  try {

    const profileRes = await axios.get('/user/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    if (!profileRes.data.phone || profileRes.data.phoneVerified !== true) {
    
      navigate('/verify-phone');
      return;
    }


    const payload = {
      method,
      amount,
      ...(method === 'upi' ? { upiId } : { bank })
    };


    const res = await axios.post('/payout', payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    setStatus(res.data.message || '✅ Payout requested successfully!');
  } catch (err) {
    setStatus('❌ Failed to request payout. Try again later.');
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <Navbar />
      <div className="bg-yellow-300 text-black text-center p-2 font-bold text-sm">
        Request your earnings securely via UPI or Bank Transfer
      </div>

      <div className="bg-black min-h-screen p-6 flex justify-center items-center">

     <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 rounded-2xl shadow-xl w-full max-w-xl">
      
          <button
            onClick={() => navigate(-1)}
            className="text-white flex items-center gap-2 mb-6 hover:text-yellow-400"
          >
            <FaArrowLeft /> Back
          </button>

          <h2 className="text-2xl font-bold mb-6 text-center">💸 Request Payout</h2>

  
          <div className="flex gap-4 mb-6 justify-center">
            <button
              onClick={() => setMethod('upi')}
              className={`px-4 py-2 rounded-full font-semibold text-sm ${
                method === 'upi' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              UPI
            </button>
            <button
              onClick={() => setMethod('bank')}
              className={`px-4 py-2 rounded-full font-semibold text-sm ${
                method === 'bank' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              Bank Account
            </button>
          </div>

        
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-3 bg-gray-800 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {method === 'upi' ? (
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-1">UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g., you@bank"
                className="w-full p-3 bg-gray-800 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Account Holder Name</label>
                <input
                  type="text"
                  value={bank.holderName}
                  onChange={(e) => setBank({ ...bank, holderName: e.target.value })}
                  placeholder="e.g., Rahul Sharma"
                  className="w-full p-3 bg-gray-800 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Account Number</label>
                <input
                  type="text"
                  value={bank.accountNumber}
                  onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })}
                  placeholder="e.g., 1234567890"
                  className="w-full p-3 bg-gray-800 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={bank.ifsc}
                  onChange={(e) => setBank({ ...bank, ifsc: e.target.value })}
                  placeholder="e.g., SBIN0001234"
                  className="w-full p-3 bg-gray-800 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-bold transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Submit Payout Request'}
          </button>

          {status && (
            <p
              className={`mt-4 text-center font-medium ${
                status.startsWith('✅') ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {status}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
