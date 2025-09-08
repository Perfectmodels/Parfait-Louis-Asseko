import React from 'react';
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import { Link, useNavigate } from 'react-router-dom';
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
    ChatBubbleLeftRightIcon,
    BriefcaseIcon,
    EnvelopeIcon,
    ClipboardDocumentCheckIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const { data } = useData();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const newCastingApps = data?.castingApplications?.filter(app => app.status === 'Nouveau').length || 0;
    const newFashionDayApps = data?.fashionDayApplications?.filter(app => app.status === 'Nouveau').length || 0;
    const newRecoveryRequests = data?.recoveryRequests?.filter(req => req.status === 'Nouveau').length || 0;
    const newBookingRequests = data?.bookingRequests?.filter(req => req.status === 'Nouveau').length || 0;
    const newMessages = data?.contactMessages?.filter(msg => msg.status === 'Nouveau').length || 0;

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin Dashboard" noIndex />
            <div className="container mx-auto px-6 lg:px-8">
                <header className="admin-page-header">
                    <div>
                        <h1 className="admin-page-title">Tableau de Bord</h1>
                        <p className="admin-page-subtitle">Gestion complète de la plateforme Perfect Models Management.</p>
                    </div>
                    <button onClick={handleLogout} className="inline-flex items-center gap-2 text-sm text-pm-gold/80 hover:text-pm-gold">
                        <ArrowRightOnRectangleIcon className="w-5 h-5" /> Déconnexion
                    </button>
                </header>
                
                <div className="space-y-12">
                    {/* Section: Gestion des Talents */}
                    <section>
                        <h2 className="admin-section-title">Gestion des Talents</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <DashboardCard 
                                title="Gérer les Mannequins" 
                                icon={UsersIcon} 
                                link="/admin/models" 
                                description="Ajouter, modifier ou supprimer des profils de mannequins."
                            />
                            <DashboardCard 
                                title="Candidatures Casting" 
                                icon={ClipboardDocumentListIcon} 
                                link="/admin/casting-applications"
                                description="Consulter et traiter les candidatures pour les castings."
                                notificationCount={newCastingApps}
                            />
                            <DashboardCard 
                                title="Résultats & Validation Casting" 
                                icon={ClipboardDocumentCheckIcon} 
                                link="/admin/casting-results"
                                description="Valider les candidats et créer leurs profils de mannequin."
                            />
                        </div>
                    </section>
                    
                    {/* Section: Gestion du Contenu */}
                    <section>
                         <h2 className="admin-section-title">Gestion du Contenu</h2>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                                title="Gérer les Actualités" 
                                icon={PresentationChartLineIcon} 
                                link="/admin/news"
                                description="Publier et gérer les actualités de la page d'accueil."
                            />
                            <DashboardCard 
                                title="Contenu de l'Agence" 
                                icon={BuildingStorefrontIcon} 
                                link="/admin/agency"
                                description="Mettre à jour les services, la chronologie et les réalisations."
                            />
                         </div>
                    </section>
                    
                    {/* Section: Événements & Bookings */}
                     <section>
                         <h2 className="admin-section-title">Événements & Bookings</h2>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                             <DashboardCard 
                                title="Demandes de Booking" 
                                icon={BriefcaseIcon} 
                                link="/admin/bookings"
                                description="Consulter et gérer les demandes de booking des clients."
                                notificationCount={newBookingRequests}
                            />
                            <DashboardCard 
                                title="Candidatures PFD" 
                                icon={SparklesIcon} 
                                link="/admin/fashion-day-applications"
                                description="Gérer les inscriptions pour l'événement Perfect Fashion Day."
                                notificationCount={newFashionDayApps}
                            />
                             <DashboardCard 
                                title="Événements PFD" 
                                icon={CalendarDaysIcon} 
                                link="/admin/fashion-day-events"
                                description="Configurer les éditions du Perfect Fashion Day."
                            />
                         </div>
                    </section>
                    
                    {/* Section: Gestion Classroom */}
                    <section>
                         <h2 className="admin-section-title">Gestion Classroom</h2>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              <DashboardCard 
                                title="Gérer le Classroom Pro" 
                                icon={BookOpenIcon} 
                                link="/admin/classroom"
                                description="Modifier les modules et chapitres de la formation avancée."
                            />
                            <DashboardCard 
                                title="Suivi Classroom Pro" 
                                icon={AcademicCapIcon} 
                                link="/admin/classroom-progress"
                                description="Voir la progression des mannequins confirmés aux quiz."
                            />
                            <DashboardCard 
                                title="Accès Mannequins Pro" 
                                icon={KeyIcon} 
                                link="/admin/model-access"
                                description="Consulter les identifiants des mannequins confirmés."
                            />
                             <DashboardCard 
                                title="Accès Débutants" 
                                icon={UserGroupIcon} 
                                link="/admin/beginner-students-access"
                                description="Consulter les identifiants des nouveaux mannequins."
                            />
                         </div>
                    </section>
                    
                    {/* Section: Administration */}
                    <section>
                         <h2 className="admin-section-title">Administration & Système</h2>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                             <DashboardCard 
                                title="Messages de Contact" 
                                icon={EnvelopeIcon} 
                                link="/admin/messages"
                                description="Lire et gérer les messages reçus via le formulaire de contact."
                                notificationCount={newMessages}
                            />
                             <DashboardCard 
                                title="Demandes de Récupération" 
                                icon={ExclamationTriangleIcon} 
                                link="/admin/recovery-requests"
                                description="Traiter les demandes de coordonnées oubliées."
                                notificationCount={newRecoveryRequests}
                            />
                            <DashboardCard 
                                title="Paramètres du Site" 
                                icon={Cog6ToothIcon} 
                                link="/admin/settings"
                                description="Modifier les informations de contact, les images et les clés API."
                            />
                         </div>
                    </section>
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
    <Link to={link} className="relative group block bg-black p-8 border border-pm-gold/20 hover:border-pm-gold hover:-translate-y-2 transition-all duration-300 rounded-lg shadow-lg hover:shadow-pm-gold/10">
        {notificationCount && notificationCount > 0 && (
            <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full animate-pulse-slow">
                {notificationCount}
            </span>
        )}
        <Icon className="w-12 h-12 text-pm-gold mb-5" />
        <h2 className="text-xl font-playfair text-pm-off-white group-hover:text-pm-gold transition-colors mb-2">{title}</h2>
        <p className="text-sm text-pm-off-white/70 leading-relaxed">{description}</p>
    </Link>
);

export default Admin;