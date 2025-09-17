import { Model, BeginnerStudent, ModelPerformance, ModelActivity, PaymentStatus } from '../types';

// Fonction pour calculer les vraies performances d'un mannequin
export const calculateRealModelPerformance = (
  model: Model | BeginnerStudent,
  allActivities: ModelActivity[] = []
): ModelPerformance => {
  const modelActivities = allActivities.filter(activity => activity.modelId === model.id);
  
  // Calculer les scores de quiz
  const quizScores = Object.values(model.quizScores || {});
  const totalQuizAttempts = quizScores.length;
  const averageQuizScore = totalQuizAttempts > 0 
    ? Math.round(quizScores.reduce((sum, quiz) => sum + (quiz.score / quiz.total * 100), 0) / totalQuizAttempts)
    : 0;

  // Calculer les jours de connexion (basé sur lastLogin)
  const lastLoginDate = model.lastLogin ? new Date(model.lastLogin) : null;
  const totalLoginDays = lastLoginDate ? 1 : 0; // Simplifié pour l'instant

  // Calculer les bookings et castings (basé sur les activités)
  const totalBookings = modelActivities.filter(a => a.type === 'booking_requested').length;
  const totalCastings = modelActivities.filter(a => a.type === 'casting_applied').length;
  const forumPosts = modelActivities.filter(a => a.type === 'forum_post').length;

  // Calculer la compliance de paiement
  const paymentCompliance = model.paymentStatus?.isUpToDate ? 100 : 0;

  // Calculer le score global
  const overallScore = Math.round(
    (averageQuizScore * 0.3) + 
    (paymentCompliance * 0.3) + 
    (totalLoginDays > 0 ? 20 : 0) + 
    (totalBookings * 5) + 
    (totalCastings * 10) + 
    (forumPosts * 2)
  );

  return {
    modelId: model.id,
    totalQuizAttempts,
    averageQuizScore,
    totalLoginDays,
    lastLoginDate: model.lastLogin || new Date().toISOString(),
    totalBookings,
    totalCastings,
    forumPosts,
    paymentCompliance,
    overallScore: Math.min(overallScore, 100), // Max 100
    lastUpdated: new Date().toISOString()
  };
};

// Fonction pour déterminer le statut d'activité réel
export const getRealActivityStatus = (
  model: Model | BeginnerStudent,
  performance: ModelPerformance
): 'active' | 'inactive' | 'suspended' | 'graduated' => {
  const now = new Date();
  const lastLogin = model.lastLogin ? new Date(model.lastLogin) : null;
  
  // Si pas de connexion depuis plus de 30 jours
  if (!lastLogin || (now.getTime() - lastLogin.getTime()) > (30 * 24 * 60 * 60 * 1000)) {
    return 'inactive';
  }
  
  // Si pas de paiement à jour
  if (!model.paymentStatus?.isUpToDate) {
    return 'suspended';
  }
  
  // Si score global élevé et activités récentes
  if (performance.overallScore >= 70 && lastLogin) {
    const daysSinceLogin = (now.getTime() - lastLogin.getTime()) / (24 * 60 * 60 * 1000);
    if (daysSinceLogin <= 7) {
      return 'active';
    }
  }
  
  // Si a des quiz complétés récemment
  const recentQuizScores = Object.values(model.quizScores || {}).filter(quiz => {
    const quizDate = new Date(quiz.timestamp);
    return (now.getTime() - quizDate.getTime()) <= (7 * 24 * 60 * 60 * 1000);
  });
  
  if (recentQuizScores.length > 0) {
    return 'active';
  }
  
  return 'inactive';
};

// Fonction pour générer des activités réelles basées sur les données
export const generateRealActivities = (
  model: Model | BeginnerStudent,
  allActivities: ModelActivity[] = []
): ModelActivity[] => {
  const activities: ModelActivity[] = [];
  const now = new Date();
  
  // Activité de connexion
  if (model.lastLogin) {
    activities.push({
      id: `login-${model.id}-${Date.now()}`,
      modelId: model.id,
      type: 'login',
      title: 'Connexion',
      description: `${model.name} s'est connecté(e)`,
      timestamp: model.lastLogin,
      isRead: false
    });
  }
  
  // Activités de quiz
  Object.entries(model.quizScores || {}).forEach(([chapterSlug, quiz]) => {
    activities.push({
      id: `quiz-${model.id}-${chapterSlug}-${Date.now()}`,
      modelId: model.id,
      type: 'quiz_completed',
      title: 'Quiz complété',
      description: `${model.name} a complété le quiz ${chapterSlug} avec ${quiz.score}/${quiz.total}`,
      timestamp: quiz.timestamp,
      metadata: {
        quizScore: quiz.score,
        quizChapter: chapterSlug
      },
      isRead: false
    });
  });
  
  // Activité de paiement
  if (model.paymentStatus?.isUpToDate && model.paymentStatus?.lastPaymentDate) {
    activities.push({
      id: `payment-${model.id}-${Date.now()}`,
      modelId: model.id,
      type: 'payment_submitted',
      title: 'Paiement effectué',
      description: `${model.name} a effectué un paiement de ${model.paymentStatus.amount} ${model.paymentStatus.currency}`,
      timestamp: model.paymentStatus.lastPaymentDate,
      metadata: {
        paymentAmount: model.paymentStatus.amount
      },
      isRead: false
    });
  }
  
  // Ajouter les activités existantes
  const existingActivities = allActivities.filter(a => a.modelId === model.id);
  activities.push(...existingActivities);
  
  // Trier par timestamp (plus récent en premier)
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Fonction pour obtenir les mannequins avec une vraie activité
export const getModelsWithRealActivity = (
  models: Model[],
  beginnerStudents: BeginnerStudent[],
  allActivities: ModelActivity[] = []
) => {
  const allModels = [...models, ...beginnerStudents];
  
  return allModels
    .map(model => {
      const performance = calculateRealModelPerformance(model, allActivities);
      const activities = generateRealActivities(model, allActivities);
      const status = getRealActivityStatus(model, performance);
      
      return {
        ...model,
        performance,
        activities,
        status,
        hasRealActivity: activities.length > 0 || performance.overallScore > 0
      };
    })
    .filter(model => model.hasRealActivity) // Filtrer seulement ceux avec une vraie activité
    .sort((a, b) => {
      // Trier par score global décroissant, puis par dernière activité
      if (b.performance.overallScore !== a.performance.overallScore) {
        return b.performance.overallScore - a.performance.overallScore;
      }
      
      const aLastActivity = a.activities[0]?.timestamp || a.lastLogin || '';
      const bLastActivity = b.activities[0]?.timestamp || b.lastLogin || '';
      
      return new Date(bLastActivity).getTime() - new Date(aLastActivity).getTime();
    });
};
