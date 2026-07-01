# 🎯 Implémentation Timer et Système d'Appréciation

## ✅ Modifications Effectuées

### 1. Configuration (`src/config/trainingConfig.ts`)

#### Ajouts :
```typescript
// Score minimum : 10/20 = 50%
PASSING_SCORE: 50,

// 20 questions par quiz
QUESTIONS_PER_QUIZ: 20,

// 10 secondes par question
TIME_PER_QUESTION: 10,

// Système d'appréciation
APPRECIATIONS: {
  excellent: { min: 18, max: 20, label: 'Excellent', emoji: '🌟', color: 'text-yellow-400' },
  tresBien: { min: 16, max: 17, label: 'Très Bien', emoji: '⭐', color: 'text-green-400' },
  bien: { min: 14, max: 15, label: 'Bien', emoji: '👍', color: 'text-blue-400' },
  assezBien: { min: 12, max: 13, label: 'Assez Bien', emoji: '👌', color: 'text-cyan-400' },
  passable: { min: 10, max: 11, label: 'Passable', emoji: '✓', color: 'text-gray-400' },
  insuffisant: { min: 0, max: 9, label: 'Insuffisant', emoji: '❌', color: 'text-red-400' }
}

// Fonction helper
export const getAppreciation = (score: number, total: number) => {
  const note = Math.round((score / total) * 20);
  // Retourne l'appréciation correspondante
}
```

### 2. Helpers (`src/utils/trainingHelpers.ts`)

#### Modifications :
```typescript
// Mise à jour de isModuleUnlocked pour vérifier la note >= 10/20
export const isModuleUnlocked = (moduleNum: number, progress: UserProgress[]): boolean => {
  // ...
  // Vérifier que la note moyenne est >= 50%
  const averageScore = quizScores.reduce((sum, q) => sum + (q.score / q.total), 0) / quizScores.length;
  const averagePercentage = averageScore * 100;
  return averagePercentage >= TRAINING_CONFIG.PASSING_SCORE;
};

// Nouvelles fonctions
export const getAppreciationForScore = (score: number, total: number) => {
  return getAppreciation(score, total);
};

export const getModuleAverageScore = (progress: UserProgress): number => {
  // Calcule la note moyenne sur 20
};

export const canUnlockNextModule = (progress: UserProgress, module: TrainingModule): boolean => {
  // Vérifie si le module suivant peut être débloqué
};
```

---

## 🔧 Modifications à Faire dans TrainingModuleView.tsx

### 1. Ajouter le State pour le Timer

```typescript
import { useState, useEffect, useRef } from 'react';
import { TRAINING_CONFIG } from '../config/trainingConfig';
import { getAppreciationForScore } from '../utils/trainingHelpers';

// Dans le composant
const [timeRemaining, setTimeRemaining] = useState(TRAINING_CONFIG.TIME_PER_QUESTION);
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [quizStarted, setQuizStarted] = useState(false);
const timerRef = useRef<NodeJS.Timeout | null>(null);
```

### 2. Implémenter le Timer

```typescript
// Effet pour le timer
useEffect(() => {
  if (!showQuiz || !quizStarted || quizSubmitted) {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return;
  }

  // Démarrer le timer
  timerRef.current = setInterval(() => {
    setTimeRemaining((prev) => {
      if (prev <= 1) {
        // Temps écoulé, passer à la question suivante
        handleTimeUp();
        return TRAINING_CONFIG.TIME_PER_QUESTION;
      }
      return prev - 1;
    });
  }, 1000);

  return () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
}, [showQuiz, quizStarted, quizSubmitted, currentQuestionIndex]);

// Fonction quand le temps est écoulé
const handleTimeUp = () => {
  const quiz = module?.chapters[currentChapterIndex]?.quiz;
  if (!quiz) return;

  // Si pas de réponse, marquer comme incorrecte
  if (quizAnswers[currentQuestionIndex] === undefined) {
    setQuizAnswers({ ...quizAnswers, [currentQuestionIndex]: -1 });
  }

  // Passer à la question suivante
  if (currentQuestionIndex < quiz.length - 1) {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setTimeRemaining(TRAINING_CONFIG.TIME_PER_QUESTION);
  } else {
    // Dernière question, soumettre automatiquement
    handleQuizSubmit();
  }
};
```

