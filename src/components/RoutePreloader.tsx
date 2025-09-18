import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Preload critical components
const preloadComponents = () => {
    // Preload admin components
    import('../pages/Admin');
    import('../pages/AdminModels');
    import('../pages/AdminMagazine');
    import('../pages/AdminGallery');
    
    // Preload user components
    import('../pages/ModelDashboard');
<<<<<<< HEAD
    import('../pages/BeginnerDashboard');
=======
>>>>>>> 0fd50ed03d4931c5a199740f2fa0e126a09a12d1
    import('../pages/Activity');
    
    // Preload public components
    import('../pages/Home');
    import('../pages/Models');
    import('../pages/Magazine');
    import('../pages/Services');
};

const RoutePreloader: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        // Preload components after initial load
        const timer = setTimeout(() => {
            preloadComponents();
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // Preload components based on current route
    useEffect(() => {
        const preloadBasedOnRoute = () => {
            const path = location.pathname;
            
            if (path.startsWith('/admin')) {
                // Preload other admin components
                import('../pages/AdminSettings');
                import('../pages/AdminAgency');
                import('../pages/AdminCasting');
            } else if (path.startsWith('/formations') || path.startsWith('/profil')) {
                // Preload classroom components
                import('../pages/ChapterDetail');
            } else if (path.startsWith('/mannequins')) {
                // Preload model components
                import('../pages/ModelDetail');
            } else if (path.startsWith('/magazine')) {
                // Preload article components
                import('../pages/ArticleDetail');
            }
        };

        // Small delay to avoid blocking current navigation
        const timer = setTimeout(preloadBasedOnRoute, 100);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    return null;
};

export default RoutePreloader;
