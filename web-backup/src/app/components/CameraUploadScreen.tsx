import { motion } from 'motion/react';
import { Camera, Upload, AlertCircle, ChevronLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface CameraUploadScreenProps {
  onUpload: () => void;
  onBack: () => void;
}

export function CameraUploadScreen({ onUpload, onBack }: CameraUploadScreenProps) {
  return (
    <div className="h-full w-full bg-[#FAF7F5] flex flex-col">
      {/* Header */}
      <div className="flex items-center px-6 py-4 bg-white/60 backdrop-blur-sm">
        <button onClick={onBack} className="mr-4">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Skin Analysis</h1>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-sm"
        >
          {/* Camera preview area */}
          <div className="relative aspect-[3/4] rounded-[2rem] bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden shadow-xl mb-6 border-4 border-white">
            {/* Face guide overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-80">
                {/* Oval guide */}
                <svg viewBox="0 0 200 280" className="w-full h-full">
                  <ellipse
                    cx="100"
                    cy="140"
                    rx="90"
                    ry="130"
                    fill="none"
                    stroke="#14B8A6"
                    strokeWidth="3"
                    strokeDasharray="10 5"
                    opacity="0.6"
                  />
                </svg>

                {/* Corner guides */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-[3px] border-t-[3px] border-[#14B8A6] rounded-tl-2xl" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-[3px] border-t-[3px] border-[#14B8A6] rounded-tr-2xl" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-[3px] border-b-[3px] border-[#14B8A6] rounded-bl-2xl" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-[3px] border-b-[3px] border-[#14B8A6] rounded-br-2xl" />
              </div>
            </div>

            {/* Scan animation */}
            <motion.div
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#14B8A6] to-transparent"
              animate={{
                top: ['0%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-2xl p-5 shadow-md mb-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-[#14B8A6] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">For best results:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ensure good, even lighting</li>
                  <li>• Face the camera directly</li>
                  <li>• Remove glasses if possible</li>
                  <li>• Keep a neutral expression</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button
              onClick={onUpload}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#14B8A6] to-[#10B981] hover:shadow-lg transition-all text-white text-base shadow-md"
            >
              <Camera className="w-5 h-5 mr-2" />
              Take Photo
            </Button>

            <Button
              onClick={onUpload}
              variant="outline"
              className="w-full h-14 rounded-2xl border-2 border-gray-300 hover:border-[#14B8A6] hover:bg-[#14B8A6]/5 transition-all text-gray-700 text-base"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload from Gallery
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
