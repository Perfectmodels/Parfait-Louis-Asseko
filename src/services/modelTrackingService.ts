import { ModelActivity, ModelPerformance, ModelTrackingData } from '../types';

export class ModelTrackingService {
  private static instance: ModelTrackingService;
  private activities: ModelActivity[] = [];
  private performances: ModelPerformance[] = [];
  private trackingData: ModelTrackingData[] = [];

  static getInstance(): ModelTrackingService {
    if (!ModelTrackingService.instance) {
      ModelTrackingService.instance = new ModelTrackingService();
    }
    return ModelTrackingService.instance;
  }

  // Enregistrer une activité
  recordActivity(
    modelId: string,
    type: ModelActivity['type'],
    title: string,
    description: string,
    metadata?: ModelActivity['metadata']
  ): ModelActivity {
    const activity: ModelActivity = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      modelId,
      type,
      title,
      description,
      timestamp: new Date().toISOString(),
      metadata,
      isRead: false
    };

    this.activities.push(activity);
    this.updatePerformance(modelId, type, metadata);
    
    return activity;
  }

  // Mettre à jour les performances
  private updatePerformance(modelId: string, activityType: string, metadata?: any): void {
    let performance = this.performances.find(p => p.modelId === modelId);
    
    if (!performance) {
      performance = {
        modelId,
        totalQuizAttempts: 0,
        averageQuizScore: 0,
        totalLoginDays: 0,
        lastLoginDate: new Date().toISOString(),
        totalBookings: 0,
        totalCastings: 0,
        forumPosts: 0,
        paymentCompliance: 0,
        overallScore: 0,
        lastUpdated: new Date().toISOString()
      };
      this.performances.push(performance);
    }

    // Mettre à jour selon le type d'activité
    switch (activityType) {
      case 'login':
        performance.totalLoginDays++;
        performance.lastLoginDate = new Date().toISOString();
        break;
      case 'quiz_completed':
        if (metadata?.quizScore) {
          performance.totalQuizAttempts++;
          const totalScore = performance.averageQuizScore * (performance.totalQuizAttempts - 1) + metadata.quizScore;
          performance.averageQuizScore = Math.round(totalScore / performance.totalQuizAttempts);
        }
        break;
      case 'booking_requested':
        performance.totalBookings++;
        break;
      case 'casting_applied':
        performance.totalCastings++;
        break;
      case 'forum_post':
        performance.forumPosts++;
        break;
    }

    // Calculer le score global
    performance.overallScore = this.calculateOverallScore(performance);
    performance.lastUpdated = new Date().toISOString();
  }

  // Calculer le score global de performance
  private calculateOverallScore(performance: ModelPerformance): number {
    const weights = {
      quizScore: 0.3,
      loginDays: 0.2,
      bookings: 0.2,
      castings: 0.15,
      forumPosts: 0.1,
      paymentCompliance: 0.05
    };

    const quizScore = Math.min(performance.averageQuizScore, 100);
    const loginScore = Math.min((performance.totalLoginDays / 30) * 100, 100); // Max 30 jours
    const bookingScore = Math.min(performance.totalBookings * 10, 100); // Max 10 bookings
    const castingScore = Math.min(performance.totalCastings * 15, 100); // Max 7 castings
    const forumScore = Math.min(performance.forumPosts * 5, 100); // Max 20 posts
    const paymentScore = performance.paymentCompliance;

    const overallScore = 
      quizScore * weights.quizScore +
      loginScore * weights.loginDays +
      bookingScore * weights.bookings +
      castingScore * weights.castings +
      forumScore * weights.forumPosts +
      paymentScore * weights.paymentCompliance;

    return Math.round(overallScore);
  }

  // Obtenir les activités d'un mannequin
  getModelActivities(modelId: string): ModelActivity[] {
    return this.activities
      .filter(activity => activity.modelId === modelId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Obtenir la performance d'un mannequin
  getModelPerformance(modelId: string): ModelPerformance | null {
    return this.performances.find(p => p.modelId === modelId) || null;
  }

  // Obtenir toutes les performances
  getAllPerformances(): ModelPerformance[] {
    return this.performances.sort((a, b) => b.overallScore - a.overallScore);
  }

  // Obtenir toutes les activités
  getAllActivities(): ModelActivity[] {
    return this.activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Marquer une activité comme lue
  markActivityAsRead(activityId: string): void {
    const activity = this.activities.find(a => a.id === activityId);
    if (activity) {
      activity.isRead = true;
    }
  }

  // Obtenir les statistiques globales
  getGlobalStats() {
    const totalModels = this.performances.length;
    const activeModels = this.performances.filter(p => p.totalLoginDays > 0).length;
    const averageScore = totalModels > 0 
      ? Math.round(this.performances.reduce((acc, p) => acc + p.overallScore, 0) / totalModels)
      : 0;
    const averagePaymentCompliance = totalModels > 0
      ? Math.round(this.performances.reduce((acc, p) => acc + p.paymentCompliance, 0) / totalModels)
      : 0;

    return {
      totalModels,
      activeModels,
      averageScore,
      averagePaymentCompliance,
      totalActivities: this.activities.length,
      unreadActivities: this.activities.filter(a => !a.isRead).length
    };
  }

  // Exporter les données pour sauvegarde
  exportData() {
    return {
      activities: this.activities,
      performances: this.performances,
      trackingData: this.trackingData
    };
  }

  // Importer les données depuis une sauvegarde
  importData(data: { activities: ModelActivity[], performances: ModelPerformance[], trackingData: ModelTrackingData[] }) {
    this.activities = data.activities || [];
    this.performances = data.performances || [];
    this.trackingData = data.trackingData || [];
  }

  // Méthodes utilitaires pour les types d'activités courantes
  recordLogin(modelId: string, modelName: string): ModelActivity {
    return this.recordActivity(
      modelId,
      'login',
      'Connexion',
      `${modelName} s'est connecté(e)`,
      {}
    );
  }

  recordQuizCompletion(
    modelId: string, 
    modelName: string, 
    chapterSlug: string, 
    score: number, 
    total: number
  ): ModelActivity {
    return this.recordActivity(
      modelId,
      'quiz_completed',
      'Quiz complété',
      `${modelName} a complété le quiz "${chapterSlug}" avec un score de ${score}/${total}`,
      {
        quizScore: Math.round((score / total) * 100),
        quizChapter: chapterSlug
      }
    );
  }

  recordPaymentSubmission(
    modelId: string, 
    modelName: string, 
    amount: number, 
    paymentType: string
  ): ModelActivity {
    return this.recordActivity(
      modelId,
      'payment_submitted',
      'Paiement soumis',
      `${modelName} a soumis un paiement de ${amount} FCFA (${paymentType})`,
      {
        paymentAmount: amount
      }
    );
  }

  recordBookingRequest(
    modelId: string, 
    modelName: string, 
    bookingDetails: string
  ): ModelActivity {
    return this.recordActivity(
      modelId,
      'booking_requested',
      'Demande de booking',
      `${modelName} a fait une demande de booking: ${bookingDetails}`,
      {
        bookingDetails
      }
    );
  }

  recordCastingApplication(
    modelId: string, 
    modelName: string, 
    castingEvent: string
  ): ModelActivity {
    return this.recordActivity(
      modelId,
      'casting_applied',
      'Candidature casting',
      `${modelName} a postulé pour le casting "${castingEvent}"`,
      {
        castingEvent
      }
    );
  }

  recordForumPost(
    modelId: string, 
    modelName: string, 
    threadTitle: string
  ): ModelActivity {
    return this.recordActivity(
      modelId,
      'forum_post',
      'Post forum',
      `${modelName} a posté dans "${threadTitle}"`,
      {
        forumThread: threadTitle
      }
    );
  }

  recordProfileUpdate(
    modelId: string, 
    modelName: string, 
    updateDetails: string
  ): ModelActivity {
    return this.recordActivity(
      modelId,
      'profile_updated',
      'Profil mis à jour',
      `${modelName} a mis à jour son profil: ${updateDetails}`,
      {}
    );
  }
}

// Instance singleton
export const modelTrackingService = ModelTrackingService.getInstance();
