import React, { useState } from 'react';
import { SubGroup } from '../../types';
import { subgroupsService } from '../../services/subgroups.service';

interface SubGroupCardProps {
  subGroup: SubGroup;
  onMembershipChange?: () => void;
}

const SubGroupCard: React.FC<SubGroupCardProps> = ({ subGroup, onMembershipChange }) => {
  const [isMember, setIsMember] = useState(subGroup.isMember);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinLeave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      if (isMember) {
        await subgroupsService.leaveSubGroup(subGroup.id);
        setIsMember(false);
      } else {
        await subgroupsService.joinSubGroup(subGroup.id);
        setIsMember(true);
      }

      if (onMembershipChange) {
        onMembershipChange();
      }
    } catch (error: any) {
      console.error('Failed to join/leave subgroup:', error);
      alert(error.response?.data?.error || 'Failed to update membership');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="text-md font-bold text-gray-900 mb-1">{subGroup.name}</h4>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {subGroup.grade && (
              <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-lg font-medium">
                Grade {subGroup.grade}
              </span>
            )}
            {subGroup.teacherName && (
              <span className="text-gray-700">
                👨‍🏫 {subGroup.teacherName}
              </span>
            )}
          </div>
        </div>
        <div className="text-sm text-gray-600">
          👥 {subGroup._count?.members || 0}
        </div>
      </div>

      {subGroup.description && (
        <p className="text-gray-600 text-sm mb-3">{subGroup.description}</p>
      )}

      <button
        onClick={handleJoinLeave}
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-lg font-medium transition text-sm ${
          isMember
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? 'Loading...' : isMember ? 'Leave Class' : 'Join Class'}
      </button>
    </div>
  );
};

export default SubGroupCard;
