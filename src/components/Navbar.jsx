import React from 'react';
import { User, Bell, Menu } from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const userName = userInfo.name || 'Administrator';
  const userRole = userInfo.role || 'Admin';

  return (
    <header className="h-16 bg-[#111827] border-b border-slate-800 flex items-center justify-between px-6 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle Button */}
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer"
        >
          <Menu size={22} />
        </button>
        <h2 className="text-base md:text-lg font-semibold text-slate-100 truncate">
          Welcome back, {userName}
        </h2>
      </div>

      {/* Right Side User Profile & Notification */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800/50 transition-colors relative cursor-pointer">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold shrink-0">
            <User size={20} />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-200">{userName}</p>
            <p className="text-xs text-cyan-400 uppercase tracking-wider">{userRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;