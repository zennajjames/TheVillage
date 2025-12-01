import React, { useState, useEffect } from 'react';
import { groupsService } from '../services/groups.service';
import { Group } from '../types';
import { useAuth } from '../context/AuthContext';
import GroupCard from '../components/groups/GroupCard';
import CreateGroupForm from '../components/groups/CreateGroupForm';
import Header from '../components/layout/Header';

const Groups: React.FC = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const allGroups = await groupsService.getGroups();
      const userGroups = allGroups.filter(group => 
        group.members?.some(member => member.userId === user?.id)
      );
      setGroups(allGroups);
      setMyGroups(userGroups);
    } catch (err: any) {
      setError('Failed to load groups');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (data: any) => {
    await groupsService.createGroup(data);
    setShowCreateForm(false);
    fetchGroups();
  };

  const displayedGroups = activeTab === 'all' ? groups : myGroups;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Groups
              </h1>
              <p className="text-gray-600">
                Connect with neighbors who share your interests
              </p>
            </div>
            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold"
              >
                + Create Group
              </button>
            )}
          </div>

          {/* Tab Pills */}
          {!showCreateForm && (
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
                }`}
              >
                All Groups ({groups.length})
              </button>
              <button
                onClick={() => setActiveTab('my')}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                  activeTab === 'my'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
                }`}
              >
                My Groups ({myGroups.length})
              </button>
            </div>
          )}
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-8 bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Create New Group</h2>
            </div>
            <div className="p-6">
              <CreateGroupForm
                onSubmit={handleCreateGroup}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        )}

        {/* Groups Grid */}
        {!showCreateForm && (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading groups...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-3xl px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            ) : displayedGroups.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {activeTab === 'my' ? 'No groups yet' : 'No groups available'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'my' 
                    ? 'Join or create a group to get started!' 
                    : 'Be the first to create a group in your community!'}
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
                >
                  Create First Group
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {displayedGroups.map((group) => (
                  <div key={group.id} className="bg-white rounded-3xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all">
                    <GroupCard group={group} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Stats */}
        {!showCreateForm && groups.length > 0 && (
          <div className="mt-8 bg-white rounded-3xl border border-gray-200 p-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {groups.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Total Groups</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  {myGroups.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Your Groups</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
