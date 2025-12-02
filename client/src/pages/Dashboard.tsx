import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Header from '../components/layout/Header';
import DashboardMap from '../components/map/DashboardMap';



interface Group {
  id: string;
  name: string;
  description: string;
  category?: string;
  memberCount?: number;
  distance?: number;
}

interface Stats {
  posts: number;
  groups: number;
  friends: number;
  messages: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nearbyGroups, setNearbyGroups] = useState<Group[]>([]);
  const [stats, setStats] = useState<Stats>({ posts: 0, groups: 0, friends: 0, messages: 0 });
  const [radius, setRadius] = useState(10); // miles
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [radius]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // Fetch nearby groups
      const groupsResponse = await api.get('/groups');
      setNearbyGroups(groupsResponse.data.slice(0, 6)); // Top 6 groups

      // You can add real stats fetching here
      // For now, using placeholder data
      setStats({
        posts: 0,
        groups: groupsResponse.data.length,
        friends: 0,
        messages: 0,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const radiusOptions = [5, 10, 25, 50];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Hero */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden mb-8 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <div className="text-5xl mb-4">👋</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-purple-100 text-lg mb-6 max-w-2xl">
              Your community is here for you. Connect, share, and support each other.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => navigate('/posts')}
                className="bg-white text-purple-600 px-6 py-3 rounded-xl hover:scale-105 transition-all font-semibold shadow-lg"
              >
                📢 Browse Posts
              </button>
              <button
                onClick={() => navigate('/groups')}
                className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all font-semibold border-2 border-white/30"
              >
                👥 Explore Groups
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-purple-300 transition-all">
            <div className="text-3xl mb-2">📢</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {stats.posts}
            </div>
            <div className="text-sm text-gray-600 font-medium">Your Posts</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-purple-300 transition-all">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              {stats.groups}
            </div>
            <div className="text-sm text-gray-600 font-medium">Your Communitiy</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-purple-300 transition-all">
            <div className="text-3xl mb-2">🤝</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              {stats.friends}
            </div>
            <div className="text-sm text-gray-600 font-medium">Friends</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-purple-300 transition-all">
            <div className="text-3xl mb-2">💬</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
              {stats.messages}
            </div>
            <div className="text-sm text-gray-600 font-medium">Messages</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Local Groups Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      Local Groups Near You
                    </h2>
                    <p className="text-gray-600 text-sm">
                      📍 {user?.location || 'Your area'}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/groups')}
                    className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                  >
                    View All →
                  </button>
                </div>

                {/* Radius Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">Radius:</span>
                  {radiusOptions.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRadius(r)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        radius === r
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {r} mi
                    </button>
                  ))}
                </div>
              </div>
              {/* Map Visualization */}
              <DashboardMap groups={nearbyGroups} radius={radius} />

              {/* Groups List */}
              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Nearby Groups</h3>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : nearbyGroups.length > 0 ? (
                  <div className="space-y-3">
                    {nearbyGroups.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => navigate(`/groups/${group.id}`)}
                        className="w-full text-left p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{group.name}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span>👥 {group.memberCount || 0} members</span>
                              {group.category && <span>• {group.category}</span>}
                            </div>
                          </div>
                          <span className="text-purple-600 ml-4">→</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No groups found nearby. Be the first to create one!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/posts')}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition flex items-center gap-3 border border-purple-100"
                >
                  <span className="text-2xl">📢</span>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Create Post</div>
                    <div className="text-xs text-gray-600">Share a request or offer</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/groups')}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition flex items-center gap-3 border border-blue-100"
                >
                  <span className="text-2xl">👥</span>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Join Group</div>
                    <div className="text-xs text-gray-600">Find your community</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/search')}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition flex items-center gap-3 border border-green-100"
                >
                  <span className="text-2xl">🔍</span>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Find Neighbors</div>
                    <div className="text-xs text-gray-600">Connect with people nearby</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">📢</span>
                  </div>
                  <p className="text-xs">Welcome to The Village! Start by exploring groups in your area.</p>
                </div>
              </div>
            </div>

            {/* Community Tips */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-6 border border-purple-200">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="font-bold text-gray-900 mb-2">Community Tip</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                The best way to build trust in your community is to start small. Offer to help a neighbor with something simple!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
