import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import AdminSidebarLayout from '../components/AdminSidebarLayout';
import AdminTable from '../components/admin/AdminTable';
import AdminModal from '../components/admin/AdminModal';
import { 
    VideoCameraIcon,
    PlayIcon,
    PauseIcon,
    StopIcon,
    UserIcon,
    ClockIcon,
    CheckCircleIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

interface CastingSession {
    id: string;
    title: string;
    status: 'scheduled' | 'live' | 'ended';
    startTime: string;
    endTime?: string;
    participants: string[];
    currentParticipant?: string;
    notes: string;
    createdAt: string;
}

const AdminCastingLive: React.FC = () => {
    const { data } = useData();
    const [sessions, setSessions] = useState<CastingSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<CastingSession | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        // Charger les sessions de casting depuis les données
        const castingSessions: CastingSession[] = data?.castingSessions || [
            {
                id: '1',
                title: 'Casting Mode Printemps 2024',
                status: 'scheduled',
                startTime: '2024-01-25T14:00:00Z',
                participants: ['Noemi Kim', 'AJ Caramela', 'Marie Dubois'],
                notes: 'Casting pour la collection printemps',
                createdAt: '2024-01-20T10:00:00Z'
            },
            {
                id: '2',
                title: 'Casting Défilé Libreville Fashion Week',
                status: 'live',
                startTime: '2024-01-24T10:00:00Z',
                participants: ['Noemi Kim', 'AJ Caramela'],
                currentParticipant: 'Noemi Kim',
                notes: 'Casting en cours pour le défilé principal',
                createdAt: '2024-01-22T09:00:00Z'
            }
        ];
        setSessions(castingSessions);
    }, [data]);

    const handleStartSession = (sessionId: string) => {
        setSessions(prev => 
            prev.map(session => 
                session.id === sessionId 
                    ? { ...session, status: 'live' as const }
                    : session
            )
        );
        setIsLive(true);
    };

    const handleEndSession = (sessionId: string) => {
        setSessions(prev => 
            prev.map(session => 
                session.id === sessionId 
                    ? { ...session, status: 'ended' as const, endTime: new Date().toISOString() }
                    : session
            )
        );
        setIsLive(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled':
                return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
            case 'live':
                return 'text-red-400 bg-red-500/20 border-red-500/30';
            case 'ended':
                return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
            default:
                return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'scheduled':
                return 'Programmé';
            case 'live':
                return 'En direct';
            case 'ended':
                return 'Terminé';
            default:
                return status;
        }
    };

    const columns = [
        {
            key: 'title',
            label: 'Session',
            render: (session: CastingSession) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pm-gold/20 flex items-center justify-center">
                        <VideoCameraIcon className="w-4 h-4 text-pm-gold" />
                    </div>
                    <div>
                        <p className="font-medium text-pm-off-white">{session.title}</p>
                        <p className="text-sm text-pm-off-white/60">
                            {session.participants.length} participants
                        </p>
                    </div>
                </div>
            )
        },
        {
            key: 'startTime',
            label: 'Heure de début',
            render: (session: CastingSession) => (
                <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-pm-gold" />
                    <span className="text-pm-off-white">
                        {new Date(session.startTime).toLocaleString('fr-FR')}
                    </span>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Statut',
            render: (session: CastingSession) => (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(session.status)}`}>
                    <span className="text-sm font-medium">{getStatusText(session.status)}</span>
                </div>
            )
        },
        {
            key: 'currentParticipant',
            label: 'Participant actuel',
            render: (session: CastingSession) => (
                <span className="text-pm-off-white/80">
                    {session.currentParticipant || 'Aucun'}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (session: CastingSession) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setSelectedSession(session);
                            setIsModalOpen(true);
                        }}
                        className="p-2 text-pm-gold border border-pm-gold/30 rounded-lg hover:bg-pm-gold/10 transition-colors duration-200"
                    >
                        <EyeIcon className="w-4 h-4" />
                    </button>
                    {session.status === 'scheduled' && (
                        <button
                            onClick={() => handleStartSession(session.id)}
                            className="p-2 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/10 transition-colors duration-200"
                        >
                            <PlayIcon className="w-4 h-4" />
                        </button>
                    )}
                    {session.status === 'live' && (
                        <button
                            onClick={() => handleEndSession(session.id)}
                            className="p-2 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors duration-200"
                        >
                            <StopIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )
        }
    ];

    const stats = [
        {
            title: 'Sessions programmées',
            value: sessions.filter(s => s.status === 'scheduled').length,
            icon: <ClockIcon className="w-6 h-6" />,
            color: 'blue'
        },
        {
            title: 'En direct',
            value: sessions.filter(s => s.status === 'live').length,
            icon: <PlayIcon className="w-6 h-6" />,
            color: 'red'
        },
        {
            title: 'Terminées',
            value: sessions.filter(s => s.status === 'ended').length,
            icon: <CheckCircleIcon className="w-6 h-6" />,
            color: 'green'
        },
        {
            title: 'Total participants',
            value: sessions.reduce((acc, session) => acc + session.participants.length, 0),
            icon: <UserIcon className="w-6 h-6" />,
            color: 'purple'
        }
    ];

    return (
        <AdminSidebarLayout 
            title="Casting en Direct" 
            description="Gérer les sessions de casting en direct"
            breadcrumbs={[
                { label: "Casting Live" }
            ]}
        >
            <div className="space-y-6">
                {/* Indicateur de session live */}
                {isLive && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-400 font-semibold">Session en direct active</span>
                    </div>
                )}

                {/* Statistiques */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold text-pm-off-white">{stat.title}</h3>
                                <div className="p-2 rounded-full bg-pm-gold/20 text-pm-gold">
                                    {stat.icon}
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-pm-gold">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Contrôles de session */}
                <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                    <h2 className="text-xl font-playfair text-pm-gold mb-4">Contrôles de session</h2>
                    <div className="flex gap-4">
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                        >
                            <PlayIcon className="w-5 h-5" />
                            Démarrer une session
                        </button>
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                        >
                            <PauseIcon className="w-5 h-5" />
                            Mettre en pause
                        </button>
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                        >
                            <StopIcon className="w-5 h-5" />
                            Arrêter la session
                        </button>
                    </div>
                </div>

                {/* Tableau des sessions */}
                <AdminTable
                    data={sessions}
                    columns={columns}
                />

                {/* Modal de détails */}
                <AdminModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedSession(null);
                    }}
                    title="Détails de la session"
                >
                    {selectedSession && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-pm-gold mb-2">Titre</label>
                                    <p className="text-pm-off-white">{selectedSession.title}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-pm-gold mb-2">Statut</label>
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(selectedSession.status)}`}>
                                        <span className="text-sm font-medium">{getStatusText(selectedSession.status)}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-pm-gold mb-2">Heure de début</label>
                                    <p className="text-pm-off-white">
                                        {new Date(selectedSession.startTime).toLocaleString('fr-FR')}
                                    </p>
                                </div>
                                {selectedSession.endTime && (
                                    <div>
                                        <label className="block text-sm font-medium text-pm-gold mb-2">Heure de fin</label>
                                        <p className="text-pm-off-white">
                                            {new Date(selectedSession.endTime).toLocaleString('fr-FR')}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-pm-gold mb-2">Participants</label>
                                <div className="space-y-2">
                                    {selectedSession.participants.map((participant, index) => (
                                        <div key={index} className="flex items-center gap-3 p-2 bg-pm-off-white/5 rounded-lg">
                                            <UserIcon className="w-4 h-4 text-pm-gold" />
                                            <span className="text-pm-off-white">{participant}</span>
                                            {selectedSession.currentParticipant === participant && (
                                                <span className="ml-auto px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                                                    En cours
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-pm-gold mb-2">Notes</label>
                                <p className="text-pm-off-white">{selectedSession.notes}</p>
                            </div>
                        </div>
                    )}
                </AdminModal>
            </div>
        </AdminSidebarLayout>
    );
};

export default AdminCastingLive;
