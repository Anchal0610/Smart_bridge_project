import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Search, Flame, Target, Loader2, Plus, X, PieChart, Info, Calendar, Zap } from 'lucide-react';
import { nutritionApi } from '../../services/api';

const NutritionPlans = () => {
  const [targets, setTargets] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logModal, setLogModal] = useState<any>(null);

  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    try {
      const response = await nutritionApi.getTargets();
      setTargets(response.data);
    } catch (error) {
      console.error('Failed to fetch targets', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setSearching(true);
    try {
      const response = await nutritionApi.searchRecipes(searchQuery);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 pt-14 md:pt-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter">NUTRITION <span className="text-cyan-400">HUB</span></h1>
          <p className="text-sm text-gray-400 mt-1">Smart calorie tracking and recipe discovery.</p>
        </div>
        <div className="flex gap-4">
          <button className="glass-card px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-colors">
            <Calendar className="w-4 h-4 text-cyan-400" />
            Sync to Calendar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-gray-500 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
          <p>Analyzing your nutrition needs...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Tracker */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 blur-3xl rounded-full -mr-32 -mt-32" />

              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-cyan-400 text-black rounded-xl">
                    <PieChart className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold">Daily Macro Targets</h2>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-3xl font-black italic text-cyan-400">{targets?.daily_calories}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Kcal Limit</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: 'Protein', value: targets?.protein_grams, color: 'bg-cyan-400', unit: 'g' },
                  { label: 'Carbs', value: targets?.carbs_grams, color: 'bg-yellow-400', unit: 'g' },
                  { label: 'Fats', value: targets?.fats_grams, color: 'bg-red-400', unit: 'g' },
                ].map((macro) => (
                  <div key={macro.label} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-500">{macro.label}</span>
                      <span className="text-lg font-bold">{macro.value}{macro.unit}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '80%' }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full ${macro.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Food Search */}
            <div className="space-y-6">
              <form onSubmit={handleSearch} className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for food or recipes... (e.g. 'Avocado Toast')"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all"
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 premium-gradient text-black text-xs font-black rounded-lg disabled:opacity-50"
                >
                  {searching ? 'SEARCHING...' : 'FIND'}
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {searchResults.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="glass-card group flex items-center gap-4 p-4 border-white/5 hover:border-cyan-400/20 transition-all cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold truncate pr-4">{item.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-red-500" /> {Math.round(item.nutrition?.nutrients[0].amount || 0)} Kcal</span>
                          <span className="flex items-center gap-1 text-cyan-400"><Info className="w-3 h-3" /> Details</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setLogModal(item)}
                        className="p-2 bg-white/5 rounded-lg hover:bg-cyan-400 hover:text-black transition-all"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="glass-card p-6 border-cyan-400/20 bg-cyan-400/[0.02]">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4 italic">
                <Target className="w-5 h-5 text-cyan-400" />
                AI Health Insight
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                "Based on your recent <strong>Leg Day</strong>, I've increased your protein target by <span className="text-white">15g</span> today to support muscle recovery. Try to prioritize lean sources like chicken or lentils."
              </p>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full p-4 rounded-xl border border-white/5 bg-white/5 text-left text-sm font-bold flex items-center justify-between group hover:border-cyan-400/30 transition-all">
                  <span>Log Water Intake</span>
                  <Plus className="w-4 h-4 text-cyan-400 group-hover:scale-125 transition-transform" />
                </button>
                <button className="w-full p-4 rounded-xl border border-white/5 bg-white/5 text-left text-sm font-bold flex items-center justify-between group hover:border-cyan-400/30 transition-all">
                  <span>Scan Meal Label</span>
                  <Zap className="w-4 h-4 text-cyan-400 group-hover:scale-125 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Modal (Simplified) */}
      <AnimatePresence>
        {logModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLogModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative glass-card max-w-md w-full p-8 text-center space-y-6"
            >
              <div className="w-20 h-20 premium-gradient rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-cyan-400/20">
                <Utensils className="w-10 h-10 text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-black italic">Log {logModal.title}?</h2>
                <p className="text-gray-500 mt-2">This will add the nutritional value to your daily progress tracking.</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setLogModal(null)} className="flex-1 py-4 rounded-2xl border border-white/10 font-bold hover:bg-white/5">Cancel</button>
                <button onClick={() => setLogModal(null)} className="flex-1 py-4 rounded-2xl premium-gradient text-black font-black">LOG MEAL</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NutritionPlans;
