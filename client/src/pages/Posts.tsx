// Cross-community posts board with a "Help Requests" tab. Lets users browse and create
// general posts or help requests across all communities they belong to.
import React, { useState, useEffect } from 'react';
import { postsService } from '../services/posts.service';
import { helpRequestsService } from '../services/helpRequests.service';
import { Post, PostType, CreatePostData, HelpRequest, CreateHelpRequestData } from '../types';
import { communitiesService } from '../services/communities.service';
import { Community } from '../types';
import PostCard from '../components/posts/PostCard';
import CreatePostForm from '../components/posts/CreatePostForm';
import CreateHelpRequestForm from '../components/posts/CreateHelpRequestForm';
import HelpRequestCard from '../components/posts/HelpRequestCard';
import Header from '../components/layout/Header';

const Posts: React.FC = () => {
  const [tab, setTab] = useState<'board' | 'help'>('board');

  // Board state
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'REQUEST' | 'OFFER'>('ALL');

  // Help requests state
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [helpLoading, setHelpLoading] = useState(false);
  const [helpError, setHelpError] = useState('');
  const [showHelpForm, setShowHelpForm] = useState(false);
  const [userCommunities, setUserCommunities] = useState<Community[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState('');

  const fetchPosts = async () => {
    if (!selectedCommunityId) return;
    try {
      setIsLoading(true);
      const filterType = filter === 'ALL' ? undefined : filter;
      const data = await postsService.getPosts(filterType, undefined, selectedCommunityId);
      setPosts(data);
    } catch (err: any) {
      setError('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserCommunities = async () => {
    try {
      const data = await communitiesService.getUserCommunities();
      setUserCommunities(data);
      if (data.length > 0 && !selectedCommunityId) {
        setSelectedCommunityId(data[0].id);
      }
    } catch {}
  };

  const fetchHelpRequests = async () => {
    if (!selectedCommunityId) return;
    try {
      setHelpLoading(true);
      const data = await helpRequestsService.getCommunityRequests(selectedCommunityId);
      setHelpRequests(data);
    } catch (err: any) {
      setHelpError('Failed to load help requests');
    } finally {
      setHelpLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCommunities();
  }, []);

  useEffect(() => {
    if (tab === 'board' && selectedCommunityId) {
      fetchPosts();
    } else if (tab === 'help' && selectedCommunityId) {
      fetchHelpRequests();
    }
  }, [tab, filter, selectedCommunityId]);

  const handleCreatePost = async (data: CreatePostData) => {
    await postsService.createPost(data);
    setShowCreateForm(false);
    fetchPosts();
  };

  const handleCreateHelpRequest = async (data: CreateHelpRequestData) => {
    await helpRequestsService.create(data);
    setShowHelpForm(false);
    fetchHelpRequests();
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await helpRequestsService.updateStatus(id, status);
      fetchHelpRequests();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-brand-red mb-2">
                Community Board
              </h1>
              <p className="text-gray-600">
                Share what you need, offer what you have
              </p>
            </div>
            {tab === 'board' && !showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-brand-red text-white px-6 py-3 rounded-md hover:bg-brand-red-dark transition-all font-semibold"
              >
                + New Post
              </button>
            )}
            {tab === 'help' && !showHelpForm && (
              <button
                onClick={() => setShowHelpForm(true)}
                className="bg-brand-red text-white px-6 py-3 rounded-md hover:bg-brand-red-dark transition-all font-semibold"
              >
                Request Help
              </button>
            )}
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => { setTab('board'); setShowHelpForm(false); }}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                tab === 'board'
                  ? 'bg-brand-red text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
              }`}
            >
              Community Board
            </button>
            <button
              onClick={() => { setTab('help'); setShowCreateForm(false); }}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                tab === 'help'
                  ? 'bg-brand-red text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
              }`}
            >
              Help Requests
            </button>
          </div>

          {/* Community picker (shown for both tabs) */}
          {userCommunities.length > 0 && !showCreateForm && !showHelpForm && (
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <span className="text-sm font-semibold text-gray-600">Community:</span>
              {userCommunities.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCommunityId(c.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    selectedCommunityId === c.id
                      ? 'bg-brand-red text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {/* Board filter pills */}
          {tab === 'board' && !showCreateForm && (
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                  filter === 'ALL'
                    ? 'bg-brand-red text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
                }`}
              >
                All Posts
              </button>
              <button
                onClick={() => setFilter('REQUEST')}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                  filter === 'REQUEST'
                    ? 'bg-brand-red text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
                }`}
              >
                Requests
              </button>
              <button
                onClick={() => setFilter('OFFER')}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                  filter === 'OFFER'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-green-300'
                }`}
              >
                Offers
              </button>
            </div>
          )}
        </div>

        {/* ===== BOARD TAB ===== */}
        {tab === 'board' && (
          <>
            {showCreateForm && (
              <div className="mb-8 bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="bg-neutral-900 px-6 py-4">
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

            {!showCreateForm && (
              <>
                {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
                      className="bg-brand-red text-white px-8 py-3 rounded-md hover:bg-brand-red-dark transition-all font-semibold"
                    >
                      Create First Post
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div key={post.id} className="bg-white rounded-3xl border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all">
                        <PostCard post={post} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {!showCreateForm && posts.length > 0 && (
              <div className="mt-8 bg-white rounded-3xl border border-gray-200 p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-brand-red">
                      {posts.length}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Total Posts</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-brand-red">
                      {posts.filter(p => p.type === PostType.REQUEST).length}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Requests</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-neutral-900">
                      {posts.filter(p => p.type === PostType.OFFER).length}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Offers</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ===== HELP REQUESTS TAB ===== */}
        {tab === 'help' && (
          <>
            {showHelpForm && (
              <div className="mb-8 bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="bg-neutral-900 px-6 py-4">
                  <h2 className="text-xl font-bold text-white">Request Help</h2>
                </div>
                <div className="p-6">
                  <CreateHelpRequestForm
                    onSubmit={handleCreateHelpRequest}
                    onCancel={() => setShowHelpForm(false)}
                  />
                </div>
              </div>
            )}

            {!showHelpForm && (
              <>
                {userCommunities.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
                    <div className="text-6xl mb-4">🏘️</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Join a community first</h3>
                    <p className="text-gray-600">You need to be part of a community to see or create help requests.</p>
                  </div>
                ) : helpLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 font-medium">Loading help requests...</p>
                    </div>
                  </div>
                ) : helpError ? (
                  <div className="bg-red-50 border border-red-200 rounded-3xl px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚠️</span>
                      <p className="text-red-700 font-medium">{helpError}</p>
                    </div>
                  </div>
                ) : helpRequests.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
                    <div className="text-6xl mb-4">🤝</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No help requests yet</h3>
                    <p className="text-gray-600 mb-6">When someone in your community needs help, it will show up here.</p>
                    <button
                      onClick={() => setShowHelpForm(true)}
                      className="bg-brand-red text-white px-8 py-3 rounded-md hover:bg-brand-red-dark transition-all font-semibold"
                    >
                      Request Help
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {helpRequests.map((hr) => (
                      <HelpRequestCard
                        key={hr.id}
                        helpRequest={hr}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Posts;
