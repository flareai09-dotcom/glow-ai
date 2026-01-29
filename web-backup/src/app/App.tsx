import { useState, useEffect } from 'react';
import { SplashScreen } from '@/app/components/SplashScreen';
import { OnboardingScreens } from '@/app/components/OnboardingScreens';
import { CameraUploadScreen } from '@/app/components/CameraUploadScreen';
import { AnalysisResultScreen } from '@/app/components/AnalysisResultScreen';
import { PremiumPaywallScreen } from '@/app/components/PremiumPaywallScreen';
import { HomeDashboard } from '@/app/components/HomeDashboard';
import { ProductRecommendationScreen } from '@/app/components/ProductRecommendationScreen';
import { ProfileScreen } from '@/app/components/ProfileScreen';

type Screen =
  | 'splash'
  | 'onboarding'
  | 'camera'
  | 'analysis'
  | 'paywall'
  | 'home'
  | 'products'
  | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isPremium, setIsPremium] = useState(false);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setCurrentScreen('onboarding');
  };

  // Handle onboarding navigation
  const handleOnboardingNext = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setCurrentScreen('home');
    }
  };

  const handleOnboardingSkip = () => {
    setCurrentScreen('home');
  };

  // Handle camera upload
  const handleUpload = () => {
    setCurrentScreen('analysis');
  };

  // Handle premium upgrade
  const handleUpgrade = () => {
    setCurrentScreen('paywall');
  };

  const handlePurchase = () => {
    setIsPremium(true);
    setCurrentScreen('home');
  };

  // Navigation handler
  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  // Mobile container wrapper
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-center p-4 gap-6">
      {/* Quick navigation for demo */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
        <p className="text-sm text-gray-600 mb-3 text-center font-medium">Quick Navigation (Demo)</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setCurrentScreen('splash')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
          >
            Splash
          </button>
          <button
            onClick={() => { setCurrentScreen('onboarding'); setOnboardingStep(0); }}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
          >
            Onboarding
          </button>
          <button
            onClick={() => setCurrentScreen('camera')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
          >
            Camera
          </button>
          <button
            onClick={() => setCurrentScreen('analysis')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
          >
            Analysis
          </button>
          <button
            onClick={() => setCurrentScreen('paywall')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
          >
            Paywall
          </button>
          <button
            onClick={() => setCurrentScreen('home')}
            className="px-3 py-1.5 bg-[#14B8A6] hover:bg-[#10B981] rounded-lg text-xs font-medium text-white transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => setCurrentScreen('products')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
          >
            Products
          </button>
          <button
            onClick={() => setCurrentScreen('profile')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
          >
            Profile
          </button>
        </div>
      </div>

      {/* Mobile frame */}
      <div className="w-full max-w-[430px] h-[932px] bg-white rounded-[3rem] shadow-2xl overflow-hidden relative [transform:translateZ(0)] isolate border-8 border-gray-900/10">
        {/* Screen content */}
        <div className="w-full h-full overflow-y-auto scrollbar-hide">
          {currentScreen === 'splash' && (
            <SplashScreen onComplete={handleSplashComplete} />
          )}

          {currentScreen === 'onboarding' && (
            <OnboardingScreens
              currentStep={onboardingStep}
              onNext={handleOnboardingNext}
              onSkip={handleOnboardingSkip}
            />
          )}

          {currentScreen === 'camera' && (
            <CameraUploadScreen
              onUpload={handleUpload}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'analysis' && (
            <AnalysisResultScreen
              onUpgrade={handleUpgrade}
              onBack={() => setCurrentScreen('camera')}
            />
          )}

          {currentScreen === 'paywall' && (
            <PremiumPaywallScreen
              onPurchase={handlePurchase}
              onClose={() => setCurrentScreen('analysis')}
            />
          )}

          {currentScreen === 'home' && (
            <HomeDashboard onNavigate={handleNavigate} />
          )}

          {currentScreen === 'products' && (
            <ProductRecommendationScreen onBack={() => setCurrentScreen('home')} />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen onBack={() => setCurrentScreen('home')} />
          )}
        </div>

        {/* Status bar overlay */}
        <div className="absolute top-0 left-0 right-0 h-12 pointer-events-none">
          <div className="flex items-center justify-between px-8 pt-3">
            <span className="text-sm font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <div className="text-sm">📶</div>
              <div className="text-sm">📶</div>
              <div className="text-sm">🔋</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
