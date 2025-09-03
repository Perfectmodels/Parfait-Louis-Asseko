import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';

const formationModules = [
  {
    title: "Module 1: Les Fondamentaux du Mannequinat",
    chapters: [
      "Histoire et évolution du mannequinat",
      "Les différents types de mannequinat (podium, photo, commercial)",
      "Comprendre les agences et le rôle de l'agent",
      "L'importance de l'image et du personal branding",
      "Les mensurations et standards de l'industrie",
      "Le vocabulaire de la mode",
      "Hygiène de vie et nutrition du mannequin",
      "Éthique et professionnalisme dans le métier"
    ]
  },
  {
    title: "Module 2: Techniques de Podium (Catwalk)",
    chapters: [
      "Maîtrise de la démarche et de la posture",
      "Les différents types de défilés (Haute Couture, Prêt-à-porter)",
      "Gestion du rythme et synchronisation avec la musique",
      "Les demi-tours (turns) et poses en bout de podium",
      "Défiler avec des accessoires (sacs, chapeaux, etc.)",
      "Défiler avec des tenues complexes (robes longues, traînes)",
      "Expression et attitude sur le podium",
      "Préparation en backstage et gestion du stress"
    ]
  },
  {
    title: "Module 3: Photographie & Expression Corporelle",
    chapters: [
      "Les bases de la pose photographique",
      "Maîtriser ses expressions faciales (le 'smize')",
      "L'art du portrait, du gros plan et du plan américain",
      "Poses en pied et gestion de l'espace",
      "Travailler avec la lumière en studio et en extérieur",
      "Le mannequinat éditorial vs commercial",
      "Raconter une histoire à travers la pose",
      "Créer et développer son book photo professionnel"
    ]
  },
    {
    title: "Module 4: Industrie de la Mode & Professionnalisme",
    chapters: [
      "Le fonctionnement d'un shooting et d'un défilé",
      "Collaborer avec les stylistes, photographes et maquilleurs",
      "Comprendre un contrat de mannequin",
      "La gestion financière et la facturation",
      "Les castings : préparation, attitude et suivi",
      "L'importance des réseaux sociaux pour un mannequin",
      "Les capitales de la mode et les marchés internationaux",
      "S'adapter aux tendances et évolutions de l'industrie"
    ]
  },
  {
    title: "Module 5: Carrière & Développement Personnel",
    chapters: [
      "Définir ses objectifs et son plan de carrière",
      "Développer sa confiance en soi et son charisme",
      "Techniques de communication et d'interview",
      "Gestion de l'image publique et e-réputation",
      "Le networking et la construction de son réseau professionnel",
      "Santé mentale et bien-être dans un milieu exigeant",
      "Se diversifier : comédie, influence, entrepreneuriat",
      "Planifier sa carrière sur le long terme et sa reconversion"
    ]
  },
];

const quizQuestions = [
    {
        question: "Quel est le rôle principal d'un agent de mannequins ?",
        options: ["Donner des cours de maquillage", "Gérer la carrière et trouver des contrats", "Organiser les défilés de mode", "Prendre les photos du book"],
        correctAnswer: "Gérer la carrière et trouver des contrats"
    },
    {
        question: "Qu'est-ce que le 'smize' en photographie ?",
        options: ["Un type d'éclairage de studio", "Sourire avec les yeux", "Une pose spécifique pour les mains", "Un format de photo pour les books"],
        correctAnswer: "Sourire avec les yeux"
    },
    {
        question: "Laquelle de ces villes n'est PAS considérée comme une capitale majeure de la mode ?",
        options: ["Paris", "Milan", "New York", "Dubaï"],
        correctAnswer: "Dubaï"
    },
    {
        question: "Que signifie 'Prêt-à-porter' ?",
        options: ["Des vêtements faits sur mesure", "Des vêtements produits en série et disponibles en boutique", "Des vêtements de seconde main", "Des tenues de défilé non commercialisables"],
        correctAnswer: "Des vêtements produits en série et disponibles en boutique"
    },
];

