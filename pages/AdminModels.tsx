import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Model } from '../types';
import SEO from '../components/SEO';
import * as ReactRouterDOM from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon, EyeIcon, EyeSlashIcon, PrinterIcon } from '@heroicons/react/24/outline';
import ModelForm from '../components/ModelForm'; 
import PrintableModelSheet from '../components/PrintableModelSheet'; 

const AdminModels: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [localModels, setLocalModels] = useState<Model[]>([]);
    const [editingModel, setEditingModel] = useState<Model | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [printingModel, setPrintingModel] = useState<Model | null>(null);

    useEffect(() => {
        if (data?.models) {
            setLocalModels([...data.models].sort((a,b) => a.name.localeCompare(b.name)));
        }
    }, [data?.models, isInitialized]);

    const handleFormSave = async (modelToSave: Model) => {
        if (!data) return;
        let updatedModels;
        
        if (isCreating) {
            if (localModels.some(m => m.username === modelToSave.username)) {
                alert("Erreur : Cet identifiant (matricule) est déjà utilisé.");
                return;
            }
            if (modelToSave.id && localModels.some(m => m.id === modelToSave.id)) {
                 alert("Erreur : Cet ID est déjà utilisé.");
                return;
            }
            if(!modelToSave.id) {
                modelToSave.id = `${modelToSave.name.toLowerCase().replace(/ /g, '-')}-${Date.now()}`;
            }
            updatedModels = [...localModels, modelToSave];
        } else {
            updatedModels = localModels.map(m => m.id === modelToSave.id ? modelToSave : m);
        }
        
        await saveData({ ...data, models: updatedModels.sort((a,b) => a.name.localeCompare(b.name)) });
        alert(`Mannequin ${isCreating ? 'créé' : 'mis à jour'} avec succès.`);

        setEditingModel(null);
        setIsCreating(false);
    };

    const handleDelete = async (modelId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce mannequin ? Cette action est irréversible.")) {
            if (!data) return;
            const updatedModels = localModels.filter(m => m.id !== modelId);
            await saveData({ ...data, models: updatedModels });
            alert("Mannequin supprimé avec succès.");
        }
    };
    
    const handleStartCreate = () => {
        setIsCreating(true);
        const newModelTemplate: Model = {
            id: '',
            name: '',
            username: '',
            password: '',
            level: 'Débutant',
            gender: 'Femme',
            height: '1m',
            imageUrl: '',
            isPublic: false,
            measurements: { chest: '', waist: '', hips: '', shoeSize: '' },
            categories: [],
            experience: '',
            journey: '',
            quizScores: {}
        };
        setEditingModel(newModelTemplate);
    };

    const handleTogglePublic = async (modelId: string) => {
        if (!data) return;
        const updatedModels = localModels.map(m => 
            m.id === modelId ? { ...m, isPublic: !m.isPublic } : m
        );
        await saveData({ ...data, models: updatedModels });
    };

    if (editingModel) {
        return (
            <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
                <div className="container mx-auto px-6 max-w-4xl">
                     <button onClick={() => { setEditingModel(null); setIsCreating(false); }} className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                        <ChevronLeftIcon className="w-5 h-5" />
                        Retour à la liste
                    </button>
                    <ModelForm 
                        model={editingModel} 
                        onSave={handleFormSave} 
                        onCancel={() => {setEditingModel(null); setIsCreating(false);}} 
                        isCreating={isCreating}
                        mode="admin"
                    />
                </div>
            </div>
        )
    }

    if (printingModel) {
        return <PrintableModelSheet model={printingModel} onDonePrinting={() => setPrintingModel(null)} />;
    }

    return (
         <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Gérer les Mannequins" noIndex />
            <div className="container mx-auto px-6">
                <div className="admin-page-header">
                    <div>
                        <ReactRouterDOM.Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Dashboard
                        </ReactRouterDOM.Link>
                        <h1 className="admin-page-title">Gérer les Mannequins</h1>
                        <p className="admin-page-subtitle">Ajoutez, modifiez ou supprimez les profils des mannequins.</p>
                    </div>
                    <button onClick={handleStartCreate} className="action-btn !flex !items-center !gap-2 !px-4 !py-2">
                        <PlusIcon className="w-5 h-5"/> Ajouter un Mannequin
                    </button>
                </div>

                <div className="admin-section-wrapper overflow-x-auto">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Nom</th>
                                <th>Niveau</th>
                                <th>Public</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {localModels.map((model) => (
                                <tr key={model.id}>
                                    <td><img src={model.imageUrl} alt={model.name} className="w-12 h-16 object-cover rounded"/></td>
                                    <td className="font-semibold">{model.name}</td>
                                    <td><span className={`px-2 py-0.5 text-xs rounded-full ${model.level === 'Pro' ? 'bg-pm-gold/20 text-pm-gold' : 'bg-blue-500/20 text-blue-300'}`}>{model.level}</span></td>
                                    <td>
                                        <button onClick={() => handleTogglePublic(model.id)} title={model.isPublic ? "Rendre privé" : "Rendre public"}>
                                            {model.isPublic ? <EyeIcon className="w-6 h-6 text-green-500"/> : <EyeSlashIcon className="w-6 h-6 text-pm-off-white/50"/>}
                                        </button>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setPrintingModel(model)} className="p-2 text-pm-gold/70 hover:text-pm-gold" title="Imprimer la Fiche"><PrinterIcon className="w-5 h-5"/></button>
                                            <button onClick={() => setEditingModel(model)} className="p-2 text-pm-gold/70 hover:text-pm-gold" title="Modifier"><PencilIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDelete(model.id)} className="p-2 text-red-500/70 hover:text-red-500" title="Supprimer"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminModels;
