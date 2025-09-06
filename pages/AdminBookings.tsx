import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { BookingRequest } from '../types';
import SEO from '../components/SEO';
import * as ReactRouterDOM from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

type StatusFilter = 'Toutes' | 'Nouveau' | 'Confirmé' | 'Annulé';

const AdminBookings: React.FC = () => {
    const { data, saveData } = useData();
    const [filter, setFilter] = useState<StatusFilter>('Toutes');

    const requests = useMemo(() => {
        return [...(data?.bookingRequests || [])].sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
    }, [data?.bookingRequests]);

    const filteredRequests = useMemo(() => {
        if (filter === 'Toutes') return requests;
        return requests.filter(req => req.status === filter);
    }, [filter, requests]);

    const handleUpdateStatus = async (requestId: string, status: BookingRequest['status']) => {
        if (!data) return;
        const updatedRequests = requests.map(req => req.id === requestId ? { ...req, status } : req);
        await saveData({ ...data, bookingRequests: updatedRequests });
    };

    const handleDelete = async (requestId: string) => {
        if (!data || !window.confirm("Supprimer cette demande de booking ?")) return;
        const updatedRequests = requests.filter(req => req.id !== requestId);
        await saveData({ ...data, bookingRequests: updatedRequests });
    };
    
    const getStatusColor = (status: BookingRequest['status']) => {
        switch (status) {
            case 'Nouveau': return 'bg-blue-500/20 text-blue-300 border-blue-500';
            case 'Confirmé': return 'bg-green-500/20 text-green-300 border-green-500';
            case 'Annulé': return 'bg-red-500/20 text-red-300 border-red-500';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Demandes de Booking" noIndex />
            <div className="container mx-auto px-6">
                <ReactRouterDOM.Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Dashboard
                </ReactRouterDOM.Link>
                <h1 className="text-4xl font-playfair text-pm-gold">Demandes de Booking</h1>
                <p className="text-pm-off-white/70 mt-2 mb-8">Gérez les demandes de réservation des clients.</p>

                <div className="flex items-center gap-4 mb-8 flex-wrap">
                    {(['Toutes', 'Nouveau', 'Confirmé', 'Annulé'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 text-sm uppercase tracking-wider rounded-full transition-all ${filter === f ? 'bg-pm-gold text-pm-dark' : 'bg-black border border-pm-gold text-pm-gold hover:bg-pm-gold/20'}`}>
                            {f}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {filteredRequests.map(req => (
                        <div key={req.id} className="bg-black p-4 border border-pm-gold/10 rounded-lg">
                            <div className="flex justify-between items-start flex-wrap gap-4">
                                <div>
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusColor(req.status)}`}>{req.status}</span>
                                    <h2 className="text-xl font-bold text-pm-gold mt-2">{req.requestedModels}</h2>
                                    <p className="text-sm text-pm-off-white/80">de <span className="font-semibold">{req.clientName}</span> ({req.clientEmail})</p>
                                    {req.clientCompany && <p className="text-xs text-pm-off-white/60">Société: {req.clientCompany}</p>}
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm">Du {req.startDate || 'N/A'} au {req.endDate || 'N/A'}</p>
                                    <p className="text-xs text-pm-off-white/60">Soumis le {new Date(req.submissionDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <p className="mt-4 pt-3 border-t border-pm-gold/10 text-sm text-pm-off-white/90 whitespace-pre-wrap bg-pm-dark/50 p-3 rounded-md">
                                {req.message}
                            </p>
                            <div className="mt-4 flex justify-end items-center gap-2">
                                {req.status === 'Nouveau' && (
                                    <button onClick={() => handleUpdateStatus(req.id, 'Confirmé')} className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-green-500 text-green-300 rounded-full hover:bg-green-500/20">
                                        Confirmer
                                    </button>
                                )}
                                {req.status !== 'Annulé' && (
                                     <button onClick={() => handleUpdateStatus(req.id, 'Annulé')} className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-red-500 text-red-300 rounded-full hover:bg-red-500/20">
                                        Annuler
                                    </button>
                                )}
                                <button onClick={() => handleDelete(req.id)} className="text-red-500/70 hover:text-red-500 p-1"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    ))}
                     {filteredRequests.length === 0 && (
                        <div className="text-center p-16 bg-black rounded-lg border border-pm-gold/10">
                            <CheckCircleIcon className="w-16 h-16 mx-auto text-pm-off-white/30 mb-4"/>
                            <p className="text-pm-off-white/70">Aucune demande de booking dans cette catégorie.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminBookings;