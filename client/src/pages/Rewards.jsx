import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Navbar from '../components/Navbar';
import { FaMedal, FaTrophy, FaGift, FaArrowLeft } from 'react-icons/fa';

export default function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [taskRewards, setTaskRewards] = useState([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/user/rewards', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setRewards(res.data.rewards || []);
        setTaskRewards(res.data.taskRewards || []);
        setTotalEarned(res.data.totalEarned || 0);
      } catch (err) {
        console.error('Rewards Page Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-yellow-300 text-black text-center p-2 font-bold text-sm">
        Join a platform where students and graduates find real tasks, land internships, and earn while building valuable skills
      </div>

      <main className="bg-black min-h-screen text-white p-6 space-y-10">
        <button
          onClick={() => navigate(-1)}
          className="text-white flex items-center gap-2 hover:text-yellow-400"
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className="text-3xl font-bold text-center">🎁 My Rewards</h2>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 text-center shadow">
            <FaMedal className="text-yellow-400 text-3xl mx-auto mb-2" />
            <h3 className="text-xl font-bold">Total Earnings</h3>
            <p className="text-blue-400 font-semibold text-2xl">₹{totalEarned}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 text-center shadow">
            <FaTrophy className="text-green-400 text-3xl mx-auto mb-2" />
            <h3 className="text-xl font-bold">Tasks Completed</h3>
            <p className="text-green-300 text-2xl">
              {
                taskRewards.filter(r =>
                  r.status === 'completed' && r.credited
                ).length
              }
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 text-center shadow">
            <FaGift className="text-pink-400 text-3xl mx-auto mb-2" />
            <h3 className="text-xl font-bold">Your Rank</h3>
            <p className="text-pink-300 text-2xl">Coming Soon 🔒</p>
          </div>
        </div>

        {/* Reward History Table */}
        <section className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">🧾 Reward History</h3>
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : rewards.length === 0 ? (
            <p className="text-gray-400">No rewards yet. Start earning!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-700">
                    <th className="p-2">Title</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Credited</th>
                    <th className="p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rewards.slice().reverse().map((r, i) => (
                    <tr key={i} className="border-b border-gray-800">
                      <td className="p-2">{r.title}</td>
                      <td className="p-2 text-green-400 font-semibold">₹{r.amount}</td>
                      <td className="p-2 capitalize">{r.status}</td>
                      <td className="p-2">{r.credited ? '✅' : '❌'}</td>
                      <td className="p-2 text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
