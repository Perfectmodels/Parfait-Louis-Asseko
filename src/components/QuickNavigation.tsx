import React from 'react';
import { Link } from 'react-router-dom';
import {
    HomeIcon,
    UsersIcon,
    UserGroupIcon,
    EnvelopeIcon,
    CurrencyDollarIcon,
    SparklesIcon,
    BookOpenIcon,
    Cog6ToothIcon,
    ServerIcon
} from '@heroicons/react/24/outline';

const QuickNavigation: React.FC = () => {
    const quickNavSections = [
        {
            title: "Gestion Centrale",
            icon: HomeIcon,
            items: [
                { name: "Tableau de Bord", path: "/admin", icon: HomeIcon },
                { name: "Informations Agence", path: "/admin/agency", icon: UserGroupIcon },
                { name: "Gestion de l'Équipe", path: "/admin/team", icon: UsersIcon },
            ]
        },
        {
            title: "Communication & Emails",
            icon: EnvelopeIcon,
            items: [
                { name: "Messages de Contact", path: "/admin/messages", icon: EnvelopeIcon },
                { name: "Gestion des Emails", path: "/admin/email-management", icon: EnvelopeIcon },
                { name: "Modèles d'Emails", path: "/admin/email-templates", icon: EnvelopeIcon },
                { name: "Diagnostic Email", path: "/admin/email-diagnostic", icon: EnvelopeIcon },
            ]
        },
        {
            title: "Finances & Commandes",
            icon: CurrencyDollarIcon,
            items: [
                { name: "Services", path: "/admin/services", icon: CurrencyDollarIcon },
                { name: "Commandes", path: "/admin/service-orders", icon: CurrencyDollarIcon },
                { name: "Comptabilité", path: "/admin/accounting", icon: CurrencyDollarIcon },
                { name: "Paiements", path: "/admin/payments", icon: CurrencyDollarIcon },
            ]
        },
        {
            title: "Événements & Casting",
            icon: SparklesIcon,
            items: [
                { name: "Candidatures Casting", path: "/admin/casting-applications", icon: SparklesIcon },
                { name: "Résultats Casting", path: "/admin/casting-results", icon: SparklesIcon },
                { name: "Fashion Day", path: "/admin/fashion-day-events", icon: SparklesIcon },
            ]
        },
        {
            title: "Contenu & Formation",
            icon: BookOpenIcon,
            items: [
                { name: "Magazine", path: "/admin/magazine", icon: BookOpenIcon },
                { name: "Galerie", path: "/admin/gallery", icon: BookOpenIcon },
                { name: "Classroom", path: "/admin/classroom", icon: BookOpenIcon },
            ]
        },
        {
            title: "Configuration & Système",
            icon: Cog6ToothIcon,
            items: [
                { name: "Paramètres", path: "/admin/settings", icon: Cog6ToothIcon },
                { name: "Utilisateurs", path: "/admin/user-management", icon: UsersIcon },
                { name: "Serveur", path: "/admin/server", icon: ServerIcon },
            ]
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickNavSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="bg-black/50 border border-pm-gold/10 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-pm-gold mb-4 flex items-center gap-2">
                        <section.icon className="w-5 h-5" />
                        {section.title}
                    </h3>
                    
                    <div className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                            <Link
                                key={itemIndex}
                                to={item.path}
                                className="flex items-center gap-3 p-2 rounded-lg text-pm-off-white hover:bg-pm-gold/10 hover:text-pm-gold transition-colors"
                            >
                                <item.icon className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default QuickNavigation;
