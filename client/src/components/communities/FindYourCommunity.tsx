import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { communitiesService } from '../../services/communities.service';
import { Community, PlaceSuggestion, CreateCommunityData } from '../../types';

interface FindYourCommunityProps {
  onClose?: () => void;
}

const FindYourCommunity: React.FC<FindYourCommunityProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [zipCode, setZipCode] = useState('');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);

  // Place suggestions state
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [creatingSuggestion, setCreatingSuggestion] = useState<string | null>(null);

  const searchByZipCode = async (zip: string) => {
    if (zip.length !== 5) {
      setError('Please enter a valid 5-digit zip code');
      return;
    }

    setSearching(true);
    setLoading(true);
    setError('');
    setPlaceSuggestions([]);

    try {
      const allCommunities = await communitiesService.getAllCommunities();
      const filtered = allCommunities.filter(
        (community) => community.zipCode === zip
      );

      setCommunities(filtered);

      if (filtered.length === 0) {
        // No communities found — search Google Places for local orgs
        setLoadingSuggestions(true);
        try {
          const suggestions = await communitiesService.searchLocalPlaces(zip);
          setPlaceSuggestions(suggestions);
          if (suggestions.length === 0) {
            setError(`No communities found for zip code ${zip}. Try a nearby zip code or browse all communities.`);
          }
        } catch (err) {
          console.error('Places search error:', err);
          setError(`No communities found for zip code ${zip}. Try a nearby zip code or browse all communities.`);
        } finally {
          setLoadingSuggestions(false);
        }
      }
    } catch (err) {
      setError('Failed to search for communities. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Automatically search when component mounts if user has zipCode
  useEffect(() => {
    if (user?.zipCode) {
      setZipCode(user.zipCode);
      searchByZipCode(user.zipCode);
    }
  }, [user]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    searchByZipCode(zipCode);
  };

  const handleJoinCommunity = async (communityId: string) => {
    try {
      await communitiesService.joinCommunity(communityId);
      navigate(`/communities/${communityId}`);
      if (onClose) onClose();
    } catch (err) {
      console.error('Failed to join community:', err);
      setError('Failed to join community. Please try again.');
    }
  };

  const handleCreateFromSuggestion = async (suggestion: PlaceSuggestion) => {
    setCreatingSuggestion(suggestion.placeId);
    setError('');

    try {
      const communityData: CreateCommunityData = {
        name: suggestion.name,
        description: `${suggestion.category} serving the ${zipCode} area. Join to connect with your neighbors!`,
        address: suggestion.address,
        zipCode: zipCode,
        location: suggestion.address,
        isPrivate: false,
        category: suggestion.category,
      };

      const newCommunity = await communitiesService.createCommunity(communityData);
      navigate(`/communities/${newCommunity.id}`);
      if (onClose) onClose();
    } catch (err: any) {
      console.error('Failed to create community:', err);
      const errorMsg = err.response?.data?.error || '';
      if (errorMsg.includes('Unique constraint')) {
        setError('A community with this name already exists in your area. Try searching again!');
        // Re-search to find the existing community
        searchByZipCode(zipCode);
      } else {
        setError('Failed to create community. Please try again.');
      }
    } finally {
      setCreatingSuggestion(null);
    }
  };

  const resetSearch = () => {
    setSearching(false);
    setCommunities([]);
    setPlaceSuggestions([]);
    setZipCode('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to The Village! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Let's find your community
          </p>
        </div>

        {/* Search Form */}
        {!searching && (
          <form onSubmit={handleSearch} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Your Zip Code
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="55401"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                maxLength={5}
              />
              <button
                type="submit"
                disabled={loading || zipCode.length !== 5}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              We'll find communities in your area for your zip code
            </p>
          </form>
        )}

        {/* Error Message — only shown when no suggestions are loading/available */}
        {error && placeSuggestions.length === 0 && !loadingSuggestions && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Search Results — existing communities */}
        {searching && communities.length > 0 && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Communities in {zipCode}
              </h2>
              <p className="text-sm text-gray-600">
                Found {communities.length} communit{communities.length !== 1 ? 'ies' : 'y'}
              </p>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {communities.map((community) => (
                <div
                  key={community.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {community.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {community.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {community.address && (
                          <span>📍 {community.address}</span>
                        )}
                        {community._count && (
                          <>
                            <span>👥 {community._count.members} members</span>
                            <span>📝 {community._count.communityPosts} posts</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoinCommunity(community.id)}
                      className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition whitespace-nowrap"
                    >
                      {community.isMember ? 'View' : 'Join Community'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={resetSearch}
              className="mt-4 w-full py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              ← Search different zip code
            </button>
          </div>
        )}

        {/* Place Suggestions — shown when no DB communities found */}
        {searching && communities.length === 0 && !loading && (
          <div>
            {loadingSuggestions ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-[3px] border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm text-gray-600">Searching for local community groups...</p>
              </div>
            ) : placeSuggestions.length > 0 ? (
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    No communities yet in {zipCode}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    We found {placeSuggestions.length} local group{placeSuggestions.length !== 1 ? 's' : ''} near you.
                    Pick one to start a community!
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {placeSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.placeId}
                      className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {suggestion.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {suggestion.address}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                              {suggestion.category}
                            </span>
                            {suggestion.rating && (
                              <span className="flex items-center gap-1">
                                ⭐ {suggestion.rating}
                                {suggestion.userRatingsTotal && (
                                  <span className="text-gray-400">
                                    ({suggestion.userRatingsTotal})
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleCreateFromSuggestion(suggestion)}
                          disabled={creatingSuggestion === suggestion.placeId}
                          className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {creatingSuggestion === suggestion.placeId
                            ? 'Creating...'
                            : 'Create Community'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={resetSearch}
                  className="mt-4 w-full py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  ← Search different zip code
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Don't see your community?
          </p>
          <button
            onClick={() => navigate('/browse-communities')}
            className="text-red-600 hover:text-red-700 font-medium text-sm"
          >
            Browse all communities →
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindYourCommunity;
