import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, clearSession } from '../utils/auth';

export default function PublicNavbar() {
  const navigate = useNavigate();
  const session = getSession();

  function handleLogout() {
    clearSession();
    navigate('/login');
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-violet-700 tracking-tight">
            ✍️ WriteSpace
          </Link>

          <div className="flex items-center space-x-3">
            {session ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-violet-700 transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  Dashboard
                </Link>
                <Link
                  to="/blogs"
                  className="text-sm font-medium text-gray-700 hover:text-violet-700 transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  Blogs
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-violet-700 transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 transition-colors px-4 py-2 rounded-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}