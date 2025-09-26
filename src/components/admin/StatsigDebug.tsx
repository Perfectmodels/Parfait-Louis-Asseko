import React from 'react';

interface StatsigDebugProps {
  className?: string;
}

const StatsigDebug: React.FC<StatsigDebugProps> = ({ className = '' }) => {
  return (
    <div className={`bg-black/50 border border-pm-gold/20 rounded-xl p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-pm-gold mb-4">Statsig Debug</h3>
      <div className="text-pm-off-white/70 text-sm">
        <p>Configuration Statsig en cours de développement...</p>
      </div>
    </div>
  );
};

export default StatsigDebug;
