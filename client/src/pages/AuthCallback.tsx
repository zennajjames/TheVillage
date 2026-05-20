// OAuth callback landing page. Receives the JWT token from the Google OAuth redirect,
// stores it, and forwards the user to onboarding or the dashboard.
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      navigate('/login?error=' + error);
      return;
    }

    if (token) {
      // Store token and verify with API to set user in AuthContext
      loginWithToken(token)
        .then(() => {
          navigate('/dashboard');
        })
        .catch(() => {
          navigate('/login?error=oauth_failed');
        });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, loginWithToken]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-red mx-auto mb-4"></div>
        <p className="text-gray-600">Completing login...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
