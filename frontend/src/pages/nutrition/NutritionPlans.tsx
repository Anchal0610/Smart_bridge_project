import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Search, Flame, Target, Loader2, Plus, X, PieChart, Info, Calendar, Zap, CheckCircle2, Clock } from 'lucide-react';
import { nutritionApi } from '../../services/api';

const NutritionPlans = () => {
  const [activePlan, setActivePlan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [logModal, setLogModal] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchNutritionPlan();
  }, []);

  const fetchNutritionPlan = async () => {
    try {
      const response = await nutritionApi.getCurrentPlan();
      setActivePlan(response.data);
    } catch (error) {
      console.log('No nutrition plan found');
      setActivePlan([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkEaten = async (mealId: number) => {
    try {
      await nutritionApi.markMealEaten(mealId);
      fetchNutritionPlan();
    } catch (error) {
      console.error('Failed to mark meal eaten', error);
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
          <p>Analyzing your 30-day nutrition needs...</p>
        </div>
      ) : activePlan.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-4">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-cyan-500/10">
            <Utensils className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold">No 30-Day Plan Yet</h3>
          <p className="text-gray-500 max-w-xs mx-auto">Generate your workout plan first to receive a synchronized nutrition schedule.</p>
          <button
            onClick={() => window.location.href = '/workouts'}
            className="text-cyan-400 font-bold hover:underline flex items-center gap-2 mx-auto mt-4"
          >
            Start on Workouts →
          </button>
        </div>
      ) : (
        <div className="space-y-8">
           {/* 30-Day Agenda View */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {activePlan.slice(0, 9).map((meal: any) => (
               <motion.div
                 key={meal.id}
                 className={`glass-card p-6 border-white/5 relative overflow-hidden group hover:border-cyan-400/30 transition-all ${meal.is_eaten ? 'opacity-50' : ''}`}
               >
                 <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">{meal.meal_type}</span>
                      <h4 className="text-lg font-bold mt-1 line-clamp-1">{meal.food_name}</h4>
                    </div>
                    {meal.is_eaten ? (
                      <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : (
                      <button
                        onClick={() => handleMarkEaten(meal.id)}
                        className="p-2 bg-white/5 text-gray-500 hover:text-cyan-400 rounded-lg transition-colors"
                      >
                        <Zap className="w-4 h-4" />
                      </button>
                    )}
                 </div>

                 <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-4">
                    <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-red-500" /> {meal.calories} KCAL</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(meal.scheduled_date).toLocaleDateString()}</span>
                 </div>

                 <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-white/5 rounded-lg text-center">
                      <p className="text-[8px] text-gray-500 uppercase">P</p>
                      <p className="text-xs font-bold">{meal.protein}g</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg text-center">
                      <p className="text-[8px] text-gray-500 uppercase">C</p>
                      <p className="text-xs font-bold">{meal.carbs}g</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg text-center">
                      <p className="text-[8px] text-gray-500 uppercase">F</p>
                      <p className="text-xs font-bold">{meal.fats}g</p>
                    </div>
                 </div>
               </motion.div>
             ))}
           </div>

           <div className="flex justify-center">
              <button className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                View All Month Meals →
              </button>
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
