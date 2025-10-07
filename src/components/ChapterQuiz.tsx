import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { QuizQuestion } from '../types';

interface ChapterQuizProps {
  quiz: QuizQuestion[];
  chapterSlug: string;
  moduleSlug: string;
  userType: 'pro' | 'beginner';
}

const ChapterQuiz: React.FC<ChapterQuizProps> = ({ quiz, chapterSlug, moduleSlug, userType }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(0);

  // Load saved progress from localStorage
  useEffect(() => {
    const storageKey = `quiz_${userType}_${moduleSlug}_${chapterSlug}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setSelectedAnswers(parsed.answers || {});
      setShowResults(parsed.completed || false);
      setScore(parsed.score || 0);
    }
  }, [chapterSlug, moduleSlug, userType]);

  // Save progress to localStorage
  const saveProgress = (answers: { [key: number]: string }, completed: boolean, finalScore: number) => {
    const storageKey = `quiz_${userType}_${moduleSlug}_${chapterSlug}`;
    localStorage.setItem(storageKey, JSON.stringify({
      answers,
      completed,
      score: finalScore,
      timestamp: new Date().toISOString()
    }));

    // Also save to user's quiz scores for admin tracking
    const userStorageKey = userType === 'pro' ? 'proModelSession' : 'beginnerStudentSession';
    const userSession = localStorage.getItem(userStorageKey);
    if (userSession) {
      const user = JSON.parse(userSession);
      const quizScoresKey = `quizScores_${user.id || user.email}`;
      const existingScores = localStorage.getItem(quizScoresKey);
      const scores = existingScores ? JSON.parse(existingScores) : {};
      
      scores[`${moduleSlug}_${chapterSlug}`] = {
        score: finalScore,
        total: quiz.length,
        percentage: Math.round((finalScore / quiz.length) * 100),
        passed: (finalScore / quiz.length) >= 0.7,
        completedAt: new Date().toISOString(),
        attemptsLeft: 2 // Default, will be updated on subsequent attempts
      };

      localStorage.setItem(quizScoresKey, JSON.stringify(scores));
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    quiz.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
    saveProgress(selectedAnswers, true, correctCount);
  };

  const handleRetry = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (!quizStarted) {
    return (
      <div className="mt-12 bg-black border-2 border-pm-gold/30 rounded-lg p-8 print-hide">
        <div className="text-center">
          <h3 className="text-3xl font-playfair text-pm-gold mb-4">
            📝 Quiz du Chapitre
          </h3>
          <p className="text-pm-off-white/80 mb-6">
            Testez vos connaissances sur ce chapitre avec {quiz.length} questions.
          </p>
          <p className="text-sm text-pm-off-white/60 mb-8">
            Score de passage : 70% • Vous pouvez refaire le quiz si nécessaire
          </p>
          <button
            onClick={handleStartQuiz}
            className="px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white hover:scale-105"
          >
            Commencer le Quiz
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / quiz.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="mt-12 bg-black border-2 border-pm-gold/30 rounded-lg p-8 print-hide">
        <div className="text-center">
          <h3 className="text-3xl font-playfair text-pm-gold mb-4">
            {passed ? '🎉 Félicitations !' : '📚 Continuez vos efforts !'}
          </h3>
          <div className="my-8">
            <div className={`text-6xl font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>
              {percentage}%
            </div>
            <p className="text-xl text-pm-off-white/80 mt-2">
              {score} / {quiz.length} réponses correctes
            </p>
          </div>

          {passed ? (
            <p className="text-pm-off-white/80 mb-6">
              Excellent travail ! Vous avez maîtrisé ce chapitre.
            </p>
          ) : (
            <p className="text-pm-off-white/80 mb-6">
              Vous devez obtenir au moins 70% pour valider ce chapitre. Révisez le contenu et réessayez.
            </p>
          )}

          <div className="space-y-4 mt-8 text-left max-w-2xl mx-auto">
            <h4 className="text-lg font-bold text-pm-gold mb-4">Détails des réponses :</h4>
            {quiz.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={index} className={`p-4 border rounded-lg ${isCorrect ? 'border-green-400/30 bg-green-900/10' : 'border-red-400/30 bg-red-900/10'}`}>
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircleIcon className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="text-pm-off-white font-semibold mb-2">
                        {index + 1}. {question.question}
                      </p>
                      {!isCorrect && (
                        <>
                          <p className="text-red-400 text-sm mb-1">
                            Votre réponse : {userAnswer || 'Non répondu'}
                          </p>
                          <p className="text-green-400 text-sm">
                            Bonne réponse : {question.correctAnswer}
                          </p>
                        </>
                      )}
                      {isCorrect && (
                        <p className="text-green-400 text-sm">
                          ✓ Correct : {question.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <button
              onClick={handleRetry}
              className="px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white hover:scale-105"
            >
              Refaire le Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.length) * 100;

  return (
    <div className="mt-12 bg-black border-2 border-pm-gold/30 rounded-lg p-8 print-hide">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-pm-off-white/60">
            Question {currentQuestionIndex + 1} sur {quiz.length}
          </span>
          <span className="text-sm text-pm-gold font-bold">
            {Math.round(progress)}% complété
          </span>
        </div>
        <div className="w-full bg-pm-dark rounded-full h-2">
          <div
            className="bg-pm-gold h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <h3 className="text-2xl font-playfair text-pm-gold mb-6">
        {currentQuestion.question}
      </h3>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelectAnswer(option)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedAnswers[currentQuestionIndex] === option
                ? 'border-pm-gold bg-pm-gold/10 text-pm-off-white'
                : 'border-pm-off-white/20 bg-pm-dark/50 text-pm-off-white/80 hover:border-pm-gold/50'
            }`}
          >
            <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {option}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`px-6 py-2 rounded-full border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm transition-all duration-300 ${
            currentQuestionIndex === 0
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-pm-gold hover:text-pm-dark'
          }`}
        >
          ← Précédent
        </button>

        {currentQuestionIndex === quiz.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length !== quiz.length}
            className={`px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 ${
              Object.keys(selectedAnswers).length === quiz.length
                ? 'bg-pm-gold text-pm-dark hover:bg-white hover:scale-105'
                : 'bg-pm-off-white/20 text-pm-off-white/40 cursor-not-allowed'
            }`}
          >
            Soumettre
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!selectedAnswers[currentQuestionIndex]}
            className={`px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 ${
              selectedAnswers[currentQuestionIndex]
                ? 'bg-pm-gold text-pm-dark hover:bg-white hover:scale-105'
                : 'bg-pm-off-white/20 text-pm-off-white/40 cursor-not-allowed'
            }`}
          >
            Suivant →
          </button>
        )}
      </div>
    </div>
  );
};

export default ChapterQuiz;

