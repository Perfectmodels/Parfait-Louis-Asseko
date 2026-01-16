import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpenIcon, PresentationChartLineIcon, UserIcon, ArrowRightOnRectangleIcon, EnvelopeIcon, CheckCircleIcon, CalendarDaysIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/outline';
import { Model, PhotoshootBrief } from '../types';
import ModelForm from '../components/ModelForm';

type ActiveTab = 'profile' | 'results' | 'briefs';

const ModelDashboard: React.FC = () => {
    const { data, updateDocument } = useData();
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

        try {
            await updateDocument('models', updatedModel.id, updatedModel);
            alert("Profil mis à jour avec succès.");
        } catch (error) {
            console.error("Erreur mise à jour profil:", error);
            alert("Erreur lors de la sauvegarde.");
        }
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
        try {
            await updateDocument('photoshootBriefs', briefId, { status: 'Lu' as const });
        } catch (error) {
            console.error(error);
        }
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

    // Check Fashion Day Status
    const nextFashionDay = data?.fashionDayEvents?.find(ev =>
        ev.featuredModels?.some(name => name.toLowerCase() === editableModel.name.toLowerCase()) ||
        ev.stylists?.some(s => s.name.toLowerCase() === editableModel.name.toLowerCase())
    );

    // Calculate generic stats
    const completedModules = courseModulesWithQuizzes.filter(m => editableModel.quizScores?.[m.slug]?.score !== undefined).length;
    const totalModules = courseModulesWithQuizzes.length || 1;
    const progressPercentage = Math.round((completedModules / totalModules) * 100);

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title={`Profil de ${editableModel.name}`} noIndex />
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Event Notification Banner */}
                {nextFashionDay && (
                    <div className="mb-8 p-4 bg-gradient-to-r from-pm-gold/20 to-black border border-pm-gold rounded-lg flex items-center gap-4 animate-fade-in">
                        <StarIcon className="w-10 h-10 text-pm-gold animate-pulse" />
                        <div>
                            <h3 className="text-xl font-bold text-pm-gold">Félicitations ! Vous participez au Perfect Fashion Day {nextFashionDay.edition}</h3>
                            <p className="text-sm text-pm-off-white/80">Thème : "{nextFashionDay.theme}" • {new Date(nextFashionDay.date).toLocaleDateString('fr-FR')}</p>
                        </div>
                    </div>
                )}

                <header className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-playfair text-pm-gold">Bienvenue, {editableModel.name.split(' ')[0]}</h1>
                        <p className="text-pm-off-white/80">Gérez votre carrière, suivez vos progrès et restez informé.</p>
                    </div>
                    <button onClick={handleLogout} className="inline-flex items-center gap-2 text-sm text-pm-gold/80 hover:text-pm-gold bg-black/30 px-4 py-2 rounded-full transition-colors border border-transparent hover:border-pm-gold/30">
                        <ArrowRightOnRectangleIcon className="w-5 h-5" /> Déconnexion
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* ENHANCED SIDEBAR */}
                    <aside className="lg:col-span-1 space-y-4 lg:sticky lg:top-28 self-start">
                        <div className="bg-black p-6 border border-pm-gold/20 rounded-lg text-center relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pm-gold to-transparent opacity-50"></div>

                            <div className="relative inline-block mb-4">
                                <img src={editableModel.imageUrl} alt={editableModel.name} className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-pm-gold/20 group-hover:border-pm-gold transition-colors duration-500" />
                                {editableModel.level === 'Pro' && (
                                    <div className="absolute bottom-0 right-0 bg-pm-gold text-pm-dark text-xs font-bold px-2 py-0.5 rounded-full shadow-lg border border-white/20">PRO</div>
                                )}
                            </div>

                            <h2 className="text-2xl font-playfair text-pm-gold mb-1">{editableModel.name}</h2>
                            <p className="text-sm text-pm-off-white/60 mb-4 uppercase tracking-widest text-[10px]">{editableModel.categories?.[0] || 'Mannequin'}</p>

                            <div className="grid grid-cols-3 gap-2 border-t border-pm-gold/10 pt-4 text-center text-xs">
                                <div><span className="block font-bold text-pm-off-white">{editableModel.height}</span>Cm</div>
                                <div><span className="block font-bold text-pm-off-white">{editableModel.measurements.waist}</span>Taille</div>
                                <div><span className="block font-bold text-pm-off-white">{editableModel.measurements.hips}</span>Hanches</div>
                            </div>
                        </div>

                        {/* Progress Card */}
                        <div className="bg-black p-4 border border-pm-gold/20 rounded-lg">
                            <div className="flex justify-between items-end mb-2">
                                <h3 className="font-bold text-pm-off-white text-sm">Formation Academy</h3>
                                <span className="text-pm-gold text-xs font-bold">{progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-1.5 mb-4">
                                <div className="bg-pm-gold h-1.5 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                            <Link to="/formations" className="block w-full text-center py-2 text-xs font-bold uppercase tracking-wider bg-pm-gold/10 text-pm-gold hover:bg-pm-gold hover:text-pm-dark transition-colors rounded">
                                Continuer les cours
                            </Link>
                        </div>

                        <Link to={`/mannequins/${editableModel.id}`} target="_blank" rel="noopener noreferrer" className="group block bg-black p-4 border border-pm-gold/20 hover:border-pm-gold transition-all duration-300 rounded-lg flex items-center gap-4">
                            <UserIcon className="w-6 h-6 text-pm-gold" />
                            <div>
                                <h2 className="font-bold text-pm-off-white group-hover:text-pm-gold transition-colors text-sm">Mon Portfolio Public</h2>
                            </div>
                        </Link>
                    </aside>

                    <main className="lg:col-span-3">
                        <div className="border-b border-pm-gold/20 mb-6 sticky top-16 bg-pm-dark z-10 pt-4">
                            <nav className="flex space-x-6 overflow-x-auto pb-1" aria-label="Tabs">
                                <TabButton name="Mon Profil" icon={UserIcon} isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                                <TabButton name="Mes Résultats" icon={PresentationChartLineIcon} isActive={activeTab === 'results'} onClick={() => setActiveTab('results')} />
                                <TabButton name="Mes Briefings" icon={EnvelopeIcon} isActive={activeTab === 'briefs'} onClick={() => setActiveTab('briefs')} notificationCount={newBriefsCount} />
                            </nav>
                        </div>

                        <div className="min-h-[400px]">
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
                                <div className="admin-section-wrapper">
                                    <h2 className="admin-section-title">Résultats des Quiz</h2>
                                    {courseModulesWithQuizzes && courseModulesWithQuizzes.length > 0 ? (
                                        <ul className="space-y-3">
                                            {courseModulesWithQuizzes.map(module => {
                                                const scoreData = editableModel.quizScores?.[module.slug];
                                                const percentage = scoreData ? Math.round((scoreData.score / scoreData.total) * 100) : null;
                                                return (
                                                    <li key={module.slug} className="flex justify-between items-center bg-pm-dark p-3 rounded-md text-sm">
                                                        <span className="text-pm-off-white/80">{module.title}</span>
                                                        {percentage !== null ? (
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
                                <div className="admin-section-wrapper space-y-4">
                                    <h2 className="admin-section-title">Briefings de Séances Photo</h2>
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
