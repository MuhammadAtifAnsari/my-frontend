import React, { useState, useEffect } from 'react';
import { Users, Building2, UserCheck, ShieldAlert, ArrowUpRight } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    departmentsCount: 0,
    adminsCount: 0,
    activeCount: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch real metrics from backend on load
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/employees');
      const employees = Array.isArray(data) ? data : (data.employees || data.data || []);
      
      // Calculate stats dynamically from fetched data
      const total = employees.length;
      const uniqueDepartments = new Set(employees.map(emp => emp.department || 'Engineering')).size;
      const admins = employees.filter(emp => emp.role === 'Admin' || emp.role === 'HR').length;

      setStats({
        totalEmployees: total,
        departmentsCount: uniqueDepartments,
        adminsCount: admins,
        activeCount: total // assuming all fetched are active
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      title: 'Total Employees',
      value: loading ? '...' : stats.totalEmployees,
      icon: <Users className="text-cyan-400" size={24} />,
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20'
    },
    {
      title: 'Active Departments',
      value: loading ? '...' : stats.departmentsCount,
      icon: <Building2 className="text-indigo-400" size={24} />,
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20'
    },
    {
      title: 'Admin & HR Staff',
      value: loading ? '...' : stats.adminsCount,
      icon: <ShieldAlert className="text-emerald-400" size={24} />,
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      title: 'Active Status',
      value: loading ? '...' : `${stats.activeCount} Online`,
      icon: <UserCheck className="text-amber-400" size={24} />,
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#111827] to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Welcome back, Admin 👋</h1>
          <p className="text-sm text-slate-400 mt-1">Here is what's happening across your HCM Lite organization today.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          System Online
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => (
          <div key={idx} className={`rounded-xl bg-[#111827] border ${card.border} p-5 shadow-lg flex items-center justify-between`}>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">{card.title}</p>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-2">{card.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions / Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-[#111827] border border-slate-800 p-6 shadow-lg">
          <h3 className="text-lg font-bold text-slate-100 mb-4">Quick Module Navigation</h3>
          <p className="text-sm text-slate-400 mb-6">Jump straight into core HR management modules built for your hackathon submission.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="/employees" className="flex items-center justify-between p-4 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">Employee CRUD</h4>
                  <p className="text-xs text-slate-400">Manage staff records & roles</p>
                </div>
              </div>
              <ArrowUpRight size={18} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </a>

            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/60 border border-slate-800 opacity-75">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Building2 size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">AI HR Assistant</h4>
                  <p className="text-xs text-slate-400">Next module ready to explore</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400">Next</span>
            </div>
          </div>
        </div>

        {/* System Health Card */}
        <div className="rounded-xl bg-[#111827] border border-slate-800 p-6 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Hackathon Status</h3>
            <p className="text-xs text-slate-400 mb-4">Current build milestone checklist.</p>
            
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-slate-300">
                <span className="text-emerald-400">✔</span> Responsive Sidebar & Layout
              </li>
              <li className="flex items-center gap-2.5 text-slate-300">
                <span className="text-emerald-400">✔</span> Full Employee CRUD Control
              </li>
              <li className="flex items-center gap-2.5 text-slate-300">
                <span className="text-emerald-400">✔</span> Real-time Dashboard Stats
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500 flex justify-between items-center">
            <span>HCM Lite v1.0</span>
            <span className="text-cyan-400">Ready for AI Module</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;