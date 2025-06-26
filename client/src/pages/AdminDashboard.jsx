import React, { useState } from 'react';
import AdminUsersTab from './AdminUsersTab';
import AdminPayoutsTab from './AdminPayoutsTab';
import AdminTasksTab from './AdminTasksTab'; // ✅ import added
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload(); // Force App.jsx to rerun and remove admin-only routing
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">👨‍💼 Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* 🔘 Tab Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-md ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('payouts')}
          className={`px-4 py-2 rounded-md ${activeTab === 'payouts' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Payouts
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded-md ${activeTab === 'tasks' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Tasks
        </button>
      </div>

      {/* 🔽 Render Tabs */}
      {activeTab === 'users' && <AdminUsersTab />}
      {activeTab === 'payouts' && <AdminPayoutsTab />}
      {activeTab === 'tasks' && <AdminTasksTab />}
    </div>
  );
};

export default AdminDashboard;
