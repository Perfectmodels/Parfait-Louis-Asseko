import React from 'react';
import { 
    ArrowLeftIcon, 
    ChatBubbleLeftRightIcon, 
    EnvelopeIcon, 
    UserGroupIcon, 
    ChartBarIcon,
    PaperAirplaneIcon,
    DocumentArrowUpIcon,
    Cog6ToothIcon,
    EyeIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';

const AdminMessagingDashboard: React.FC = () => {
    const { data } = useData();
    
    // Calculer les vraies statistiques
    const totalMessages = data?.internalMessages?.length || 0;
    const unreadMessages = data?.internalMessages?.filter(msg => !msg.read).length || 0;
    const totalContacts = (data?.models?.length || 0) + (data?.beginnerStudents?.length || 0);
    const contactMessages = data?.contactMessages?.length || 0;
    const unreadContactMessages = data?.contactMessages?.filter(msg => !msg.read).length || 0;
    
    const messagingStats = {
        totalMessages: totalMessages + contactMessages,
        unreadMessages: unreadMessages + unreadContactMessages,
        activeCampaigns: 0, // À implémenter avec de vraies campagnes
        totalContacts: totalContacts,
        emailSentToday: 0, // À implémenter avec de vrais envois
        openRate: 0, // À implémenter avec de vraies métriques
        clickRate: 0 // À implémenter avec de vraies métriques
    };

    // Générer les activités récentes basées sur les vraies données
    const recentActivities = React.useMemo(() => {
        const activities: Array<{ type: string; message: string; time: string; status: string }> = [];
        
        // Messages internes récents
        if (data?.internalMessages?.length > 0) {
            const recentInternalMessages = data.internalMessages
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 2);
            
            recentInternalMessages.forEach(msg => {
                const timeDiff = Date.now() - new Date(msg.timestamp).getTime();
                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                activities.push({
                    type: 'message',
                    message: `Nouveau message de ${msg.senderName}`,
                    time: hours < 1 ? 'À l\'instant' : `Il y a ${hours}h`,
                    status: 'info'
                });
            });
        }
        
        // Messages de contact récents
        if (data?.contactMessages?.length > 0) {
            const recentContactMessages = data.contactMessages
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 2);
            
            recentContactMessages.forEach(msg => {
                const timeDiff = Date.now() - new Date(msg.timestamp).getTime();
                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                activities.push({
                    type: 'message',
                    message: `Message de contact de ${msg.name}`,
                    time: hours < 1 ? 'À l\'instant' : `Il y a ${hours}h`,
                    status: 'info'
                });
            });
        }
        
        return activities.slice(0, 4); // Limiter à 4 activités
    }, [data]);

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'email': return <EnvelopeIcon className="w-5 h-5 text-green-400" />;
            case 'message': return <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-400" />;
            case 'import': return <DocumentArrowUpIcon className="w-5 h-5 text-purple-400" />;
            case 'campaign': return <ChartBarIcon className="w-5 h-5 text-orange-400" />;
            default: return <EyeIcon className="w-5 h-5 text-gray-400" />;
        }
    };

    const getActivityColor = (status: string) => {
        switch (status) {
            case 'success': return 'text-green-400';
            case 'info': return 'text-blue-400';
            case 'warning': return 'text-orange-400';
            case 'error': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-pm-dark text-pm-off-white">
            <SEO 
                title="Tableau de Bord Messagerie - Admin" 
                description="Centre de contrôle pour toutes les fonctionnalités de messagerie"
            />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link 
                        to="/admin" 
                        className="flex items-center gap-2 text-pm-gold hover:text-pm-gold/80 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Retour au Panel Admin
                    </Link>
                </div>

                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-pm-gold mb-2">Centre de Messagerie</h1>
                        <p className="text-pm-off-white/70">Gérez toutes vos communications et campagnes marketing</p>
                    </div>

                    {/* Statistiques principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20">
                            <div className="flex items-center gap-3">
                                <ChatBubbleLeftRightIcon className="w-8 h-8 text-pm-gold" />
                                <div>
                                    <div className="text-2xl font-bold text-pm-gold">{messagingStats.totalMessages}</div>
                                    <div className="text-pm-off-white/70 text-sm">Messages totaux</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20">
                            <div className="flex items-center gap-3">
                                <EnvelopeIcon className="w-8 h-8 text-blue-400" />
                                <div>
                                    <div className="text-2xl font-bold text-blue-400">{messagingStats.unreadMessages}</div>
                                    <div className="text-pm-off-white/70 text-sm">Messages non lus</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20">
                            <div className="flex items-center gap-3">
                                <UserGroupIcon className="w-8 h-8 text-green-400" />
                                <div>
                                    <div className="text-2xl font-bold text-green-400">{messagingStats.totalContacts}</div>
                                    <div className="text-pm-off-white/70 text-sm">Contacts</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20">
                            <div className="flex items-center gap-3">
                                <ChartBarIcon className="w-8 h-8 text-purple-400" />
                                <div>
                                    <div className="text-2xl font-bold text-purple-400">{messagingStats.activeCampaigns}</div>
                                    <div className="text-pm-off-white/70 text-sm">Campagnes actives</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions rapides */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <Link
                            to="/admin/messaging"
                            className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20 hover:border-pm-gold/40 transition-all duration-300 hover:shadow-lg hover:shadow-pm-gold/10 group"
                        >
                            <ChatBubbleLeftRightIcon className="w-10 h-10 text-pm-gold mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-lg font-semibold text-pm-gold mb-2">Messagerie Interne</h3>
                            <p className="text-pm-off-white/70 text-sm mb-4">Communiquez avec les mannequins et étudiants</p>
                            <div className="flex items-center gap-2 text-sm text-pm-gold">
                                <span>Accéder</span>
                                <ArrowLeftIcon className="w-4 h-4 rotate-180" />
                            </div>
                        </Link>

                        <Link
                            to="/admin/new-email"
                            className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20 hover:border-pm-gold/40 transition-all duration-300 hover:shadow-lg hover:shadow-pm-gold/10 group"
                        >
                            <PaperAirplaneIcon className="w-10 h-10 text-pm-gold mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-lg font-semibold text-pm-gold mb-2">Nouvel Email</h3>
                            <p className="text-pm-off-white/70 text-sm mb-4">Envoyer un email personnalisé</p>
                            <div className="flex items-center gap-2 text-sm text-pm-gold">
                                <span>Composer</span>
                                <ArrowLeftIcon className="w-4 h-4 rotate-180" />
                            </div>
                        </Link>

                        <Link
                            to="/admin/marketing-campaigns"
                            className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20 hover:border-pm-gold/40 transition-all duration-300 hover:shadow-lg hover:shadow-pm-gold/10 group"
                        >
                            <ChartBarIcon className="w-10 h-10 text-pm-gold mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-lg font-semibold text-pm-gold mb-2">Campagnes Marketing</h3>
                            <p className="text-pm-off-white/70 text-sm mb-4">Gérez vos campagnes d'emailing</p>
                            <div className="flex items-center gap-2 text-sm text-pm-gold">
                                <span>Gérer</span>
                                <ArrowLeftIcon className="w-4 h-4 rotate-180" />
                            </div>
                        </Link>

                        <Link
                            to="/admin/import-contacts"
                            className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20 hover:border-pm-gold/40 transition-all duration-300 hover:shadow-lg hover:shadow-pm-gold/10 group"
                        >
                            <DocumentArrowUpIcon className="w-10 h-10 text-pm-gold mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-lg font-semibold text-pm-gold mb-2">Importer Contacts</h3>
                            <p className="text-pm-off-white/70 text-sm mb-4">Importez depuis votre répertoire</p>
                            <div className="flex items-center gap-2 text-sm text-pm-gold">
                                <span>Importer</span>
                                <ArrowLeftIcon className="w-4 h-4 rotate-180" />
                            </div>
                        </Link>

                        <Link
                            to="/admin/contact-management"
                            className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20 hover:border-pm-gold/40 transition-all duration-300 hover:shadow-lg hover:shadow-pm-gold/10 group"
                        >
                            <UserGroupIcon className="w-10 h-10 text-pm-gold mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-lg font-semibold text-pm-gold mb-2">Gestion Contacts</h3>
                            <p className="text-pm-off-white/70 text-sm mb-4">Organisez votre base de contacts</p>
                            <div className="flex items-center gap-2 text-sm text-pm-gold">
                                <span>Gérer</span>
                                <ArrowLeftIcon className="w-4 h-4 rotate-180" />
                            </div>
                        </Link>

                        <Link
                            to="/admin/email-diagnostic"
                            className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20 hover:border-pm-gold/40 transition-all duration-300 hover:shadow-lg hover:shadow-pm-gold/10 group"
                        >
                            <Cog6ToothIcon className="w-10 h-10 text-pm-gold mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-lg font-semibold text-pm-gold mb-2">Diagnostic Email</h3>
                            <p className="text-pm-off-white/70 text-sm mb-4">Tests et configuration email</p>
                            <div className="flex items-center gap-2 text-sm text-pm-gold">
                                <span>Diagnostiquer</span>
                                <ArrowLeftIcon className="w-4 h-4 rotate-180" />
                            </div>
                        </Link>
                    </div>

                    {/* Activité récente et performances */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Activité récente */}
                        <div className="bg-pm-dark/50 rounded-lg border border-pm-gold/20 overflow-hidden">
                            <div className="p-6 border-b border-pm-gold/20">
                                <h3 className="text-lg font-semibold text-pm-gold">Activité Récente</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                {recentActivities.map((activity, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        {getActivityIcon(activity.type)}
                                        <div className="flex-1">
                                            <p className="text-pm-off-white text-sm">{activity.message}</p>
                                            <p className={`text-xs ${getActivityColor(activity.status)}`}>{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Performances */}
                        <div className="bg-pm-dark/50 rounded-lg border border-pm-gold/20 overflow-hidden">
                            <div className="p-6 border-b border-pm-gold/20">
                                <h3 className="text-lg font-semibold text-pm-gold">Performances</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-pm-off-white text-sm">Taux d'ouverture</span>
                                        <span className="text-pm-gold font-semibold">{messagingStats.openRate}%</span>
                                    </div>
                                    <div className="w-full bg-black/30 rounded-full h-2">
                                        <div 
                                            className="bg-pm-gold h-2 rounded-full transition-all duration-300" 
                                            style={{ width: `${messagingStats.openRate}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-pm-off-white text-sm">Taux de clic</span>
                                        <span className="text-pm-gold font-semibold">{messagingStats.clickRate}%</span>
                                    </div>
                                    <div className="w-full bg-black/30 rounded-full h-2">
                                        <div 
                                            className="bg-blue-400 h-2 rounded-full transition-all duration-300" 
                                            style={{ width: `${messagingStats.clickRate}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-pm-off-white text-sm">Emails envoyés aujourd'hui</span>
                                        <span className="text-pm-gold font-semibold">{messagingStats.emailSentToday}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMessagingDashboard;
