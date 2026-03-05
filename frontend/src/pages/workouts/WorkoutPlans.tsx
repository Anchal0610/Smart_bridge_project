import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, Zap, Target, Flame, Dumbbell, Loader2, Plus, ArrowRight, X, Settings2, Trophy } from 'lucide-react';
import { workoutApi, userApi, nutritionApi } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import WorkoutCalendar from '../../components/workouts/WorkoutCalendar';
import WorkoutStackDrawer from '../../components/workouts/WorkoutStackDrawer';

const WorkoutPlans = () => {
  const user = useAuthStore(state => state.user);
  const updateUser = useAuthStore(state => state.updateUser);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Profile / Form State
  const [goal, setGoal] = useState(user?.fitness_goal || 'muscle_gain');
  const [level, setLevel] = useState(user?.fitness_level || 'beginner');
  const [preference, setPreference] = useState(user?.workout_preference || 'gym');
  const [split, setSplit] = useState(user?.muscle_split || 1);

  useEffect(() => {
    fetchActivePlan();
  }, []);

  const fetchActivePlan = async () => {
    try {
      const response = await workoutApi.getActivePlan();
      setActivePlan(response.data);
    } catch (error) {
      console.log('No active plan found');
      setActivePlan(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // 1. Update Profile first
      await userApi.updateProfile({
        fitness_goal: goal,
        fitness_level: level,
        workout_preference: preference,
        muscle_split: split
      });

      // Update local storage user state
      if (user) {
        updateUser({ ...user, fitness_goal: goal, fitness_level: level, workout_preference: preference, muscle_split: split });
      }

      // 2. Generate Workout Plan
      const workoutRes = await workoutApi.generatePlan();

      // 3. Generate Nutrition Plan in sync
      await nutritionApi.generateMonthlyPlan();

      setActivePlan(workoutRes.data);
      setShowGenerator(false);
    } catch (error) {
      console.error('Generation failed', error);
      alert('Failed to generate plans. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleExerciseToggle = async (exerciseId: number) => {
    try {
      await workoutApi.completeExercise(exerciseId);
      // Refresh plan to show completion
      await fetchActivePlan();

      // Update selected exercise in drawer if open
      if (selectedExercise && selectedExercise.id === exerciseId) {
        setSelectedExercise((prev: any) => ({ ...prev, is_completed: !prev.is_completed }));
      }
    } catch (error) {
      console.error('Failed to toggle exercise', error);
    }
  };

  const handleExerciseClick = (exercise: any) => {
    setSelectedExercise(exercise);
    setIsDrawerOpen(true);
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
          <p className="animate-pulse">Loading your training schedule...</p>
        </div>
      ) : !activePlan ? (
        <div className="glass-card p-12 text-center space-y-4">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-cyan-500/10">
            <Dumbbell className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold">No Active Training Plan</h3>
          <p className="text-gray-500 max-w-xs mx-auto">Start your 30-day journey by generating an AI-powered monthly schedule.</p>
          <button
            onClick={() => setShowGenerator(true)}
            className="text-cyan-400 font-bold hover:underline flex items-center gap-2 mx-auto mt-4"
          >
            Build your plan now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Calendar View */}
          <WorkoutCalendar
            exercises={activePlan.exercises || []}
            onExerciseToggle={handleExerciseToggle}
            onExerciseClick={handleExerciseClick}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <section className="glass-card p-6 bg-emerald-500/5 border-emerald-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-sm uppercase tracking-widest text-emerald-400">Streak Status</h4>
              </div>
              <p className="text-3xl font-black italic">12 DAYS</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Current consistency streak</p>
            </section>

            <section className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400">Total Completion</h4>
              </div>
              <p className="text-3xl font-black italic">
                {Math.round(((activePlan.exercises?.filter((e: any) => e.is_completed).length || 0) / (activePlan.exercises?.length || 1)) * 100)}%
              </p>
              <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Overall plan progress</p>
            </section>

            <section className="glass-card p-6 flex flex-col justify-between">
               <div>
                <div className="flex items-center gap-3 mb-4">
                  <Settings2 className="w-5 h-5 text-gray-400" />
                  <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400">Configuration</h4>
                </div>
                <p className="text-xs font-bold text-gray-300 uppercase">{activePlan.difficulty} • {activePlan.goal}</p>
              </div>
              <button
                onClick={() => setShowGenerator(true)}
                className="text-[10px] font-black uppercase text-cyan-400 hover:underline mt-4"
              >
                Change Preferences
              </button>
            </section>
          </div>
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

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Preference</label>
                    <div className="flex gap-2">
                       {['gym', 'home'].map(p => (
                        <button
                          key={p}
                          onClick={() => setPreference(p)}
                          className={`flex-1 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all
                            ${preference === p ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-gray-500'}
                          `}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Muscle Split</label>
                    <div className="flex gap-2">
                       {[1, 2].map(s => (
                        <button
                          key={s}
                          onClick={() => setSplit(s)}
                          className={`flex-1 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all
                            ${split === s ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-gray-500'}
                          `}
                        >
                          {s} Muscle{s > 1 ? 's' : ''}
                        </button>
                      ))}
                    </div>
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

      <WorkoutStackDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        exercise={selectedExercise}
        onToggleComplete={handleExerciseToggle}
      />
    </div>
  );
};

export default WorkoutPlans;
