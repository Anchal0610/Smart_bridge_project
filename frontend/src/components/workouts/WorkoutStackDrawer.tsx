import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, CheckCircle, Info, Flame, Clock, Award } from 'lucide-react';

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  instructions: string;
  category: string;
  video_url?: string;
  is_completed: boolean;
  scheduled_date?: string;
}

interface WorkoutStackDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
  onToggleComplete: (id: number) => void;
}

const WorkoutStackDrawer: React.FC<WorkoutStackDrawerProps> = ({
  isOpen,
  onClose,
  exercise,
  onToggleComplete,
}) => {
  if (!exercise) return null;

  const getYoutubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  const embedUrl = getYoutubeEmbedUrl(exercise.video_url);
  const isFuture = exercise.scheduled_date ? new Date(exercise.scheduled_date) > new Date() : false;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0F172A] shadow-2xl z-[70] overflow-y-auto border-l border-white/10"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#0F172A]/80 backdrop-blur-md p-6 border-b border-white/10 flex items-center justify-between z-10">
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  {exercise.name}
                </h2>
                {isFuture && (
                  <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest mt-1 italic">
                    Scheduled for the future
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Video Embed */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10 relative group">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={exercise.name}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/40 gap-3">
                    <Play className="w-12 h-12" />
                    <p className="text-sm">Video tutorial not available</p>
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase font-bold tracking-wider">Target</p>
                    <p className="font-semibold text-white">{exercise.category}</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase font-bold tracking-wider">Rest</p>
                    <p className="font-semibold text-white">{exercise.rest_seconds}s</p>
                  </div>
                </div>
              </div>

              {/* Reps & Sets */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20">
                <div className="flex items-center justify-between text-center">
                  <div>
                    <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">Sets</p>
                    <p className="text-3xl font-black text-white">{exercise.sets}</p>
                  </div>
                  <div className="h-10 w-[2px] bg-white/10" />
                  <div>
                    <p className="text-xs text-purple-400 font-bold uppercase tracking-widest mb-1">Reps</p>
                    <p className="text-3xl font-black text-white">{exercise.reps}</p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  Instructions
                </h3>
                <p className="text-white/70 leading-relaxed text-sm bg-white/5 p-4 rounded-2xl border border-white/10">
                  {exercise.instructions || "Focus on mind-muscle connection. Control the negative phase and explode through the positive phase of the movement."}
                </p>
              </div>

              {/* Actions */}
              <button
                onClick={() => !isFuture && onToggleComplete(exercise.id)}
                disabled={isFuture}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                  isFuture
                    ? 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
                    : exercise.is_completed
                    ? 'bg-green-500/10 text-green-500 border border-green-500/30'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                }`}
              >
                <CheckCircle className={`w-5 h-5 ${exercise.is_completed ? 'animate-bounce' : ''}`} />
                {isFuture ? 'Locked (Future Task)' : exercise.is_completed ? 'Completed' : 'Mark as Complete'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WorkoutStackDrawer;
