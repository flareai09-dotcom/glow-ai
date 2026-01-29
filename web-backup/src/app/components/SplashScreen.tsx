import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="h-full w-full bg-gradient-to-br from-[#FAF7F5] via-[#F5D5CB] to-[#D1E3D1] flex flex-col items-center justify-center px-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative circles */}
      <motion.div
        className="absolute top-20 right-10 w-32 h-32 rounded-full bg-white/30 blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-32 left-8 w-40 h-40 rounded-full bg-[#14B8A6]/20 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Logo and branding */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#14B8A6] to-[#10B981] flex items-center justify-center mb-6 shadow-lg">
          <Sparkles className="w-10 h-10 text-white" strokeWidth={2} />
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-2">GlowAI</h1>
        <p className="text-gray-600 text-center max-w-xs">
          Your AI-powered skincare companion
        </p>
      </motion.div>

      {/* Illustration hint */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-12 flex gap-4 items-center"
      >
        <div className="w-12 h-12 rounded-full bg-white/60 backdrop-blur-sm" />
        <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm" />
        <div className="w-12 h-12 rounded-full bg-white/60 backdrop-blur-sm" />
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-3"
      >
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#14B8A6]"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Auto advance after animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2.5 }}
        onAnimationComplete={onComplete}
      />
    </motion.div>
  );
}
