import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { FashionDayReservation } from '../../types';

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentEdition: number;
    reservation?: FashionDayReservation | null; // If provided, we are in Edit mode
}

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose, currentEdition, reservation }) => {
    const { addDocument, updateDocument, deleteDocument } = useData();

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [tableType, setTableType] = useState('Table Standard (4 pers)');
    const [guestCount, setGuestCount] = useState(4);
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState<'Nouveau' | 'Confirmé' | 'Refusé'>('Nouveau');

    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Initialize form when reservation changes or modal opens
    useEffect(() => {
        if (reservation) {
            setName(reservation.name);
            setEmail(reservation.email);
            setPhone(reservation.phone);
            setTableType(reservation.tableType);
            setGuestCount(reservation.guestCount);
            setNotes(reservation.notes || '');
            setStatus(reservation.status);
        } else {
            // Reset for Add mode
            setName('');
            setEmail('');
            setPhone('');
            setTableType('Table Standard (4 pers)');
            setGuestCount(4);
            setNotes('');
            setStatus('Nouveau');
        }
    }, [reservation, isOpen]);

    const tableOptions = [
        { name: 'Table Standard (4 pers)', guests: 4 },
        { name: 'Table VIP (6 pers)', guests: 6 },
        { name: 'Table Prestige (8 pers)', guests: 8 },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const reservationData = {
                edition: currentEdition,
                name,
                email,
                phone,
                tableType,
                guestCount,
                notes,
                status,
                // Keep original date if editing, else new date
                submissionDate: reservation ? reservation.submissionDate : new Date().toISOString(),
            };

            if (reservation) {
                await updateDocument('fashionDayReservations', reservation.id, reservationData);
            } else {
                await addDocument('fashionDayReservations', reservationData);
            }
            onClose();
        } catch (error) {
            console.error("Erreur lors de l'enregistrement", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!reservation) return;
        setIsDeleting(true);
        try {
            await deleteDocument('fashionDayReservations', reservation.id);
            onClose();
        } catch (error) {
            console.error("Erreur lors de la suppression", error);
            setIsDeleting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-pm-dark-light rounded-xl shadow-2xl w-full max-w-lg border border-pm-gold/20 overflow-hidden transform transition-all scale-100">

                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-800 bg-black/20">
                    <div>
                        <h2 className="text-xl font-playfair text-pm-gold font-bold">
                            {reservation ? 'Modifier la Réservation' : 'Ajouter une Réservation'}
                        </h2>
                        {reservation && <p className="text-xs text-gray-500 mt-1">ID: {reservation.id}</p>}
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {!showDeleteConfirm ? (
                        <form id="reservation-form" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Informations de contact */}
                                <div className="md:col-span-2">
                                    <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3 border-b border-gray-800 pb-1">Contact</h3>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Nom complet</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-pm-dark border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-pm-dark border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Téléphone</label>
                                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full bg-pm-dark border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none transition-all" />
                                </div>

                                {/* Détails Réservation */}
                                <div className="md:col-span-2 mt-2">
                                    <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3 border-b border-gray-800 pb-1">Détails Table</h3>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Type de Table</label>
                                    <select value={tableType} onChange={(e) => {
                                        setTableType(e.target.value);
                                        const selectedOption = tableOptions.find(opt => opt.name === e.target.value);
                                        if (selectedOption) setGuestCount(selectedOption.guests);
                                    }} className="w-full bg-pm-dark border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none transition-all">
                                        {tableOptions.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Invités</label>
                                    <input type="number" value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} min="1" className="w-full bg-pm-dark border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none transition-all" />
                                </div>

                                {/* Statut & Notes */}
                                <div className="md:col-span-2 mt-2">
                                    <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3 border-b border-gray-800 pb-1">Statut & Autres</h3>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Statut</label>
                                    <select value={status} onChange={(e) => setStatus(e.target.value as any)} className={`w-full border rounded-lg px-4 py-2.5 outline-none transition-all font-medium ${status === 'Confirmé' ? 'bg-green-900/20 border-green-700 text-green-400' :
                                            status === 'Refusé' ? 'bg-red-900/20 border-red-700 text-red-400' :
                                                'bg-yellow-900/20 border-yellow-700 text-yellow-400'
                                        }`}>
                                        <option value="Nouveau" className="bg-gray-800 text-white">Nouveau</option>
                                        <option value="Confirmé" className="bg-gray-800 text-white">Confirmé</option>
                                        <option value="Refusé" className="bg-gray-800 text-white">Refusé</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Notes internes</label>
                                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Préférences, allergies, paiement reçu..." className="w-full bg-pm-dark border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none transition-all placeholder-gray-600"></textarea>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-8">
                            <TrashIcon className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-80" />
                            <h3 className="text-xl text-white font-bold mb-2">Confirmer la suppression</h3>
                            <p className="text-gray-400 mb-8">Êtes-vous sûr de vouloir supprimer définitivement cette réservation de <strong>{reservation?.name}</strong> ? Cette action est irréversible.</p>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => setShowDeleteConfirm(false)} className="px-6 py-2.5 rounded-lg text-white bg-gray-700 hover:bg-gray-600 transition-colors">
                                    Annuler
                                </button>
                                <button onClick={handleDelete} disabled={isDeleting} className="px-6 py-2.5 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-900/30">
                                    {isDeleting ? 'Suppression...' : 'Oui, Supprimer'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!showDeleteConfirm && (
                    <div className="flex justify-between items-center p-5 border-t border-gray-800 bg-black/20">
                        <div>
                            {reservation && (
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-red-900/10 transition-colors"
                                >
                                    <TrashIcon className="w-4 h-4" /> Supprimer
                                </button>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-gray-300 bg-transparent border border-gray-700 hover:bg-gray-800 transition-colors font-medium text-sm">
                                Annuler
                            </button>
                            <button
                                type="submit"
                                form="reservation-form"
                                disabled={isSaving}
                                className="px-6 py-2.5 rounded-lg text-pm-dark bg-pm-gold hover:bg-yellow-400 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all font-bold text-sm shadow-lg shadow-yellow-900/20"
                            >
                                {isSaving ? 'Enregistrement...' : (reservation ? 'Mettre à jour' : 'Enregistrer')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReservationModal;
