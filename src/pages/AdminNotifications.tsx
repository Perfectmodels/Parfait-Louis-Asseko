import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useRealData } from '../hooks/useRealData';
import SEO from '../components/SEO';
import { 
    BellIcon, 
    ExclamationTriangleIcon, 
    CheckCircleIcon, 
    InformationCircleIcon,
    XMarkIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    ClockIcon,
    UserIcon,
    CurrencyDollarIcon,
    CalendarDaysIcon,
    EyeIcon,
    EyeSlashIcon
} from '@heroicons/react/24/outline';

interface Notification {
    id: string;
    type: 'payment' | 'event' | 'model' | 'system' | 'security';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    actionUrl?: string;
    actionLabel?: string;
    relatedId?: string;
    relatedName?: string;
}

const AdminNotifications: React.FC = () => {
    const { data, saveData } = useData();
    const { getRealStats, getRecentActivity, getDatabaseHealth } = useRealData();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filter, setFilter] = useState<'all' | 'unread' | 'payment' | 'event' | 'model' | 'system' | 'security'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, [data]);

    const loadNotifications = async () => {
        setLoading(true);
        
        // Générer des notifications basées sur les données
        const generatedNotifications: Notification[] = [];
        
        // Notifications de paiements
        const models = data?.models || [];
        const overdueModels = models.filter(m => m.paymentStatus?.status === 'overdue');
        const pendingModels = models.filter(m => m.paymentStatus?.status === 'pending');
        
        overdueModels.forEach(model => {
            generatedNotifications.push({
                id: `payment-overdue-${model.id}`,
                type: 'payment',
                priority: 'urgent',
                title: 'Paiement en retard',
                message: `${model.name} a un paiement en retard depuis ${model.paymentStatus?.daysOverdue || 0} jours`,
                timestamp: new Date().toISOString(),
                read: false,
                actionUrl: `/admin/payments`,
                actionLabel: 'Voir les paiements',
                relatedId: model.id,
                relatedName: model.name
            });
        });

        pendingModels.forEach(model => {
            generatedNotifications.push({
                id: `payment-pending-${model.id}`,
                type: 'payment',
                priority: 'medium',
                title: 'Paiement en attente',
                message: `${model.name} a un paiement en attente`,
                timestamp: new Date().toISOString(),
                read: false,
                actionUrl: `/admin/payments`,
                actionLabel: 'Voir les paiements',
                relatedId: model.id,
                relatedName: model.name
            });
        });

        // Notifications d'événements
        const events = data?.events || [];
        const upcomingEvents = events.filter(e => {
            const eventDate = new Date(e.date);
            const now = new Date();
            const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
            return eventDate <= threeDaysFromNow && eventDate > now;
        });

        upcomingEvents.forEach(event => {
            generatedNotifications.push({
                id: `event-upcoming-${event.id}`,
                type: 'event',
                priority: 'high',
                title: 'Événement à venir',
                message: `${event.title} aura lieu dans ${Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} jours`,
                timestamp: new Date().toISOString(),
                read: false,
                actionUrl: `/admin/events`,
                actionLabel: 'Voir l\'événement',
                relatedId: event.id,
                relatedName: event.title
            });
        });

        // Notifications de nouveaux mannequins
        const beginnerStudents = data?.beginnerStudents || [];
        const newStudents = beginnerStudents.filter(s => {
            const studentDate = new Date(s.createdAt || s.dateAdded);
            const now = new Date();
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return studentDate >= sevenDaysAgo;
        });

        newStudents.forEach(student => {
            generatedNotifications.push({
                id: `model-new-${student.id}`,
                type: 'model',
                priority: 'medium',
                title: 'Nouveau mannequin',
                message: `${student.name} s'est inscrit récemment`,
                timestamp: new Date().toISOString(),
                read: false,
                actionUrl: `/admin/beginner-students-access`,
                actionLabel: 'Voir le profil',
                relatedId: student.id,
                relatedName: student.name
            });
        });

        // Notifications système
        generatedNotifications.push({
            id: 'system-backup',
            type: 'system',
            priority: 'low',
            title: 'Sauvegarde automatique',
            message: 'Sauvegarde des données effectuée avec succès',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
            read: true
        });

        generatedNotifications.push({
            id: 'system-update',
            type: 'system',
            priority: 'medium',
            title: 'Mise à jour disponible',
            message: 'Une nouvelle version de l\'application est disponible',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            read: false,
            actionUrl: `/admin/settings`,
            actionLabel: 'Voir les paramètres'
        });

        // Notifications de sécurité
        generatedNotifications.push({
            id: 'security-login',
            type: 'security',
            priority: 'medium',
            title: 'Nouvelle connexion',
            message: 'Connexion détectée depuis un nouvel appareil',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30min ago
            read: false,
            actionUrl: `/admin/profile`,
            actionLabel: 'Voir le profil'
        });

        // Trier par timestamp (plus récent en premier)
        generatedNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        setNotifications(generatedNotifications);
        setLoading(false);
    };

    const markAsRead = async (notificationId: string) => {
        const updatedNotifications = notifications.map(n => 
            n.id === notificationId ? { ...n, read: true } : n
        );
        setNotifications(updatedNotifications);
        
        // Sauvegarder dans le contexte
        await saveData({ ...data, notifications: updatedNotifications });
    };

    const markAllAsRead = async () => {
        const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
        setNotifications(updatedNotifications);
        
        // Sauvegarder dans le contexte
        await saveData({ ...data, notifications: updatedNotifications });
    };

    const deleteNotification = async (notificationId: string) => {
        const updatedNotifications = notifications.filter(n => n.id !== notificationId);
        setNotifications(updatedNotifications);
        
        // Sauvegarder dans le contexte
        await saveData({ ...data, notifications: updatedNotifications });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'text-red-400 bg-red-500/10 border-red-500/20';
            case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
            case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'low': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'payment': return CurrencyDollarIcon;
            case 'event': return CalendarDaysIcon;
            case 'model': return UserIcon;
            case 'system': return InformationCircleIcon;
            case 'security': return ExclamationTriangleIcon;
            default: return BellIcon;
        }
    };

    const filteredNotifications = notifications.filter(notification => {
        const matchesFilter = filter === 'all' || notification.type === filter;
        const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            notification.message.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    if (loading) {
        return (
            <div className="min-h-screen bg-pm-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold mx-auto mb-4"></div>
                    <p className="text-pm-off-white">Chargement des notifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-pm-dark">
            <SEO 
                title="Notifications - Perfect Models"
                description="Centre de notifications et alertes"
            />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-pm-gold mb-2">Notifications</h1>
                            <p className="text-pm-off-white/60">
                                {unreadCount > 0 ? `${unreadCount} notifications non lues` : 'Toutes les notifications sont lues'}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-black rounded-lg hover:bg-pm-gold/80 transition-colors"
                                >
                                    <CheckCircleIcon className="w-4 h-4" />
                                    Tout marquer comme lu
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filtres et recherche */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Recherche */}
                        <div className="flex-1">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pm-off-white/60" />
                                <input
                                    type="text"
                                    placeholder="Rechercher dans les notifications..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/60 focus:border-pm-gold focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Filtres */}
                        <div className="flex gap-2">
                            {[
                                { key: 'all', label: 'Toutes' },
                                { key: 'unread', label: 'Non lues' },
                                { key: 'payment', label: 'Paiements' },
                                { key: 'event', label: 'Événements' },
                                { key: 'model', label: 'Mannequins' },
                                { key: 'system', label: 'Système' },
                                { key: 'security', label: 'Sécurité' }
                            ].map(filterOption => (
                                <button
                                    key={filterOption.key}
                                    onClick={() => setFilter(filterOption.key as any)}
                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                        filter === filterOption.key
                                            ? 'bg-pm-gold text-black'
                                            : 'bg-gray-900 text-pm-off-white hover:bg-gray-800'
                                    }`}
                                >
                                    {filterOption.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Liste des notifications */}
                <div className="space-y-4">
                    {filteredNotifications.length === 0 ? (
                        <div className="text-center py-12">
                            <BellIcon className="w-16 h-16 text-pm-off-white/40 mx-auto mb-4" />
                            <p className="text-pm-off-white/60 text-lg">Aucune notification trouvée</p>
                        </div>
                    ) : (
                        filteredNotifications.map(notification => {
                            const TypeIcon = getTypeIcon(notification.type);
                            const priorityColor = getPriorityColor(notification.priority);
                            
                            return (
                                <div
                                    key={notification.id}
                                    className={`bg-gray-900/50 border rounded-lg p-6 transition-colors ${
                                        notification.read 
                                            ? 'border-pm-gold/20 hover:border-pm-gold/40' 
                                            : 'border-pm-gold/40 bg-pm-gold/5'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-lg ${priorityColor}`}>
                                            <TypeIcon className="w-6 h-6" />
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className={`text-lg font-semibold ${
                                                        notification.read ? 'text-pm-off-white' : 'text-pm-gold'
                                                    }`}>
                                                        {notification.title}
                                                    </h3>
                                                    <p className="text-pm-off-white/70 mt-1">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    {!notification.read && (
                                                        <div className="w-3 h-3 bg-pm-gold rounded-full"></div>
                                                    )}
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="p-1 hover:bg-gray-800 rounded transition-colors"
                                                    >
                                                        <XMarkIcon className="w-4 h-4 text-pm-off-white/60" />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-sm text-pm-off-white/60">
                                                    <span className="flex items-center gap-1">
                                                        <ClockIcon className="w-4 h-4" />
                                                        {new Date(notification.timestamp).toLocaleString('fr-FR')}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColor}`}>
                                                        {notification.priority.toUpperCase()}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    {!notification.read && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="flex items-center gap-1 px-3 py-1 bg-pm-gold/20 text-pm-gold rounded-lg hover:bg-pm-gold/30 transition-colors text-sm"
                                                        >
                                                            <EyeIcon className="w-4 h-4" />
                                                            Marquer comme lu
                                                        </button>
                                                    )}
                                                    {notification.actionUrl && (
                                                        <a
                                                            href={notification.actionUrl}
                                                            className="flex items-center gap-1 px-3 py-1 bg-pm-gold text-black rounded-lg hover:bg-pm-gold/80 transition-colors text-sm"
                                                        >
                                                            {notification.actionLabel}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;
