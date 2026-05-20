// Admin-only inbox for a community showing all help requests regardless of visibility level.
// Community admins can review ADMIN_ONLY and SEMI_ANONYMOUS requests here.
import React, { useState, useEffect } from 'react';
import { HelpRequest } from '../../types';
import { helpRequestsService } from '../../services/helpRequests.service';
import HelpRequestCard from '../posts/HelpRequestCard';

interface AdminInboxProps {
  communityId: string;
  communityName: string;
}

const AdminInbox: React.FC<AdminInboxProps> = ({ communityId, communityName }) => {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const data = await helpRequestsService.getAdminInbox(communityId);
      setRequests(data);
    } catch (err: any) {
      setError('Failed to load admin inbox');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [communityId]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await helpRequestsService.updateStatus(id, status);
      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  const handleProxy = async (id: string) => {
    if (!window.confirm('Share this request anonymously with the community? The member\'s identity will be hidden.')) return;
    try {
      await helpRequestsService.createProxy(id);
      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to share anonymously');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🔐</span>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Admin Inbox</h3>
          <p className="text-sm text-gray-500">Private requests from {communityName} members who need help</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-600 font-medium">No private requests right now</p>
          <p className="text-gray-400 text-sm mt-1">When members submit admin-only requests, they'll appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(req => (
            <HelpRequestCard
              key={req.id}
              helpRequest={req}
              isAdmin={true}
              onStatusChange={handleStatusChange}
              onProxy={handleProxy}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminInbox;
