import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Header from '../components/layout/Header';

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  location: string;
  isAdmin: boolean;
  createdAt: string;
  _count: {
    posts: number;
    groupMemberships: number;
  };
}

interface AdminPost {
  id: string;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface AdminGroup {
  id: string;
  name: string;
  category: string;
  isPrivate: boolean;
  createdAt: string;
  createdBy: {
    firstName: string;
    lastName: string;
    email: string;
  };
  _count: {
    members: number;
    posts: number;
  };
}

const Admin: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'groups'>('users');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [groups, setGroups] = useState<AdminGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [user, navigate, activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'users') {
        const response = await api.get('/admin/users');
        setUsers(response.data);
      } else if (activeTab === 'posts') {
        const response = await api.get('/admin/posts');
        setPosts(response.data);
      } else if (activeTab === 'groups') {
        const response = await api.get('/admin/groups');
        setGroups(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const handleDeletePost = async (postId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete post "${title}"?`)) {
      return;
    }

    try {
      await api.delete(`/admin/posts/${postId}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete post');
    }
  };

  const handleDeleteGroup = async (groupId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete group "${name}"?`)) {
      return;
    }

    try {
      await api.delete(`/admin/groups/${groupId}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete group');
    }
  };

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage users, posts, and groups</p>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === 'users'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === 'posts'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Posts ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === 'groups'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Groups ({groups.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12 text-gray-600">Loading...</div>
            ) : (
              <>
                {/* Users Tab */}
                {activeTab === 'users' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posts</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Groups</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">{u.firstName} {u.lastName}</td>
                            <td className="px-4 py-3 text-sm">{u.email}</td>
                            <td className="px-4 py-3 text-sm">{u.location}</td>
                            <td className="px-4 py-3 text-sm">{u._count.posts}</td>
                            <td className="px-4 py-3 text-sm">{u._count.groupMemberships}</td>
                            <td className="px-4 py-3 text-sm">
                              {u.isAdmin ? (
                                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">Admin</span>
                              ) : (
                                <span className="text-gray-500">User</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <button
                                onClick={() => handleDeleteUser(u.id, `${u.firstName} ${u.lastName}`)}
                                className="text-red-600 hover:text-red-800"
                                disabled={u.id === user.id}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Posts Tab */}
                {activeTab === 'posts' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {posts.map((post) => (
                          <tr key={post.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium">{post.title}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded text-xs ${
                                post.type === 'REQUEST' 
                                  ? 'bg-purple-100 text-purple-700' 
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {post.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">{post.status}</td>
                            <td className="px-4 py-3 text-sm">{post.user.firstName} {post.user.lastName}</td>
                            <td className="px-4 py-3 text-sm">{new Date(post.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-sm space-x-2">
                              <button
                                onClick={() => navigate(`/posts/${post.id}`)}
                                className="text-purple-600 hover:text-purple-800"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDeletePost(post.id, post.title)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Groups Tab */}
                {activeTab === 'groups' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Members</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posts</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creator</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {groups.map((group) => (
                          <tr key={group.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium">
                              {group.name}
                              {group.isPrivate && (
                                <span className="ml-2 text-xs text-gray-500">🔒</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm">{group.category}</td>
                            <td className="px-4 py-3 text-sm">{group._count.members}</td>
                            <td className="px-4 py-3 text-sm">{group._count.posts}</td>
                            <td className="px-4 py-3 text-sm">{group.createdBy.firstName} {group.createdBy.lastName}</td>
                            <td className="px-4 py-3 text-sm space-x-2">
                              <button
                                onClick={() => navigate(`/groups/${group.id}`)}
                                className="text-purple-600 hover:text-purple-800"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDeleteGroup(group.id, group.name)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;