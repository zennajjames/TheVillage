import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsService } from '../services/posts.service';
import { Post, PostType, PostStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) return;
        const data = await postsService.getPost(id);
        setPost(data);
      } catch (err: any) {
        setError('Failed to load post');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleStatusChange = async (newStatus: PostStatus) => {
    if (!id) return;
    try {
      const updatedPost = await postsService.updatePostStatus(id, newStatus);
      setPost(updatedPost);
    } catch (err: any) {
      alert('Failed to update post status');
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await postsService.deletePost(id);
      navigate('/posts');
    } catch (err: any) {
      alert('Failed to delete post');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error || 'Post not found'}
          </div>
        </div>
      </div>
    );
  }

  const isRequest = post.type === PostType.REQUEST;
  const isOwner = user?.id === post.userId;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => navigate('/posts')} className="text-purple-600 hover:text-purple-700 mb-6 font-medium">
          Back to Posts
        </button>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isRequest ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
              {post.type === PostType.REQUEST ? 'REQUEST' : 'OFFER'}
            </span>
            <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <p className="text-gray-700 text-lg mb-6 whitespace-pre-wrap">{post.description}</p>
          <div className="flex items-center text-gray-600 mb-6">
            <span className="mr-2">Location:</span>
            <span>{post.location}</span>
          </div>
          <div className="border-t pt-4 mb-6">
            <p className="text-sm text-gray-600">Posted by</p>
            <p className="font-semibold text-gray-900">{post.user.firstName} {post.user.lastName}</p>
            <p className="text-sm text-gray-600">{post.user.location}</p>
          </div>
          <div className="mb-6">
            <span className="text-sm text-gray-600 mr-2">Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${post.status === 'OPEN' ? 'bg-green-100 text-green-700' : post.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
              {post.status}
            </span>
          </div>
          <div className="border-t pt-4">
            {isOwner ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 font-medium mb-2">Manage your post:</p>
                <div className="flex gap-2 flex-wrap">
                  {post.status === 'OPEN' && (
                    <button onClick={() => handleStatusChange(PostStatus.IN_PROGRESS)} className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition text-sm">
                      Mark In Progress
                    </button>
                  )}
                  {post.status !== 'FULFILLED' && (
                    <button onClick={() => handleStatusChange(PostStatus.FULFILLED)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm">
                      Mark Fulfilled
                    </button>
                  )}
                  <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm">
                    Delete Post
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 mb-3">Interested in helping or connecting? Reach out!</p>
                <button onClick={() => window.location.href = `mailto:${(post.user as any).email}`} className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                  Contact {post.user.firstName}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;