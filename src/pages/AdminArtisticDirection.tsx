import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { PhotoshootBrief, Model } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, PlusIcon, TrashIcon, XMarkIcon, PencilIcon, SparklesIcon, CheckCircleIcon, ArchiveBoxIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import AIAssistant from '../components/AIAssistant';

type BriefStatus = PhotoshootBrief['status'];
type FilterStatus = BriefStatus | 'Toutes';

const getStatusInfo = (status: BriefStatus) => {
    switch (status) {
        case 'Nouveau': return { color: 'bg-blue-500/20 text-blue-300', icon: <span className="w-2 h-2 rounded-full bg-blue-400"></span> };
        case 'Lu': return { color: 'bg-green-500/20 text-green-300', icon: <CheckCircleIcon className="w-4 h-4" /> };
        case 'Archivé': return { color: 'bg-gray-500/20 text-gray-400', icon: <ArchiveBoxIcon className="w-4 h-4" /> };
        default: return { color: '', icon: null };
    }
};

const AdminArtisticDirection: React.FC = () => {
    const { data, saveData } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrief, setEditingBrief] = useState<PhotoshootBrief | null>(null);
    const [filter, setFilter] = useState<FilterStatus>('Nouveau');

    const briefs = useMemo(() => {
        return [...(data?.photoshootBriefs || [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [data?.photoshootBriefs]);

    const models = useMemo(() => {
        return [...(data?.models || [])].sort((a, b) => a.name.localeCompare(b.name));
    }, [data?.models]);

    const filteredBriefs = useMemo(() => {
        if (filter === 'Toutes') return briefs;
        return briefs.filter(b => b.status === filter);
    }, [filter, briefs]);

    const handleOpenModal = (brief: PhotoshootBrief | null = null) => {
        if (brief) {
            setEditingBrief(brief);
        } else {
            setEditingBrief({
                id: '', modelId: '', modelName: '', theme: '',
                clothingStyle: '', accessories: '', location: '',
                dateTime: '', createdAt: '', status: 'Nouveau',
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (briefData: PhotoshootBrief) => {
        if (!data) return;
        const model = models.find(m => m.id === briefData.modelId);
        if (!model) {
            alert("Mannequin non trouvé.");
            return;
        }

        let updatedBriefs;
        if (editingBrief && editingBrief.id) {
            updatedBriefs = briefs.map(b => b.id === briefData.id ? { ...briefData, modelName: model.name } : b);
        } else {
            const newBriefWithId = {
                ...briefData,
                id: `brief-${Date.now()}`,
                modelName: model.name,
                createdAt: new Date().toISOString(),
                status: 'Nouveau' as BriefStatus,
            };
            updatedBriefs = [newBriefWithId, ...briefs];
        }

        try {
            await saveData({ ...data, photoshootBriefs: updatedBriefs });
            setIsModalOpen(false);
            setEditingBrief(null);
            alert("Briefing sauvegardé avec succès !");
        } catch (error) {
            console.error("Erreur:", error);
            alert("Impossible de sauvegarder le briefing.");
        }
    };

    const handleUpdateStatus = async (briefId: string, status: BriefStatus) => {
        if (!data) return;
        const updatedBriefs = briefs.map(b => b.id === briefId ? { ...b, status } : b);
        await saveData({ ...data, photoshootBriefs: updatedBriefs });
    };

    const handleDelete = async (briefId: string) => {
        if (window.confirm("Supprimer ce briefing ?")) {
            if (!data) return;
            const updatedBriefs = briefs.filter(b => b.id !== briefId);
            await saveData({ ...data, photoshootBriefs: updatedBriefs });
        }
    };

    const tabs: { label: string, value: FilterStatus }[] = [
        { label: 'Tous', value: 'Toutes' },
        { label: 'Nouveaux', value: 'Nouveau' },
        { label: 'Lus', value: 'Lu' },
        { label: 'Archivés', value: 'Archivé' },
    ];

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
                    <button onClick={() => handleOpenModal()} className="action-btn !flex !items-center !gap-2 !px-4 !py-2">
                        <PlusIcon className="w-5 h-5"/> Nouveau Briefing
                    </button>
                </div>
                
                <div className="border-b border-pm-gold/20 mb-8">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button key={tab.value} onClick={() => setFilter(tab.value)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${filter === tab.value ? 'border-pm-gold text-pm-gold' : 'border-transparent text-pm-off-white/70 hover:text-pm-gold hover:border-pm-gold/50'}`}>
                                {tab.label} ({tab.value === 'Toutes' ? briefs.length : briefs.filter(b => b.status === tab.value).length})
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBriefs.map(brief => (
                        <BriefCard
                            key={brief.id}
                            brief={brief}
                            model={models.find(m => m.id === brief.modelId)}
                            onEdit={() => handleOpenModal(brief)}
                            onDelete={() => handleDelete(brief.id)}
                            onUpdateStatus={(status) => handleUpdateStatus(brief.id, status)}
                        />
                    ))}
                </div>
                {filteredBriefs.length === 0 && <p className="text-center py-16 text-pm-off-white/60">Aucun briefing dans cette catégorie.</p>}
            </div>

            {isModalOpen && editingBrief && (
                <BriefFormModal
                    brief={editingBrief}
                    models={models}
                    onClose={() => { setIsModalOpen(false); setEditingBrief(null); }}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

interface BriefCardProps {
    brief: PhotoshootBrief;
    model?: Model;
    onEdit: () => void;
    onDelete: () => void;
    onUpdateStatus: (status: BriefStatus) => void;
}
const BriefCard: React.FC<BriefCardProps> = ({ brief, model, onEdit, onDelete, onUpdateStatus }) => {
    const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
    const statusMenuRef = useRef<HTMLDivElement>(null);
    const statusInfo = getStatusInfo(brief.status);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
                setIsStatusMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChangeStatus = (newStatus: BriefStatus) => {
        onUpdateStatus(newStatus);
        setIsStatusMenuOpen(false);
    };

    const statusBorderColor = (status: BriefStatus) => {
        switch (status) {
            case 'Nouveau': return 'border-blue-500/50';
            case 'Lu': return 'border-green-500/50';
            case 'Archivé': return 'border-gray-500/50';
            default: return 'border-pm-gold/50';
        }
    };

    const availableStatuses: BriefStatus[] = ['Nouveau', 'Lu', 'Archivé'];

    return (
        <div className="bg-black border border-pm-gold/20 rounded-lg flex flex-col justify-between hover:border-pm-gold transition-all duration-300">
            <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs rounded-full ${statusInfo.color}`}>
                        {statusInfo.icon} {brief.status}
                    </span>
                    {model && <img src={model.imageUrl} alt={model.name} className="w-10 h-10 rounded-full object-cover border-2 border-pm-gold/50"/>}
                </div>
                <h3 className="font-playfair text-xl text-pm-gold truncate">{brief.theme}</h3>
                <p className="text-sm text-pm-off-white/80 font-semibold">{brief.modelName}</p>
                <p className="text-xs text-pm-off-white/60 mt-1">{new Date(brief.dateTime).toLocaleString('fr-FR', {dateStyle: 'long', timeStyle: 'short'})}</p>
                <p className="text-xs text-pm-off-white/60">{brief.location}</p>
                <p className="text-sm text-pm-off-white/70 mt-3 h-10 overflow-hidden text-ellipsis">
                    {brief.clothingStyle}
                </p>
            </div>
            <div className="p-2 bg-pm-dark/50 border-t border-pm-gold/20 flex items-center justify-between">
                <div ref={statusMenuRef} className="relative">
                    <button
                        onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                        className={`action-btn !text-xs !px-3 !py-1 flex items-center gap-1.5 border ${statusBorderColor(brief.status)}`}
                        title="Changer le statut"
                    >
                        Changer Statut
                        <ChevronDownIcon className="w-3 h-3"/>
                    </button>
                     {isStatusMenuOpen && (
                        <div className="absolute bottom-full mb-2 w-full bg-pm-dark border border-pm-gold/30 rounded-md shadow-lg z-10 animate-fade-in">
                            {availableStatuses.filter(s => s !== brief.status).map(status => (
                                <button
                                    key={status}
                                    onClick={() => handleChangeStatus(status)}
                                    className="block w-full text-left px-3 py-1.5 text-xs text-pm-off-white/80 hover:bg-pm-gold/10 hover:text-pm-gold"
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={onEdit} className="p-2 text-pm-gold/70 hover:text-pm-gold" title="Modifier"><PencilIcon className="w-5 h-5"/></button>
                    <button onClick={onDelete} className="p-2 text-red-500/70 hover:text-red-500" title="Supprimer"><TrashIcon className="w-5 h-5"/></button>
                </div>
            </div>
        </div>
    );
};


interface BriefFormModalProps {
    brief: PhotoshootBrief;
    models: Model[];
    onClose: () => void;
    onSave: (brief: PhotoshootBrief) => void;
}
const BriefFormModal: React.FC<BriefFormModalProps> = ({ brief, models, onClose, onSave }) => {
    const [formData, setFormData] = useState(brief);
    const [assistantState, setAssistantState] = useState({ isOpen: false, fieldName: '', initialPrompt: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    
    const openAssistant = (fieldName: string, initialPrompt: string) => {
        setAssistantState({ isOpen: true, fieldName, initialPrompt });
    };

    const handleInsertContent = (content: string) => {
        const field = assistantState.fieldName as keyof typeof formData;
        setFormData(p => ({ ...p, [field]: content }));
        setAssistantState({ isOpen: false, fieldName: '', initialPrompt: '' });
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                        <header className="p-4 flex-shrink-0 flex justify-between items-center border-b border-pm-gold/20">
                            <h2 className="text-2xl font-playfair text-pm-gold">{brief.id ? 'Modifier' : 'Créer'} un Briefing</h2>
                            <button type="button" onClick={onClose} className="text-pm-off-white/70 hover:text-white"><XMarkIcon className="w-6 h-6"/></button>
                        </header>
                        <main className="p-6 flex-grow overflow-y-auto space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormSelect label="Assigner à" name="modelId" value={formData.modelId} onChange={handleChange} required>
                                    <option value="">Sélectionner un mannequin...</option>
                                    {models.map(model => <option key={model.id} value={model.id}>{model.name}</option>)}
                                </FormSelect>
                                <FormInput label="Thème" name="theme" value={formData.theme} onChange={handleChange} required onAIAssist={() => openAssistant('theme', 'Génère 5 thèmes créatifs pour une séance photo de mode.')} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <FormInput label="Lieu" name="location" value={formData.location} onChange={handleChange} required />
                               <FormInput label="Date et Heure" name="dateTime" type="datetime-local" value={formData.dateTime} onChange={handleChange} required />
                            </div>
                            <FormTextArea label="Style Vestimentaire" name="clothingStyle" value={formData.clothingStyle} onChange={handleChange} rows={4} onAIAssist={() => openAssistant('clothingStyle', `Pour un shooting sur le thème "${formData.theme}", décris un style vestimentaire détaillé (vêtements, tissus, couleurs).`)} />
                            <FormTextArea label="Accessoires" name="accessories" value={formData.accessories} onChange={handleChange} rows={3} onAIAssist={() => openAssistant('accessories', `Pour un shooting sur le thème "${formData.theme}" avec le style "${formData.clothingStyle}", liste 5 accessoires pertinents.`)} />
                        </main>
                        <footer className="p-4 flex-shrink-0 flex justify-end gap-4 border-t border-pm-gold/20">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold uppercase tracking-wider">Annuler</button>
                            <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white">
                                Sauvegarder
                            </button>
                        </footer>
                    </form>
                </div>
            </div>
            <AIAssistant 
                isOpen={assistantState.isOpen}
                onClose={() => setAssistantState(p => ({...p, isOpen: false}))}
                onInsertContent={handleInsertContent}
                fieldName={assistantState.fieldName}
                initialPrompt={assistantState.initialPrompt}
            />
        </>
    );
};

const FormInput: React.FC<{label: string, name: string, value: string, onChange: React.ChangeEventHandler<HTMLInputElement>, type?: string, required?: boolean, onAIAssist?: () => void}> = ({ label, onAIAssist, ...props }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={props.name} className="admin-label !mb-0">{label}</label>
            {onAIAssist && <AIAssistButton onClick={onAIAssist} />}
        </div>
        <input {...props} id={props.name} className="admin-input" />
    </div>
);
const FormSelect: React.FC<{label: string, name: string, value: string, onChange: React.ChangeEventHandler<HTMLSelectElement>, required?: boolean, children: React.ReactNode}> = (props) => (
    <div><label className="admin-label">{props.label}</label><select {...props} className="admin-input">{props.children}</select></div>
);
const FormTextArea: React.FC<{label: string, name: string, value: string, onChange: React.ChangeEventHandler<HTMLTextAreaElement>, rows: number, onAIAssist?: () => void}> = ({ label, onAIAssist, ...props }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={props.name} className="admin-label !mb-0">{label}</label>
            {onAIAssist && <AIAssistButton onClick={onAIAssist} />}
        </div>
        <textarea {...props} id={props.name} className="admin-textarea" />
    </div>
);
const AIAssistButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1 text-xs text-pm-gold/70 hover:text-pm-gold">
        <SparklesIcon className="w-4 h-4" /> Assister
    </button>
);

export default AdminArtisticDirection;