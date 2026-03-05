import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
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
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { userApi } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Dashboard = () => {
  const user = useAuthStore(state => state.user);

  const stats = [
    { label: 'Workouts', value: '12', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Calories', value: '4,250', icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'Streak', value: '5 Days', icon: Sparkles, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { label: 'Health Score', value: '88/100', icon: Heart, color: 'text-red-400', bg: 'bg-red-400/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold text-white">Welcome back, {user?.full_name || user?.username}! ✨</h1>
          <p className="text-gray-400 mt-1">Consistency is key. You're 85% through your weekly goal.</p>
        </motion.div>

        <div className="flex items-center gap-3">
          <Link to="/admin/diagnose" className="glass-card px-4 py-2 flex items-center gap-2 hover:bg-white/10 transition-colors border border-cyan-400/30">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium">System Diagnosis</span>
          </Link>
          <Link to="/health" className="glass-card px-4 py-2 flex items-center gap-2 hover:bg-white/10 transition-colors">
            <ClipboardList className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium">New Assessment</span>
          </Link>
          <button className="premium-gradient px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-lg hover:scale-105 transition-transform">
            <Plus className="w-4 h-4" />
            <span>Log Workout</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-4 relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 p-6 -mr-4 -mt-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
              <stat.icon className="w-16 h-16" />
            </div>
            <div className={`${stat.bg} ${stat.color} p-2 rounded-lg w-fit mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Plan */}
          <section className="glass-card p-6 overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                Active Workout Plan
              </h2>
              <Link to="/workouts" className="text-cyan-400 text-sm font-medium flex items-center gap-1 hover:underline">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-6 p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden relative group">
                <img
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300"
                  alt="Workout"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">Current: Day 4</span>
                <h3 className="text-lg font-bold">Strength & HIIT Fusion</h3>
                <p className="text-sm text-gray-400">Targeting Upper Body and Core. Includes 6 high-intensity exercises.</p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-300">
                    <Clock className="w-3.5 h-3.5" /> 45 Mins
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-300">
                    <Zap className="w-3.5 h-3.5" /> High Intensity
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Progress Chart Placeholder */}
          <section className="glass-card p-6 min-h-[300px] flex flex-col justify-center items-center text-center space-y-4">
            <div className="p-4 bg-white/5 rounded-full">
              <TrendingUp className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Progress Visualization</h3>
              <p className="text-gray-400 max-w-sm">Detailed charts and analytics are currently being generated based on your activity. Keep working hard!</p>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <section className="glass-card p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-400" />
              AI Coach Tips
            </h2>
            <div className="space-y-4">
              {[
                "Try to get at least 20g of protein in your next meal.",
                "Your morning mobility session is coming up in 30 minutes.",
                "Looking good! You've beat your step count 3 days in a row."
              ].map((tip, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 text-sm leading-relaxed">
                  {tip}
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" />
              Community Impact
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold">₹1,240</div>
                  <div className="text-xs text-gray-400 uppercase">Donated to charity</div>
                </div>
                <div className="text-xs font-bold text-green-400">+ ₹50 Today</div>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5">
                <div className="bg-green-400 h-1.5 rounded-full w-[65%]" />
              </div>
              <p className="text-[10px] text-gray-500">Every workout session contributes to our community health fund.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
