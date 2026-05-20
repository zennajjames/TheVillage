// Guided flow that helps a new user find or create a community by zip code.
// Walks through: zip entry → existing community results → school/neighborhood category picker → place suggestions.
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { communitiesService } from '../../services/communities.service';
import { Community, PlaceSuggestion, CreateCommunityData } from '../../types';

interface FindYourCommunityProps {
  onClose?: () => void;
}

type ViewState = 'zip-form' | 'results' | 'place-suggestions';

const FindYourCommunity: React.FC<FindYourCommunityProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [zipCode, setZipCode] = useState('');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // View state machine: zip-form → results → place-suggestions
  const [view, setView] = useState<ViewState>('zip-form');

  // Search filter for communities list
  const [searchFilter, setSearchFilter] = useState('');

  // Category search
  const [searchType, setSearchType] = useState<'school' | 'neighborhood' | null>(null);
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [creatingSuggestion, setCreatingSuggestion] = useState<string | null>(null);

  // Search filter for place suggestions
  const [placeFilter, setPlaceFilter] = useState('');

  // Join request state
  const [joiningCommunity, setJoiningCommunity] = useState<string | null>(null);
  const [requestSent, setRequestSent] = useState<Set<string>>(new Set());

  const searchByZipCode = async (zip: string) => {
    if (zip.length !== 5) {
      setError('Please enter a valid 5-digit zip code');
      return;
    }

    setLoading(true);
    setError('');
    setSearchFilter('');

    try {
      const allCommunities = await communitiesService.getAllCommunities();
      const filtered = allCommunities.filter(
        (community) => community.zipCode === zip
      );
      setCommunities(filtered);
      setView('results');
    } catch (err) {
      setError('Failed to search for communities. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchByCategory = async (type: 'school' | 'neighborhood') => {
    setSearchType(type);
    setView('place-suggestions');
    setLoadingSuggestions(true);
    setPlaceSuggestions([]);
    setPlaceFilter('');
    setError('');

    try {
      const suggestions = await communitiesService.searchLocalPlaces(zipCode, type);
      setPlaceSuggestions(suggestions);
      if (suggestions.length === 0) {
        setError(`No ${type === 'school' ? 'schools' : 'neighborhoods'} found for zip code ${zipCode}. Try a different category or zip code.`);
      }
    } catch (err) {
      console.error('Places search error:', err);
      setError(`Failed to search for ${type === 'school' ? 'schools' : 'neighborhoods'}. Please try again.`);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Automatically search when component mounts if user has zipCode
  useEffect(() => {
    if (user?.zipCode) {
      setZipCode(user.zipCode);
      searchByZipCode(user.zipCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    searchByZipCode(zipCode);
  };

  const handleJoinCommunity = async (communityId: string) => {
    try {
      const community = communities.find(c => c.id === communityId);
      if (community?.isMember) {
        navigate(`/communities/${communityId}`);
        if (onClose) onClose();
        return;
      }
      setJoiningCommunity(communityId);
      await communitiesService.joinCommunity(communityId);
      setRequestSent(prev => new Set(prev).add(communityId));
    } catch (err: any) {
      console.error('Failed to request join:', err);
      setError(err.response?.data?.error || 'Failed to send join request. Please try again.');
    } finally {
      setJoiningCommunity(null);
    }
  };

  const handleCreateFromSuggestion = async (suggestion: PlaceSuggestion) => {
    setCreatingSuggestion(suggestion.placeId);
    setError('');

    try {
      const communityData: CreateCommunityData = {
        name: suggestion.name,
        description: `${suggestion.category} serving the ${zipCode} area. Join to connect with parents and caregivers nearby!`,
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
        searchByZipCode(zipCode);
      } else {
        setError('Failed to create community. Please try again.');
      }
    } finally {
      setCreatingSuggestion(null);
    }
  };

  const resetSearch = () => {
    setView('zip-form');
    setCommunities([]);
    setPlaceSuggestions([]);
    setSearchType(null);
    setZipCode('');
    setError('');
    setSearchFilter('');
    setPlaceFilter('');
  };

  const backToResults = () => {
    setPlaceSuggestions([]);
    setSearchType(null);
    setPlaceFilter('');
    setView('results');
    setError('');
  };

  // Filter communities by search text
  const filteredCommunities = communities.filter(c =>
    !searchFilter || c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.address?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Filter place suggestions by search text
  const filteredSuggestions = placeSuggestions.filter(s =>
    !placeFilter || s.name.toLowerCase().includes(placeFilter.toLowerCase()) ||
    s.address.toLowerCase().includes(placeFilter.toLowerCase())
  );

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

        {/* Error Message */}
        {error && view !== 'place-suggestions' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* ===== ZIP CODE FORM ===== */}
        {view === 'zip-form' && (
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

        {/* Loading spinner for initial search */}
        {loading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-[3px] border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-600">Searching communities...</p>
          </div>
        )}

        {/* ===== RESULTS VIEW: Communities + Category Picker ===== */}
        {view === 'results' && !loading && (
          <div>
            {/* Existing communities */}
            {communities.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Communities in {zipCode}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Found {communities.length} communit{communities.length !== 1 ? 'ies' : 'y'}
                    </p>
                  </div>
                </div>

                {/* Search filter */}
                {communities.length > 3 && (
                  <div className="mb-3">
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Search communities..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                    />
                  </div>
                )}

                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {filteredCommunities.length > 0 ? filteredCommunities.map((community) => (
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
                        {community.isMember ? (
                          <button
                            onClick={() => handleJoinCommunity(community.id)}
                            className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition whitespace-nowrap"
                          >
                            View
                          </button>
                        ) : requestSent.has(community.id) || community.joinRequestStatus === 'PENDING' ? (
                          <span className="ml-4 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium whitespace-nowrap">
                            ⏳ Request Sent
                          </span>
                        ) : (
                          <button
                            onClick={() => handleJoinCommunity(community.id)}
                            disabled={joiningCommunity === community.id}
                            className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition whitespace-nowrap disabled:opacity-50"
                          >
                            {joiningCommunity === community.id ? 'Sending...' : 'Request to Join'}
                          </button>
                        )}
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No communities match "{searchFilter}"
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Category Picker — always shown */}
            <div className={communities.length > 0 ? 'pt-6 border-t border-gray-200' : ''}>
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {communities.length > 0 ? "Don't see yours?" : `No communities yet in ${zipCode}`}
                </h2>
                <p className="text-sm text-gray-600">
                  {communities.length > 0 ? 'Search for a school or neighborhood to start a new community' : 'What are you looking for?'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => searchByCategory('school')}
                  className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 rounded-xl hover:border-red-400 hover:bg-red-50 transition group"
                >
                  <span className="text-4xl">🏫</span>
                  <span className="font-semibold text-gray-900 group-hover:text-red-600">Schools</span>
                  <span className="text-xs text-gray-500 text-center">Elementary, middle & high schools</span>
                </button>
                <button
                  onClick={() => searchByCategory('neighborhood')}
                  className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 rounded-xl hover:border-red-400 hover:bg-red-50 transition group"
                >
                  <span className="text-4xl">🏘️</span>
                  <span className="font-semibold text-gray-900 group-hover:text-red-600">Neighborhoods</span>
                  <span className="text-xs text-gray-500 text-center">Local neighborhoods & areas</span>
                </button>
              </div>

              <button
                onClick={resetSearch}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                ← Search different zip code
              </button>
            </div>
          </div>
        )}

        {/* ===== PLACE SUGGESTIONS VIEW ===== */}
        {view === 'place-suggestions' && (
          <div>
            {loadingSuggestions ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-[3px] border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm text-gray-600">
                  Searching for {searchType === 'school' ? 'schools' : 'neighborhoods'}...
                </p>
              </div>
            ) : placeSuggestions.length > 0 ? (
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {searchType === 'school' ? 'Schools' : 'Neighborhoods'} near {zipCode}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Found {placeSuggestions.length} result{placeSuggestions.length !== 1 ? 's' : ''}.
                    Pick one to start a community!
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Search filter for place suggestions */}
                {placeSuggestions.length > 3 && (
                  <div className="mb-3">
                    <input
                      type="text"
                      value={placeFilter}
                      onChange={(e) => setPlaceFilter(e.target.value)}
                      placeholder={`Search ${searchType === 'school' ? 'schools' : 'neighborhoods'}...`}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                    />
                  </div>
                )}

                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {filteredSuggestions.length > 0 ? filteredSuggestions.map((suggestion) => (
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
                  )) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No results match "{placeFilter}"
                    </p>
                  )}
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={backToResults}
                    className="flex-1 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    ← Back to categories
                  </button>
                  <button
                    onClick={resetSearch}
                    className="flex-1 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    ← Different zip code
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                <button
                  onClick={backToResults}
                  className="mt-4 w-full py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  ← Back to categories
                </button>
              </div>
            )}
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
