import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Zap, Target, Flame, Dumbbell } from 'lucide-react';

const workouts = [
  {
    id: 1,
    title: 'Morning Mobility',
    duration: '15 min',
    intensity: 'Low',
    calories: '80',
    category: 'Stretching',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500',
  },
  {
    id: 2,
    title: 'HIIT Power Blast',
    duration: '30 min',
    intensity: 'High',
    calories: '350',
    category: 'Cardio',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500',
  },
  {
    id: 3,
    title: 'Core Strengthening',
    duration: '20 min',
    intensity: 'Medium',
    calories: '120',
    category: 'Strength',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
  },
  {
    id: 4,
    title: 'Upper Body Sculpt',
    duration: '45 min',
    intensity: 'High',
    calories: '400',
    category: 'Strength',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef03a74e7f?w=500',
  }
];

const WorkoutPlans = () => (
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Workout Routines</h1>
        <p className="text-gray-400 mt-1">Personalized sessions for your {new Date().toLocaleDateString('en-US', { weekday: 'long' })} goal.</p>
      </div>
      <div className="flex gap-2">
        {['All', 'Strength', 'Cardio', 'Yoga'].map(cat => (
          <button key={cat} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors">
            {cat}
          </button>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {workouts.map((workout, idx) => (
        <motion.div
          key={workout.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="glass-card overflow-hidden group hover:scale-[1.02] transition-all duration-300"
        >
          <div className="h-48 relative overflow-hidden">
            <img
              src={workout.image}
              alt={workout.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-4 bg-cyan-400 rounded-full text-black shadow-xl scale-90 group-hover:scale-100 transition-transform">
                <Play className="w-6 h-6 fill-current" />
              </button>
            </div>
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
              {workout.category}
            </div>
          </div>
          <div className="p-5 space-y-4">
            <h3 className="text-lg font-bold group-hover:text-cyan-400 transition-colors">{workout.title}</h3>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {workout.duration}
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> {workout.intensity}
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> {workout.calories} kcal
              </div>
            </div>
            <button className="w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-medium transition-colors">
              Session Details
            </button>
          </div>
        </motion.div>
      ))}
    </div>

    {/* AI Generator Section */}
    <div className="glass-card p-8 flex flex-col md:flex-row items-center gap-8 border-cyan-400/20">
      <div className="p-6 bg-cyan-400/10 rounded-2xl">
        <Dumbbell className="w-12 h-12 text-cyan-400" />
      </div>
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-2xl font-bold italic">Need a custom plan?</h2>
        <p className="text-gray-400 mt-2">AROMI can generate a unique 7-day routine based on your equipment and current energy levels.</p>
      </div>
      <button className="premium-gradient px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all">
        Generate AI Plan
      </button>
    </div>
  </div>
);

export default WorkoutPlans;
