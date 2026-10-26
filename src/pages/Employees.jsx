import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Trash2, Edit2 } from 'lucide-react';
import api from '../services/api';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employee',
    department: 'Engineering',
    designation: 'Software Engineer'
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/employees');
      const empList = Array.isArray(data) ? data : (data.employees || data.data || []);
      setEmployees(empList);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open modal for Create
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'Employee',
      department: 'Engineering',
      designation: 'Software Engineer'
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (emp) => {
    setIsEditing(true);
    setCurrentId(emp._id || emp.id);
    setFormData({
      name: emp.name || '',
      email: emp.email || '',
      password: '', // Leave blank for security during edit
      role: emp.role || 'Employee',
      department: emp.department || 'Engineering',
      designation: emp.designation || 'Software Engineer'
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  // Submit Form (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        designation: formData.designation,
        employeeCode: `EMP-${Math.floor(1000 + Math.random() * 9000)}`
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (isEditing) {
        await api.put(`/employees/${currentId}`, payload);
        setSuccess('Employee updated successfully!');
      } else {
        await api.post('/employees', payload);
        setSuccess('Employee added successfully!');
      }

      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      console.error("Full Backend Error Response:", err.response?.data);
      setError(err.response?.data?.message || err.response?.data?.error || 'Operation failed');
    }
  };

  // Delete Employee
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      setError('');
      setSuccess('');
      await api.delete(`/employees/${id}`);
      setSuccess('Employee deleted successfully!');
      fetchEmployees();
    } catch (err) {
      console.error('Full Delete Error Response:', err.response?.data);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to delete employee');
    }
  };

  // Filter employees
  const filteredEmployees = Array.isArray(employees) ? employees.filter(emp => 
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="space-y-6">
      {/* Header & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Employee Management</h1>
          <p className="text-sm text-slate-400">Complete Admin CRUD control for organization staff</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
        >
          <UserPlus size={18} />
          <span>Add New Employee</span>
        </button>
      </div>

      {/* Success / Error Banners */}
      {success && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm text-emerald-400">
          {success}
        </div>
      )}
      {error && !showModal && (
        <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-400">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
        <input
          type="text"
          placeholder="Search by name, email, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-80 rounded-lg bg-[#111827] border border-slate-800 pl-10 pr-4 py-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none transition-colors text-sm"
        />
      </div>

      {/* Employees Table Card */}
      <div className="rounded-xl bg-[#111827] border border-slate-800 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Employee Name</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Designation</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                    Loading employees data...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                    No employees found.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp._id || emp.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold shrink-0">
                        {emp.name ? emp.name.charAt(0).toUpperCase() : 'E'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">{emp.name}</p>
                        <p className="text-xs text-slate-400">{emp.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{emp.department || 'Engineering'}</td>
                    <td className="px-6 py-4 text-slate-300">{emp.designation || 'Staff'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        emp.role === 'Admin' 
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {emp.role || 'Employee'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(emp)}
                        className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Edit Employee"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(emp._id || emp.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                        title="Delete Employee"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl bg-[#111827] border border-cyan-500/20 p-6 shadow-[0_0_25px_rgba(6,182,212,0.1)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-100">
                {isEditing ? 'Edit Employee Details' : 'Add New Employee'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full rounded-lg bg-[#07090E] border border-slate-800 px-4 py-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@hcm.com"
                  className="w-full rounded-lg bg-[#07090E] border border-slate-800 px-4 py-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5">
                  Password {isEditing && '(Leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  name="password"
                  {...(!isEditing && { required: true })}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full rounded-lg bg-[#07090E] border border-slate-800 px-4 py-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-[#07090E] border border-slate-800 px-4 py-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5">Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-[#07090E] border border-slate-800 px-4 py-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5">System Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full rounded-lg bg-[#07090E] border border-slate-800 px-4 py-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none text-sm"
                >
                  <option value="Employee">Employee</option>
                  <option value="HR">HR Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-sm hover:bg-cyan-400 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  {isEditing ? 'Update Employee' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;