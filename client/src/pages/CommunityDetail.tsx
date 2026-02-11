import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { communitiesService } from '../services/communities.service';
import { subgroupsService } from '../services/subgroups.service';
import { helpRequestsService } from '../services/helpRequests.service';
import { messagesService } from '../services/messages.service';
import { Community, SubGroup, CommunityPost, HelpRequest, CreateHelpRequestData, CreateSubGroupData, JoinRequest } from '../types';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import SubGroupCard from '../components/communities/SubGroupCard';
import CreateSubGroupForm from '../components/communities/CreateSubGroupForm';
import HelpRequestCard from '../components/posts/HelpRequestCard';
import CreateHelpRequestForm from '../components/posts/CreateHelpRequestForm';
import AdminInbox from '../components/community/AdminInbox';

const CommunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const [subGroups, setSubGroups] = useState<SubGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Tabs: posts, classes, help-requests, admin-inbox
  const initialTab = searchParams.get('tab') || 'posts';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Posts state
  const [newPostContent, setNewPostContent] = useState('');
  const [isPostingPost, setIsPostingPost] = useState(false);

  // SubGroups state
  const [showCreateSubGroupForm, setShowCreateSubGroupForm] = useState(false);

  // Help requests state
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [helpLoading, setHelpLoading] = useState(false);
  const [showHelpForm, setShowHelpForm] = useState(false);

  // Join request state
  const [joinRequesting, setJoinRequesting] = useState(false);
  const [cancellingRequest, setCancellingRequest] = useState(false);

  // Admin join requests state
  const [pendingJoinRequests, setPendingJoinRequests] = useState<JoinRequest[]>([]);
  const [joinRequestsLoading, setJoinRequestsLoading] = useState(false);

  const fetchCommunity = async () => {
    try {
      if (!id) return;
      setIsLoading(true);
      const data = await communitiesService.getCommunityById(id);
      setCommunity(data);

      // Fetch subgroups for school communities
      if (data.category === 'School') {
        const subs = await subgroupsService.getSubGroups(id);
        setSubGroups(subs);
      }
    } catch (err: any) {
      setError('Failed to load community');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHelpRequests = async () => {
    if (!id) return;
    try {
      setHelpLoading(true);
      const data = await helpRequestsService.getCommunityRequests(id);
      setHelpRequests(data);
    } catch {
      // silent
    } finally {
      setHelpLoading(false);
    }
  };

  const fetchJoinRequests = async () => {
    if (!id) return;
    try {
      setJoinRequestsLoading(true);
      const data = await communitiesService.getJoinRequests(id);
      setPendingJoinRequests(data);
    } catch {
      // silent - user might not be admin
    } finally {
      setJoinRequestsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunity();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'help-requests' && id) {
      fetchHelpRequests();
    }
    if (activeTab === 'admin-inbox' && id) {
      fetchJoinRequests();
    }
  }, [activeTab, id]);

  const handleJoin = async () => {
    if (!id) return;
    setJoinRequesting(true);
    try {
      await communitiesService.joinCommunity(id);
      fetchCommunity();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit join request');
    } finally {
      setJoinRequesting(false);
    }
  };

  const handleCancelJoinRequest = async () => {
    if (!id) return;
    setCancellingRequest(true);
    try {
      await communitiesService.cancelJoinRequest(id);
      fetchCommunity();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to cancel request');
    } finally {
      setCancellingRequest(false);
    }
  };

  const handleMessageAdmin = async () => {
    if (!community?.createdBy?.id) return;
    try {
      const conversation = await messagesService.getOrCreateConversation(community.createdBy.id);
      navigate(`/messages`);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to start conversation');
    }
  };

  const handleRespondToJoinRequest = async (requestId: string, status: 'APPROVED' | 'DENIED') => {
    if (!id) return;
    try {
      await communitiesService.respondToJoinRequest(id, requestId, status);
      fetchJoinRequests();
      fetchCommunity(); // Refresh member count
    } catch (err: any) {
      alert(err.response?.data?.error || `Failed to ${status.toLowerCase()} request`);
    }
  };

  const handleLeave = async () => {
    if (!id || !window.confirm('Are you sure you want to leave this community?')) return;
    try {
      await communitiesService.leaveCommunity(id);
      navigate('/communities');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to leave community');
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newPostContent.trim()) return;

    setIsPostingPost(true);
    try {
      await communitiesService.createCommunityPost(id, newPostContent.trim());
      setNewPostContent('');
      fetchCommunity(); // Refresh to get new post
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create post');
    } finally {
      setIsPostingPost(false);
    }
  };

  const handleCreateSubGroup = async (data: CreateSubGroupData) => {
    await subgroupsService.createSubGroup(data);
    setShowCreateSubGroupForm(false);
    if (id) {
      const subs = await subgroupsService.getSubGroups(id);
      setSubGroups(subs);
    }
  };

  const handleCreateHelpRequest = async (data: CreateHelpRequestData) => {
    await helpRequestsService.create(data);
    setShowHelpForm(false);
    fetchHelpRequests();
  };

  const handleStatusChange = async (requestId: string, status: string) => {
    try {
      await helpRequestsService.updateStatus(requestId, status);
      fetchHelpRequests();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error || 'Community not found'}
          </div>
        </div>
      </div>
    );
  }

  const isMember = community.isMember;
  const isAdmin = community.userRole === 'ADMIN';
  const isMod = community.userRole === 'MODERATOR';
  const isAdminOrMod = isAdmin || isMod;
  const isSchool = community.category === 'School';
  const hasPendingRequest = community.joinRequestStatus === 'PENDING';

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/communities')}
          className="text-brand-red hover:text-brand-red-dark mb-6 font-medium flex items-center gap-2"
        >
          ← Back to Communities
        </button>

        {/* Community Header */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
          {community.coverImage ? (
            <div className="h-48 bg-brand-red">
              <img
                src={community.coverImage}
                alt={community.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-48 bg-brand-red flex items-center justify-center">
              <span className="text-8xl">🏘️</span>
            </div>
          )}

          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-gray-900">{community.name}</h1>
                  {community.isPrivate && (
                    <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded">
                      🔒 Private
                    </span>
                  )}
                  {community.category && (
                    <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded">
                      {community.category}
                    </span>
                  )}
                  {isAdmin && (
                    <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-lg font-semibold">
                      Admin
                    </span>
                  )}
                </div>
                {community.location && (
                  <p className="text-gray-600 mb-2">📍 {community.location}</p>
                )}
              </div>
              <div className="flex gap-2 items-center">
                {/* Not a member and no pending request → Request to Join */}
                {!isMember && !hasPendingRequest && (
                  <>
                    <button
                      onClick={handleJoin}
                      disabled={joinRequesting}
                      className="bg-brand-red text-white px-6 py-3 rounded-md hover:bg-brand-red-dark transition font-semibold disabled:opacity-50"
                    >
                      {joinRequesting ? 'Sending...' : 'Request to Join'}
                    </button>
                    <button
                      onClick={handleMessageAdmin}
                      className="bg-white text-gray-700 px-4 py-3 rounded-md border border-gray-300 hover:bg-gray-50 transition font-medium text-sm"
                    >
                      Message Admin
                    </button>
                  </>
                )}
                {/* Pending request → show status + cancel */}
                {!isMember && hasPendingRequest && (
                  <>
                    <span className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-md font-semibold text-sm">
                      ⏳ Request Pending
                    </span>
                    <button
                      onClick={handleCancelJoinRequest}
                      disabled={cancellingRequest}
                      className="bg-white text-red-600 px-4 py-3 rounded-md border border-red-300 hover:bg-red-50 transition font-medium text-sm disabled:opacity-50"
                    >
                      {cancellingRequest ? 'Cancelling...' : 'Cancel Request'}
                    </button>
                    <button
                      onClick={handleMessageAdmin}
                      className="bg-white text-gray-700 px-4 py-3 rounded-md border border-gray-300 hover:bg-gray-50 transition font-medium text-sm"
                    >
                      Message Admin
                    </button>
                  </>
                )}
                {isMember && !isAdmin && (
                  <button
                    onClick={handleLeave}
                    className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition font-semibold"
                  >
                    Leave Community
                  </button>
                )}
              </div>
            </div>

            <p className="text-gray-700 mb-6">{community.description}</p>

            <div className="flex items-center gap-6 text-sm text-gray-600 border-t pt-4">
              <span>👥 {community._count?.members || 0} members</span>
              <span>📝 {community._count?.communityPosts || 0} posts</span>
              {isSchool && <span>📚 {community._count?.subGroups || 0} classes</span>}
            </div>
          </div>
        </div>

        {/* Member Content */}
        {isMember && (
          <>
            {/* Tab Navigation */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                  activeTab === 'posts'
                    ? 'bg-brand-red text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
                }`}
              >
                Posts
              </button>
              {isSchool && (
                <button
                  onClick={() => setActiveTab('classes')}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                    activeTab === 'classes'
                      ? 'bg-brand-red text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
                  }`}
                >
                  Classes
                </button>
              )}
              <button
                onClick={() => setActiveTab('help-requests')}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                  activeTab === 'help-requests'
                    ? 'bg-brand-red text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
                }`}
              >
                Help Requests
              </button>
              {isAdminOrMod && (
                <button
                  onClick={() => setActiveTab('admin-inbox')}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all relative ${
                    activeTab === 'admin-inbox'
                      ? 'bg-brand-red text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
                  }`}
                >
                  🔐 Admin Inbox
                  {pendingJoinRequests.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {pendingJoinRequests.length}
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* ===== POSTS TAB ===== */}
            {activeTab === 'posts' && (
              <>
                {/* Create Post Form */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                  <form onSubmit={handleCreatePost}>
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Share something with the community..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        type="submit"
                        disabled={isPostingPost || !newPostContent.trim()}
                        className="bg-brand-red text-white px-6 py-2.5 rounded-md hover:bg-brand-red-dark transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPostingPost ? 'Posting...' : 'Post'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Posts Feed */}
                {community.posts && community.posts.length > 0 ? (
                  <div className="space-y-4">
                    {community.posts.map((post: CommunityPost) => (
                      <div key={post.id} className="bg-white rounded-2xl border border-gray-200 p-6">
                        <p className="text-gray-800 mb-3">{post.content}</p>
                        <div className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600">
                      Be the first to share something with the community!
                    </p>
                  </div>
                )}
              </>
            )}

            {/* ===== CLASSES TAB (School communities only) ===== */}
            {activeTab === 'classes' && isSchool && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Classes</h2>
                  {!showCreateSubGroupForm && (
                    <button
                      onClick={() => setShowCreateSubGroupForm(true)}
                      className="bg-brand-red text-white px-6 py-3 rounded-md hover:bg-brand-red-dark transition font-semibold"
                    >
                      + Add Class
                    </button>
                  )}
                </div>

                {showCreateSubGroupForm && (
                  <div className="mb-8 bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
                    <div className="bg-neutral-900 px-6 py-4">
                      <h3 className="text-xl font-bold text-white">Add New Class</h3>
                    </div>
                    <div className="p-6">
                      <CreateSubGroupForm
                        parentCommunityId={id!}
                        onSubmit={handleCreateSubGroup}
                        onCancel={() => setShowCreateSubGroupForm(false)}
                      />
                    </div>
                  </div>
                )}

                {!showCreateSubGroupForm && (
                  <>
                    {subGroups.length === 0 ? (
                      <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No classes yet</h3>
                        <p className="text-gray-600 mb-6">
                          Add a class to help parents connect!
                        </p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {subGroups.map((sub) => (
                          <SubGroupCard
                            key={sub.id}
                            subGroup={sub}
                            onMembershipChange={fetchCommunity}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* ===== HELP REQUESTS TAB ===== */}
            {activeTab === 'help-requests' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Help Requests</h2>
                  {!showHelpForm && (
                    <button
                      onClick={() => setShowHelpForm(true)}
                      className="bg-brand-red text-white px-6 py-3 rounded-md hover:bg-brand-red-dark transition font-semibold"
                    >
                      Request Help
                    </button>
                  )}
                </div>

                {showHelpForm && (
                  <div className="mb-8 bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
                    <div className="bg-neutral-900 px-6 py-4">
                      <h3 className="text-xl font-bold text-white">Request Help</h3>
                    </div>
                    <div className="p-6">
                      <CreateHelpRequestForm
                        onSubmit={handleCreateHelpRequest}
                        onCancel={() => setShowHelpForm(false)}
                        preselectedCommunityId={id}
                      />
                    </div>
                  </div>
                )}

                {!showHelpForm && (
                  <>
                    {helpLoading ? (
                      <div className="flex items-center justify-center py-16">
                        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : helpRequests.length === 0 ? (
                      <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
                        <div className="text-6xl mb-4">🤝</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No help requests yet</h3>
                        <p className="text-gray-600 mb-6">
                          When someone in your community needs help, requests will appear here.
                        </p>
                        <button
                          onClick={() => setShowHelpForm(true)}
                          className="bg-brand-red text-white px-8 py-3 rounded-md hover:bg-brand-red-dark transition font-semibold"
                        >
                          Request Help
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {helpRequests.map(hr => (
                          <HelpRequestCard
                            key={hr.id}
                            helpRequest={hr}
                            isAdmin={isAdminOrMod}
                            onStatusChange={handleStatusChange}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* ===== ADMIN INBOX TAB ===== */}
            {activeTab === 'admin-inbox' && isAdminOrMod && (
              <div>
                {/* Join Requests Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">📩</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Join Requests</h3>
                      <p className="text-sm text-gray-500">People who want to join {community.name}</p>
                    </div>
                  </div>

                  {joinRequestsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : pendingJoinRequests.length === 0 ? (
                    <div className="bg-gray-50 rounded-2xl p-6 text-center mb-6">
                      <div className="text-3xl mb-2">✅</div>
                      <p className="text-gray-600 font-medium">No pending join requests</p>
                    </div>
                  ) : (
                    <div className="space-y-3 mb-6">
                      {pendingJoinRequests.map((request) => (
                        <div key={request.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red font-bold text-lg flex-shrink-0">
                              {request.user.profilePicture ? (
                                <img src={request.user.profilePicture} alt="" className="w-12 h-12 rounded-full object-cover" />
                              ) : (
                                `${request.user.firstName[0]}${request.user.lastName[0]}`
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900">
                                {request.user.firstName} {request.user.lastName}
                              </h4>
                              {request.user.location && (
                                <p className="text-sm text-gray-500">📍 {request.user.location}</p>
                              )}
                              {request.user.bio && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{request.user.bio}</p>
                              )}
                              {request.message && (
                                <p className="text-sm text-gray-700 mt-2 bg-gray-50 rounded-lg p-3 italic">
                                  "{request.message}"
                                </p>
                              )}
                              <p className="text-xs text-gray-400 mt-2">
                                Requested {new Date(request.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <button
                                onClick={() => handleRespondToJoinRequest(request.id, 'APPROVED')}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Deny ${request.user.firstName}'s request to join?`)) {
                                    handleRespondToJoinRequest(request.id, 'DENIED');
                                  }
                                }}
                                className="bg-white text-red-600 px-4 py-2 rounded-lg text-sm font-semibold border border-red-300 hover:bg-red-50 transition"
                              >
                                Deny
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    await messagesService.getOrCreateConversation(request.user.id);
                                    navigate('/messages');
                                  } catch {
                                    alert('Failed to start conversation');
                                  }
                                }}
                                className="bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition"
                              >
                                Message
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Existing Admin Inbox (help requests) */}
                <AdminInbox communityId={id!} communityName={community.name} />
              </div>
            )}
          </>
        )}

        {/* Non-Member Message */}
        {!isMember && (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
            {hasPendingRequest ? (
              <>
                <div className="text-6xl mb-4">⏳</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Your request is pending</h3>
                <p className="text-gray-600 mb-6">
                  The community admin will review your request to join. You'll be notified when they respond.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleCancelJoinRequest}
                    disabled={cancellingRequest}
                    className="bg-white text-red-600 px-6 py-3 rounded-md border border-red-300 hover:bg-red-50 transition font-semibold disabled:opacity-50"
                  >
                    {cancellingRequest ? 'Cancelling...' : 'Cancel Request'}
                  </button>
                  <button
                    onClick={handleMessageAdmin}
                    className="bg-brand-red text-white px-6 py-3 rounded-md hover:bg-brand-red-dark transition font-semibold"
                  >
                    Message Admin
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Request to join</h3>
                <p className="text-gray-600 mb-6">
                  Send a request to the community admin to join and view posts
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleJoin}
                    disabled={joinRequesting}
                    className="bg-brand-red text-white px-8 py-3 rounded-md hover:bg-brand-red-dark transition font-semibold disabled:opacity-50"
                  >
                    {joinRequesting ? 'Sending...' : 'Request to Join'}
                  </button>
                  <button
                    onClick={handleMessageAdmin}
                    className="bg-white text-gray-700 px-6 py-3 rounded-md border border-gray-300 hover:bg-gray-50 transition font-semibold"
                  >
                    Message Admin
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityDetail;
