import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  notifyOnMessages: boolean;
  notifyOnPosts: boolean;
  notifyOnGroups: boolean;
  notifyViaSMS: boolean;
  phoneNumber?: string;
  phoneVerified: boolean;
}

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    notifyOnMessages: true,
    notifyOnPosts: true,
    notifyOnGroups: true,
    notifyViaSMS: false,
    phoneNumber: '',
    phoneVerified: false
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/auth/me');
      const user = response.data;
      setSettings({
        emailNotifications: user.emailNotifications,
        smsNotifications: user.smsNotifications || false,
        notifyOnMessages: user.notifyOnMessages,
        notifyOnPosts: user.notifyOnPosts,
        notifyOnGroups: user.notifyOnGroups,
        notifyViaSMS: user.notifyViaSMS || false,
        phoneNumber: user.phoneNumber,
        phoneVerified: user.phoneVerified || false
      });
      setPhoneNumber(user.phoneNumber || '');
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleToggle = async (key: keyof NotificationSettings) => {
    const newValue = !settings[key];
    
    // If trying to enable SMS notifications without verified phone
    if ((key === 'smsNotifications' || key === 'notifyViaSMS') && newValue && !settings.phoneVerified) {
      setMessage('Please add and verify your phone number first');
      return;
    }

    try {
      setIsSaving(true);
      await api.patch('/auth/notifications', { [key]: newValue });
      setSettings(prev => ({ ...prev, [key]: newValue }));
      setMessage('Settings updated');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update settings:', error);
      setMessage('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPhone = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setMessage('Please enter a valid phone number');
      return;
    }

    try {
      setIsSaving(true);
      // Send verification code
      await api.post('/auth/send-phone-verification', { phoneNumber });
      setShowVerification(true);
      setMessage('Verification code sent to your phone');
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to send verification code');
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setMessage('Please enter the 6-digit code');
      return;
    }

    try {
      setIsSaving(true);
      await api.post('/auth/verify-phone', { phoneNumber, code: verificationCode });
      setSettings(prev => ({ ...prev, phoneNumber, phoneVerified: true }));
      setShowVerification(false);
      setVerificationCode('');
      setMessage('Phone number verified successfully!');
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Invalid verification code');
    } finally {
      setIsSaving(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h2>

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.includes('Failed') || message.includes('Invalid')
            ? 'bg-red-50 text-red-700'
            : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* Phone Number Section */}
      <div className="mb-8 pb-8 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Phone Number</h3>
        
        {!settings.phoneVerified ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (for SMS notifications)
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                  placeholder="(555) 123-4567"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={showVerification}
                  maxLength={14}
                />
                {!showVerification && (
                  <button
                    onClick={handleAddPhone}
                    disabled={isSaving}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    {isSaving ? 'Sending...' : 'Verify'}
                  </button>
                )}
              </div>
            </div>

            {showVerification && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter 6-digit code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    maxLength={6}
                  />
                  <button
                    onClick={handleVerifyPhone}
                    disabled={isSaving}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    {isSaving ? 'Verifying...' : 'Confirm'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <p className="font-medium text-gray-900">{settings.phoneNumber}</p>
                <p className="text-sm text-gray-600">Verified</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSettings(prev => ({ ...prev, phoneVerified: false, phoneNumber: '' }));
                setPhoneNumber('');
              }}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Notification Channels */}
      <div className="mb-8 pb-8 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
                className="sr-only peer"
                disabled={isSaving}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-600">
                Receive notifications via text message
                {!settings.phoneVerified && <span className="text-red-600"> (requires verified phone)</span>}
              </p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={() => handleToggle('smsNotifications')}
                className="sr-only peer"
                disabled={isSaving || !settings.phoneVerified}
              />
              <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 ${!settings.phoneVerified ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
            </div>
          </label>
        </div>
      </div>

      {/* Notification Types */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notify Me About</h3>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">💬 New Messages</p>
              <p className="text-sm text-gray-600">When someone sends you a direct message</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.notifyOnMessages}
                onChange={() => handleToggle('notifyOnMessages')}
                className="sr-only peer"
                disabled={isSaving}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">📢 New Posts</p>
              <p className="text-sm text-gray-600">When there's a new post in your area</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.notifyOnPosts}
                onChange={() => handleToggle('notifyOnPosts')}
                className="sr-only peer"
                disabled={isSaving}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">👥 Group Activity</p>
              <p className="text-sm text-gray-600">When there's activity in your groups</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.notifyOnGroups}
                onChange={() => handleToggle('notifyOnGroups')}
                className="sr-only peer"
                disabled={isSaving}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
