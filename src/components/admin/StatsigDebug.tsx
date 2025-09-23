import React from 'react';

const StatsigDebug: React.FC = () => {
    return (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <h3 className="text-yellow-400 font-semibold mb-2">Statsig Debug</h3>
            <p className="text-yellow-300 text-sm">
                Service Statsig non configuré. Les fonctionnalités d'analytics sont désactivées.
            </p>
        </div>
    );
};

export default StatsigDebug;
