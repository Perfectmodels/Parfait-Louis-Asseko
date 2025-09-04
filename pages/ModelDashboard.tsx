

import React from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpenIcon, PresentationChartLineIcon, UserIcon } from '@heroicons/react/24/outline';

const ModelDashboard: React.FC = () => {
    const { data } = useData();
    const navigate = useNavigate();
    const userId = sessionStorage.getItem('userId');
    const model = data?.models.find(m => m.id === userId);
    const courseModulesWithQuizzes = data?.courseData.filter(m => m.quiz && m.quiz.length > 0);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    if (!model) {
        return (
            <div className="bg-pm-dark text-pm-off-white min-h-screen flex items-center justify-center">
                <p>Chargement du profil...</p>
            </div>
        );
    }
    
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title={`Profil de ${model.name}`} noIndex />
            <div className="container mx-auto px-6 max-w-4xl">
                <header className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-12">
                    <div>
                        <h1 className="text-4xl font-playfair text-pm-gold">Bienvenue, {model.name.split(' ')[0]}</h1>
                        <p className="text-pm-off-white/80">Ceci est votre espace personnel.</p>
                    </div>
                     <button onClick={handleLogout} className="text-sm text-pm-gold/80 hover:text-pm-gold">Déconnexion</button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Liens Rapides */}
                    <div className="space-y-6">
                        <Link to="/formations" className="group block bg-black p-8 border border-pm-gold/20 hover:border-pm-gold transition-all duration-300 transform hover:-translate-y-1">
                             <BookOpenIcon className="w-10 h-10 text-pm-gold mb-4" />
                            <h2 className="text-2xl font-playfair text-pm-gold mb-2">Accéder au Classroom</h2>
                            <p className="text-pm-off-white/70">Continuez votre formation, consultez les cours et testez vos connaissances.</p>
                        </Link>
                        <Link to={`/mannequins/${model.id}`} className="group block bg-black p-8 border border-pm-gold/20 hover:border-pm-gold transition-all duration-300 transform hover:-translate-y-1">
                             <UserIcon className="w-10 h-10 text-pm-gold mb-4" />
                            <h2 className="text-2xl font-playfair text-pm-gold mb-2">Voir mon Portfolio Public</h2>
                            <p className="text-pm-off-white/70">Consultez votre profil tel qu'il apparaît sur le site pour les clients et les visiteurs.</p>
                        </Link>
                    </div>
                    
                    {/* Résultats des Quiz */}
                    <div className="bg-black p-8 border border-pm-gold/20">
                        <h2 className="text-2xl font-playfair text-pm-gold mb-4 flex items-center gap-3">
                           <PresentationChartLineIcon className="w-6 h-6"/> Mes Résultats
                        </h2>
                        {courseModulesWithQuizzes && courseModulesWithQuizzes.length > 0 ? (
                             <ul className="space-y-3">
                                {courseModulesWithQuizzes.map(module => {
                                    const score = model.quizScores?.[module.slug];
                                    return (
                                        <li key={module.slug} className="flex justify-between items-center bg-pm-dark p-3 text-sm">
                                            <span className="text-pm-off-white/80">{module.title}</span>
                                            {score !== undefined ? (
                                                <span className={`font-bold text-lg ${getScoreColor(score)}`}>{score}%</span>
                                            ) : (
                                                <span className="text-xs text-pm-off-white/50">Non complété</span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-pm-off-white/70 text-sm">Aucun quiz disponible pour le moment.</p>
                        )}
                       
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ModelDashboard;
