import { useData } from '../contexts/DataContext';

export interface AdminDataSync {
  // Données des mannequins
  models: {
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
    paymentStatus: {
      upToDate: number;
      pending: number;
      overdue: number;
    };
  };
  
  // Données des étudiants débutants
  beginnerStudents: {
    total: number;
    active: number;
    graduated: number;
    newThisMonth: number;
  };
  
  // Données financières
  financial: {
    totalRevenue: number;
    monthlyRevenue: number;
    pendingPayments: number;
    overduePayments: number;
    totalExpenses: number;
    netProfit: number;
  };
  
  // Données des événements
  events: {
    totalEvents: number;
    upcomingEvents: number;
    completedEvents: number;
    totalParticipants: number;
  };
  
  // Données des candidatures
  applications: {
    castingApplications: number;
    fashionDayApplications: number;
    newApplications: number;
    pendingApplications: number;
  };
  
  // Données de communication
  communication: {
    totalMessages: number;
    unreadMessages: number;
    totalNotifications: number;
    unreadNotifications: number;
  };
  
  // Données de contenu
  content: {
    totalArticles: number;
    publishedArticles: number;
    totalAlbums: number;
    totalPhotos: number;
  };
}

export class AdminDataSyncService {
  private data: any;
  private saveData: (data: any) => Promise<void>;

  constructor(data: any, saveData: (data: any) => Promise<void>) {
    this.data = data;
    this.saveData = saveData;
  }

  /**
   * Synchronise toutes les données admin
   */
  async syncAllData(forceSync: boolean = false): Promise<AdminDataSync> {
    // Vérifier si une synchronisation récente existe
    const lastSync = this.data?.adminSyncMetadata?.lastSync;
    const now = new Date();
    const lastSyncTime = lastSync ? new Date(lastSync) : null;
    
    // Si une synchronisation a eu lieu dans les 5 dernières minutes et qu'on ne force pas
    if (!forceSync && lastSyncTime && (now.getTime() - lastSyncTime.getTime()) < 5 * 60 * 1000) {
      console.log('Synchronisation récente détectée, utilisation des données en cache');
      return this.data?.adminSyncMetadata?.data || this.getEmptySyncData();
    }

    const syncData: AdminDataSync = {
      models: this.getModelsData(),
      beginnerStudents: this.getBeginnerStudentsData(),
      financial: this.getFinancialData(),
      events: this.getEventsData(),
      applications: this.getApplicationsData(),
      communication: this.getCommunicationData(),
      content: this.getContentData()
    };

    // Mettre à jour les métadonnées de synchronisation
    await this.updateSyncMetadata(syncData);

    return syncData;
  }

  /**
   * Retourne des données vides pour éviter les erreurs
   */
  private getEmptySyncData(): AdminDataSync {
    return {
      models: { total: 0, active: 0, inactive: 0, newThisMonth: 0, paymentStatus: { upToDate: 0, pending: 0, overdue: 0 } },
      beginnerStudents: { total: 0, active: 0, graduated: 0, newThisMonth: 0 },
      financial: { totalRevenue: 0, monthlyRevenue: 0, pendingPayments: 0, overduePayments: 0, totalExpenses: 0, netProfit: 0 },
      events: { totalEvents: 0, upcomingEvents: 0, completedEvents: 0, totalParticipants: 0 },
      applications: { castingApplications: 0, fashionDayApplications: 0, newApplications: 0, pendingApplications: 0 },
      communication: { totalMessages: 0, unreadMessages: 0, totalNotifications: 0, unreadNotifications: 0 },
      content: { totalArticles: 0, publishedArticles: 0, totalAlbums: 0, totalPhotos: 0 }
    };
  }

  /**
   * Données des mannequins
   */
  private getModelsData() {
    const models = this.data?.models || [];
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    return {
      total: models.length,
      active: models.filter((m: any) => m.isActive).length,
      inactive: models.filter((m: any) => !m.isActive).length,
      newThisMonth: models.filter((m: any) => {
        const createdDate = new Date(m.createdAt || m.submissionDate);
        return createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear;
      }).length,
      paymentStatus: {
        upToDate: models.filter((m: any) => m.paymentStatus?.status === 'upToDate').length,
        pending: models.filter((m: any) => m.paymentStatus?.status === 'pending').length,
        overdue: models.filter((m: any) => m.paymentStatus?.status === 'overdue').length
      }
    };
  }

