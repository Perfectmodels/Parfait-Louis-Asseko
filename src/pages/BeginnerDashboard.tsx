import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link, useNavigate } from 'react-router-dom';
import {
    BookOpenIcon, UserIcon, ArrowRightOnRectangleIcon,
    EnvelopeIcon, CheckCircleIcon, CalendarDaysIcon, MapPinIcon, Bars3Icon, XMarkIcon,
    BellIcon, TrophyIcon, UserCircleIcon, AcademicCapIcon
} from '@heroicons/react/24/outline';
import { BeginnerStudent, PhotoshootBrief } from '../types';
import PaymentStatusBadge from '../components/PaymentStatusBadge';
import PaymentWarningAlert from '../components/PaymentWarningAlert';
import PaymentSubmissionForm from '../components/PaymentSubmissionForm';

type ActiveTab = 'profile' | 'progress' | 'achievements' | 'briefs';

const BeginnerDashboard: React.FC = () => {
    const { data, saveData } = useData();
    const navigate = useNavigate();
    const userId = sessionStorage.getItem('userId');
    const [editableStudent, setEditableStudent] = useState<BeginnerStudent | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedBriefId, setExpandedBriefId] = useState<string | null>(null);
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const originalStudent = data?.beginnerStudents.find(s => s.id === userId);
    const courseModulesWithQuizzes = data?.courseData?.filter(m => m.quiz && m.quiz.length > 0) || [];
    
    const myBriefs = data?.photoshootBriefs.filter(b => b.modelId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || [];
    const newBriefsCount = myBriefs.filter(b => b.status === 'Nouveau').length;

    useEffect(() => {
        if (originalStudent) {
            setEditableStudent(JSON.parse(JSON.stringify(originalStudent)));
        } else if (userId && data?.beginnerStudents) {
            // Debug: Log available students and current userId
            console.log('Debug - Current userId:', userId);
            console.log('Debug - Available beginner students:', data.beginnerStudents.map(s => ({ id: s.id, name: s.name, matricule: s.matricule })));
            console.log('Debug - User not found in beginner students');
        }
    }, [originalStudent, userId, data]);
    
    const handleSave = async (updatedStudent: BeginnerStudent) => {
        if (!data || !editableStudent) return;
        
        const updatedStudents = data.beginnerStudents.map(s => 
            s.id === updatedStudent.id ? updatedStudent : s
        );
        
        await saveData({ ...data, beginnerStudents: updatedStudents });
        alert("Profil mis à jour avec succès.");
    };
    
    const handleLogout = () => {
        sessionStorage.removeItem('classroom_access');
        sessionStorage.removeItem('classroom_role');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userName');
        navigate('/login');
    };

    // Vérification d'accès
    if (!userId) {
        return (
            <div className="min-h-screen bg-pm-dark text-pm-off-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Accès Refusé</h1>
                    <p className="text-pm-off-white/70 mb-6">Aucun utilisateur connecté trouvé.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-3 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                    >
                        Retour à la connexion
                    </button>
                </div>
            </div>
        );
    }

    if (!originalStudent) {
        return (
            <div className="min-h-screen bg-pm-dark text-pm-off-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Profil Non Trouvé</h1>
                    <p className="text-pm-off-white/70 mb-6">
                        Votre profil de mannequin débutant n'a pas été trouvé. 
                        Veuillez contacter l'administrateur.
                    </p>
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="block w-full px-6 py-3 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                        >
                            Retour à la connexion
                        </button>
                        <button
                            onClick={() => navigate('/contact')}
                            className="block w-full px-6 py-3 border border-pm-gold text-pm-gold font-bold rounded-lg hover:bg-pm-gold hover:text-pm-dark transition-colors"
                        >
                            Contacter l'administrateur
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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

    const handleDismissWarning = async (warningId: string) => {
        if (!data || !editableStudent) return;
        
        const updatedStudent = {
            ...editableStudent,
            paymentStatus: {
                ...editableStudent.paymentStatus,
                warnings: editableStudent.paymentStatus?.warnings?.map(warning => 
                    warning.id === warningId ? { ...warning, isRead: true } : warning
                ) || []
            }
        };
        
        const updatedStudents = data.beginnerStudents.map(s => 
            s.id === editableStudent.id ? updatedStudent : s
        );
        
        try {
            await saveData({ ...data, beginnerStudents: updatedStudents });
            setEditableStudent(updatedStudent);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'avertissement:', error);
        }
    };

    if (!originalStudent || !editableStudent) {
        return (
            <div className="min-h-screen bg-pm-dark text-pm-off-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold mx-auto mb-4"></div>
                    <p>Chargement du profil...</p>
                </div>
            </div>
        );
    }

    const completedQuizzes = Object.keys(editableStudent.quizScores || {}).length;
    const totalQuizzes = courseModulesWithQuizzes.length;
    const progressPercentage = totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0;

    const getQuizScore = (moduleSlug: string) => {
        return editableStudent.quizScores?.[moduleSlug] || null;
    };

    const getScoreColor = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 80) return 'text-green-400';
        if (percentage >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <>
            <SEO title={`Profil de ${editableStudent.name}`} noIndex />
            <div className="min-h-screen bg-pm-dark">
            
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
                                    <h1 className="text-lg font-bold text-pm-gold">Mannequin Débutant</h1>
                                    <p className="text-xs text-pm-off-white/60">Bienvenue, {editableStudent.name.split(' ')[0]}</p>
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
                                    <p className="text-pm-gold font-medium">{editableStudent.name}</p>
                                    <p className="text-pm-off-white/60 text-xs">Mannequin Débutant</p>
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
                                    setActiveTab('progress');
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                                    activeTab === 'progress'
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
                                    setActiveTab('achievements');
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                                    activeTab === 'achievements'
                                        ? 'bg-pm-gold/20 text-pm-gold border border-pm-gold/30'
                                        : 'text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10'
                                }`}
                            >
                                <TrophyIcon className="w-5 h-5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Mes Réussites</p>
                                    <p className="text-xs opacity-60">Badges et accomplissements</p>
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
                                <span className="text-sm">Formations</span>
                            </Link>
                            <Link
                                to="/contact"
                                className="flex items-center gap-3 p-3 rounded-lg text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10 transition-colors"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <EnvelopeIcon className="w-4 h-4" />
                                <span className="text-sm">Contacter l'Agence</span>
                            </Link>
                        </div>
                    </div>
                </aside>

                    {/* Main Content */}
                    <div className="flex-1 lg:ml-0">
                        <div className="p-6">
                            {activeTab === 'profile' && (
                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-pm-gold">Mon Profil</h2>
                                        <p className="text-pm-off-white/60">Gérez vos informations personnelles et professionnelles</p>
                                    </div>
                                    
                                    {/* Statut de paiement et avertissements */}
                                    <div className="bg-black/50 p-6 border border-pm-gold/20 rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-pm-gold">Statut des Cotisations</h3>
                                            <div className="flex items-center gap-3">
                                                <PaymentStatusBadge paymentStatus={editableStudent.paymentStatus} showDetails={true} />
                                                <button
                                                    onClick={() => setShowPaymentForm(true)}
                                                    className="px-4 py-2 bg-pm-gold text-pm-dark font-medium rounded-lg hover:bg-pm-gold/90 transition-colors text-sm"
                                                >
                                                    Soumettre Paiement
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {editableStudent.paymentStatus?.warnings && editableStudent.paymentStatus.warnings.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-pm-off-white mb-3">Avertissements</h4>
                                                <PaymentWarningAlert 
                                                    warnings={editableStudent.paymentStatus.warnings}
                                                    onDismissWarning={handleDismissWarning}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="bg-pm-dark border border-pm-gold/20 rounded-xl p-6">
                                        <h3 className="text-2xl font-playfair text-pm-gold mb-6">Informations Personnelles</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-pm-gold mb-2">Nom complet</label>
                                                <input
                                                    type="text"
                                                    value={editableStudent.name}
                                                    onChange={(e) => setEditableStudent({...editableStudent, name: e.target.value})}
                                                    className="w-full px-4 py-3 bg-pm-dark border border-pm-gold/30 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-pm-gold mb-2">Matricule</label>
                                                <input
                                                    type="text"
                                                    value={editableStudent.matricule}
                                                    readOnly
                                                    className="w-full px-4 py-3 bg-pm-dark/50 border border-pm-gold/30 rounded-lg text-pm-off-white/70"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-pm-gold mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    value={editableStudent.email || ''}
                                                    onChange={(e) => setEditableStudent({...editableStudent, email: e.target.value})}
                                                    className="w-full px-4 py-3 bg-pm-dark border border-pm-gold/30 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-pm-gold mb-2">Téléphone</label>
                                                <input
                                                    type="tel"
                                                    value={editableStudent.phone || ''}
                                                    onChange={(e) => setEditableStudent({...editableStudent, phone: e.target.value})}
                                                    className="w-full px-4 py-3 bg-pm-dark border border-pm-gold/30 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-pm-gold mb-2">Ville</label>
                                                <input
                                                    type="text"
                                                    value={editableStudent.city || ''}
                                                    onChange={(e) => setEditableStudent({...editableStudent, city: e.target.value})}
                                                    className="w-full px-4 py-3 bg-pm-dark border border-pm-gold/30 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-pm-gold mb-2">Instagram</label>
                                                <input
                                                    type="text"
                                                    value={editableStudent.instagram || ''}
                                                    onChange={(e) => setEditableStudent({...editableStudent, instagram: e.target.value})}
                                                    placeholder="@nom_utilisateur"
                                                    className="w-full px-4 py-3 bg-pm-dark border border-pm-gold/30 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-end">
                                            <button
                                                onClick={() => handleSave(editableStudent)}
                                                className="px-6 py-3 bg-pm-gold text-pm-dark font-semibold rounded-lg hover:bg-pm-gold/90 transition-colors"
                                            >
                                                Sauvegarder
                                            </button>
                                        </div>
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

                            {activeTab === 'progress' && (
                                <div className="max-w-4xl mx-auto">
                                    <div className="bg-pm-dark border border-pm-gold/20 rounded-xl p-6">
                                        <h3 className="text-2xl font-playfair text-pm-gold mb-6">Mes Progrès</h3>
                                        
                                        {/* Progress Overview */}
                                        <div className="bg-pm-dark/50 border border-pm-gold/20 rounded-lg p-6 mb-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-lg font-semibold text-pm-gold">Progression Générale</h4>
                                                <span className="text-pm-gold font-bold">{progressPercentage}%</span>
                                            </div>
                                            <div className="w-full bg-pm-dark rounded-full h-3">
                                                <div 
                                                    className="bg-pm-gold h-3 rounded-full transition-all duration-500"
                                                    style={{ width: `${progressPercentage}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-sm text-pm-off-white/60 mt-2">
                                                {completedQuizzes} quiz complétés sur {totalQuizzes}
                                            </p>
                                        </div>

                                        {/* Quiz Results */}
                                        <div className="space-y-4">
                                            <h4 className="text-lg font-semibold text-pm-gold">Résultats des Quiz</h4>
                                            {courseModulesWithQuizzes.map((module) => {
                                                const quizResult = getQuizScore(module.slug);
                                                return (
                                                    <div key={module.slug} className="bg-pm-dark/50 border border-pm-gold/20 rounded-lg p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h5 className="font-semibold text-pm-off-white">{module.title}</h5>
                                                                <p className="text-sm text-pm-off-white/60">{module.description}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                {quizResult ? (
                                                                    <div>
                                                                        <div className={`text-lg font-bold ${getScoreColor(quizResult.score, quizResult.total)}`}>
                                                                            {quizResult.score}/{quizResult.total}
                                                                        </div>
                                                                        <div className="text-xs text-pm-off-white/60">
                                                                            {new Date(quizResult.timestamp).toLocaleDateString('fr-FR')}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-pm-off-white/40">Non complété</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'achievements' && (
                                <div className="max-w-4xl mx-auto">
                                    <div className="bg-pm-dark border border-pm-gold/20 rounded-xl p-6">
                                        <h3 className="text-2xl font-playfair text-pm-gold mb-6">Mes Réussites</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {/* Achievement Cards */}
                                            <div className="bg-pm-dark/50 border border-pm-gold/20 rounded-lg p-6 text-center">
                                                <TrophyIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
                                                <h4 className="font-semibold text-pm-gold mb-2">Premier Quiz</h4>
                                                <p className="text-sm text-pm-off-white/60">Complétez votre premier quiz</p>
                                                <div className={`mt-4 text-sm font-semibold ${completedQuizzes > 0 ? 'text-green-400' : 'text-pm-off-white/40'}`}>
                                                    {completedQuizzes > 0 ? '✓ Obtenu' : 'En cours'}
                                                </div>
                                            </div>

                                            <div className="bg-pm-dark/50 border border-pm-gold/20 rounded-lg p-6 text-center">
                                                <BookOpenIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
                                                <h4 className="font-semibold text-pm-gold mb-2">Étudiant Assidu</h4>
                                                <p className="text-sm text-pm-off-white/60">Complétez 5 quiz</p>
                                                <div className={`mt-4 text-sm font-semibold ${completedQuizzes >= 5 ? 'text-green-400' : 'text-pm-off-white/40'}`}>
                                                    {completedQuizzes >= 5 ? '✓ Obtenu' : `${completedQuizzes}/5`}
                                                </div>
                                            </div>

                                            <div className="bg-pm-dark/50 border border-pm-gold/20 rounded-lg p-6 text-center">
                                                <CheckCircleIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
                                                <h4 className="font-semibold text-pm-gold mb-2">Expert en Formation</h4>
                                                <p className="text-sm text-pm-off-white/60">Complétez tous les quiz</p>
                                                <div className={`mt-4 text-sm font-semibold ${completedQuizzes === totalQuizzes ? 'text-green-400' : 'text-pm-off-white/40'}`}>
                                                    {completedQuizzes === totalQuizzes ? '✓ Obtenu' : `${completedQuizzes}/${totalQuizzes}`}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Payment Submission Form */}
                {showPaymentForm && (
                    <PaymentSubmissionForm
                        modelId={editableStudent.id}
                        modelName={editableStudent.name}
                        onClose={() => setShowPaymentForm(false)}
                    />
                )}
            </div>
        </>
    );
};

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

export default BeginnerDashboard;
