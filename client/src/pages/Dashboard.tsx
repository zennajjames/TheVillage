import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import { communitiesService } from '../services/communities.service';
import { postsService } from '../services/posts.service';
import { eventsService } from '../services/events.service';
import { helpRequestsService } from '../services/helpRequests.service';
import { Community, Post, HelpRequest, Event as EventType } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [recentRequests, setRecentRequests] = useState<HelpRequest[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCommunities, setHasCommunities] = useState<boolean | null>(null);
  const [userCommunities, setUserCommunities] = useState<Community[]>([]);

  useEffect(() => {
    checkUserCommunities();
  }, []);

  useEffect(() => {
    if (hasCommunities !== null && hasCommunities) {
      fetchDashboardData();
    }
  }, [hasCommunities]);

  const checkUserCommunities = async () => {
    try {
      const communities = await communitiesService.getUserCommunities();
      setHasCommunities(communities.length > 0);
      setUserCommunities(communities);

      if (communities.length === 0) {
        // Check if user has pending join requests before redirecting
        // If they do, they should see the dashboard with a waiting message
        try {
          const allCommunities = await communitiesService.getAllCommunities();
          const hasPendingRequests = allCommunities.some(c => c.joinRequestStatus === 'PENDING');
          if (!hasPendingRequests) {
            navigate('/find-your-community');
          }
        } catch {
          navigate('/find-your-community');
        }
      }
    } catch (error) {
      console.error('Failed to check user communities:', error);
      setHasCommunities(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch community-scoped posts, events, and help requests
      const allPosts: Post[] = [];
      const allEvents: EventType[] = [];
      const allRequests: HelpRequest[] = [];

      for (const community of userCommunities.slice(0, 5)) {
        try {
          const [posts, events, requests] = await Promise.all([
            postsService.getPosts(undefined, undefined, community.id),
            eventsService.getEvents({ communityId: community.id }),
            helpRequestsService.getCommunityRequests(community.id),
          ]);
          allPosts.push(...posts);
          allEvents.push(...events);
          allRequests.push(...requests);
        } catch {
          // skip if community fetch fails
        }
      }

      // Recent posts — sort by newest and take 5
      allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRecentPosts(allPosts.slice(0, 5));

      // Upcoming events — those starting from now, take 5
      const now = new Date();
      const upcoming = allEvents
        .filter((e) => new Date(e.startDate) >= now)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, 5);
      setUpcomingEvents(upcoming);

      // Help requests — sort by newest and take 5
      allRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRecentRequests(allRequests.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const timeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-community">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Hero */}
        <div className="bg-neutral-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden mb-8 shadow-soft-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-white/90 text-lg mb-6 max-w-2xl">
              Your community is here for you. Connect, share, and support each other.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => navigate('/posts')}
                className="bg-white text-brand-red px-6 py-3 rounded-xl hover:scale-105 transition-all font-semibold shadow-lg flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
                </svg>
                Browse Posts
              </button>
              <button
                onClick={() => navigate('/events')}
                className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all font-semibold border-2 border-white/30 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                View Events
              </button>
              <button
                onClick={() => navigate('/communities')}
                className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all font-semibold border-2 border-white/30 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                Explore Communities
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Posts */}
          <div className="bg-white rounded-3xl border-2 border-neutral-200 shadow-soft overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-brand-red">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
                </svg>
                Recent Posts
              </h2>
              <button
                onClick={() => navigate('/posts')}
                className="text-brand-red hover:text-brand-red-dark font-semibold text-sm transition-colors"
              >
                View All →
              </button>
            </div>
            <div className="p-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-3 border-brand-red border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : recentPosts.length > 0 ? (
                <div className="space-y-2">
                  {recentPosts.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => navigate(`/posts/${post.id}`)}
                      className="w-full text-left p-3 rounded-xl hover:bg-neutral-50 transition group"
                    >
                      <div className="flex items-start gap-3">
                        <span className={`mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          post.type === 'REQUEST'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {post.type === 'REQUEST' ? 'Ask' : 'Offer'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-neutral-900 text-sm truncate group-hover:text-brand-red transition">
                            {post.title}
                          </h4>
                          <p className="text-xs text-neutral-500 mt-0.5 truncate">{post.description}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-neutral-400">
                            <span>{post.community.name}</span>
                            <span>·</span>
                            <span>{post.user.firstName} {post.user.lastName}</span>
                            <span>·</span>
                            <span>{timeAgo(post.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500 text-sm">
                  No posts yet. Be the first to share!
                </div>
              )}
            </div>
          </div>

          {/* Help Requests */}
          <div className="bg-white rounded-3xl border-2 border-neutral-200 shadow-soft overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-orange-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                Help Requests
              </h2>
              <button
                onClick={() => navigate('/help-requests')}
                className="text-brand-red hover:text-brand-red-dark font-semibold text-sm transition-colors"
              >
                View All →
              </button>
            </div>
            <div className="p-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-3 border-brand-red border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : recentRequests.length > 0 ? (
                <div className="space-y-2">
                  {recentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="p-3 rounded-xl hover:bg-neutral-50 transition"
                    >
                      <div className="flex items-start gap-3">
                        <span className={`mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          request.status === 'OPEN'
                            ? 'bg-orange-100 text-orange-700'
                            : request.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {request.status === 'OPEN' ? 'Open' : request.status === 'IN_PROGRESS' ? 'In Progress' : 'Done'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-neutral-900 text-sm truncate">
                            {request.title}
                          </h4>
                          <p className="text-xs text-neutral-500 mt-0.5 truncate">{request.description}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-neutral-400">
                            <span>{request.community.name}</span>
                            <span>·</span>
                            <span>{request.category}</span>
                            <span>·</span>
                            <span>{timeAgo(request.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500 text-sm">
                  No help requests in your communities yet.
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-3xl border-2 border-neutral-200 shadow-soft overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-purple-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                Upcoming Events
              </h2>
              <button
                onClick={() => navigate('/events')}
                className="text-brand-red hover:text-brand-red-dark font-semibold text-sm transition-colors"
              >
                View All →
              </button>
            </div>
            <div className="p-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-3 border-brand-red border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : upcomingEvents.length > 0 ? (
                <div className="space-y-2">
                  {upcomingEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => navigate('/events')}
                      className="w-full text-left p-3 rounded-xl hover:bg-neutral-50 transition group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-brand-red/10 rounded-lg p-2 flex-shrink-0 text-center min-w-[44px]">
                          <div className="text-xs font-bold text-brand-red uppercase">
                            {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                          <div className="text-lg font-bold text-neutral-900 leading-tight">
                            {new Date(event.startDate).getDate()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-neutral-900 text-sm truncate group-hover:text-brand-red transition">
                            {event.title}
                          </h4>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {new Date(event.startDate).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </p>
                          {event.location && (
                            <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1 truncate">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 flex-shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                              </svg>
                              {event.location}
                            </p>
                          )}
                          {event.community && (
                            <span className="inline-block mt-1 text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                              {event.community.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500 text-sm">
                  <p>No upcoming events yet.</p>
                  <button
                    onClick={() => navigate('/events')}
                    className="text-brand-red font-medium mt-2 hover:underline text-xs"
                  >
                    Submit an event →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions + Tip */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border-2 border-neutral-200 p-6 shadow-soft">
              <h3 className="font-bold text-neutral-900 mb-4">Quick Actions</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  onClick={() => navigate('/posts')}
                  className="text-left px-4 py-3 bg-brand-red/10 rounded-xl hover:bg-brand-red/20 transition flex items-center gap-3 border-2 border-brand-red/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-brand-red flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
                  </svg>
                  <div>
                    <div className="font-semibold text-neutral-900 text-sm">Create Post</div>
                    <div className="text-xs text-neutral-600">Share a request or offer</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (userCommunities.length > 0) {
                      navigate(`/communities/${userCommunities[0].id}?tab=help`);
                    }
                  }}
                  className="text-left px-4 py-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition flex items-center gap-3 border-2 border-orange-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-orange-500 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-neutral-900 text-sm">Request Help</div>
                    <div className="text-xs text-neutral-600">Ask your community for help</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/events')}
                  className="text-left px-4 py-3 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition flex items-center gap-3 border-2 border-neutral-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-neutral-700 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <div>
                    <div className="font-semibold text-neutral-900 text-sm">Submit Event</div>
                    <div className="text-xs text-neutral-600">Share a local community event</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/search')}
                  className="text-left px-4 py-3 bg-brand-red/10 rounded-xl hover:bg-brand-red/20 transition flex items-center gap-3 border-2 border-brand-red/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-brand-red flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-neutral-900 text-sm">Find Neighbors</div>
                    <div className="text-xs text-neutral-600">Connect with people nearby</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Community Tips */}
          <div className="bg-brand-red/10 rounded-3xl p-6 border-2 border-brand-red/30">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-neutral-800 mb-3">
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
  );
};

export default Dashboard;
