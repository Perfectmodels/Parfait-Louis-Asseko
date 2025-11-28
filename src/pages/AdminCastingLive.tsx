import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { VideoCameraIcon, MicrophoneIcon, StopIcon, PlayIcon } from '@heroicons/react/24/outline';

const AdminCastingLive: React.FC = () => {
    const { data } = useData();
    const [isLive, setIsLive] = useState(false);
    const [viewers, setViewers] = useState(0);
    const [currentApplicant, setCurrentApplicant] = useState<string | null>(null);

    useEffect(() => {
        // Simuler le nombre de viewers
        const interval = setInterval(() => {
            setViewers(prev => Math.max(0, prev + Math.floor(Math.random() * 5) - 2));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleStartLive = () => {
        setIsLive(true);
        setViewers(1);
    };

    const handleStopLive = () => {
        setIsLive(false);
        setViewers(0);
        setCurrentApplicant(null);
    };

    const nextApplicant = () => {
        const applications = data?.castingApplications || [];
        const currentIndex = applications.findIndex(app => app.id === currentApplicant);
        const nextIndex = currentIndex + 1 < applications.length ? currentIndex + 1 : 0;
        setCurrentApplicant(applications[nextIndex]?.id || null);
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Casting Live" noIndex />
            
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Retour au Dashboard
                </Link>
                
                <h1 className="text-4xl font-playfair text-pm-gold mb-8">Casting Live</h1>
                <p className="text-pm-off-white/70 mb-8">Diffusion en direct des sessions de casting.</p>

                {/* Live Status */}
                <div className="bg-black border border-pm-gold/20 rounded-lg p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
                            <span className={`font-semibold ${isLive ? 'text-red-400' : 'text-gray-400'}`}>
                                {isLive ? 'EN DIRECT' : 'HORS LIGNE'}
                            </span>
                            {isLive && (
                                <span className="text-pm-off-white/60">
                                    {viewers} spectateur{viewers !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {!isLive ? (
                                <button
                                    onClick={handleStartLive}
                                    className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                                >
                                    <VideoCameraIcon className="w-5 h-5" />
                                    Commencer le Live
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={nextApplicant}
                                        className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark rounded-lg font-medium hover:bg-pm-gold/90 transition-colors"
                                    >
                                        <PlayIcon className="w-4 h-4" />
                                        Suivant
                                    </button>
                                    <button
                                        onClick={handleStopLive}
                                        className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                                    >
                                        <StopIcon className="w-5 h-5" />
                                        Terminer
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Video Stream */}
                    <div className="lg:col-span-2">
                        <div className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden">
                            <div className="aspect-video bg-gray-900 flex items-center justify-center">
                                {isLive ? (
                                    <div className="text-center">
                                        <VideoCameraIcon className="w-16 h-16 text-pm-gold mb-4" />
                                        <p className="text-pm-off-white">Diffusion en cours...</p>
                                        <p className="text-pm-off-white/60 text-sm mt-2">Flux vidéo à intégrer</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <VideoCameraIcon className="w-16 h-16 text-gray-500 mb-4" />
                                        <p className="text-gray-400">En attente de début de diffusion</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Controls */}
                            {isLive && (
                                <div className="p-4 border-t border-pm-gold/20 flex items-center justify-center gap-4">
                                    <button className="p-2 bg-pm-gold text-pm-dark rounded-full hover:bg-pm-gold/90 transition-colors">
                                        <MicrophoneIcon className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 bg-pm-gold text-pm-dark rounded-full hover:bg-pm-gold/90 transition-colors">
                                        <VideoCameraIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Current Applicant */}
                        <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-pm-gold mb-4">Candidat Actuel</h3>
                            {currentApplicant ? (
                                <div className="space-y-3">
                                    <div className="w-20 h-20 bg-pm-gold/10 rounded-full mx-auto"></div>
                                    <div className="text-center">
                                        <p className="font-medium text-pm-off-white">Candidat #{currentApplicant}</p>
                                        <p className="text-sm text-pm-off-white/60">En cours d'évaluation</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-pm-off-white/50">
                                    <p>Aucun candidat sélectionné</p>
                                    {isLive && (
                                        <button
                                            onClick={nextApplicant}
                                            className="mt-3 text-pm-gold hover:underline"
                                        >
                                            Sélectionner le premier candidat
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Queue */}
                        <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-pm-gold mb-4">File d'Attente</h3>
                            <div className="space-y-2">
                                {(data?.castingApplications || []).slice(0, 5).map((app, index) => (
                                    <div
                                        key={app.id}
                                        className={`p-3 rounded border transition-colors cursor-pointer ${
                                            app.id === currentApplicant
                                                ? 'bg-pm-gold/10 border-pm-gold'
                                                : 'border-pm-gold/20 hover:border-pm-gold/40'
                                        }`}
                                        onClick={() => setCurrentApplicant(app.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-pm-off-white">
                                                {app.firstName} {app.lastName}
                                            </span>
                                            <span className="text-xs text-pm-off-white/60">
                                                #{index + 1}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Chat */}
                        <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-pm-gold mb-4">Chat Live</h3>
                            <div className="h-48 bg-pm-dark/50 rounded mb-4 p-3 overflow-y-auto">
                                {isLive ? (
                                    <div className="space-y-2 text-sm">
                                        <div className="text-pm-off-white/60">
                                            <span className="text-pm-gold">User123:</span> Bon casting !
                                        </div>
                                        <div className="text-pm-off-white/60">
                                            <span className="text-pm-gold">Viewer456:</span> Excellent candidat
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-pm-off-white/50 mt-16">
                                        Le chat sera disponible pendant le live
                                    </div>
                                )}
                            </div>
                            {isLive && (
                                <input
                                    type="text"
                                    placeholder="Tapez votre message..."
                                    className="w-full px-3 py-2 bg-black border border-pm-gold/30 rounded text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold transition-colors text-sm"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCastingLive;