import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import PageTransition, { LoadingTransition } from './PageTransition';

interface ProtectedRouteWrapperProps {
    children: React.ReactNode;
    role: 'admin' | 'student' | 'jury' | 'registration' | 'beginner' | 'classroom';
}

const ProtectedLoadingFallback: React.FC = () => (
    <LoadingTransition>
        <div className="min-h-screen bg-pm-dark flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-pm-gold/20 border-t-pm-gold rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-pm-gold/40 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <div className="text-center">
                <p className="text-pm-gold text-2xl font-playfair font-bold mb-2">Vérification d'accès</p>
                <p className="text-pm-off-white/70 text-lg">Chargement de votre espace...</p>
                <div className="mt-4 flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-pm-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-pm-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-pm-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    </LoadingTransition>
);

const ProtectedRouteWrapper: React.FC<ProtectedRouteWrapperProps> = ({ children, role }) => {
    const { data, isInitialized } = useData();
    const location = useLocation();

    // Show loading while data is not initialized
    if (!isInitialized || !data) {
        return <ProtectedLoadingFallback />;
    }

    const userRole = sessionStorage.getItem('classroom_role');
    const hasAccess = sessionStorage.getItem('classroom_access') === 'granted';

    // Pour le rôle 'classroom', accepter à la fois 'student' et 'beginner'
    if (hasAccess && (userRole === role || (role === 'classroom' && (userRole === 'student' || userRole === 'beginner')))) {
        return <>{children}</>;
    }

    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRouteWrapper;
