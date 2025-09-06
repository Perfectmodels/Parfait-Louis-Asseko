import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
// FIX: Fix react-router-dom imports by using a namespace import
import * as ReactRouterDOM from 'react-router-dom';
import { BookOpenIcon, PresentationChartLineIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { Model } from '../types';
import ModelForm from '../components/ModelForm';

type ActiveTab = 'profile' | 'results';

const ModelDashboard: React.FC = () => {
    const { data, saveData } = useData();
    const navigate = ReactRouterDOM.useNavigate();
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
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title={`Profil de ${editableModel.name}`} noIndex />
            <div className="container mx-auto px-6 max-w-7xl">
                <header className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-playfair text-pm-gold">Bienvenue, {editableModel.name.split(' ')[0]}</h1>
                        <p className="text-pm-off-white/80">Votre espace personnel pour gérer votre profil et suivre votre progression.</p>
                    </div>
                     <button onClick={handleLogout} className="inline-flex items-center gap-2 text-sm text-pm-gold/80 hover:text-pm-gold">
                        <ArrowRightOnRectangleIcon className="w-5 h-5" /> Déconnexion
                     </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar / Quick Links */}
                    <aside className="lg:col-span-1 space-y-4">
                         <ReactRouterDOM.Link to="/formations" className="group block bg-black p-6 border border-pm-gold/20 hover:border-pm-gold transition-all duration-300 rounded-lg">
                             <BookOpenIcon className="w-8 h-8 text-pm-gold mb-3" />
                            <h2 className="text-xl font-playfair text-pm-gold mb-1">Accéder au Classroom</h2>
                            <p className="text-sm text-pm-off-white/70">Continuez votre formation.</p>
                        </ReactRouterDOM.Link>
                        <ReactRouterDOM.Link to={`/mannequins/${editableModel.id}`} className="group block bg-black p-6 border border-pm-gold/20 hover:border-pm-gold transition-all duration-300 rounded-lg">
                             <UserIcon className="w-8 h-8 text-pm-gold mb-3" />
                            <h2 className="text-xl font-playfair text-pm-gold mb-1">Voir mon Portfolio Public</h2>
                            <p className="text-sm text-pm-off-white/70">Consultez votre profil public.</p>
                        </ReactRouterDOM.Link>
                    </aside>
                    
                    {/* Main Content with Tabs */}
                    <main className="lg:col-span-3">
                        <div className="border-b border-pm-gold/20 mb-6">
                            <nav className="flex space-x-4" aria-label="Tabs">
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
                                <div className="bg-black p-8 border border-pm-gold/20 rounded-lg shadow-lg shadow-black/30">
                                    <h2 className="text-2xl font-playfair text-pm-gold mb-6">Résultats des Quiz</h2>
                                    {courseModulesWithQuizzes && courseModulesWithQuizzes.length > 0 ? (
                                        <ul className="space-y-3">
                                            {courseModulesWithQuizzes.map(module => {
                                                const score = editableModel.quizScores?.[module.slug];
                                                return (
                                                    <li key={module.slug} className="flex justify-between items-center bg-pm-dark p-3 rounded-md text-sm">
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
        className={`flex items-center gap-2 px-4 py-2 font-medium text-sm rounded-t-lg transition-colors border-b-2 ${
            isActive 
            ? 'border-pm-gold text-pm-gold' 
            : 'border-transparent text-pm-off-white/70 hover:text-pm-gold'
        }`}
    >
        <Icon className="w-5 h-5" />
        {name}
    </button>
);

export default ModelDashboard;