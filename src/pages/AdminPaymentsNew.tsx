import React from 'react';
import SEO from '../components/SEO';

const AdminPaymentsNew: React.FC = () => {
    return (
        <div className="min-h-screen bg-pm-dark text-pm-off-white">
            <SEO 
                title="Nouveaux Paiements - Panel Admin"
                description="Gestion des nouveaux paiements"
            />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-pm-gold mb-6">Nouveaux Paiements</h1>
                <div className="bg-pm-dark/50 border border-pm-gold/20 rounded-lg p-6">
                    <p className="text-pm-off-white/70">Cette page est en cours de développement.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminPaymentsNew;