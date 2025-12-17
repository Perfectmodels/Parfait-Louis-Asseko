/**
 * NotificationCenter Component
 * 
 * Centre de notifications en temps réel pour le panel admin.
 * Affiche toutes les nouvelles activités nécessitant l'attention de l'administrateur.
 * 
 * Fonctionnalités:
 * - Notifications en temps réel depuis Firebase
 * - 4 types de notifications: Casting, Booking, Messages, Perfect Fashion Day
 * - Badge de compteur de notifications non lues
 * - Marquer comme lu (individuellement ou en masse)
 * - Liens directs vers les pages concernées
 * - Horodatage relatif ("il y a X minutes")
 * - Animations fluides avec Framer Motion
 * - Raccourci clavier: Cmd/Ctrl + N
 * 
 * @author Perfect Models Management
 * @version 2.0
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BellIcon,
    XMarkIcon,
    ClipboardDocumentListIcon,
    BriefcaseIcon,
    EnvelopeIcon,
    CheckIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { useData } from '../../contexts/DataContext';

/**
 * Interface définissant la structure d'une notification
 */
interface Notification {
    id: string;           // Identifiant unique (type-itemId)
    type: 'casting' | 'booking' | 'message' | 'fashionday'; // Type de notification
    title: string;        // Titre de la notification
    description: string;  // Description détaillée
    link: string;        // Lien vers la page concernée
    date: Date;          // Date de création
    read: boolean;       // Statut de lecture
}

/**
 * Props du composant NotificationCenter
 */
interface NotificationCenterProps {
    isOpen: boolean;      // Contrôle l'affichage du panneau
    onClose: () => void;  // Callback pour fermer le panneau
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
    const { data } = useData();
    const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());

    const notifications = useMemo(() => {
        if (!data) return [];

        const notifs: Notification[] = [];

        // Casting applications
        (data.castingApplications || [])
            .filter(app => app.status === 'Nouveau')
            .forEach(app => {
                notifs.push({
                    id: `casting-${app.id}`,
                    type: 'casting',
                    title: 'Nouvelle candidature casting',
                    description: `${app.firstName} ${app.lastName} a postulé`,
                    link: '/admin/casting-applications',
                    date: new Date(app.submissionDate),
                    read: readNotifications.has(`casting-${app.id}`)
                });
            });

        // Booking requests
        (data.bookingRequests || [])
            .filter(req => req.status === 'Nouveau')
            .forEach(req => {
                notifs.push({
                    id: `booking-${req.id}`,
                    type: 'booking',
                    title: 'Nouvelle demande de booking',
                    description: `${req.clientName} souhaite réserver`,
                    link: '/admin/bookings',
                    date: new Date(req.submissionDate),
                    read: readNotifications.has(`booking-${req.id}`)
                });
            });

        // Contact messages
        (data.contactMessages || [])
            .filter(msg => msg.status === 'Nouveau')
            .forEach(msg => {
                notifs.push({
                    id: `message-${msg.id}`,
                    type: 'message',
                    title: 'Nouveau message de contact',
                    description: `${msg.name} vous a envoyé un message`,
                    link: '/admin/messages',
                    date: new Date(msg.timestamp),
                    read: readNotifications.has(`message-${msg.id}`)
                });
            });

        // Fashion Day reservations
        (data.fashionDayReservations || [])
            .filter(res => res.status === 'En attente')
            .forEach(res => {
                notifs.push({
                    id: `fashionday-${res.id}`,
                    type: 'fashionday',
                    title: 'Nouvelle réservation PFD',
                    description: `${res.name} a réservé`,
                    link: '/admin/fashion-day-reservations',
                    date: new Date(res.submissionDate),
                    read: readNotifications.has(`fashionday-${res.id}`)
                });
            });

        return notifs.sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [data, readNotifications]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setReadNotifications(prev => new Set([...prev, id]));
    };

    const markAllAsRead = () => {
        setReadNotifications(new Set(notifications.map(n => n.id)));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'casting': return ClipboardDocumentListIcon;
            case 'booking': return BriefcaseIcon;
            case 'message': return EnvelopeIcon;
            case 'fashionday': return SparklesIcon;
            default: return BellIcon;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'casting': return 'text-blue-400';
            case 'booking': return 'text-green-400';
            case 'message': return 'text-purple-400';
            case 'fashionday': return 'text-pm-gold';
            default: return 'text-gray-400';
        }
    };

    const timeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return `il y a ${Math.floor(interval)} ans`;
        interval = seconds / 2592000;
        if (interval > 1) return `il y a ${Math.floor(interval)} mois`;
        interval = seconds / 86400;
        if (interval > 1) return `il y a ${Math.floor(interval)} jours`;
        interval = seconds / 3600;
        if (interval > 1) return `il y a ${Math.floor(interval)} heures`;
        interval = seconds / 60;
        if (interval > 1) return `il y a ${Math.floor(interval)} minutes`;
        return "à l'instant";
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full max-w-md bg-pm-dark border border-pm-gold/30 rounded-xl shadow-2xl overflow-hidden"
                    style={{ maxHeight: 'calc(100vh - 5rem)' }}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-black/90 backdrop-blur-sm border-b border-pm-gold/20 px-4 py-4 z-10">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <BellIcon className="w-6 h-6 text-pm-gold" />
                                <h2 className="text-lg font-bold text-pm-off-white">Notifications</h2>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-pm-gold/10 rounded-md transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5 text-pm-off-white/60" />
                            </button>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-pm-gold hover:text-pm-gold/80 transition-colors flex items-center gap-1"
                            >
                                <CheckIcon className="w-4 h-4" />
                                Tout marquer comme lu
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-pm-gold/10">
                                {notifications.map((notification) => {
                                    const Icon = getIcon(notification.type);
                                    return (
                                        <Link
                                            key={notification.id}
                                            to={notification.link}
                                            onClick={() => {
                                                markAsRead(notification.id);
                                                onClose();
                                            }}
                                            className={`block px-4 py-4 hover:bg-pm-gold/5 transition-colors ${!notification.read ? 'bg-pm-gold/10' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-lg bg-pm-dark border border-pm-gold/20 ${getColor(notification.type)}`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h3 className="font-semibold text-pm-off-white text-sm">
                                                            {notification.title}
                                                        </h3>
                                                        {!notification.read && (
                                                            <span className="w-2 h-2 bg-pm-gold rounded-full flex-shrink-0 mt-1" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-pm-off-white/70 mt-1">
                                                        {notification.description}
                                                    </p>
                                                    <p className="text-xs text-pm-off-white/50 mt-2">
                                                        {timeAgo(notification.date)}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-pm-off-white/60">
                                <BellIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="text-sm">Aucune notification</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default NotificationCenter;
