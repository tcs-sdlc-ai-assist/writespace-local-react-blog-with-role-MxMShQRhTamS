import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getSession } from '../utils/auth';
import { getPosts, addPost, updatePost } from '../utils/storage';

export default function WriteBlog() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const isEditMode = Boolean(params.id);
  const session = getSession();

  const [form, setForm] = useState({ title: '', content: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode) {
      setLoading(false);
      return;
    }

    const posts = getPosts();
    const post = posts.find((p) => p.id === params.id);

    if (!post) {
      navigate('/blogs', { replace: true });
      return;
    }

    // Ownership check: users can only edit own posts, admin can edit any
    if (session) {
      const isOwner =
        (session.id && session.id === post.authorId) ||
        (session.username && session.username === post.author);
      const isAdmin = session.role === 'admin';

      if (!isOwner && !isAdmin) {
        navigate('/blogs', { replace: true });
        return;
      }
    } else {
      navigate('/login', { replace: true });
      return;
    }

    setForm({ title: post.title || '', content: post.content || '' });
    setLoading(false);
  }, [isEditMode, params.id, navigate, session]);

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
  }

  function validate() {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!form.content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    if (isEditMode) {
      updatePost({
        id: params.id,
        title: form.title.trim(),
        content: form.content.trim(),
      });
      navigate(`/blog/${params.id}`);
    } else {
      const newPost = {
        id: crypto.randomUUID(),
        title: form.title.trim(),
        content: form.content.trim(),
        author: session?.username || 'Anonymous',
        authorId: session?.id || null,
        authorRole: session?.role || 'user',
        date: new Date().toISOString(),
      };
      addPost(newPost);
      navigate(`/blog/${newPost.id}`);
    }
  }

  function handleCancel() {
    navigate(-1);
  }

  if (loading) {
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Post' : 'Write a New Post'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {isEditMode
              ? 'Update your post below.'
              : 'Share your thoughts with the community.'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your post title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700"
                >
                  Content
                </label>
                <span className="text-xs text-gray-400">
                  {form.content.length} characters
                </span>
              </div>
              <textarea
                id="content"
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={12}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm resize-y ${
                  errors.content ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Write your post content here…"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
              >
                {isEditMode ? 'Update Post' : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}