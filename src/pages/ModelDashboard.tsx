import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link, useNavigate } from 'react-router-dom';
import {
    BookOpenIcon, UserIcon, ArrowRightOnRectangleIcon,
    EnvelopeIcon, CheckCircleIcon, CalendarDaysIcon, MapPinIcon, Bars3Icon, XMarkIcon,
    BellIcon, TrophyIcon, UserCircleIcon
} from '@heroicons/react/24/outline';
import { Model, PhotoshootBrief } from '../types';
import ModelForm from '../components/ModelForm';

type ActiveTab = 'profile' | 'results' | 'briefs';

const ModelDashboard: React.FC = () => {
    const { data, saveData } = useData();
    const navigate = useNavigate();
    const userId = sessionStorage.getItem('userId');
    const [editableModel, setEditableModel] = useState<Model | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
    const [expandedBriefId, setExpandedBriefId] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <div className="min-h-screen bg-pm-dark">
            <SEO title={`Profil de ${editableModel.name}`} noIndex />
            
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
                                <div className="w-8 h-8 bg-pm-gold rounded-lg flex items-center justify-center">
                                    <UserIcon className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-pm-gold">Mannequin Pro</h1>
                                    <p className="text-xs text-pm-off-white/60">Bienvenue, {editableModel.name.split(' ')[0]}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <div className="relative">
                                <button className="p-2 rounded-md text-pm-gold hover:bg-pm-gold/10 transition-colors relative">
                                    <BellIcon className="w-5 h-5" />
                                    {newBriefsCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                            {newBriefsCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                            
                            {/* User Info */}
                            <div className="hidden sm:flex items-center gap-3 text-sm">
                                <div className="text-right">
                                    <p className="text-pm-gold font-medium">{editableModel.name}</p>
                                    <p className="text-pm-off-white/60 text-xs">Mannequin Professionnel</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-md text-pm-gold hover:bg-pm-gold/10 transition-colors"
                                    title="Déconnexion"
                                >
                                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
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
                            <button
                                onClick={() => {
                                    setActiveTab('profile');
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                                    activeTab === 'profile'
                                        ? 'bg-pm-gold/20 text-pm-gold border border-pm-gold/30'
                                        : 'text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10'
                                }`}
                            >
                                <UserIcon className="w-5 h-5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Mon Profil</p>
                                    <p className="text-xs opacity-60">Gérer mes informations</p>
                                </div>
                            </button>
                            
                            <button
                                onClick={() => {
                                    setActiveTab('results');
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                                    activeTab === 'results'
                                        ? 'bg-pm-gold/20 text-pm-gold border border-pm-gold/30'
                                        : 'text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10'
                                }`}
                            >
                                <TrophyIcon className="w-5 h-5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Mes Résultats</p>
                                    <p className="text-xs opacity-60">Scores des quiz</p>
                                </div>
                            </button>
                            
                            <button
                                onClick={() => {
                                    setActiveTab('briefs');
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                                    activeTab === 'briefs'
                                        ? 'bg-pm-gold/20 text-pm-gold border border-pm-gold/30'
                                        : 'text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10'
                                }`}
                            >
                                <EnvelopeIcon className="w-5 h-5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Briefings</p>
                                    <p className="text-xs opacity-60">Séances photo</p>
                                </div>
                                {newBriefsCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {newBriefsCount}
                                    </span>
                                )}
                            </button>
                        </nav>
                        
                        {/* Quick Actions */}
                        <div className="p-4 border-t border-pm-gold/20 space-y-2">
                            <h3 className="text-sm font-medium text-pm-gold mb-3">Actions Rapides</h3>
                            <Link 
                                to="/formations" 
                                className="flex items-center gap-3 p-3 rounded-lg text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10 transition-colors"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <BookOpenIcon className="w-4 h-4" />
                                <span className="text-sm">Classroom Pro</span>
                            </Link>
                            <Link 
                                to={`/mannequins/${editableModel.id}`} 
                                className="flex items-center gap-3 p-3 rounded-lg text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10 transition-colors"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <UserCircleIcon className="w-4 h-4" />
                                <span className="text-sm">Portfolio Public</span>
                            </Link>
                        </div>
                    </div>
                </aside>

                       {/* Main Content */}
                       <main className="flex-1 lg:ml-0">
                           <div className="p-4">
                        {activeTab === 'profile' && (
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-pm-gold">Mon Profil</h2>
                                    <p className="text-pm-off-white/60">Gérez vos informations personnelles et professionnelles</p>
                                </div>
                                <ModelForm 
                                    model={editableModel}
                                    onSave={handleSave}
                                    onCancel={handleCancel}
                                    mode="model"
                                    isCreating={false}
                                />
                            </div>
                        )}
                        
                        {activeTab === 'results' && (
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-pm-gold">Mes Résultats</h2>
                                    <p className="text-pm-off-white/60">Vos scores aux quiz de formation</p>
                                </div>
                                <div className="bg-black/50 p-6 border border-pm-gold/20 rounded-lg">
                                    {courseModulesWithQuizzes && courseModulesWithQuizzes.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {courseModulesWithQuizzes.map(module => {
                                                const scoreData = editableModel.quizScores?.[module.slug];
                                                const percentage = scoreData ? Math.round((scoreData.score / scoreData.total) * 100) : null;
                                                return (
                                                    <div key={module.slug} className="bg-pm-dark/50 p-4 rounded-lg border border-pm-gold/10">
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <h3 className="font-medium text-pm-off-white">{module.title}</h3>
                                                                <p className="text-sm text-pm-off-white/60">Quiz de formation</p>
                                                            </div>
                                                            {percentage !== null ? (
                                                                <div className="text-right">
                                                                    <span className={`text-2xl font-bold ${getScoreColor(percentage)}`}>{percentage}%</span>
                                                                    <p className="text-xs text-pm-off-white/60">{scoreData.score}/{scoreData.total}</p>
                                                                </div>
                                                            ) : (
                                                                <span className="text-sm text-pm-off-white/50">Non complété</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-pm-off-white/70 text-center py-8">Aucun quiz disponible pour le moment.</p>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'briefs' && (
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-pm-gold">Briefings de Séances Photo</h2>
                                    <p className="text-pm-off-white/60">Consultez vos prochaines séances photo</p>
                                </div>
                                <div className="space-y-4">
                                    {myBriefs.length > 0 ? (
                                        myBriefs.map(brief => (
                                            <BriefItem key={brief.id} brief={brief} expandedBriefId={expandedBriefId} onToggle={handleToggleBrief} />
                                        ))
                                    ) : (
                                        <div className="bg-black/50 p-8 border border-pm-gold/20 rounded-lg text-center">
                                            <EnvelopeIcon className="w-12 h-12 text-pm-gold/50 mx-auto mb-4" />
                                            <p className="text-pm-off-white/70">Votre boîte de réception est vide.</p>
                                            <p className="text-sm text-pm-off-white/50 mt-2">Les nouveaux briefings apparaîtront ici.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
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
        </div>
    );
};

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
        <div className="bg-black/50 border border-pm-gold/20 rounded-lg overflow-hidden hover:border-pm-gold transition-colors">
            <button onClick={() => onToggle(brief.id)} className="w-full p-6 text-left flex justify-between items-center hover:bg-pm-gold/5 transition-colors">
                <div className="flex items-center gap-4">
                    {brief.status === 'Nouveau' && <span className="w-3 h-3 bg-pm-gold rounded-full flex-shrink-0 animate-pulse"></span>}
                    {brief.status === 'Lu' && <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />}
                    <div>
                        <h3 className={`font-bold text-lg ${brief.status === 'Nouveau' ? 'text-pm-gold' : 'text-pm-off-white'}`}>{brief.theme}</h3>
                        <p className="text-sm text-pm-off-white/60">Séance photo</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-pm-off-white">{new Date(brief.dateTime).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' })}</p>
                    <p className="text-xs text-pm-off-white/60">{new Date(brief.dateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            </button>
            {isExpanded && (
                <div className="p-6 border-t border-pm-gold/20 bg-pm-dark/30 animate-fade-in space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-4 p-4 bg-black/50 rounded-lg border border-pm-gold/10">
                            <CalendarDaysIcon className="w-6 h-6 text-pm-gold flex-shrink-0"/>
                            <div>
                                <p className="text-xs text-pm-off-white/70 font-medium">Date & Heure</p>
                                <p className="font-semibold text-pm-off-white">{new Date(brief.dateTime).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-black/50 rounded-lg border border-pm-gold/10">
                            <MapPinIcon className="w-6 h-6 text-pm-gold flex-shrink-0"/>
                            <div>
                                <p className="text-xs text-pm-off-white/70 font-medium">Lieu</p>
                                <p className="font-semibold text-pm-off-white">{brief.location}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="p-4 bg-black/50 rounded-lg border border-pm-gold/10">
                            <h4 className="font-bold text-pm-gold mb-2 flex items-center gap-2">
                                <UserIcon className="w-4 h-4" />
                                Style Vestimentaire
                            </h4>
                            <p className="text-sm text-pm-off-white/80 whitespace-pre-wrap leading-relaxed">{brief.clothingStyle}</p>
                        </div>
                        <div className="p-4 bg-black/50 rounded-lg border border-pm-gold/10">
                            <h4 className="font-bold text-pm-gold mb-2 flex items-center gap-2">
                                <TrophyIcon className="w-4 h-4" />
                                Accessoires
                            </h4>
                            <p className="text-sm text-pm-off-white/80 whitespace-pre-wrap leading-relaxed">{brief.accessories}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModelDashboard;
