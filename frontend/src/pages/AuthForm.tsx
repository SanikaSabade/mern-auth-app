import React, { useState, type FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AuthForm() {
  const [isSignup, setIsSignup] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (isSignup) {
        const res = await axios.post('http://localhost:8000/api/auth/signup', form);
        alert(res.data.message);
      } else {
        const res = await axios.post('http://localhost:8000/api/auth/login', form);
        alert(res.data.message);
        localStorage.setItem('token', res.data.token);
        form.role === 'admin' ? navigate('/admin/dashboard') : navigate('/user/form');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const handleRoleChange = (role: 'user' | 'admin') => {
    setForm({ ...form, role });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        {/* Role Switch Tabs */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-6 py-2 font-semibold rounded-t-lg ${
              form.role === 'user'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => handleRoleChange('user')}
          >
            User
          </button>
          <button
            className={`px-6 py-2 font-semibold rounded-t-lg ${
              form.role === 'admin'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => handleRoleChange('admin')}
          >
            Admin
          </button>
        </div>

        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-4">
          {isSignup ? 'Sign Up' : 'Login'} as {form.role.charAt(0).toUpperCase() + form.role.slice(1)}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition duration-200"
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <p
          onClick={() => setIsSignup(!isSignup)}
          className="mt-4 text-sm text-center text-indigo-700 hover:underline cursor-pointer"
        >
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
        </p>
      </div>
    </div>
  );
}

export default AuthForm;
