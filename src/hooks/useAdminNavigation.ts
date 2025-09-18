import { useState, useCallback } from 'react';

type AdminTab = 'dashboard' | 'mannequins' | 'casting' | 'content' | 'comptabilite' | 'parametres' | 'technique' | 'messagerie';

export const useAdminNavigation = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleTabChange = useCallback((tab: AdminTab) => {
        console.log('Changing tab to:', tab);
        setActiveTab(tab);
        setSidebarOpen(false);
    }, []);

    const toggleSidebar = useCallback(() => {
        console.log('Toggling sidebar, current state:', sidebarOpen);
        setSidebarOpen(prev => !prev);
    }, [sidebarOpen]);

    const closeSidebar = useCallback(() => {
        console.log('Closing sidebar');
        setSidebarOpen(false);
    }, []);

    return {
        activeTab,
        sidebarOpen,
        handleTabChange,
        toggleSidebar,
        closeSidebar
    };
};