  /**
   * Données des étudiants débutants
   */
  private getBeginnerStudentsData() {
    const students = this.data?.beginnerStudents || [];
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    return {
      total: students.length,
      active: students.filter((s: any) => s.isActive).length,
      graduated: students.filter((s: any) => s.status === 'graduated').length,
      newThisMonth: students.filter((s: any) => {
        const createdDate = new Date(s.createdAt || s.submissionDate);
        return createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear;
      }).length
    };
  }

  /**
   * Données financières
   */
  private getFinancialData() {
    const transactions = this.data?.accountingTransactions || [];
    const payments = this.data?.paymentSubmissions || [];
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const monthlyTransactions = transactions.filter((t: any) => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === thisMonth && transactionDate.getFullYear() === thisYear;
    });

    const totalRevenue = transactions
      .filter((t: any) => t.category === 'revenue')
      .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

    const monthlyRevenue = monthlyTransactions
      .filter((t: any) => t.category === 'revenue')
      .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

    const totalExpenses = transactions
      .filter((t: any) => t.category === 'expense')
      .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

    return {
      totalRevenue,
      monthlyRevenue,
      pendingPayments: payments.filter((p: any) => p.status === 'pending').length,
      overduePayments: payments.filter((p: any) => p.status === 'overdue').length,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses
    };
  }

  /**
   * Données des événements
   */
  private getEventsData() {
    const events = this.data?.fashionDayEvents || [];
    const now = new Date();

    return {
      totalEvents: events.length,
      upcomingEvents: events.filter((e: any) => new Date(e.date) > now).length,
      completedEvents: events.filter((e: any) => new Date(e.date) <= now).length,
      totalParticipants: events.reduce((sum: number, e: any) => sum + (e.participants?.length || 0), 0)
    };
  }

  /**
   * Données des candidatures
   */
  private getApplicationsData() {
    const castingApps = this.data?.castingApplications || [];
    const fashionDayApps = this.data?.fashionDayApplications || [];

    return {
      castingApplications: castingApps.length,
      fashionDayApplications: fashionDayApps.length,
      newApplications: [...castingApps, ...fashionDayApps]
        .filter((app: any) => app.status === 'Nouveau').length,
      pendingApplications: [...castingApps, ...fashionDayApps]
        .filter((app: any) => app.status === 'En attente').length
    };
  }

  /**
   * Données de communication
   */
  private getCommunicationData() {
    const messages = this.data?.contactMessages || [];
    const notifications = this.data?.notifications || [];

    return {
      totalMessages: messages.length,
      unreadMessages: messages.filter((m: any) => !m.read).length,
      totalNotifications: notifications.length,
      unreadNotifications: notifications.filter((n: any) => !n.read).length
    };
  }

  /**
   * Données de contenu
   */
  private getContentData() {
    const articles = this.data?.articles || [];
    const albums = this.data?.albums || [];
    const news = this.data?.newsItems || [];

    return {
      totalArticles: articles.length,
      publishedArticles: articles.filter((a: any) => a.published).length,
      totalAlbums: albums.length,
      totalPhotos: albums.reduce((sum: number, album: any) => sum + (album.photos?.length || 0), 0)
    };
  }

  /**
   * Met à jour les métadonnées de synchronisation
   */
  private async updateSyncMetadata(syncData: AdminDataSync) {
    const syncMetadata = {
      lastSync: new Date().toISOString(),
      data: syncData,
      version: '1.0.0'
    };

    // Sauvegarder les métadonnées de synchronisation
    await this.saveData({
      ...this.data,
      adminSyncMetadata: syncMetadata
    });
  }

  /**
   * Génère un rapport de synchronisation
   */
  generateSyncReport(syncData: AdminDataSync) {
    return {
      timestamp: new Date().toISOString(),
      summary: {
        totalModels: syncData.models.total,
        totalRevenue: syncData.financial.totalRevenue,
        totalEvents: syncData.events.totalEvents,
        totalApplications: syncData.applications.castingApplications + syncData.applications.fashionDayApplications
      },
      health: {
        modelsHealth: syncData.models.active / syncData.models.total,
        financialHealth: syncData.financial.netProfit > 0,
        communicationHealth: syncData.communication.unreadMessages < 10
      }
    };
  }
}

/**
 * Hook pour utiliser le service de synchronisation
 */
export const useAdminDataSync = () => {
  const { data, saveData } = useData();

  const syncService = new AdminDataSyncService(data, saveData);

  const syncAllData = async (forceSync: boolean = false) => {
    return await syncService.syncAllData(forceSync);
  };

  const generateReport = (syncData: AdminDataSync) => {
    return syncService.generateSyncReport(syncData);
  };

  return {
    syncAllData,
    generateReport,
    syncService
  };
};
