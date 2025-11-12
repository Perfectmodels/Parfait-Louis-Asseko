
import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { PhotoshootBrief, Model } from '../../types';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, PlusIcon, TrashIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AdminArtisticDirection: React.FC = () => {
    const { data, saveData } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrief, setEditingBrief] = useState<PhotoshootBrief | null>(null);

    const briefs = useMemo(() => {
        return [...(data?.photoshootBriefs || [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [data?.photoshootBriefs]);

    const models = useMemo(() => {
        return [...(data?.models || [])].sort((a, b) => a.name.localeCompare(b.name));
    }, [data?.models]);

    const handleOpenModal = (brief: PhotoshootBrief | null = null) => {
        setEditingBrief(brief);
        setIsModalOpen(true);
    };

    const handleSave = async (briefData: PhotoshootBrief) => {
        if (!data) return;
        let updatedBriefs;
        if (editingBrief) {
            updatedBriefs = briefs.map(b => b.id === briefData.id ? briefData : b);
        } else {
            updatedBriefs = [...briefs, { ...briefData, id: `brief-${Date.now()}`, createdAt: new Date().toISOString() }];
        }
        try {
            await saveData({ ...data, photoshootBriefs: updatedBriefs });
            setIsModalOpen(false);
            setEditingBrief(null);
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du brief:", error);
            alert("Impossible de sauvegarder le brief.");
        }
    };

    const handleDelete = async (briefId: string) => {
        if (window.confirm("Supprimer ce brief ?")) {
            if (!data) return;
            const updatedBriefs = briefs.filter(b => b.id !== briefId);
            await saveData({ ...data, photoshootBriefs: updatedBriefs });
        }
    };

    const getStatusColor = (status: PhotoshootBrief['status']) => {
        switch (status) {
            case 'Nouveau': return 'bg-blue-500/20 text-blue-300';
            case 'Lu': return 'bg-green-500/20 text-green-300';
            case 'Archivé': return 'bg-gray-500/20 text-gray-400';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Direction Artistique" noIndex />
            <div className="container mx-auto px-6">
                <div className="admin-page-header">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline"><ChevronLeftIcon className="w-5 h-5"/>Retour au Dashboard</Link>
                        <h1 className="admin-page-title">Direction Artistique</h1>
                        <p className="admin-page-subtitle">Créez et envoyez des briefings de séances photo aux mannequins.</p>
                    </div>
                    <button onClick={() => handleOpenModal()} className="action-btn !flex !items-center !gap-2 !px-4 !py-2">
                        <PlusIcon className="w-5 h-5"/> Nouveau Brief
                    </button>
                </div>

                <div className="admin-section-wrapper overflow-x-auto">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Thème</th>
                                <th>Mannequin</th>
                                <th>Date Séance</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {briefs.map(brief => (
                                <tr key={brief.id}>
                                    <td className="font-semibold">{brief.theme}</td>
                                    <td>{brief.modelName}</td>
                                    <td>{new Date(brief.dateTime).toLocaleString('fr-FR')}</td>
                                    <td><span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(brief.status)}`}>{brief.status}</span></td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleOpenModal(brief)} className="text-pm-gold/70 hover:text-pm-gold p-1"><PencilIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDelete(brief.id)} className="text-red-500/70 hover:text-red-500 p-1"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {briefs.length === 0 && <p className="text-center p-8">Aucun brief créé.</p>}
                </div>
            </div>
            {isModalOpen && <BriefModal brief={editingBrief} models={models} onClose={() => { setIsModalOpen(false); setEditingBrief(null); }} onSave={handleSave} />}
        </div>
    );
};

interface BriefModalProps {
    brief: PhotoshootBrief | null;
    models: Model[];
    onClose: () => void;
    onSave: (brief: PhotoshootBrief) => void;
}
const BriefModal: React.FC<BriefModalProps> = ({ brief, models, onClose, onSave }) => {
    const [formData, setFormData] = useState<Omit<PhotoshootBrief, 'id' | 'modelName' | 'createdAt'>>({
        modelId: brief?.modelId || '',
        theme: brief?.theme || '',
        clothingStyle: brief?.clothingStyle || '',
        accessories: brief?.accessories || '',
        location: brief?.location || '',
        dateTime: brief?.dateTime.slice(0, 16) || '',
        status: brief?.status || 'Nouveau',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const model = models.find(m => m.id === formData.modelId);
        if (!model) { alert("Mannequin invalide."); return; }
        onSave({ ...formData, id: brief?.id || '', modelName: model.name, createdAt: brief?.createdAt || '' });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <header className="p-4 flex justify-between items-center border-b border-pm-gold/20">
                        <h2 className="text-2xl font-playfair text-pm-gold">{brief ? 'Modifier' : 'Créer'} un Briefing</h2>
                        <button type="button" onClick={onClose}><XMarkIcon className="w-6 h-6"/></button>
                    </header>
                    <main className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <FormInput label="Thème du shooting" name="theme" value={formData.theme} onChange={handleChange} required/>
                        <div>
                            <label className="admin-label">Mannequin</label>
                            <select name="modelId" value={formData.modelId} onChange={handleChange} className="admin-input" required>
                                <option value="">Sélectionner un mannequin</option>
                                {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput label="Lieu" name="location" value={formData.location} onChange={handleChange} required/>
                            <FormInput label="Date et Heure" name="dateTime" type="datetime-local" value={formData.dateTime} onChange={handleChange} required/>
                        </div>
                        <FormTextArea label="Style Vestimentaire" name="clothingStyle" value={formData.clothingStyle} onChange={handleChange} rows={4} required/>
                        <FormTextArea label="Accessoires" name="accessories" value={formData.accessories} onChange={handleChange} rows={3} required/>
                    </main>
                    <footer className="p-4 flex justify-end gap-4 border-t border-pm-gold/20">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm">Annuler</button>
                        <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold text-sm rounded-full">Envoyer</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

const FormInput: React.FC<any> = (props) => (
    <div><label className="admin-label">{props.label}</label><input {...props} className="admin-input" /></div>
);
const FormTextArea: React.FC<any> = (props) => (
    <div><label className="admin-label">{props.label}</label><textarea {...props} className="admin-textarea" /></div>
);

export default AdminArtisticDirection;


