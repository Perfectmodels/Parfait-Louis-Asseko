import React from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { Module } from '../types';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import CourseCard from '../components/CourseCard';
import { Link } from 'react-router-dom';

const Trainings: React.FC = () => {
    const { data, isInitialized } = useData();
    const courses = data?.courseData || [];
    const beginnerCourses = data?.beginnerCourseData || [];

    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pm-dark text-pm-gold">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold mx-auto mb-4"></div>
                    <p>Chargement des formations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-pm-dark text-pm-off-white">
            <SEO
                title="Nos Formations de Mannequinat | Perfect Models Management"
                description="Devenez un mannequin professionnel grâce à nos formations complètes. Apprenez la démarche, la posture, la photographie et lancez votre carrière."
                image={data?.siteImages.servicesHero}
            />

            {/* Hero Section */}
            <div
                className="relative bg-cover bg-center h-[60vh] flex items-center justify-center text-center"
                style={{
                    backgroundImage: data?.siteImages?.servicesHero ? `url(${data.siteImages.servicesHero})` : 'none',
                }}
            >
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
                <div className="relative z-10 p-4 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-pm-gold/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                        <AcademicCapIcon className="w-6 h-6 text-pm-gold" />
                        <span className="text-sm font-semibold text-pm-gold">Formations d'Excellence</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-playfair text-white font-bold mb-4">
                        Lancez Votre Carrière de Mannequin
                    </h1>
                    <p className="text-lg md:text-xl text-pm-off-white/90 max-w-3xl mx-auto">
                        Nos programmes de formation sont conçus pour vous donner les compétences, la confiance et les connexions nécessaires pour réussir dans l'industrie de la mode.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-20">
                <div className="container mx-auto px-6">
                    {/* Formation Professionnelle */}
                    <section id="professional-training">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-4xl font-playfair text-pm-gold mb-4">Formation Professionnelle</h2>
                            <p className="text-pm-off-white/80">
                                Un programme intensif pour ceux qui aspirent à une carrière de mannequinat au plus haut niveau.
                                Ce cursus couvre tous les aspects du métier, de la technique à la gestion de carrière.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.map((course, index) => (
                                <CourseCard key={course.id || index} course={course} index={index} />
                            ))}
                        </div>
                    </section>

                    {/* Formation Débutant */}
                    {beginnerCourses && beginnerCourses.length > 0 && (
                         <section id="beginner-training" className="mt-24">
                            <div className="text-center max-w-3xl mx-auto mb-12">
                                <h2 className="text-4xl font-playfair text-pm-gold mb-4">Atelier d'Initiation</h2>
                                <p className="text-pm-off-white/80">
                                    Vous débutez ? Cet atelier est parfait pour découvrir les bases du mannequinat,
                                    améliorer votre confiance en vous et faire vos premiers pas devant l'objectif.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {beginnerCourses.map((course, index) => (
                                    <CourseCard key={course.id || index} course={course} index={index} isBeginner={true} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* CTA Section */}
                    <section className="mt-24 bg-gradient-to-r from-pm-gold/80 to-yellow-500/80 text-pm-dark rounded-xl p-12 text-center shadow-2xl shadow-pm-gold/20">
                        <h3 className="text-4xl font-playfair font-bold mb-4">Prêt à commencer ?</h3>
                        <p className="text-xl max-w-2xl mx-auto mb-8">
                            Rejoignez la prochaine génération de mannequins de Perfect Models Management. Les inscriptions sont ouvertes.
                        </p>
                        <Link to="/contact" className="px-10 py-4 bg-pm-dark text-white font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-black hover:shadow-lg">
                            Postulez Maintenant
                        </Link>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Trainings;
