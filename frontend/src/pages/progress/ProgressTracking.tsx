import React from 'react';

const ProgressTracking = () => (
  <div className="glass-card p-8">
    <h1 className="text-2xl font-bold mb-4">Progress Analytics</h1>
    <p className="text-gray-400">Visualize your journey through calories burned, streaks, and weight trends.</p>
    <div className="mt-8 min-h-[300px] flex items-center justify-center bg-white/5 rounded-2xl">
      <span className="text-gray-500 italic">Progress Charts Loading...</span>
    </div>
  </div>
);

export default ProgressTracking;
