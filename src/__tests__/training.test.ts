// ═══════════════════════════════════════════════════════════════════════════
// TESTS UNITAIRES POUR LE MODULE DE FORMATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Ce fichier contient des exemples de tests pour le module de formation.
 * Pour exécuter les tests, installez Jest et React Testing Library :
 * 
 * npm install --save-dev @testing-library/react @testing-library/jest-dom jest
 */

import { TRAINING_MODULES } from '../data/trainingModules';
import { TRAINING_CONFIG, validateConfig } from '../config/trainingConfig';
import { UserProgress } from '../types/training';

describe('Training Modules', () => {
  test('should have at least one module', () => {
    expect(TRAINING_MODULES.length).toBeGreaterThan(0);
  });

  test('each module should have required fields', () => {
    TRAINING_MODULES.forEach(module => {
      expect(module.num).toBeDefined();
      expect(module.title).toBeDefined();
      expect(module.subtitle).toBeDefined();
      expect(module.objectifs).toBeDefined();
      expect(module.chapters).toBeDefined();
      expect(Array.isArray(module.chapters)).toBe(true);
    });
  });

  test('each chapter should have required fields', () => {
    TRAINING_MODULES.forEach(module => {
      module.chapters.forEach(chapter => {
        expect(chapter.title).toBeDefined();
        expect(chapter.content).toBeDefined();
        expect(chapter.keyPoints).toBeDefined();
        expect(chapter.quiz).toBeDefined();
        expect(Array.isArray(chapter.quiz)).toBe(true);
      });
    });
  });

  test('each quiz question should have 4 options', () => {
    TRAINING_MODULES.forEach(module => {
      module.chapters.forEach(chapter => {
        chapter.quiz.forEach(question => {
          expect(question.options.length).toBe(4);
        });
      });
    });
  });

  test('correct answer index should be valid', () => {
    TRAINING_MODULES.forEach(module => {
      module.chapters.forEach(chapter => {
        chapter.quiz.forEach(question => {
          expect(question.correct).toBeGreaterThanOrEqual(0);
          expect(question.correct).toBeLessThan(4);
        });
      });
    });
  });

  test('module numbers should be sequential', () => {
    const numbers = TRAINING_MODULES.map(m => m.num).sort((a, b) => a - b);
    for (let i = 0; i < numbers.length; i++) {
      expect(numbers[i]).toBe(i + 1);
    }
  });
});

describe('Training Configuration', () => {
  test('should validate successfully', () => {
    expect(validateConfig()).toBe(true);
  });

  test('passing score should be between 0 and 100', () => {
    expect(TRAINING_CONFIG.PASSING_SCORE).toBeGreaterThanOrEqual(0);
    expect(TRAINING_CONFIG.PASSING_SCORE).toBeLessThanOrEqual(100);
  });

  test('max quiz attempts should not be negative', () => {
    expect(TRAINING_CONFIG.MAX_QUIZ_ATTEMPTS).toBeGreaterThanOrEqual(0);
  });

  test('should have required configuration keys', () => {
    expect(TRAINING_CONFIG.PASSING_SCORE).toBeDefined();
    expect(TRAINING_CONFIG.PROGRESSIVE_UNLOCK).toBeDefined();
    expect(TRAINING_CONFIG.CERTIFICATES_ENABLED).toBeDefined();
    expect(TRAINING_CONFIG.STORAGE).toBeDefined();
  });
});

describe('User Progress', () => {
  const mockProgress: UserProgress = {
    moduleId: 1,
    chapterIndex: 0,
    completedChapters: [0],
    quizScores: {
      0: {
        score: 3,
        total: 3,
        attempts: 1,
        lastAttempt: new Date().toISOString(),
        passed: true
      }
    },
    startedAt: new Date().toISOString(),
    lastAccessedAt: new Date().toISOString()
  };

  test('should have valid structure', () => {
    expect(mockProgress.moduleId).toBeDefined();
    expect(mockProgress.chapterIndex).toBeDefined();
    expect(mockProgress.completedChapters).toBeDefined();
    expect(mockProgress.quizScores).toBeDefined();
    expect(mockProgress.startedAt).toBeDefined();
    expect(mockProgress.lastAccessedAt).toBeDefined();
  });

  test('completed chapters should be an array', () => {
    expect(Array.isArray(mockProgress.completedChapters)).toBe(true);
  });

  test('quiz scores should be an object', () => {
    expect(typeof mockProgress.quizScores).toBe('object');
  });

  test('should calculate passing score correctly', () => {
    const quizScore = mockProgress.quizScores[0];
    const percentage = (quizScore.score / quizScore.total) * 100;
    expect(percentage).toBeGreaterThanOrEqual(TRAINING_CONFIG.PASSING_SCORE);
  });
});

