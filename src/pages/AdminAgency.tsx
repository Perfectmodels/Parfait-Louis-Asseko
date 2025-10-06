import React from 'react';
import SEO from '../../components/SEO';

const AdminAgency: React.FC = () => {
    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Gestion de l'Agence" noIndex />
            <div className="container mx-auto px-6 lg:px-8">
                <header className="admin-page-header">
                    <div>
                        <h1 className="admin-page-title">Gestion de l'Agence</h1>
                        <p className="admin-page-subtitle">Gérer les informations de l'agence, les services et les réalisations.</p>
                    </div>
                </header>
                
                <div className="admin-section-wrapper">
                    <h2 className="admin-section-title">Informations de l'Agence</h2>
                    <p className="text-pm-off-white/80">Cette page sera développée pour gérer les informations de l'agence.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminAgency;
