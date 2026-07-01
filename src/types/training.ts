// ═══════════════════════════════════════════════════════════════════════════
// TYPES POUR LE MODULE DE FORMATION AVANCÉ
// ═══════════════════════════════════════════════════════════════════════════

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface TrainingChapter {
  title: string;
  content: string[];
  keyPoints: string[];
  quiz: QuizQuestion[];
}

export interface TrainingModule {
  num: number;
  title: string;
  subtitle: string;
  objectifs: string[];
  chapters: TrainingChapter[];
}

export interface UserProgress {
  moduleId: number;
  chapterIndex: number;
  completedChapters: number[];
  quizScores: {
    [chapterIndex: number]: {
      score: number;
      total: number;
      attempts: number;
      lastAttempt: string;
      passed: boolean;
    };
  };
  startedAt: string;
  lastAccessedAt: string;
  certificateEarned?: boolean;
}

export interface TrainingStats {
  totalModules: number;
  completedModules: number;
  totalChapters: number;
  completedChapters: number;
  averageQuizScore: number;
  totalTimeSpent: number; // en minutes
  certificatesEarned: number;
}
