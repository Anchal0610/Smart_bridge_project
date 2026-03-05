import React from 'react';
import { motion } from 'framer-motion';
import {
  Dumbbell,
  Utensils,
  Activity,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Workouts', path: '/workouts', icon: Dumbbell },
    { name: 'Nutrition', path: '/nutrition', icon: Utensils },
    { name: 'Health', path: '/health', icon: Heart },
    { name: 'Progress', path: '/progress', icon: Sparkles },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card px-6 py-3 flex items-center justify-between">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <div className="p-2 premium-gradient rounded-lg group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Arogya<span className="text-cyan-400">Mitra</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? 'bg-white/10 text-cyan-400'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              ))
            ) : (
              <Link
                to="/"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  location.pathname === '/'
                    ? 'bg-white/10 text-cyan-400'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Home</span>
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-semibold">{user?.health_tokens || 0} Tokens</span>
                </div>

                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <User className="w-5 h-5 text-gray-300" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-500/10 rounded-full transition-colors text-red-400"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 premium-gradient text-black font-bold rounded-xl hover:scale-105 transition-transform"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-2 glass-card overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-2">
              {user ? (
                navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      location.pathname === item.path
                        ? 'bg-white/10 text-cyan-400'
                        : 'text-gray-300'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                ))
              ) : (
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    location.pathname === '/'
                      ? 'bg-white/10 text-cyan-400'
                      : 'text-gray-300'
                  }`}
                >
                  <Activity className="w-5 h-5" />
                  <span>Home</span>
                </Link>
              )}
              <hr className="border-white/10 my-2" />
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-3 text-red-400"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 text-cyan-400 font-bold"
                >
                  <User className="w-5 h-5" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
