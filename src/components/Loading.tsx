import React from 'react';

const Loading: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-pm-dark">
    <img 
      src="/logo.svg" 
      alt="PMM" 
      className="w-24 h-24 animate-pulse"
    />
  </div>
);

export default Loading;
