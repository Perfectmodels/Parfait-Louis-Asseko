import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebarLayout from '../components/AdminSidebarLayout';

// ---- Main Admin Component ----
const Admin: React.FC = () => {
    const location = useLocation();
    
    // Déterminer le titre et la description selon la route
    const getPageInfo = () => {
        const path = location.pathname;
        switch (path) {
            case '/admin':
                return { title: 'Dashboard', description: 'Vue d\'ensemble de l\'administration' };
            case '/admin/models':
                return { title: 'Gestion des Mannequins', description: 'Gérer les mannequins et étudiants' };
            case '/admin/content':
                return { title: 'Gestion du Contenu', description: 'Articles, actualités et pages' };
            case '/admin/communication':
                return { title: 'Communication', description: 'Messages et campagnes' };
            case '/admin/finance':
                return { title: 'Finance', description: 'Gestion financière' };
            case '/admin/analytics':
                return { title: 'Analytics', description: 'Statistiques et rapports' };
            case '/admin/messaging':
                return { title: 'Messagerie Interne', description: 'Conversations avec les utilisateurs' };
            case '/admin/technical':
                return { title: 'Section Technique', description: 'Informations techniques et maintenance' };
            case '/admin/payments':
                return { title: 'Gestion des Paiements', description: 'Gérer les soumissions de paiements' };
            case '/admin/casting-live':
                return { title: 'Casting Live', description: 'Gestion des castings en direct' };
            case '/admin/artistic-direction':
                return { title: 'Direction Artistique', description: 'Gestion de la direction artistique' };
            case '/admin/absences':
                return { title: 'Gestion des Absences', description: 'Suivi des absences des mannequins' };
            case '/admin/profile':
                return { title: 'Profil Administrateur', description: 'Gestion du profil administrateur' };
            case '/admin/users':
                return { title: 'Gestion des Utilisateurs', description: 'Gérer les utilisateurs du système' };
            case '/admin/accounting':
                return { title: 'Comptabilité', description: 'Gestion comptable et financière' };
            case '/admin/emails':
                return { title: 'Gestion des Emails', description: 'Configuration et envoi d\'emails' };
            case '/admin/media':
                return { title: 'Gestion des Médias', description: 'Gérer les fichiers et médias' };
            default:
                return { title: 'Administration', description: 'Panel d\'administration' };
        }
    };

    const { title, description } = getPageInfo();

    return (
        <AdminSidebarLayout
            title={title}
            description={description}
            breadcrumbs={[
                { label: 'Admin', path: '/admin' },
                { label: title }
            ]}
        >
            <Outlet />
        </AdminSidebarLayout>
    );
};

export default Admin;