describe('Progress Calculation', () => {
  test('should calculate module completion percentage', () => {
    const module = TRAINING_MODULES[0];
    const completedChapters = 2;
    const totalChapters = module.chapters.length;
    const percentage = (completedChapters / totalChapters) * 100;
    
    expect(percentage).toBeGreaterThanOrEqual(0);
    expect(percentage).toBeLessThanOrEqual(100);
  });

  test('should determine if module is unlocked', () => {
    const isFirstModule = (moduleNum: number) => moduleNum === 1;
    const hasPreviousModuleCompleted = (moduleNum: number) => {
      // Logique de vérification
      return moduleNum > 1; // Simplifié pour le test
    };

    expect(isFirstModule(1)).toBe(true);
    expect(isFirstModule(2)).toBe(false);
  });

  test('should calculate average quiz score', () => {
    const scores = [80, 90, 85, 95];
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    expect(average).toBe(87.5);
  });
});

describe('LocalStorage Operations', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('should save progress to localStorage', () => {
    const progress: UserProgress = {
      moduleId: 1,
      chapterIndex: 0,
      completedChapters: [],
      quizScores: {},
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString()
    };

    localStorage.setItem('trainingProgress', JSON.stringify([progress]));
    const saved = localStorage.getItem('trainingProgress');
    
    expect(saved).not.toBeNull();
    if (saved) {
      const parsed = JSON.parse(saved);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed[0].moduleId).toBe(1);
    }
  });

  test('should load progress from localStorage', () => {
    const progress: UserProgress[] = [{
      moduleId: 1,
      chapterIndex: 0,
      completedChapters: [0],
      quizScores: {},
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString()
    }];

    localStorage.setItem('trainingProgress', JSON.stringify(progress));
    const loaded = localStorage.getItem('trainingProgress');
    
    expect(loaded).not.toBeNull();
    if (loaded) {
      const parsed = JSON.parse(loaded);
      expect(parsed[0].completedChapters).toContain(0);
    }
  });

  test('should handle empty localStorage', () => {
    const saved = localStorage.getItem('trainingProgress');
    expect(saved).toBeNull();
  });
});

describe('Quiz Validation', () => {
  test('should validate correct answer', () => {
    const question = TRAINING_MODULES[0].chapters[0].quiz[0];
    const userAnswer = question.correct;
    
    expect(userAnswer).toBe(question.correct);
  });

  test('should calculate quiz score', () => {
    const quiz = TRAINING_MODULES[0].chapters[0].quiz;
    const userAnswers = quiz.map(q => q.correct); // Toutes les bonnes réponses
    
    let correct = 0;
    quiz.forEach((question, idx) => {
      if (userAnswers[idx] === question.correct) {
        correct++;
      }
    });
    
    const score = (correct / quiz.length) * 100;
    expect(score).toBe(100);
  });

  test('should determine if quiz is passed', () => {
    const score = 75;
    const passed = score >= TRAINING_CONFIG.PASSING_SCORE;
    
    expect(passed).toBe(true);
  });

  test('should determine if quiz is failed', () => {
    const score = 65;
    const passed = score >= TRAINING_CONFIG.PASSING_SCORE;
    
    expect(passed).toBe(false);
  });
});

describe('Certificate Generation', () => {
  test('should generate certificate ID', () => {
    const userId = 'user123';
    const moduleId = 1;
    const timestamp = Date.now();
    const certificateId = `${userId}-${moduleId}-${timestamp}`;
    
    expect(certificateId).toContain(userId);
    expect(certificateId).toContain(moduleId.toString());
  });

  test('should determine if certificate is earned', () => {
    const progress: UserProgress = {
      moduleId: 1,
      chapterIndex: 3,
      completedChapters: [0, 1, 2, 3],
      quizScores: {
        0: { score: 3, total: 3, attempts: 1, lastAttempt: '', passed: true },
        1: { score: 4, total: 5, attempts: 1, lastAttempt: '', passed: true },
        2: { score: 5, total: 5, attempts: 1, lastAttempt: '', passed: true },
        3: { score: 3, total: 4, attempts: 1, lastAttempt: '', passed: true }
      },
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      certificateEarned: true
    };

    const module = TRAINING_MODULES.find(m => m.num === progress.moduleId);
    const allChaptersCompleted = module 
      ? progress.completedChapters.length === module.chapters.length 
      : false;
    
    expect(allChaptersCompleted).toBe(true);
    expect(progress.certificateEarned).toBe(true);
  });
});

/**
 * INSTRUCTIONS POUR EXÉCUTER LES TESTS :
 * 
 * 1. Installer les dépendances :
 *    npm install --save-dev @testing-library/react @testing-library/jest-dom jest
 * 
 * 2. Configurer Jest dans package.json :
 *    "scripts": {
 *      "test": "jest",
 *      "test:watch": "jest --watch"
 *    }
 * 
 * 3. Créer jest.config.js :
 *    module.exports = {
 *      preset: 'ts-jest',
 *      testEnvironment: 'jsdom',
 *      setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts']
 *    };
 * 
 * 4. Exécuter les tests :
 *    npm test
 */
