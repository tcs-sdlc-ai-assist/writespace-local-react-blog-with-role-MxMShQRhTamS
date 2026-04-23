import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import UserRow from '../components/UserRow';
import { getSession } from '../utils/auth';
import { getUsers, addUser, deleteUser } from '../utils/storage';

export default function UserManagement() {
  const navigate = useNavigate();
  const session = getSession();

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    displayName: '',
    username: '',
    password: '',
    role: 'user',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    const allUsers = getUsers();
    setUsers(allUsers);
  }, []);

  const hardCodedAdmin = {
    id: 'admin',
    username: 'admin',
    displayName: 'Admin',
    role: 'admin',
    createdAt: null,
  };

  const allUsersWithAdmin = [hardCodedAdmin, ...users];

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    setSuccessMessage('');
  }

  function validate() {
    const newErrors = {};

    if (!form.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }

    if (!form.username.trim()) {
      newErrors.username = 'Username is required';
    } else {
      const usernameLower = form.username.trim().toLowerCase();

      if (usernameLower === 'admin') {
        newErrors.username = 'Username already exists';
      } else if (users.some((u) => u.username.toLowerCase() === usernameLower)) {
        newErrors.username = 'Username already exists';
      }
    }

    if (!form.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    const newUser = {
      id: crypto.randomUUID(),
      displayName: form.displayName.trim(),
      username: form.username.trim(),
      password: form.password,
      role: form.role,
      createdAt: new Date().toISOString(),
    };

    addUser(newUser);

    const updatedUsers = getUsers();
    setUsers(updatedUsers);

    setForm({
      displayName: '',
      username: '',
      password: '',
      role: 'user',
    });
    setErrors({});
    setSuccessMessage(`User "${newUser.displayName}" created successfully!`);
  }

  function handleDeleteClick(userId) {
    setShowDeleteConfirm(userId);
  }

  function handleDeleteCancel() {
    setShowDeleteConfirm(null);
  }

  function handleDeleteConfirm() {
    deleteUser(showDeleteConfirm);
    const updatedUsers = getUsers();
    setUsers(updatedUsers);
    setShowDeleteConfirm(null);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create new users and manage existing accounts.
          </p>
        </div>

        {/* Create User Form */}
        <div className="bg-white rounded-lg shadow p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Create New User</h2>

          {successMessage && (
            <div className="mb-6 p-3 rounded-md bg-emerald-50 border border-emerald-200">
              <p className="text-sm text-emerald-600">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={form.displayName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm ${
                    errors.displayName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter display name"
                />
                {errors.displayName && (
                  <p className="mt-1 text-sm text-red-600">{errors.displayName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm ${
                    errors.username ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Choose a username"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
              >
                Create User
              </button>
            </div>
          </form>
        </div>

        {/* Users Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              All Users ({allUsersWithAdmin.length})
            </h2>
          </div>

          {allUsersWithAdmin.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-4xl mb-4">
                👥
              </span>
              <h2 className="text-xl font-bold text-gray-900">No users yet</h2>
              <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
                Create your first user using the form above.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allUsersWithAdmin.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      onDelete={handleDeleteClick}
                    />
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
            <h3 className="text-lg font-bold text-gray-900">Delete User</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this user? This action cannot be undone.
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