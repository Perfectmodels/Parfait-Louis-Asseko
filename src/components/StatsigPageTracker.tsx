import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStatsig } from '../hooks/useStatsig';

interface StatsigPageTrackerProps {
    children: React.ReactNode;
}

const StatsigPageTracker: React.FC<StatsigPageTrackerProps> = ({ children }) => {
    const location = useLocation();
    const { logPageView, isReady } = useStatsig();

    useEffect(() => {
        if (isReady) {
            // Logger la page view avec des métadonnées
            logPageView(location.pathname, {
                pathname: location.pathname,
                search: location.search,
                hash: location.hash,
                timestamp: new Date().toISOString()
            });
        }
    }, [location, logPageView, isReady]);

    return <>{children}</>;
};

export default StatsigPageTracker;
