import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import NotFound from './NotFound';
import SEO from '../components/SEO';
import { ChevronLeftIcon, ArrowDownTrayIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';
import { QuizQuestion, Model } from '../types';

const QuizComponent: React.FC<{ quiz: QuizQuestion[], moduleSlug: string, moduleTitle: string }> = ({ quiz, moduleSlug, moduleTitle }) => {
    const { data, saveData } = useData();
    const userId = sessionStorage.getItem('userId');
    
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState<{ score: number, total: number } | null>(null);
    const timesLeftRef = useRef(0);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && !submitted) {
                timesLeftRef.current += 1;
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [submitted]);

    useEffect(() => {
        if (userId && data?.models) {
            const model = data.models.find(m => m.id === userId);
            const savedResult = model?.quizScores?.[moduleSlug];
            if (savedResult) {
                setResult({ score: savedResult.score, total: savedResult.total });
                setSubmitted(true);
            }
        }
    }, [data?.models, userId, moduleSlug]);


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
        
        setResult({ score: newScore, total: quiz.length });
        setSubmitted(true);
        
        if (userId && data?.models) {
            const timestamp = new Date().toISOString();
            const updatedModels = data.models.map(m => {
                if (m.id === userId) {
                    const newQuizScores = { 
                        ...m.quizScores, 
                        [moduleSlug]: { 
                            score: newScore, 
                            total: quiz.length,
                            timesLeft: timesLeftRef.current,
                            timestamp,
                        } 
                    };
                    return { ...m, quizScores: newQuizScores, lastActivity: timestamp };
                }
                return m;
            });
            await saveData({ ...data, models: updatedModels });
        }
    };

    return (
        <section aria-labelledby={`quiz-title-${moduleSlug}`} className="mt-12 pt-8 border-t border-pm-gold/30">
            <div className="bg-pm-dark border border-pm-gold/20 p-8">
                <h3 id={`quiz-title-${moduleSlug}`} className="text-2xl font-playfair text-pm-gold text-center mb-8">Testez vos connaissances</h3>
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
                                                name={`quiz-${moduleSlug}-question-${index}`}
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
                    {submitted && result ? (
                        <div className="text-2xl font-bold">
                            <p className="text-pm-gold">Votre score : <span className="text-white">{result.score} / {result.total}</span></p>
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

const ChapterDetail: React.FC = () => {
  const { data, isInitialized } = useData();
  const { moduleSlug, chapterSlug } = useParams<{ moduleSlug: string, chapterSlug: string }>();
  
  const module = data?.courseData.find(m => m.slug === moduleSlug);
  const chapter = module?.chapters.find(c => c.slug === chapterSlug);

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }

  if (!chapter || !module) {
    return <NotFound />;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO 
        title={`${chapter.title} | PMM Classroom`}
        description={`Leçon détaillée sur "${chapter.title}" du module "${module.title}". Maîtrisez les compétences essentielles du mannequinat avec le programme de formation de Perfect Models Management.`}
        keywords={`apprendre le mannequinat, cours ${chapter.title}, formation ${module.title}, pmm classroom`}
        image={data.siteImages.classroomBg}
      />
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex justify-between items-center mb-8 print-hide">
          <Link to="/formations" className="inline-flex items-center gap-2 text-pm-gold hover:underline">
            <ChevronLeftIcon className="w-5 h-5" />
            Retour au Classroom
          </Link>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Télécharger en PDF
          </button>
        </div>
        
        <div className="printable-content">
          <article className="bg-black p-8 md:p-12 border border-pm-gold/20">
            <header>
              <p className="text-sm uppercase tracking-widest text-pm-gold/80 font-bold">{module.title}</p>
              <h1 className="text-4xl lg:text-5xl font-playfair text-pm-off-white my-4 leading-tight">
                {chapter.title}
              </h1>
            </header>
            <div className="mt-8 text-lg text-pm-off-white/80 leading-relaxed">
              {chapter.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </article>
        </div>
        
        {/* FIX: Check for quiz on module, not chapter, and pass moduleSlug. */}
        {module.quiz && module.quiz.length > 0 && (
          <QuizComponent quiz={module.quiz} moduleSlug={module.slug} moduleTitle={module.title} />
        )}

      </div>
    </div>
  );
};

export default ChapterDetail;
