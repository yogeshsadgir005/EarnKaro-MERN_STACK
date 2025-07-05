import { useEffect, useState } from 'react';
import { FaMoneyCheckAlt, FaEdit, FaArrowLeft } from 'react-icons/fa';
import axios from '../utils/axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function Accounts() {
  const [method, setMethod] = useState('upi');
  const [editMode, setEditMode] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [bank, setBank] = useState({ accountNumber: '', ifsc: '', holderName: '' });
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUser(res.data.user || res.data);
        setUpiId(res.data.upiId || '');
        setBank(res.data.bank || { accountNumber: '', ifsc: '', holderName: '' });
      } catch (err) {
        console.error('Error loading payout methods:', err.message);
      }
    };
    fetch();
  }, []);

  const handleSave = async () => {
    try {
      const payload = method === 'upi' ? { upiId } : { bank };
      await axios.put('/user/profile', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStatus('Details updated successfully ✅');
      setEditMode(false);
    } catch (err) {
      setStatus('❌ Failed to save. Please try again.');
    }
  };

  const renderSummary = () => {
    if (method === 'upi') {
      return (
        <div className="text-white mt-4">
          {user?.upiId ? (
            <p><strong>UPI ID:</strong> {user.upiId}</p>
          ) : (
            <p className="text-gray-400">No UPI payout method saved yet.</p>
          )}
        </div>
      );
    } else {
      return (
        <div className="text-white mt-4 space-y-1">
          {user?.bank?.accountNumber ? (
            <>
              <p><strong>Account Number:</strong> {user.bank.accountNumber}</p>
              <p><strong>IFSC:</strong> {user.bank.ifsc}</p>
              <p><strong>Account Holder:</strong> {user.bank.holderName}</p>
            </>
          ) : (
            <p className="text-gray-400">No BANK payout method saved yet.</p>
          )}
        </div>
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-yellow-300 text-black text-center p-2 font-bold text-sm">
        Add or edit your payout method to receive earnings securely.
      </div>

      <main className="bg-black min-h-screen text-white p-6">

        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-blue-400 hover:text-white"
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaMoneyCheckAlt /> Add Payout Method
        </h2>

   
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${method === 'upi' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}
            onClick={() => { setMethod('upi'); setEditMode(false); setStatus(''); }}
          >
            UPI
          </button>
          <button
            className={`px-4 py-2 rounded ${method === 'bank' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}
            onClick={() => { setMethod('bank'); setEditMode(false); setStatus(''); }}
          >
            Bank Account
          </button>
        </div>

       
        {editMode ? (
          <div className="space-y-4 max-w-md">
            {method === 'upi' ? (
              <>
                <label className="block">
                  UPI ID:
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g., you@bank"
                    className="mt-1 p-2 w-full rounded bg-gray-800 text-white"
                  />
                </label>
              </>
            ) : (
              <>
                <label className="block">
                  Account Holder Name:
                  <input
                    type="text"
                    value={bank.holderName}
                    onChange={(e) => setBank({ ...bank, holderName: e.target.value })}
                    className="mt-1 p-2 w-full rounded bg-gray-800 text-white"
                  />
                </label>
                <label className="block">
                  Account Number:
                  <input
                    type="text"
                    value={bank.accountNumber}
                    onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })}
                    className="mt-1 p-2 w-full rounded bg-gray-800 text-white"
                  />
                </label>
                <label className="block">
                  IFSC Code:
                  <input
                    type="text"
                    value={bank.ifsc}
                    onChange={(e) => setBank({ ...bank, ifsc: e.target.value })}
                    className="mt-1 p-2 w-full rounded bg-gray-800 text-white"
                  />
                </label>
              </>
            )}
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
              >
                Cancel
              </button>
            </div>
            {status && <p className="text-yellow-400 font-medium">{status}</p>}
          </div>
        ) : (
          <div>
            {renderSummary()}
            {(method === 'upi' && user?.upiId) || (method === 'bank' && user?.bank?.accountNumber) ? (
              <button
                onClick={() => setEditMode(true)}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-2"
              >
                <FaEdit /> Edit {method === 'upi' ? 'UPI ID' : 'Bank Details'}
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded flex items-center gap-2"
              >
                ➕ Add {method === 'upi' ? 'UPI ID' : 'Bank Details'}
              </button>
            )}
          </div>
        )}
      </main>
    </>
  );
}
