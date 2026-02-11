import React, { useState, useEffect } from 'react';
import { communitiesService } from '../services/communities.service';
import { Community } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';

const Communities: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [myCommunities, setMyCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');

  const fetchCommunities = async () => {
    try {
      setIsLoading(true);
      const allCommunities = await communitiesService.getAllCommunities();
      const userCommunities = await communitiesService.getUserCommunities();
      setCommunities(allCommunities);
      setMyCommunities(userCommunities);
    } catch (err: any) {
      setError('Failed to load communities');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  // If no communities, redirect to find your community
  useEffect(() => {
    if (!isLoading && myCommunities.length === 0 && activeTab === 'my') {
      navigate('/find-your-community');
    }
  }, [isLoading, myCommunities, activeTab, navigate]);

  const handleJoinCommunity = async (communityId: string) => {
    try {
      await communitiesService.joinCommunity(communityId);
      fetchCommunities();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to join community');
    }
  };

  const displayedCommunities = activeTab === 'all' ? communities : myCommunities;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-brand-red mb-2">
                My Communities
              </h1>
              <p className="text-gray-600">
                Your communities
              </p>
            </div>
          </div>

          {/* Tab Pills */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setActiveTab('my')}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'my'
                  ? 'bg-brand-red text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
              }`}
            >
              My Communities ({myCommunities.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-brand-red text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
              }`}
            >
              All Communities ({communities.length})
            </button>
          </div>
        </div>

        {/* Communities Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading communities...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-3xl px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        ) : displayedCommunities.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🏫</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {activeTab === 'my' ? 'No communities yet' : 'No communities available'}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'my'
                ? 'Join a community to get started!'
                : 'Be the first to create a community!'}
            </p>
            {activeTab === 'my' && (
              <button
                onClick={() => navigate('/find-your-community')}
                className="bg-brand-red text-white px-6 py-3 rounded-md font-semibold hover:bg-brand-red-dark transition"
              >
                Find Your Community
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {displayedCommunities.map((community) => (
              <div
                key={community.id}
                className="bg-white rounded-3xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all overflow-hidden cursor-pointer"
                onClick={() => navigate(`/communities/${community.id}`)}
              >
                {community.coverImage && (
                  <div className="h-40 bg-brand-red">
                    <img
                      src={community.coverImage}
                      alt={community.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {!community.coverImage && (
                  <div className="h-40 bg-brand-red flex items-center justify-center">
                    <span className="text-6xl">🏫</span>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{community.name}</h3>
                      {community.location && (
                        <p className="text-sm text-gray-600">📍 {community.location}</p>
                      )}
                    </div>
                    {community.isPrivate && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        🔒 Private
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{community.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span>👥 {community._count?.members || 0} members</span>
                    <span>📝 {community._count?.communityPosts || 0} posts</span>
                  </div>

                  {!community.isMember && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinCommunity(community.id);
                      }}
                      className="w-full bg-brand-red text-white py-2 px-4 rounded-md font-medium hover:bg-brand-red-dark transition"
                    >
                      Join Community
                    </button>
                  )}
                  {community.isMember && (
                    <div className="flex items-center justify-center gap-2 text-green-600 font-medium py-2">
                      <span>✓</span>
                      <span>Member</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {communities.length > 0 && (
          <div className="mt-8 bg-white rounded-3xl border border-gray-200 p-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-brand-red">
                  {communities.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Total Communities</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-black">
                  {myCommunities.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Your Communities</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Communities;
