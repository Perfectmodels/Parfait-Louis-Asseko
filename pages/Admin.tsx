import React from 'react';
// FIX: Fix react-router-dom imports by using a namespace import
import * as ReactRouterDOM from 'react-router-dom';
import SEO from '../components/SEO';
import { 
    UsersIcon, 
    BookOpenIcon, 
    NewspaperIcon, 
    CalendarDaysIcon, 
    Cog6ToothIcon, 
    ClipboardDocumentListIcon,
    ArrowRightOnRectangleIcon,
    KeyIcon,
    AcademicCapIcon,
    ExclamationTriangleIcon,
    PresentationChartLineIcon,
    BuildingStorefrontIcon,
    SparklesIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

const Admin: React.FC = () => {
    const navigate = ReactRouterDOM.useNavigate();
    const { data } = useData();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const newCastingApps = data?.castingApplications?.filter(app => app.status === 'Nouveau').length || 0;
    const newFashionDayApps = data?.fashionDayApplications?.filter(app => app.status === 'Nouveau').length || 0;
    const newRecoveryRequests = data?.recoveryRequests?.filter(req => req.status === 'Nouveau').length || 0;

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin Dashboard" noIndex />
            <div className="container mx-auto px-6">
                <header className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-12">
                    <div>
                        <h1 className="text-4xl font-playfair text-pm-gold">Tableau de Bord Administrateur</h1>
                        <p className="text-pm-off-white/80">Gestion complète de la plateforme Perfect Models Management.</p>
                    </div>
                    <button onClick={handleLogout} className="inline-flex items-center gap-2 text-sm text-pm-gold/80 hover:text-pm-gold">
                        <ArrowRightOnRectangleIcon className="w-5 h-5" /> Déconnexion
                    </button>
                </header>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <DashboardCard 
                        title="Gérer les Mannequins" 
                        icon={UsersIcon} 
                        link="/admin/models" 
                        description="Ajouter, modifier ou supprimer des profils de mannequins."
                    />
                     <DashboardCard 
                        title="Gérer le Magazine" 
                        icon={NewspaperIcon} 
                        link="/admin/magazine"
                        description="Créer et administrer les articles du magazine Focus Model 241."
                    />
                    <DashboardCard 
                        title="Modérer les Commentaires" 
                        icon={ChatBubbleLeftRightIcon} 
                        link="/admin/comments"
                        description="Gérer les commentaires laissés sur les articles du magazine."
                    />
                    <DashboardCard 
                        title="Gérer le Classroom" 
                        icon={BookOpenIcon} 
                        link="/admin/classroom"
                        description="Modifier les modules et chapitres de la formation en ligne."
                    />
                    <DashboardCard 
                        title="Candidatures Casting" 
                        icon={ClipboardDocumentListIcon} 
                        link="/admin/casting-applications"
                        description="Consulter et traiter les candidatures pour les castings."
                        notificationCount={newCastingApps}
                    />
                    <DashboardCard 
                        title="Candidatures PFD" 
                        icon={SparklesIcon} 
                        link="/admin/fashion-day-applications"
                        description="Gérer les inscriptions pour l'événement Perfect Fashion Day."
                        notificationCount={newFashionDayApps}
                    />
                     <DashboardCard 
                        title="Contenu de l'Agence" 
                        icon={BuildingStorefrontIcon} 
                        link="/admin/agency"
                        description="Mettre à jour les services, la chronologie et les réalisations."
                    />
                     <DashboardCard 
                        title="Gérer les Actualités" 
                        icon={PresentationChartLineIcon} 
                        link="/admin/news"
                        description="Publier et gérer les actualités de la page d'accueil."
                    />
                     <DashboardCard 
                        title="Événements PFD" 
                        icon={CalendarDaysIcon} 
                        link="/admin/fashion-day-events"
                        description="Configurer les éditions du Perfect Fashion Day."
                    />
                    <DashboardCard 
                        title="Accès Mannequins" 
                        icon={KeyIcon} 
                        link="/admin/model-access"
                        description="Consulter les identifiants et mots de passe des mannequins."
                    />
                    <DashboardCard 
                        title="Suivi Classroom" 
                        icon={AcademicCapIcon} 
                        link="/admin/classroom-progress"
                        description="Voir la progression et les scores des mannequins aux quiz."
                    />
                     <DashboardCard 
                        title="Demandes de Récupération" 
                        icon={ExclamationTriangleIcon} 
                        link="/admin/recovery-requests"
                        description="Traiter les demandes de coordonnées oubliées."
                        notificationCount={newRecoveryRequests}
                    />
                     <DashboardCard 
                        title="Casting Live View" 
                        icon={PresentationChartLineIcon} 
                        link="/admin/casting-live"
                        description="Afficher les notes des jurys en temps réel."
                    />
                    <DashboardCard 
                        title="Paramètres du Site" 
                        icon={Cog6ToothIcon} 
                        link="/admin/settings"
                        description="Modifier les informations de contact, les images et les clés API."
                    />
                </div>
            </div>
        </div>
    );
};

interface DashboardCardProps {
    title: string;
    icon: React.ElementType;
    link: string;
    description: string;
    notificationCount?: number;
}
const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon: Icon, link, description, notificationCount }) => (
    <ReactRouterDOM.Link to={link} className="relative group block bg-black p-6 border border-pm-gold/20 hover:border-pm-gold hover:-translate-y-2 transition-all duration-300 rounded-lg shadow-lg hover:shadow-pm-gold/10">
        {notificationCount && notificationCount > 0 && (
            <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full animate-pulse">
                {notificationCount}
            </span>
        )}
        <Icon className="w-10 h-10 text-pm-gold mb-4" />
        <h2 className="text-xl font-playfair text-pm-off-white group-hover:text-pm-gold transition-colors">{title}</h2>
        <p className="text-sm text-pm-off-white/70 mt-2">{description}</p>
    </ReactRouterDOM.Link>
);

export default Admin;