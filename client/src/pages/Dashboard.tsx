import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">The Village</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.firstName}!</span>
            <button
              onClick={handleLogout}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <p className="text-gray-600">
            You're logged in! This is where we'll build the main features.
          </p>
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-2">Your Profile</h3>
            <p className="text-gray-700">Name: {user?.firstName} {user?.lastName}</p>
            <p className="text-gray-700">Email: {user?.email}</p>
            <p className="text-gray-700">Location: {user?.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;