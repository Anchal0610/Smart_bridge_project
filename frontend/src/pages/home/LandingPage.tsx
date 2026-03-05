import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Zap,
  Shield,
  Cpu,
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles,
  Heart,
  X
} from 'lucide-react';

const LandingPage = () => {
  const [showPromo, setShowPromo] = useState(false);

  return (
    <div className="relative overflow-hidden pt-20">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center lg:text-left">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 pb-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-medium mx-auto lg:mx-0">
              <Sparkles className="w-4 h-4" />
              <span>The Future of Personal Fitness is Here</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
              Meet AROMI.<br />
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI Personal Coach.</span>
            </h1>

            <p className="text-lg text-gray-400 max-w-lg leading-relaxed mx-auto lg:mx-0">
              ArogyaMitra combines deep health analytics with generative AI to create workout routines and nutrition plans as unique as your DNA.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 premium-gradient rounded-2xl font-bold text-lg shadow-lg hover:scale-105 transition-transform"
              >
                Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <button
                onClick={() => setShowPromo(true)}
                className="inline-flex items-center justify-center px-8 py-4 glass-card rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors group"
              >
                <div className="p-1 rounded-full bg-white/10 group-hover:bg-cyan-400/20 mr-3 transition-colors">
                  <Play className="w-5 h-5 fill-cyan-400 text-cyan-400" />
                </div>
                Watch Promo
              </button>
            </div>

            <div className="flex items-center gap-8 pt-4 justify-center lg:justify-start">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.2, zIndex: 10 }}
                    className="w-12 h-12 rounded-full border-2 border-[#0f172a] overflow-hidden bg-slate-800"
                  >
                    <img
                      src={`/assets/users/user${i}.png`}
                      alt={`User ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                   {[1,2,3,4,5].map(s => <Sparkles key={s} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-sm text-gray-500">
                  <span className="text-white font-bold">10k+</span> users already joined
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-cyan-500/20 blur-[120px] rounded-full animate-pulse" />
            <div className="glass-card p-2 relative group overflow-hidden">
              <img
                src="/assets/hero.png"
                alt="AROMI AI Coach"
                className="rounded-xl w-full h-auto shadow-2xl transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-left">
                    <p className="text-cyan-400 font-bold uppercase tracking-wider text-xs mb-1">Live Analytics</p>
                    <h4 className="text-white font-bold text-xl">Real-time Form Correction</h4>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Promo Modal */}
      <AnimatePresence>
        {showPromo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video glass-card overflow-hidden"
            >
              <button
                onClick={() => setShowPromo(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-full h-full flex items-center justify-center bg-[#0a0f1d] group cursor-pointer relative">
                <div className="absolute inset-0 overflow-hidden opacity-30">
                    <img src="/assets/hero.png" alt="Promo Placeholder" className="w-full h-full object-cover blur-sm" />
                </div>
                <div className="relative text-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <Play className="w-10 h-10 fill-cyan-400 text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Watch AROMI in Action</h3>
                        <p className="text-gray-400">Experience the future of fitness technology</p>
                    </div>
                    <div className="pt-4 flex gap-4 justify-center">
                        <span className="px-3 py-1 rounded bg-white/5 text-[10px] uppercase font-bold tracking-widest">4K Cinematic</span>
                        <span className="px-3 py-1 rounded bg-white/5 text-[10px] uppercase font-bold tracking-widest">Dolby Atmos</span>
                    </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">Powered by Intelligence</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to transform your health, packed into one beautiful interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'AI Workout Generator',
              desc: 'Custom routines generated in seconds based on your equipment and goals.',
              icon: Zap,
              color: 'text-yellow-400'
            },
            {
              title: 'Nutrition Timeline',
              desc: 'Log meals and get real-time macro adjustments from AROMI.',
              icon: Cpu,
              color: 'text-purple-400'
            },
            {
              title: 'Progress Shield',
              desc: 'Encrypted tracking of your weight, calories, and health streaks.',
              icon: Shield,
              color: 'text-cyan-400'
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="glass-card p-8 border-transparent hover:border-white/10 transition-all group"
            >
              <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-6 ${feature.color} group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="bg-white/5 py-24 mb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
            <div className="max-w-4xl glass-card p-4 relative group">
                <img
                    src="/assets/dashboard_preview.png"
                    alt="Dashboard Preview"
                    className="rounded-xl w-full shadow-2xl border border-white/5 transition-transform group-hover:scale-[1.01]"
                />
                <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
            </div>
            <div className="mt-12 text-center space-y-6">
                <h3 className="text-3xl font-bold">Sleek. Modern. Effective.</h3>
                <p className="text-gray-400 max-w-lg mx-auto italic">"The most intuitive fitness app I've ever used. It feels like the app actually knows me. AROMI is a game changer."</p>
                <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-gray-300">Trusted by 500+ trainers worldwide</span>
                </div>
            </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold">Ready to meet your new self?</h2>
        <p className="text-xl text-gray-400 text-center">Join the thousands of users who have transformed their lives with ArogyaMitra.</p>
        <Link
            to="/login"
            className="inline-flex px-12 py-5 premium-gradient rounded-full font-extrabold text-xl shadow-[0_10px_30px_rgba(6,182,212,0.4)] hover:scale-110 active:scale-95 transition-all text-black"
        >
            Get Started for Free
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
