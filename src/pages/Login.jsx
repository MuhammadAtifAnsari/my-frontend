import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('user', JSON.stringify(res.data));

      // UPDATED: Ab saare roles unified dashboard par jayeinge
      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Login karne mein masla aaya. Dobara koshish karein.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Glow Effect */}
      <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -top-20 -left-20 pointer-events-none"></div>
      <div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -bottom-20 -right-20 pointer-events-none"></div>

      <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/30 p-8 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] w-full max-w-md relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-cyan-400 tracking-wider">HCM LITE</h2>
          <p className="text-gray-400 text-sm mt-2">Apne credentials ke sath portal mein enter hon</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1f2937]/90 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300 text-sm"
              placeholder="admin@hcm.com"
              required 
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-2">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1f2937]/90 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300 text-sm"
              placeholder="••••••••"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-gray-950 font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 mt-4 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Saylani Hackathon · HCM Lite Project
        </div>

      </div>
    </div>
  );
}