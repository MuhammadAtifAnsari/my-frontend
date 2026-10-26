import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Attendance = () => {
  const { user } = useContext(AuthContext);
  const isAdminOrHR = user?.role === 'Admin' || user?.role === 'HR';

  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/attendance');
      setAttendanceList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleClockIn = async () => {
    setError('');
    setSuccess('');
    try {
      await api.post('/attendance/clock-in');
      setSuccess('Clocked in successfully!');
      fetchAttendance();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clock in');
    }
  };

  const handleClockOut = async () => {
    setError('');
    setSuccess('');
    try {
      await api.put('/attendance/clock-out');
      setSuccess('Clocked out successfully!');
      fetchAttendance();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clock out');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Attendance Management</h1>
          <p className="text-sm text-slate-400">Track daily check-ins, check-outs, and attendance logs.</p>
        </div>
        
        {/* Clock In / Out Action Buttons for Employees */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleClockIn}
            className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold hover:bg-emerald-500/30 transition-all cursor-pointer"
          >
            Clock In
          </button>
          <button
            onClick={handleClockOut}
            className="px-4 py-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-semibold hover:bg-rose-500/30 transition-all cursor-pointer"
          >
            Clock Out
          </button>
        </div>
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

      {/* Attendance Records Table */}
      <div className="rounded-xl bg-[#111827] border border-slate-800 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-100">
            {isAdminOrHR ? 'All Employees Attendance Logs' : 'My Attendance Logs'}
          </h3>
          <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium">
            Total Records: {attendanceList.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Clock In</th>
                <th className="px-6 py-4">Clock Out</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                    Loading attendance records...
                  </td>
                </tr>
              ) : attendanceList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                attendanceList.map((record) => (
                  <tr key={record._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-200">
                      {record.employee?.user?.name || record.employeeName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                      {record.date ? record.date.split('T')[0] : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-mono text-xs">
                      {record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-rose-400 font-mono text-xs">
                      {record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : 'Active'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        record.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                        record.status === 'Late' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                        'bg-slate-500/10 text-slate-400 border-slate-500/30'
                      }`}>
                        {record.status || 'Present'}
                      </span>
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

export default Attendance;