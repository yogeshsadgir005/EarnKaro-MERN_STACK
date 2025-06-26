import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Navbar from '../components/Navbar';
import { FaArrowLeft } from 'react-icons/fa';

export default function Wallet() {
  const [user, setUser] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const userRes = await axios.get('/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data.user || userRes.data);

        const rewardRes = await axios.get('/user/rewards', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRewards(rewardRes.data.rewards || []);
      } catch (err) {
        console.error('Wallet Error:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [navigate]);

  const totalBalance = rewards.reduce(
    (sum, r) => r.credited && r.status === 'completed' ? sum + r.amount : sum,
    0
  );

  return (
    <>
      <Navbar />
      <div className="bg-yellow-300 text-black text-center p-2 font-bold text-sm">
        Join a platform where students and graduates find real tasks, land internships, and earn while building valuable skills
      </div>

      <main className="bg-black min-h-screen text-white p-6 space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-400 flex items-center gap-2 hover:underline text-sm"
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className="text-3xl font-bold text-center">💰 My Wallet</h2>

        <section className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
          <p className="text-gray-400">Total Earnings</p>
          <h3 className="text-4xl font-extrabold text-blue-400 my-2">₹{totalBalance}</h3>
          <button
            onClick={() => navigate('/payout')}
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
          >
            Request Payout
          </button>
          <button
            onClick={() => navigate('/payout-history')}
            className="text-sm text-yellow-300 hover:text-yellow-500 block mt-2"
          >
            View My Payouts →
          </button>
        </section>

        <section className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">🧾 Reward History</h3>
          {rewards.length === 0 ? (
            <p className="text-gray-400">No rewards yet. Complete tasks to earn!</p>
          ) : (
            <div className="space-y-3">
              {rewards
                .slice()
                .reverse()
                .map((r, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-gray-900 p-4 rounded-md"
                  >
                    <div>
                      <p className="font-semibold text-white">{r.title}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(r.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-green-400 font-bold">+ ₹{r.amount}</span>
                  </div>
                ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
