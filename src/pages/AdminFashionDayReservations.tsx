import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { FashionDayReservation } from '../types';
import { CheckIcon, XMarkIcon, FunnelIcon, MagnifyingGlassIcon, TableCellsIcon } from '@heroicons/react/24/outline';

const AdminFashionDayReservations: React.FC = () => {
    const { data, updateDocument } = useData();
    const reservations = data?.fashionDayReservations || [];

    const [filterStatus, setFilterStatus] = useState<'All' | 'Nouveau' | 'Confirmé' | 'Refusé'>('All');
    const [searchTerm, setSearchTerm] = useState('');

    const handleStatusChange = async (reservation: FashionDayReservation, newStatus: 'Confirmé' | 'Refusé') => {
        try {
            await updateDocument('fashionDayReservations', reservation.id, { status: newStatus });
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut", error);
        }
    };

    const filteredReservations = reservations.filter(r => {
        const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
        const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.tableType.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    }).sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());

    // Stats
    const totalReservations = reservations.length;
    const confirmedCount = reservations.filter(r => r.status === 'Confirmé').length;
    const pendingCount = reservations.filter(r => r.status === 'Nouveau').length;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-playfair text-pm-gold mb-2">Réservations Fashion Day</h1>
                    <p className="text-gray-400">Gérez les demandes de tables pour l'événement.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-pm-dark-light p-4 rounded border border-pm-gold/20 text-center">
                        <span className="block text-2xl font-bold text-white">{totalReservations}</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Total</span>
                    </div>
                    <div className="bg-pm-dark-light p-4 rounded border border-pm-gold/20 text-center">
                        <span className="block text-2xl font-bold text-green-500">{confirmedCount}</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Confirmées</span>
                    </div>
                    <div className="bg-pm-dark-light p-4 rounded border border-pm-gold/20 text-center">
                        <span className="block text-2xl font-bold text-yellow-500">{pendingCount}</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">En Attente</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, email ou type de table..."
                        className="w-full bg-pm-dark-light border border-pm-gold/20 rounded pl-10 pr-4 py-2 text-white focus:border-pm-gold outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <FunnelIcon className="w-5 h-5 text-gray-400" />
                    <select
                        className="bg-pm-dark-light border border-pm-gold/20 rounded px-4 py-2 text-white focus:border-pm-gold outline-none"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                    >
                        <option value="All">Tous les statuts</option>
                        <option value="Nouveau">Nouveau</option>
                        <option value="Confirmé">Confirmé</option>
                        <option value="Refusé">Refusé</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-pm-dark-light rounded-lg border border-pm-gold/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/50 text-pm-gold text-sm uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Nom / Contact</th>
                                <th className="p-4">Pack Table</th>
                                <th className="p-4">Statut</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {filteredReservations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">Aucune réservation trouvée.</td>
                                </tr>
                            ) : (
                                filteredReservations.map((reservation) => (
                                    <tr key={reservation.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-sm text-gray-300">
                                            {new Date(reservation.submissionDate).toLocaleDateString('fr-FR')}
                                            <span className="block text-xs text-gray-500">{new Date(reservation.submissionDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-white">{reservation.name}</div>
                                            <div className="text-sm text-gray-400">{reservation.email}</div>
                                            <div className="text-sm text-gray-400">{reservation.phone}</div>
                                            {reservation.notes && (
                                                <div className="mt-1 text-xs text-yellow-500/80 italic">"{reservation.notes}"</div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <TableCellsIcon className="w-4 h-4 text-pm-gold" />
                                                <span className="font-medium text-pm-off-white">{reservation.tableType}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">{reservation.guestCount} pers.</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${reservation.status === 'Confirmé' ? 'bg-green-900/30 text-green-400 border-green-700' :
                                                reservation.status === 'Refusé' ? 'bg-red-900/30 text-red-400 border-red-700' :
                                                    'bg-yellow-900/30 text-yellow-400 border-yellow-700'
                                                }`}>
                                                {reservation.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {reservation.status !== 'Confirmé' && (
                                                    <button
                                                        onClick={() => handleStatusChange(reservation, 'Confirmé')}
                                                        className="p-2 bg-green-900/20 text-green-400 border border-green-700/50 rounded hover:bg-green-900/40 transition-colors"
                                                        title="Confirmer"
                                                    >
                                                        <CheckIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {reservation.status !== 'Refusé' && (
                                                    <button
                                                        onClick={() => handleStatusChange(reservation, 'Refusé')}
                                                        className="p-2 bg-red-900/20 text-red-400 border border-red-700/50 rounded hover:bg-red-900/40 transition-colors"
                                                        title="Refuser"
                                                    >
                                                        <XMarkIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminFashionDayReservations;
