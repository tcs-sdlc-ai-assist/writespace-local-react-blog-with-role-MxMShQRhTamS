import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Avatar from '../components/Avatar';
import { getSession } from '../utils/auth';
import { getPosts, deletePost } from '../utils/storage';

export default function ReadBlog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const session = getSession();

  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const posts = getPosts();
    const found = posts.find((p) => p.id === id);

    if (!found) {
      setNotFound(true);
      return;
    }

    setPost(found);
  }, [id]);

  const canEdit =
    session &&
    post &&
    (session.role === 'admin' ||
      (session.id && session.id === post.authorId) ||
      (session.username && session.username === post.author));

  const canDelete =
    session &&
    post &&
    (session.role === 'admin' ||
      (session.id && session.id === post.authorId) ||
      (session.username && session.username === post.author));

  function handleEdit() {
    navigate(`/blog/${post.id}/edit`);
  }

  function handleDeleteClick() {
    setShowDeleteConfirm(true);
  }

  function handleDeleteCancel() {
    setShowDeleteConfirm(false);
  }

  function handleDeleteConfirm() {
    deletePost(post.id);
    setShowDeleteConfirm(false);
    navigate('/blogs', { replace: true });
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow p-12 text-center max-w-md w-full">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-4xl mb-4">
              😕
            </span>
            <h2 className="text-xl font-bold text-gray-900">Post not found</h2>
            <p className="mt-2 text-sm text-gray-600">
              The post you're looking for doesn't exist or may have been removed.
            </p>
            <button
              onClick={() => navigate('/blogs')}
              className="mt-6 inline-flex items-center px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            >
              Back to Blogs
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Loading…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="bg-white rounded-lg shadow p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex-1">
              {post.title}
            </h1>
            {(canEdit || canDelete) && (
              <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                {canEdit && (
                  <button
                    onClick={handleEdit}
                    className="text-sm px-3 py-1 rounded text-gray-600 hover:text-violet-700 hover:bg-violet-50 transition-colors"
                    title="Edit post"
                  >
                    ✏️ Edit
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={handleDeleteClick}
                    className="text-sm px-3 py-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                    title="Delete post"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Author & Date */}
          <div className="mt-4 flex items-center space-x-3">
            <Avatar role={post.authorRole || 'user'} />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {post.author || 'Anonymous'}
              </p>
              <p className="text-xs text-gray-400">
                {post.date
                  ? new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : ''}
              </p>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-6 border-gray-200" />

          {/* Content */}
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6">
          <button
            onClick={() => navigate('/blogs')}
            className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
          >
            ← Back to all posts
          </button>
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