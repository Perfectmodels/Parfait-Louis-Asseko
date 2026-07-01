// ═══════════════════════════════════════════════════════════════════════════
// UTILITAIRES POUR LE MODULE DE FORMATION
// ═══════════════════════════════════════════════════════════════════════════

import { UserProgress, TrainingStats, TrainingModule } from '../types/training';
import { TRAINING_MODULES } from '../data/trainingModules';
import { TRAINING_CONFIG, getAppreciation } from '../config/trainingConfig';

/**
 * Calculer les statistiques globales de formation
 */
export const calculateTrainingStats = (allProgress: UserProgress[]): TrainingStats => {
  const totalUsers = allProgress.length;
  const totalModules = TRAINING_MODULES.length;
  const totalChapters = TRAINING_MODULES.reduce((sum, m) => sum + m.chapters.length, 0);

  // Modules complétés
  const completedModules = allProgress.reduce((sum, p) => {
    const module = TRAINING_MODULES.find(m => m.num === p.moduleId);
    if (!module) return sum;
    return sum + (p.completedChapters.length === module.chapters.length ? 1 : 0);
  }, 0);

  // Chapitres complétés
  const completedChapters = allProgress.reduce((sum, p) => sum + p.completedChapters.length, 0);

  // Score moyen
  const allScores = allProgress.flatMap(p =>
    Object.values(p.quizScores).map(q => (q.score / q.total) * 100)
  );
  const averageQuizScore = allScores.length > 0
    ? allScores.reduce((a, b) => a + b, 0) / allScores.length
    : 0;

  // Certificats
  const certificatesEarned = allProgress.filter(p => p.certificateEarned).length;

  // Temps total (à implémenter avec un tracker)
  const totalTimeSpent = 0;

  return {
    totalModules,
    completedModules,
    totalChapters,
    completedChapters,
    averageQuizScore,
    totalTimeSpent,
    certificatesEarned
  };
};

/**
 * Calculer la progression d'un module spécifique
 */
export const getModuleProgress = (moduleNum: number, progress: UserProgress[]): number => {
  const userProgress = progress.find(p => p.moduleId === moduleNum);
  if (!userProgress) return 0;

  const module = TRAINING_MODULES.find(m => m.num === moduleNum);
  if (!module) return 0;

  return (userProgress.completedChapters.length / module.chapters.length) * 100;
};

/**
 * Vérifier si un module est débloqué
 */
export const isModuleUnlocked = (moduleNum: number, progress: UserProgress[]): boolean => {
  // Le premier module est toujours débloqué
  if (moduleNum === 1) return true;

  // Si le déblocage progressif est désactivé, tous les modules sont débloqués
  if (!TRAINING_CONFIG.PROGRESSIVE_UNLOCK) return true;

  // Vérifier si le module précédent a une note >= 10/20
  const previousProgress = progress.find(p => p.moduleId === moduleNum - 1);
  if (!previousProgress) return false;

  const previousModule = TRAINING_MODULES.find(m => m.num === moduleNum - 1);
  if (!previousModule) return false;

  // Vérifier que tous les chapitres sont complétés
  const allChaptersCompleted = previousProgress.completedChapters.length === previousModule.chapters.length;
  if (!allChaptersCompleted) return false;

  // Vérifier que la note moyenne est >= 10/20 (50%)
  const quizScores = Object.values(previousProgress.quizScores);
  if (quizScores.length === 0) return false;

  const averageScore = quizScores.reduce((sum, q) => sum + (q.score / q.total), 0) / quizScores.length;
  const averagePercentage = averageScore * 100;

  return averagePercentage >= TRAINING_CONFIG.PASSING_SCORE;
};

/**
 * Calculer le score d'un quiz
 */
export const calculateQuizScore = (
  userAnswers: { [key: number]: number },
  correctAnswers: number[]
): { correct: number; total: number; percentage: number; passed: boolean } => {
  let correct = 0;
  const total = correctAnswers.length;

  correctAnswers.forEach((correctAnswer, index) => {
    if (userAnswers[index] === correctAnswer) {
      correct++;
    }
  });

  const percentage = (correct / total) * 100;
  const passed = percentage >= TRAINING_CONFIG.PASSING_SCORE;

  return { correct, total, percentage, passed };
};

