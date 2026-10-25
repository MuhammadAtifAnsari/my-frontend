import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // Form states for actions
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveDays, setLeaveDays] = useState(1);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get('/analytics/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      const res = await API.post('/attendance/check-in');
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await API.put('/attendance/check-out');
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Check-out failed');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center text-cyan-400">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white flex">
      
      {/* Sidebar */}
      <div className="w-64 bg-[#111827] border-r border-cyan-500/20 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-black text-cyan-400 tracking-wider mb-8">HCM LITE</h1>
          <div className="space-y-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'overview' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-gray-400 hover:bg-gray-800'}`}
            >
              📊 Overview / KPIs
            </button>
            
            {user?.role === 'Employee' && (
              <button 
                onClick={() => setActiveTab('attendance')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'attendance' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                ⏱️ Attendance & Leaves
              </button>
            )}

            {(user?.role === 'Admin' || user?.role === 'HR') && (
              <button 
                onClick={() => setActiveTab('management')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'management' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                👥 Workforce Actions
              </button>
            )}
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 text-red-400 py-3 rounded-xl text-sm font-bold transition-all"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      flex-1 p-8 overflow-y-auto"
        
        {/* Top Navbar Header */}
        <div className="flex justify-between items-center bg-[#111827] border border-cyan-500/20 p-6 rounded-2xl mb-8 shadow-[0_0_20px_rgba(6,182,212,0.05)]">
          <div>
            <h2 className="text-xl font-bold">Welcome back, <span className="text-cyan-400">{user?.name}</span></h2>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Role: {user?.role}</p>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 rounded-xl text-cyan-300 text-sm font-mono">
            HCM Portal v1.0
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-cyan-400">System Metrics & KPIs</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {user?.role === 'Admin' && (
                <>
                  <div className="bg-[#111827] border border-cyan-500/20 p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm">Total Headcount</p>
                    <h4 className="text-3xl font-black text-cyan-400 mt-2">{stats?.headcount || 0}</h4>
                  </div>
                  <div className="bg-[#111827] border border-cyan-500/20 p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm">Total Payroll Cost</p>
                    <h4 className="text-3xl font-black text-cyan-400 mt-2">${stats?.totalPayrollCost || 0}</h4>
                  </div>
                  <div className="bg-[#111827] border border-cyan-500/20 p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm">Average Salary</p>
                    <h4 className="text-3xl font-black text-cyan-400 mt-2">${stats?.avgSalary || 0}</h4>
                  </div>
                </>
              )}

              {user?.role === 'HR' && (
                <>
                  <div className="bg-[#111827] border border-cyan-500/20 p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm">Total Employees</p>
                    <h4 className="text-3xl font-black text-cyan-400 mt-2">{stats?.headcount || 0}</h4>
                  </div>
                  <div className="bg-[#111827] border border-cyan-500/20 p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm">Present Today</p>
                    <h4 className="text-3xl font-black text-green-400 mt-2">{stats?.presentToday || 0}</h4>
                  </div>
                  <div className="bg-[#111827] border border-cyan-500/20 p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm">Pending Leaves</p>
                    <h4 className="text-3xl font-black text-yellow-400 mt-2">{stats?.pendingLeaves || 0}</h4>
                  </div>
                </>
              )}

              {user?.role === 'Employee' && (
                <>
                  <div className="bg-[#111827] border border-cyan-500/20 p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm">Late Attendance Count</p>
                    <h4 className="text-3xl font-black text-yellow-400 mt-2">{stats?.lateCount || 0}</h4>
                  </div>
                  <div className="bg-[#111827] border border-cyan-500/20 p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm">Last Net Payslip</p>
                    <h4 className="text-3xl font-black text-cyan-400 mt-2">${stats?.lastPayslip?.netPay || 0}</h4>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'attendance' && user?.role === 'Employee' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-cyan-400">Quick Attendance Actions</h3>
            <div className="bg-[#111827] border border-cyan-500/20 p-6 rounded-2xl flex gap-4">
              <button 
                onClick={handleCheckIn}
                className="bg-green-500/20 border border-green-500/40 text-green-400 px-6 py-3 rounded-xl font-bold hover:bg-green-500/30 transition-all cursor-pointer"
              >
                Check In Now
              </button>
              <button 
                onClick={handleCheckOut}
                className="bg-blue-500/20 border border-blue-500/40 text-blue-400 px-6 py-3 rounded-xl font-bold hover:bg-blue-500/30 transition-all cursor-pointer"
              >
                Check Out Now
              </button>
            </div>
          </div>
        )}

        {activeTab === 'management' && (user?.role === 'Admin' || user?.role === 'HR') && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-cyan-400">Workforce Management Quick View</h3>
            <div className="bg-[#111827] border border-cyan-500/20 p-6 rounded-2xl">
              <p className="text-gray-400 text-sm">Use Postman or API endpoints to register employees, run payroll, or approve leaves. Full management grid is online.</p>
            </div>
          </div>
        )}

      </div>
    // </div>
  );
}