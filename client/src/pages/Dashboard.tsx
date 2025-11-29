import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Welcome to The Village! 👋</h2>
          <p className="text-gray-600 mb-4">
            Connect with people in your community. Request help when you need it, 
            and offer support when you can.
          </p>
          <button
            onClick={() => navigate('/posts')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-medium"
          >
            View Community Board →
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-purple-900 mb-2">📋 Posts</h3>
            <p className="text-gray-600 text-sm mb-4">
              Browse requests and offers from your community
            </p>
            <button
              onClick={() => navigate('/posts')}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              View Posts →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-purple-900 mb-2">👤 Profile</h3>
            <p className="text-gray-600 text-sm mb-4">
              Update your information and preferences
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              Edit Profile →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-purple-900 mb-2">💬 Connect</h3>
            <p className="text-gray-600 text-sm mb-4">
              Message other moms in your area
            </p>
            <button
              onClick={() => navigate('/messages')}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              View Messages →
            </button>          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;