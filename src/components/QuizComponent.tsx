import React, { useState } from 'react';

export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface QuizComponentProps {
    questions: QuizQuestion[];
    onComplete?: (score: number, total: number) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ questions, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionSelect = (optionIndex: number) => {
        setSelectedOption(optionIndex);
    };

    const handleNextQuestion = () => {
        if (selectedOption === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setShowResult(false);
        } else {
            setQuizCompleted(true);
            if (onComplete) {
                onComplete(score + (selectedOption === currentQuestion.correctAnswer ? 1 : 0), questions.length);
            }
        }
    };

    const handleRestartQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setScore(0);
        setShowResult(false);
        setQuizCompleted(false);
    };

    if (quizCompleted) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Quiz Terminé !</h2>
                <p className="text-lg mb-4">
                    Votre score : {score} / {questions.length}
                </p>
                <button
                    onClick={handleRestartQuiz}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Recommencer le quiz
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Question {currentQuestionIndex + 1} / {questions.length}</h2>
            <p className="mb-4">{currentQuestion.question}</p>
            
            <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center">
                        <input
                            type="radio"
                            id={`option-${index}`}
                            name="quiz-option"
                            checked={selectedOption === index}
                            onChange={() => handleOptionSelect(index)}
                            className="mr-2"
                        />
                        <label htmlFor={`option-${index}`} className="cursor-pointer">
                            {option}
                        </label>
                    </div>
                ))}
            </div>

            {showResult && (
                <div className="p-3 mb-4 bg-gray-100 rounded">
                    {selectedOption === currentQuestion.correctAnswer ? (
                        <p className="text-green-600 font-medium">Correct ! {currentQuestion.explanation}</p>
                    ) : (
                        <p className="text-red-600 font-medium">
                            Incorrect. La bonne réponse est : {currentQuestion.options[currentQuestion.correctAnswer]}
                            <br />
                            {currentQuestion.explanation}
                        </p>
                    )}
                </div>
            )}

            <button
                onClick={() => {
                    if (selectedOption === null) return;
                    if (!showResult) {
                        setShowResult(true);
                    } else {
                        handleNextQuestion();
                    }
                }}
                disabled={selectedOption === null}
                className={`px-4 py-2 rounded ${
                    selectedOption === null
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
                {showResult ? 'Question suivante' : 'Valider'}
            </button>
        </div>
    );
};

export default QuizComponent;
