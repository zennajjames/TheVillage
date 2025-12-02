import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Header from '../components/layout/Header';
import AddressAutocomplete from '../components/forms/AddressAutocomplete';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    street: user?.street || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
  });
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Update using your existing API
      await api.patch('/auth/profile', formData);
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
      // Refresh user data
      window.location.reload();
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Card */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden mb-8 shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
          <div className="relative z-10 flex items-center gap-6">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.firstName}
                className="w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-4xl font-bold border-4 border-white/20">
                {user?.firstName[0]}{user?.lastName[0]}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold mb-1">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-purple-100 text-lg">📍 {user?.location}</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <p className="text-green-700 font-medium">{message}</p>
            </div>
          </div>
        )}

        {/* Profile Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">About</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="City, State"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address
                    </label>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={formData.street}
                          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="123 Main St"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">
                            City
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Minneapolis"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">
                            State
                          </label>
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="MN"
                            maxLength={2}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          value={formData.zipCode}
                          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="55401"
                          maxLength={5}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-white text-gray-700 px-6 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 transition font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {user?.bio ? (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">Bio</h3>
                      <p className="text-gray-900">{user.bio}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No bio added yet</p>
                  )}
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Info</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-xl">📧</span>
                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="font-medium">{user?.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-xl">📍</span>
                  <div>
                    <div className="text-xs text-gray-500">Location</div>
                    <div className="font-medium">{user?.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-xl">📮</span>
                  <div>
                    <div className="text-xs text-gray-500">Zip Code</div>
                    <div className="font-medium">{user?.zipCode}</div>
                  </div>
                </div>
                {(user?.street || user?.city || user?.state) && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-xl">🏠</span>
                    <div>
                      <div className="text-xs text-gray-500">Address</div>
                      <div className="font-medium">
                        {user.street && <div>{user.street}</div>}
                        {(user.city || user.state) && (
                          <div>
                            {user.city}{user.city && user.state && ', '}{user.state} {user.zipCode}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-purple-50 transition text-gray-700 font-medium text-sm">
                  🔔 Notifications
                </button>
                <button className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-purple-50 transition text-gray-700 font-medium text-sm">
                  ⚙️ Settings
                </button>
                <button
                  onClick={() => navigate('/privacy')}
                  className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-purple-50 transition text-gray-700 font-medium text-sm"
                >
                  🔒 Privacy
                </button>
              </div>
            </div>

            {/* Member Badge */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-6 border border-purple-200">
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="font-bold text-gray-900 mb-1">Village Member</h3>
              <p className="text-gray-700">
                Thank you for being part of our community!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
