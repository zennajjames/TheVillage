// Form for submitting a new help request to a community. Automatically sets the default
// visibility based on the selected category (e.g. sensitive categories default to SEMI_ANONYMOUS).
import React, { useState, useEffect } from 'react';
import { RequestVisibility, Community } from '../../types';
import { communitiesService } from '../../services/communities.service';

interface CreateHelpRequestFormProps {
  onSubmit: (data: {
    communityId: string;
    title: string;
    description: string;
    category: string;
    visibility: RequestVisibility;
  }) => Promise<void>;
  onCancel: () => void;
  preselectedCommunityId?: string;
}

const CATEGORIES = [
  { value: 'groceries', label: 'Groceries & Meals', defaultVisibility: RequestVisibility.SEMI_ANONYMOUS },
  { value: 'transportation', label: 'Transportation & Rides', defaultVisibility: RequestVisibility.PUBLIC },
  { value: 'childcare', label: 'Childcare', defaultVisibility: RequestVisibility.SEMI_ANONYMOUS },
  { value: 'financial', label: 'Financial Assistance', defaultVisibility: RequestVisibility.ADMIN_ONLY },
  { value: 'housing', label: 'Housing & Moving', defaultVisibility: RequestVisibility.SEMI_ANONYMOUS },
  { value: 'supplies', label: 'Supplies & Materials', defaultVisibility: RequestVisibility.PUBLIC },
  { value: 'emotional', label: 'Emotional Support', defaultVisibility: RequestVisibility.ADMIN_ONLY },
  { value: 'other', label: 'Other', defaultVisibility: RequestVisibility.PUBLIC },
];

const VISIBILITY_OPTIONS = [
  {
    value: RequestVisibility.PUBLIC,
    label: 'Public',
    icon: '🟢',
    description: 'Your name is visible. Anyone in the community can see your request.',
  },
  {
    value: RequestVisibility.SEMI_ANONYMOUS,
    label: 'Semi-Anonymous',
    icon: '🟡',
    description: 'Posted as "A community member." Admins can see your identity.',
  },
  {
    value: RequestVisibility.ADMIN_ONLY,
    label: 'Admin Only',
    icon: '🔴',
    description: 'Only community admins see your request. They can share it anonymously.',
  },
];

const CreateHelpRequestForm: React.FC<CreateHelpRequestFormProps> = ({
  onSubmit,
  onCancel,
  preselectedCommunityId,
}) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [formData, setFormData] = useState({
    communityId: preselectedCommunityId || '',
    title: '',
    description: '',
    category: '',
    visibility: RequestVisibility.PUBLIC,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!preselectedCommunityId) {
      communitiesService.getUserCommunities().then(setCommunities).catch(() => {});
    }
  }, [preselectedCommunityId]);

  const handleCategoryChange = (category: string) => {
    const cat = CATEGORIES.find(c => c.value === category);
    setFormData({
      ...formData,
      category,
      visibility: cat?.defaultVisibility || RequestVisibility.PUBLIC,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Community selector */}
      {!preselectedCommunityId && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Community</label>
          <select
            value={formData.communityId}
            onChange={e => setFormData({ ...formData, communityId: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          >
            <option value="">Select a community...</option>
            {communities.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
        <select
          value={formData.category}
          onChange={e => handleCategoryChange(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
          required
        >
          <option value="">Select a category...</option>
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">What do you need?</label>
        <input
          type="text"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Need help with groceries this week"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Details</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          placeholder="Share any details that would help someone assist you..."
          rows={3}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
          required
        />
      </div>

      {/* Visibility */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Who can see this?</label>
        <div className="space-y-2">
          {VISIBILITY_OPTIONS.map(opt => (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                formData.visibility === opt.value
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="visibility"
                value={opt.value}
                checked={formData.visibility === opt.value}
                onChange={() => setFormData({ ...formData, visibility: opt.value })}
                className="mt-1 accent-red-600"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span>{opt.icon}</span>
                  <span className="font-semibold text-gray-900">{opt.label}</span>
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{opt.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Others will see</p>
        {formData.visibility === RequestVisibility.PUBLIC && (
          <p className="text-sm text-gray-700">Your name and request visible to all community members</p>
        )}
        {formData.visibility === RequestVisibility.SEMI_ANONYMOUS && (
          <p className="text-sm text-gray-700">Posted as <span className="font-semibold">"A community member"</span> — only admins know it's you</p>
        )}
        {formData.visibility === RequestVisibility.ADMIN_ONLY && (
          <p className="text-sm text-gray-700">Only admins will see this. They can share an anonymous version with the community.</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-brand-red text-white py-2.5 px-4 rounded-md hover:bg-brand-red-dark transition font-semibold disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Request Help'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-xl hover:bg-gray-200 transition font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateHelpRequestForm;
