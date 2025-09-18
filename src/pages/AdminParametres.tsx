import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Cog6ToothIcon, 
    UserIcon, 
    ChartBarIcon, 
    PlusIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';

// Définir une interface simple pour DashboardCardProps
interface DashboardCardProps {
    title: string;
    icon: React.ElementType;
    link: string;
    description: string;
    notificationCount?: number;
}

// Définir le composant DashboardCard
const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon: Icon, link, description, notificationCount }) => (
    <Link to={link} className="relative group block bg-black/50 p-6 border border-pm-gold/20 hover:border-pm-gold hover:-translate-y-1 transition-all duration-300 rounded-lg shadow-lg hover:shadow-pm-gold/10">
        {notificationCount && notificationCount > 0 && (
            <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                {notificationCount}
            </span>
        )}
        <Icon className="w-10 h-10 text-pm-gold mb-4" />
        <h2 className="text-lg font-bold text-pm-off-white group-hover:text-pm-gold transition-colors mb-1">{title}</h2>
        <p className="text-xs text-pm-off-white/70 leading-relaxed">{description}</p>
    </Link>
);

export const ParametresView: React.FC<{ data: any }> = React.memo(({ data: _data }) => (
    <div className="space-y-4">
        <div>
            <h2 className="text-2xl font-bold text-pm-gold">Paramètres</h2>
            <p className="text-pm-off-white/60">Configuration du site et de l'équipe</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard 
                title="Paramètres du Site" 
                icon={Cog6ToothIcon} 
                link="/admin/settings" 
                description="Modifier les informations de contact et clés API"
            />
            <DashboardCard 
                title="Gestion d'Équipe" 
                icon={UserIcon} 
                link="/admin/team" 
                description="Gérer les membres de l'équipe"
            />
            {/* <DashboardCard 
                title="Gestion des Images" 
                icon={PhotoIcon} 
                link="/admin/images" 
                description="Optimiser et migrer les images vers Cloudinary"
            /> */}
            <DashboardCard 
                title="Suivi des Mannequins" 
                icon={ChartBarIcon} 
                link="/admin/model-tracking" 
                description="Tableau de bord de performance"
            />
            <DashboardCard 
                title="Gestion des Utilisateurs" 
                icon={PlusIcon} 
                link="/admin/user-management" 
                description="Créer et gérer les comptes administrateurs"
            />
        </div>
    </div>
));
