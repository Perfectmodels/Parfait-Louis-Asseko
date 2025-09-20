import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Preload critical components
const preloadComponents = () => {
    // Preload admin components
    import('../pages/admin/Admin');
    import('../pages/admin/AdminModels');
    import('../pages/admin/AdminMagazine');
    import('../pages/admin/AdminGallery');
    
    // Preload user components
    import('../pages/ModelDashboard');
    
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
                import('../pages/admin/AdminSettings');
                import('../pages/admin/AdminAgency');
                import('../pages/admin/AdminCasting');
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
