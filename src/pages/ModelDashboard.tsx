
import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpenIcon, PresentationChartLineIcon, UserIcon, ArrowRightOnRectangleIcon, EnvelopeIcon, CheckCircleIcon, CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Model, PhotoshootBrief } from '../types';
// FIX: Corrected import path for ModelForm.
import ModelForm from '../components/ModelForm';

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
        if (scorePercentage >= 80) return 'text-green-400 bg-green-400/10 border-green-400/20';
        if (scorePercentage >= 50) return 'text-pm-gold bg-pm-gold/10 border-pm-gold/20';
        return 'text-red-400 bg-red-400/10 border-red-400/20';
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-12 min-h-screen">
            <SEO title={`Profil de ${editableModel.name}`} noIndex />
            <div className="container mx-auto px-6 max-w-7xl">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-8 border-b border-pm-gold/10">
                    <div>
                        <h1 className="text-4xl font-playfair text-pm-gold mb-2">Bienvenue, {editableModel.name.split(' ')[0]}</h1>
                        <p className="text-pm-off-white/60">Gérez votre carrière et suivez votre progression professionnelle.</p>
                    </div>
                     <button onClick={handleLogout} className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 transition-all duration-300">
                        <ArrowRightOnRectangleIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        <span>Déconnexion</span>
                     </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Profile Card */}
                    <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-28 self-start">
                         <div className="bg-black/40 p-8 border border-pm-gold/20 rounded-2xl text-center shadow-lg backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-pm-gold/5 to-transparent pointer-events-none"></div>
                            <div className="relative inline-block mb-6">
                                <div className="absolute inset-0 bg-pm-gold rounded-full blur-md opacity-20 animate-pulse"></div>
                                <img src={editableModel.imageUrl} alt={editableModel.name} className="relative w-32 h-32 rounded-full object-cover border-2 border-pm-gold shadow-xl" />
                            </div>
                            <h2 className="text-2xl font-playfair text-white mb-1">{editableModel.name}</h2>
                            <span className="inline-block px-3 py-1 rounded-full bg-pm-gold/10 text-pm-gold text-xs font-bold uppercase tracking-wider mb-6 border border-pm-gold/20">
                                {editableModel.level}
                            </span>

                            <div className="space-y-3">
                                <Link to="/formations" className="block w-full py-3 px-4 bg-pm-gold text-black font-bold rounded-lg hover:bg-white transition-all duration-300 shadow-lg shadow-pm-gold/10 flex items-center justify-center gap-2">
                                    <BookOpenIcon className="w-5 h-5" />
                                    Classroom
                                </Link>
                                <Link to={`/mannequins/${editableModel.id}`} target="_blank" rel="noopener noreferrer" className="block w-full py-3 px-4 bg-transparent border border-pm-gold/30 text-pm-gold font-bold rounded-lg hover:bg-pm-gold/10 transition-all duration-300 flex items-center justify-center gap-2">
                                    <UserIcon className="w-5 h-5" />
                                    Portfolio Public
                                </Link>
                            </div>
                         </div>
                    </aside>
                    
                    {/* Main Content Area */}
                    <main className="lg:col-span-3 space-y-8">
                        {/* Tab Navigation */}
                        <div className="bg-black/20 p-1.5 rounded-xl inline-flex flex-wrap gap-2 border border-pm-gold/10 backdrop-blur-sm">
                            <TabButton name="Mon Profil" icon={UserIcon} isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                            <TabButton name="Performances" icon={PresentationChartLineIcon} isActive={activeTab === 'results'} onClick={() => setActiveTab('results')} />
                            <TabButton name="Briefings" icon={EnvelopeIcon} isActive={activeTab === 'briefs'} onClick={() => setActiveTab('briefs')} notificationCount={newBriefsCount} />
                        </div>
                        
                        <div className="bg-black/40 border border-pm-gold/10 rounded-2xl p-6 md:p-8 shadow-xl min-h-[500px]">
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
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-playfair text-pm-gold">Résultats des Formations</h2>
                                        <div className="text-sm text-pm-off-white/50">Progression globale</div>
                                    </div>

                                    {courseModulesWithQuizzes && courseModulesWithQuizzes.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {courseModulesWithQuizzes.map(module => {
                                                const scoreData = editableModel.quizScores?.[module.slug];
                                                const percentage = scoreData ? Math.round((scoreData.score / scoreData.total) * 100) : null;
                                                return (
                                                    <div key={module.slug} className="group bg-pm-dark/50 border border-pm-gold/10 p-5 rounded-xl hover:border-pm-gold/30 transition-all duration-300">
                                                        <h3 className="font-semibold text-pm-off-white mb-3 group-hover:text-pm-gold transition-colors">{module.title}</h3>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-pm-off-white/50 uppercase tracking-wider">Score</span>
                                                            {percentage !== null ? (
                                                                <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getScoreColor(percentage)}`}>
                                                                    {percentage}%
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs italic text-pm-off-white/30">Non commencé</span>
                                                            )}
                                                        </div>
                                                        {percentage !== null && (
                                                            <div className="w-full bg-pm-dark h-1.5 rounded-full mt-4 overflow-hidden">
                                                                <div className={`h-full rounded-full ${percentage >= 50 ? 'bg-pm-gold' : 'bg-red-500'}`} style={{ width: `${percentage}%` }}></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 border-2 border-dashed border-pm-gold/10 rounded-xl">
                                            <p className="text-pm-off-white/50">Aucun quiz disponible pour le moment.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            {activeTab === 'briefs' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-playfair text-pm-gold mb-6">Briefings de Séances Photo</h2>
                                    {myBriefs.length > 0 ? (
                                        <div className="space-y-4">
                                            {myBriefs.map(brief => (
                                                <BriefItem key={brief.id} brief={brief} expandedBriefId={expandedBriefId} onToggle={handleToggleBrief} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16 flex flex-col items-center justify-center border-2 border-dashed border-pm-gold/10 rounded-xl">
                                            <EnvelopeIcon className="w-12 h-12 text-pm-gold/20 mb-4" />
                                            <p className="text-lg text-pm-off-white/70">Votre boîte de réception est vide</p>
                                            <p className="text-sm text-pm-off-white/40 mt-2">Vous recevrez ici les détails de vos prochaines séances photo.</p>
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

// ... Les autres sous-composants (TabButton, BriefItem) restent les mêmes
const TabButton: React.FC<{name: string, icon: React.ElementType, isActive: boolean, onClick: () => void, notificationCount?: number}> = ({ name, icon: Icon, isActive, onClick, notificationCount = 0 }) => (
    <button
        onClick={onClick}
        className={`relative flex items-center gap-2 px-4 py-2 font-medium text-sm rounded-t-lg transition-colors border-b-2 ${
            isActive 
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
                        <CalendarDaysIcon className="w-6 h-6 text-pm-gold flex-shrink-0"/>
                        <div>
                            <p className="text-xs text-pm-off-white/70">Date & Heure</p>
                            <p className="font-semibold">{new Date(brief.dateTime).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4 p-3 bg-pm-dark rounded-md">
                        <MapPinIcon className="w-6 h-6 text-pm-gold flex-shrink-0"/>
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
