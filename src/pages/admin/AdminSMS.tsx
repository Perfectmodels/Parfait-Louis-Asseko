import React from 'react';
import SEO from '../../components/SEO';

const AdminSMS: React.FC = () => {
    return (
        <div className="min-h-screen bg-pm-dark text-pm-off-white">
            <SEO 
                title="SMS - Panel Admin"
                description="Gestion des SMS"
            />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-pm-gold mb-6">Gestion SMS</h1>
                <div className="bg-pm-dark/50 border border-pm-gold/20 rounded-lg p-6">
                    <p className="text-pm-off-white/70">Cette page est en cours de développement.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminSMS;
