import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, Scale, Activity, Zap, TrendingUp, Loader2, Info, ChevronRight, CheckCircle2, Target } from 'lucide-react';
import { healthApi } from '../../services/api';

const HealthAssessment = () => {
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    weight: 70,
    height: 175,
    energy_level: 7,
    sleep_hours: 8,
    notes: ''
  });

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const response = await healthApi.getTrends();
      setTrends(response.data);
    } catch (error) {
      console.error('Failed to fetch trends', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await healthApi.submitAssessment(formData);
      setSuccess(true);
      fetchTrends();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Submission failed', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 pt-14 md:pt-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter">HEALTH <span className="text-cyan-400">ASSESSMENT</span></h1>
          <p className="text-sm text-gray-400 mt-1">Track your vitals and discover AI-driven health trends.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assessment Form */}
        <div className="glass-card p-8 space-y-8 border-cyan-400/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-400 text-black rounded-xl">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold italic">New Daily Log</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Weight (kg)</label>
                <div className="relative">
                  <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Height (cm)</label>
                <div className="relative">
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: parseFloat(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Energy Level</label>
                <span className="text-sm font-bold text-cyan-400">{formData.energy_level}/10</span>
              </div>
              <input
                type="range" min="1" max="10"
                value={formData.energy_level}
                onChange={(e) => setFormData({...formData, energy_level: parseInt(e.target.value)})}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Sleep (Hours)</label>
              <div className="relative">
                <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="number"
                  step="0.5"
                  value={formData.sleep_hours}
                  onChange={(e) => setFormData({...formData, sleep_hours: parseFloat(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Daily Notes</label>
              <textarea
                placeholder="How are you feeling today?"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 h-24 focus:outline-none focus:border-cyan-400 transition-colors resize-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full premium-gradient p-4 rounded-2xl text-black font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <ChevronRight className="w-5 h-5" />
                  SUBMIT ASSESSMENT
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Trends Sidebar */}
        <div className="space-y-8">
          <div className="glass-card p-8 border-cyan-400/20 bg-cyan-400/[0.02]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-cyan-400/10 text-cyan-400 rounded-xl border border-cyan-400/20">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold italic">AI Health Trends</h2>
            </div>

            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center gap-4 text-gray-600 animate-pulse text-center">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-xs font-bold uppercase tracking-widest">Aromi is analyzing your data...</p>
              </div>
            ) : trends?.status === 'no_data' ? (
              <div className="p-12 text-center space-y-4">
                <Info className="w-10 h-10 text-gray-700 mx-auto" />
                <p className="text-sm text-gray-400">{trends.message}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 relative group">
                  <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <Zap className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-2">Trend Summary</h4>
                  <p className="text-sm italic leading-relaxed text-gray-300">
                    "{trends?.ai_analysis}"
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">History Records</h4>
                  <div className="space-y-3">
                    {trends?.history?.map((record: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5">
                        <div>
                          <p className="text-xs font-bold">{new Date(record.date).toLocaleDateString()}</p>
                          <p className="text-[10px] text-gray-500 uppercase font-black">{record.weight}kg • Energy: {record.energy}/10</p>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-cyan-400/50" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="glass-card p-8 bg-gradient-to-br from-red-500/10 to-transparent border-red-500/10">
            <h3 className="text-sm font-black uppercase tracking-widest text-red-400 mb-2">Priority Advice</h3>
            <p className="text-sm text-gray-400">
              Your energy levels seem consistent, but don't forget that consistent sleep (7-8h) is the fuel for your muscle growth goals.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-12 right-12 z-[100] bg-cyan-400 text-black px-8 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-6 h-6" />
            ASSESSMENT LOGGED!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HealthAssessment;
