import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import Avatar from '../components/Avatar';
import { getSession } from '../utils/auth';
import { getPosts, getUsers, deletePost } from '../utils/storage';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const session = getSession();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    const allPosts = getPosts();
    const sorted = [...allPosts].sort(
      (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
    );
    setPosts(sorted);

    const allUsers = getUsers();
    setUsers(allUsers);
  }, []);

  const totalPosts = posts.length;
  const totalUsers = users.length + 1; // +1 for hard-coded admin
  const adminCount = users.filter((u) => u.role === 'admin').length + 1; // +1 for hard-coded admin
  const userCount = users.filter((u) => u.role !== 'admin').length;

  const recentPosts = posts.slice(0, 5);

  function handleEditPost(postId) {
    navigate(`/blog/${postId}/edit`);
  }

  function handleDeleteClick(postId) {
    setShowDeleteConfirm(postId);
  }

  function handleDeleteCancel() {
    setShowDeleteConfirm(null);
  }

  function handleDeleteConfirm() {
    deletePost(showDeleteConfirm);
    const updatedPosts = posts.filter((p) => p.id !== showDeleteConfirm);
    setPosts(updatedPosts);
    setShowDeleteConfirm(null);
  }

  function handleViewPost(postId) {
    navigate(`/blog/${postId}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Overview of your WriteSpace community.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Posts"
            value={totalPosts}
            icon="📝"
            bgColor="bg-violet-50"
          />
          <StatCard
            label="Total Users"
            value={totalUsers}
            icon="👥"
            bgColor="bg-indigo-50"
          />
          <StatCard
            label="Admins"
            value={adminCount}
            icon="👑"
            bgColor="bg-amber-50"
          />
          <StatCard
            label="Members"
            value={userCount}
            icon="📖"
            bgColor="bg-emerald-50"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/blog/new')}
              className="inline-flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            >
              ✍️ Write Post
            </button>
            <button
              onClick={() => navigate('/users')}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              👥 Manage Users
            </button>
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Posts</h2>
            <button
              onClick={() => navigate('/blogs')}
              className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
            >
              View All →
            </button>
          </div>

          {recentPosts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 text-4xl mb-4">
                📝
              </span>
              <h2 className="text-xl font-bold text-gray-900">No posts yet</h2>
              <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
                No one has written anything yet. Be the first to create a post!
              </p>
              <button
                onClick={() => navigate('/blog/new')}
                className="mt-6 inline-flex items-center px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
              >
                Write Your First Post
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewPost(post.id)}
                          className="text-sm font-medium text-gray-900 hover:text-violet-700 transition-colors text-left"
                        >
                          {post.title}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Avatar role={post.authorRole || 'user'} />
                          <span className="text-sm text-gray-700">
                            {post.author || 'Anonymous'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-500">
                          {post.date
                            ? new Date(post.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditPost(post.id)}
                            className="text-sm px-3 py-1 rounded text-gray-600 hover:text-violet-700 hover:bg-violet-50 transition-colors"
                            title="Edit post"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(post.id)}
                            className="text-sm px-3 py-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Delete post"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={handleDeleteCancel}
          />
          <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4 z-10">
            <h3 className="text-lg font-bold text-gray-900">Delete Post</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}