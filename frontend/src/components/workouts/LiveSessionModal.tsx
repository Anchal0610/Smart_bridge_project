import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  CheckCircle2,
  Clock,
  Zap,
  X,
  Trophy
} from 'lucide-react';

interface LiveSessionModalProps {
  plan: any;
  onClose: () => void;
  onFinish: (stats: any) => void;
}

const LiveSessionModal: React.FC<LiveSessionModalProps> = ({ plan, onClose, onFinish }) => {
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  const exercises = plan?.exercises || [];
  const currentExercise = exercises[currentExerciseIdx];

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentExerciseIdx < exercises.length - 1) {
      if (!completedExercises.includes(currentExerciseIdx)) {
        setCompletedExercises([...completedExercises, currentExerciseIdx]);
      }
      setCurrentExerciseIdx(currentExerciseIdx + 1);
    } else {
      setShowSummary(true);
      setIsActive(false);
    }
  };

  const handlePrev = () => {
    if (currentExerciseIdx > 0) {
      setCurrentExerciseIdx(currentExerciseIdx - 1);
    }
  };

  if (showSummary) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative glass-card max-w-md w-full p-8 text-center space-y-8"
        >
          <div className="w-20 h-20 premium-gradient rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-cyan-500/20">
            <Trophy className="w-10 h-10 text-black" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Session <span className="text-cyan-400">Complete!</span></h2>
            <p className="text-gray-400 font-medium">You smashed your {plan.name} routine.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 bg-white/5">
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Duration</p>
              <p className="text-2xl font-black italic text-white">{formatTime(seconds)}</p>
            </div>
            <div className="glass-card p-4 bg-white/5">
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Exercises</p>
              <p className="text-2xl font-black italic text-white">{exercises.length}</p>
            </div>
          </div>

          <button
            onClick={() => onFinish({ duration: seconds, exercises: exercises.length })}
            className="w-full premium-gradient py-4 rounded-2xl font-black uppercase italic text-black shadow-xl hover:scale-[1.02] transition-transform"
          >
            Claim Impact Tokens
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col pt-14 md:pt-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-slate-950/95 backdrop-blur-md"
      />

      {/* Header */}
      <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-cyan-400/10 rounded-lg">
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Live Session</p>
            <h2 className="text-sm font-bold uppercase tracking-tighter text-white">{plan.name}</h2>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Timer</p>
            <p className="text-xl font-black italic text-white font-mono">{formatTime(seconds)}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full gap-12">
        <motion.div
          key={currentExerciseIdx}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full space-y-8"
        >
          <div className="space-y-4 text-center">
            <p className="text-xs font-black uppercase tracking-[0.4em] text-cyan-400">Exercise {currentExerciseIdx + 1} of {exercises.length}</p>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-tight">
              {currentExercise?.name}
            </h1>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Target Reps</p>
              <p className="text-4xl font-black italic text-cyan-400">{currentExercise?.reps || '12-15'}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Sets Left</p>
              <p className="text-4xl font-black italic text-cyan-400">{currentExercise?.sets || '3'}</p>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center gap-8">
          <button
            onClick={handlePrev}
            disabled={currentExerciseIdx === 0}
            className="p-4 bg-white/5 rounded-full text-gray-400 hover:text-white disabled:opacity-20 transition-all"
          >
            <SkipBack className="w-8 h-8" />
          </button>

          <button
            onClick={() => setIsActive(!isActive)}
            className="w-24 h-24 rounded-full premium-gradient flex items-center justify-center shadow-2xl shadow-cyan-400/20 hover:scale-105 transition-transform"
          >
            {isActive ? (
              <Pause className="w-10 h-10 text-black fill-current" />
            ) : (
              <Play className="w-10 h-10 text-black fill-current ml-1" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-4 bg-white/5 rounded-full text-gray-400 hover:text-white transition-all group"
          >
            <SkipForward className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 w-full bg-white/5 h-1.5 overflow-hidden">
        <motion.div
          className="h-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentExerciseIdx) / exercises.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default LiveSessionModal;
