// Cross-community help requests feed. Aggregates all open requests from every community
// the user belongs to, groups them by community, and sorts by activity level.
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import { communitiesService } from '../services/communities.service';
import { helpRequestsService } from '../services/helpRequests.service';
import { Community, HelpRequest } from '../types';

interface CommunityRequests {
  community: Community;
  requests: HelpRequest[];
}

const HelpRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [communityRequests, setCommunityRequests] = useState<CommunityRequests[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const communities = await communitiesService.getUserCommunities();
      const results: CommunityRequests[] = [];

      for (const community of communities) {
        try {
          const requests = await helpRequestsService.getCommunityRequests(community.id);
          results.push({ community, requests });
        } catch {
          // skip if fetch fails for a community
        }
      }

      // Sort communities by number of open requests (most active first)
      results.sort((a, b) => {
        const aOpen = a.requests.filter(r => r.status === 'OPEN').length;
        const bOpen = b.requests.filter(r => r.status === 'OPEN').length;
        return bOpen - aOpen;
      });

      setCommunityRequests(results);
    } catch (error) {
      console.error('Failed to fetch help requests:', error);
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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-orange-100 text-orange-700';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700';
      case 'FULFILLED':
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'OPEN': return 'Open';
      case 'IN_PROGRESS': return 'In Progress';
      case 'FULFILLED':
      case 'COMPLETED': return 'Completed';
      case 'CLOSED': return 'Closed';
      default: return status;
    }
  };

  // Flatten and filter all requests
  const allRequests = communityRequests.flatMap(cr =>
    cr.requests.map(r => ({ ...r, communityName: cr.community.name, communityId: cr.community.id }))
  );

  const filteredRequests = allRequests.filter(r => {
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.communityName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Group filtered requests by community
  const groupedByCommunity = communityRequests
    .map(cr => ({
      community: cr.community,
      requests: filteredRequests.filter(r => r.communityId === cr.community.id),
    }))
    .filter(cr => cr.requests.length > 0);

  const totalOpen = allRequests.filter(r => r.status === 'OPEN').length;
  const totalInProgress = allRequests.filter(r => r.status === 'IN_PROGRESS').length;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-neutral-500 hover:text-neutral-700 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-neutral-900">Help Requests</h1>
          </div>
          <p className="text-neutral-600 ml-8">
            All help requests across your communities
          </p>
        </div>

        {/* Stats Bar */}
        {!isLoading && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-neutral-200 p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{totalOpen}</div>
              <div className="text-xs text-neutral-500 font-medium">Open</div>
            </div>
            <div className="bg-white rounded-2xl border border-neutral-200 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{totalInProgress}</div>
              <div className="text-xs text-neutral-500 font-medium">In Progress</div>
            </div>
            <div className="bg-white rounded-2xl border border-neutral-200 p-4 text-center">
              <div className="text-2xl font-bold text-neutral-900">{allRequests.length}</div>
              <div className="text-xs text-neutral-500 font-medium">Total</div>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search requests..."
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
          <div className="flex gap-2">
            {['ALL', 'OPEN', 'IN_PROGRESS', 'FULFILLED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  filterStatus === status
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white border border-neutral-300 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {status === 'ALL' ? 'All' : getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-[3px] border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-500">Loading help requests...</p>
          </div>
        ) : groupedByCommunity.length > 0 ? (
          <div className="space-y-8">
            {groupedByCommunity.map(({ community, requests }) => (
              <div key={community.id}>
                {/* Community Header */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => navigate(`/communities/${community.id}`)}
                    className="flex items-center gap-2 group"
                  >
                    <h2 className="text-lg font-bold text-neutral-900 group-hover:text-red-600 transition">
                      {community.name}
                    </h2>
                    <span className="text-xs bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded-full font-medium">
                      {requests.length} request{requests.length !== 1 ? 's' : ''}
                    </span>
                  </button>
                </div>

                {/* Requests List */}
                <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                  {requests.map((request, idx) => (
                    <div
                      key={request.id}
                      className={`p-4 hover:bg-neutral-50 transition cursor-pointer ${
                        idx !== requests.length - 1 ? 'border-b border-neutral-100' : ''
                      }`}
                      onClick={() => navigate(`/communities/${request.communityId}`)}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`mt-0.5 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${getStatusStyle(request.status)}`}>
                          {getStatusLabel(request.status)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-neutral-900 text-sm mb-0.5">
                            {request.title}
                          </h4>
                          <p className="text-xs text-neutral-500 line-clamp-2 mb-1.5">
                            {request.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-neutral-400 flex-wrap">
                            <span className="bg-neutral-100 px-2 py-0.5 rounded-full text-neutral-600">
                              {request.category}
                            </span>
                            {request.user && (
                              <>
                                <span>·</span>
                                <span>{request.user.firstName} {request.user.lastName}</span>
                              </>
                            )}
                            <span>·</span>
                            <span>{timeAgo(request.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">
              {searchQuery || filterStatus !== 'ALL'
                ? 'No matching requests'
                : 'No help requests yet'}
            </h3>
            <p className="text-neutral-500 text-sm mb-6">
              {searchQuery || filterStatus !== 'ALL'
                ? 'Try adjusting your search or filter'
                : 'When members of your communities need help, their requests will appear here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpRequestsPage;
