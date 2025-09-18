import React from 'react';

type AdminTab = 'dashboard' | 'mannequins' | 'casting' | 'content' | 'comptabilite' | 'parametres' | 'technique' | 'messagerie';

interface AdminNavigationDebugProps {
    activeTab: AdminTab;
    sidebarOpen: boolean;
    onTabChange: (tab: AdminTab) => void;
    onToggleSidebar: () => void;
}

const AdminNavigationDebug: React.FC<AdminNavigationDebugProps> = ({
    activeTab,
    sidebarOpen,
    onTabChange,
    onToggleSidebar
}) => {
    const tabs: AdminTab[] = ['dashboard', 'mannequins', 'casting', 'content', 'comptabilite', 'messagerie', 'parametres', 'technique'];

    return (
        <div className="fixed top-20 right-4 bg-black/80 backdrop-blur-sm border border-pm-gold/20 rounded-lg p-4 z-50 max-w-xs">
            <h3 className="text-pm-gold font-bold mb-3 text-sm">Debug Navigation</h3>
            
            <div className="space-y-2 text-xs">
                <div>
                    <span className="text-pm-off-white/60">Active Tab: </span>
                    <span className="text-pm-gold font-medium">{activeTab}</span>
                </div>
                
                <div>
                    <span className="text-pm-off-white/60">Sidebar Open: </span>
                    <span className={`font-medium ${sidebarOpen ? 'text-green-400' : 'text-red-400'}`}>
                        {sidebarOpen ? 'Yes' : 'No'}
                    </span>
                </div>
            </div>

            <div className="mt-4 space-y-1">
                <h4 className="text-pm-gold text-xs font-medium mb-2">Test Navigation:</h4>
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={`block w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                            activeTab === tab 
                                ? 'bg-pm-gold/20 text-pm-gold' 
                                : 'text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <button
                onClick={onToggleSidebar}
                className="mt-3 w-full px-2 py-1 bg-pm-gold/20 text-pm-gold rounded text-xs hover:bg-pm-gold/30 transition-colors"
            >
                Toggle Sidebar
            </button>
        </div>
    );
};

export default AdminNavigationDebug;
