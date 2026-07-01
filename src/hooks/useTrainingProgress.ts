// ═══════════════════════════════════════════════════════════════════════════
// HOOK PERSONNALISÉ POUR LA GESTION DE LA PROGRESSION
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { UserProgress } from '../types/training';
import {
  loadProgressFromLocal,
  saveProgressToLocal,
  updateUserProgress,
  shouldAwardCertificate,
  getEarnedBadges
} from '../utils/trainingHelpers';

export function useTrainingProgress(moduleId?: number) {
  const [allProgress, setAllProgress] = useState<UserProgress[]>([]);
  const [currentProgress, setCurrentProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  // Charger la progression au montage
  useEffect(() => {
    const loadProgress = () => {
      const progress = loadProgressFromLocal();
      setAllProgress(progress);
      
      if (moduleId) {
        const moduleProgress = progress.find(p => p.moduleId === moduleId);
        setCurrentProgress(moduleProgress || null);
      }
      
      setEarnedBadges(getEarnedBadges(progress));
      setLoading(false);
    };

    loadProgress();
  }, [moduleId]);

  // Sauvegarder la progression
  const saveProgress = useCallback((progress: UserProgress) => {
    const updated = updateUserProgress(allProgress, progress);
    setAllProgress(updated);
    saveProgressToLocal(updated);
    
    if (moduleId && progress.moduleId === moduleId) {
      setCurrentProgress(progress);
    }
    
    // Mettre à jour les badges
    setEarnedBadges(getEarnedBadges(updated));
    
    // Vérifier si un certificat doit être délivré
    if (shouldAwardCertificate(progress) && !progress.certificateEarned) {
      const withCertificate = { ...progress, certificateEarned: true };
      const finalUpdated = updateUserProgress(updated, withCertificate);
      setAllProgress(finalUpdated);
      saveProgressToLocal(finalUpdated);
      
      if (moduleId && progress.moduleId === moduleId) {
        setCurrentProgress(withCertificate);
      }
      
      return withCertificate;
    }
    
    return progress;
  }, [allProgress, moduleId]);

  // Marquer un chapitre comme complété
  const completeChapter = useCallback((moduleId: number, chapterIndex: number) => {
    const progress = allProgress.find(p => p.moduleId === moduleId) || {
      moduleId,
      chapterIndex,
      completedChapters: [],
      quizScores: {},
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString()
    };

    if (!progress.completedChapters.includes(chapterIndex)) {
      const updated: UserProgress = {
        ...progress,
        completedChapters: [...progress.completedChapters, chapterIndex].sort((a, b) => a - b),
        lastAccessedAt: new Date().toISOString()
      };
      
      return saveProgress(updated);
    }
    
    return progress;
  }, [allProgress, saveProgress]);

  // Enregistrer un score de quiz
  const recordQuizScore = useCallback((
    moduleId: number,
    chapterIndex: number,
    score: number,
    total: number,
    passed: boolean
  ) => {
    const progress = allProgress.find(p => p.moduleId === moduleId) || {
      moduleId,
      chapterIndex,
      completedChapters: [],
      quizScores: {},
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString()
    };

    const existingScore = progress.quizScores[chapterIndex];
    
    const updated: UserProgress = {
      ...progress,
      quizScores: {
        ...progress.quizScores,
        [chapterIndex]: {
          score,
          total,
          attempts: (existingScore?.attempts || 0) + 1,
          lastAttempt: new Date().toISOString(),
          passed
        }
      },
      lastAccessedAt: new Date().toISOString()
    };

    return saveProgress(updated);
  }, [allProgress, saveProgress]);

  // Réinitialiser la progression d'un module
  const resetModuleProgress = useCallback((moduleId: number) => {
    const filtered = allProgress.filter(p => p.moduleId !== moduleId);
    setAllProgress(filtered);
    saveProgressToLocal(filtered);
    
    if (currentProgress?.moduleId === moduleId) {
      setCurrentProgress(null);
    }
  }, [allProgress, currentProgress]);

  // Réinitialiser toute la progression
  const resetAllProgress = useCallback(() => {
    setAllProgress([]);
    setCurrentProgress(null);
    setEarnedBadges([]);
    saveProgressToLocal([]);
  }, []);

  // Exporter la progression
  const exportProgress = useCallback(() => {
    return JSON.stringify(allProgress, null, 2);
  }, [allProgress]);

  // Importer la progression
  const importProgress = useCallback((jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString);
      if (!Array.isArray(imported)) {
        throw new Error('Format invalide');
      }
      
      setAllProgress(imported);
      saveProgressToLocal(imported);
      setEarnedBadges(getEarnedBadges(imported));
      
      if (moduleId) {
        const moduleProgress = imported.find((p: UserProgress) => p.moduleId === moduleId);
        setCurrentProgress(moduleProgress || null);
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      return false;
    }
  }, [moduleId]);

  return {
    allProgress,
    currentProgress,
    loading,
    earnedBadges,
    saveProgress,
    completeChapter,
    recordQuizScore,
    resetModuleProgress,
    resetAllProgress,
    exportProgress,
    importProgress
  };
}

/**
 * Hook pour suivre le temps passé sur un chapitre
 */
export function useChapterTimer() {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    setStartTime(Date.now());
    
    const interval = setInterval(() => {
      if (startTime) {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    reset: () => setStartTime(Date.now())
  };
}

/**
 * Hook pour gérer les notifications de badges
 */
export function useBadgeNotifications() {
  const [notification, setNotification] = useState<string | null>(null);
  const [previousBadges, setPreviousBadges] = useState<string[]>([]);

  const checkNewBadges = useCallback((currentBadges: string[]) => {
    const newBadges = currentBadges.filter(badge => !previousBadges.includes(badge));
    
    if (newBadges.length > 0) {
      setNotification(newBadges[0]); // Afficher le premier nouveau badge
      setPreviousBadges(currentBadges);
      
      // Auto-fermer après 5 secondes
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  }, [previousBadges]);

  const closeNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return {
    notification,
    checkNewBadges,
    closeNotification
  };
}
