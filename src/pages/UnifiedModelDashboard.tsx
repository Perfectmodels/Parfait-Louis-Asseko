import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpenIcon, PresentationChartLineIcon, UserIcon, ArrowRightOnRectangleIcon, EnvelopeIcon, CheckCircleIcon, CalendarDaysIcon, MapPinIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { Model, BeginnerStudent, PhotoshootBrief } from '../../types';
import ModelForm from '../components/ModelForm';

type UserType = 'pro' | 'beginner';
type ActiveTab = 'profile' | 'results' | 'briefs' | 'classroom';

const UnifiedModelDashboard: React.FC = () => {
    const { data, saveData } = useData();
    const navigate = useNavigate();
    const userId = sessionStorage.getItem('userId');
    const userType = sessionStorage.getItem('userType') as UserType || 'pro';
    
    const [editableModel, setEditableModel] = useState<Model | null>(null);
    const [beginnerStudent, setBeginnerStudent] = useState<BeginnerStudent | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
    const [expandedBriefId, setExpandedBriefId] = useState<string | null>(null);

    // Déterminer l'utilisateur selon le type
    const proModel = data?.models.find(m => m.id === userId);
    const beginnerUser = data?.beginnerStudents.find(s => s.id === userId);
    
    const courseModules = data?.courseData || [];
    const myBriefs = data?.photoshootBriefs.filter(b => b.modelId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || [];
    const newBriefsCount = myBriefs.filter(b => b.status === 'Nouveau').length;

    useEffect(() => {
        if (userType === 'pro' && proModel) {
            const modelCopy = JSON.parse(JSON.stringify(proModel));
            if (!modelCopy.measurements) {
                modelCopy.measurements = {
                    chest: '',
                    waist: '',
                    hips: '',
                    shoeSize: ''
                };
            }
            setEditableModel(modelCopy);
        } else if (userType === 'beginner' && beginnerUser) {
            setBeginnerStudent(beginnerUser);
        }
    }, [proModel, beginnerUser, userType]);
    
    const handleSave = async (updatedModel: Model) => {
        if (!data || !editableModel) return;
        
        const updatedModels = data.models.map(m => 
            m.id === updatedModel.id ? updatedModel : m
        );
        
        await saveData({ ...data, models: updatedModels });
        alert("Profil mis à jour avec succès.");
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    const toggleBrief = (briefId: string) => {
        setExpandedBriefId(expandedBriefId === briefId ? null : briefId);
    };

    // Si pas d'utilisateur trouvé, rediriger
    if (!proModel && !beginnerUser) {
        return (
            <div className="min-h-screen bg-pm-dark flex items-center justify-center">
                <div className="text-center">
                    <p className="text-pm-off-white mb-4">Session expirée</p>
                    <Link to="/login" className="text-pm-gold hover:underline">Se reconnecter</Link>
                </div>
            </div>
        );
    }

    const currentUser = userType === 'pro' ? editableModel : beginnerStudent;
    const userName = userType === 'pro' ? editableModel?.name : beginnerStudent?.name;
    const userEmail = userType === 'pro' ? editableModel?.email : beginnerStudent?.matricule;

    return (
        <div className="min-h-screen bg-pm-dark text-pm-off-white py-20">
            <SEO 
                title={`Tableau de Bord - ${userName || 'Mannequin'}`}
                description="Accédez à votre profil, vos résultats et vos briefings photo"
                noIndex={true}
            />
            
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="bg-black border border-pm-gold/20 rounded-lg p-6 mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-playfair text-pm-gold mb-2">
                                Bienvenue, {userName}
                            </h1>
                            <p className="text-pm-off-white/70">
                                {userType === 'pro' ? '🌟 Mannequin Professionnel' : '🎓 Étudiant Débutant'}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/30 text-red-400 rounded-lg hover:bg-red-600/20 transition-colors"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            Déconnexion
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-black border border-pm-gold/20 rounded-lg p-2 mb-8">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                                activeTab === 'profile'
                                    ? 'bg-pm-gold text-black'
                                    : 'text-pm-off-white/70 hover:bg-pm-gold/10'
                            }`}
                        >
                            <UserIcon className="w-5 h-5" />
                            Mon Profil
                        </button>

                        <button
                            onClick={() => setActiveTab('classroom')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                                activeTab === 'classroom'
                                    ? 'bg-pm-gold text-black'
                                    : 'text-pm-off-white/70 hover:bg-pm-gold/10'
                            }`}
                        >
                            <AcademicCapIcon className="w-5 h-5" />
                            Formation
                        </button>

                        {userType === 'pro' && (
                            <>
                                <button
                                    onClick={() => setActiveTab('results')}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                                        activeTab === 'results'
                                            ? 'bg-pm-gold text-black'
                                            : 'text-pm-off-white/70 hover:bg-pm-gold/10'
                                    }`}
                                >
                                    <PresentationChartLineIcon className="w-5 h-5" />
                                    Mes Résultats
                                </button>

                                <button
                                    onClick={() => setActiveTab('briefs')}
                                    className={`relative flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                                        activeTab === 'briefs'
                                            ? 'bg-pm-gold text-black'
                                            : 'text-pm-off-white/70 hover:bg-pm-gold/10'
                                    }`}
                                >
                                    <EnvelopeIcon className="w-5 h-5" />
                                    Briefings Photo
                                    {newBriefsCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {newBriefsCount}
                                        </span>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="bg-black border border-pm-gold/20 rounded-lg p-8">
                    {/* TAB: Profile */}
                    {activeTab === 'profile' && userType === 'pro' && editableModel && (
                        <div>
                            <h2 className="text-2xl font-playfair text-pm-gold mb-6">Mon Profil</h2>
                            <ModelForm model={editableModel} onSave={handleSave} />
                        </div>
                    )}

                    {activeTab === 'profile' && userType === 'beginner' && beginnerStudent && (
                        <div>
                            <h2 className="text-2xl font-playfair text-pm-gold mb-6">Mon Profil</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-pm-dark/50 p-4 rounded-lg border border-pm-gold/10">
                                        <label className="text-sm text-pm-off-white/60 mb-1 block">Nom complet</label>
                                        <p className="text-lg text-pm-off-white">{beginnerStudent.name}</p>
                                    </div>
                                    <div className="bg-pm-dark/50 p-4 rounded-lg border border-pm-gold/10">
                                        <label className="text-sm text-pm-off-white/60 mb-1 block">Matricule</label>
                                        <p className="text-lg text-pm-off-white font-mono">{beginnerStudent.matricule}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-pm-off-white/60 mt-4">
                                    💡 Pour modifier votre profil, contactez l'administration.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* TAB: Classroom */}
                    {activeTab === 'classroom' && (
                        <div>
                            <h2 className="text-2xl font-playfair text-pm-gold mb-6">
                                {userType === 'pro' ? 'Classroom Pro' : 'Formation'}
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courseModules.map((module) => (
                                    <div
                                        key={module.slug}
                                        className="bg-pm-dark/50 border border-pm-gold/20 rounded-lg p-6 hover:border-pm-gold/50 transition-all hover:scale-105"
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <BookOpenIcon className="w-8 h-8 text-pm-gold flex-shrink-0" />
                                            <h3 className="text-lg font-bold text-pm-off-white">
                                                {module.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-pm-off-white/60 mb-4">
                                            {module.chapters.length} chapitres
                                        </p>
                                        <Link
                                            to={`/formations/module/${module.slug}`}
                                            className="inline-block px-4 py-2 bg-pm-gold text-black font-semibold rounded-lg hover:bg-white transition-colors"
                                        >
                                            Accéder
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB: Results (Pro only) */}
                    {activeTab === 'results' && userType === 'pro' && editableModel && (
                        <div>
                            <h2 className="text-2xl font-playfair text-pm-gold mb-6">Mes Résultats</h2>
                            
                            {editableModel.castingResults && editableModel.castingResults.length > 0 ? (
                                <div className="space-y-4">
                                    {editableModel.castingResults.map((result, index) => (
                                        <div key={index} className="bg-pm-dark/50 border border-pm-gold/10 rounded-lg p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-pm-off-white">{result.castingName}</h3>
                                                    <p className="text-sm text-pm-off-white/60">{result.date}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    result.status === 'Sélectionné' ? 'bg-green-600/20 text-green-400' :
                                                    result.status === 'Non Sélectionné' ? 'bg-red-600/20 text-red-400' :
                                                    'bg-yellow-600/20 text-yellow-400'
                                                }`}>
                                                    {result.status}
                                                </span>
                                            </div>
                                            {result.feedback && (
                                                <p className="text-sm text-pm-off-white/80 bg-pm-gold/5 p-3 rounded">
                                                    💬 {result.feedback}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-pm-off-white/60">Aucun résultat de casting pour le moment.</p>
                            )}
                        </div>
                    )}

                    {/* TAB: Briefs (Pro only) */}
                    {activeTab === 'briefs' && userType === 'pro' && (
                        <div>
                            <h2 className="text-2xl font-playfair text-pm-gold mb-6">Mes Briefings Photo</h2>
                            
                            {myBriefs.length > 0 ? (
                                <div className="space-y-4">
                                    {myBriefs.map((brief) => (
                                        <div key={brief.id} className="bg-pm-dark/50 border border-pm-gold/10 rounded-lg overflow-hidden">
                                            <div
                                                onClick={() => toggleBrief(brief.id)}
                                                className="p-6 cursor-pointer hover:bg-pm-gold/5 transition-colors"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-lg font-bold text-pm-off-white">{brief.shootingTitle}</h3>
                                                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                                brief.status === 'Nouveau' ? 'bg-blue-600/20 text-blue-400' :
                                                                brief.status === 'Lu' ? 'bg-green-600/20 text-green-400' :
                                                                'bg-gray-600/20 text-gray-400'
                                                            }`}>
                                                                {brief.status}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-4 text-sm text-pm-off-white/60">
                                                            <span className="flex items-center gap-1">
                                                                <CalendarDaysIcon className="w-4 h-4" />
                                                                {brief.date}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <MapPinIcon className="w-4 h-4" />
                                                                {brief.location}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button className="text-pm-gold">
                                                        {expandedBriefId === brief.id ? '▲' : '▼'}
                                                    </button>
                                                </div>
                                            </div>

                                            {expandedBriefId === brief.id && (
                                                <div className="px-6 pb-6 border-t border-pm-gold/10 pt-4">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="text-sm font-bold text-pm-gold mb-2">Description</h4>
                                                            <p className="text-sm text-pm-off-white/80">{brief.description}</p>
                                                        </div>
                                                        {brief.requiredOutfits && (
                                                            <div>
                                                                <h4 className="text-sm font-bold text-pm-gold mb-2">Tenues Requises</h4>
                                                                <p className="text-sm text-pm-off-white/80">{brief.requiredOutfits}</p>
                                                            </div>
                                                        )}
                                                        {brief.contactInfo && (
                                                            <div>
                                                                <h4 className="text-sm font-bold text-pm-gold mb-2">Contact</h4>
                                                                <p className="text-sm text-pm-off-white/80">{brief.contactInfo}</p>
                                                            </div>
                                                        )}
                                                        {brief.additionalNotes && (
                                                            <div>
                                                                <h4 className="text-sm font-bold text-pm-gold mb-2">Notes</h4>
                                                                <p className="text-sm text-pm-off-white/80">{brief.additionalNotes}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-pm-off-white/60">Aucun briefing photo pour le moment.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UnifiedModelDashboard;

