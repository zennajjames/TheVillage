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
    communityMemberships: number;
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

interface AdminCommunity {
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
    communityPosts: number;
  };
}

interface AdminEvent {
  id: string;
  title: string;
  description: string;
  location: string | null;
  startDate: string;
  endDate: string;
  status: string;
  adminNotes: string | null;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  community: {
    id: string;
    name: string;
  } | null;
}

const Admin: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'communities' | 'events'>('events');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [communities, setCommunities] = useState<AdminCommunity[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [pendingEvents, setPendingEvents] = useState<AdminEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [user, navigate, activeTab]);

  // Always fetch pending events count for the tab badge
  useEffect(() => {
    if (user?.isAdmin) {
      fetchPendingEvents();
    }
  }, [user]);

  const fetchPendingEvents = async () => {
    try {
      const response = await api.get('/admin/events/pending');
      setPendingEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch pending events:', error);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'users') {
        const response = await api.get('/admin/users');
        setUsers(response.data);
      } else if (activeTab === 'posts') {
        const response = await api.get('/admin/posts');
        setPosts(response.data);
      } else if (activeTab === 'communities') {
        const response = await api.get('/admin/communities');
        setCommunities(response.data);
      } else if (activeTab === 'events') {
        const response = await api.get('/admin/events');
        setEvents(response.data);
        // Also refresh pending
        fetchPendingEvents();
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

  const handleDeleteCommunity = async (communityId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete community "${name}"?`)) {
      return;
    }

    try {
      await api.delete(`/admin/communities/${communityId}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete community');
    }
  };

  const handleApproveEvent = async (eventId: string) => {
    try {
      await api.patch(`/admin/events/${eventId}/review`, { status: 'APPROVED' });
      fetchData();
    } catch (error) {
      alert('Failed to approve event');
    }
  };

  const handleRejectEvent = async (eventId: string) => {
    const reason = window.prompt('Reason for rejection (optional):');
    try {
      await api.patch(`/admin/events/${eventId}/review`, {
        status: 'REJECTED',
        adminNotes: reason || null,
      });
      fetchData();
    } catch (error) {
      alert('Failed to reject event');
    }
  };

  const handleDeleteEvent = async (eventId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete event "${title}"?`)) {
      return;
    }

    try {
      await api.delete(`/admin/events/${eventId}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete event');
    }
  };

  const getEventStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">Pending</span>;
      case 'APPROVED':
        return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">Approved</span>;
      case 'REJECTED':
        return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">Rejected</span>;
      default:
        return <span className="text-gray-500 text-xs">{status}</span>;
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
            <p className="text-gray-600 mt-2">Manage users, posts, communities, and events</p>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('events')}
                className={`px-6 py-4 font-medium transition relative ${
                  activeTab === 'events'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Events
                {pendingEvents.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 inline-flex items-center justify-center">
                    {pendingEvents.length}
                  </span>
                )}
              </button>
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
                onClick={() => setActiveTab('communities')}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === 'communities'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Communities ({communities.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12 text-gray-600">Loading...</div>
            ) : (
              <>
                {/* Events Tab */}
                {activeTab === 'events' && (
                  <div>
                    {/* Pending Events Section */}
                    {pendingEvents.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                          Pending Review ({pendingEvents.length})
                        </h2>
                        <div className="space-y-4">
                          {pendingEvents.map((event) => (
                            <div key={event.id} className="border-2 border-yellow-200 bg-yellow-50 rounded-xl p-5">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 text-lg">{event.title}</h3>
                                  <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                                    <span>
                                      {new Date(event.startDate).toLocaleString()} — {new Date(event.endDate).toLocaleString()}
                                    </span>
                                    {event.location && <span>Location: {event.location}</span>}
                                    {event.community && <span>Community: {event.community.name}</span>}
                                    <span>By: {event.user.firstName} {event.user.lastName} ({event.user.email})</span>
                                  </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                  <button
                                    onClick={() => handleApproveEvent(event.id)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleRejectEvent(event.id)}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* All Events Table */}
                    <h2 className="text-lg font-bold text-gray-900 mb-4">All Events ({events.length})</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitter</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Community</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {events.map((event) => (
                            <tr key={event.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium">{event.title}</td>
                              <td className="px-4 py-3 text-sm">
                                {new Date(event.startDate).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-sm">{getEventStatusBadge(event.status)}</td>
                              <td className="px-4 py-3 text-sm">{event.user.firstName} {event.user.lastName}</td>
                              <td className="px-4 py-3 text-sm">{event.community?.name || '—'}</td>
                              <td className="px-4 py-3 text-sm space-x-2">
                                {event.status === 'PENDING_REVIEW' && (
                                  <>
                                    <button
                                      onClick={() => handleApproveEvent(event.id)}
                                      className="text-green-600 hover:text-green-800"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleRejectEvent(event.id)}
                                      className="text-orange-600 hover:text-orange-800"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleDeleteEvent(event.id, event.title)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {events.length === 0 && (
                        <div className="text-center py-8 text-gray-500">No events yet.</div>
                      )}
                    </div>
                  </div>
                )}

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
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Communities</th>
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
                            <td className="px-4 py-3 text-sm">{u._count.communityMemberships}</td>
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

                {/* Communities Tab */}
                {activeTab === 'communities' && (
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
                        {communities.map((community) => (
                          <tr key={community.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium">
                              {community.name}
                              {community.isPrivate && (
                                <span className="ml-2 text-xs text-gray-500">🔒</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm">{community.category || '—'}</td>
                            <td className="px-4 py-3 text-sm">{community._count.members}</td>
                            <td className="px-4 py-3 text-sm">{community._count.communityPosts}</td>
                            <td className="px-4 py-3 text-sm">{community.createdBy.firstName} {community.createdBy.lastName}</td>
                            <td className="px-4 py-3 text-sm space-x-2">
                              <button
                                onClick={() => navigate(`/communities/${community.id}`)}
                                className="text-purple-600 hover:text-purple-800"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDeleteCommunity(community.id, community.name)}
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
