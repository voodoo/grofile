import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hashEmail } from '../utils/hash';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isOnAvatarsPage = location.pathname === '/avatars';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-400 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              G
            </div>
            <span className="hidden sm:inline">grofile</span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
            {!isOnAvatarsPage && (
              <Link to="/avatars" className="text-sm font-medium text-gray-300 hover:text-gray-100 whitespace-nowrap">
                Avatars
              </Link>
            )}
            {user ? (
              <Link
                to={`/profile/${hashEmail(user.email)}`}
                className="text-sm font-medium bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-full hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Profile
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-gray-100 whitespace-nowrap">
                  Log in
                </Link>
                <Link
                  to="/"
                  className="text-sm font-medium bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-full hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Create your Gravatar</span>
                  <span className="sm:hidden">Create</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} grofile. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

