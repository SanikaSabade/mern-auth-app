import React from 'react';
import { useNavigate } from 'react-router-dom';

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-xl max-w-md w-full text-center p-10 border border-white/30">
        <h1 className="text-4xl font-extrabold text-white mb-6">Welcome 🚀</h1>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/auth')}
            className="w-full px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow hover:bg-indigo-50 transition duration-300"
          >
            Login / Sign Up
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow hover:bg-indigo-700 transition duration-300"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
