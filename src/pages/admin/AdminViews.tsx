import React from 'react';
import { 
    UsersIcon, UserGroupIcon, CurrencyDollarIcon, KeyIcon, 
    ClipboardDocumentCheckIcon, PaintBrushIcon, ClipboardDocumentListIcon,
    SparklesIcon, CalendarDaysIcon, BookOpenIcon, NewspaperIcon,
    ChartBarIcon, UserIcon, ServerIcon, ShieldCheckIcon,
    CpuChipIcon, EnvelopeIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon,
    PaperAirplaneIcon, DocumentArrowUpIcon, BellIcon
} from '@heroicons/react/24/outline';
import DashboardCard from '../../components/DashboardCard';
import InteractiveDashboardCard from '../../components/InteractiveDashboardCard';

// Mannequins View Component - Gestion harmonisée des mannequins
export const MannequinsView: React.FC<{ data: any }> = React.memo(({ data }) => (
    <div className="space-y-4">
        <div>
            <h2 className="text-2xl font-bold text-pm-gold">Gestion des Mannequins</h2>
            <p className="text-pm-off-white/60">Recrutement, gestion et suivi des mannequins</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InteractiveDashboardCard 
                title="Mannequins Professionnels" 
                icon={UsersIcon} 
                link="/admin/models" 
                description="Gérer les profils des mannequins professionnels"
                stats={{
                    total: data?.models?.length || 0,
                    new: data?.models?.filter((m: any) => m.isActive)?.length || 0,
                    pending: data?.models?.filter((m: any) => !m.isActive)?.length || 0
                }}
            />
            <InteractiveDashboardCard 
                title="Mannequins Débutants" 
                icon={UserGroupIcon} 
                link="/admin/beginner-students-access" 
                description="Consulter et promouvoir les mannequins en formation"
                stats={{
                    total: data?.beginnerStudents?.length || 0,
                    new: data?.beginnerStudents?.filter((s: any) => s.isActive)?.length || 0,
                    pending: data?.beginnerStudents?.filter((s: any) => !s.isActive)?.length || 0
                }}
            />
            <DashboardCard 
                title="Gestion des Paiements" 
                icon={CurrencyDollarIcon} 
                link="/admin/payments" 
                description="Enregistrer les paiements des mannequins"
            />
            <DashboardCard 
                title="Accès et Identifiants" 
                icon={KeyIcon} 
                link="/admin/model-access" 
                description="Gérer les accès et identifiants"
            />
            <DashboardCard 
                title="Soumissions de Paiement" 
                icon={ClipboardDocumentCheckIcon} 
                link="/admin/payment-submissions" 
                description="Valider les paiements soumis par les mannequins"
            />
            <DashboardCard 
                title="Direction Artistique" 
                icon={PaintBrushIcon} 
                link="/admin/artistic-direction" 
                description="Assigner des thèmes de séance photo"
            />
        </div>
    </div>
));

// Casting View Component - Gestion harmonisée des candidatures et événements
export const CastingView: React.FC<{ newCastingApps: number; newFashionDayApps: number; data: any; generateNotifications: any }> = React.memo(({ newCastingApps, newFashionDayApps, data, generateNotifications }) => (
    <div className="space-y-4">
        <div>
            <h2 className="text-2xl font-bold text-pm-gold">Casting & Événements</h2>
            <p className="text-pm-off-white/60">Gérer les candidatures et événements</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InteractiveDashboardCard 
                title="Candidatures Casting" 
                icon={ClipboardDocumentListIcon} 
                link="/admin/casting-applications" 
                description="Traiter les candidatures pour les castings" 
                notificationCount={newCastingApps}
                notifications={generateNotifications(data, 'casting')}
                stats={{
                    total: data?.castingApplications?.length || 0,
                    new: newCastingApps,
                    pending: data?.castingApplications?.filter((app: any) => app.status === 'pending')?.length || 0
                }}
            />
            <DashboardCard 
                title="Résultats Casting" 
                icon={ClipboardDocumentCheckIcon} 
                link="/admin/casting-results" 
                description="Valider les candidats et créer leurs profils"
            />
            <InteractiveDashboardCard 
                title="Candidatures Fashion Day" 
                icon={SparklesIcon} 
                link="/admin/fashion-day-applications" 
                description="Gérer les candidatures pour le PFD" 
                notificationCount={newFashionDayApps}
                notifications={generateNotifications(data, 'fashion-day')}
                stats={{
                    total: data?.fashionDayApplications?.length || 0,
                    new: newFashionDayApps,
                    pending: data?.fashionDayApplications?.filter((app: any) => app.status === 'pending')?.length || 0
                }}
            />
            <DashboardCard 
                title="Événements PFD" 
                icon={CalendarDaysIcon} 
                link="/admin/fashion-day-events" 
                description="Configurer les éditions du Perfect Fashion Day"
            />
        </div>
    </div>
));

// Content View Component - Gestion harmonisée du contenu
export const ContentView: React.FC = React.memo(() => (
    <div className="space-y-4">
        <div>
            <h2 className="text-2xl font-bold text-pm-gold">Contenu du Site</h2>
            <p className="text-pm-off-white/60">Gérer le contenu éditorial et pédagogique</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard 
                title="Magazine" 
                icon={NewspaperIcon} 
                link="/admin/magazine" 
                description="Gérer les articles et publications"
            />
            <DashboardCard 
                title="Formations" 
                icon={BookOpenIcon} 
                link="/admin/classroom" 
                description="Contenu pédagogique et modules"
            />
            <DashboardCard 
                title="Galerie" 
                icon={ChartBarIcon} 
                link="/admin/gallery" 
                description="Gérer les photos et médias"
            />
            <DashboardCard 
                title="Actualités" 
                icon={NewspaperIcon} 
                link="/admin/news" 
                description="Gérer les actualités et annonces"
            />
        </div>
    </div>
));

