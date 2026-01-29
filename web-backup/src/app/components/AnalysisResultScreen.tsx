import { motion } from 'motion/react';
import { ChevronLeft, Lock, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';

interface AnalysisResultScreenProps {
  onUpgrade: () => void;
  onBack: () => void;
}

const skinIssues = [
  { name: 'Acne & Breakouts', severity: 68, detected: true },
  { name: 'Dark Spots', severity: 45, detected: true },
  { name: 'Uneven Skin Tone', severity: 52, detected: true },
  { name: 'Fine Lines', severity: 32, detected: true },
  { name: 'Oiliness', severity: 71, detected: true },
  { name: 'Dryness', severity: 28, detected: false },
];

export function AnalysisResultScreen({ onUpgrade, onBack }: AnalysisResultScreenProps) {
  return (
    <div className="min-h-full w-full bg-[#FAF7F5]">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <button onClick={onBack} className="mr-4">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Analysis Results</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-6 pb-32">
        {/* Skin Score Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-[#14B8A6] to-[#10B981] rounded-3xl p-6 mb-6 shadow-xl text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">Your Skin Score</p>
              <h2 className="text-5xl font-bold">62</h2>
            </div>
            <div className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center">
              <TrendingUp className="w-10 h-10" />
            </div>
          </div>
          <p className="text-white/90 text-sm">
            Fair skin health. Improvement possible with consistent care.
          </p>
        </motion.div>

        {/* Free Preview Notice */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3"
        >
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-900 mb-1">Free Preview</p>
            <p className="text-amber-700">
              Upgrade to unlock detailed remedies, routines & product recommendations
            </p>
          </div>
        </motion.div>

        {/* Detected Issues */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Detected Concerns</h3>

          <div className="space-y-4">
            {skinIssues.map((issue, index) => (
              <motion.div
                key={issue.name}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="bg-white rounded-2xl p-5 shadow-sm relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${issue.severity > 60 ? 'bg-red-500' :
                        issue.severity > 40 ? 'bg-amber-500' :
                          'bg-green-500'
                      }`} />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{issue.name}</h4>
                      <p className="text-sm text-gray-500">
                        {issue.severity > 60 ? 'High' :
                          issue.severity > 40 ? 'Moderate' :
                            'Mild'} severity
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{issue.severity}%</span>
                </div>

                {/* Progress bar with blur effect */}
                <div className="relative">
                  <Progress
                    value={issue.severity}
                    className="h-2 bg-gray-100"
                  />

                  {/* Blur overlay for premium content */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-white backdrop-blur-[2px] flex items-center justify-center">
                    <Lock className="w-4 h-4 text-gray-500" />
                  </div>
                </div>

                {/* Blurred remedy preview */}
                <div className="mt-3 relative">
                  <p className="text-sm text-gray-600 blur-sm select-none">
                    Use gentle cleansers with salicylic acid. Apply niacinamide serum...
                  </p>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 shadow-2xl">
        <Button
          onClick={onUpgrade}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#14B8A6] to-[#10B981] hover:shadow-lg transition-all text-white text-base shadow-md"
        >
          <Lock className="w-5 h-5 mr-2" />
          Unlock Full Analysis for ₹99
        </Button>
        <p className="text-center text-xs text-gray-500 mt-3">
          One-time payment • Lifetime access • Cancel anytime
        </p>
      </div>
    </div>
  );
}
