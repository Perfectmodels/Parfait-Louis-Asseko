import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/AdminLayout';
import AdminTable from '../components/admin/AdminTable';
import AdminModal from '../components/admin/AdminModal';
import { 
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    UserIcon,
    CalendarIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

interface AbsenceRequest {
    id: string;
    modelId: string;
    modelName: string;
    date: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    documents?: string[];
    adminNotes?: string;
}

const AdminAbsences: React.FC = () => {
    const { data, saveData } = useData();
    const [absenceRequests, setAbsenceRequests] = useState<AbsenceRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<AbsenceRequest | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Charger les demandes d'absence depuis les données
        const requests: AbsenceRequest[] = data?.absenceRequests || [
            {
                id: '1',
                modelId: 'model_1',
                modelName: 'Noemi Kim',
                date: '2024-01-20',
                reason: 'Rendez-vous médical',
                status: 'pending',
                submittedAt: '2024-01-15T10:30:00Z',
                documents: ['medical_certificate.pdf']
            },
            {
                id: '2',
                modelId: 'model_2',
                modelName: 'AJ Caramela',
                date: '2024-01-22',
                reason: 'Urgence familiale',
                status: 'approved',
                submittedAt: '2024-01-14T15:45:00Z',
                documents: ['family_emergency.pdf'],
                adminNotes: 'Justification valide'
            }
        ];
        setAbsenceRequests(requests);
    }, [data]);

    const filteredRequests = absenceRequests.filter(request => {
        const matchesFilter = filter === 'all' || request.status === filter;
        const matchesSearch = request.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            request.reason.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleStatusChange = (requestId: string, newStatus: 'approved' | 'rejected', notes?: string) => {
        setAbsenceRequests(prev => 
            prev.map(request => 
                request.id === requestId 
                    ? { ...request, status: newStatus, adminNotes: notes }
                    : request
            )
        );
        
        // Sauvegarder dans les données
        if (data) {
            const updatedData = {
                ...data,
                absenceRequests: absenceRequests.map(request => 
                    request.id === requestId 
                        ? { ...request, status: newStatus, adminNotes: notes }
                        : request
                )
            };
            saveData(updatedData);
        }
        
        setIsModalOpen(false);
        setSelectedRequest(null);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <ClockIcon className="w-5 h-5 text-yellow-400" />;
            case 'approved':
                return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
            case 'rejected':
                return <XCircleIcon className="w-5 h-5 text-red-400" />;
            default:
                return <ExclamationTriangleIcon className="w-5 h-5 text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
            case 'approved':
                return 'text-green-400 bg-green-500/20 border-green-500/30';
            case 'rejected':
                return 'text-red-400 bg-red-500/20 border-red-500/30';
            default:
                return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'En attente';
            case 'approved':
                return 'Approuvée';
            case 'rejected':
                return 'Rejetée';
            default:
                return status;
        }
    };

    const columns = [
        {
            key: 'modelName',
            label: 'Mannequin',
            render: (request: AbsenceRequest) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pm-gold/20 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-pm-gold" />
                    </div>
                    <span className="font-medium text-pm-off-white">{request.modelName}</span>
                </div>
            )
        },
        {
            key: 'date',
            label: 'Date d\'absence',
            render: (request: AbsenceRequest) => (
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-pm-gold" />
                    <span className="text-pm-off-white">
                        {new Date(request.date).toLocaleDateString('fr-FR')}
                    </span>
                </div>
            )
        },
        {
            key: 'reason',
            label: 'Motif',
            render: (request: AbsenceRequest) => (
                <span className="text-pm-off-white/80">{request.reason}</span>
            )
        },
        {
            key: 'status',
            label: 'Statut',
            render: (request: AbsenceRequest) => (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    <span className="text-sm font-medium">{getStatusText(request.status)}</span>
                </div>
            )
        },
        {
            key: 'submittedAt',
            label: 'Soumis le',
            render: (request: AbsenceRequest) => (
                <span className="text-pm-off-white/60">
                    {new Date(request.submittedAt).toLocaleDateString('fr-FR')}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (request: AbsenceRequest) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setSelectedRequest(request);
                            setIsModalOpen(true);
                        }}
                        className="px-3 py-1 text-pm-gold border border-pm-gold/30 rounded-lg hover:bg-pm-gold/10 transition-colors duration-200"
                    >
                        Voir
                    </button>
                    {request.status === 'pending' && (
                        <>
                            <button
                                onClick={() => handleStatusChange(request.id, 'approved')}
                                className="px-3 py-1 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/10 transition-colors duration-200"
                            >
                                Approuver
                            </button>
                            <button
                                onClick={() => handleStatusChange(request.id, 'rejected')}
                                className="px-3 py-1 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors duration-200"
                            >
                                Rejeter
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    const stats = [
        {
            title: 'Total des demandes',
            value: absenceRequests.length,
            icon: <DocumentTextIcon className="w-6 h-6" />,
            color: 'blue'
        },
        {
            title: 'En attente',
            value: absenceRequests.filter(r => r.status === 'pending').length,
            icon: <ClockIcon className="w-6 h-6" />,
            color: 'yellow'
        },
        {
            title: 'Approuvées',
            value: absenceRequests.filter(r => r.status === 'approved').length,
            icon: <CheckCircleIcon className="w-6 h-6" />,
            color: 'green'
        },
        {
            title: 'Rejetées',
            value: absenceRequests.filter(r => r.status === 'rejected').length,
            icon: <XCircleIcon className="w-6 h-6" />,
            color: 'red'
        }
    ];

    return (
        <AdminLayout 
            title="Gestion des Absences" 
            description="Gérer les demandes d'absence des mannequins"
            breadcrumbs={[
                { label: "Absences" }
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

                {/* Filtres et Recherche */}
                <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Rechercher par nom ou motif..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                            />
                    </div>
                        <div className="flex gap-2">
                            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
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

                {/* Tableau des demandes */}
                <AdminTable
                    data={filteredRequests}
                    columns={columns}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />

                {/* Modal de détails */}
                <AdminModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedRequest(null);
                    }}
                    title="Détails de la demande d'absence"
                >
                    {selectedRequest && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                    <label className="block text-sm font-medium text-pm-gold mb-2">Mannequin</label>
                                    <p className="text-pm-off-white">{selectedRequest.modelName}</p>
                            </div>
                             <div>
                                    <label className="block text-sm font-medium text-pm-gold mb-2">Date d'absence</label>
                                    <p className="text-pm-off-white">
                                        {new Date(selectedRequest.date).toLocaleDateString('fr-FR')}
                                    </p>
                            </div>
                                <div>
                                    <label className="block text-sm font-medium text-pm-gold mb-2">Motif</label>
                                    <p className="text-pm-off-white">{selectedRequest.reason}</p>
                        </div>
                             <div>
                                    <label className="block text-sm font-medium text-pm-gold mb-2">Statut</label>
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(selectedRequest.status)}`}>
                                        {getStatusIcon(selectedRequest.status)}
                                        <span className="text-sm font-medium">{getStatusText(selectedRequest.status)}</span>
                                </div>
                            </div>
                        </div>

                            {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                        <div>
                                    <label className="block text-sm font-medium text-pm-gold mb-2">Documents joints</label>
                                    <div className="space-y-2">
                                        {selectedRequest.documents.map((doc, index) => (
                                            <div key={index} className="flex items-center gap-2 p-2 bg-pm-off-white/5 rounded-lg">
                                                <DocumentTextIcon className="w-4 h-4 text-pm-gold" />
                                                <span className="text-pm-off-white">{doc}</span>
                                                <button className="ml-auto px-2 py-1 text-pm-gold border border-pm-gold/30 rounded hover:bg-pm-gold/10">
                                                    Télécharger
                            </button>
                        </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedRequest.adminNotes && (
                                <div>
                                    <label className="block text-sm font-medium text-pm-gold mb-2">Notes administrateur</label>
                                    <p className="text-pm-off-white">{selectedRequest.adminNotes}</p>
                                </div>
                            )}

                            {selectedRequest.status === 'pending' && (
                                <div className="flex gap-3 pt-4 border-t border-pm-gold/20">
                                    <button
                                        onClick={() => handleStatusChange(selectedRequest.id, 'approved')}
                                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                                    >
                                        Approuver
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(selectedRequest.id, 'rejected')}
                                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                                    >
                                        Rejeter
                                    </button>
                </div>
                            )}
            </div>
                    )}
                </AdminModal>
        </div>
        </AdminLayout>
    );
};

export default AdminAbsences;
