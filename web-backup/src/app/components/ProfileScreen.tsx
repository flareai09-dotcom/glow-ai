import { motion } from 'motion/react';
import {
  ChevronLeft,
  User,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  Crown,
  Calendar,
  Award,
  Moon,
} from 'lucide-react';

interface ProfileScreenProps {
  onBack: () => void;
}

const settingsSections = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Edit Profile', value: 'Priya Sharma' },
      { icon: Crown, label: 'Premium Status', value: 'Active', badge: true },
      { icon: Calendar, label: 'Joined', value: 'Dec 2024' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Bell, label: 'Notifications', value: 'On' },
      { icon: Moon, label: 'Dark Mode', value: 'Off' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help & FAQs', value: '' },
      { icon: Settings, label: 'App Settings', value: '' },
    ],
  },
];

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  return (
    <div className="min-h-full w-full bg-[#FAF7F5]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#14B8A6] to-[#10B981] px-6 pt-12 pb-8">
        <button onClick={onBack} className="mb-6">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Profile card */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
            👩🏻
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-1">Priya Sharma</h1>
            <p className="text-white/80 text-sm">priya.sharma@email.com</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/20">
            <p className="text-2xl font-bold text-white mb-1">78</p>
            <p className="text-white/80 text-xs">Skin Score</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/20">
            <p className="text-2xl font-bold text-white mb-1">12</p>
            <p className="text-white/80 text-xs">Scans Done</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/20">
            <p className="text-2xl font-bold text-white mb-1">45</p>
            <p className="text-white/80 text-xs">Day Streak</p>
          </div>
        </div>
      </div>

      {/* Settings sections */}
      <div className="px-6 py-6 -mt-4">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="mb-6"
          >
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
              {section.title}
            </h2>

            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${itemIndex !== section.items.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14B8A6]/10 to-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#14B8A6]" />
                    </div>

                    <div className="flex-1 text-left">
                      <h3 className="font-medium text-gray-800">{item.label}</h3>
                      {item.value && (
                        <p className="text-sm text-gray-500 mt-0.5">{item.value}</p>
                      )}
                    </div>

                    {item.badge && (
                      <span className="px-2.5 py-1 bg-gradient-to-r from-[#14B8A6] to-[#10B981] text-white text-xs font-semibold rounded-full">
                        Premium
                      </span>
                    )}

                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Achievements */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
            Achievements
          </h2>

          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">7-Day Warrior</h3>
                <p className="text-sm text-gray-600">Completed skincare routine for 7 days</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {['🎯', '⭐', '🔥', '💪', '🌟', '✨', '🏆', '🎉'].map((emoji, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-2xl flex items-center justify-center text-2xl ${i < 3 ? 'bg-gradient-to-br from-[#F5D5CB] to-[#D1E3D1]' : 'bg-gray-100 opacity-40'
                    }`}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center justify-center gap-3 text-red-500 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Log Out</span>
          </button>
        </motion.div>

        {/* App info */}
        <div className="text-center mt-8 text-xs text-gray-400">
          <p>GlowAI v1.0.0</p>
          <p className="mt-1">Made with ❤️ for Indian skin</p>
        </div>
      </div>
    </div>
  );
}
