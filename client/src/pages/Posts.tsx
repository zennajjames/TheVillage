import React, { useState, useEffect } from 'react';
import { postsService } from '../services/posts.service';
import { Post, PostType, CreatePostData } from '../types';
import PostCard from '../components/posts/PostCard';
import CreatePostForm from '../components/posts/CreatePostForm';
import Header from '../components/layout/Header';

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'REQUEST' | 'OFFER'>('ALL');

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const filterType = filter === 'ALL' ? undefined : filter;
      const data = await postsService.getPosts(filterType);
      setPosts(data);
    } catch (err: any) {
      setError('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const handleCreatePost = async (data: CreatePostData) => {
    await postsService.createPost(data);
    setShowCreateForm(false);
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Community Board
              </h1>
              <p className="text-gray-600">
                Share what you need, offer what you have
              </p>
            </div>
            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold"
              >
                + New Post
              </button>
            )}
          </div>

          {/* Filter Pills */}
          {!showCreateForm && (
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                  filter === 'ALL'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
                }`}
              >
                All Posts
              </button>
              <button
                onClick={() => setFilter('REQUEST')}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                  filter === 'REQUEST'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
                }`}
              >
                🙋‍♀️ Requests
              </button>
              <button
                onClick={() => setFilter('OFFER')}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                  filter === 'OFFER'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-green-300'
                }`}
              >
                👍 Offers
              </button>
            </div>
          )}
        </div>

        {/* Create Post Form */}
        {showCreateForm && (
          <div className="mb-8 bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Create New Post</h2>
            </div>
            <div className="p-6">
              <CreatePostForm
                onSubmit={handleCreatePost}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {!showCreateForm && (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading posts...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-3xl px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-4">📢</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-6">Be the first to share with your community!</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
                >
                  Create First Post
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-3xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all">
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Stats Bar (if posts exist) */}
        {!showCreateForm && posts.length > 0 && (
          <div className="mt-8 bg-white rounded-3xl border border-gray-200 p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {posts.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Total Posts</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {posts.filter(p => p.type === PostType.REQUEST).length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Requests</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  {posts.filter(p => p.type === PostType.OFFER).length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Offers</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
