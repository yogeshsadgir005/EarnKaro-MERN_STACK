import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from '../utils/axios';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.user || res.data);
      } catch (err) {
        console.error('Navbar Auth Error:', err);
        localStorage.removeItem('token');
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="flex justify-between items-center p-4 bg-black text-white relative">
      {/* Clickable Brand */}
      <Link to="/home" className="font-bold text-xl">
        Skill<span className="text-blue-500">Mint</span>
      </Link>

      {/* Desktop Nav */}
      <nav className="space-x-4 hidden md:flex">
        <Link
          to="/home"
          className={`${isActive('/home') ? 'opacity-50 underline' : ''}`}
        >
          Home
        </Link>
        <Link
          to="/earn"
          className={`${isActive('/earn') ? 'opacity-50 underline' : ''}`}
        >
          Earn
        </Link>
        <Link
          to="/leaderboard"
          className={`${isActive('/leaderboard') ? 'opacity-50 underline' : ''}`}
        >
          Leaderboard
        </Link>
        <Link
          to="/referrals"
          className={`${isActive('/referrals') ? 'opacity-50 underline' : ''}`}
        >
          Referrals
        </Link>
      </nav>

      {/* Avatar & Dropdown */}
      <div className="relative" ref={menuRef}>
        {user ? (
          <div>
            <div
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white cursor-pointer select-none"
              title={user.name}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded shadow z-50">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  👤 Profile
                </button>

                {/* Mobile-only Links */}
                <div className="block md:hidden border-t border-gray-200 mt-2">
                  <button
                    onClick={() => {
                      navigate('/earn');
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    💸 Earn
                  </button>
                  <button
                    onClick={() => {
                      navigate('/leaderboard');
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    🏆 Leaderboard
                  </button>
                  <button
                    onClick={() => {
                      navigate('/referrals');
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    🤝 Referrals
                  </button>
                </div>

                <button
                  onClick={() => {
                    handleLogout();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-1 rounded-full"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
