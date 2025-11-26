import React from 'react';
import { Group } from '../../types';
import { useNavigate } from 'react-router-dom';

interface GroupCardProps {
  group: Group;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition"
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

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span>👥 {group._count?.members || 0} members</span>
          <span>💬 {group._count?.posts || 0} posts</span>
        </div>
        {group.location && (
          <span className="text-xs">📍 {group.location}</span>
        )}
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t">
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
  );
};

export default GroupCard;