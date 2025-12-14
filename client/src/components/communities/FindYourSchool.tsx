import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { communitiesService } from '../../services/communities.service';
import { Community } from '../../types';

interface FindYourSchoolProps {
  onClose?: () => void;
}

const FindYourSchool: React.FC<FindYourSchoolProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [zipCode, setZipCode] = useState('');
  const [schools, setSchools] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);

  const searchByZipCode = async (zip: string) => {
    if (zip.length !== 5) {
      setError('Please enter a valid 5-digit zip code');
      return;
    }

    setSearching(true);
    setLoading(true);
    setError('');

    try {
      const allCommunities = await communitiesService.getAllCommunities();
      const filteredSchools = allCommunities.filter(
        (community) => community.zipCode === zip
      );

      setSchools(filteredSchools);

      if (filteredSchools.length === 0) {
        setError(`No schools found for zip code ${zip}. Try a nearby zip code or contact us to add your school.`);
      }
    } catch (err) {
      setError('Failed to search for schools. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Automatically search for schools when component mounts if user has zipCode
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
      // Refresh to update the app state
      navigate(`/communities/${communityId}`);
      if (onClose) onClose();
    } catch (err) {
      console.error('Failed to join community:', err);
      setError('Failed to join school. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to The Village! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Let's find your school community
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
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                maxLength={5}
              />
              <button
                type="submit"
                disabled={loading || zipCode.length !== 5}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              We'll find schools in the Minneapolis area for your zip code
            </p>
          </form>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Search Results */}
        {searching && schools.length > 0 && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Schools in {zipCode}
              </h2>
              <p className="text-sm text-gray-600">
                Found {schools.length} school{schools.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {schools.map((school) => (
                <div
                  key={school.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {school.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {school.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {school.address && (
                          <span>📍 {school.address}</span>
                        )}
                        {school._count && (
                          <>
                            <span>👥 {school._count.members} members</span>
                            <span>📚 {school._count.groups} groups</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoinCommunity(school.id)}
                      className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition whitespace-nowrap"
                    >
                      {school.isMember ? 'View' : 'Join School'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setSearching(false);
                setSchools([]);
                setZipCode('');
                setError('');
              }}
              className="mt-4 w-full py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              ← Search different zip code
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Don't see your school?
          </p>
          <button
            onClick={() => navigate('/browse-communities')}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            Browse all communities →
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindYourSchool;
