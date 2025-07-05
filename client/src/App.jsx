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


const isLoggedIn = () => !!localStorage.getItem('token');
const isAdmin = () => localStorage.getItem('isAdmin') === 'true';

const PrivateRoute = ({ element }) =>
  isLoggedIn() ? element : <Navigate to="/login" />;

const PublicRoute = ({ element }) => {
  if (isLoggedIn()) {
    return isAdmin() ? <Navigate to="/admin" /> : <Navigate to="/home" />;
  }
  return element;
};
const AdminRoute = ({ element }) =>
  isAdmin() ? element : <Navigate to="/admin-login" />;

function App() {

    const [isAdminState, setIsAdminState] = useState(localStorage.getItem('isAdmin') === 'true');

  useEffect(() => {
    localStorage.setItem('isAdmin', isAdminState);
  }, [isAdminState]);
  return (
    <Router>
      <Routes>
    
        <Route path="/admin" element={<AdminRoute element={<AdminDashboard />} />} />
         <Route path="/admin-login" element={<PublicRoute element={<AdminLogin setIsAdmin={setIsAdminState} />} />} />
     <Route path="/" element={<PublicRoute element={<Landing />} />} />
        <Route path="/signup" element={<PublicRoute element={<Signup />} />} />
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/verify-otp" element={<PublicRoute element={<VerifyOtp />} />} />

   
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/earn" element={<PrivateRoute element={<Earn />} />} />
        <Route path="/leaderboard" element={<PrivateRoute element={<Leaderboard />} />} />
        <Route path="/referrals" element={<PrivateRoute element={<Referrals />} />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="/payout" element={<PrivateRoute element={<Payout />} />} />
        <Route path="/activity" element={<PrivateRoute element={<Activity />} />} />
        <Route path="/wallet" element={<PrivateRoute element={<Wallet />} />} />
        <Route path="/rewards" element={<PrivateRoute element={<Reward />} />} />
        <Route path="/accounts" element={<PrivateRoute element={<Accounts />} />} />
        <Route path="/payout-history" element={<PrivateRoute element={<PayoutHistory />} />} />
        <Route path="/verify-phone" element={<PrivateRoute element={<VerifyPhone />} />} />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
