import React, { useEffect, useState } from 'react';
import axios from '../utils/axios'; // ✅ updated to use central axios

const AdminUsersTab = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Users</h2>
      <div className="overflow-auto max-h-[500px] border rounded">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-800 text-center">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Points</th>
              <th className="py-2 px-4 border">Admin?</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="text-center hover:bg-gray-50">
                <td className="py-2 px-4 border">{user.name}</td>
                <td className="py-2 px-4 border">{user.email}</td>
                <td className="py-2 px-4 border">₹{user.points}</td>
                <td className="py-2 px-4 border">{user.isAdmin ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersTab;
