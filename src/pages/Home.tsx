import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Home: React.FC = () => {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email);
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-24 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-100 mb-6 tracking-tight">
        Your Avatar.<br />
        <span className="text-blue-400">One place.</span>
      </h1>
      <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
        Create your Globally Recognized Avatar. Upload it once, use it everywhere.
        The simplest way to manage your online identity.
      </p>

      <div className="w-full max-w-md bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-700">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 min-w-0 px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 outline-none text-gray-100 placeholder-gray-400 text-sm sm:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-4 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-900/50 whitespace-nowrap text-sm sm:text-base flex-shrink-0"
          >
            Create your Profile
          </button>
        </form>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
        {[
          { title: 'Global', desc: 'Works across millions of websites and applications instantly.' },
          { title: 'Secure', desc: 'Your email is never shared, only the hash is used for identification.' },
          { title: 'Free', desc: 'Always free for users. Open and accessible to everyone.' },
        ].map((feature, i) => (
          <div key={i} className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-gray-100">{feature.title}</h3>
            <p className="text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

