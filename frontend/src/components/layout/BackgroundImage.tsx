import React from 'react';

const BackgroundImage = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-purple-600/5 blur-[100px]" />
      <div className="absolute inset-0 bg-[#0f172a]/50" />
    </div>
  );
};

export default BackgroundImage;
