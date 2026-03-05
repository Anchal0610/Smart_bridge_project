import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  Utensils,
  HeartPulse,
  BarChart3,
  ShieldCheck,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const logout = useAuthStore(state => state.logout);
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { title: 'Workouts', icon: Zap, path: '/workouts' },
    { title: 'Nutrition', icon: Utensils, path: '/nutrition' },
    { title: 'Health Assessment', icon: HeartPulse, path: '/health' },
    { title: 'Progress', icon: BarChart3, path: '/progress' },
    { title: 'Diagnosis', icon: ShieldCheck, path: '/admin/diagnose' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center">
          <Zap className="w-6 h-6 text-black" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          ArogyaMitra
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
              ${isActive
                ? 'premium-gradient text-black font-bold shadow-lg shadow-cyan-500/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'}
            `}
          >
            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="text-sm">{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <button
          onClick={logout}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <div className="fixed top-4 left-4 z-[60] md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 glass-card border-white/10 rounded-xl text-cyan-400 shadow-2xl shadow-cyan-400/20"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 glass-card border-y-0 border-l-0 rounded-none z-50 hidden md:flex flex-col p-6 overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[55] md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-72 glass-card border-y-0 border-l-0 rounded-none z-[56] md:hidden flex flex-col p-8 pt-20 overflow-y-auto"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
