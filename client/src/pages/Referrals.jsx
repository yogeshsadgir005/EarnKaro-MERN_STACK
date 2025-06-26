import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Navbar from '../components/Navbar';
import { FaWhatsapp, FaTelegramPlane, FaInstagram, FaArrowLeft } from 'react-icons/fa';

const Referrals = () => {
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState([]);
  const [points, setPoints] = useState(0);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const res = await axios.get('/user/referrals', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setReferralCode(res.data.referralCode);
        setReferrals(res.data.referrals || []);
        setPoints(res.data.points || 0);
      } catch (err) {
        console.error('Error fetching referrals:', err?.response?.data || err.message);
      }
    };

    fetchReferrals();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `🎉 Join SkillMint and earn real rewards! Use my referral code: ${referralCode}\n👉 https://skillmint.in`;
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const telegramLink = `https://t.me/share/url?url=https://skillmint.in&text=${encodeURIComponent(shareText)}`;
  const instaCopyCTA = () => {
    navigator.clipboard.writeText(shareText);
    alert("Copied! Paste this on your Instagram story or bio.");
  };

  return (
    <>
      <Navbar />
      <div className="bg-yellow-300 text-black text-center p-2 font-bold text-sm">
        Join a platform where students and graduates find real tasks, land internships, and earn while building valuable skills
      </div>

      <div className="bg-black min-h-screen text-white p-6">
       
        <button
          onClick={() => navigate(-1)}
          className="text-white flex items-center gap-2 mb-6 hover:text-yellow-400"
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className="text-2xl font-bold mb-6">Refer & Earn</h2>

        
        <div className="bg-gray-800 p-4 rounded-xl mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <p className="text-sm text-gray-300 mb-1">Your Referral Code</p>
            <span className="text-blue-400 font-mono text-xl">{referralCode}</span>
          </div>
          <button
            onClick={handleCopy}
            className="mt-3 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

   
        <div className="bg-gray-800 p-4 rounded-xl mb-6">
          <p className="text-sm text-gray-300 mb-3">Share your referral code:</p>
          <div className="flex flex-wrap gap-4">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white text-sm"
            >
              <FaWhatsapp /> WhatsApp
            </a>
            <a
              href={telegramLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded-lg text-white text-sm"
            >
              <FaTelegramPlane /> Telegram
            </a>
            <button
              onClick={instaCopyCTA}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg text-white text-sm"
            >
              <FaInstagram /> Instagram
            </button>
          </div>
        </div>

     
        <div className="bg-gray-800 p-4 rounded-xl space-y-4">
          <div>
            <p className="text-sm text-gray-300">Total People Referred</p>
            <span className="text-lg font-semibold">{referrals.length}</span>
          </div>

          <div>
            <p className="text-sm text-gray-300">Referral Earnings</p>
            <span className="text-lg font-semibold">₹{points}</span>
          </div>

          <div className="text-sm text-yellow-400 mt-2">
            🎯 Invite {5 - referrals.length > 0 ? 5 - referrals.length : 0} more friends to unlock a bonus reward!
          </div>
        </div>
      </div>
    </>
  );
};

export default Referrals;
