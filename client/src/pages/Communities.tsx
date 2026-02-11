import React, { useState, useEffect } from 'react';
import { communitiesService } from '../services/communities.service';
import { Community } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import DashboardMap from '../components/map/DashboardMap';
import { getSchoolCoordinates, calculateDistance, getUserLocation } from '../utils/geocoding';

const Communities: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [myCommunities, setMyCommunities] = useState<Community[]>([]);
  const [closestCommunities, setClosestCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'my' | 'all' | 'explore'>('my');
  const [radius, setRadius] = useState(10);

  const radiusOptions = [5, 10, 25, 50];

  const fetchCommunities = async () => {
    try {
      setIsLoading(true);
      const allCommunities = await communitiesService.getAllCommunities();
      const userCommunities = await communitiesService.getUserCommunities();
      setCommunities(allCommunities);
      setMyCommunities(userCommunities);

      // Compute distance-sorted communities for the explore tab
      const userCoords = await getUserLocation(
        user?.zipCode,
        user?.street,
        user?.city,
        user?.state
      );
      const sorted = allCommunities
        .map((community) => {
          const coords = getSchoolCoordinates(community.name);
          const distance = coords
            ? calculateDistance(userCoords.lat, userCoords.lng, coords.lat, coords.lng)
            : Infinity;
          return { community, distance };
        })
        .filter(({ distance }) => distance <= radius)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10)
        .map(({ community }) => community);
      setClosestCommunities(sorted);
    } catch (err: any) {
      setError('Failed to load communities');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, [radius]);

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
                Communities
              </h1>
              <p className="text-gray-600">
                Discover and join communities near you
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
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'explore'
                  ? 'bg-brand-red text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
              }`}
            >
              Explore Map
            </button>
          </div>
        </div>

        {/* Explore Map Tab */}
        {activeTab === 'explore' && (
          <div className="mb-8">
            <div className="bg-white rounded-3xl border-2 border-neutral-200 shadow-soft overflow-hidden">
              {/* Map Header */}
              <div className="p-6 border-b border-neutral-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-1">
                      Local Communities Near You
                    </h2>
                    <p className="text-neutral-600 text-sm flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {user?.location || 'Your area'}
                    </p>
                  </div>
                </div>

                {/* Radius Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-600 font-medium">Radius:</span>
                  {radiusOptions.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRadius(r)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        radius === r
                          ? 'bg-brand-red text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {r} mi
                    </button>
                  ))}
                </div>
              </div>

              {/* Map Visualization */}
              <DashboardMap communities={communities} radius={radius} />

              {/* Nearby Communities List */}
              <div className="p-6">
                <h3 className="font-bold text-neutral-900 mb-4">Nearby Communities</h3>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-3 border-brand-red border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : closestCommunities.length > 0 ? (
                  <div className="space-y-3">
                    {closestCommunities.map((community) => (
                      <button
                        key={community.id}
                        onClick={() => navigate(`/communities/${community.id}`)}
                        className="w-full text-left p-4 rounded-2xl border-2 border-brand-red/20 hover:border-brand-red hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-neutral-900 mb-1">{community.name}</h4>
                            <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                              <span className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                </svg>
                                {community._count?.members || 0} members
                              </span>
                              {community.category && <span>• {community.category}</span>}
                            </div>
                          </div>
                          <span className="text-brand-red ml-4">→</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-neutral-500">
                    No communities found nearby. Try increasing the radius or be the first to create one!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* My / All Communities Grid */}
        {activeTab !== 'explore' && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Communities;
