import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService, UpdateProfileData } from '../services/user.service';
import { api } from '../services/api';
import Header from '../components/layout/Header';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    location: user?.location || '',
    zipCode: user?.zipCode || '',
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: user?.emailNotifications ?? true,
    notifyOnMessages: user?.notifyOnMessages ?? true,
    notifyOnPosts: user?.notifyOnPosts ?? true,
    notifyOnGroups: user?.notifyOnGroups ?? true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        location: user.location || '',
        zipCode: user.zipCode || '',
        bio: user.bio || '',
        profilePicture: user.profilePicture || ''
      });
      setPreviewImage(user.profilePicture || null);
      setNotifications({
        emailNotifications: user.emailNotifications ?? true,
        notifyOnMessages: user.notifyOnMessages ?? true,
        notifyOnPosts: user.notifyOnPosts ?? true,
        notifyOnGroups: user.notifyOnGroups ?? true
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications({
      ...notifications,
      [key]: value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = height * (MAX_WIDTH / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = width * (MAX_HEIGHT / height);
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        
        setPreviewImage(compressedBase64);
        setFormData({
          ...formData,
          profilePicture: compressedBase64
        });
        setError('');
      };
      
      img.onerror = () => {
        setError('Failed to load image');
      };
      
      img.src = reader.result as string;
    };
    
    reader.onerror = () => {
      setError('Failed to read file');
    };
    
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setFormData({
      ...formData,
      profilePicture: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await userService.updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await api.patch('/auth/notifications', notifications);
      setSuccess('Notification preferences saved!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        location: user.location || '',
        zipCode: user.zipCode || '',
        bio: user.bio || '',
        profilePicture: user.profilePicture || ''
      });
      setPreviewImage(user.profilePicture || null);
    }
    setIsEditing(false);
    setError('');
  };

  const renderProfileImage = (size: 'small' | 'large' = 'large') => {
    const sizeClasses = size === 'large' ? 'w-32 h-32 text-4xl' : 'w-24 h-24 text-3xl';
    
    if (previewImage || user?.profilePicture) {
      return (
        <img
          src={previewImage || user?.profilePicture}
          alt="Profile"
          className={`${sizeClasses} rounded-full object-cover border-4 border-purple-200`}
        />
      );
    }

    return (
      <div className={`${sizeClasses} rounded-full bg-purple-200 flex items-center justify-center font-bold text-purple-600`}>
        {user?.firstName?.[0]}{user?.lastName?.[0]}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Tabs */}
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === 'notifications'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Notifications
              </button>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                {success}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                      {renderProfileImage('large')}
                      <div className="flex gap-2">
                        <label className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition cursor-pointer font-medium">
                          Upload Photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                        {(previewImage || user?.profilePicture) && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition font-medium"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">Max size: 2MB. JPG, PNG, or GIF</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                      <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location (City, State)
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., Minneapolis, MN"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        pattern="[0-9]{5}"
                        title="Please enter a 5-digit zip code"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell others about yourself..."
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 font-medium"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      {renderProfileImage('small')}
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </h2>
                        <p className="text-gray-600">{user?.email}</p>
                      </div>
                    </div>

                    <div className="border-t pt-6 space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                        <p className="text-gray-900">{user?.location}</p>
                      </div>

                      {user?.zipCode && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Zip Code</h3>
                          <p className="text-gray-900">{user.zipCode}</p>
                        </div>
                      )}

                      {user?.bio && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
                          <p className="text-gray-900 whitespace-pre-wrap">{user.bio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Preferences</h2>
                  <p className="text-gray-600">
                    Choose what notifications you want to receive via email
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-600">
                        Enable or disable all email notifications
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.emailNotifications}
                        onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className={`space-y-4 ${!notifications.emailNotifications ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">💬 New Messages</h3>
                        <p className="text-sm text-gray-600">
                          Get notified when someone sends you a message
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.notifyOnMessages}
                          onChange={(e) => handleNotificationChange('notifyOnMessages', e.target.checked)}
                          disabled={!notifications.emailNotifications}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 disabled:cursor-not-allowed"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">📋 New Posts</h3>
                        <p className="text-sm text-gray-600">
                          Get notified about new posts in your area
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.notifyOnPosts}
                          onChange={(e) => handleNotificationChange('notifyOnPosts', e.target.checked)}
                          disabled={!notifications.emailNotifications}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 disabled:cursor-not-allowed"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">👥 Group Activity</h3>
                        <p className="text-sm text-gray-600">
                          Get notified about new posts in your groups
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.notifyOnGroups}
                          onChange={(e) => handleNotificationChange('notifyOnGroups', e.target.checked)}
                          disabled={!notifications.emailNotifications}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 disabled:cursor-not-allowed"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveNotifications}
                  disabled={isLoading}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 font-medium"
                >
                  {isLoading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;