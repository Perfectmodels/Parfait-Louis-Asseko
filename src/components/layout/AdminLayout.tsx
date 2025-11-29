import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path ? 'bg-pm-gold text-black' : 'text-gray-300 hover:bg-gray-700';
    };

    return (
        <div className="flex h-screen bg-gray-100 font-montserrat">
            {/* Sidebar */}
            <aside className="w-64 bg-pm-dark text-white flex flex-col flex-shrink-0">
                <div className="p-6 text-xl font-bold font-playfair text-pm-gold border-b border-gray-700">
                    Perfect Admin
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link to="/admin" className={`block py-2 px-4 rounded transition-colors ${isActive('/admin')}`}>
                        Dashboard
                    </Link>
                    <Link to="/admin/models" className={`block py-2 px-4 rounded transition-colors ${isActive('/admin/models')}`}>
                        Modèles
                    </Link>
                    <Link to="/admin/castings" className={`block py-2 px-4 rounded transition-colors ${isActive('/admin/castings')}`}>
                        Castings
                    </Link>
                    <Link to="/admin/magazine" className={`block py-2 px-4 rounded transition-colors ${isActive('/admin/magazine')}`}>
                        Magazine
                    </Link>
                    <Link to="/admin/partners" className={`block py-2 px-4 rounded transition-colors ${isActive('/admin/partners')}`}>
                        Partenaires
                    </Link>
                    <Link to="/admin/contacts" className={`block py-2 px-4 rounded transition-colors ${isActive('/admin/contacts')}`}>
                        Contacts
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <Link to="/" className="block py-2 px-4 text-gray-400 hover:text-white transition-colors">
                        ← Retour au site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-gray-50">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
