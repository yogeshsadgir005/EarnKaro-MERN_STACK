import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import Navbar from '../components/Navbar';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function PayoutHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/payout/history', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setHistory(res.data || []);
      } catch (err) {
        console.error('Failed to load payout history:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-yellow-300 text-black text-center p-2 font-bold text-sm">
        Join a platform where students and graduates find real tasks, land internships, and earn while building valuable skills
      </div>

      <main className="bg-black min-h-screen text-white p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-blue-400 flex items-center gap-2 hover:underline text-sm mb-4"
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">📤 Payout History</h2>

        {loading ? (
          <p className="text-center text-gray-400 animate-pulse">Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-center text-gray-500">No payouts yet.</p>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {history.map((entry) => (
              <div key={entry._id} className="bg-gray-800 p-4 rounded-lg shadow">
                <p><strong>Amount:</strong> ₹{entry.amount || 0}</p>
                <p><strong>Method:</strong> {(entry.method || 'N/A').toUpperCase()}</p>
                <p><strong>UTR:</strong> {entry.utr || 'Not Available'}</p>
                <p><strong>Status:</strong> {entry.status || 'Processing'}</p>
                <p className="text-xs text-gray-400">
                  Date: {new Date(entry.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
