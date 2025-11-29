
import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { SEO, ModelForm } from '../components';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpenIcon, PresentationChartLineIcon, UserIcon, ArrowRightOnRectangleIcon, EnvelopeIcon, CheckCircleIcon, CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Model, PhotoshootBrief } from '../types';

type ActiveTab = 'profile' | 'results' | 'briefs';

const ModelDashboard: React.FC = () => {
    const { data, saveData } = useData();
    const navigate = useNavigate();
    const userId = sessionStorage.getItem('userId');
    const [editableModel, setEditableModel] = useState<Model | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
    const [expandedBriefId, setExpandedBriefId] = useState<string | null>(null);

    const originalModel = data?.models.find(m => m.id === userId);
    const courseModulesWithQuizzes = data?.courseData?.filter(m => m.quiz && m.quiz.length > 0) || [];

    const myBriefs = data?.photoshootBriefs.filter(b => b.modelId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || [];
    const newBriefsCount = myBriefs.filter(b => b.status === 'Nouveau').length;

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

    const handleMarkAsRead = async (briefId: string) => {
        if (!data) return;
        const updatedBriefs = data.photoshootBriefs.map(b =>
            b.id === briefId ? { ...b, status: 'Lu' as const } : b
        );
        await saveData({ ...data, photoshootBriefs: updatedBriefs });
    };

    const handleToggleBrief = async (briefId: string) => {
        const newExpandedId = expandedBriefId === briefId ? null : briefId;
        setExpandedBriefId(newExpandedId);

        if (newExpandedId) {
            const brief = myBriefs.find(b => b.id === briefId);
            if (brief && brief.status === 'Nouveau') {
                await handleMarkAsRead(briefId);
            }
        }
    };

    if (!editableModel) {
        return (
            <div className="bg-pm-dark text-pm-off-white min-h-screen flex items-center justify-center">
                <p>Chargement du profil...</p>
            </div>
        );
    }

    const getScoreColor = (scorePercentage: number) => {
        if (scorePercentage >= 80) return 'text-green-400';
        if (scorePercentage >= 50) return 'text-yellow-400';
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
                    <aside className="lg:col-span-1 space-y-4">
                        <Link to="/formations" className="group block bg-black p-6 border border-pm-gold/20 hover:border-pm-gold transition-all duration-300 rounded-lg">
                            <BookOpenIcon className="w-8 h-8 text-pm-gold mb-3" />
                            <h2 className="text-xl font-playfair text-pm-gold mb-1">Accéder au Classroom</h2>
                            <p className="text-sm text-pm-off-white/70">Continuez votre formation.</p>
                        </Link>
                        <Link to={`/mannequins/${editableModel.id}`} className="group block bg-black p-6 border border-pm-gold/20 hover:border-pm-gold transition-all duration-300 rounded-lg">
                            <UserIcon className="w-8 h-8 text-pm-gold mb-3" />
                            <h2 className="text-xl font-playfair text-pm-gold mb-1">Voir mon Portfolio Public</h2>
                            <p className="text-sm text-pm-off-white/70">Consultez votre profil public.</p>
                        </Link>
                    </aside>

                    <main className="lg:col-span-3">
                        <div className="border-b border-pm-gold/20 mb-6">
                            <nav className="flex space-x-4" aria-label="Tabs">
                                <TabButton name="Mon Profil" icon={UserIcon} isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                                <TabButton name="Mes Résultats" icon={PresentationChartLineIcon} isActive={activeTab === 'results'} onClick={() => setActiveTab('results')} />
                                <TabButton name="Briefings" icon={EnvelopeIcon} isActive={activeTab === 'briefs'} onClick={() => setActiveTab('briefs')} notificationCount={newBriefsCount} />
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
                                                const scoreData = editableModel.quizScores?.[module.slug];
                                                // FIX: Calculate percentage from the score object.
                                                const percentage = scoreData ? Math.round((scoreData.score / scoreData.total) * 100) : null;
                                                return (
                                                    <li key={module.slug} className="flex justify-between items-center bg-pm-dark p-3 rounded-md text-sm">
                                                        <span className="text-pm-off-white/80">{module.title}</span>
                                                        {percentage !== null ? (
                                                            // FIX: Use the calculated percentage for display and color coding.
                                                            <span className={`font-bold text-lg ${getScoreColor(percentage)}`}>{percentage}%</span>
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
                            {activeTab === 'briefs' && (
                                <div className="bg-black p-6 border border-pm-gold/20 rounded-lg shadow-lg shadow-black/30 space-y-4">
                                    <h2 className="text-2xl font-playfair text-pm-gold mb-4">Briefings de Séances Photo</h2>
                                    {myBriefs.length > 0 ? (
                                        myBriefs.map(brief => (
                                            <BriefItem key={brief.id} brief={brief} expandedBriefId={expandedBriefId} onToggle={handleToggleBrief} />
                                        ))
                                    ) : (
                                        <p className="text-center text-pm-off-white/70 py-8">Votre boîte de réception est vide.</p>
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

const TabButton: React.FC<{ name: string, icon: React.ElementType, isActive: boolean, onClick: () => void, notificationCount?: number }> = ({ name, icon: Icon, isActive, onClick, notificationCount = 0 }) => (
    <button
        onClick={onClick}
        className={`relative flex items-center gap-2 px-4 py-2 font-medium text-sm rounded-t-lg transition-colors border-b-2 ${isActive
            ? 'border-pm-gold text-pm-gold'
            : 'border-transparent text-pm-off-white/70 hover:text-pm-gold'
            }`}
    >
        <Icon className="w-5 h-5" />
        {name}
        {notificationCount > 0 && (
            <span className="absolute top-1 -right-1 flex h-4 w-4">
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">{notificationCount}</span>
            </span>
        )}
    </button>
);

const BriefItem: React.FC<{ brief: PhotoshootBrief, expandedBriefId: string | null, onToggle: (id: string) => void }> = ({ brief, expandedBriefId, onToggle }) => {
    const isExpanded = expandedBriefId === brief.id;
    return (
        <div className="bg-pm-dark/50 border border-pm-off-white/10 rounded-lg overflow-hidden">
            <button onClick={() => onToggle(brief.id)} className="w-full p-4 text-left flex justify-between items-center hover:bg-pm-dark">
                <div className="flex items-center gap-3">
                    {brief.status === 'Nouveau' && <span className="w-2.5 h-2.5 bg-pm-gold rounded-full flex-shrink-0 animate-pulse"></span>}
                    {brief.status === 'Lu' && <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />}
                    <span className={`font-bold ${brief.status === 'Nouveau' ? 'text-pm-gold' : 'text-pm-off-white'}`}>{brief.theme}</span>
                </div>
                <span className="text-xs text-pm-off-white/60">{new Date(brief.dateTime).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </button>
            {isExpanded && (
                <div className="p-4 border-t border-pm-gold/20 bg-black animate-fade-in space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-pm-dark rounded-md">
                        <CalendarDaysIcon className="w-6 h-6 text-pm-gold flex-shrink-0" />
                        <div>
                            <p className="text-xs text-pm-off-white/70">Date & Heure</p>
                            <p className="font-semibold">{new Date(brief.dateTime).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-pm-dark rounded-md">
                        <MapPinIcon className="w-6 h-6 text-pm-gold flex-shrink-0" />
                        <div>
                            <p className="text-xs text-pm-off-white/70">Lieu</p>
                            <p className="font-semibold">{brief.location}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-pm-gold mb-1">Style Vestimentaire</h4>
                        <p className="text-sm text-pm-off-white/80 whitespace-pre-wrap">{brief.clothingStyle}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-pm-gold mb-1">Accessoires</h4>
                        <p className="text-sm text-pm-off-white/80 whitespace-pre-wrap">{brief.accessories}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModelDashboard;
