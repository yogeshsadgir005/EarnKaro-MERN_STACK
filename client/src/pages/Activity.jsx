import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Navbar from '../components/Navbar';
import { FaArrowLeft } from 'react-icons/fa';

export default function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await axios.get('/user/rewards', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setActivities(res.data.rewards || []);
      } catch (err) {
        console.error('Error fetching activity:', err?.response?.data || err.message);
        setError('Failed to load activity.');
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  const statusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-yellow-300 text-black text-center p-2 font-bold text-sm">
        Join a platform where students and graduates find real tasks, land internships, and earn while building valuable skills
      </div>

      <div className="p-6 text-white bg-black min-h-screen">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-blue-400 hover:text-white"
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className="text-xl font-bold mb-4">📋 My Activity</h2>

        {loading ? (
          <p className="animate-pulse">Loading activity...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : activities.length === 0 ? (
          <p>No activity yet. Complete some tasks!</p>
        ) : (
          <ul className="space-y-3">
            {activities
              .slice()
              .reverse()
              .map((a, i) => (
                <li
                  key={i}
                  className="bg-gray-800 p-4 rounded-md shadow flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-lg">{a.title}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(a.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {a.status === 'completed' && (
                      <p className="text-blue-400 font-bold">+ ₹{a.amount}</p>
                    )}
                    <p className={`text-sm font-medium mt-1 ${statusColor(a.status)}`}>
                      {a.status?.charAt(0).toUpperCase() + a.status?.slice(1) || 'Pending'}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </>
  );
}
