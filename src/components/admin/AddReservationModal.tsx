import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AddReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentEdition: number;
}

const AddReservationModal: React.FC<AddReservationModalProps> = ({ isOpen, onClose, currentEdition }) => {
    const { addDocument } = useData();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [tableType, setTableType] = useState('Table Standard (4 pers)');
    const [guestCount, setGuestCount] = useState(4);
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const tableOptions = [
        { name: 'Table Standard (4 pers)', guests: 4 },
        { name: 'Table VIP (6 pers)', guests: 6 },
        { name: 'Table Prestige (8 pers)', guests: 8 },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await addDocument('fashionDayReservations', {
                edition: currentEdition,
                name,
                email,
                phone,
                tableType,
                guestCount,
                notes,
                status: 'Nouveau',
                submissionDate: new Date().toISOString(),
            });
            onClose();
        } catch (error) {
            console.error("Erreur lors de l'ajout de la réservation", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-pm-dark-light rounded-lg shadow-xl w-full max-w-lg border border-pm-gold/20">
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                    <h2 className="text-xl font-playfair text-pm-gold">Ajouter une Réservation</h2>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nom complet</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-pm-dark border border-gray-700 rounded px-3 py-2 text-white focus:border-pm-gold outline-none" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-pm-dark border border-gray-700 rounded px-3 py-2 text-white focus:border-pm-gold outline-none" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Téléphone</label>
                            <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full bg-pm-dark border border-gray-700 rounded px-3 py-2 text-white focus:border-pm-gold outline-none" />
                        </div>
                        <div>
                            <label htmlFor="tableType" className="block text-sm font-medium text-gray-300 mb-1">Type de Table</label>
                            <select id="tableType" value={tableType} onChange={(e) => {
                                setTableType(e.target.value);
                                const selectedOption = tableOptions.find(opt => opt.name === e.target.value);
                                if (selectedOption) setGuestCount(selectedOption.guests);
                            }} className="w-full bg-pm-dark border border-gray-700 rounded px-3 py-2 text-white focus:border-pm-gold outline-none">
                                {tableOptions.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="guestCount" className="block text-sm font-medium text-gray-300 mb-1">Nombre d'invités</label>
                            <input type="number" id="guestCount" value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} min="1" className="w-full bg-pm-dark border border-gray-700 rounded px-3 py-2 text-white focus:border-pm-gold outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">Notes (optionnel)</label>
                            <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full bg-pm-dark border border-gray-700 rounded px-3 py-2 text-white focus:border-pm-gold outline-none"></textarea>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded text-gray-300 bg-gray-700 hover:bg-gray-600">Annuler</button>
                        <button type="submit" disabled={isSaving} className="px-4 py-2 rounded text-pm-dark bg-pm-gold hover:bg-yellow-400 disabled:bg-gray-500">
                            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddReservationModal;