### 3. Afficher le Timer dans l'UI

```tsx
{/* Timer */}
{showQuiz && quizStarted && !quizSubmitted && (
  <div className="fixed top-20 right-6 z-50">
    <div className={`
      px-6 py-3 rounded-full border-2 font-bold text-lg
      ${timeRemaining <= 3 
        ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' 
        : 'bg-white/10 border-white/20 text-white'
      }
    `}>
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5" />
        <span>{timeRemaining}s</span>
      </div>
    </div>
  </div>
)}
```

### 4. Afficher l'Appréciation après le Quiz

```tsx
{quizSubmitted && quizScore && (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
    {/* Score */}
    <div className="mb-6">
      <div className="text-6xl font-black text-white mb-2">
        {quizScore.correct}/{quizScore.total}
      </div>
      <div className="text-sm text-white/40 uppercase tracking-wider">
        Score obtenu
      </div>
    </div>

    {/* Appréciation */}
    {(() => {
      const appreciation = getAppreciationForScore(quizScore.correct, quizScore.total);
      return (
        <div className="mb-6">
          <div className="text-8xl mb-4">{appreciation.emoji}</div>
          <div className={`text-3xl font-bold ${appreciation.color} mb-2`}>
            {appreciation.label}
          </div>
          <div className="text-xl text-white/60">
            Note : {appreciation.note}/20
          </div>
        </div>
      );
    })()}

    {/* Message */}
    <div className={`p-4 rounded-xl ${
      (quizScore.correct / quizScore.total) * 100 >= TRAINING_CONFIG.PASSING_SCORE
        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
        : 'bg-red-500/10 border border-red-500/20 text-red-400'
    }`}>
      {(quizScore.correct / quizScore.total) * 100 >= TRAINING_CONFIG.PASSING_SCORE
        ? TRAINING_CONFIG.MESSAGES.quizPassed
        : TRAINING_CONFIG.MESSAGES.quizFailed
      }
    </div>

    {/* Actions */}
    <div className="flex gap-4 mt-6">
      {(quizScore.correct / quizScore.total) * 100 < TRAINING_CONFIG.PASSING_SCORE && (
        <button
          onClick={handleRetryQuiz}
          className="flex-1 btn-secondary"
        >
          Réessayer
        </button>
      )}
      <button
        onClick={handleNextChapter}
        disabled={(quizScore.correct / quizScore.total) * 100 < TRAINING_CONFIG.PASSING_SCORE}
        className="flex-1 btn-premium"
      >
        Chapitre Suivant
      </button>
    </div>
  </div>
)}
```

### 5. Modifier le Démarrage du Quiz

```typescript
const handleStartQuiz = () => {
  setShowQuiz(true);
  setQuizAnswers({});
  setQuizSubmitted(false);
  setQuizScore(null);
  setQuizStarted(true); // Démarrer le timer
  setCurrentQuestionIndex(0);
  setTimeRemaining(TRAINING_CONFIG.TIME_PER_QUESTION);
};
```

### 6. Afficher une Question à la Fois

