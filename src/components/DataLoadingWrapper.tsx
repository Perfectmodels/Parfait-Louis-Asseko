import React from 'react';
import { useData } from '../contexts/DataContext';
import PageTransition, { LoadingTransition } from './PageTransition';

interface DataLoadingWrapperProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

const DefaultLoadingFallback: React.FC = () => (
    <LoadingTransition>
        <div className="min-h-screen bg-pm-dark flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-pm-gold/20 border-t-pm-gold rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-pm-gold/40 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <div className="text-center">
                <p className="text-pm-gold text-2xl font-playfair font-bold mb-2">Perfect Models</p>
                <p className="text-pm-off-white/70 text-lg">Initialisation des données...</p>
                <div className="mt-4 flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-pm-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-pm-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-pm-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    </LoadingTransition>
);

const DataLoadingWrapper: React.FC<DataLoadingWrapperProps> = ({ 
    children, 
    fallback = <DefaultLoadingFallback /> 
}) => {
    const { data, isInitialized } = useData();

    // Show loading while data is not initialized
    if (!isInitialized || !data) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

export default DataLoadingWrapper;
