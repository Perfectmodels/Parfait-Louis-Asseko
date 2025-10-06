import React from 'react';
import SEO from '../../components/SEO';

const AdminModels: React.FC = () => {
    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Gestion des Mannequins" noIndex />
            <div className="container mx-auto px-6 lg:px-8">
                <header className="admin-page-header">
                    <div>
                        <h1 className="admin-page-title">Gestion des Mannequins</h1>
                        <p className="admin-page-subtitle">Gérer les profils et informations des mannequins.</p>
                    </div>
                </header>
                
                <div className="admin-section-wrapper">
                    <h2 className="admin-section-title">Profils des Mannequins</h2>
                    <p className="text-pm-off-white/80">Cette page sera développée pour gérer les profils des mannequins.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminModels;
