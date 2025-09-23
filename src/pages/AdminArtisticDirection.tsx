import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/AdminLayout';
import AdminTable from '../components/admin/AdminTable';
import AdminModal from '../components/admin/AdminModal';
import { 
    PaintBrushIcon,
    PhotoIcon,
    UserIcon,
    CalendarIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

interface PhotoSession {
    id: string;
    title: string;
    theme: string;
    description: string;
    assignedModels: string[];
    date: string;
    location: string;
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
    requirements: string[];
    createdBy: string;
    createdAt: string;
}

const AdminArtisticDirection: React.FC = () => {
    const { data, saveData } = useData();
    const [photoSessions, setPhotoSessions] = useState<PhotoSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<PhotoSession | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [filter, setFilter] = useState<'all' | 'planned' | 'in_progress' | 'completed' | 'cancelled'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        theme: '',
        description: '',
        assignedModels: [] as string[],
        date: '',
        location: '',
        requirements: [] as string[],
        status: 'planned' as const
    });

    useEffect(() => {
        // Charger les séances photo depuis les données
        const sessions: PhotoSession[] = data?.photoSessions || [
            {
                id: '1',
                title: 'Séance Mode Élégante',
                theme: 'Élégance classique',
                description: 'Séance photo mettant en valeur l\'élégance et la sophistication',
                assignedModels: ['Noemi Kim', 'AJ Caramela'],
                date: '2024-01-25',
                location: 'Studio Principal',
                status: 'planned',
                requirements: ['Tenue noire', 'Maquillage sophistiqué', 'Accessoires dorés'],
                createdBy: 'Admin',
                createdAt: '2024-01-15T10:00:00Z'
            }
        ];
        setPhotoSessions(sessions);
    }, [data]);

    const filteredSessions = photoSessions.filter(session => {
        const matchesFilter = filter === 'all' || session.status === filter;
        const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            session.theme.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleSave = () => {
        if (isEditing && selectedSession) {
            setPhotoSessions(prev => 
                prev.map(session => 
                    session.id === selectedSession.id 
                        ? { ...formData, id: selectedSession.id, createdBy: selectedSession.createdBy, createdAt: selectedSession.createdAt }
                        : session
                )
            );
        } else {
            const newSession: PhotoSession = {
                ...formData,
                id: Date.now().toString(),
                createdBy: 'Admin',
                createdAt: new Date().toISOString()
            };
            setPhotoSessions(prev => [...prev, newSession]);
        }

        if (data) {
            const updatedSessions = isEditing 
                ? photoSessions.map(session => 
                    session.id === selectedSession?.id 
                        ? { ...formData, id: session.id, createdBy: session.createdBy, createdAt: session.createdAt }
                        : session
                )
                : [...photoSessions, {
                    ...formData,
                    id: Date.now().toString(),
                    createdBy: 'Admin',
                    createdAt: new Date().toISOString()
                }];

            const updatedData = {
                ...data,
                photoSessions: updatedSessions
            };
            saveData(updatedData);
        }

        setIsModalOpen(false);
        setIsEditing(false);
        setSelectedSession(null);
        setFormData({
            title: '',
            theme: '',
            description: '',
            assignedModels: [],
            date: '',
            location: '',
            requirements: [],
            status: 'planned'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'planned':
                return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
            case 'in_progress':
                return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
            case 'completed':
                return 'text-green-400 bg-green-500/20 border-green-500/30';
            case 'cancelled':
                return 'text-red-400 bg-red-500/20 border-red-500/30';
            default:
                return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'planned':
                return 'Planifiée';
            case 'in_progress':
                return 'En cours';
            case 'completed':
                return 'Terminée';
            case 'cancelled':
                return 'Annulée';
            default:
                return status;
        }
    };

    const columns = [
        {
            key: 'title',
            label: 'Titre',
            render: (session: PhotoSession) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pm-gold/20 flex items-center justify-center">
                        <PhotoIcon className="w-4 h-4 text-pm-gold" />
                    </div>
                    <div>
                        <p className="font-medium text-pm-off-white">{session.title}</p>
                        <p className="text-sm text-pm-off-white/60">{session.theme}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'assignedModels',
            label: 'Mannequins assignés',
            render: (session: PhotoSession) => (
                <div className="flex flex-wrap gap-1">
                    {session.assignedModels.map((model, index) => (
                        <span key={index} className="px-2 py-1 bg-pm-gold/20 text-pm-gold text-xs rounded-full">
                            {model}
                        </span>
                    ))}
                </div>
            )
        },
        {
            key: 'date',
            label: 'Date',
            render: (session: PhotoSession) => (
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-pm-gold" />
                    <span className="text-pm-off-white">
                        {new Date(session.date).toLocaleDateString('fr-FR')}
                    </span>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Statut',
            render: (session: PhotoSession) => (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(session.status)}`}>
                    <span className="text-sm font-medium">{getStatusText(session.status)}</span>
                </div>
            )
        }
    ];

    const stats = [
        {
            title: 'Total des séances',
            value: photoSessions.length,
            icon: <PhotoIcon className="w-6 h-6" />,
            color: 'blue'
        },
        {
            title: 'Planifiées',
            value: photoSessions.filter(s => s.status === 'planned').length,
            icon: <CalendarIcon className="w-6 h-6" />,
            color: 'blue'
        },
        {
            title: 'En cours',
            value: photoSessions.filter(s => s.status === 'in_progress').length,
            icon: <PaintBrushIcon className="w-6 h-6" />,
            color: 'yellow'
        },
        {
            title: 'Terminées',
            value: photoSessions.filter(s => s.status === 'completed').length,
            icon: <PhotoIcon className="w-6 h-6" />,
            color: 'green'
        }
    ];

    return (
        <AdminLayout 
            title="Direction Artistique" 
            description="Gérer les séances photo et thèmes artistiques"
            breadcrumbs={[
                { label: "Direction Artistique" }
            ]}
        >
            <div className="space-y-6">
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

                {/* Actions et Filtres */}
                <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setSelectedSession(null);
                                setFormData({
                                    title: '',
                                    theme: '',
                                    description: '',
                                    assignedModels: [],
                                    date: '',
                                    location: '',
                                    requirements: [],
                                    status: 'planned'
                                });
                                setIsModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 py-3 bg-pm-gold text-pm-dark font-semibold rounded-lg hover:bg-yellow-400 transition-colors duration-200"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Nouvelle séance
                        </button>
                        
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Rechercher par titre, thème ou description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            {(['all', 'planned', 'in_progress', 'completed', 'cancelled'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                                        filter === status
                                            ? 'bg-pm-gold text-pm-dark'
                                            : 'bg-pm-off-white/5 text-pm-off-white hover:bg-pm-off-white/10'
                                    }`}
                                >
                                    {status === 'all' ? 'Toutes' : getStatusText(status)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tableau des séances */}
                <AdminTable
                    data={filteredSessions}
                    columns={columns}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
            </div>
        </AdminLayout>
    );
};

export default AdminArtisticDirection;