const Formations: React.FC = () => {
    const [openModule, setOpenModule] = useState<number | null>(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const hasAccess = sessionStorage.getItem('classroom_access');
        if (hasAccess !== 'granted') {
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('classroom_access');
        navigate('/login');
    };

    const toggleModule = (index: number) => {
        setOpenModule(openModule === index ? null : index);
    };

    const handleAnswerChange = (questionIndex: number, answer: string) => {
        if (submitted) return;
        setAnswers({ ...answers, [questionIndex]: answer });
    };

    const handleSubmitQuiz = () => {
        let newScore = 0;
        quizQuestions.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) {
                newScore++;
            }
        });
        setScore(newScore);
        setSubmitted(true);
    };

    return (
        <div className="bg-pm-dark text-pm-off-white">
            <SEO 
              title="Classroom"
              description="Accès à la plateforme de formation privée pour les mannequins de l'agence Perfect Models Management. Programme de 40 chapitres théoriques."
              keywords="formation mannequin, cours mannequinat, devenir mannequin, PMM classroom"
            />
            {/* Hero Section */}
            <section 
                className="relative min-h-[50vh] flex items-center justify-center text-center bg-cover bg-center"
                style={{ backgroundImage: "url('https://i.ibb.co/b5LgVZgr/DSC-0090.jpg')" }}
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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar */}
                    <aside className="lg:col-span-3 lg:sticky lg:top-24 self-start">
                        <div className="bg-black p-6 border border-pm-gold/20">
                          <h3 className="text-xl font-playfair text-pm-gold mb-4">Navigation du Cours</h3>
                          <nav>
                            {formationModules.map((module, moduleIndex) => (
                              <div key={moduleIndex} className="mb-3">
                                <h4 className="font-bold text-pm-off-white mb-2 text-sm">{module.title}</h4>
                                <ul className="space-y-1 pl-2 border-l border-pm-gold/30">
                                  {module.chapters.map((chapter, chapterIndex) => (
                                    <li key={chapterIndex}>
                                      <a href={`#module-${moduleIndex}`} onClick={() => setOpenModule(moduleIndex)} className="block text-xs text-pm-off-white/70 hover:text-pm-gold">
                                        {chapter}
                                      </a>
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
                                onClick={handleLogout}
                                className="absolute top-0 right-0 -mt-8 md:mt-0 inline-flex items-center gap-2 text-pm-gold/70 hover:text-pm-gold text-sm transition-colors"
                             >
                                 <ArrowLeftOnRectangleIcon className="w-5 h-5"/>
                                 <span className="hidden md:inline">Déconnexion</span>
                             </button>
                        </section>
                    
                        <section aria-label="Modules de formation" className="space-y-4">
                            {formationModules.map((module, index) => (
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
                                        className={`transition-all duration-500 ease-in-out ${openModule === index ? 'max-h-[600px] visible' : 'max-h-0 invisible'}`}
                                    >
                                        <div className="p-5 border-t border-pm-gold/20">
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-pm-off-white/80">
                                                {module.chapters.map((chapter, chapIndex) => (
                                                    <li key={chapIndex} className="py-1">{chapter}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </section>

                        {/* Quiz Section */}
                        <section aria-labelledby="quiz-title" className="mt-20">
                            <div className="bg-black border border-pm-gold/20 p-8">
                                <h2 id="quiz-title" className="text-3xl font-playfair text-pm-gold text-center mb-8">Testez Vos Connaissances</h2>
                                <div className="space-y-8">
                                    {quizQuestions.map((q, index) => (
                                        <div key={index}>
                                            <p className="font-bold mb-3">{index + 1}. {q.question}</p>
                                            <div className="space-y-2">
                                                {q.options.map((option, optionIndex) => {
                                                    const isSelected = answers[index] === option;
                                                    let labelClass = "text-pm-off-white/80";
                                                    if(submitted) {
                                                        if(option === q.correctAnswer) {
                                                            labelClass = "text-green-500 font-bold";
                                                        } else if (isSelected) {
                                                            labelClass = "text-red-500 line-through";
                                                        }
                                                    }
                                                    return (
                                                        <label key={optionIndex} className={`flex items-center gap-3 p-2 rounded cursor-pointer ${isSelected && !submitted ? 'bg-pm-gold/10' : ''}`}>
                                                            <input
                                                                type="radio"
                                                                name={`question-${index}`}
                                                                value={option}
                                                                checked={isSelected}
                                                                onChange={() => handleAnswerChange(index, option)}
                                                                disabled={submitted}
                                                                className="form-radio bg-pm-dark border-pm-off-white/30 text-pm-gold focus:ring-pm-gold"
                                                            />
                                                            <span className={labelClass}>{option}</span>
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
                                            <p className="text-pm-gold">Votre score : <span className="text-white">{score} / {quizQuestions.length}</span></p>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={handleSubmitQuiz}
                                            className="px-10 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:bg-white disabled:opacity-50"
                                            disabled={Object.keys(answers).length !== quizQuestions.length}
                                        >
                                            Soumettre le Quiz
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Formations;