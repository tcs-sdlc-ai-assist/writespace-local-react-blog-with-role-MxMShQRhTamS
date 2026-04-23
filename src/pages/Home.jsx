import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BlogCard from '../components/BlogCard';
import { getPosts } from '../utils/storage';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const allPosts = getPosts();
    const sorted = [...allPosts].sort(
      (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
    );
    setPosts(sorted);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Posts</h1>
            <p className="mt-1 text-sm text-gray-600">
              Discover what the community has been writing about.
            </p>
          </div>
          <Link
            to="/blog/new"
            className="inline-flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            ✍️ Write Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 text-4xl mb-4">
              📝
            </span>
            <h2 className="text-xl font-bold text-gray-900">No posts yet</h2>
            <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
              It looks like no one has written anything yet. Be the first to share your thoughts with the community!
            </p>
            <Link
              to="/blog/new"
              className="mt-6 inline-flex items-center px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            >
              Write Your First Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}