```tsx
{showQuiz && quizStarted && !quizSubmitted && (
  <div className="space-y-6">
    {/* Progression */}
    <div className="flex items-center justify-between mb-4">
      <span className="text-white/40 text-sm">
        Question {currentQuestionIndex + 1} / {quiz.length}
      </span>
      <div className="flex-1 mx-4 h-2 bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-pm-gold transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / quiz.length) * 100}%` }}
        />
      </div>
    </div>

    {/* Question actuelle */}
    {(() => {
      const question = quiz[currentQuestionIndex];
      const userAnswer = quizAnswers[currentQuestionIndex];

      return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((option, oIdx) => (
              <button
                key={oIdx}
                onClick={() => {
                  handleQuizAnswer(currentQuestionIndex, oIdx);
                  // Passer automatiquement à la question suivante
                  setTimeout(() => {
                    if (currentQuestionIndex < quiz.length - 1) {
                      setCurrentQuestionIndex(currentQuestionIndex + 1);
                      setTimeRemaining(TRAINING_CONFIG.TIME_PER_QUESTION);
                    } else {
                      handleQuizSubmit();
                    }
                  }, 500);
                }}
                disabled={userAnswer !== undefined}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  userAnswer === oIdx
                    ? 'bg-pm-gold/20 border-pm-gold/30 text-white'
                    : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'
                } ${userAnswer !== undefined ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    })()}
  </div>
)}
```

---

## 📊 Affichage de la Note Moyenne du Module

Dans la page principale de formation (`AdvancedTraining.tsx`), afficher la note moyenne :

```tsx
{(() => {
  const moduleProgress = allProgress.find(p => p.moduleId === module.num);
  if (!moduleProgress) return null;

  const averageScore = getModuleAverageScore(moduleProgress);
  const appreciation = getAppreciationForScore(
    Math.round(averageScore), 
    20
  );

  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl">{appreciation.emoji}</span>
      <span className={`font-bold ${appreciation.color}`}>
        {averageScore.toFixed(1)}/20
      </span>
      <span className="text-white/40 text-sm">
        ({appreciation.label})
      </span>
    </div>
  );
})()}
```

---

## 🔒 Blocage du Module Suivant

Dans `AdvancedTraining.tsx`, afficher un message si le module est verrouillé :

```tsx
{!isUnlocked && (
  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
    <div className="text-center p-6">
      <Lock className="w-12 h-12 text-white/20 mx-auto mb-4" />
      <h3 className="text-white font-bold mb-2">
        {TRAINING_CONFIG.MESSAGES.moduleLockedTitle}
      </h3>
      <p className="text-white/60 text-sm mb-4">
        {TRAINING_CONFIG.MESSAGES.moduleLockedMessage}
      </p>
      {(() => {
        const prevProgress = allProgress.find(p => p.moduleId === module.num - 1);
        if (!prevProgress) return null;
        
        const avgScore = getModuleAverageScore(prevProgress);
        return (
          <div className="text-white/40 text-xs">
            Note actuelle du module précédent : {avgScore.toFixed(1)}/20
            <br />
            (Minimum requis : 10/20)
          </div>
        );
      })()}
    </div>
  </div>
)}
```

---

## ✅ Checklist d'Implémentation

### Configuration :
- [x] PASSING_SCORE = 50
- [x] QUESTIONS_PER_QUIZ = 20
- [x] TIME_PER_QUESTION = 10
- [x] APPRECIATIONS définies
- [x] Fonction getAppreciation()

### Helpers :
- [x] isModuleUnlocked() mis à jour
- [x] getAppreciationForScore()
- [x] getModuleAverageScore()
- [x] canUnlockNextModule()

### TrainingModuleView :
- [ ] State pour timer
- [ ] Effet pour décompte
- [ ] Affichage du timer
- [ ] Une question à la fois
- [ ] Passage automatique
- [ ] Affichage de l'appréciation
- [ ] Blocage si note < 10/20

### AdvancedTraining :
- [ ] Affichage note moyenne
- [ ] Affichage appréciation
- [ ] Message de verrouillage
- [ ] Indication note requise

---

## 🎯 Résultat Attendu

### Pendant le Quiz :
- Timer visible en haut à droite
- Compte à rebours de 10 secondes
- Animation rouge quand < 3 secondes
- Une seule question affichée
- Passage automatique après réponse
- Soumission automatique si temps écoulé

### Après le Quiz :
- Score affiché (ex: 15/20)
- Appréciation avec emoji (ex: 👍 Bien)
- Note sur 20
- Message de félicitations ou d'encouragement
- Bouton "Réessayer" si échec
- Bouton "Chapitre Suivant" si réussite

### Sur la Page Principale :
- Note moyenne du module
- Appréciation globale
- Modules verrouillés si note < 10/20
- Message explicatif du verrouillage

---

## 📝 Prochaines Étapes

1. ⏳ Implémenter le timer dans TrainingModuleView
2. ⏳ Implémenter l'affichage une question à la fois
3. ⏳ Implémenter le système d'appréciation
4. ⏳ Tester le déblocage conditionnel
5. ⏳ Créer les 5 modules avec 10 chapitres
6. ⏳ Générer les 1000 questions (20 par chapitre)
7. ⏳ Tester l'ensemble du système
8. ⏳ Mettre à jour la documentation

---

**Voulez-vous que je commence par implémenter le timer et le système d'appréciation dans TrainingModuleView.tsx ?**