/**
 * Sauvegarder la progression dans localStorage
 */
export const saveProgressToLocal = (progress: UserProgress[]): void => {
  try {
    localStorage.setItem(TRAINING_CONFIG.STORAGE.localStorageKey, JSON.stringify(progress));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la progression:', error);
  }
};

/**
 * Charger la progression depuis localStorage
 */
export const loadProgressFromLocal = (): UserProgress[] => {
  try {
    const saved = localStorage.getItem(TRAINING_CONFIG.STORAGE.localStorageKey);
    if (!saved) return [];
    return JSON.parse(saved);
  } catch (error) {
    console.error('Erreur lors du chargement de la progression:', error);
    return [];
  }
};

/**
 * Mettre à jour la progression d'un utilisateur
 */
export const updateUserProgress = (
  allProgress: UserProgress[],
  updatedProgress: UserProgress
): UserProgress[] => {
  const existingIndex = allProgress.findIndex(p => p.moduleId === updatedProgress.moduleId);

  if (existingIndex >= 0) {
    const newProgress = [...allProgress];
    newProgress[existingIndex] = updatedProgress;
    return newProgress;
  } else {
    return [...allProgress, updatedProgress];
  }
};

/**
 * Vérifier si un certificat doit être délivré
 */
export const shouldAwardCertificate = (progress: UserProgress): boolean => {
  if (!TRAINING_CONFIG.CERTIFICATES_ENABLED) return false;

  const module = TRAINING_MODULES.find(m => m.num === progress.moduleId);
  if (!module) return false;

  // Tous les chapitres doivent être complétés
  const allChaptersCompleted = progress.completedChapters.length === module.chapters.length;
  if (!allChaptersCompleted) return false;

  // Tous les quiz doivent être réussis
  const allQuizzesPassed = Object.values(progress.quizScores).every(q => q.passed);
  if (!allQuizzesPassed) return false;

  return true;
};

/**
 * Générer un ID de certificat unique
 */
export const generateCertificateId = (userId: string, moduleId: number): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `CERT-${userId}-M${moduleId}-${timestamp}-${random}`.toUpperCase();
};

/**
 * Formater la durée estimée
 */
