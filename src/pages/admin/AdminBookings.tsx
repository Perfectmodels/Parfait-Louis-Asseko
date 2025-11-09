
import React, { useState, useMemo } from 'react';
import { useData } from '../../../contexts/DataContext';
import { BookingRequest } from '../../../types';
import SEO from '../../../components/SEO';
import { Link } from 'react-router-dom';
import {
    ChevronLeftIcon, TrashIcon, CheckCircleIcon, MagnifyingGlassIcon, FunnelIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

type StatusFilter = 'Toutes' | 'Nouveau' | 'Confirmé' | 'Annulé';

const AdminBookings: React.FC = () => {
    const { data, saveData } = useData();
    const [filter, setFilter] = useState<StatusFilter>('Nouveau');
    const [searchTerm, setSearchTerm] = useState('');

    const requests = useMemo(() => {
        if (!data?.bookingRequests) return [];
        return [...data.bookingRequests].sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
    }, [data?.bookingRequests]);

    const filteredRequests = useMemo(() => {
        return requests
            .filter(req => filter === 'Toutes' || req.status === filter)
            .filter(req => 
                req.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.requestedModels.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [filter, requests, searchTerm]);

    const handleUpdateStatus = async (requestId: string, status: BookingRequest['status']) => {
        if (!data) return;
        const updatedRequests = requests.map(req => req.id === requestId ? { ...req, status } : req);
        try {
            await saveData({ ...data, bookingRequests: updatedRequests });
            toast.success(`Statut de la demande mis à jour: ${status}`);
        } catch {
            toast.error("Erreur lors de la mise à jour.");
        }
    };

    const handleDelete = async (requestId: string) => {
        if (!data) return;
        if (window.confirm("Supprimer cette demande de booking ?")) {
            const updatedRequests = requests.filter(req => req.id !== requestId);
            try {
                await saveData({ ...data, bookingRequests: updatedRequests });
                toast.success("Demande supprimée.");
            } catch {
                toast.error("Erreur lors de la suppression.");
            }
        }
    };
    
    const statusOptions: StatusFilter[] = ['Toutes', 'Nouveau', 'Confirmé', 'Annulé'];

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Demandes de Booking" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Dashboard
                </Link>
                <h1 className="admin-page-title">Demandes de Booking</h1>
                <p className="admin-page-subtitle">Gérez les demandes de réservation des clients.</p>

                <div className="my-8 p-4 bg-black/30 rounded-lg flex flex-wrap items-center gap-4">
                    <div className="relative flex-grow w-full md:w-auto">
                         <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-pm-off-white/50" />
                         <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="admin-input pl-10 w-full"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <FunnelIcon className="w-5 h-5 text-pm-off-white/50" />
                        <select value={filter} onChange={e => setFilter(e.target.value as StatusFilter)} className="admin-input">
                            {statusOptions.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredRequests.map(req => (
                        <BookingCard 
                            key={req.id} 
                            request={req} 
                            onUpdateStatus={handleUpdateStatus} 
                            onDelete={handleDelete}
                        />
                    ))}
                    {filteredRequests.length === 0 && (
                        <div className="text-center p-16 bg-black rounded-lg border border-pm-gold/10">
                            <CheckCircleIcon className="w-16 h-16 mx-auto text-pm-off-white/30 mb-4" />
                            <p className="text-pm-off-white/70">Aucune demande de booking dans cette catégorie.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const BookingCard: React.FC<{ 
    request: BookingRequest, 
    onUpdateStatus: (id: string, status: BookingRequest['status']) => void, 
    onDelete: (id: string) => void 
}> = ({ request, onUpdateStatus, onDelete }) => {
    
    const getStatusColor = (status: BookingRequest['status']) => {
        switch (status) {
            case 'Nouveau': return 'bg-blue-500/20 text-blue-300 border-blue-500';
            case 'Confirmé': return 'bg-green-500/20 text-green-300 border-green-500';
            case 'Annulé': return 'bg-red-500/20 text-red-300 border-red-500';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    return (
        <div className="bg-black p-4 border border-pm-gold/10 rounded-lg transition-shadow hover:shadow-lg hover:shadow-black/30">
            <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusColor(request.status)}`}>{request.status}</span>
                    <h2 className="text-xl font-bold text-pm-gold mt-2">{request.requestedModels}</h2>
                    <p className="text-sm text-pm-off-white/80">de <span className="font-semibold">{request.clientName}</span> (<a href={`mailto:${request.clientEmail}`} className="text-pm-gold hover:underline">{request.clientEmail}</a>)</p>
                    {request.clientCompany && <p className="text-xs text-pm-off-white/60">Société: {request.clientCompany}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="text-sm">Du {request.startDate || 'N/A'} au {request.endDate || 'N/A'}</p>
                    <p className="text-xs text-pm-off-white/60">Soumis le {new Date(request.submissionDate).toLocaleDateString()}</p>
                </div>
            </div>
            <p className="mt-4 pt-3 border-t border-pm-gold/10 text-sm text-pm-off-white/90 whitespace-pre-wrap bg-pm-dark/50 p-3 rounded-md">
                {request.message}
            </p>
            <div className="mt-4 flex justify-end items-center gap-2">
                {request.status === 'Nouveau' && (
                    <button onClick={() => onUpdateStatus(request.id, 'Confirmé')} className="action-btn text-xs !border-green-500 !text-green-300 hover:!bg-green-500/20">
                        Confirmer
                    </button>
                )}
                {request.status !== 'Annulé' && (
                     <button onClick={() => onUpdateStatus(request.id, 'Annulé')} className="action-btn text-xs !border-red-500 !text-red-300 hover:!bg-red-500/20">
                        Annuler
                    </button>
                )}
                <button onClick={() => onDelete(request.id)} className="p-2 text-red-500/70 hover:text-red-500" title="Supprimer">
                    <TrashIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
    )
}

export default AdminBookings;
