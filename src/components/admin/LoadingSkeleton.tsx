import React from 'react';

interface LoadingSkeletonProps {
    className?: string;
    lines?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
    className = "", 
    lines = 1 
}) => {
    return (
        <div className={`animate-pulse ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
                <div key={index} className="space-y-3">
                    <div className="h-4 bg-pm-off-white/10 rounded w-3/4"></div>
                    <div className="h-3 bg-pm-off-white/5 rounded w-1/2"></div>
                </div>
            ))}
        </div>
    );
};

export default LoadingSkeleton;
