import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Absence } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const AdminAbsences: React.FC = () => {
    const { data, saveData } = useData();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newAbsence, setNewAbsence] = useState({
        modelId: '',
        date: new Date().toISOString().split('T')[0],
        reason: 'Non justifié' as Absence['reason'],
        isExcused: false,
        notes: ''
    });

    const absences = useMemo(() => {
        return [...(data?.absences || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [data?.absences]);

    const models = useMemo(() => {
        return [...(data?.models || [])].sort((a, b) => a.name.localeCompare(b.name));
    }, [data?.models]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setNewAbsence(prev => ({ ...prev, [name]: checked }));
        } else {
            setNewAbsence(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data || !newAbsence.modelId || !newAbsence.date) {
            alert("Veuillez sélectionner un mannequin et une date.");
            return;
        }

        const model = models.find(m => m.id === newAbsence.modelId);
        if (!model) {
            alert("Mannequin non trouvé.");
            return;
        }

        const absenceData: Absence = {
            ...newAbsence,
            id: `absence-${Date.now()}`,
            modelName: model.name,
        };

        const updatedAbsences = [...(data.absences || []), absenceData];
        try {
            await saveData({ ...data, absences: updatedAbsences });
            setNewAbsence({ modelId: '', date: new Date().toISOString().split('T')[0], reason: 'Non justifié', isExcused: false, notes: '' });
            setIsFormVisible(false);
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'absence:", error);
            alert("Impossible d'ajouter l'absence.");
        }
    };

    const handleDelete = async (absenceId: string) => {
        if (window.confirm("Supprimer cette absence ?")) {
            if (!data) return;
            const updatedAbsences = absences.filter(a => a.id !== absenceId);
            await saveData({ ...data, absences: updatedAbsences });
        }
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Suivi des Absences" noIndex />
            <div className="container mx-auto px-6">
                <div className="admin-page-header">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Dashboard
                        </Link>
                        <h1 className="admin-page-title">Suivi des Absences</h1>
                        <p className="admin-page-subtitle">Enregistrez et consultez les absences des mannequins.</p>
                    </div>
                    <button onClick={() => setIsFormVisible(!isFormVisible)} className="action-btn !flex !items-center !gap-2 !px-4 !py-2">
                        <PlusIcon className="w-5 h-5"/> {isFormVisible ? 'Fermer le formulaire' : 'Enregistrer une Absence'}
                    </button>
                </div>

                {isFormVisible && (
                    <form onSubmit={handleSubmit} className="admin-section-wrapper mb-8 space-y-4 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="admin-label">Mannequin</label>
                                <select name="modelId" value={newAbsence.modelId} onChange={handleChange} className="admin-input" required>
                                    <option value="">Sélectionner un mannequin</option>
                                    {models.map(model => <option key={model.id} value={model.id}>{model.name}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="admin-label">Date de l'absence</label>
                                <input type="date" name="date" value={newAbsence.date} onChange={handleChange} className="admin-input" required />
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="admin-label">Motif</label>
                                <select name="reason" value={newAbsence.reason} onChange={handleChange} className="admin-input">
                                    <option>Non justifié</option>
                                    <option>Maladie</option>
                                    <option>Personnel</option>
                                    <option>Autre</option>
                                </select>
                            </div>
                            <div className="flex items-end pb-2">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="isExcused" name="isExcused" checked={newAbsence.isExcused} onChange={handleChange} className="h-5 w-5 rounded bg-pm-dark border-pm-gold text-pm-gold focus:ring-pm-gold"/>
                                    <label htmlFor="isExcused" className="admin-label !mb-0">Absence justifiée</label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="admin-label">Notes (optionnel)</label>
                            <textarea name="notes" value={newAbsence.notes} onChange={handleChange} rows={3} className="admin-textarea" />
                        </div>
                        <div className="text-right">
                            <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white">
                                Enregistrer
                            </button>
                        </div>
                    </form>
                )}

                <div className="admin-section-wrapper overflow-x-auto">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Mannequin</th>
                                <th>Motif</th>
                                <th>Justifiée</th>
                                <th>Notes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {absences.map(absence => (
                                <tr key={absence.id}>
                                    <td className="whitespace-nowrap">{new Date(absence.date).toLocaleDateString('fr-FR')}</td>
                                    <td>{absence.modelName}</td>
                                    <td>{absence.reason}</td>
                                    <td>
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${absence.isExcused ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                            {absence.isExcused ? 'Oui' : 'Non'}
                                        </span>
                                    </td>
                                    <td className="text-sm max-w-sm truncate">{absence.notes}</td>
                                    <td>
                                        <button onClick={() => handleDelete(absence.id)} className="text-red-500/70 hover:text-red-500 p-1"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {absences.length === 0 && <p className="text-center p-8 text-pm-off-white/60">Aucune absence enregistrée.</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminAbsences;
