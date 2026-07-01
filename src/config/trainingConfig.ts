// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION DU MODULE DE FORMATION
// ═══════════════════════════════════════════════════════════════════════════

export const TRAINING_CONFIG = {
  // Score minimum pour valider un quiz (en pourcentage) - 10/20 = 50%
  PASSING_SCORE: 50,
  
  // Nombre de questions par quiz
  QUESTIONS_PER_QUIZ: 20,
  
  // Temps par question (en secondes)
  TIME_PER_QUESTION: 10,
  
  // Nombre de tentatives autorisées par quiz (0 = illimité)
  MAX_QUIZ_ATTEMPTS: 0,
  
  // Durée de validité d'un certificat (en jours, 0 = illimité)
  CERTIFICATE_VALIDITY_DAYS: 0,
  
  // Activer/désactiver le déblocage progressif des modules
  PROGRESSIVE_UNLOCK: true,
  
  // Temps estimé par chapitre (en minutes)
  ESTIMATED_TIME_PER_CHAPTER: 15,
  
  // Activer/désactiver les certificats
  CERTIFICATES_ENABLED: true,
  
  // Activer/désactiver le partage social
  SOCIAL_SHARING_ENABLED: true,
  
  // Activer/désactiver les statistiques détaillées
  DETAILED_STATS_ENABLED: true,
  
  // Couleurs du thème (Tailwind classes)
  THEME: {
    primary: 'pm-gold',
    secondary: 'purple-500',
    success: 'green-500',
    warning: 'yellow-500',
    error: 'red-500',
    info: 'blue-500'
  },
  
  // Messages personnalisables
  MESSAGES: {
    quizPassed: '🎉 Félicitations ! Vous avez validé ce chapitre.',
    quizFailed: '📚 Score insuffisant (minimum 10/20). Révisez le contenu et réessayez.',
    moduleCompleted: '🏆 Module terminé ! Vous pouvez maintenant passer au suivant.',
    certificateEarned: '🎓 Certificat obtenu ! Téléchargez-le depuis votre profil.',
    moduleLockedTitle: 'Module verrouillé',
    moduleLockedMessage: 'Obtenez au moins 10/20 au module précédent pour débloquer celui-ci.'
  },
  
  // Système d'appréciation selon les notes
  APPRECIATIONS: {
    excellent: { min: 18, max: 20, label: 'Excellent', emoji: '🌟', color: 'text-yellow-400' },
    tresBien: { min: 16, max: 17, label: 'Très Bien', emoji: '⭐', color: 'text-green-400' },
    bien: { min: 14, max: 15, label: 'Bien', emoji: '👍', color: 'text-blue-400' },
    assezBien: { min: 12, max: 13, label: 'Assez Bien', emoji: '👌', color: 'text-cyan-400' },
    passable: { min: 10, max: 11, label: 'Passable', emoji: '✓', color: 'text-gray-400' },
    insuffisant: { min: 0, max: 9, label: 'Insuffisant', emoji: '❌', color: 'text-red-400' }
  },
  
  // Configuration des badges et récompenses
  BADGES: {
    firstChapter: {
      name: 'Premier Pas',
      description: 'Complétez votre premier chapitre',
      icon: '🎯'
    },
    firstModule: {
      name: 'Débutant Déterminé',
      description: 'Complétez votre premier module',
      icon: '📚'
    },
    perfectScore: {
      name: 'Score Parfait',
      description: 'Obtenez 100% à un quiz',
      icon: '⭐'
    },
    allModules: {
      name: 'Expert Certifié',
      description: 'Complétez tous les modules',
      icon: '🏆'
    },
    weekStreak: {
      name: 'Assidu',
      description: 'Étudiez 7 jours consécutifs',
      icon: '🔥'
    }
  },
  
  // Configuration de la sauvegarde
  STORAGE: {
    localStorageKey: 'trainingProgress',
    autoSaveEnabled: true,
    cloudSyncEnabled: false, // À activer avec Firebase
    syncInterval: 60000 // 1 minute
  },
  
  // Configuration des notifications
  NOTIFICATIONS: {
    enabled: true,
    reminderAfterDays: 3, // Rappel si inactif pendant X jours
    congratulationsOnCompletion: true,
    newModuleUnlocked: true
  },
  
  // Analytics et tracking
  ANALYTICS: {
    enabled: true,
    trackQuizAttempts: true,
    trackTimeSpent: true,
    trackChapterViews: true
  },
  
  // Limites et contraintes
  LIMITS: {
    maxChaptersPerDay: 0, // 0 = illimité
    minTimeBetweenQuizAttempts: 0, // en secondes, 0 = aucune limite
    maxCertificatesPerUser: 0 // 0 = illimité
  },
  
  // Fonctionnalités expérimentales
  EXPERIMENTAL: {
    aiAssistant: false, // Assistant IA pour aider pendant l'apprentissage
    peerReview: false, // Système de révision par les pairs
    liveClasses: false, // Classes en direct
    gamification: true // Système de points et niveaux
  }
};

// Types pour la configuration
export type TrainingConfigType = typeof TRAINING_CONFIG;

// Helper functions
export const getPassingScore = () => TRAINING_CONFIG.PASSING_SCORE;
export const isProgressiveUnlockEnabled = () => TRAINING_CONFIG.PROGRESSIVE_UNLOCK;
export const areCertificatesEnabled = () => TRAINING_CONFIG.CERTIFICATES_ENABLED;
export const getEstimatedTime = (chaptersCount: number) => 
  chaptersCount * TRAINING_CONFIG.ESTIMATED_TIME_PER_CHAPTER;

// Obtenir l'appréciation selon la note
export const getAppreciation = (score: number, total: number) => {
  const note = Math.round((score / total) * 20); // Convertir en note sur 20
  
  for (const [key, value] of Object.entries(TRAINING_CONFIG.APPRECIATIONS)) {
    if (note >= value.min && note <= value.max) {
      return { ...value, note };
    }
  }
  
  return { 
    ...TRAINING_CONFIG.APPRECIATIONS.insuffisant, 
    note 
  };
};

// Validation de la configuration
export const validateConfig = (): boolean => {
  if (TRAINING_CONFIG.PASSING_SCORE < 0 || TRAINING_CONFIG.PASSING_SCORE > 100) {
    console.error('PASSING_SCORE doit être entre 0 et 100');
    return false;
  }
  
  if (TRAINING_CONFIG.MAX_QUIZ_ATTEMPTS < 0) {
    console.error('MAX_QUIZ_ATTEMPTS ne peut pas être négatif');
    return false;
  }
  
  return true;
};

// Initialiser la configuration au démarrage
if (typeof window !== 'undefined') {
  if (!validateConfig()) {
    console.warn('Configuration de formation invalide détectée');
  }
}
