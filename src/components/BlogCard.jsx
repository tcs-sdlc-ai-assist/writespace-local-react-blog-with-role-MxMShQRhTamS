import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { getSession } from '../utils/auth';

const ACCENT_COLORS = [
  'border-violet-500',
  'border-indigo-500',
  'border-blue-500',
  'border-emerald-500',
  'border-amber-500',
  'border-rose-500',
];

function truncate(text, maxLength = 120) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

export default function BlogCard({ post, index = 0 }) {
  const navigate = useNavigate();
  const session = getSession();
  const accentColor = ACCENT_COLORS[index % ACCENT_COLORS.length];

  const canEdit =
    session &&
    (session.role === 'admin' ||
      (session.id && session.id === post.authorId) ||
      (session.username && session.username === post.author));

  function handleClick() {
    navigate(`/blog/${post.id}`);
  }

  function handleEdit(e) {
    e.stopPropagation();
    navigate(`/blog/${post.id}/edit`);
  }

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border-l-4 ${accentColor} flex flex-col`}
    >
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">
            {post.title}
          </h3>
          {canEdit && (
            <button
              onClick={handleEdit}
              className="ml-2 text-gray-400 hover:text-violet-600 transition-colors flex-shrink-0"
              title="Edit post"
            >
              ✏️
            </button>
          )}
        </div>

        <p className="mt-2 text-sm text-gray-600 flex-1">
          {truncate(post.content)}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar role={post.authorRole || 'user'} />
            <span className="text-sm font-medium text-gray-700">
              {post.author || 'Anonymous'}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {post.date
              ? new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : ''}
          </span>
        </div>
      </div>
    </div>
  );
}