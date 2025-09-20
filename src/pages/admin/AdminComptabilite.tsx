import React from 'react';
import { Link } from 'react-router-dom';
import InteractiveDashboardCard from '../../components/InteractiveDashboardCard';
import { 
    CurrencyDollarIcon, 
    ClipboardDocumentCheckIcon, 
    ChartBarIcon, 
    CalendarIcon, 
    EnvelopeIcon, 
    ExclamationTriangleIcon 
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

export const ComptabiliteView: React.FC<{ newBookingRequests: number; newMessages: number; newRecoveryRequests: number; data: any; generateNotifications: any }> = React.memo(({ newBookingRequests, newMessages, newRecoveryRequests, data, generateNotifications }) => (
    <div className="space-y-4">
        <div>
            <h2 className="text-2xl font-bold text-pm-gold">Comptabilité</h2>
            <p className="text-pm-off-white/60">Gérer les finances et les paiements</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard 
                title="Bilan Comptable" 
                icon={CurrencyDollarIcon} 
                link="/admin/accounting" 
                description="Gérer les revenus, dépenses et générer des rapports PDF"
            />
            <DashboardCard 
                title="Gestion des Paiements" 
                icon={ClipboardDocumentCheckIcon} 
                link="/admin/payments" 
                description="Enregistrer et suivre les paiements des mannequins"
            />
            <DashboardCard 
                title="Statuts de Paiement" 
                icon={ChartBarIcon} 
                link="/admin/payment-status" 
                description="Vue d'ensemble des statuts de paiement"
            />
            <InteractiveDashboardCard 
                title="Soumissions de Paiement" 
                icon={ClipboardDocumentCheckIcon} 
                link="/admin/payment-submissions" 
                description="Valider les paiements soumis par les mannequins" 
                notificationCount={data?.paymentSubmissions?.filter((sub: any) => sub.status === 'pending')?.length || 0}
                notifications={generateNotifications(data, 'payment-submissions')}
            />
            <InteractiveDashboardCard 
                title="Demandes de Réservation" 
                icon={CalendarIcon} 
                link="/admin/bookings" 
                description="Gérer les demandes de réservation" 
                notificationCount={newBookingRequests}
                notifications={generateNotifications(data, 'bookings')}
            />
            <InteractiveDashboardCard 
                title="Messages" 
                icon={EnvelopeIcon} 
                link="/admin/messages" 
                description="Consulter les messages reçus" 
                notificationCount={newMessages}
                notifications={generateNotifications(data, 'messages')}
            />
            <InteractiveDashboardCard 
                title="Demandes de Récupération" 
                icon={ExclamationTriangleIcon} 
                link="/admin/recovery-requests" 
                description="Gérer les demandes de récupération d'accès" 
                notificationCount={newRecoveryRequests}
                notifications={generateNotifications(data, 'recovery')}
            />
        </div>
    </div>
));
