import React, { useState, useEffect } from 'react';
// FIX: Fix react-router-dom imports by using a namespace import
import * as ReactRouterDOM from 'react-router-dom';
import { ChevronDownIcon, ArrowLeftOnRectangleIcon, AcademicCapIcon, CheckCircleIcon, XCircleIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import BackToTopButton from '../components/BackToTopButton';
import { QuizQuestion, Module } from '../types';
import { useData } from '../contexts/DataContext';

// --- STUDENT VIEW ---
const StudentView: React.FC<{ onLogout: () => void; courseData: Module[]; siteImages: any; }> = ({ onLogout, courseData, siteImages }) => {
    const [openModule, setOpenModule] = useState<number | null>(0);

    const toggleModule = (index: number) => {
        setOpenModule(openModule === index ? null : index);
    };

    return (
        <>
            <section 
                className="relative min-h-[50vh] flex items-center justify-center text-center bg-cover bg-center"
                style={{ backgroundImage: `url('${siteImages.classroomBg}')` }}
                aria-labelledby="formations-title"
            >
                <div className="absolute inset-0 bg-pm-dark/80"></div>
                <div className="relative z-10 p-6">
                    <h1 id="formations-title" className="text-4xl md:text-6xl font-playfair text-pm-gold font-extrabold" style={{ textShadow: '0 0 15px rgba(212, 175, 55, 0.7)' }}>
                        PMM Classroom
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-pm-off-white/90 max-w-3xl mx-auto">
                        40 chapitres théoriques pour maîtriser l'art du mannequinat et lancer une carrière à succès.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 py-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                     {/* Sidebar */}
                    <aside className="lg:col-span-3 lg:sticky lg:top-32 self-start mb-12 lg:mb-0">
                        <div className="bg-black p-6 border border-pm-gold/20">
                          <h3 className="text-xl font-playfair text-pm-gold mb-4">Navigation du Cours</h3>
                          <nav>
                            {courseData.map((module, moduleIndex) => (
                              <div key={moduleIndex} className="mb-3">
                                <a href={`#module-${moduleIndex}`} onClick={(e) => { e.preventDefault(); toggleModule(moduleIndex); document.getElementById(`module-${moduleIndex}`)?.scrollIntoView(); }} className="font-bold text-pm-off-white mb-2 text-sm hover:text-pm-gold">
                                    {module.title}
                                </a>
                                <ul className="mt-2 space-y-1 pl-2 border-l border-pm-gold/30">
                                  {module.chapters.map((chapter, chapterIndex) => (
                                    <li key={chapterIndex}>
                                      <ReactRouterDOM.Link to={`/formations/${module.slug}/${chapter.slug}`} className="block text-xs text-pm-off-white/70 hover:text-pm-gold">
                                        {chapter.title}
                                      </ReactRouterDOM.Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </nav>
                        </div>
                    </aside>
                    
                    {/* Main Content */}
                    <main className="lg:col-span-9">
                        <section className="text-center mb-16 relative">
                             <h2 className="text-3xl font-playfair text-pm-gold mb-4">De l'Aspiration à la Professionnalisation</h2>
                             <p className="text-pm-off-white/80 leading-relaxed max-w-3xl mx-auto">
                                Notre programme complet est conçu pour vous doter de toutes les connaissances théoriques indispensables pour exceller. Chaque module explore en profondeur un aspect crucial du métier, vous préparant à naviguer avec confiance dans l'industrie de la mode.
                             </p>
                             <button 
                                onClick={onLogout}
                                className="absolute top-0 right-0 -mt-8 md:mt-0 inline-flex items-center gap-2 text-pm-gold/70 hover:text-pm-gold text-sm transition-colors"
                             >
                                 <ArrowLeftOnRectangleIcon className="w-5 h-5"/>
                                 <span className="hidden md:inline">Déconnexion</span>
                             </button>
                        </section>
                        
                        <div className="mb-12">
                            <ReactRouterDOM.Link to="/formations/forum" className="group block w-full text-left p-6 bg-pm-gold/10 border-2 border-dashed border-pm-gold/30 hover:border-pm-gold hover:bg-pm-gold/20 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <ChatBubbleBottomCenterTextIcon className="w-10 h-10 text-pm-gold flex-shrink-0" />
                                    <div>
                                        <h3 className="text-xl font-bold text-pm-gold">Rejoindre le Forum de Discussion</h3>
                                        <p className="text-sm text-pm-off-white/80">Échangez avec les autres mannequins, posez vos questions et partagez votre expérience.</p>
                                    </div>
                                </div>
                            </ReactRouterDOM.Link>
                        </div>
                    
                        <section aria-label="Modules de formation" className="space-y-4">
                            {courseData.map((module, index) => (
                                <div key={index} id={`module-${index}`} className="bg-black border border-pm-gold/20 overflow-hidden scroll-mt-24">
                                    <button
                                        onClick={() => toggleModule(index)}
                                        className="w-full flex justify-between items-center p-4 md:p-5 text-left text-lg md:text-xl font-bold text-pm-gold hover:bg-pm-gold/5"
                                        aria-expanded={openModule === index}
                                        aria-controls={`module-content-${index}`}
                                    >
                                        <span>{module.title}</span>
                                        <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${openModule === index ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div
                                        id={`module-content-${index}`}
                                        className={`transition-all duration-500 ease-in-out ${openModule === index ? 'max-h-full visible' : 'max-h-0 invisible'}`}
                                    >
                                        <div className="p-5 border-t border-pm-gold/20">
                                            <ul className="space-y-3 list-disc list-inside">
                                                {module.chapters.map((chapter) => (
                                                    <li key={chapter.slug}>
                                                        <ReactRouterDOM.Link to={`/formations/${module.slug}/${chapter.slug}`} className="text-pm-off-white/80 hover:text-pm-gold hover:underline">
                                                            {chapter.title}
                                                        </ReactRouterDOM.Link>
                                                    </li>
                                                ))}
                                            </ul>
                                            {module.quiz && module.quiz.length > 0 && <QuizComponent quiz={module.quiz} moduleSlug={module.slug} />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </section>
                    </main>
                </div>
            </div>
            <BackToTopButton />
        </>
    );
};

// --- QUIZ COMPONENT for StudentView ---
const QuizComponent: React.FC<{ quiz: QuizQuestion[], moduleSlug: string }> = ({ quiz, moduleSlug }) => {
    const { data, saveData } = useData();
    const userId = sessionStorage.getItem('userId');
    const userRole = sessionStorage.getItem('classroom_role');
    const quizId = moduleSlug;

    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    // Check if the quiz was already taken
    useEffect(() => {
        if (userRole === 'model' && userId && data?.models) {
            const model = data.models.find(m => m.id === userId);
            if (model && model.quizScores && model.quizScores[quizId] !== undefined) {
                setScore(model.quizScores[quizId]);
                setSubmitted(true);
            }
        }
    }, [data, userId, userRole, quizId]);


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
        const scorePercentage = Math.round((newScore / quiz.length) * 100);
        setScore(scorePercentage);
        setSubmitted(true);
        
        // Save score if the user is a model
        if (userRole === 'model' && userId && data?.models) {
            const updatedModels = data.models.map(m => {
                if (m.id === userId) {
                    const newQuizScores = { ...m.quizScores, [quizId]: scorePercentage };
                    return { ...m, quizScores: newQuizScores };
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
                                            optionClass = "border-green-500 bg-green-500/10";
                                            icon = <CheckCircleIcon className="w-5 h-5 text-green-500"/>;
                                        } else if (isSelected) {
                                            optionClass = "border-red-500 bg-red-500/10";
                                            icon = <XCircleIcon className="w-5 h-5 text-red-500"/>;
                                        }
                                    } else if (isSelected) {
                                        optionClass = "border-pm-gold bg-pm-gold/10";
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
                    {submitted ? (
                        <div className="text-2xl font-bold">
                            <p className="text-pm-gold">Votre score : <span className="text-white">{score}%</span></p>
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

// --- MAIN COMPONENT ---
const Formations: React.FC = () => {
    const { data, isInitialized } = useData();
    const navigate = ReactRouterDOM.useNavigate();

    useEffect(() => {
        const hasAccess = sessionStorage.getItem('classroom_access');
        if (hasAccess !== 'granted') {
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('classroom_access');
        sessionStorage.removeItem('classroom_role');
        sessionStorage.removeItem('userId');
        navigate('/login');
    };

    if (!isInitialized || !data) {
        return <div className="min-h-screen bg-pm-dark"></div>; 
    }

    return (
        <>
            <SEO 
              title="PMM Classroom | Formation Mannequin Professionnel"
              description="Accès exclusif à la plateforme de formation PMM Classroom. Un programme complet pour les mannequins de l'agence, couvrant toutes les facettes du métier pour une carrière réussie."
              keywords="formation mannequin gabon, cours de mannequinat, devenir mannequin professionnel, pmm classroom, école mannequin"
            />
            <StudentView onLogout={handleLogout} courseData={data.courseData} siteImages={data.siteImages} />
        </>
    );
};

export default Formations;