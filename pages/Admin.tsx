
import React, { useState } from 'react';
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import SEO from '../components/SEO';
import { 
    UsersIcon, BookOpenIcon, NewspaperIcon, CalendarDaysIcon, Cog6ToothIcon, ClipboardDocumentListIcon,
    ArrowRightOnRectangleIcon, KeyIcon, AcademicCapIcon, ExclamationTriangleIcon, PresentationChartLineIcon,
    BuildingStorefrontIcon, SparklesIcon, ChatBubbleLeftRightIcon, BriefcaseIcon, EnvelopeIcon,
    ClipboardDocumentCheckIcon, UserGroupIcon, HomeIcon, CurrencyDollarIcon, CalendarIcon, PaintBrushIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

type AdminTab = 'talents' | 'content' | 'accounting';

const Admin: React.FC = () => {
    const navigate = ReactRouterDOM.useNavigate();
    const { data } = useData();
    const [activeTab, setActiveTab] = useState<AdminTab>('talents');

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };
    
    const newCastingApps = data?.castingApplications?.filter(app => app.status === 'Nouveau').length || 0;
    const newFashionDayApps = data?.fashionDayApplications?.filter(app => app.status === 'Nouveau').length || 0;
    const newRecoveryRequests = data?.recoveryRequests?.filter(req => req.status === 'Nouveau').length || 0;
    const newBookingRequests = data?.bookingRequests?.filter(req => req.status === 'Nouveau').length || 0;
    const newMessages = data?.contactMessages?.filter(msg => msg.status === 'Nouveau').length || 0;

    const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
        { id: 'talents', label: 'Talents', icon: UsersIcon },
        { id: 'content', label: 'Contenu', icon: NewspaperIcon },
        { id: 'accounting', label: 'Comptabilité & Suivi', icon: BriefcaseIcon },
    ];

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin Dashboard" noIndex />
            <div className="container mx-auto px-6 lg:px-8">
                <header className="admin-page-header">
                    <div>
                        <h1 className="admin-page-title">Tableau de Bord Administratif</h1>
                        <p className="admin-page-subtitle">Gestion complète de la plateforme Perfect Models Management.</p>
                    </div>
                    <button onClick={handleLogout} className="inline-flex items-center gap-2 text-sm text-pm-gold/80 hover:text-pm-gold">
                        <ArrowRightOnRectangleIcon className="w-5 h-5" /> Déconnexion
                    </button>
                </header>

                <div className="border-b border-pm-gold/20 mb-8">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`group inline-flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab.id
                                    ? 'border-pm-gold text-pm-gold'
                                    : 'border-transparent text-pm-off-white/70 hover:text-pm-gold hover:border-pm-gold/50'
                                }`}
                                aria-current={activeTab === tab.id ? 'page' : undefined}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                
                <div className="animate-fade-in">
                    {activeTab === 'talents' && (
                        <TabContent title="Gestion des Talents et du Recrutement">
                            <DashboardCard title="Gérer les Mannequins Pro" icon={UsersIcon} link="/admin/models" description="Ajouter, modifier ou rétrograder des profils de mannequins."/>
                            <DashboardCard title="Gérer les Débutants" icon={UserGroupIcon} link="/admin/beginner-students-access" description="Consulter les accès et promouvoir les mannequins en formation."/>
                            <DashboardCard title="Direction Artistique" icon={PaintBrushIcon} link="/admin/artistic-direction" description="Créer et assigner des thèmes de séance photo aux mannequins."/>
                            <DashboardCard title="Candidatures Casting" icon={ClipboardDocumentListIcon} link="/admin/casting-applications" description="Consulter et traiter les candidatures pour les castings." notificationCount={newCastingApps} />
                            <DashboardCard title="Résultats & Validation Casting" icon={ClipboardDocumentCheckIcon} link="/admin/casting-results" description="Valider les candidats et créer leurs profils de débutant." />
                             <DashboardCard title="Accès Mannequins Pro" icon={KeyIcon} link="/admin/model-access" description="Consulter les identifiants des mannequins confirmés." />
                        </TabContent>
                    )}
                    {activeTab === 'content' && (
                         <TabContent title="Gestion du Contenu et de la Formation">
                            <DashboardCard title="Gérer le Magazine" icon={NewspaperIcon} link="/admin/magazine" description="Créer et administrer les articles du magazine Focus Model 241." />
                            <DashboardCard title="Gérer les Actualités" icon={PresentationChartLineIcon} link="/admin/news" description="Publier et gérer les actualités de la page d'accueil." />
                            <DashboardCard title="Contenu de l'Agence" icon={BuildingStorefrontIcon} link="/admin/agency" description="Mettre à jour les services, la chronologie et les réalisations." />
                            <DashboardCard title="Événements PFD" icon={CalendarDaysIcon} link="/admin/fashion-day-events" description="Configurer les éditions du Perfect Fashion Day." />
                             <DashboardCard title="Modérer les Commentaires" icon={ChatBubbleLeftRightIcon} link="/admin/comments" description="Gérer les commentaires laissés sur les articles du magazine." />
                             <DashboardCard title="Gérer le Classroom Pro" icon={BookOpenIcon} link="/admin/classroom" description="Modifier les modules et chapitres de la formation avancée." />
                            <DashboardCard title="Paramètres du Site" icon={Cog6ToothIcon} link="/admin/settings" description="Modifier les informations de contact, les images et les clés API." />
                         </TabContent>
                    )}
                     {activeTab === 'accounting' && (
                         <TabContent title="Comptabilité, Opérations et Suivi">
                             <DashboardCard title="Comptabilité" icon={CurrencyDollarIcon} link="/admin/payments" description="Enregistrer et suivre les paiements mensuels des mannequins." />
                             <DashboardCard title="Suivi des Absences" icon={CalendarIcon} link="/admin/absences" description="Enregistrer et consulter les absences des mannequins." />
                             <DashboardCard title="Demandes de Booking" icon={BriefcaseIcon} link="/admin/bookings" description="Consulter et gérer les demandes de booking des clients." notificationCount={newBookingRequests} />
                            <DashboardCard title="Candidatures PFD" icon={SparklesIcon} link="/admin/fashion-day-applications" description="Gérer les inscriptions pour l'événement Perfect Fashion Day." notificationCount={newFashionDayApps} />
                             <DashboardCard title="Suivi Classroom Pro" icon={AcademicCapIcon} link="/admin/classroom-progress" description="Voir la progression des mannequins confirmés aux quiz." />
                             <DashboardCard title="Messages de Contact" icon={EnvelopeIcon} link="/admin/messages" description="Lire et gérer les messages reçus via le formulaire de contact." notificationCount={newMessages} />
                             <DashboardCard title="Demandes de Récupération" icon={ExclamationTriangleIcon} link="/admin/recovery-requests" description="Traiter les demandes de coordonnées oubliées." notificationCount={newRecoveryRequests} />
                         </TabContent>
                    )}
                </div>
            </div>
        </div>
    );
};

const TabContent: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <section>
        <h2 className="text-xl font-bold text-pm-off-white/80 mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {children}
        </div>
    </section>
);

interface DashboardCardProps {
    title: string;
    icon: React.ElementType;
    link: string;
    description: string;
    notificationCount?: number;
}
const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon: Icon, link, description, notificationCount }) => (
    <ReactRouterDOM.Link to={link} className="relative group block bg-black p-6 border border-pm-gold/20 hover:border-pm-gold hover:-translate-y-1 transition-all duration-300 rounded-lg shadow-lg hover:shadow-pm-gold/10">
        {notificationCount && notificationCount > 0 && (
            <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse-slow">
                {notificationCount}
            </span>
        )}
        <Icon className="w-10 h-10 text-pm-gold mb-4" />
        <h2 className="text-lg font-bold text-pm-off-white group-hover:text-pm-gold transition-colors mb-1">{title}</h2>
        <p className="text-xs text-pm-off-white/70 leading-relaxed">{description}</p>
    </ReactRouterDOM.Link>
);

export default Admin;
