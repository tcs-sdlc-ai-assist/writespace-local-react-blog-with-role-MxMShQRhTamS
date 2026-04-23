import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Avatar from './Avatar';
import { getSession, clearSession } from '../utils/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = getSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = session && session.role === 'admin';
  const displayName = session?.displayName || session?.username || 'User';

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    clearSession();
    setDropdownOpen(false);
    navigate('/');
  }

  function isActive(path) {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }

  const linkBase =
    'text-sm font-medium transition-colors px-3 py-2 rounded-md';
  const linkActive = 'text-violet-700 bg-violet-50';
  const linkInactive = 'text-gray-700 hover:text-violet-700 hover:bg-gray-50';

  const navLinks = [
    { to: '/blogs', label: 'Blogs', show: true },
    { to: '/blog/new', label: 'Write', show: true },
    { to: '/dashboard', label: 'Admin Dashboard', show: isAdmin },
    { to: '/users', label: 'Users', show: isAdmin },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="text-xl font-bold text-violet-700 tracking-tight">
            ✍️ WriteSpace
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks
              .filter((link) => link.show)
              .map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`${linkBase} ${isActive(link.to) ? linkActive : linkInactive}`}
                >
                  {link.label}
                </Link>
              ))}
          </div>

          {/* Desktop user dropdown */}
          <div className="hidden md:flex items-center">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Avatar role={session?.role || 'user'} />
                <span className="text-sm font-medium text-gray-700">{displayName}</span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{displayName}</p>
                    <p className="text-xs text-gray-500">
                      {session?.role === 'admin' ? 'Administrator' : 'Member'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-violet-700 hover:bg-gray-50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks
              .filter((link) => link.show)
              .map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block ${linkBase} ${isActive(link.to) ? linkActive : linkInactive}`}
                >
                  {link.label}
                </Link>
              ))}
          </div>
          <div className="border-t border-gray-100 px-4 py-3">
            <div className="flex items-center space-x-2 mb-3">
              <Avatar role={session?.role || 'user'} />
              <div>
                <p className="text-sm font-medium text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500">
                  {session?.role === 'admin' ? 'Administrator' : 'Member'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors px-3 py-2 rounded-md"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}