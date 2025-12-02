import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { communitiesService } from '../services/communities.service';
import { groupsService } from '../services/groups.service';
import { Community, Group } from '../types';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import CreateGroupForm from '../components/groups/CreateGroupForm';

const CommunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const CATEGORIES = [
    'All',
    'Fundraising',
    'Events',
    'Classroom Parents',
    'Volunteer Coordination',
    'Board/Leadership',
    'General Discussion',
    'Other'
  ];

  const fetchCommunity = async () => {
    try {
      if (!id) return;
      setIsLoading(true);
      const data = await communitiesService.getCommunityById(id);
      setCommunity(data);

      // Fetch groups for this community
      const communityGroups = await groupsService.getGroups({ communityId: id });
      setGroups(communityGroups);
    } catch (err: any) {
      setError('Failed to load community');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunity();
  }, [id]);

  const handleJoin = async () => {
    if (!id) return;
    try {
      await communitiesService.joinCommunity(id);
      fetchCommunity();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to join community');
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

  const handleCreateGroup = async (data: any) => {
    await groupsService.createGroup(data);
    setShowCreateGroupForm(false);
    fetchCommunity();
  };

  const filterByCategory = (groupsList: Group[]) => {
    if (selectedCategory === 'All') return groupsList;
    return groupsList.filter(group => group.category === selectedCategory);
  };

  const displayedGroups = filterByCategory(groups);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/communities')}
          className="text-purple-600 hover:text-purple-700 mb-6 font-medium flex items-center gap-2"
        >
          ← Back to Communities
        </button>

        {/* Community Header */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
          {community.coverImage && (
            <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400">
              <img
                src={community.coverImage}
                alt={community.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {!community.coverImage && (
            <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <span className="text-8xl">🏫</span>
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
                </div>
                {community.location && (
                  <p className="text-gray-600 mb-2">📍 {community.location}</p>
                )}
              </div>
              <div className="flex gap-2">
                {!isMember && (
                  <button
                    onClick={handleJoin}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition font-semibold"
                  >
                    Join Community
                  </button>
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
              <span>📚 {community._count?.groups || 0} groups</span>
            </div>
          </div>
        </div>

        {/* Groups Section */}
        {isMember && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Groups</h2>
              {!showCreateGroupForm && (
                <button
                  onClick={() => setShowCreateGroupForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition font-semibold"
                >
                  + Create Group
                </button>
              )}
            </div>

            {/* Create Group Form */}
            {showCreateGroupForm && (
              <div className="mb-8 bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                  <h3 className="text-xl font-bold text-white">Create New Group</h3>
                </div>
                <div className="p-6">
                  <CreateGroupForm
                    communityId={id!}
                    onSubmit={handleCreateGroup}
                    onCancel={() => setShowCreateGroupForm(false)}
                  />
                </div>
              </div>
            )}

            {/* Category Filter */}
            {!showCreateGroupForm && groups.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-semibold text-gray-700">Filter by Category:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Groups Grid */}
            {!showCreateGroupForm && (
              <>
                {displayedGroups.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No groups yet</h3>
                    <p className="text-gray-600 mb-6">
                      Be the first to create a group in this community!
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {displayedGroups.map((group) => (
                      <div
                        key={group.id}
                        onClick={() => navigate(`/groups/${group.id}`)}
                        className="bg-white rounded-3xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer p-6"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{group.name}</h3>
                            <p className="text-sm text-purple-600 font-medium">{group.category}</p>
                          </div>
                          {group.isPrivate && (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                              🔒 Private
                            </span>
                          )}
                        </div>

                        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{group.description}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>👥 {group._count?.members || 0} members</span>
                          <span>💬 {group._count?.posts || 0} posts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Non-Member Message */}
        {!isMember && (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Join to see groups</h3>
            <p className="text-gray-600 mb-6">
              Become a member of this community to view and join groups
            </p>
            <button
              onClick={handleJoin}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition font-semibold"
            >
              Join Community
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityDetail;
