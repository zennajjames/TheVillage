import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Header from '../components/layout/Header';
import DashboardMap from '../components/map/DashboardMap';
import { communitiesService } from '../services/communities.service';



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
  const [hasCommunities, setHasCommunities] = useState<boolean | null>(null);

  useEffect(() => {
    checkUserCommunities();
  }, []);

  useEffect(() => {
    if (hasCommunities !== null && hasCommunities) {
      fetchDashboardData();
    }
  }, [radius, hasCommunities]);

  const checkUserCommunities = async () => {
    try {
      const communities = await communitiesService.getUserCommunities();
      setHasCommunities(communities.length > 0);

      // If user has no communities, redirect to find community page
      if (communities.length === 0) {
        navigate('/find-your-community');
      }
    } catch (error) {
      console.error('Failed to check user communities:', error);
      setHasCommunities(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-community">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Hero */}
        <div className="bg-gradient-to-br from-brand-teal via-brand-coral to-brand-blue rounded-3xl p-8 md:p-12 text-white relative overflow-hidden mb-8 shadow-soft-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-white/90 text-lg mb-6 max-w-2xl">
              Your community is here for you. Connect, share, and support each other.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => navigate('/posts')}
                className="bg-white text-brand-teal px-6 py-3 rounded-xl hover:scale-105 transition-all font-semibold shadow-lg flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
                </svg>
                Browse Posts
              </button>
              <button
                onClick={() => navigate('/groups')}
                className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all font-semibold border-2 border-white/30 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                Explore Groups
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border-2 border-neutral-200 hover:border-brand-teal transition-all shadow-soft">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-teal mb-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
            </svg>
            <div className="text-3xl font-bold bg-gradient-to-r from-brand-teal to-brand-coral bg-clip-text text-transparent">
              {stats.posts}
            </div>
            <div className="text-sm text-neutral-600 font-medium">Your Posts</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-neutral-200 hover:border-brand-blue transition-all shadow-soft">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-blue mb-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <div className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-teal bg-clip-text text-transparent">
              {stats.groups}
            </div>
            <div className="text-sm text-neutral-600 font-medium">Your Community</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-neutral-200 hover:border-brand-teal transition-all shadow-soft">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-teal mb-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
            <div className="text-3xl font-bold text-brand-teal">
              {stats.friends}
            </div>
            <div className="text-sm text-neutral-600 font-medium">Friends</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-neutral-200 hover:border-brand-coral transition-all shadow-soft">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-coral mb-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            <div className="text-3xl font-bold text-brand-coral">
              {stats.messages}
            </div>
            <div className="text-sm text-neutral-600 font-medium">Messages</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Local Groups Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border-2 border-neutral-200 shadow-soft overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-neutral-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-1">
                      Local Groups Near You
                    </h2>
                    <p className="text-neutral-600 text-sm flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {user?.location || 'Your area'}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/groups')}
                    className="text-brand-teal hover:text-brand-teal/80 font-semibold text-sm transition-colors"
                  >
                    View All →
                  </button>
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
                          ? 'bg-brand-teal text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
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
                <h3 className="font-bold text-neutral-900 mb-4">Nearby Groups</h3>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-3 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : nearbyGroups.length > 0 ? (
                  <div className="space-y-3">
                    {nearbyGroups.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => navigate(`/groups/${group.id}`)}
                        className="w-full text-left p-4 bg-gradient-to-r from-brand-teal/5 to-brand-coral/5 rounded-2xl border-2 border-brand-teal/20 hover:border-brand-teal hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-neutral-900 mb-1">{group.name}</h4>
                            <p className="text-sm text-neutral-600 line-clamp-2">{group.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                              <span className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                </svg>
                                {group.memberCount || 0} members
                              </span>
                              {group.category && <span>• {group.category}</span>}
                            </div>
                          </div>
                          <span className="text-brand-teal ml-4">→</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-neutral-500">
                    No groups found nearby. Be the first to create one!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-3xl border-2 border-neutral-200 p-6 shadow-soft">
              <h3 className="font-bold text-neutral-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/posts')}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-brand-teal/10 to-brand-coral/10 rounded-xl hover:from-brand-teal/20 hover:to-brand-coral/20 transition flex items-center gap-3 border-2 border-brand-teal/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-brand-teal flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
                  </svg>
                  <div>
                    <div className="font-semibold text-neutral-900 text-sm">Create Post</div>
                    <div className="text-xs text-neutral-600">Share a request or offer</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/groups')}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-brand-blue/10 to-brand-teal/10 rounded-xl hover:from-brand-blue/20 hover:to-brand-teal/20 transition flex items-center gap-3 border-2 border-brand-blue/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-brand-blue flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-neutral-900 text-sm">Join Group</div>
                    <div className="text-xs text-neutral-600">Find your community</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/search')}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-brand-teal/10 to-brand-blue/10 rounded-xl hover:from-brand-teal/20 hover:to-brand-blue/20 transition flex items-center gap-3 border-2 border-brand-teal/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-brand-teal flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-neutral-900 text-sm">Find Neighbors</div>
                    <div className="text-xs text-neutral-600">Connect with people nearby</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl border-2 border-neutral-200 p-6 shadow-soft">
              <h3 className="font-bold text-neutral-900 mb-4">Recent Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-neutral-600">
                  <div className="w-8 h-8 bg-brand-teal/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-brand-teal">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                  </div>
                  <p className="text-xs">Welcome to The Village! Start by exploring groups in your area.</p>
                </div>
              </div>
            </div>

            {/* Community Tips */}
            <div className="bg-gradient-to-br from-brand-teal/20 to-brand-coral/20 rounded-3xl p-6 border-2 border-brand-teal/30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-navy mb-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
              <h3 className="font-bold text-neutral-900 mb-2">Community Tip</h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
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
