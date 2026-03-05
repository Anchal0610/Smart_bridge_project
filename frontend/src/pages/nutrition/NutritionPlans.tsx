import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Zap, Clock, TrendingUp, Info, ChevronRight, Apple } from 'lucide-react';

const meals = [
  {
    type: 'Breakfast',
    time: '08:00 AM',
    name: 'Avocado Toast with Poached Eggs',
    macros: { p: '18g', c: '25g', f: '22g' },
    calories: '380',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500'
  },
  {
    type: 'Lunch',
    time: '01:30 PM',
    name: 'Grilled Salmon with Quinoa Bowl',
    macros: { p: '35g', c: '40g', f: '15g' },
    calories: '520',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500'
  }
];

const NutritionPlans = () => (
  <div className="max-w-6xl mx-auto space-y-8">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Nutrition & Meals</h1>
        <p className="text-gray-400 mt-1">Fuel your body with science-backed nutrition.</p>
      </div>
      <div className="p-4 glass-card flex items-center gap-6">
        <div className="text-center">
          <div className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Remaining</div>
          <div className="text-xl font-bold text-cyan-400">1,420</div>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div className="flex gap-4">
          {['P', 'C', 'F'].map(m => (
            <div key={m} className="text-center">
              <div className="text-[10px] text-gray-500 font-bold">{m}</div>
              <div className="text-sm font-bold">--</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Today's Timeline */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-400" />
          Today's Timeline
        </h2>
        <div className="space-y-4">
          {meals.map((meal, idx) => (
            <motion.div
              key={meal.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-4 flex gap-6 group hover:bg-white/10 transition-colors"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">{meal.type} • {meal.time}</span>
                  <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
                    <Info className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <h3 className="font-bold mb-2">{meal.name}</h3>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>P: {meal.macros.p}</span>
                  <span>C: {meal.macros.c}</span>
                  <span>F: {meal.macros.f}</span>
                  <span className="text-white font-bold">{meal.calories} kcal</span>
                </div>
              </div>
            </motion.div>
          ))}
          <button className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-gray-500 hover:border-white/10 hover:text-gray-400 transition-all text-sm font-medium">
            + Add Snack or Meal
          </button>
        </div>
      </div>

      {/* Insights & AI Generator */}
      <div className="space-y-8">
        <section className="glass-card p-6 border-accent/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-accent/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-bold">Macronutrient Split</h3>
              <p className="text-xs text-gray-500 italic">Target: 40% Protein, 30% Carbs, 30% Fat</p>
            </div>
          </div>
          <div className="flex h-4 rounded-full overflow-hidden bg-white/5 mb-6">
            <div className="bg-cyan-400 w-[30%]" />
            <div className="bg-orange-400 w-[45%]" />
            <div className="bg-purple-400 w-[25%]" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-cyan-400" /> Protein
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-orange-400" /> Carbs
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-purple-400" /> Fat
            </div>
          </div>
        </section>

        <section className="glass-card p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold">Meal Generator</h3>
          </div>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Short on ingredients? Tell AROMI what's in your fridge, and I'll generate
            a meal plan that fits your macros perfectly.
          </p>
          <button className="w-full glass-card py-3 flex items-center justify-center gap-2 font-bold hover:bg-white/10 transition-colors">
            Ask AROMI for a recipe <ChevronRight className="w-4 h-4" />
          </button>
        </section>
      </div>
    </div>
  </div>
);

export default NutritionPlans;