export const formatEstimatedTime = (chaptersCount: number): string => {
  const minutes = chaptersCount * TRAINING_CONFIG.ESTIMATED_TIME_PER_CHAPTER;
  
  if (minutes < 60) {
    return `~${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `~${hours}h`;
  }
  
  return `~${hours}h${remainingMinutes}`;
};

/**
 * Obtenir le prochain chapitre à étudier
 */
export const getNextChapter = (progress: UserProgress, module: TrainingModule): number | null => {
  const completedCount = progress.completedChapters.length;
  
  if (completedCount >= module.chapters.length) {
    return null; // Module terminé
  }
  
  // Retourner le premier chapitre non complété
  for (let i = 0; i < module.chapters.length; i++) {
    if (!progress.completedChapters.includes(i)) {
      return i;
    }
  }
  
  return null;
};

/**
 * Calculer le temps écoulé depuis la dernière activité
 */
export const getDaysSinceLastActivity = (lastAccessedAt: string): number => {
  const lastAccess = new Date(lastAccessedAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastAccess.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Vérifier si l'utilisateur est actif
 */
export const isUserActive = (progress: UserProgress, daysThreshold: number = 7): boolean => {
  const daysSince = getDaysSinceLastActivity(progress.lastAccessedAt);
  return daysSince <= daysThreshold;
};

/**
 * Exporter la progression en JSON
 */
export const exportProgress = (progress: UserProgress[]): string => {
  return JSON.stringify(progress, null, 2);
};

/**
 * Importer la progression depuis JSON
 */
export const importProgress = (jsonString: string): UserProgress[] | null => {
  try {
    const parsed = JSON.parse(jsonString);
    
    // Valider la structure
    if (!Array.isArray(parsed)) {
      throw new Error('Format invalide: doit être un tableau');
    }
    
    // Valider chaque élément
    parsed.forEach((item, index) => {
      if (!item.moduleId || !item.startedAt || !item.lastAccessedAt) {
        throw new Error(`Élément ${index} invalide: champs requis manquants`);
      }
    });
    
    return parsed;
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    return null;
  }
};

/**
 * Obtenir les badges gagnés par un utilisateur
 */
export const getEarnedBadges = (allProgress: UserProgress[]): string[] => {
  const badges: string[] = [];
  
  // Premier chapitre complété
  if (allProgress.some(p => p.completedChapters.length > 0)) {
    badges.push('firstChapter');
  }
  
  // Premier module complété
  if (allProgress.some(p => {
    const module = TRAINING_MODULES.find(m => m.num === p.moduleId);
    return module && p.completedChapters.length === module.chapters.length;
  })) {
    badges.push('firstModule');
  }
  
  // Score parfait
  if (allProgress.some(p => 
    Object.values(p.quizScores).some(q => q.score === q.total)
  )) {
    badges.push('perfectScore');
  }
  
  // Tous les modules complétés
  const allModulesCompleted = TRAINING_MODULES.every(module => 
    allProgress.some(p => 
      p.moduleId === module.num && 
      p.completedChapters.length === module.chapters.length
    )
  );
  if (allModulesCompleted) {
    badges.push('allModules');
  }
  
  return badges;
};

/**
 * Obtenir les statistiques d'un module spécifique
 */
export const getModuleStats = (moduleNum: number, allProgress: UserProgress[]) => {
  const moduleProgress = allProgress.filter(p => p.moduleId === moduleNum);
  const module = TRAINING_MODULES.find(m => m.num === moduleNum);
  
  if (!module) return null;
  
  const totalUsers = allProgress.length;
  const usersStarted = moduleProgress.length;
  const usersCompleted = moduleProgress.filter(p => 
    p.completedChapters.length === module.chapters.length
  ).length;
  
  const averageProgress = moduleProgress.length > 0
    ? moduleProgress.reduce((sum, p) => 
        sum + (p.completedChapters.length / module.chapters.length) * 100, 0
      ) / moduleProgress.length
    : 0;
  
  const quizScores = moduleProgress.flatMap(p => 
    Object.values(p.quizScores).map(q => (q.score / q.total) * 100)
  );
  
  const averageQuizScore = quizScores.length > 0
    ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length
    : 0;
  
  return {
    moduleNum,
    moduleName: module.title,
    totalUsers,
    usersStarted,
    usersCompleted,
    completionRate: totalUsers > 0 ? (usersCompleted / totalUsers) * 100 : 0,
    averageProgress,
    averageQuizScore
  };
};

/**
 * Obtenir l'appréciation pour un score donné
 */
export const getAppreciationForScore = (score: number, total: number) => {
  return getAppreciation(score, total);
};

/**
 * Calculer la note moyenne d'un module
 */
export const getModuleAverageScore = (progress: UserProgress): number => {
  const quizScores = Object.values(progress.quizScores);
  if (quizScores.length === 0) return 0;

  const totalScore = quizScores.reduce((sum, q) => sum + (q.score / q.total), 0);
  return (totalScore / quizScores.length) * 20; // Note sur 20
};

/**
 * Vérifier si un module peut être débloqué (note >= 10/20)
 */
export const canUnlockNextModule = (progress: UserProgress, module: TrainingModule): boolean => {
  // Vérifier que tous les chapitres sont complétés
  if (progress.completedChapters.length !== module.chapters.length) {
    return false;
  }

  // Vérifier que tous les quiz sont réussis avec au moins 10/20
  const quizScores = Object.values(progress.quizScores);
  if (quizScores.length === 0) return false;

  const averageScore = quizScores.reduce((sum, q) => sum + (q.score / q.total), 0) / quizScores.length;
  const averagePercentage = averageScore * 100;

  return averagePercentage >= TRAINING_CONFIG.PASSING_SCORE;
};
