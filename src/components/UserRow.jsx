import React from 'react';
import Avatar from './Avatar';
import { getSession } from '../utils/auth';

const ROLE_BADGE_STYLES = {
  admin: 'bg-violet-100 text-violet-700',
  user: 'bg-indigo-100 text-indigo-700',
};

export default function UserRow({ user, onDelete }) {
  const session = getSession();

  const isHardCodedAdmin = user.username === 'admin' && user.role === 'admin';
  const isSelf = session && (session.id === user.id || session.username === user.username);
  const deleteDisabled = isHardCodedAdmin || isSelf;

  let deleteTooltip = 'Delete user';
  if (isHardCodedAdmin) {
    deleteTooltip = 'Cannot delete the default admin account';
  } else if (isSelf) {
    deleteTooltip = 'Cannot delete your own account';
  }

  const badgeStyle = ROLE_BADGE_STYLES[user.role] || ROLE_BADGE_STYLES.user;

  function handleDelete() {
    if (deleteDisabled) return;
    if (onDelete) {
      onDelete(user.id);
    }
  }

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <Avatar role={user.role || 'user'} />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {user.displayName || user.username}
            </p>
            <p className="text-xs text-gray-500">@{user.username}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${badgeStyle}`}
        >
          {user.role || 'user'}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-gray-500">
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : '—'}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={handleDelete}
          disabled={deleteDisabled}
          title={deleteTooltip}
          className={`text-sm px-3 py-1 rounded transition-colors ${
            deleteDisabled
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-red-500 hover:bg-red-50 hover:text-red-700'
          }`}
        >
          🗑️ Delete
        </button>
      </td>
    </tr>
  );
}