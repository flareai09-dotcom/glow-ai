import { motion } from 'motion/react';
import { Sun, Moon, TrendingUp, Calendar, Droplet, Flame, Camera, ShoppingBag, User } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';

interface HomeDashboardProps {
  onNavigate: (screen: string) => void;
}

const routineTasks = {
  morning: [
    { name: 'Cleanser', done: true, time: 'Done at 7:30 AM' },
    { name: 'Toner', done: true, time: 'Done at 7:32 AM' },
    { name: 'Serum', done: false, time: 'Pending' },
    { name: 'Moisturizer', done: false, time: 'Pending' },
    { name: 'Sunscreen', done: false, time: 'Pending' },
  ],
  night: [
    { name: 'Cleanser', done: false, time: '9:00 PM' },
    { name: 'Toner', done: false, time: '9:02 PM' },
    { name: 'Treatment', done: false, time: '9:05 PM' },
    { name: 'Night Cream', done: false, time: '9:10 PM' },
  ],
};

const weeklyProgress = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 68 },
  { day: 'Wed', score: 64 },
  { day: 'Thu', score: 70 },
  { day: 'Fri', score: 72 },
  { day: 'Sat', score: 75 },
  { day: 'Sun', score: 78 },
];

export function HomeDashboard({ onNavigate }: HomeDashboardProps) {
  const currentHour = new Date().getHours();
  const isEvening = currentHour >= 18;

  return (
    <div className="min-h-full w-full bg-[#FAF7F5] pb-24 relative flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#14B8A6] to-[#10B981] px-6 pt-12 pb-8 rounded-b-[2.5rem]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-white/80 text-sm mb-1">Welcome back,</p>
            <h1 className="text-2xl font-bold text-white">Priya ✨</h1>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <User className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Skin Score Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">Current Skin Score</p>
              <div className="flex items-end gap-2">
                <h2 className="text-4xl font-bold text-white">78</h2>
                <span className="text-green-300 text-sm mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +16 this week
                </span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-2xl">🎉</span>
            </div>
          </div>
          <Progress value={78} className="h-2 bg-white/20" />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-4">
        {/* Quick Actions */}
        <div className="bg-white rounded-3xl p-5 shadow-lg mb-6">
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate('camera')}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14B8A6]/20 to-[#10B981]/20 flex items-center justify-center">
                <Camera className="w-6 h-6 text-[#14B8A6]" />
              </div>
              <span className="text-xs text-gray-700 font-medium">New Scan</span>
            </button>

            <button
              onClick={() => onNavigate('products')}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F5D5CB]/60 to-[#D1E3D1]/60 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-[#14B8A6]" />
              </div>
              <span className="text-xs text-gray-700 font-medium">Products</span>
            </button>

            <button className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14B8A6]/20 to-[#10B981]/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#14B8A6]" />
              </div>
              <span className="text-xs text-gray-700 font-medium">History</span>
            </button>
          </div>
        </div>

        {/* Today's Routine */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Routine</h3>

          {/* Toggle between morning/evening */}
          <div className="flex gap-3 mb-4">
            <button className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2 transition-all ${!isEvening ? 'bg-white shadow-md' : 'bg-transparent'}`}>
              <Sun className="w-5 h-5" />
              <span className="font-medium">Morning</span>
            </button>
            <button className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2 transition-all ${isEvening ? 'bg-white shadow-md' : 'bg-transparent'}`}>
              <Moon className="w-5 h-5" />
              <span className="font-medium">Evening</span>
            </button>
          </div>

          {/* Routine tasks */}
          <div className="space-y-3">
            {routineTasks.morning.map((task, index) => (
              <motion.div
                key={task.name}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${task.done ? 'bg-[#14B8A6]' : 'bg-gray-100'
                  }`}>
                  {task.done ? (
                    <span className="text-white text-lg">✓</span>
                  ) : (
                    <span className="text-gray-400 text-2xl leading-none">·</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${task.done ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                    {task.name}
                  </h4>
                  <p className="text-sm text-gray-500">{task.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Progress</h3>

          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <div className="flex items-end justify-between h-32 gap-2">
              {weeklyProgress.map((day, index) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${day.score}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`w-full rounded-t-lg ${index === weeklyProgress.length - 1
                        ? 'bg-gradient-to-t from-[#14B8A6] to-[#10B981]'
                        : 'bg-gray-200'
                      }`}
                  />
                  <span className="text-xs text-gray-600 font-medium">{day.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skin Tips */}
        <div className="bg-gradient-to-br from-[#F5D5CB] to-[#D1E3D1] rounded-3xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0">
              <Droplet className="w-6 h-6 text-[#14B8A6]" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Today's Tip</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                Drink at least 8 glasses of water daily to keep your skin hydrated and glowing from within.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 text-[#14B8A6]">
            <div className="w-6 h-6 flex items-center justify-center">
              <Flame className="w-6 h-6" fill="currentColor" />
            </div>
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => onNavigate('products')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="text-xs">Products</span>
          </button>

          <button
            onClick={() => onNavigate('camera')}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-[#14B8A6] to-[#10B981] flex items-center justify-center -mt-6 shadow-lg"
          >
            <Camera className="w-6 h-6 text-white" />
          </button>

          <button className="flex flex-col items-center gap-1 text-gray-400">
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs">Progress</span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
