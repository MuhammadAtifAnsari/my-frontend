import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Leave = () => {
  const { user } = useContext(AuthContext);
  const isAdminOrHR = user?.role === 'Admin' || user?.role === 'HR';

  const [leaves, setLeaves] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/leaves');
      setLeaves(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveTypes = async () => {
    try {
      const { data } = await api.get('/leaves/types');
      setLeaveTypes(Array.isArray(data) ? data : []);
    } catch (err) {
      setLeaveTypes([
        { _id: 'Annual', name: 'Annual' },
        { _id: 'Sick', name: 'Sick' },
        { _id: 'Casual', name: 'Casual' },
        { _id: 'Unpaid', name: 'Unpaid' }
      ]);
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchLeaveTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/leaves', formData);
      setSuccess('Leave application submitted successfully!');
      setFormData({ leaveTypeId: '', startDate: '', endDate: '', reason: '' });
      fetchLeaves();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave request');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/leaves/${id}/status`, { status });
      setSuccess(`Leave request ${status.toLowerCase()} successfully!`);
      fetchLeaves();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Leave Management</h1>
          <p className="text-sm text-slate-400">Apply for leaves, track quotas, and manage requests.</p>
        </div>
        {isAdminOrHR && (
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
            Role: {user?.role} (Privileged Access)
          </span>
        )}
      </div>

      {success && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm text-emerald-400">
          {success}
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-400">
          {error}
        </div>
      )}

      {/* Apply Leave Form Card */}
      <div className="rounded-xl bg-[#111827] border border-slate-800 p-6 shadow-lg">
        <h3 className="text-lg font-bold text-slate-100 mb-4">Apply for Leave</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Leave Type</label>
            <select
              value={formData.leaveTypeId}
              onChange={(e) => setFormData({ ...formData, leaveTypeId: e.target.value })}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="">Select Leave Type</option>
              {leaveTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name || type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Reason</label>
            <input
              type="text"
              placeholder="e.g. Family Emergency / Fever"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-sm hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              Submit Leave Application
            </button>
          </div>
        </form>
      </div>

      {/* Leave Requests Table */}
      <div className="rounded-xl bg-[#111827] border border-slate-800 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-100">Leave Requests History</h3>
          <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium">
            Total Requests: {leaves.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Total Days</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                    Loading leave requests...
                  </td>
                </tr>
              ) : leaves.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-200">
                      {leave.employee?.user?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-cyan-400 font-medium">
                      {leave.leaveType?.name || 'Leave'}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                      {leave.startDate?.split('T')[0]} to {leave.endDate?.split('T')[0]}
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-mono">{leave.totalDays} days</td>
                    <td className="px-6 py-4 text-slate-300 truncate max-w-xs">{leave.reason}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        leave.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                        leave.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      {isAdminOrHR && leave.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                            className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-xs hover:bg-emerald-500/30 cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                            className="px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded text-xs hover:bg-rose-500/30 cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leave;