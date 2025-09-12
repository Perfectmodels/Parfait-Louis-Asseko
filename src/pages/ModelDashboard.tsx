

import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
// FIX: Updated react-router-dom imports for v6 compatibility. Replaced `useHistory` with `useNavigate`.
import { Link, useNavigate } from 'react-router-dom';
import { BookOpenIcon, PresentationChartLineIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
// FIX: Corrected import path for type definition.
import { Model } from '../types';
import ModelForm from '../components/ModelForm';

type ActiveTab = 'profile' | 'results';

const ModelDashboard: React.FC = () => {
    const { data, saveData } = useData();
    // FIX: Use useNavigate for react-router-dom v6 compatibility.
    const navigate = useNavigate();
    const userId = sessionStorage.getItem('userId');
    const [editableModel, setEditableModel] = useState<Model | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>('profile');

    const originalModel = data?.models.find(m => m.id === userId);
    const courseModulesWithQuizzes = data?.courseData?.filter(m => m.quiz && m.quiz.length > 0) || [];

    useEffect(() => {
        if (originalModel) {
            setEditableModel(JSON.parse(JSON.stringify(originalModel)));
        }
    }, [originalModel]);
    
    const handleSave = async (updatedModel: Model) => {
        if (!data || !editableModel) return;
        
        const updatedModels = data.models.map(m => 
            m.id === updatedModel.id ? updatedModel : m
        );
        
        await saveData({ ...data, models: updatedModels });
        alert("Profil mis à jour avec succès.");
    };
    
    const handleCancel = () => {
        if (originalModel) {
            setEditableModel(JSON.parse(JSON.stringify(originalModel)));
            alert("Les modifications ont été annulées.");
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        // FIX: Use navigate for navigation in react-router-dom v6.
        navigate('/login');
    };

    if (!editableModel) {
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
        <div className="bg-gradient-to-b from-pm-dark to-black text-pm-off-white py-24 min-h-screen">
            <SEO title={`Espace Personnel - ${editableModel.name}`} noIndex />
            <div className="container mx-auto px-6 max-w-7xl">
                <header className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-12 animate-on-scroll">
                    <div>
                        <h1 className="text-5xl font-playfair text-pm-gold mb-3 relative inline-block">
                            Bienvenue, {editableModel.name.split(' ')[0]}
                            <span className="absolute -bottom-2 left-0 w-24 h-[2px] bg-pm-gold/30"></span>
                        </h1>
                        <p className="text-pm-off-white/80 text-lg mt-4 max-w-2xl">
                            Votre espace personnel vous permet de gérer votre profil professionnel, suivre votre progression et accéder à toutes les ressources exclusives de Perfect Models Management.
                        </p>
                    </div>
                     <button 
                        onClick={handleLogout} 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-black/50 border border-pm-gold/30 rounded-full text-pm-gold hover:bg-pm-gold/10 hover:border-pm-gold transition-all duration-300"
                     >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" /> Déconnexion
                     </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    {/* Sidebar / Quick Links */}
                    <aside className="lg:col-span-1 space-y-6 animate-on-scroll delay-100">
                         <Link to="/formations" className="group block bg-gradient-to-br from-black to-pm-dark p-6 border border-pm-gold/30 hover:border-pm-gold transition-all duration-300 rounded-lg shadow-lg hover:shadow-pm-gold/10 hover:translate-y-[-5px]">
                             <div className="bg-pm-gold/10 p-3 rounded-full inline-block mb-4 group-hover:bg-pm-gold/20 transition-all duration-300">
                                <BookOpenIcon className="w-8 h-8 text-pm-gold" />
                             </div>
                            <h2 className="text-xl font-playfair text-pm-gold mb-2">Accéder au Classroom</h2>
                            <p className="text-sm text-pm-off-white/80">Poursuivez votre formation professionnelle et accédez aux modules exclusifs de Perfect Models Management.</p>
                        </Link>
                        <Link to={`/mannequins/${editableModel.id}`} className="group block bg-gradient-to-br from-black to-pm-dark p-6 border border-pm-gold/30 hover:border-pm-gold transition-all duration-300 rounded-lg shadow-lg hover:shadow-pm-gold/10 hover:translate-y-[-5px]">
                             <div className="bg-pm-gold/10 p-3 rounded-full inline-block mb-4 group-hover:bg-pm-gold/20 transition-all duration-300">
                                <UserIcon className="w-8 h-8 text-pm-gold" />
                             </div>
                            <h2 className="text-xl font-playfair text-pm-gold mb-2">Mon Portfolio Public</h2>
                            <p className="text-sm text-pm-off-white/80">Visualisez votre profil public tel qu'il apparaît aux clients et directeurs de casting potentiels.</p>
                        </Link>
                    </aside>
                    
                    {/* Main Content with Tabs */}
                    <main className="lg:col-span-3 animate-on-scroll delay-200">
                        <div className="border-b border-pm-gold/30 mb-8">
                            <nav className="flex space-x-6" aria-label="Tabs">
                                <TabButton name="Mon Profil" icon={UserIcon} isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                                <TabButton name="Mes Résultats" icon={PresentationChartLineIcon} isActive={activeTab === 'results'} onClick={() => setActiveTab('results')} />
                            </nav>
                        </div>
                        
                        <div>
                            {activeTab === 'profile' && (
                                <ModelForm 
                                    model={editableModel}
                                    onSave={handleSave}
                                    onCancel={handleCancel}
                                    mode="model"
                                    isCreating={false}
                                />
                            )}
                            {activeTab === 'results' && (
                                <div className="bg-gradient-to-br from-black to-pm-dark p-8 border border-pm-gold/30 rounded-lg shadow-lg shadow-black/30">
                                    <div className="flex items-center mb-8">
                                        <PresentationChartLineIcon className="w-8 h-8 text-pm-gold mr-4" />
                                        <h2 className="text-2xl font-playfair text-pm-gold relative inline-block">
                                            Résultats des Quiz
                                            <span className="absolute -bottom-2 left-0 w-16 h-[2px] bg-pm-gold/30"></span>
                                        </h2>
                                    </div>
                                    <p className="text-pm-off-white/80 mb-6">Suivez votre progression et vos performances aux différents modules de formation Perfect Models Management.</p>
                                    {courseModulesWithQuizzes && courseModulesWithQuizzes.length > 0 ? (
                                        <ul className="space-y-4">
                                            {courseModulesWithQuizzes.map(module => {
                                                const score = editableModel.quizScores?.[module.slug];
                                                return (
                                                    <li key={module.slug} className="flex justify-between items-center bg-black/50 p-4 border border-pm-gold/10 hover:border-pm-gold/30 transition-all duration-300 rounded-md">
                                                        <span className="text-pm-off-white font-medium">{module.title}</span>
                                                        {score !== undefined ? (
                                                            <span className={`font-bold text-lg px-4 py-1 rounded-full ${getScoreColor(score)}`}>{score}%</span>
                                                        ) : (
                                                            <span className="text-sm bg-pm-dark/80 px-4 py-1 rounded-full text-pm-off-white/50">Non complété</span>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <div className="text-center py-8 bg-black/30 rounded-lg border border-pm-gold/10">
                                            <p className="text-pm-off-white/70">Aucun quiz disponible pour le moment.</p>
                                            <p className="text-sm text-pm-off-white/50 mt-2">Les nouveaux modules seront bientôt disponibles.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

const TabButton: React.FC<{name: string, icon: React.ElementType, isActive: boolean, onClick: () => void}> = ({ name, icon: Icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 px-6 py-3 font-medium text-sm transition-all duration-300 border-b-2 ${
            isActive 
            ? 'border-pm-gold text-pm-gold bg-black/30 rounded-t-lg' 
            : 'border-transparent text-pm-off-white/70 hover:text-pm-gold hover:bg-black/20 rounded-t-lg'
        }`}
    >
        <Icon className={`w-5 h-5 ${isActive ? 'text-pm-gold' : 'text-pm-off-white/70'} transition-colors duration-300`} />
        <span className="font-medium">{name}</span>
    </button>
);

export default ModelDashboard;
