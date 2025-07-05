import React, { useState } from 'react';
import AdminUsersTab from './AdminUsersTab';
import AdminTaskApprovals from './AdminTaskApprovals';
import AdminTasksTab from './AdminTasksTab';
import AdminPayoutsTab from './AdminPayoutsTab';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // 👈 NEW
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  return (
    <>
      <div className="p-8">
      
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">👨‍💼 Admin Dashboard</h1>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

       
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-md ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('taskApprovals')}
            className={`px-4 py-2 rounded-md ${activeTab === 'taskApprovals' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Task Approvals
          </button>
          <button
            onClick={() => setActiveTab('taskManagement')}
            className={`px-4 py-2 rounded-md ${activeTab === 'taskManagement' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Task Management
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-4 py-2 rounded-md ${activeTab === 'payouts' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Payouts
          </button>
        </div>

        
        {activeTab === 'users' && <AdminUsersTab />}
        {activeTab === 'taskApprovals' && <AdminTaskApprovals />}
        {activeTab === 'taskManagement' && <AdminTasksTab />}
        {activeTab === 'payouts' && <AdminPayoutsTab />}
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300">
          <div className="bg-gray-900 text-white rounded-xl shadow-lg max-w-sm w-full p-6 mx-4 animate-fadeIn scale-100 transition-transform duration-300 transform">
            <h3 className="text-xl font-semibold mb-2">Confirm Logout</h3>
            <p className="text-sm text-gray-300">Are you sure you want to logout?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm rounded border border-gray-600 hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 font-semibold transition"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
