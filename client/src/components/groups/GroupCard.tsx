import React, { useState } from 'react';
import { Group } from '../../types';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

interface GroupCardProps {
  group: Group;
  onMembershipChange?: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onMembershipChange }) => {
  const navigate = useNavigate();
  const [isMember, setIsMember] = useState(group.isMember);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinLeave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      if (isMember) {
        await api.post(`/groups/${group.id}/leave`);
        setIsMember(false);
      } else {
        await api.post(`/groups/${group.id}/join`);
        setIsMember(true);
      }

      if (onMembershipChange) {
        onMembershipChange();
      }
    } catch (error: any) {
      console.error('Failed to join/leave group:', error);
      alert(error.response?.data?.error || 'Failed to update membership');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div
        className="cursor-pointer"
        onClick={() => navigate(`/groups/${group.id}`)}
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

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span>👥 {group._count?.members || 0} members</span>
          <span>💬 {group._count?.posts || 0} posts</span>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t">
          {group.createdBy.profilePicture ? (
            <img
              src={group.createdBy.profilePicture}
              alt={group.createdBy.firstName}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-xs font-bold text-purple-600">
              {group.createdBy.firstName[0]}{group.createdBy.lastName[0]}
            </div>
          )}
          <span className="text-xs text-gray-600">
            Created by {group.createdBy.firstName} {group.createdBy.lastName}
          </span>
        </div>
      </div>

      {/* Join/Leave Button */}
      <div className="mt-3 pt-3 border-t">
        <button
          onClick={handleJoinLeave}
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-lg font-medium transition ${
            isMember
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? 'Loading...' : isMember ? 'Leave Group' : 'Join Group'}
        </button>
      </div>
    </div>
  );
};

export default GroupCard;
