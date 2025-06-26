import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from '../utils/axios';
import { FaArrowLeft } from 'react-icons/fa';

export default function Leaderboard() {
  const [range, setRange] = useState('overall');
  const [topUsers, setTopUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLeaderboard = async (selectedRange) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`/user/leaderboard?range=${selectedRange}`, { headers });

      // 👇 Just to be safe, filter admins if backend somehow misses it
      const filteredTop = (res.data.top || []).filter((user) => !user.isAdmin);

      setTopUsers(filteredTop);
      setCurrentUser(res.data.currentUser || null);
    } catch (err) {
      console.error("Leaderboard fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(range);
  }, [range]);

  return (
    <>
      <Navbar />
      <div className="bg-yellow-300 text-black text-center p-2 font-bold text-sm">
        Join a platform where students and graduates find real tasks, land internships, and earn while building valuable skills
      </div>

      <main className="bg-black text-white min-h-screen p-6 space-y-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-white flex items-center gap-2 hover:text-yellow-300 mb-2"
        >
          <FaArrowLeft /> Back
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6">🏆 Leaderboard</h2>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-6 gap-3 flex-wrap">
          {['monthly', 'weekly', 'overall'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                range === r ? 'bg-yellow-300 text-black' : 'bg-gray-700 text-white'
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Leaderboard List */}
        <div className="bg-gray-900 rounded-xl p-4 space-y-4">
          {loading ? (
            <p className="text-center text-gray-400 animate-pulse">Loading leaderboard...</p>
          ) : topUsers.length === 0 ? (
            <p className="text-center text-gray-400">No data available.</p>
          ) : (
            topUsers.map((user, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="text-xl w-8 text-center">
                    {user.rank}{' '}
                    {user.rank === 1
                      ? '🥇'
                      : user.rank === 2
                      ? '🥈'
                      : user.rank === 3
                      ? '🥉'
                      : ''}
                  </div>
                  <div>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-gray-400 text-sm">Student</p>
                  </div>
                </div>
                <div className="font-bold text-blue-400">{user.points} pts</div>
              </div>
            ))
          )}
        </div>

        {/* Current User (if outside Top 7 and not admin) */}
        {!loading &&
          currentUser &&
          !currentUser.isAdmin &&
          currentUser.rank > 7 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-center text-gray-400 mb-2">Your Rank</h3>
              <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg border border-yellow-400">
                <div className="flex items-center gap-4">
                  <div className="text-lg w-8 text-center">#{currentUser.rank}</div>
                  <div>
                    <p className="font-bold text-yellow-300">You</p>
                    <p className="text-gray-400 text-sm">Student</p>
                  </div>
                </div>
                <div className="font-bold text-yellow-300">{currentUser.points} pts</div>
              </div>
            </div>
          )}
      </main>
    </>
  );
}

