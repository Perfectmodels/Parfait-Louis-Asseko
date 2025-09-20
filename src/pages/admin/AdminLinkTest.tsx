import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import SEO from '../../components/SEO';

const AdminLinkTest: React.FC = () => {
    const adminLinks = [
        { path: '/admin/models', name: 'Gestion des Modèles' },
        { path: '/admin/beginner-students-access', name: 'Mannequins Débutants' },
        { path: '/admin/payments', name: 'Paiements' },
        { path: '/admin/model-access', name: 'Accès Modèles' },
        { path: '/admin/payment-submissions', name: 'Soumissions de Paiement' },
        { path: '/admin/artistic-direction', name: 'Direction Artistique' },
        { path: '/admin/casting-applications', name: 'Candidatures Casting' },
        { path: '/admin/casting-results', name: 'Résultats Casting' },
        { path: '/admin/fashion-day-applications', name: 'Candidatures Fashion Day' },
        { path: '/admin/fashion-day-events', name: 'Événements Fashion Day' },
        { path: '/admin/magazine', name: 'Magazine' },
        { path: '/admin/classroom', name: 'Classroom' },
        { path: '/admin/gallery', name: 'Galerie' },
        { path: '/admin/news', name: 'Actualités' },
        { path: '/admin/server', name: 'Serveur' },
        { path: '/admin/database', name: 'Base de Données' },
        { path: '/admin/api-keys', name: 'Clés API' },
        { path: '/admin/security', name: 'Sécurité' },
        { path: '/admin/email-diagnostic', name: 'Diagnostic Email' },
        { path: '/admin/brevo-test', name: 'Test Brevo' },
        { path: '/admin/settings', name: 'Paramètres' },
        { path: '/admin/team', name: 'Équipe' },
        { path: '/admin/model-tracking', name: 'Suivi Modèles' },
        { path: '/admin/user-management', name: 'Gestion Utilisateurs' },
        { path: '/admin/messages', name: 'Messages' },
        { path: '/admin/messaging', name: 'Messagerie Interne' },
        { path: '/admin/bookings', name: 'Réservations' },
        { path: '/admin/absences', name: 'Absences' },
        { path: '/admin/recovery-requests', name: 'Demandes de Récupération' },
        { path: '/admin/comments', name: 'Commentaires' },
        { path: '/admin/classroom-progress', name: 'Progrès Classroom' },
        { path: '/admin/agency', name: 'Agence' },
        { path: '/admin/accounting', name: 'Comptabilité' },
        { path: '/admin/payment-status', name: 'Statuts de Paiement' }
    ];

    return (
        <div className="min-h-screen bg-pm-dark text-pm-off-white">
            <SEO 
                title="Test des Liens Admin" 
                description="Vérification de tous les liens du panel admin"
            />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link 
                        to="/admin" 
                        className="flex items-center gap-2 text-pm-gold hover:text-pm-gold/80 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Retour au Panel Admin
                    </Link>
                </div>

                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-pm-gold mb-2">Test des Liens Admin</h1>
                    <p className="text-pm-off-white/70 mb-8">Vérification de tous les liens du panel admin</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {adminLinks.map((link, index) => (
                            <Link
                                key={index}
                                to={link.path}
                                className="block p-4 bg-pm-dark/50 rounded-lg border border-pm-gold/20 hover:border-pm-gold/40 transition-all duration-300 hover:shadow-lg hover:shadow-pm-gold/10"
                            >
                                <div className="text-pm-gold font-semibold mb-1">{link.name}</div>
                                <div className="text-pm-off-white/70 text-sm">{link.path}</div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20">
                        <h2 className="text-xl font-semibold text-pm-gold mb-4">Instructions</h2>
                        <p className="text-pm-off-white/70 mb-4">
                            Cliquez sur chaque lien pour vérifier qu'il fonctionne correctement. 
                            Si un lien mène à une page 404, cela signifie que la route n'est pas configurée.
                        </p>
                        <div className="text-sm text-pm-off-white/50">
                            Total des liens testés: {adminLinks.length}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLinkTest;
