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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Community Board</h1>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
            >
              + New Post
            </button>
          )}
        </div>

        {showCreateForm && (
          <div className="mb-6">
            <CreatePostForm
              onSubmit={handleCreatePost}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        {!showCreateForm && (
          <>
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'ALL'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Posts
              </button>
              <button
                onClick={() => setFilter('REQUEST')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'REQUEST'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🙋‍♀️ Requests
              </button>
              <button
                onClick={() => setFilter('OFFER')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'OFFER'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                💝 Offers
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-xl text-gray-600">Loading posts...</div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-xl text-gray-600 mb-4">No posts yet</div>
                <p className="text-gray-500">Be the first to post!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Posts;