import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Home from './pages/Home';
import Earn from './pages/Earn';
import Leaderboard from './pages/Leaderboard';
import Referrals from './pages/Referrals';
import Profile from './pages/Profile';
import Payout from './pages/Payout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOtp from './pages/VerifyOtp';
import Landing from './pages/Landing';
import Wallet from './pages/Wallet';
import Activity from './pages/Activity';
import Reward from './pages/Rewards';
import Accounts from './pages/Accounts';
import PayoutHistory from './pages/PayoutHistory';
import VerifyPhone from './pages/VerifyPhone';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');

  // Update state on localStorage change
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        {isAdmin ? (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/earn" element={<Earn />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/referrals" element={<Referrals />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payout" element={<Payout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/rewards" element={<Reward />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/payout-history" element={<PayoutHistory />} />
            <Route path="/verify-phone" element={<VerifyPhone />} />
          <Route path="/admin-login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />

            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
