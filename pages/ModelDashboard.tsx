
import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
// FIX: Using react-router-dom v6 syntax. Replaced useHistory with useNavigate.
// FIX: Switched to namespace import for 'react-router-dom' to resolve potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { BookOpenIcon, PresentationChartLineIcon, UserIcon } from '@heroicons/react/24/outline';
import { Model } from '../types';
import ModelForm from '../components/ModelForm';

const ModelDashboard: React.FC = () => {
    const { data, saveData } = useData();
    // FIX: Using useNavigate hook from react-router-dom v6.
    const navigate = ReactRouterDOM.useNavigate();
    const userId = sessionStorage.getItem('userId');
    const [editableModel, setEditableModel] = useState<Model | null>(null);

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
        // FIX: Using navigate for navigation in v6.
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
                <header className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-12">
                    <div>
                        <h1 className="text-4xl font-playfair text-pm-gold">Bienvenue, {editableModel.name.split(' ')[0]}</h1>
                        <p className="text-pm-off-white/80">Ceci est votre espace personnel pour gérer votre profil.</p>
                    </div>
                     <button onClick={handleLogout} className="text-sm text-pm-gold/80 hover:text-pm-gold">Déconnexion</button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Form Column */}
                    <div className="lg:col-span-2">
                         <ModelForm 
                            model={editableModel}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            mode="model"
                            isCreating={false}
                        />
                    </div>
                    
                    {/* Info Column */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Results */}
                        <div className="bg-black p-6 border border-pm-gold/20 sticky top-32">
                            <h2 className="text-2xl font-playfair text-pm-gold mb-4 flex items-center gap-3">
                               <PresentationChartLineIcon className="w-6 h-6"/> Mes Résultats
                            </h2>
                            {courseModulesWithQuizzes && courseModulesWithQuizzes.length > 0 ? (
                                 <ul className="space-y-3">
                                    {courseModulesWithQuizzes.map(module => {
                                        const score = editableModel.quizScores?.[module.slug];
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
                        
                        {/* Quick Links */}
                        <div className="space-y-4">
                            <ReactRouterDOM.Link to="/formations" className="group block bg-black p-6 border border-pm-gold/20 hover:border-pm-gold transition-all duration-300">
                                 <BookOpenIcon className="w-8 h-8 text-pm-gold mb-3" />
                                <h2 className="text-xl font-playfair text-pm-gold mb-1">Accéder au Classroom</h2>
                                <p className="text-sm text-pm-off-white/70">Continuez votre formation.</p>
                            </ReactRouterDOM.Link>
                            <ReactRouterDOM.Link to={`/mannequins/${editableModel.id}`} className="group block bg-black p-6 border border-pm-gold/20 hover:border-pm-gold transition-all duration-300">
                                 <UserIcon className="w-8 h-8 text-pm-gold mb-3" />
                                <h2 className="text-xl font-playfair text-pm-gold mb-1">Voir mon Portfolio Public</h2>
                                <p className="text-sm text-pm-off-white/70">Consultez votre profil public.</p>
                            </ReactRouterDOM.Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ModelDashboard;
