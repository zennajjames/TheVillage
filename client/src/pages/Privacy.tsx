import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Header from '../components/layout/Header';

interface PrivacySettings {
  showEmail: boolean;
  showAddress: boolean;
  allowMessages: boolean;
}

const Privacy: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<PrivacySettings>({
    showEmail: true,
    showAddress: false,
    allowMessages: true,
  });
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPrivacySettings();
  }, []);

  const fetchPrivacySettings = async () => {
    try {
      const response = await api.get('/auth/privacy');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch privacy settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.patch('/auth/privacy', settings);
      setMessage('Privacy settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update privacy settings');
      console.error('Failed to update privacy settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSetting = (key: keyof PrivacySettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="text-purple-600 hover:text-purple-700 font-semibold mb-4 flex items-center gap-2"
          >
            ← Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Privacy Settings</h1>
          <p className="text-gray-600 mt-2">
            Control who can see your information and how others can interact with you
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className={`mb-6 rounded-2xl px-6 py-4 ${
            message.includes('success')
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{message.includes('success') ? '✓' : '⚠'}</span>
              <p className={`font-medium ${
                message.includes('success') ? 'text-green-700' : 'text-red-700'
              }`}>
                {message}
              </p>
            </div>
          </div>
        )}

        {/* Privacy Settings Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Visibility & Communication</h2>

          <div className="space-y-6">
            {/* Email Visibility */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📧</span>
                  <h3 className="text-lg font-semibold text-gray-900">Email Visibility</h3>
                </div>
                <p className="text-gray-600 text-sm ml-11">
                  Allow other members to see your email address on your profile
                </p>
              </div>
              <button
                onClick={() => toggleSetting('showEmail')}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  settings.showEmail ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    settings.showEmail ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Address Visibility */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🏠</span>
                  <h3 className="text-lg font-semibold text-gray-900">Address Visibility</h3>
                </div>
                <p className="text-gray-600 text-sm ml-11">
                  Allow other members to see your full address on your profile
                </p>
              </div>
              <button
                onClick={() => toggleSetting('showAddress')}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  settings.showAddress ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    settings.showAddress ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Message Permissions */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">💬</span>
                  <h3 className="text-lg font-semibold text-gray-900">Allow Messages</h3>
                </div>
                <p className="text-gray-600 text-sm ml-11">
                  Allow other members to send you direct messages
                </p>
              </div>
              <button
                onClick={() => toggleSetting('allowMessages')}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  settings.allowMessages ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    settings.allowMessages ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Privacy Settings'}
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">About Your Privacy</h3>
              <p className="text-blue-800 text-sm">
                These settings control what information other community members can see about you.
                Your location (city) and zip code are always visible to help connect you with nearby groups and members.
                You can change these settings at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
