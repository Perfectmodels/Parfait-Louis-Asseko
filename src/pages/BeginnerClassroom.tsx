import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ChevronDownIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon,
    BookOpenIcon, AcademicCapIcon, TrophyIcon, ClockIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import BackToTopButton from '../components/BackToTopButton';
import { useData } from '../contexts/DataContext';

const BeginnerClassroom: React.FC = () => {
    const { data } = useData();
    const navigate = useNavigate();
    const [openModule, setOpenModule] = useState<number | null>(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
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
        <div className="min-h-screen bg-pm-dark">
            <SEO 
              title="Classroom Débutant"
              description="Votre parcours commence ici. Accédez aux modules de formation de base pour les nouveaux mannequins de Perfect Models Management."
              image={siteImages?.classroomBg}
              noIndex
            />
            
            {/* Header */}
            <header className="bg-black/50 backdrop-blur-sm border-b border-pm-gold/20 sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-md text-pm-gold hover:bg-pm-gold/10 transition-colors"
                            >
                                {sidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <AcademicCapIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-pm-gold">Classroom Débutant</h1>
                                    <p className="text-xs text-pm-off-white/60">Bienvenue, {userName?.split(' ')[0] || 'Mannequin'}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {/* Progress Indicator */}
                            <div className="hidden sm:flex items-center gap-2 text-sm text-pm-off-white/60">
                                <ClockIcon className="w-4 h-4" />
                                <span>Formation en cours</span>
                            </div>
                            
                            {/* User Info */}
                            <div className="hidden sm:flex items-center gap-3 text-sm">
                                <div className="text-right">
                                    <p className="text-pm-gold font-medium">{userName || 'Mannequin'}</p>
                                    <p className="text-pm-off-white/60 text-xs">Niveau Débutant</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-md text-pm-gold hover:bg-pm-gold/10 transition-colors"
                                    title="Déconnexion"
                                >
                                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-black/80 backdrop-blur-sm border-r border-pm-gold/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex flex-col h-full pt-16 lg:pt-0">
                        <nav className="flex-1 px-4 py-6 space-y-2">
                            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 mb-4">
                                <h3 className="text-sm font-medium text-blue-400 mb-2">Votre Progression</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-pm-off-white/70">Modules complétés</span>
                                        <span className="text-blue-400">0/{courseData.length}</span>
                                    </div>
                                    <div className="w-full bg-pm-dark rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                                    </div>
                                </div>
                            </div>
                            
                            <h3 className="text-sm font-medium text-pm-gold mb-3">Modules de Formation</h3>
                            {courseData.map((module, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        toggleModule(index);
                                        setSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                                        openModule === index
                                            ? 'bg-pm-gold/20 text-pm-gold border border-pm-gold/30'
                                            : 'text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10'
                                    }`}
                                >
                                    <BookOpenIcon className="w-5 h-5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{module.title}</p>
                                        <p className="text-xs opacity-60">{module.chapters.length} chapitres</p>
                                    </div>
                                </button>
                            ))}
                        </nav>
                        
                        {/* Quick Actions */}
                        <div className="p-4 border-t border-pm-gold/20 space-y-2">
                            <h3 className="text-sm font-medium text-pm-gold mb-3">Actions Rapides</h3>
                            <button className="flex items-center gap-3 p-3 rounded-lg text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10 transition-colors w-full text-left">
                                <TrophyIcon className="w-4 h-4" />
                                <span className="text-sm">Mes Résultats</span>
                            </button>
                            <button className="flex items-center gap-3 p-3 rounded-lg text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10 transition-colors w-full text-left">
                                <ChartBarIcon className="w-4 h-4" />
                                <span className="text-sm">Statistiques</span>
                            </button>
                        </div>
                    </div>
                </aside>

                       {/* Main Content */}
                       <main className="flex-1 lg:ml-0">
                           <div className="p-4">
                        {/* Hero Section */}
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold text-pm-gold mb-4">Les Fondations de Votre Carrière</h2>
                     <p className="text-pm-off-white/80 leading-relaxed max-w-3xl mx-auto">
                        Ce programme est conçu pour vous donner toutes les bases théoriques et pratiques pour bien démarrer dans le monde du mannequinat. Chaque module est une étape essentielle de votre parcours.
                     </p>
                        </div>

                        {/* Modules Grid */}
                        <div className="space-y-3 max-w-4xl mx-auto">
                    {courseData.map((module, index) => (
                                <div key={index} className="bg-black/50 border border-pm-gold/20 rounded-lg overflow-hidden hover:border-pm-gold transition-colors">
                            <button
                                onClick={() => toggleModule(index)}
                                        className="w-full flex justify-between items-center p-6 text-left hover:bg-pm-gold/5 transition-colors"
                                aria-expanded={openModule === index}
                                aria-controls={`module-content-${index}`}
                            >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-pm-gold/10 rounded-lg flex items-center justify-center">
                                                <BookOpenIcon className="w-6 h-6 text-pm-gold" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-pm-gold">{module.title}</h3>
                                                <p className="text-sm text-pm-off-white/60">{module.chapters.length} chapitres disponibles</p>
                                            </div>
                                        </div>
                                        <ChevronDownIcon className={`w-6 h-6 text-pm-gold transition-transform duration-300 ${openModule === index ? 'rotate-180' : ''}`} />
                            </button>
                                    
                                    {openModule === index && (
                                        <div className="p-6 border-t border-pm-gold/20 bg-pm-dark/30 animate-fade-in">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {module.chapters.map((chapter, chapterIndex) => (
                                                    <Link 
                                                        key={chapter.slug}
                                                        to={`/classroom-debutant/${module.slug}/${chapter.slug}`}
                                                        className="group block p-4 bg-black/50 rounded-lg border border-pm-gold/10 hover:border-pm-gold hover:bg-pm-gold/5 transition-all duration-200"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-pm-gold/10 rounded-lg flex items-center justify-center group-hover:bg-pm-gold/20 transition-colors">
                                                                <span className="text-sm font-bold text-pm-gold">{chapterIndex + 1}</span>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-pm-off-white group-hover:text-pm-gold transition-colors">{chapter.title}</h4>
                                                                <p className="text-xs text-pm-off-white/60">Chapitre {chapterIndex + 1}</p>
                                                            </div>
                                                        </div>
                                                </Link>
                                        ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            
            <BackToTopButton />
        </div>
    );
};

export default BeginnerClassroom;