
import React, { useState, useEffect } from 'react';
import { QuizQuestion, BeginnerStudent, Module } from '../types';
import { useData } from '../contexts/DataContext';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface BeginnerQuizProps {
    quiz: QuizQuestion[];
    moduleSlug: string;
    chapterSlug: string;
}

const BeginnerQuiz: React.FC<BeginnerQuizProps> = ({ quiz, moduleSlug, chapterSlug }) => {
    const { data, saveData } = useData();
    const userId = sessionStorage.getItem('userId'); // This is the CastingApplication ID
    const quizId = chapterSlug;

    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    // Check if the quiz was already taken
    useEffect(() => {
        if (userId && data?.beginnerStudents) {
            const student = data.beginnerStudents.find(s => s.id === userId);
            if (student && student.quizScores && student.quizScores[quizId] !== undefined) {
                setScore(student.quizScores[quizId]);
                setSubmitted(true);
            }
        }
    }, [data?.beginnerStudents, userId, quizId]);


    const handleAnswerChange = (questionIndex: number, answer: string) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    };

    const handleSubmitQuiz = async () => {
        let newScore = 0;
        quiz.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) {
                newScore++;
            }
        });
        setScore(newScore);
        setSubmitted(true);
        
        if (userId && data?.beginnerStudents) {
            const updatedStudents = data.beginnerStudents.map(s => {
                if (s.id === userId) {
                    const newQuizScores = { ...s.quizScores, [quizId]: newScore };
                    return { ...s, quizScores: newQuizScores };
                }
                return s;
            });
            await saveData({ ...data, beginnerStudents: updatedStudents });
        }
    };

    return (
        <section aria-labelledby={`quiz-title-${chapterSlug}`} className="mt-12 pt-8 border-t border-pm-gold/30">
            <div className="bg-pm-dark border border-pm-gold/20 p-8">
                <h3 id={`quiz-title-${chapterSlug}`} className="text-2xl font-playfair text-pm-gold text-center mb-8">Testez vos connaissances</h3>
                <div className="space-y-8">
                    {quiz.map((q, index) => (
                        <div key={index}>
                            <p className="font-bold mb-3">{index + 1}. {q.question}</p>
                            <div className="space-y-2">
                                {q.options.map((option, optionIndex) => {
                                    const isSelected = answers[index] === option;
                                    let optionClass = "border-pm-dark hover:border-pm-gold/50";
                                    let icon = null;

                                    if(submitted) {
                                        if(option === q.correctAnswer) {
                                            optionClass = "border-green-500 bg-green-500/10 text-green-300";
                                            icon = <CheckCircleIcon className="w-5 h-5 text-green-500"/>;
                                        } else if (isSelected) {
                                            optionClass = "border-red-500 bg-red-500/10 text-red-300";
                                            icon = <XCircleIcon className="w-5 h-5 text-red-500"/>;
                                        }
                                    } else if (isSelected) {
                                        optionClass = "border-pm-gold bg-pm-gold/10 text-pm-gold";
                                    }
                                    return (
                                        <label key={optionIndex} className={`flex items-center gap-3 p-3 border rounded cursor-pointer transition-colors ${optionClass}`}>
                                            <input
                                                type="radio"
                                                name={`quiz-${chapterSlug}-question-${index}`}
                                                value={option}
                                                checked={isSelected}
                                                onChange={() => handleAnswerChange(index, option)}
                                                disabled={submitted}
                                                className="hidden"
                                            />
                                            <div className="w-5">{icon}</div>
                                            <span>{option}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 text-center">
                    {submitted ? (
                        <div className="text-2xl font-bold">
                            <p className="text-pm-gold">Votre score : <span className="text-white">{score} / {quiz.length}</span></p>
                        </div>
                    ) : (
                        <button 
                            onClick={handleSubmitQuiz}
                            className="px-10 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:bg-white disabled:opacity-50"
                            disabled={Object.keys(answers).length !== quiz.length}
                        >
                            Valider le Quiz
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BeginnerQuiz;
