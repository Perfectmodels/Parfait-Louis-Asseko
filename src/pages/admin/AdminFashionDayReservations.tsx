import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { FashionDayReservation, FashionDayReservationStatus, FashionDayTicketType } from '../../types';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    CurrencyDollarIcon,
    TicketIcon,
    UserGroupIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const AdminFashionDayReservations: React.FC = () => {
    const { data, saveData } = useData();
    const reservations = data?.fashionDayReservations || [];

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<FashionDayReservationStatus | 'Tous'>('Tous');
    const [ticketTypeFilter, setTicketTypeFilter] = useState<FashionDayTicketType | 'Tous'>('Tous');
    const [selectedReservation, setSelectedReservation] = useState<FashionDayReservation | null>(null);

    // Statistics
    const stats = useMemo(() => {
        const total = reservations.length;
        const confirmed = reservations.filter(r => r.status === 'Confirmée').length;
        const paid = reservations.filter(r => r.status === 'Payée').length;
        const pending = reservations.filter(r => r.status === 'En attente').length;
        const cancelled = reservations.filter(r => r.status === 'Annulée').length;

        const totalRevenue = reservations
            .filter(r => r.status === 'Payée')
            .reduce((sum, r) => sum + r.totalAmount, 0);

        const totalTickets = reservations
            .filter(r => r.status !== 'Annulée')
            .reduce((sum, r) => sum + r.numberOfTickets, 0);

        const byTicketType = reservations.reduce((acc, r) => {
            if (r.status !== 'Annulée') {
                acc[r.ticketType] = (acc[r.ticketType] || 0) + r.numberOfTickets;
            }
            return acc;
        }, {} as Record<FashionDayTicketType, number>);

        return {
            total,
            confirmed,
            paid,
            pending,
            cancelled,
            totalRevenue,
            totalTickets,
            byTicketType
        };
    }, [reservations]);

    // Filtered reservations
    const filteredReservations = useMemo(() => {
        return reservations.filter(reservation => {
            const matchesSearch =
                reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reservation.phone.includes(searchTerm);

            const matchesStatus = statusFilter === 'Tous' || reservation.status === statusFilter;
            const matchesTicketType = ticketTypeFilter === 'Tous' || reservation.ticketType === ticketTypeFilter;

            return matchesSearch && matchesStatus && matchesTicketType;
        });
    }, [reservations, searchTerm, statusFilter, ticketTypeFilter]);

    const handleStatusChange = async (reservationId: string, newStatus: FashionDayReservationStatus) => {
        if (!data) return;

        const updatedReservations = reservations.map(r =>
            r.id === reservationId ? { ...r, status: newStatus } : r
        );

        await saveData({ ...data, fashionDayReservations: updatedReservations });
        setSelectedReservation(null);
    };

    const handleDeleteReservation = async (reservationId: string) => {
        if (!data || !confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) return;

        const updatedReservations = reservations.filter(r => r.id !== reservationId);
        await saveData({ ...data, fashionDayReservations: updatedReservations });
        setSelectedReservation(null);
    };

    const getStatusColor = (status: FashionDayReservationStatus) => {
        switch (status) {
            case 'Payée': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'Confirmée': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'En attente': return 'bg-pm-gold/20 text-pm-gold border-pm-gold/30';
            case 'Annulée': return 'bg-red-500/20 text-red-400 border-red-500/30';
        }
    };

    const getStatusIcon = (status: FashionDayReservationStatus) => {
        switch (status) {
            case 'Payée': return <CheckCircleIcon className="w-4 h-4" />;
            case 'Confirmée': return <CheckCircleIcon className="w-4 h-4" />;
            case 'En attente': return <ClockIcon className="w-4 h-4" />;
            case 'Annulée': return <XCircleIcon className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-playfair text-pm-gold">Réservations Fashion Day</h1>
                    <p className="text-pm-off-white/60 mt-1">Gestion des réservations et statistiques</p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-pm-dark border border-pm-gold/20 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-pm-off-white/60 text-sm">Total Réservations</span>
                        <UserGroupIcon className="w-5 h-5 text-pm-gold" />
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                    <p className="text-xs text-pm-off-white/40 mt-1">
                        {stats.pending} en attente
                    </p>
                </div>

                <div className="bg-pm-dark border border-green-500/20 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-pm-off-white/60 text-sm">Payées</span>
                        <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-green-400">{stats.paid}</p>
                    <p className="text-xs text-pm-off-white/40 mt-1">
                        {stats.confirmed} confirmées
                    </p>
                </div>

                <div className="bg-pm-dark border border-blue-500/20 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-pm-off-white/60 text-sm">Billets Vendus</span>
                        <TicketIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold text-blue-400">{stats.totalTickets}</p>
                    <p className="text-xs text-pm-off-white/40 mt-1">
                        {stats.cancelled} annulés
                    </p>
                </div>

                <div className="bg-pm-dark border border-pm-gold/20 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-pm-off-white/60 text-sm">Revenus</span>
                        <ArrowTrendingUpIcon className="w-5 h-5 text-pm-gold" />
                    </div>
                    <p className="text-3xl font-bold text-pm-gold">
                        {stats.totalRevenue.toLocaleString()} FCFA
                    </p>
                    <p className="text-xs text-pm-off-white/40 mt-1">
                        Paiements confirmés
                    </p>
                </div>
            </div>

            {/* Ticket Type Distribution */}
            <div className="bg-pm-dark border border-pm-gold/20 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                    <ChartBarIcon className="w-5 h-5 text-pm-gold" />
                    <h2 className="text-xl font-playfair text-white">Distribution par Type de Billet</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(['VIP', 'Standard', 'Table', 'Autre'] as FashionDayTicketType[]).map(type => (
                        <div key={type} className="bg-black/30 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-pm-gold">{(stats.byTicketType[type] || 0)}</p>
                            <p className="text-sm text-pm-off-white/60 mt-1">{type}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-pm-dark border border-pm-gold/20 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pm-off-white/40" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, email ou téléphone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="admin-input pl-10"
                        />
                    </div>

                    <div className="relative">
                        <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pm-off-white/40" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="admin-input pl-10"
                        >
                            <option value="Tous">Tous les statuts</option>
                            <option value="En attente">En attente</option>
                            <option value="Confirmée">Confirmée</option>
                            <option value="Payée">Payée</option>
                            <option value="Annulée">Annulée</option>
                        </select>
                    </div>

                    <div className="relative">
                        <TicketIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pm-off-white/40" />
                        <select
                            value={ticketTypeFilter}
                            onChange={(e) => setTicketTypeFilter(e.target.value as any)}
                            className="admin-input pl-10"
                        >
                            <option value="Tous">Tous les types</option>
                            <option value="VIP">VIP</option>
                            <option value="Standard">Standard</option>
                            <option value="Table">Table</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Reservations Table */}
            <div className="bg-pm-dark border border-pm-gold/20 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-black/30">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pm-off-white/60 uppercase tracking-wider">
                                    Client
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pm-off-white/60 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pm-off-white/60 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pm-off-white/60 uppercase tracking-wider">
                                    Billets
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pm-off-white/60 uppercase tracking-wider">
                                    Montant
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pm-off-white/60 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pm-off-white/60 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pm-off-white/60 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pm-gold/10">
                            {filteredReservations.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-pm-off-white/40">
                                        Aucune réservation trouvée
                                    </td>
                                </tr>
                            ) : (
                                filteredReservations.map((reservation) => (
                                    <tr key={reservation.id} className="hover:bg-pm-gold/5 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-white">{reservation.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-pm-off-white/70">{reservation.email}</div>
                                            <div className="text-xs text-pm-off-white/50">{reservation.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium bg-pm-gold/20 text-pm-gold rounded">
                                                {reservation.ticketType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-pm-off-white/70">
                                            {reservation.numberOfTickets}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-pm-gold">
                                            {(reservation.totalAmount || 0).toLocaleString()} FCFA
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded ${getStatusColor(reservation.status)}`}>
                                                {getStatusIcon(reservation.status)}
                                                {reservation.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-pm-off-white/50">
                                            {new Date(reservation.submissionDate).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center gap-2">
                                                {reservation.status === 'En attente' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusChange(reservation.id, 'Confirmée')}
                                                            className="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-xs hover:bg-blue-500/30 transition-colors"
                                                            title="Confirmer"
                                                        >
                                                            Confirmer
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(reservation.id, 'Annulée')}
                                                            className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs hover:bg-red-500/30 transition-colors"
                                                            title="Annuler"
                                                        >
                                                            Annuler
                                                        </button>
                                                    </>
                                                )}
                                                {reservation.status === 'Confirmée' && (
                                                    <button
                                                        onClick={() => handleStatusChange(reservation.id, 'Payée')}
                                                        className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-xs hover:bg-green-500/30 transition-colors"
                                                        title="Marquer comme payée"
                                                    >
                                                        Payée
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setSelectedReservation(reservation)}
                                                    className="px-2 py-1 text-pm-gold hover:text-white transition-colors text-xs border border-pm-gold/30 rounded hover:border-pm-gold"
                                                >
                                                    Détails
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reservation Details Modal */}
            {selectedReservation && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-pm-dark border border-pm-gold/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-pm-gold/20">
                            <h2 className="text-2xl font-playfair text-pm-gold">Détails de la Réservation</h2>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-pm-off-white/60">Nom</label>
                                    <p className="text-white font-medium">{selectedReservation.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-pm-off-white/60">Email</label>
                                    <p className="text-white">{selectedReservation.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-pm-off-white/60">Téléphone</label>
                                    <p className="text-white">{selectedReservation.phone}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-pm-off-white/60">Type de Billet</label>
                                    <p className="text-pm-gold font-medium">{selectedReservation.ticketType}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-pm-off-white/60">Nombre de Billets</label>
                                    <p className="text-white">{selectedReservation.numberOfTickets}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-pm-off-white/60">Montant Total</label>
                                    <p className="text-pm-gold font-bold">{(selectedReservation.totalAmount || 0).toLocaleString()} FCFA</p>
                                </div>
                                {selectedReservation.paymentMethod && (
                                    <div>
                                        <label className="text-sm text-pm-off-white/60">Méthode de Paiement</label>
                                        <p className="text-white">{selectedReservation.paymentMethod}</p>
                                    </div>
                                )}
                                {selectedReservation.paymentReference && (
                                    <div>
                                        <label className="text-sm text-pm-off-white/60">Référence Paiement</label>
                                        <p className="text-white font-mono text-sm">{selectedReservation.paymentReference}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm text-pm-off-white/60">Édition</label>
                                    <p className="text-white">Fashion Day #{selectedReservation.edition}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-pm-off-white/60">Date de Réservation</label>
                                    <p className="text-white">{new Date(selectedReservation.submissionDate).toLocaleString('fr-FR')}</p>
                                </div>
                            </div>

                            {selectedReservation.specialRequests && (
                                <div>
                                    <label className="text-sm text-pm-off-white/60">Demandes Spéciales</label>
                                    <p className="text-white bg-black/30 p-3 rounded mt-1">{selectedReservation.specialRequests}</p>
                                </div>
                            )}

                            <div>
                                <label className="admin-label">Changer le Statut</label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {(['En attente', 'Confirmée', 'Payée', 'Annulée'] as FashionDayReservationStatus[]).map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusChange(selectedReservation.id, status)}
                                            className={`px-4 py-2 rounded border transition-colors ${selectedReservation.status === status
                                                ? getStatusColor(status)
                                                : 'border-pm-gold/20 text-pm-off-white/60 hover:border-pm-gold/40'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-pm-gold/20 flex gap-3 justify-end">
                            <button
                                onClick={() => handleDeleteReservation(selectedReservation.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                                Supprimer
                            </button>
                            <button
                                onClick={() => setSelectedReservation(null)}
                                className="px-4 py-2 bg-pm-gold text-black rounded hover:bg-white transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFashionDayReservations;
