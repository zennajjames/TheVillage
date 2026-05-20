// Email/password signup page. Collects name, email, password, and zip code, then prompts
// the user to accept community guidelines before creating the account.
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CommunityGuidelines from '../components/CommunityGuidelines';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    location: '',
    zipCode: '',
    agreedToGuidelines: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email confirmation
    if (formData.email !== formData.confirmEmail) {
      setError('Email addresses do not match');
      return;
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agreedToGuidelines) {
      setShowGuidelines(true);
      return;
    }

    setIsLoading(true);

    try {
      // Remove confirmation fields before sending to backend
      const { confirmEmail, confirmPassword, ...signupData } = formData;
      await signup(signupData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgreeToGuidelines = async () => {
    setFormData({
      ...formData,
      agreedToGuidelines: true
    });
    setShowGuidelines(false);
    setIsLoading(true);

    try {
      // Remove confirmation fields before sending to backend
      const { confirmEmail, confirmPassword, ...signupData } = {
        ...formData,
        agreedToGuidelines: true
      };
      await signup(signupData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeclineGuidelines = () => {
    setShowGuidelines(false);
    setError('You must agree to the community guidelines to join The Village.');
  };

  const handleGoogleSignup = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/oauth/google`;
  };

  return (
    <>
      {showGuidelines && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full max-h-[80vh] flex flex-col bg-white rounded-2xl shadow-2xl border-2 border-neutral-100 overflow-hidden">
            <div className="px-6 pt-6 pb-3 border-b border-neutral-100">
              <h2 className="text-xl font-bold">
                Community Guidelines
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <CommunityGuidelines
                showActions={false}
                compact={true}
              />
            </div>
            <div className="px-6 py-4 border-t border-neutral-100 flex gap-3">
              <button
                onClick={handleAgreeToGuidelines}
                className="btn-primary flex-1"
              >
                I Agree
              </button>
              <button
                onClick={handleDeclineGuidelines}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-community flex items-center justify-center p-4">
        <div className="card-modern w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/villageLogo.png"
            alt="The Village Logo"
            className="w-20 h-20 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold mb-2">
            Join The Village
          </h1>
          <p className="text-neutral-600">
            A community for parents & caregivers
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input-modern"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input-modern"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-modern"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Confirm Email
            </label>
            <input
              type="email"
              name="confirmEmail"
              value={formData.confirmEmail}
              onChange={handleChange}
              className="input-modern"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-modern"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-modern"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Zip Code
            </label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="e.g., 55417"
              className="input-modern"
              required
              pattern="[0-9]{5}"
              title="Please enter a 5-digit zip code"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-neutral-500 font-medium">Or sign up with</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleSignup}
            type="button"
            className="btn-secondary w-full"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Sign up with Google</span>
          </button>

        </div>

        <p className="mt-8 text-center text-neutral-600">
          Already have an account?{' '}
          <Link to="/login" className="link-modern">
            Log in
          </Link>
        </p>
        </div>
      </div>
    </>
  );
};

export default Signup;