// Messagerie View Component - Centre de messagerie unifié
export const MessagerieView: React.FC<{ data: any }> = React.memo(() => (
    <div className="space-y-4">
        <div>
            <h2 className="text-2xl font-bold text-pm-gold">Centre de Messagerie</h2>
            <p className="text-pm-off-white/60">Communication, campagnes et gestion des contacts</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InteractiveDashboardCard 
                title="Tableau de Bord Messagerie" 
                icon={ChatBubbleLeftRightIcon} 
                link="/admin/messaging-dashboard" 
                description="Centre de contrôle pour toutes les communications"
                stats={{
                    total: 1247,
                    new: 23,
                    pending: 3
                }}
            />
            <InteractiveDashboardCard 
                title="Messagerie Interne" 
                icon={ChatBubbleLeftRightIcon} 
                link="/admin/messaging" 
                description="Communiquez avec les mannequins et étudiants"
                stats={{
                    total: 1247,
                    new: 23,
                    pending: 3
                }}
            />
            <DashboardCard 
                title="Nouvel Email" 
                icon={PaperAirplaneIcon} 
                link="/admin/new-email" 
                description="Envoyer un email personnalisé"
            />
            <DashboardCard 
                title="Campagnes Marketing" 
                icon={ChartBarIcon} 
                link="/admin/marketing-campaigns" 
                description="Gérez vos campagnes d'emailing"
            />
            <DashboardCard 
                title="Importer Contacts" 
                icon={DocumentArrowUpIcon} 
                link="/admin/import-contacts" 
                description="Importez depuis votre répertoire"
            />
            <DashboardCard 
                title="Gestion Contacts" 
                icon={UserGroupIcon} 
                link="/admin/contact-management" 
                description="Organisez votre base de contacts"
            />
            <DashboardCard 
                title="Diagnostic Email" 
                icon={EnvelopeIcon} 
                link="/admin/email-diagnostic" 
                description="Tests et configuration email"
            />
            <DashboardCard 
                title="Test Brevo" 
                icon={CpuChipIcon} 
                link="/admin/brevo-test" 
                description="Validation de la configuration Brevo"
            />
        </div>
    </div>
));

// Technique View Component - Outils techniques harmonisés
export const TechniqueView: React.FC<{ data: any }> = React.memo(({ data }) => (
    <div className="space-y-4">
        <div>
            <h2 className="text-2xl font-bold text-pm-gold">Outils Techniques</h2>
            <p className="text-pm-off-white/60">Monitoring, sécurité et maintenance du système</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard 
                title="Monitoring Serveur" 
                icon={ServerIcon} 
                link="/admin/server" 
                description="Surveillance des performances et statut du serveur"
            />
            <DashboardCard 
                title="Gestion Base de Données" 
                icon={ServerIcon} 
                link="/admin/database" 
                description="Administration et maintenance de la base de données"
            />
            <DashboardCard 
                title="Clés API" 
                icon={KeyIcon} 
                link="/admin/api-keys" 
                description="Configuration et surveillance des clés API"
            />
            <DashboardCard 
                title="Centre de Sécurité" 
                icon={ShieldCheckIcon} 
                link="/admin/security" 
                description="Surveillance des menaces et audit de sécurité"
            />
            <DashboardCard 
                title="Diagnostic Email" 
                icon={EnvelopeIcon} 
                link="/admin/email-diagnostic" 
                description="Tests et diagnostic du système d'email"
            />
            <DashboardCard 
                title="Tests Brevo" 
                icon={CpuChipIcon} 
                link="/admin/brevo-test" 
                description="Validation de la configuration Brevo"
            />
        </div>
    </div>
));

// Paramètres View Component - Configuration harmonisée
export const ParametresView: React.FC<{ data: any }> = React.memo(({ data }) => (
    <div className="space-y-4">
        <div>
            <h2 className="text-2xl font-bold text-pm-gold">Paramètres</h2>
            <p className="text-pm-off-white/60">Configuration du site et de l'équipe</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard 
                title="Mon Profil" 
                icon={UserIcon} 
                link="/admin/profile" 
                description="Gérer mes informations personnelles et préférences"
            />
            <DashboardCard 
                title="Analytics" 
                icon={ChartBarIcon} 
                link="/admin/analytics" 
                description="Métriques et performances en temps réel"
            />
            <DashboardCard 
                title="Notifications" 
                icon={BellIcon} 
                link="/admin/notifications" 
                description="Centre d'alertes et notifications"
            />
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
            <DashboardCard 
                title="Suivi des Mannequins" 
                icon={ChartBarIcon} 
                link="/admin/model-tracking" 
                description="Tableau de bord de performance"
            />
            <DashboardCard 
                title="Gestion des Utilisateurs" 
                icon={UserIcon} 
                link="/admin/user-management" 
                description="Créer et gérer les comptes administrateurs"
            />
        </div>
    </div>
));
