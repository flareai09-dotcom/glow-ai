import { motion } from 'motion/react';
import { Scan, Sparkles, IndianRupee, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface OnboardingScreensProps {
  currentStep: number;
  onNext: () => void;
  onSkip: () => void;
}

const onboardingData = [
  {
    icon: Scan,
    title: "AI-Powered Skin Analysis",
    description: "Get instant insights into your skin health with our advanced AI technology. Detect acne, dark spots, and more.",
    color: "from-[#14B8A6] to-[#10B981]",
  },
  {
    icon: Sparkles,
    title: "Personalized Skincare Routine",
    description: "Receive customized routines tailored to your unique skin type and concerns. Science-backed recommendations.",
    color: "from-[#F5D5CB] to-[#D1E3D1]",
  },
  {
    icon: IndianRupee,
    title: "₹99 Lifetime Premium",
    description: "Unlock unlimited scans, detailed analysis, and expert product recommendations. One-time payment, lifetime access.",
    color: "from-[#10B981] to-[#14B8A6]",
  },
];

export function OnboardingScreens({ currentStep, onNext, onSkip }: OnboardingScreensProps) {
  const current = onboardingData[currentStep];
  const Icon = current.icon;

  return (
    <div className="h-full w-full bg-gradient-to-br from-[#FAF7F5] to-[#FEFEFE] flex flex-col">
      {/* Skip button */}
      <div className="flex justify-end p-6">
        <button
          onClick={onSkip}
          className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center"
        >
          {/* Icon */}
          <div className={`w-32 h-32 rounded-[2.5rem] bg-gradient-to-br ${current.color} flex items-center justify-center mb-8 shadow-xl`}>
            <Icon className="w-16 h-16 text-white" strokeWidth={1.5} />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800 mb-4 max-w-sm">
            {current.title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed max-w-md">
            {current.description}
          </p>
        </motion.div>
      </div>

      {/* Bottom navigation */}
      <div className="p-8 space-y-6">
        {/* Dots indicator */}
        <div className="flex justify-center gap-2">
          {onboardingData.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentStep
                  ? 'w-8 bg-[#14B8A6]'
                  : 'w-2 bg-gray-300'
                }`}
            />
          ))}
        </div>

        {/* Next button */}
        <Button
          onClick={onNext}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#14B8A6] to-[#10B981] hover:shadow-lg transition-all text-white text-base shadow-md"
        >
          {currentStep === 2 ? 'Get Started' : 'Continue'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
