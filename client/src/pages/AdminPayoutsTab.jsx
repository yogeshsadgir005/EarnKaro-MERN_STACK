import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import * as XLSX from 'xlsx';

const AdminPayoutsTab = () => {
  const [payouts, setPayouts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState({ show: false, action: '', payload: null });

  const fetchPayouts = async () => {
    try {
      const res = await axios.get('/payout/admin/all');
      const sorted = res.data.sort((a, b) => {
        const order = { pending: 0, failed: 1, completed: 2 };
        return order[a.status] - order[b.status];
      });
      setPayouts(sorted);
      setFiltered(sorted);
    } catch (err) {
      console.error('❌ Failed to fetch payouts:', err);
    }
  };

  const handleConfirmedAction = async () => {
    const { action, payload } = confirm;
    if (action === 'export') {
      const data = filtered.map((p) => ({
        Name: p.user?.name,
        Email: p.user?.email,
        Method: p.method,
        UPI: p.upiId || '',
        Holder: p.bank?.holderName || '',
        Account: p.bank?.accountNumber || '',
        IFSC: p.bank?.ifsc || '',
        Amount: p.amount,
        Status: p.status,
        Date: new Date(p.createdAt).toLocaleString(),
      }));
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Payouts');
      XLSX.writeFile(workbook, 'payouts_export.xlsx');
    } else {
      const newStatus = action === 'approve' ? 'completed' : 'failed';
      try {
        await axios.patch('/payout/admin/update-status', { payoutId: payload, newStatus });
        fetchPayouts();
      } catch (err) {
        console.error('❌ Error updating payout status:', err);
      }
    }
    setConfirm({ show: false, action: '', payload: null });
  };

  const filterData = () => {
    let temp = payouts;
    if (statusFilter) temp = temp.filter((p) => p.status === statusFilter);
    if (search) {
      temp = temp.filter((p) =>
        p.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.user?.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(temp);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getStatusBadge = (status) => {
    const base = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (status) {
      case 'completed': return `${base} bg-green-100 text-green-700`;
      case 'failed': return `${base} bg-red-100 text-red-700`;
      default: return `${base} bg-yellow-100 text-yellow-700`;
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  useEffect(() => {
    filterData();
  }, [statusFilter, search, payouts]);

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Payout Requests</h2>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name/email"
          className="px-3 py-2 border rounded w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="completed">Completed</option>
        </select>
        <button
          onClick={() => setConfirm({ show: true, action: 'export', payload: true })}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Export to Excel
        </button>
      </div>

      <div className="overflow-auto max-h-[600px] border rounded">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100 text-center text-gray-700">
              <th className="py-3 px-4 border">User</th>
              <th className="py-3 px-4 border">Method</th>
              <th className="py-3 px-4 border">Details</th>
              <th className="py-3 px-4 border">Amount</th>
              <th className="py-3 px-4 border">Status</th>
              <th className="py-3 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p._id} className="text-center hover:bg-gray-50">
                <td className="py-2 px-4 border">
                  {p.user?.name || 'N/A'}
                  <br />
                  <span className="text-xs text-gray-500">{p.user?.email}</span>
                </td>
                <td className="py-2 px-4 border uppercase">{p.method}</td>
                <td className="py-2 px-4 border text-left">
                  {p.method === 'upi' ? (
                    <div className="flex items-center justify-between gap-2">
                      <span>{p.upiId}</span>
                      <button onClick={() => copyToClipboard(p.upiId)} className="text-blue-600 text-xs underline">Copy</button>
                    </div>
                  ) : (
                    <>
                      <div><strong>Name:</strong> {p.bank?.holderName}
                        <button onClick={() => copyToClipboard(p.bank?.holderName)} className="ml-2 text-blue-600 text-xs underline">Copy</button></div>
                      <div><strong>Acc:</strong> {p.bank?.accountNumber}
                        <button onClick={() => copyToClipboard(p.bank?.accountNumber)} className="ml-2 text-blue-600 text-xs underline">Copy</button></div>
                      <div><strong>IFSC:</strong> {p.bank?.ifsc}
                        <button onClick={() => copyToClipboard(p.bank?.ifsc)} className="ml-2 text-blue-600 text-xs underline">Copy</button></div>
                    </>
                  )}
                </td>
                <td className="py-2 px-4 border font-bold">₹{p.amount}</td>
                <td className="py-2 px-4 border"><span className={getStatusBadge(p.status)}>{p.status}</span></td>
                <td className="py-2 px-4 border space-x-2">
                  {p.status === 'pending' ? (
                    <>
                      <button onClick={() => setConfirm({ show: true, action: 'approve', payload: p._id })} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">Approve</button>
                      <button onClick={() => setConfirm({ show: true, action: 'reject', payload: p._id })} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Reject</button>
                    </>
                  ) : (
                    <span className="text-gray-400 italic">No action</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <p className="mb-4 font-medium">
              {confirm.action === 'export'
                ? 'Export all filtered payouts to Excel?'
                : confirm.action === 'approve'
                  ? 'Are you sure you want to APPROVE this payout?'
                  : 'Are you sure you want to REJECT this payout?'}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmedAction}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirm({ show: false, action: '', payload: null })}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayoutsTab;
