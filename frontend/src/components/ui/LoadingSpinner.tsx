import React from 'react';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="relative w-12 h-12">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-cyan-400/20 rounded-full" />
      <div className="absolute top-0 left-0 w-full h-full border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
    </div>
  </div>
);

export default LoadingSpinner;
