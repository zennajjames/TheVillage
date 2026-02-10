import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import NotificationBell from './NotificationBell';
import LanguageSelector from './LanguageSelector';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Fetch unread message count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await api.get('/messages/unread-count');
        setUnreadMessages(response.data.count || 0);
      } catch (error) {
        console.error('Failed to fetch unread messages:', error);
      }
    };

    if (user) {
      fetchUnreadCount();
      // Refresh every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-neutral-200/50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <img
                src="/VillageLogoGreyCircle.png"
                alt="The Village Logo"
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-brand-navy hidden sm:block">
                The Village
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-1">
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-3 lg:px-4 py-2 rounded-xl text-sm lg:text-base font-medium transition ${
                  isActive('/dashboard')
                    ? 'bg-brand-teal/10 text-brand-teal'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {t('nav.home')}
              </button>
              <button
                onClick={() => navigate('/about')}
                className={`px-3 lg:px-4 py-2 rounded-xl text-sm lg:text-base font-medium transition ${
                  isActive('/about')
                    ? 'bg-brand-teal/10 text-brand-teal'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {t('nav.about')}
              </button>
              <button
                onClick={() => navigate('/posts')}
                className={`px-3 lg:px-4 py-2 rounded-xl text-sm lg:text-base font-medium transition ${
                  isActive('/posts')
                    ? 'bg-brand-teal/10 text-brand-teal'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => navigate('/communities')}
                className={`px-3 lg:px-4 py-2 rounded-xl text-sm lg:text-base font-medium transition ${
                  isActive('/communities')
                    ? 'bg-brand-teal/10 text-brand-teal'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {t('nav.communities')}
              </button>
              <button
                onClick={() => navigate('/search')}
                className={`px-3 lg:px-4 py-2 rounded-xl text-sm lg:text-base font-medium transition flex items-center gap-2 ${
                  isActive('/search')
                    ? 'bg-brand-teal/10 text-brand-teal'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Search
              </button>
              {user?.isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  className={`px-3 lg:px-4 py-2 rounded-xl text-sm lg:text-base font-medium transition ${
                    isActive('/admin')
                      ? 'bg-brand-teal/10 text-brand-teal'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  Admin
                </button>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Messages Icon */}
            <button
              onClick={() => navigate('/messages')}
              className="relative p-2 rounded-xl hover:bg-brand-teal/10 transition group"
              title="Messages"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={`w-5 h-5 lg:w-6 lg:h-6 ${isActive('/messages') ? 'text-brand-teal' : 'text-neutral-700 group-hover:text-brand-teal'}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-brand-coral to-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <NotificationBell />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 hover:opacity-80 transition"
              >
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-brand-teal/30"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-brand-teal/20 to-brand-coral/20 flex items-center justify-center text-xs sm:text-sm font-bold text-brand-navy">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                )}
                <span className="text-sm lg:text-base text-neutral-700 font-medium hidden lg:block">
                  {user?.firstName}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 text-neutral-500 hidden lg:block"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-lg border-2 border-neutral-200 py-2 z-20">
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-sm font-semibold text-neutral-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-neutral-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-brand-teal/10 transition flex items-center gap-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate('/notifications');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-brand-teal/10 transition flex items-center gap-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                      </svg>
                      Notifications
                    </button>
                    <div className="border-t border-neutral-100 my-2"></div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
