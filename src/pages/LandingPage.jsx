import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import BlogCard from '../components/BlogCard';
import { getPosts } from '../utils/storage';
import { getSession } from '../utils/auth';

const FEATURES = [
  {
    icon: '✍️',
    title: 'Write Freely',
    description:
      'Express your thoughts with our clean, distraction-free writing experience. Create and publish blog posts in seconds.',
  },
  {
    icon: '👥',
    title: 'Build Community',
    description:
      'Connect with fellow writers and readers. Share ideas, discover new perspectives, and grow together.',
  },
  {
    icon: '🛡️',
    title: 'Admin Tools',
    description:
      'Powerful admin dashboard to manage users, moderate content, and keep your community safe and thriving.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const session = getSession();
  const [latestPosts, setLatestPosts] = useState([]);

  useEffect(() => {
    const posts = getPosts();
    const sorted = [...posts].sort(
      (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
    );
    setLatestPosts(sorted.slice(0, 3));
  }, []);

  function handlePostClick(postId) {
    if (session) {
      navigate(`/blog/${postId}`);
    } else {
      navigate('/login');
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Your Space to{' '}
            <span className="text-amber-300">Write</span>,{' '}
            <span className="text-emerald-300">Share</span> &{' '}
            <span className="text-rose-300">Inspire</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
            WriteSpace is a modern blogging platform where ideas come to life.
            Start writing today and share your stories with the world.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-violet-700 bg-white hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white border-2 border-white/30 hover:bg-white/10 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Why WriteSpace?
            </h2>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              Everything you need to start your blogging journey, all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-lg shadow p-6 text-center hover:shadow-md transition-shadow"
              >
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-violet-100 text-3xl mb-4">
                  {feature.icon}
                </span>
                <h3 className="text-lg font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Preview */}
      {latestPosts.length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Latest Posts
              </h2>
              <p className="mt-3 text-gray-600 max-w-xl mx-auto">
                See what our community has been writing about recently.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post, index) => (
                <div
                  key={post.id}
                  onClick={() => handlePostClick(post.id)}
                  className="cursor-pointer"
                >
                  <BlogCard post={post} index={index} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-auto bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/"
              className="text-lg font-bold text-white tracking-tight"
            >
              ✍️ WriteSpace
            </Link>
            <div className="flex items-center space-x-6">
              <Link
                to="/login"
                className="text-sm hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm hover:text-white transition-colors"
              >
                Register
              </Link>
              <Link
                to="/blogs"
                className="text-sm hover:text-white transition-colors"
              >
                Blogs
              </Link>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-800 pt-6 text-center">
            <p className="text-sm">
              © {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}