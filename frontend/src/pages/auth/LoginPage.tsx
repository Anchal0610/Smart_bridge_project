import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { authApi } from '../../services/api';
import {
  LogIn,
  Github,
  Mail,
  ArrowRight,
  Lock,
  User,
  UserPlus,
  Mail as MailIcon,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore(state => state.setAuth);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    full_name: ''
  });

  const handleSocialLogin = (platform: string) => {
    toast.error(`${platform} login is not available right now. Please use your credentials or create an account.`, {
      style: {
        background: '#1e293b',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)',
      },
      icon: '🚫'
    });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        const response = await authApi.login({
          username: formData.email.includes('@') ? undefined : formData.email,
          email: formData.email.includes('@') ? formData.email : undefined,
          password: formData.password
        });

        const { access_token, user } = response.data;
        setAuth(user, access_token);
        toast.success(`Welcome back, ${user.username}!`);
      } else {
        // REGISTER
        await authApi.register({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          full_name: formData.full_name
        });
        toast.success('Account created successfully! You can now login.');
        setIsLogin(true);
      }
    } catch (error: any) {
      const detail = error.response?.data?.detail || 'Authentication failed';
      toast.error(detail);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/login_bg.png"
          alt="Login Background"
          className="w-full h-full object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/20 via-[#0f172a]/80 to-[#0f172a]" />
      </div>

      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10 px-4"
      >
        <div className="glass-card p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 premium-gradient" />

          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-full hover:bg-white/5 text-gray-400 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-white">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">ArogyaMitra Portal</p>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <User className="w-3 h-3 text-cyan-400" /> Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <UserPlus className="w-3 h-3 text-cyan-400" /> Username
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="johndoe123"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <MailIcon className="w-3 h-3 text-cyan-400" /> {isLogin ? 'Email or Username' : 'Email Address'}
              </label>
              <input
                type={isLogin ? "text" : "email"}
                required
                placeholder={isLogin ? "user@example.com" : "john@example.com"}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3 h-3 text-cyan-400" /> Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                <label className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors">
                  <input type="checkbox" className="rounded border-white/10 bg-white/5" /> Remember me
                </label>
                <a href="#" className="hover:text-cyan-400 transition-colors">Forgot password?</a>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 premium-gradient rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>{isLogin ? 'Sign In' : 'Join Now'} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <span className="relative px-4 bg-[#0f172a] text-[10px] text-gray-500 uppercase tracking-widest font-bold">Or continue with</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium"
              >
                <Mail className="w-4 h-4 text-red-400" /> Google
              </button>
              <button
                onClick={() => handleSocialLogin('GitHub')}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium"
              >
                <Github className="w-4 h-4 text-gray-400" /> GitHub
              </button>
            </div>
          </div>

          <p className="text-center mt-10 text-sm text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan-400 font-bold hover:underline ml-2"
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
