import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupsService } from '../services/groups.service';
import { Group } from '../types';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';

const GroupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPost, setNewPost] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const fetchGroup = async () => {
    try {
      if (!id) return;
      const data = await groupsService.getGroup(id);
      setGroup(data);
    } catch (err: any) {
      setError('Failed to load group');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [id]);

  const handleJoin = async () => {
    if (!id) return;
    try {
      await groupsService.joinGroup(id);
      fetchGroup();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to join group');
    }
  };

  const handleLeave = async () => {
    if (!id || !window.confirm('Are you sure you want to leave this group?')) return;
    try {
      await groupsService.leaveGroup(id);
      navigate('/groups');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to leave group');
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this group? This cannot be undone.')) return;
    try {
      await groupsService.deleteGroup(id);
      navigate('/groups');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete group');
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newPost.trim()) return;

    setIsPosting(true);
    try {
      await groupsService.createGroupPost(id, newPost);
      setNewPost('');
      fetchGroup();
    } catch (err: any) {
      alert('Failed to create post');
    } finally {
      setIsPosting(false);
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

  if (error || !group) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error || 'Group not found'}
          </div>
        </div>
      </div>
    );
  }

  const isCreator = user?.id === group.createdById;
  const isMember = group.isMember;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/groups')}
          className="text-purple-600 hover:text-purple-700 mb-6 font-medium"
        >
          ← Back to Groups
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
                {group.isPrivate && (
                  <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded">
                    🔒 Private
                  </span>
                )}
              </div>
              <p className="text-purple-600 font-medium mb-2">{group.category}</p>
              {group.location && (
                <p className="text-gray-600 text-sm">📍 {group.location}</p>
              )}
            </div>
            <div className="flex gap-2">
              {!isMember && !isCreator && (
                <button
                  onClick={handleJoin}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Join Group
                </button>
              )}
              {isMember && !isCreator && (
                <button
                  onClick={handleLeave}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Leave Group
                </button>
              )}
              {isCreator && (
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Delete Group
                </button>
              )}
            </div>
          </div>

          <p className="text-gray-700 mb-6">{group.description}</p>

          <div className="flex items-center gap-6 text-sm text-gray-600 border-t pt-4">
            <span>👥 {group._count?.members || 0} members</span>
            <span>💬 {group._count?.posts || 0} posts</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {isMember && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg mb-4">Share with the group</h3>
                <form onSubmit={handlePostSubmit}>
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="What's on your mind?"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isPosting || !newPost.trim()}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    {isPosting ? 'Posting...' : 'Post'}
                  </button>
                </form>
              </div>
            )}

            {/* Posts */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Group Posts</h3>
              {group.posts && group.posts.length > 0 ? (
                group.posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow p-4">
                    <p className="text-gray-800 mb-2">{post.content}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()} at{' '}
                      {new Date(post.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                  No posts yet. {isMember && 'Be the first to post!'}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Members */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-4">
              Members ({group.members?.length || 0})
            </h3>
            <div className="space-y-3">
              {group.members?.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  {member.user.profilePicture ? (
                    <img
                      src={member.user.profilePicture}
                      alt={member.user.firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-sm font-bold text-purple-600">
                      {member.user.firstName[0]}{member.user.lastName[0]}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {member.user.firstName} {member.user.lastName}
                      {member.role === 'ADMIN' && (
                        <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          Admin
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">{member.user.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;