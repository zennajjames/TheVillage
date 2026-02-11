import React, { useState, useEffect } from 'react';
import { communitiesService } from '../services/communities.service';
import { Community } from '../types';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';

const BrowseCommunities: React.FC = () => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCommunities = async () => {
    try {
      setIsLoading(true);
      const allCommunities = await communitiesService.getAllCommunities();
      setCommunities(allCommunities);
    } catch (err: any) {
      setError('Failed to load communities');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleJoinCommunity = async (communityId: string) => {
    try {
      await communitiesService.joinCommunity(communityId);
      navigate('/communities');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to join community');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <h1 className="text-4xl font-bold text-brand-red mb-2">
            Browse All Communities
          </h1>
          <p className="text-gray-600">
            Explore all available communities
          </p>
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
        ) : communities.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🏫</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No communities available
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to create a community!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <div
                key={community.id}
                className="bg-white rounded-3xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all overflow-hidden"
              >
                {community.coverImage && (
                  <div className="h-32 bg-brand-red">
                    <img
                      src={community.coverImage}
                      alt={community.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {!community.coverImage && (
                  <div className="h-32 bg-brand-red flex items-center justify-center">
                    <span className="text-5xl">🏫</span>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{community.name}</h3>
                      {community.location && (
                        <p className="text-xs text-gray-600">📍 {community.location}</p>
                      )}
                    </div>
                    {community.isPrivate && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        🔒 Private
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">{community.description}</p>

                  <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                    <span>👥 {community._count?.members || 0}</span>
                    <span>📝 {community._count?.communityPosts || 0}</span>
                  </div>

                  {!community.isMember ? (
                    <button
                      onClick={() => handleJoinCommunity(community.id)}
                      className="w-full bg-brand-red text-white py-2 px-4 rounded-md font-medium hover:bg-brand-red-dark transition text-sm"
                    >
                      Join This Community
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-green-600 font-medium py-2 text-sm">
                      <span>✓</span>
                      <span>Your Current Community</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseCommunities;
