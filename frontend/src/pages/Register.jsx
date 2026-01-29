import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password, formData.companyName);
    } catch (err) {
      setError(err.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-white font-sans">
      
      {/* LEFT SIDE: Brand & Aesthetic (Now scrolls with content on mobile) */}
      <div className="w-full lg:w-2/5 relative flex flex-col justify-between p-10 lg:p-16 bg-black text-white lg:sticky lg:top-0 lg:h-screen">
        {/* Animated Background Mesh */}
        <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
           <div className="absolute top-[-5%] left-[-5%] w-[300px] h-[300px] bg-indigo-600 rounded-full blur-[100px] animate-pulse" />
           <div className="absolute bottom-[-5%] right-[-5%] w-[250px] h-[250px] bg-purple-600 rounded-full blur-[90px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-10 lg:mb-20">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black shadow-lg shadow-white/10">
              <span className="text-xl">💼</span>
            </div>
            <span className="font-bold text-2xl tracking-tighter">PayrollPro</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-black leading-[1.1] tracking-tight mb-6">
            Scale your <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Empire</span> today.
          </h2>
          <p className="text-gray-400 max-w-sm leading-relaxed text-base">
            Everything you need to manage global teams, automate compliance, and run payroll in minutes.
          </p>
        </div>

        <div className="relative z-10 mt-12 lg:mt-0 border-t border-white/10 pt-8">
          <div className="flex gap-4 items-center">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-xs font-bold text-indigo-400">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase">
              Joined by 10k+ Admins
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Form Section (Naturally Scrollable) */}
      <div className="w-full lg:w-3/5 flex flex-col bg-white pb-12 lg:pb-0">
        {/* Header/Nav */}
        <div className="p-6 lg:p-10 flex justify-end items-center sticky top-0 bg-white/80 backdrop-blur-md z-20">
          <p className="text-sm text-gray-400 mr-4 font-medium">Already an admin?</p>
          <Link to="/login" className="px-6 py-2.5 border-2 border-gray-900 rounded-full text-sm font-black hover:bg-black hover:text-white transition-all transform active:scale-95">
            LOG IN
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-10">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Get Started</h1>
            <p className="text-sm text-gray-500 font-medium">Create your organization's super admin account.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold animate-bounce shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-2 group-focus-within:text-indigo-600 transition-colors">Your Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-0 py-2 border-b-2 border-gray-100 focus:border-indigo-600 outline-none transition-all text-base font-semibold placeholder:text-gray-200"
                  placeholder="e.g. Alex Rivera"
                  required
                />
              </div>
              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-2 group-focus-within:text-indigo-600 transition-colors">Organization Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-0 py-2 border-b-2 border-gray-100 focus:border-indigo-600 outline-none transition-all text-base font-semibold placeholder:text-gray-200"
                  placeholder="e.g. Nexus Tech"
                  required
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-2 group-focus-within:text-indigo-600 transition-colors">Business Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-0 py-2 border-b-2 border-gray-100 focus:border-indigo-600 outline-none transition-all text-base font-semibold placeholder:text-gray-200"
                placeholder="alex@nexus.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-2 group-focus-within:text-indigo-600 transition-colors">Set Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-0 py-2 border-b-2 border-gray-100 focus:border-indigo-600 outline-none transition-all text-base font-semibold placeholder:text-gray-200"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-2 group-focus-within:text-indigo-600 transition-colors">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-0 py-2 border-b-2 border-gray-100 focus:border-indigo-600 outline-none transition-all text-base font-semibold placeholder:text-gray-200"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="group relative w-full bg-black text-white py-5 rounded-2xl overflow-hidden transition-all active:scale-[0.97] disabled:bg-gray-300 mt-6 shadow-2xl shadow-indigo-100"
            >
              <span className="relative z-10 font-black text-sm tracking-[3px]">
                {loading ? 'INITIALIZING WORKSPACE...' : 'CREATE ADMIN PROFILE'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </button>
          </form>

          <footer className="mt-16 text-center">
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[1px] leading-loose">
              By joining, you agree to the <br />
              <span className="text-black underline decoration-indigo-500 underline-offset-4 cursor-pointer hover:text-indigo-600 transition-colors">Terms of Service</span> & <span className="text-black underline decoration-indigo-500 underline-offset-4 cursor-pointer hover:text-indigo-600 transition-colors">Privacy Policy</span>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Register;