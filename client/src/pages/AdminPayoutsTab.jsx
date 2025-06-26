import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPayoutsTab = () => {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState({});
  const [userFilter, setUserFilter] = useState('');
  const [taskFilter, setTaskFilter] = useState('All Tasks');

  const token = localStorage.getItem('token');

  const fetchRewards = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching rewards:', err);
    }
  };

  const handleStatusChange = async (userId, rewardIndex, newStatus) => {
    try {
      await axios.patch(
        'http://localhost:5000/api/admin/update-task-status',
        {
          userId,
          rewardIndex,
          newStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditing(prev => ({
        ...prev,
        [`${userId}-${rewardIndex}`]: false,
      }));
      fetchRewards();
    } catch (err) {
      console.error('Error updating reward:', err);
    }
  };

  const getFilteredData = () => {
    let filtered = users;

    if (userFilter.trim()) {
      filtered = filtered.filter(user =>
        user._id.trim().includes(userFilter.trim())
      );
    }

    return filtered.flatMap(user =>
      user.rewards
        ?.filter(reward =>
          taskFilter === 'All Tasks' ? true : reward.title === taskFilter
        )
        .map((reward, index) => ({
          userId: user._id,
          title: reward.title.replace(/^Install\s+/i, ''),
          originalTitle: reward.title,
          amount: reward.amount,
          status: reward.status || 'pending',
          rewardIndex: index,
        }))
    );
  };

  const taskNames = Array.from(
    new Set(users.flatMap(user => user.rewards?.map(r => r.title)))
  );

  const getStatusBadge = (status) => {
    const base = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (status.toLowerCase()) {
      case 'completed':
        return `${base} bg-green-100 text-green-700`;
      case 'failed':
        return `${base} bg-red-100 text-red-700`;
      case 'pending':
      default:
        return `${base} bg-yellow-100 text-yellow-700`;
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const filteredRewards = getFilteredData();

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Payout Requests</h2>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by User ID"
          className="border border-gray-300 px-4 py-2 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
        />

        <select
          className="border border-gray-300 px-4 py-2 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={taskFilter}
          onChange={(e) => setTaskFilter(e.target.value)}
        >
          <option>All Tasks</option>
          {taskNames.map((task, i) => (
            <option key={i} value={task}>
              {task}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-auto max-h-[500px] border rounded">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-center text-gray-700">
              <th className="py-3 px-4 border">User ID</th>
              <th className="py-3 px-4 border">Task</th>
              <th className="py-3 px-4 border">Amount</th>
              <th className="py-3 px-4 border">Status</th>
              <th className="py-3 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRewards.map((r, i) => {
              const key = `${r.userId}-${r.rewardIndex}`;
              const isEditing = editing[key];
              const isReferralBonus = r.originalTitle.toLowerCase().includes('referral');
              const isPending = r.status === 'pending';

              return (
                <tr
                  key={i}
                  className="text-center hover:bg-gray-50 transition duration-150"
                >
                  <td className="py-2 px-4 border">{r.userId}</td>
                  <td className="py-2 px-4 border">{r.title}</td>
                  <td className="py-2 px-4 border font-medium">₹{r.amount}</td>
                  <td className="py-2 px-4 border">
                    <span className={getStatusBadge(r.status)}>{r.status}</span>
                  </td>
                  <td className="py-2 px-4 border space-x-2">
                    {!isReferralBonus && (
                      isPending ? (
                        <>
                          <button
                            onClick={() => handleStatusChange(r.userId, r.rewardIndex, 'completed')}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(r.userId, r.rewardIndex, 'failed')}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                          >
                            Reject
                          </button>
                        </>
                      ) : isEditing ? (
                        <>
                          <button
                            onClick={() => handleStatusChange(r.userId, r.rewardIndex, 'completed')}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(r.userId, r.rewardIndex, 'failed')}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            setEditing(prev => ({
                              ...prev,
                              [key]: true,
                            }))
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                        >
                          Edit Status
                        </button>
                      )
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredRewards.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500 italic">
                  No matching payouts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayoutsTab;
