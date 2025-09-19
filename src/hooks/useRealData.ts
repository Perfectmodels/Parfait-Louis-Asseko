import { useData } from '../contexts/DataContext';

export const useRealData = () => {
    const { data } = useData();

    const getRealStats = () => {
        if (!data) {
            return {
                totalModels: 0,
                totalBeginnerStudents: 0,
                totalContactMessages: 0,
                totalCastingApplications: 0,
                totalFashionDayApplications: 0,
                totalBookingRequests: 0,
                totalRecoveryRequests: 0,
                totalArticles: 0,
                totalNewsItems: 0,
                totalTestimonials: 0,
                totalFashionDayEvents: 0,
                totalForumThreads: 0,
                totalForumReplies: 0,
                totalArticleComments: 0,
                totalAbsences: 0,
                totalMonthlyPayments: 0,
                totalPhotoshootBriefs: 0,
                totalAccountingTransactions: 0,
                totalPaymentSubmissions: 0,
                totalAlbums: 0,
                totalTeamMembers: 0,
                totalSocialPosts: 0,
                totalSocialUsers: 0,
                totalSocialNotifications: 0,
                totalModelActivities: 0,
                totalModelPerformances: 0,
                totalModelTrackingData: 0
            };
        }

        return {
            totalModels: data.models?.length || 0,
            totalBeginnerStudents: data.beginnerStudents?.length || 0,
            totalContactMessages: data.contactMessages?.length || 0,
            totalCastingApplications: data.castingApplications?.length || 0,
            totalFashionDayApplications: data.fashionDayApplications?.length || 0,
            totalBookingRequests: data.bookingRequests?.length || 0,
            totalRecoveryRequests: data.recoveryRequests?.length || 0,
            totalArticles: data.articles?.length || 0,
            totalNewsItems: data.newsItems?.length || 0,
            totalTestimonials: data.testimonials?.length || 0,
            totalFashionDayEvents: data.fashionDayEvents?.length || 0,
            totalForumThreads: data.forumThreads?.length || 0,
            totalForumReplies: data.forumReplies?.length || 0,
            totalArticleComments: data.articleComments?.length || 0,
            totalAbsences: data.absences?.length || 0,
            totalMonthlyPayments: data.monthlyPayments?.length || 0,
            totalPhotoshootBriefs: data.photoshootBriefs?.length || 0,
            totalAccountingTransactions: data.accountingTransactions?.length || 0,
            totalPaymentSubmissions: data.paymentSubmissions?.length || 0,
            totalAlbums: data.albums?.length || 0,
            totalTeamMembers: data.teamMembers?.length || 0,
            totalSocialPosts: data.socialPosts?.length || 0,
            totalSocialUsers: data.socialUsers?.length || 0,
            totalSocialNotifications: data.socialNotifications?.length || 0,
            totalModelActivities: data.modelActivities?.length || 0,
            totalModelPerformances: data.modelPerformances?.length || 0,
            totalModelTrackingData: data.modelTrackingData?.length || 0
        };
    };

    const getRecentActivity = () => {
        if (!data) return [];

        const activities = [];

        // Messages de contact récents
        if (data.contactMessages && data.contactMessages.length > 0) {
            const recentMessages = data.contactMessages
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 3);
            
            recentMessages.forEach(message => {
                activities.push({
                    type: 'contact',
                    title: 'Nouveau message de contact',
                    description: `De: ${message.name} - ${message.email}`,
                    timestamp: message.timestamp,
                    icon: 'ChatBubbleLeftRightIcon'
                });
            });
        }

        // Candidatures de casting récentes
        if (data.castingApplications && data.castingApplications.length > 0) {
            const recentApplications = data.castingApplications
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 3);
            
            recentApplications.forEach(application => {
                activities.push({
                    type: 'casting',
                    title: 'Nouvelle candidature casting',
                    description: `De: ${application.name}`,
                    timestamp: application.timestamp,
                    icon: 'UserIcon'
                });
            });
        }

        // Candidatures Fashion Day récentes
        if (data.fashionDayApplications && data.fashionDayApplications.length > 0) {
            const recentFashionDay = data.fashionDayApplications
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 3);
            
            recentFashionDay.forEach(application => {
                activities.push({
                    type: 'fashion-day',
                    title: 'Nouvelle candidature Fashion Day',
                    description: `De: ${application.name}`,
                    timestamp: application.timestamp,
                    icon: 'SparklesIcon'
                });
            });
        }

        // Demandes de récupération récentes
        if (data.recoveryRequests && data.recoveryRequests.length > 0) {
            const recentRecovery = data.recoveryRequests
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 2);
            
            recentRecovery.forEach(request => {
                activities.push({
                    type: 'recovery',
                    title: 'Demande de récupération',
                    description: `De: ${request.name}`,
                    timestamp: request.timestamp,
                    icon: 'ArrowPathIcon'
                });
            });
        }

        // Trier par timestamp et retourner les 10 plus récents
        return activities
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10);
    };

    const getDatabaseHealth = () => {
        if (!data) return { status: 'error', message: 'Données non disponibles' };

        const stats = getRealStats();
        const totalData = Object.values(stats).reduce((sum, count) => sum + count, 0);

        if (totalData === 0) {
            return { status: 'warning', message: 'Base de données vide' };
        }

        if (totalData < 10) {
            return { status: 'warning', message: 'Base de données peu remplie' };
        }

        return { status: 'healthy', message: 'Base de données en bonne santé' };
    };

    return {
        data,
        getRealStats,
        getRecentActivity,
        getDatabaseHealth
    };
};
