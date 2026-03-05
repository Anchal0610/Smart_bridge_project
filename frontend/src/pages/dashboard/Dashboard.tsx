import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  Target,
  Calendar,
  Heart,
  Zap,
  Award,
  Users,
  Clock,
  ArrowRight,
  Plus,
  Play,
  MessageCircle,
  ClipboardList,
  Bot,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { workoutApi, nutritionApi, healthApi, userApi } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import LiveSessionModal from '../../components/workouts/LiveSessionModal';
import { isSameDay } from 'date-fns';

const Dashboard = () => {
  const user = useAuthStore(state => state.user);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [nutritionPlan, setNutritionPlan] = useState<any[]>([]);
  const [healthTrends, setHealthTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLiveSession, setShowLiveSession] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [activeWorkoutRes, nutritionPlanRes, healthRes] = await Promise.all([
          workoutApi.getActivePlan(),
          nutritionApi.getCurrentPlan(),
          healthApi.getTrends()
        ]);

        setActivePlan(activeWorkoutRes.data);
        setNutritionPlan(nutritionPlanRes.data);
        setHealthTrends(healthRes.data);
      } catch (error) {
        console.log('No active plans found');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const todayExercises = activePlan?.exercises?.filter((ex: any) =>
    isSameDay(new Date(ex.scheduled_date), new Date())
  ) || [];

  const completedToday = todayExercises.filter((ex: any) => ex.is_completed).length;

  const stats = [
    { label: 'Workouts', value: `${completedToday}/${todayExercises.length}`, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Meals', value: `${nutritionPlan?.filter((m: any) => isSameDay(new Date(m.scheduled_date), new Date()) && m.is_eaten).length || 0}/3`, icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'Streak', value: '12 Days', icon: Sparkles, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { label: 'Health Score', value: '82', icon: Award, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-cyan-400">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.2em] animate-pulse">Synchronizing Arogya Engine...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-14 md:pt-0">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-white leading-tight">
            READY FOR <span className="text-cyan-400">ACTION</span>, <br className="md:hidden" />
            {user?.full_name?.split(' ')[0] || user?.username}? 🔥
          </h1>
          <p className="text-sm text-gray-400">Your AI-curated performance hub is synchronized for today.</p>
        </motion.div>

        <div className="flex items-center gap-3">
          <Link to="/admin/diagnose" className="glass-card px-4 py-2 flex items-center gap-2 hover:bg-white/10 transition-colors border border-cyan-400/30">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Diagnosis</span>
          </Link>
          <button
            onClick={() => activePlan && setShowLiveSession(true)}
            disabled={!activePlan}
            className="premium-gradient px-6 py-3 rounded-xl flex items-center gap-2 font-black text-black text-sm shadow-xl hover:scale-105 transition-transform uppercase italic disabled:opacity-50 disabled:grayscale"
          >
            <Zap className="w-4 h-4 fill-current" />
            Start Session
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-4 md:p-6 relative overflow-hidden group border-white/5"
          >
            <div className={`absolute top-0 right-0 p-8 -mr-6 -mt-6 opacity-5 group-hover:opacity-10 transition-opacity`}>
              <stat.icon className="w-16 h-16 md:w-20 md:h-20" />
            </div>
            <div className={`${stat.bg} ${stat.color} p-2.5 md:p-3 rounded-xl w-fit mb-3 md:mb-4 border border-white/5`}>
              <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="text-2xl md:text-3xl font-black italic text-white tracking-tighter">{stat.value}</div>
            <div className="text-[9px] md:text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Active Workouts */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Active Workout</h2>
              <Link to="/workouts" className="text-cyan-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:underline">
                Manage Plans <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {!activePlan ? (
              <div className="glass-card p-12 text-center border-dashed border-white/10">
                <p className="text-sm text-gray-500 italic">No active workout plans. Let AROMI generate one for you!</p>
                <Link to="/workouts" className="inline-block mt-4 text-cyan-400 font-bold text-xs uppercase tracking-widest">Open Workouts →</Link>
              </div>
            ) : (
              <div className="glass-card p-6 group hover:border-cyan-400/20 transition-all">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden relative shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500"
                      alt="Workout"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-4 bg-cyan-400 rounded-full text-black">
                        <Play className="w-8 h-8 fill-current" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">Next Session: Strength</span>
                        <h3 className="text-2xl font-black italic mt-3">{activePlan.name}</h3>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-tighter leading-tight mt-1">{activePlan.goal}</p>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 rounded-md border border-white/10">
                        {activePlan.difficulty}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-300">
                        <Clock className="w-4 h-4 text-cyan-400" /> 45 Mins
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-300">
                        <Target className="w-4 h-4 text-cyan-400" /> {activePlan.exercises?.length || 0} Exercises
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Health Insight */}
          <section className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">AI Intelligence</h2>
            <div className="glass-card p-8 bg-gradient-to-br from-cyan-400/5 to-transparent border-cyan-400/10 relative group">
              <Sparkles className="absolute top-8 right-8 w-6 h-6 text-cyan-400 opacity-20 group-hover:opacity-100 group-hover:scale-125 transition-all" />
              <div className="flex items-start gap-6">
                <div className="p-4 bg-cyan-400 text-black rounded-2xl shadow-xl shadow-cyan-400/20">
                  <Bot className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-lg">
                  <h3 className="text-xl font-bold italic">Morning Briefing</h3>
                  <p className="text-gray-400 leading-relaxed italic">
                    "{healthTrends?.ai_analysis || "I'm currently processing your latest health assessments. Start a new session for personalized advice!"}"
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Community / Rewards Sidebar */}
        <div className="space-y-8">
          <section className="glass-card p-8 bg-gradient-to-br from-cyan-600 to-cyan-400 mb-6 text-white border-none shadow-2xl shadow-cyan-400/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16" />
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="p-3 bg-white/20 rounded-xl">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <p className="text-4xl font-black italic tracking-tighter">1,240</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Impact Tokens</p>
              </div>
            </div>
            <div className="space-y-3 relative z-10">
              <div className="flex justify-between items-end mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Weekly Milestone</span>
                <span className="text-xs font-bold">65%</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  className="bg-white h-full rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                />
              </div>
              <p className="text-[10px] font-bold italic opacity-90 pt-2 text-center underline decoration-white/30">You've unlocked ₹50 for community health!</p>
            </div>
          </section>

          <Link to="/coach" className="glass-card p-6 flex items-center justify-between group hover:border-cyan-400/50 transition-all border-dashed border-white/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-xl group-hover:bg-cyan-400 group-hover:text-black transition-all">
                <MessageCircle className="w-5 h-5 text-cyan-400 group-hover:text-black" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest">Connect with AROMI</h4>
                <p className="text-[10px] text-gray-500 font-bold italic">Instant AI Fitness Coaching</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-600 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {showLiveSession && activePlan && (
          <LiveSessionModal
            plan={{ ...activePlan, exercises: todayExercises }}
            onClose={() => setShowLiveSession(false)}
            onFinish={async (stats) => {
              console.log('Session finished:', stats);
              // Mark all today's exercises as complete
              try {
                await Promise.all(todayExercises.map((ex: any) => workoutApi.completeExercise(ex.id)));
                setShowLiveSession(false);
                // Refresh dashboard data
                window.location.reload();
              } catch (error) {
                console.error('Failed to log session', error);
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
