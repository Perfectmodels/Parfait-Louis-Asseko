import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { FashionDayReservation } from '../types';
import { CheckIcon, XMarkIcon, FunnelIcon, MagnifyingGlassIcon, TableCellsIcon, PlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import ReservationModal from '../components/admin/ReservationModal';

const AdminFashionDayReservations: React.FC = () => {
    const { data, updateDocument } = useData();
    const reservations = data?.fashionDayReservations || [];
    const fashionDayEvents = data?.fashionDayEvents || [];

    const [filterStatus, setFilterStatus] = useState<'All' | 'Nouveau' | 'Confirmé' | 'Refusé'>('All');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<FashionDayReservation | null>(null);

    const currentEdition = useMemo(() => {
        if (fashionDayEvents.length === 0) return 1;
        return Math.max(...fashionDayEvents.map(e => e.edition));
    }, [fashionDayEvents]);

    const handleStatusChange = async (reservation: FashionDayReservation, newStatus: 'Confirmé' | 'Refusé') => {
        try {
            await updateDocument('fashionDayReservations', reservation.id, { status: newStatus });
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut", error);
        }
    };

    const handleEditClick = (reservation: FashionDayReservation) => {
        setSelectedReservation(reservation);
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setSelectedReservation(null);
        setIsModalOpen(true);
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
            <ReservationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentEdition={currentEdition}
                reservation={selectedReservation}
            />
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-playfair text-pm-gold mb-2">Réservations Fashion Day</h1>
                    <p className="text-gray-400">Gérez les demandes de tables pour l'événement (Édition {currentEdition}).</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleAddClick}
                        className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark rounded hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-900/20 font-bold text-sm"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Ajouter une réservation</span>
                    </button>
                    <div className="bg-pm-dark-light p-4 rounded border border-pm-gold/20 text-center min-w-[100px]">
                        <span className="block text-2xl font-bold text-white">{totalReservations}</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Total</span>
                    </div>
                    <div className="bg-pm-dark-light p-4 rounded border border-pm-gold/20 text-center min-w-[100px]">
                        <span className="block text-2xl font-bold text-green-500">{confirmedCount}</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Confirmées</span>
                    </div>
                    <div className="bg-pm-dark-light p-4 rounded border border-pm-gold/20 text-center min-w-[100px]">
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
                        className="w-full bg-pm-dark-light border border-pm-gold/20 rounded pl-10 pr-4 py-2 text-white focus:border-pm-gold outline-none transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <FunnelIcon className="w-5 h-5 text-gray-400" />
                    <select
                        className="bg-pm-dark-light border border-pm-gold/20 rounded px-4 py-2 text-white focus:border-pm-gold outline-none cursor-pointer"
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
            <div className="bg-pm-dark-light rounded-lg border border-pm-gold/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-black/40 text-pm-gold text-xs uppercase tracking-wider font-bold">
                            <tr>
                                <th className="p-4 border-b border-gray-800">Date</th>
                                <th className="p-4 border-b border-gray-800">Nom / Contact</th>
                                <th className="p-4 border-b border-gray-800">Pack Table</th>
                                <th className="p-4 border-b border-gray-800">Statut</th>
                                <th className="p-4 border-b border-gray-800 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {filteredReservations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
                                        <TableCellsIcon className="w-12 h-12 mb-3 text-gray-700" />
                                        <p>Aucune réservation trouvée.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredReservations.map((reservation) => (
                                    <tr key={reservation.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-4 text-sm text-gray-400 whitespace-nowrap">
                                            <div className="font-medium text-gray-300">{new Date(reservation.submissionDate).toLocaleDateString('fr-FR')}</div>
                                            <div className="text-xs text-gray-600">{new Date(reservation.submissionDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-white mb-0.5">{reservation.name}</div>
                                            <div className="text-xs text-gray-400 flex flex-col gap-0.5">
                                                <span>{reservation.email}</span>
                                                <span className="text-gray-500">{reservation.phone}</span>
                                            </div>
                                            {reservation.notes && (
                                                <div className="mt-2 text-xs text-yellow-500/80 italic bg-yellow-900/10 p-1.5 rounded border border-yellow-900/20 max-w-xs truncate">
                                                    "{reservation.notes}"
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`w-2 h-2 rounded-full ${reservation.tableType.includes('VIP') ? 'bg-purple-500' :
                                                        reservation.tableType.includes('Prestige') ? 'bg-pm-gold' : 'bg-blue-500'
                                                    }`}></div>
                                                <span className="font-medium text-gray-200 text-sm">{reservation.tableType}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 pl-4">{reservation.guestCount} invités</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${reservation.status === 'Confirmé' ? 'bg-green-900/20 text-green-400 border-green-800' :
                                                    reservation.status === 'Refusé' ? 'bg-red-900/20 text-red-400 border-red-800' :
                                                        'bg-yellow-900/20 text-yellow-400 border-yellow-800'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${reservation.status === 'Confirmé' ? 'bg-green-400' :
                                                        reservation.status === 'Refusé' ? 'bg-red-400' :
                                                            'bg-yellow-400'
                                                    }`}></span>
                                                {reservation.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditClick(reservation)}
                                                    className="p-2 bg-gray-800 text-gray-300 border border-gray-700 rounded hover:bg-gray-700 hover:text-white transition-colors"
                                                    title="Modifier / Détails"
                                                >
                                                    <PencilSquareIcon className="w-4 h-4" />
                                                </button>

                                                <div className="w-px h-8 bg-gray-800 mx-1"></div>

                                                {/* Actions rapides */}
                                                {reservation.status !== 'Confirmé' && (
                                                    <button
                                                        onClick={() => handleStatusChange(reservation, 'Confirmé')}
                                                        className="p-2 bg-green-900/20 text-green-400 border border-green-800 rounded hover:bg-green-900/40 transition-colors"
                                                        title="Valider"
                                                    >
                                                        <CheckIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {reservation.status !== 'Refusé' && (
                                                    <button
                                                        onClick={() => handleStatusChange(reservation, 'Refusé')}
                                                        className="p-2 bg-red-900/20 text-red-400 border border-red-800 rounded hover:bg-red-900/40 transition-colors"
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
