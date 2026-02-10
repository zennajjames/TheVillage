import React from 'react';
import { HelpRequest, RequestVisibility, PostStatus } from '../../types';

interface HelpRequestCardProps {
  helpRequest: HelpRequest;
  isAdmin?: boolean;
  onStatusChange?: (id: string, status: string) => void;
  onProxy?: (id: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  groceries: 'Groceries & Meals',
  transportation: 'Transportation & Rides',
  childcare: 'Childcare',
  financial: 'Financial Assistance',
  housing: 'Housing & Moving',
  supplies: 'Supplies & Materials',
  emotional: 'Emotional Support',
  other: 'Other',
};

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-green-100 text-green-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  FULFILLED: 'bg-blue-100 text-blue-700',
  CLOSED: 'bg-gray-100 text-gray-600',
};

const HelpRequestCard: React.FC<HelpRequestCardProps> = ({
  helpRequest,
  isAdmin = false,
  onStatusChange,
  onProxy,
}) => {
  const isAnonymous = !helpRequest.user;
  const visibilityBadge = {
    [RequestVisibility.PUBLIC]: { icon: '🟢', label: 'Public' },
    [RequestVisibility.SEMI_ANONYMOUS]: { icon: '🟡', label: 'Anonymous' },
    [RequestVisibility.ADMIN_ONLY]: { icon: '🔴', label: 'Admin Only' },
  }[helpRequest.visibility];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-red-300 hover:shadow-md transition-all">
      {/* Top row: category + status + visibility */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-red-100 text-red-700">
            {CATEGORY_LABELS[helpRequest.category] || helpRequest.category}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${STATUS_COLORS[helpRequest.status] || ''}`}>
            {helpRequest.status.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span>{visibilityBadge.icon}</span>
          <span>{visibilityBadge.label}</span>
        </div>
      </div>

      {/* Title + description */}
      <h3 className="text-lg font-bold text-gray-900 mb-1">{helpRequest.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{helpRequest.description}</p>

      {/* Author row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isAnonymous ? (
            <>
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                ?
              </div>
              <span className="text-sm text-gray-500 italic">A community member</span>
            </>
          ) : (
            <>
              {helpRequest.user?.profilePicture ? (
                <img
                  src={helpRequest.user.profilePicture}
                  alt={helpRequest.user.firstName}
                  className="w-7 h-7 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-red-200 flex items-center justify-center text-xs font-bold text-red-600">
                  {helpRequest.user?.firstName[0]}{helpRequest.user?.lastName[0]}
                </div>
              )}
              <span className="text-sm text-gray-700">
                {helpRequest.user?.firstName} {helpRequest.user?.lastName}
              </span>
              {helpRequest.isAnonymousToPublic && isAdmin && (
                <span className="text-xs bg-yellow-50 text-yellow-600 px-1.5 py-0.5 rounded font-medium">
                  (visible to admins only)
                </span>
              )}
            </>
          )}
        </div>
        <span className="text-xs text-gray-400">
          {new Date(helpRequest.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Admin actions */}
      {isAdmin && helpRequest.status === PostStatus.OPEN && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
          {onStatusChange && (
            <>
              <button
                onClick={() => onStatusChange(helpRequest.id, 'IN_PROGRESS')}
                className="text-xs px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 font-medium transition"
              >
                Mark In Progress
              </button>
              <button
                onClick={() => onStatusChange(helpRequest.id, 'FULFILLED')}
                className="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-medium transition"
              >
                Mark Fulfilled
              </button>
            </>
          )}
          {onProxy && helpRequest.visibility === RequestVisibility.ADMIN_ONLY && !helpRequest.proxyPostId && (
            <button
              onClick={() => onProxy(helpRequest.id)}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-medium transition"
            >
              Share Anonymously
            </button>
          )}
          {helpRequest.proxyPostId && (
            <span className="text-xs text-gray-400 italic">Shared anonymously</span>
          )}
        </div>
      )}
    </div>
  );
};

export default HelpRequestCard;
