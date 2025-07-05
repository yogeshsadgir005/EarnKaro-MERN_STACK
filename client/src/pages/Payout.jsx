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
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/user/profile');
        setUpiId(res.data.upiId || '');
        setBank(res.data.bank || { holderName: '', accountNumber: '', ifsc: '' });
        setUserPoints(res.data.points || 0);
      } catch (err) {
        console.error("Failed to load profile:", err.message);
      }
    };
    fetch();
  }, []);

  const handleSubmit = async () => {
    const numericAmount = Number(amount);
    setStatus('');

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      return setStatus('Error: Please enter a valid payout amount.');
    }

    if (numericAmount < 100) {
      return setStatus('Error: Minimum payout amount is ₹100.');
    }

    if (numericAmount > userPoints) {
      return setStatus(`Error: You only have ₹${userPoints} in your wallet.`);
    }

    if (method === 'upi' && (!upiId || upiId.trim() === '')) {
      return setStatus('Error: UPI ID is required.');
    }

    if (method === 'bank') {
      if (
        !bank.holderName.trim() ||
        !bank.accountNumber.trim() ||
        !bank.ifsc.trim()
      ) {
        return setStatus('Error: All bank details are required.');
      }
    }

    setLoading(true);

    try {
      const payload = {
        method,
        amount: numericAmount,
        ...(method === 'upi' ? { upiId } : { bank }),
      };

      const res = await axios.post('/payout', payload);
      setStatus(res.data.message || 'Payout request sent!');
      setAmount('');

      setTimeout(() => navigate('/wallet'), 100);
    } catch (err) {
      setStatus(err.response?.data?.message || 'Error submitting payout.');
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

          <h2 className="text-2xl font-bold mb-4 text-center">💸 Request Payout</h2>

          <p className="text-center text-sm text-gray-400 mb-6">
            Available Balance: <span className="text-green-400 font-semibold">₹{userPoints}</span>
          </p>

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
              Bank
            </button>
          </div>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount (₹)"
            className="w-full p-3 bg-gray-800 rounded text-white mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          {method === 'upi' ? (
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. yogesh@upi"
              className="w-full p-3 bg-gray-800 rounded text-white mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          ) : (
            <>
              <input
                type="text"
                value={bank.holderName}
                onChange={(e) => setBank({ ...bank, holderName: e.target.value })}
                placeholder="Account Holder Name"
                className="w-full p-3 bg-gray-800 rounded text-white mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="text"
                value={bank.accountNumber}
                onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })}
                placeholder="Account Number"
                className="w-full p-3 bg-gray-800 rounded text-white mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="text"
                value={bank.ifsc}
                onChange={(e) => setBank({ ...bank, ifsc: e.target.value })}
                placeholder="IFSC Code"
                className="w-full p-3 bg-gray-800 rounded text-white mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-bold transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Submit Request'}
          </button>

          {status && (
            <p
              className={`mt-4 text-center font-medium ${
                status.startsWith('Error') ? 'text-red-400' : 'text-green-400'
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
