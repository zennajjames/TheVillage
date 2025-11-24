import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 
              className="text-2xl font-bold text-purple-600 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              The Village
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-700 hover:text-purple-600 font-medium transition"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/posts')}
                className="text-gray-700 hover:text-purple-600 font-medium transition"
              >
                Community Board
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="text-gray-700 hover:text-purple-600 font-medium transition"
              >
                Profile
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-200 cursor-pointer"
                  onClick={() => navigate('/profile')}
                />
              ) : (
                <div 
                  className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-sm font-bold text-purple-600 cursor-pointer"
                  onClick={() => navigate('/profile')}
                >
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              )}
              <span className="text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;