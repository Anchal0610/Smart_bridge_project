import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, Zap, Target, Flame, Dumbbell, Loader2, Plus, ArrowRight, X } from 'lucide-react';
import { workoutApi } from '../../services/api';

const WorkoutPlans = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  // Form State for Generator
  const [goal, setGoal] = useState('muscle_gain');
  const [level, setLevel] = useState('beginner');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await workoutApi.getPlans();
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch plans', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await workoutApi.generatePlan(goal, level);
      setPlans([response.data, ...plans]);
      setShowGenerator(false);
    } catch (error) {
      console.error('Generation failed', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 pt-14 md:pt-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter">WORKOUT <span className="text-cyan-400">ROUTINES</span></h1>
          <p className="text-sm text-gray-400 mt-1">AI-synchronized training sessions tailored for you.</p>
        </div>
        <button
          onClick={() => setShowGenerator(true)}
          className="premium-gradient px-6 py-3 rounded-xl text-black font-bold flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Plus className="w-5 h-5" />
          Generate AI Plan
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-gray-500 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
          <p className="animate-pulse">Loading your routines...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-4">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
            <Dumbbell className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold">No plans found</h3>
          <p className="text-gray-500 max-w-xs mx-auto">Start by generating an AI-powered workout plan based on your goals.</p>
          <button
            onClick={() => setShowGenerator(true)}
            className="text-cyan-400 font-bold hover:underline"
          >
            Create first plan →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan: any, idx: number) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card group overflow-hidden border-white/5 hover:border-cyan-400/30 transition-all cursor-pointer"
              onClick={() => setSelectedPlan(plan)}
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-cyan-400/10 rounded-xl">
                    <Zap className="w-6 h-6 text-cyan-400" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 rounded-md border border-white/10">
                    {plan.difficulty}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold group-hover:text-cyan-400 transition-colors">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 uppercase tracking-tighter font-medium">{plan.goal}</p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-gray-400 uppercase">
                  <span>{plan.exercises?.length || 0} Exercises</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Generator Modal */}
      <AnimatePresence>
        {showGenerator && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !generating && setShowGenerator(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass-card w-full max-w-lg p-8 space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black italic">GENERATE <span className="text-cyan-400">PLAN</span></h2>
                <button onClick={() => setShowGenerator(false)} disabled={generating}>
                  <X className="w-6 h-6 text-gray-400 hover:text-white" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Pick Your Goal</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['muscle_gain', 'weight_loss', 'strength', 'mobility'].map(g => (
                      <button
                        key={g}
                        onClick={() => setGoal(g)}
                        className={`p-3 rounded-xl border text-sm font-bold capitalize transition-all
                          ${goal === g ? 'bg-cyan-400 border-cyan-400 text-black shadow-lg shadow-cyan-400/20' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}
                        `}
                      >
                        {g.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Fitness Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['beginner', 'intermediate', 'advanced'].map(l => (
                      <button
                        key={l}
                        onClick={() => setLevel(l)}
                        className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all
                          ${level === l ? 'bg-cyan-400 border-cyan-400 text-black shadow-lg shadow-cyan-400/20' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}
                        `}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full premium-gradient p-4 rounded-2xl text-black font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      AROMI IS THINKING...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 fill-current" />
                      Build Plan Now
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Plan Details Sidebar/Overlay (Simplified for now) */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlan(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-[#0a0a0c] h-full shadow-2xl overflow-y-auto"
            >
              <div className="sticky top-0 z-10 glass-card rounded-none border-x-0 border-t-0 p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black italic">{selectedPlan.name}</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{selectedPlan.goal} • {selectedPlan.difficulty}</p>
                </div>
                <button onClick={() => setSelectedPlan(null)} className="p-2 hover:bg-white/5 rounded-full">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="p-8 space-y-8">
                {selectedPlan.exercises?.map((ex: any, idx: number) => (
                  <div key={ex.id} className="space-y-4 group">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-cyan-400 flex items-center justify-center text-black font-black italic">
                        {idx + 1}
                      </div>
                      <h4 className="text-xl font-bold">{ex.name}</h4>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-cyan-400/20 transition-colors">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Sets</p>
                        <p className="text-lg font-bold">{ex.sets}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-cyan-400/20 transition-colors">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Reps</p>
                        <p className="text-lg font-bold">{ex.reps}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-cyan-400/20 transition-colors">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Rest</p>
                        <p className="text-lg font-bold">{ex.rest_seconds}s</p>
                      </div>
                    </div>

                    {ex.video_url && (
                      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-red-500/30 transition-all">
                        <iframe
                          width="100%"
                          height="100%"
                          src={ex.video_url.replace('watch?v=', 'embed/')}
                          title={ex.name}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}

                    <p className="text-sm text-gray-400 leading-relaxed italic border-l-2 border-cyan-400/30 pl-4 py-1">
                      {ex.instructions}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutPlans;
