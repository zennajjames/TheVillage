import React, { useState, useEffect } from 'react';
import { groupsService } from '../services/groups.service';
import { Group, CreateGroupData } from '../types';
import GroupCard from '../components/groups/GroupCard';
import CreateGroupForm from '../components/groups/CreateGroupForm';
import Header from '../components/layout/Header';

const CATEGORIES = [
  'All',
  'Neighborhood',
  'Playgroup',
  'School',
  'Activities',
  'Special Needs',
  'Working',
  'Stay-at-Home',
  'Single Parents',
  'Other'
];

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState<string>('All');

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const filterCategory = filter === 'All' ? undefined : filter;
      const data = await groupsService.getGroups(filterCategory);
      setGroups(data);
    } catch (err: any) {
      setError('Failed to load groups');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [filter]);

  const handleCreateGroup = async (data: CreateGroupData) => {
    await groupsService.createGroup(data);
    setShowCreateForm(false);
    fetchGroups();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
            >
              + Create Group
            </button>
          )}
        </div>

        {showCreateForm && (
          <div className="mb-6">
            <CreateGroupForm
              onSubmit={handleCreateGroup}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        {!showCreateForm && (
          <>
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                    filter === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Groups Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-xl text-gray-600">Loading groups...</div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            ) : groups.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-xl text-gray-600 mb-4">No groups yet</div>
                <p className="text-gray-500">Be the first to create a group!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Groups;