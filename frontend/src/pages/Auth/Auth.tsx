import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthForm from './components/AuthForm';
import ActivationForm from './components/ActivationForm';
import { palettes, colors, text } from '@/theme/colors';
import { toast } from '@/components/notification/toast';

// Images are in public/images/ - reference with absolute path from public root
const landingImage = '/images/landing_page_image.webp';
const logo = '/images/logo.webp';

const AuthPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoaded, setIsLoaded] = useState(false);
  const [pendingActivation, setPendingActivation] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // If user is authenticated, redirect to home
  if (user?.email && !pendingActivation) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  const handleRegistrationSuccess = (email: string) => {
    setPendingEmail(email);
    setPendingActivation(true);
  };

  const handleActivationSuccess = () => {
    setPendingActivation(false);
    setPendingEmail(null);
    setActiveTab('login');
    toast.success('Account activated successfully! You can now log in.');
  };

  const handleActivationCancel = () => {
    setPendingActivation(false);
    setPendingEmail(null);
    setActiveTab('register');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-white">
      {/* Left side - Landing image */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden rounded-3xl m-5">
        <div className={`absolute inset-0 transition-opacity duration-1000 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div
            className="absolute inset-0 bg-gradient-to-r"
            style={{
              backgroundImage: `linear-gradient(to right, ${palettes.primary[1]}33, ${palettes.primary[0]}1A)`
            }}
          />
          <img
            src={landingImage}
            alt="Landing"
            className="w-full h-full object-cover rounded-r-3xl"
          />

          {/* Top left logo */}
          <div className="absolute top-8 left-8 z-20 w-20 h-20">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Right side - Login/Register forms */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center bg-white">
        <div
          className={`w-full max-w-md px-8 py-12 pb-32 transition-all duration-1000 ease-out relative
           ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {pendingActivation && pendingEmail ? (
            <ActivationForm
              email={pendingEmail}
              onActivationSuccess={handleActivationSuccess}
              onCancel={handleActivationCancel}
            />
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-medium" style={{ color: text.primary }}>
                  Welcome
                </h2>
                <p className="mt-2" style={{ color: text.secondary }}>
                  Sign in to access your dashboard
                </p>
              </div>

              {/* Tabs */}
              <div className="flex border-b mb-8" style={{ borderColor: palettes.neutral[1] }}>
                <button
                  className="flex-1 py-3 font-medium transition-all duration-300"
                  style={{
                    color: activeTab === 'login' ? colors.primary : palettes.neutral[3],
                    borderBottom: activeTab === 'login' ? `2px solid ${colors.primary}` : 'none'
                  }}
                  onClick={() => setActiveTab('login')}
                >
                  Log in
                </button>
                <button
                  className="flex-1 py-3 font-medium transition-all duration-300"
                  style={{
                    color: activeTab === 'register' ? colors.primary : palettes.neutral[3],
                    borderBottom: activeTab === 'register' ? `2px solid ${colors.primary}` : 'none'
                  }}
                  onClick={() => setActiveTab('register')}
                >
                  Create Account
                </button>
              </div>

              {/* Form */}
              <div className={`transition-all duration-500 ease-out transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <AuthForm
                  type={activeTab}
                  onRegistrationSuccess={handleRegistrationSuccess}
                />
              </div>

              {/* Footer links */}
              <div className={`mt-8 text-center transition-all duration-500 ease-out transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {activeTab === 'login' ? (
                  <p className="text-sm" style={{ color: palettes.neutral[4] }}>
                    Forgot your password?{' '}
                    <Link
                      to="/forgot-password"
                      className="font-medium transition-colors duration-300"
                      style={{ color: colors.primary }}
                    >
                      Click here to reset it
                    </Link>
                  </p>
                ) : (
                  <p className="text-sm" style={{ color: palettes.neutral[4] }}>
                    Already have an account?{' '}
                    <span
                      className="font-medium cursor-pointer transition-colors duration-300"
                      style={{ color: colors.primary }}
                      onClick={() => setActiveTab('login')}
                    >
                      Log in
                    </span>
                  </p>
                )}
              </div>
            </>
          )}

          {/* Bottom center logo */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <img
              src={logo}
              alt="Logo"
              className="h-12 w-auto object-contain opacity-50 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Mobile background */}
      <div className="absolute inset-0 md:hidden -z-10">
        <div className="absolute inset-0" style={{ backgroundColor: `${palettes.primary[0]}E6` }} />
        <img
          src={landingImage}
          alt="Background"
          className="w-full h-full object-cover object-left opacity-10 rounded-xl"
        />

        {/* Mobile top logo */}
        <div className="absolute top-6 left-6 z-20 w-10 h-10">
          <img
            src={logo}
            alt="Logo"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
