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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { title: 'Workouts', icon: Zap, path: '/workouts' },
    { title: 'Nutrition', icon: Utensils, path: '/nutrition' },
    { title: 'Health Assessment', icon: HeartPulse, path: '/health' },
    { title: 'Progress', icon: BarChart3, path: '/progress' },
    { title: 'Diagnosis', icon: ShieldCheck, path: '/admin/diagnose' },
  ];

  const sidebarContent = (isMobile = false) => (
    <div className={`flex flex-col h-full ${!isMobile ? 'items-center' : ''}`}>
      <div className={`flex items-center gap-3 ${!isMobile ? 'mb-10' : 'mb-12'}`}>
        <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Zap className="w-6 h-6 text-black" />
        </div>
        {isMobile && (
          <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent uppercase tracking-tighter">
            ArogyaMitra
          </span>
        )}
      </div>

      <nav className={`flex-1 space-y-4 ${!isMobile ? 'w-full px-2' : ''}`}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsOpen(false)}
            title={item.title}
            className={({ isActive }) => `
              flex items-center rounded-xl transition-all duration-300 group relative
              ${isMobile ? 'gap-4 px-4 py-3' : 'justify-center p-3'}
              ${isActive
                ? 'premium-gradient text-black font-bold shadow-lg shadow-cyan-500/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'}
            `}
          >
            <item.icon className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} transition-transform group-hover:scale-110`} />
            {isMobile && <span className="text-sm font-bold uppercase tracking-widest">{item.title}</span>}
            {!isMobile && (
              <div className="absolute left-full ml-4 px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                {item.title}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className={`mt-auto pt-6 border-t border-white/5 ${!isMobile ? 'w-full px-2' : ''}`}>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          title="Logout"
          className={`
            flex items-center rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group
            ${isMobile ? 'gap-4 px-4 py-3 w-full' : 'justify-center p-3 w-full'}
          `}
        >
          <LogOut className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} transition-transform group-hover:translate-x-1`} />
          {isMobile && <span className="text-sm font-black uppercase tracking-widest">Log out</span>}
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

      {/* Desktop Icon Strip Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-20 glass-card border-y-0 border-l-0 rounded-none z-50 hidden md:flex flex-col py-8 overflow-visible">
        {sidebarContent(false)}
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
              {sidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative glass-card max-w-sm w-full p-8 text-center space-y-6 border-red-500/20"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20">
                <LogOut className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Confirm Logout</h3>
                <p className="text-gray-400 text-sm mt-2">Are you sure you want to end your current fitness session?</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={logout}
                  className="flex-1 py-3 bg-red-600 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-red-600/20 hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
