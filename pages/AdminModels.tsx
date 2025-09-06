import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Model } from '../types';
import SEO from '../components/SEO';
// FIX: Fix react-router-dom imports by using a namespace import
import * as ReactRouterDOM from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import ModelForm from '../components/ModelForm';

const AdminModels: React.FC = () => {
  const { data, saveData, isInitialized } = useData();
  const [localModels, setLocalModels] = useState<Model[]>([]);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (data?.models) {
      setLocalModels(data.models);
    }
  }, [data?.models]);

  const handleFormSave = async (modelToSave: Model) => {
    if (!data) return;
    let updatedModels;
    if (isCreating) {
      const id = modelToSave.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      const firstName = modelToSave.name.split(' ')[0];
      const initial = firstName.charAt(0).toUpperCase();

      // Calculate next matricule number
      const modelsWithSameInitial = localModels.filter(m => m.username && m.username.startsWith(`Man-PMM${initial}`));
      const existingNumbers = modelsWithSameInitial.map(m => {
          const numPart = m.username.replace(`Man-PMM${initial}`, '');
          return parseInt(numPart, 10) || 0;
      });
      const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
      const username = `Man-PMM${initial}${String(nextNumber).padStart(2, '0')}`;

      // Generate simple password
      const year = new Date().getFullYear();
      const password = `${firstName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')}${year}`;
      
      const newModel = {
          ...modelToSave,
          id: id,
          username: username,
          password: password,
          // ensure defaults
          measurements: modelToSave.measurements || { chest: '0cm', waist: '0cm', hips: '0cm', shoeSize: '0' },
          categories: modelToSave.categories || ['Défilé', 'Commercial'],
          experience: modelToSave.experience || "Expérience à renseigner par l'administrateur.",
          journey: modelToSave.journey || "Parcours à renseigner par l'administrateur.",
          quizScores: modelToSave.quizScores || {},
          distinctions: modelToSave.distinctions || [],
      };

      updatedModels = [newModel, ...localModels];
    } else {
      updatedModels = localModels.map(m => m.id === modelToSave.id ? modelToSave : m);
    }
    
    await saveData({ ...data, models: updatedModels });
    alert("Mannequin enregistré avec succès.");

    setEditingModel(null);
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce mannequin ?")) {
      if (!data) return;
      const updatedModels = localModels.filter(m => m.id !== id);
      await saveData({ ...data, models: updatedModels });
      alert("Mannequin supprimé avec succès.");
    }
  };
  
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (!data) return;
    const newModels = [...localModels];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newModels.length) return;

    [newModels[index], newModels[targetIndex]] = [newModels[targetIndex], newModels[index]]; // Swap
    
    await saveData({ ...data, models: newModels });
  };
  
  const handleStartCreate = () => {
    setIsCreating(true);
    const currentYear = new Date().getFullYear();
    setEditingModel({
      id: '',
      name: '',
      username: '',
      password: `changeme${currentYear}`,
      height: '',
      gender: 'Femme',
      imageUrl: '',
      measurements: { chest: '', waist: '', hips: '', shoeSize: '' },
      categories: [],
      experience: '',
      journey: '',
      quizScores: {},
      distinctions: [],
    });
  };

  if (editingModel) {
    return <ModelForm model={editingModel} onSave={handleFormSave} onCancel={() => {setEditingModel(null); setIsCreating(false);}} isCreating={isCreating} mode="admin" />
  }

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Gérer les Mannequins" noIndex />
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <ReactRouterDOM.Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
              <ChevronLeftIcon className="w-5 h-5" />
              Retour au Dashboard
            </ReactRouterDOM.Link>
            <h1 className="text-4xl font-playfair text-pm-gold">Gérer les Mannequins</h1>
          </div>
          <button onClick={handleStartCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full hover:bg-pm-gold hover:text-pm-dark">
            <PlusIcon className="w-5 h-5"/> Ajouter un mannequin
          </button>
        </div>

        <div className="bg-black border border-pm-gold/20 p-6 rounded-lg shadow-lg shadow-black/30 space-y-4">
          {localModels.map((model, index) => (
            <div key={model.id} className="flex items-center justify-between p-4 bg-pm-dark/50 rounded-md hover:bg-pm-dark">
              <div className="flex items-center gap-4">
                <img src={model.imageUrl} alt={model.name} className="w-16 h-20 object-cover rounded"/>
                <div>
                  <h2 className="font-bold">{model.name}</h2>
                  <p className="text-sm text-pm-off-white/70">{model.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="disabled:opacity-30"><ArrowUpIcon className="w-5 h-5"/></button>
                <button onClick={() => handleMove(index, 'down')} disabled={index === localModels.length - 1} className="disabled:opacity-30"><ArrowDownIcon className="w-5 h-5"/></button>
                <button onClick={() => { setEditingModel(model); setIsCreating(false); }} className="text-pm-gold/70 hover:text-pm-gold"><PencilIcon className="w-5 h-5"/></button>
                <button onClick={() => handleDelete(model.id)} className="text-red-500/70 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminModels;