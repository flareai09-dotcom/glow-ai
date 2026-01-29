import { motion } from 'motion/react';
import { X, Check, Sparkles, TrendingUp, ShoppingBag, Shield, Zap } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface PremiumPaywallScreenProps {
  onPurchase: () => void;
  onClose: () => void;
}

const features = [
  {
    icon: Sparkles,
    title: 'Unlimited AI Scans',
    description: 'Track your skin progress weekly',
  },
  {
    icon: TrendingUp,
    title: 'Detailed Analysis',
    description: 'Complete breakdown of all skin concerns',
  },
  {
    icon: ShoppingBag,
    title: 'Product Recommendations',
    description: 'Budget-friendly Indian skincare products',
  },
  {
    icon: Zap,
    title: 'Personalized Routines',
    description: 'Morning & night skincare schedules',
  },
];

export function PremiumPaywallScreen({ onPurchase, onClose }: PremiumPaywallScreenProps) {
  return (
    <div className="min-h-full w-full bg-gradient-to-br from-[#FAF7F5] via-[#FEFEFE] to-[#F5D5CB]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="w-10" />
        <h1 className="text-lg font-semibold text-gray-800">Upgrade to Premium</h1>
        <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-white/50 flex items-center justify-center transition-colors">
          <X className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="px-6 py-4 pb-40">
        {/* Hero section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#14B8A6] to-[#10B981] mx-auto mb-6 flex items-center justify-center shadow-xl">
            <Sparkles className="w-12 h-12 text-white" strokeWidth={2} />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Unlock Your Best Skin
          </h2>
          <p className="text-gray-600 max-w-sm mx-auto">
            Get lifetime access to personalized skincare insights and expert recommendations
          </p>
        </motion.div>

        {/* Pricing card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 mb-6 shadow-xl border-2 border-[#14B8A6]"
        >
          <div className="flex items-end justify-center mb-4">
            <span className="text-gray-500 line-through text-xl mr-3">₹999</span>
            <span className="text-5xl font-bold text-gray-800">₹99</span>
          </div>
          <p className="text-center text-gray-600 mb-4">One-time payment, lifetime access</p>

          <div className="bg-gradient-to-r from-[#14B8A6]/10 to-[#10B981]/10 rounded-2xl p-3 text-center">
            <p className="text-sm font-semibold text-[#14B8A6]">
              🎉 Limited Time: 90% OFF
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-6"
        >
          <h3 className="font-semibold text-gray-800 text-lg mb-4">What's Included</h3>

          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-4 bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14B8A6]/20 to-[#10B981]/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-[#14B8A6]" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
                <Check className="w-5 h-5 text-[#14B8A6] flex-shrink-0 mt-1" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center justify-around text-center">
            <div>
              <Shield className="w-6 h-6 text-[#14B8A6] mx-auto mb-2" />
              <p className="text-xs text-gray-600">Secure<br />Payment</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div>
              <p className="text-2xl font-bold text-gray-800 mb-1">10k+</p>
              <p className="text-xs text-gray-600">Happy<br />Users</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div>
              <p className="text-2xl font-bold text-gray-800 mb-1">4.8★</p>
              <p className="text-xs text-gray-600">App<br />Rating</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 shadow-2xl">
        <Button
          onClick={onPurchase}
          className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#14B8A6] to-[#10B981] hover:shadow-lg transition-all text-white text-lg shadow-md font-semibold"
        >
          Get Lifetime Access for ₹99
        </Button>
        <p className="text-center text-xs text-gray-500 mt-3">
          Safe & secure payment • No hidden charges
        </p>
      </div>
    </div>
  );
}
