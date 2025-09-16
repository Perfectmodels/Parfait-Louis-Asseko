import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import SEO from '../../components/SEO';
import BackToTopButton from '../../components/BackToTopButton';
import { useData } from '../contexts/DataContext';

const BeginnerClassroom: React.FC = () => {
    const { data } = useData();
    const navigate = useNavigate();
    const [openModule, setOpenModule] = useState<number | null>(0);
    const userName = sessionStorage.getItem('userName');

    const courseData = data?.beginnerCourseData || [];
    const siteImages = data?.siteImages;

    const toggleModule = (index: number) => {
        setOpenModule(openModule === index ? null : index);
    };
    
    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    return (
        <>
            <SEO 
              title="Classroom Débutant"
              description="Votre parcours commence ici. Accédez aux modules de formation de base pour les nouveaux mannequins de Perfect Models Management."
              image={siteImages?.classroomBg}
              noIndex
            />
            <section 
                className="relative min-h-[50vh] flex items-center justify-center text-center bg-cover bg-center"
                style={{ backgroundImage: `url('${siteImages?.classroomBg}')` }}
                aria-labelledby="formations-title"
            >
                <div className="absolute inset-0 bg-pm-dark/80"></div>
                <div className="relative z-10 p-6">
                    <h1 id="formations-title" className="text-4xl md:text-6xl font-playfair text-pm-gold font-extrabold" style={{ textShadow: '0 0 15px rgba(212, 175, 55, 0.7)' }}>
                        Classroom Débutant
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-pm-off-white/90 max-w-3xl mx-auto">
                       Bienvenue, {userName?.split(' ')[0] || 'Mannequin'} ! Votre formation commence maintenant.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 py-20">
                 <section className="text-center mb-16 relative">
                     <h2 className="text-3xl font-playfair text-pm-gold mb-4">Les Fondations de Votre Carrière</h2>
                     <p className="text-pm-off-white/80 leading-relaxed max-w-3xl mx-auto">
                        Ce programme est conçu pour vous donner toutes les bases théoriques et pratiques pour bien démarrer dans le monde du mannequinat. Chaque module est une étape essentielle de votre parcours.
                     </p>
                     <div className="absolute top-0 right-0 -mt-8 md:mt-0 flex items-center gap-4">
                         <Link to="/profil-debutant" className="inline-flex items-center gap-2 text-pm-gold/80 hover:text-pm-gold text-sm transition-colors underline underline-offset-4">Mon Profil</Link>
                         <button 
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 text-pm-gold/70 hover:text-pm-gold text-sm transition-colors"
                         >
                             <ArrowLeftOnRectangleIcon className="w-5 h-5"/>
                             <span className="hidden md:inline">Déconnexion</span>
                         </button>
                     </div>
                </section>
            
                <section aria-label="Modules de formation" className="space-y-4 max-w-4xl mx-auto">
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
                                                <Link to={`/classroom-debutant/${module.slug}/${chapter.slug}`} className="text-pm-off-white/80 hover:text-pm-gold hover:underline">
                                                    {chapter.title}
                                                </Link>
                                            </li>
                                        ))}
                                        {module.quiz && module.quiz.length > 0 && (
                                            <li className="mt-2">
                                                <Link
                                                    to={module.chapters[0] ? `/classroom-debutant/${module.slug}/${module.chapters[0].slug}#quiz` : `/classroom-debutant/${module.slug}/${module.chapters[0]?.slug || ''}#quiz`}
                                                    className="inline-flex items-center gap-2 text-pm-gold hover:underline"
                                                >
                                                    Quiz du module • {module.quiz.length} question{module.quiz.length > 1 ? 's' : ''}
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
            <BackToTopButton />
        </>
    );
};

export default BeginnerClassroom;