import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useStatsig } from '../hooks/useStatsig';

interface StatsigPageTrackerProps {
    children: React.ReactNode;
}

const StatsigPageTracker: React.FC<StatsigPageTrackerProps> = ({ children }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { logPageView, isReady } = useStatsig();

    useEffect(() => {
        if (isReady) {
            const search = searchParams.toString();
            const hash = window.location.hash;

            logPageView(pathname, {
                pathname: pathname,
                search: search ? `?${search}` : '',
                hash: hash,
                timestamp: new Date().toISOString()
            });
        }
    }, [pathname, searchParams, logPageView, isReady]);

    return <>{children}</>;
};

export default StatsigPageTracker;
