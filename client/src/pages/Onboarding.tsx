// Two-step onboarding flow for new OAuth users: community guidelines acceptance, then zip code entry.
// The step is determined by the ?step= URL param passed from the backend OAuth redirect.
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import CommunityGuidelines from '../components/CommunityGuidelines';

const Onboarding: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState<'guidelines' | 'zipcode'>('guidelines');
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const urlToken = searchParams.get('token');
    const urlStep = searchParams.get('step');

    if (!urlToken) {
      navigate('/login');
      return;
    }

    setToken(urlToken);
    localStorage.setItem('token', urlToken);

    if (urlStep === 'zipcode') {
      setStep('zipcode');
    } else {
      setStep('guidelines');
    }
  }, [searchParams, navigate]);

  const handleAgreeToGuidelines = async () => {
    setIsLoading(true);
    setError('');

    try {
      await api.post('/oauth/complete-onboarding', { agreedToGuidelines: true });

      // Check if we also need zip code
      const urlStep = searchParams.get('step');
      if (urlStep === 'guidelines') {
        // Move to zip code step
        setStep('zipcode');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeclineGuidelines = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleZipCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (zipCode.length !== 5) {
      setError('Please enter a valid 5-digit zip code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/oauth/complete-onboarding', { zipCode });

      // Store the new token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      // Redirect to find your school
      navigate('/find-your-community');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save zip code');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'guidelines') {
    return (
      <div className="min-h-screen bg-gradient-community flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          <CommunityGuidelines
            onAgree={handleAgreeToGuidelines}
            onDecline={handleDeclineGuidelines}
            showActions={true}
          />
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-community flex items-center justify-center p-4">
      <div className="card-modern w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome to The Village!
          </h1>
          <p className="text-neutral-600">
            Let's find your parent community
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleZipCodeSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Enter Your Zip Code
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="55417"
              className="input-modern"
              maxLength={5}
              required
            />
            <p className="text-sm text-neutral-500 mt-2">
              We'll use this to find communities in your area
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || zipCode.length !== 5}
            className="btn-primary w-full"
          >
            {isLoading ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
