import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { PhotoshootBrief, Model } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, PlusIcon, TrashIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';

const AdminArtisticDirection: React.FC = () => {
    const { data, saveData } = useData();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedBrief, setSelectedBrief] = useState<PhotoshootBrief | null>(null);
    const [newBrief, setNewBrief] = useState({
        modelId: '',
        theme: '',
        clothingStyle: '',
        accessories: '',
        location: '',
        dateTime: ''
    });

    const briefs = useMemo(() => {
        return [...(data?.photoshootBriefs || [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [data?.photoshootBriefs]);

    const models = useMemo(() => {
        return [...(data?.models || [])].sort((a, b) => a.name.localeCompare(b.name));
    }, [data?.models]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewBrief(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data || !newBrief.modelId || !newBrief.theme || !newBrief.dateTime) {
            alert("Veuillez remplir tous les champs requis.");
            return;
        }

        const model = models.find(m => m.id === newBrief.modelId);
        if (!model) {
            alert("Mannequin non trouvé.");
            return;
        }

        const briefData: PhotoshootBrief = {
            ...newBrief,
            id: `brief-${Date.now()}`,
            modelName: model.name,
            createdAt: new Date().toISOString(),
            status: 'Nouveau',
        };

        const updatedBriefs = [...(data.photoshootBriefs || []), briefData];
        try {
            await saveData({ ...data, photoshootBriefs: updatedBriefs });
            setNewBrief({ modelId: '', theme: '', clothingStyle: '', accessories: '', location: '', dateTime: '' });
            setIsFormVisible(false);
            alert("Briefing envoyé avec succès !");
        } catch (error) {
            console.error("Erreur lors de l'envoi du briefing:", error);
            alert("Impossible d'envoyer le briefing.");
        }
    };

    const handleDelete = async (briefId: string) => {
        if (window.confirm("Supprimer ce briefing ?")) {
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
            default: return '';
        }
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Direction Artistique" noIndex />
            <div className="container mx-auto px-6">
                <div className="admin-page-header">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Dashboard
                        </Link>
                        <h1 className="admin-page-title">Direction Artistique</h1>
                        <p className="admin-page-subtitle">Créez et assignez des briefings de séance photo.</p>
                    </div>
                    <button onClick={() => setIsFormVisible(!isFormVisible)} className="action-btn !flex !items-center !gap-2 !px-4 !py-2">
                        <PlusIcon className="w-5 h-5"/> {isFormVisible ? 'Fermer le formulaire' : 'Nouveau Briefing'}
                    </button>
                </div>

                {isFormVisible && (
                    <form onSubmit={handleSubmit} className="admin-section-wrapper mb-8 space-y-4 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormSelect label="Assigner à" name="modelId" value={newBrief.modelId} onChange={handleChange} required>
                                <option value="">Sélectionner un mannequin...</option>
                                {models.map(model => <option key={model.id} value={model.id}>{model.name}</option>)}
                            </FormSelect>
                            <FormInput label="Thème de la séance" name="theme" value={newBrief.theme} onChange={handleChange} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <FormInput label="Lieu" name="location" value={newBrief.location} onChange={handleChange} required />
                           <FormInput label="Date et Heure" name="dateTime" type="datetime-local" value={newBrief.dateTime} onChange={handleChange} required />
                        </div>
                        <FormTextArea label="Style Vestimentaire" name="clothingStyle" value={newBrief.clothingStyle} onChange={handleChange} rows={4} placeholder="Ex: Robe de soirée élégante, style streetwear coloré..." />
                        <FormTextArea label="Accessoires" name="accessories" value={newBrief.accessories} onChange={handleChange} rows={3} placeholder="Ex: Bijoux dorés, sac à main en cuir, lunettes de soleil vintage..." />
                        
                        <div className="text-right pt-2">
                            <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white">
                                Envoyer le Briefing
                            </button>
                        </div>
                    </form>
                )}

                <div className="admin-section-wrapper overflow-x-auto">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Date Séance</th>
                                <th>Mannequin</th>
                                <th>Thème</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {briefs.map(brief => (
                                <tr key={brief.id}>
                                    <td className="whitespace-nowrap">{new Date(brief.dateTime).toLocaleString('fr-FR', {dateStyle: 'short', timeStyle: 'short'})}</td>
                                    <td>{brief.modelName}</td>
                                    <td className="max-w-xs truncate">{brief.theme}</td>
                                    <td>
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(brief.status)}`}>
                                            {brief.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setSelectedBrief(brief)} className="text-pm-gold/70 hover:text-pm-gold p-1" title="Voir les détails"><EyeIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDelete(brief.id)} className="text-red-500/70 hover:text-red-500 p-1" title="Supprimer"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {briefs.length === 0 && <p className="text-center p-8 text-pm-off-white/60">Aucun briefing envoyé.</p>}
                </div>
            </div>
            
            {selectedBrief && <BriefDetailsModal brief={selectedBrief} onClose={() => setSelectedBrief(null)} />}
        </div>
    );
};


const FormInput: React.FC<{label: string, name: string, value: string, onChange: React.ChangeEventHandler<HTMLInputElement>, type?: string, required?: boolean}> = (props) => (
    <div><label className="admin-label">{props.label}</label><input {...props} className="admin-input" /></div>
);
const FormSelect: React.FC<{label: string, name: string, value: string, onChange: React.ChangeEventHandler<HTMLSelectElement>, required?: boolean, children: React.ReactNode}> = (props) => (
    <div><label className="admin-label">{props.label}</label><select {...props} className="admin-input">{props.children}</select></div>
);
const FormTextArea: React.FC<{label: string, name: string, value: string, onChange: React.ChangeEventHandler<HTMLTextAreaElement>, rows: number, placeholder?: string}> = (props) => (
    <div><label className="admin-label">{props.label}</label><textarea {...props} className="admin-textarea" /></div>
);


const BriefDetailsModal: React.FC<{ brief: PhotoshootBrief, onClose: () => void }> = ({ brief, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="p-4 flex justify-between items-center border-b border-pm-gold/20">
                    <h2 className="text-2xl font-playfair text-pm-gold">Détails du Briefing</h2>
                    <button type="button" onClick={onClose} className="text-pm-off-white/70 hover:text-white"><XMarkIcon className="w-6 h-6"/></button>
                </header>
                <main className="p-6 overflow-y-auto space-y-4">
                    <InfoItem label="Mannequin" value={brief.modelName} />
                    <InfoItem label="Thème" value={brief.theme} />
                    <InfoItem label="Date et Heure" value={new Date(brief.dateTime).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })} />
                    <InfoItem label="Lieu" value={brief.location} />
                    <InfoItem label="Style Vestimentaire" value={brief.clothingStyle} preWrap />
                    <InfoItem label="Accessoires" value={brief.accessories} preWrap />
                </main>
            </div>
        </div>
    );
};

const InfoItem: React.FC<{ label: string, value: string, preWrap?: boolean }> = ({ label, value, preWrap }) => (
    <div>
        <h3 className="admin-label !text-pm-gold/80">{label}</h3>
        <p className={`text-pm-off-white/90 bg-black/50 p-3 rounded-md ${preWrap ? 'whitespace-pre-wrap' : ''}`}>{value || 'Non spécifié'}</p>
    </div>
);

export default AdminArtisticDirection;