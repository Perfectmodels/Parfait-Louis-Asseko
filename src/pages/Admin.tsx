import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
    BookOpenIcon, NewspaperIcon, CalendarDaysIcon, Cog6ToothIcon, ClipboardDocumentListIcon,
    ArrowRightOnRectangleIcon, KeyIcon, AcademicCapIcon, ExclamationTriangleIcon, PresentationChartLineIcon,
    BuildingStorefrontIcon, SparklesIcon, ChatBubbleLeftRightIcon, BriefcaseIcon, EnvelopeIcon,
    ClipboardDocumentCheckIcon, CurrencyDollarIcon, CalendarIcon, PaintBrushIcon,
    ChartBarIcon, BoltIcon, BellIcon, DocumentTextIcon, PhotoIcon, ShieldCheckIcon, TrophyIcon,
    DocumentDuplicateIcon, UserCircleIcon, ChartPieIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

type AdminTab = 'comptabilite' | 'formations' | 'communications' | 'direction_artistique' | 'marketing' | 'technique';

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const { data } = useData();
    const [activeTab, setActiveTab] = useState<AdminTab>('comptabilite');

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };
    
    const newCastingApps = data?.castingApplications?.filter(app => app.status === 'Nouveau').length || 0;
    const newRecoveryRequests = data?.recoveryRequests?.filter(req => req.status === 'Nouveau').length || 0;
    const newBookingRequests = data?.bookingRequests?.filter(req => req.status === 'Nouveau').length || 0;
    const newMessages = data?.contactMessages?.filter(msg => msg.status === 'Nouveau').length || 0;

    const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
        { id: 'comptabilite', label: 'Comptabilité', icon: CurrencyDollarIcon },
        { id: 'formations', label: 'Formations', icon: AcademicCapIcon },
        { id: 'communications', label: 'Communications', icon: EnvelopeIcon },
        { id: 'direction_artistique', label: 'Direction artistique', icon: PaintBrushIcon },
        { id: 'marketing', label: 'Marketing', icon: PresentationChartLineIcon },
        { id: 'technique', label: 'Technique', icon: Cog6ToothIcon },
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
                    {activeTab === 'comptabilite' && (
                        <TabContent title="Pôle Comptabilité">
                            <DashboardCard title="Tableau financier" icon={ChartBarIcon} link="/admin/finance" description="Statistiques et indicateurs clés." />
                            <DashboardCard 
                                title="💰 Paiements Mannequins" 
                                icon={CurrencyDollarIcon} 
                                link="/admin/model-payments" 
                                description="Enregistrer inscriptions, cotisations mensuelles et paiements anticipés."
                            />
                            <DashboardCard title="Cotisations" icon={CurrencyDollarIcon} link="/admin/payments" description="Vue d'ensemble des paiements mensuels et mannequins à jour." />
                            <DashboardCard title="Factures clients" icon={ClipboardDocumentCheckIcon} link="/admin/invoices" description="Créer et gérer les factures clients." />
                            <DashboardCard title="Dépenses" icon={BriefcaseIcon} link="/admin/expenses" description="Enregistrer et catégoriser les dépenses de l'agence." />
                            <DashboardCard title="Rapports financiers" icon={PresentationChartLineIcon} link="/admin/financial-reports" description="Rapports par période." />
                            <DashboardCard 
                                title="Analytics" 
                                icon={ChartPieIcon} 
                                link="/admin/analytics" 
                                description="KPIs et statistiques."
                            />
                        </TabContent>
                    )}
                    {activeTab === 'formations' && (
                        <TabContent title="Pôle Formations">
                            <DashboardCard title="Classroom Pro" icon={BookOpenIcon} link="/admin/classroom" description="Modules et chapitres de formation." />
                            <DashboardCard title="Suivi Classroom" icon={AcademicCapIcon} link="/admin/classroom-progress" description="Progression et scores aux quiz." />
                            <DashboardCard 
                                title="🏆 Certifications" 
                                icon={TrophyIcon} 
                                link="/admin/certifications" 
                                description="Gérer les certifications et évaluations des mannequins."
                            />
                        </TabContent>
                    )}
                    {activeTab === 'communications' && (
                        <TabContent title="Pôle Communications">
                            <DashboardCard title="Messages contact" icon={EnvelopeIcon} link="/admin/messages" description="Gérer les messages reçus." notificationCount={newMessages} />
                            <DashboardCard title="Commentaires" icon={ChatBubbleLeftRightIcon} link="/admin/comments" description="Modérer les commentaires du magazine." />
                            <DashboardCard 
                                title="📧 Newsletter" 
                                icon={EnvelopeIcon} 
                                link="/admin/newsletter" 
                                description="Créer et envoyer des newsletters (import contacts, pièces jointes)."
                            />
                            <DashboardCard 
                                title="🔔 Notifications Push" 
                                icon={BellIcon} 
                                link="/admin/notifications" 
                                description="Envoyer des notifications instantanées aux utilisateurs."
                            />
                            <DashboardCard 
                                title="Calendrier" 
                                icon={CalendarIcon} 
                                link="/admin/calendar" 
                                description="Coordonner les événements, castings, shoots et absences."
                            />
                        </TabContent>
                    )}
                    {activeTab === 'direction_artistique' && (
                        <TabContent title="Pôle Direction artistique">
                            <DashboardCard title="Direction artistique" icon={PaintBrushIcon} link="/admin/artistic-direction" description="Thèmes et briefs de séances photo."/>
                            <DashboardCard title="Galerie" icon={PhotoIcon} link="/admin/gallery" description="Albums de défilés, shootings et événements." />
                            <DashboardCard title="Contenu agence" icon={BuildingStorefrontIcon} link="/admin/agency" description="Services, chronologie et réalisations." />
                            <DashboardCard title="Magazine" icon={NewspaperIcon} link="/admin/magazine" description="Articles du magazine Focus Model 241." />
                            <DashboardCard title="Actualités" icon={PresentationChartLineIcon} link="/admin/news" description="Actus de la page d'accueil." />
                            <DashboardCard title="Événements PFD" icon={CalendarDaysIcon} link="/admin/fashion-day-events" description="Configurer les éditions du Perfect Fashion Day." />
                            <DashboardCard title="Distinctions des Mannequins" icon={SparklesIcon} link="/admin/distinctions" description="Ajouter et gérer les prix et distinctions des mannequins." />
                        </TabContent>
                    )}

                    {activeTab === 'marketing' && (
                        <TabContent title="Pôle Marketing">
                            <DashboardCard title="Bookings" icon={BriefcaseIcon} link="/admin/bookings" description="Gérer les demandes de booking clients." notificationCount={newBookingRequests} />
                            <DashboardCard 
                                title="CRM clients" 
                                icon={UserCircleIcon} 
                                link="/admin/crm" 
                                description="Relations clients, historique et projets."
                            />
                            <DashboardCard title="Candidatures casting" icon={ClipboardDocumentListIcon} link="/admin/casting-applications" description="Traiter les candidatures de castings." notificationCount={newCastingApps} />
                            <DashboardCard title="Casting live" icon={BoltIcon} link="/admin/casting-live" description="Candidatures en temps réel."/>
                            <DashboardCard title="Validation casting" icon={ClipboardDocumentCheckIcon} link="/admin/casting-results" description="Valider les candidats et créer leurs profils." />
                            <DashboardCard title="Contrats" icon={DocumentDuplicateIcon} link="/admin/contracts" description="Contrats et templates." />
                        </TabContent>
                    )}

                    {activeTab === 'technique' && (
                        <TabContent title="Pôle Technique">
                            <DashboardCard title="Paramètres" icon={Cog6ToothIcon} link="/admin/settings" description="Contacts, images et clés API." />
                            <DashboardCard title="Audit & logs" icon={ShieldCheckIcon} link="/admin/audit" description="Traçabilité des actions et connexions." />
                            <DashboardCard title="Accès mannequins" icon={KeyIcon} link="/admin/model-access" description="Identifiants des mannequins confirmés." />
                            <DashboardCard title="Documents" icon={DocumentTextIcon} link="/admin/documents" description="Documents (contrats, factures, etc.)." />
                            <DashboardCard title="Récupération" icon={ExclamationTriangleIcon} link="/admin/recovery-requests" description="Coordonnées oubliées." notificationCount={newRecoveryRequests} />
                            <DashboardCard title="Absences" icon={CalendarIcon} link="/admin/absences" description="Enregistrer et consulter les absences." />
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
    <Link to={link} className="relative group block bg-black p-6 border border-pm-gold/20 hover:border-pm-gold hover:-translate-y-1 transition-all duration-300 rounded-lg shadow-lg hover:shadow-pm-gold/10">
        {notificationCount && notificationCount > 0 && (
            <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse-slow">
                {notificationCount}
            </span>
        )}
        <Icon className="w-10 h-10 text-pm-gold mb-4" />
        <h2 className="text-lg font-bold text-pm-off-white group-hover:text-pm-gold transition-colors mb-1">{title}</h2>
        <p className="text-xs text-pm-off-white/70 leading-relaxed">{description}</p>
    </Link>
);

export default Admin;