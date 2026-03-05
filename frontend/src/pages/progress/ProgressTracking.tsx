import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Target,
  Calendar,
  Award,
  Flame,
  Activity,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';

const ProgressTracking = () => {
  const stats = [
    { label: 'Total Weight Loss', value: '4.2 kg', trend: '+0.5 this week', icon: Target, color: 'text-cyan-400' },
    { label: 'Avg Calories Burned', value: '450', trend: 'Consistent', icon: Flame, color: 'text-orange-400' },
    { label: 'Workout Streak', value: '12 Days', trend: 'Personal Best!', icon: Activity, color: 'text-green-400' },
    { label: 'Health Score', value: '82', trend: '+5 pts', icon: Award, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Progress Analytics</h1>
          <p className="text-gray-400 mt-1">Your journey tracked with precision. You've completed 85% of your monthly goal.</p>
        </div>
        <button className="premium-gradient px-6 py-2.5 rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all">
          Share Milestone
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className={`text-[10px] font-medium flex items-center gap-1 ${stat.trend.includes('+') ? 'text-green-400' : 'text-gray-400'}`}>
              <TrendingUp className="w-3 h-3" /> {stat.trend}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-2 space-y-6">
          <section className="glass-card p-8 min-h-[400px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold">Activity Growth</h3>
              <div className="flex gap-2">
                {['Week', 'Month', 'Year'].map(t => (
                  <button key={t} className={`px-3 py-1 rounded-lg text-xs font-medium ${t === 'Week' ? 'bg-cyan-400 text-black' : 'bg-white/5 text-gray-400'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex items-end justify-between gap-2 px-4">
              {[40, 65, 45, 90, 75, 55, 85].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.1 + 0.5, duration: 1 }}
                  className="w-full bg-gradient-to-t from-cyan-400/20 to-cyan-400 rounded-t-lg relative group"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-[10px] px-2 py-1 rounded font-bold">
                    {h}%
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-between mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest px-2">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </section>
        </div>

        {/* Milestones & Badges */}
        <div className="space-y-6">
          <section className="glass-card p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Recent Achievements
            </h3>
            <div className="space-y-4">
              {[
                { title: 'Morning Warrior', date: 'Yesterday', desc: 'Completed 5 workouts before 8 AM' },
                { title: 'Protein Pro', date: '3 days ago', desc: 'Hit your protein goal 7 days straight' },
                { title: 'Social Impact', date: '1 week ago', desc: 'Contributed ₹500 to health fund' }
              ].map((m, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-cyan-400/50 transition-colors">
                    <Award className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{m.title}</div>
                    <div className="text-[10px] text-gray-500">{m.date} • {m.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card p-6 bg-cyan-400/5 border-cyan-400/20 relative overflow-hidden group">
            <ArrowUpRight className="absolute top-4 right-4 w-12 h-12 text-cyan-400/10 group-hover:text-cyan-400/20 transition-colors" />
            <h3 className="font-bold mb-2">Next Goal</h3>
            <p className="text-xs text-gray-400 mb-4 font-medium uppercase tracking-tight italic">Lose 0.8kg to reach your target!</p>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full w-[80%]" />
            </div>
            <button className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 mt-4 uppercase hover:underline">
              Goal Details <ChevronRight className="w-3 h-3" />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracking;
