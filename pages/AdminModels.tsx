
import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Model } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import ModelForm from '../components/ModelForm';

const AdminModels: React.FC = () => {
  const { data, saveData, isInitialized } = useData();
  const [localModels, setLocalModels] = useState<Model[]>([]);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (data?.models) {
      setLocalModels(JSON.parse(JSON.stringify(data.models)));
    }
  }, [data?.models, isInitialized]);

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
      const password = `${firstName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9-]/g, "")}${year}`;
      
      const newModel = { ...modelToSave, id, username, password, quizScores: {} };
      updatedModels = [...localModels, newModel];
    } else {
      updatedModels = localModels.map(m => m.id === modelToSave.id ? modelToSave : m);
    }
    
    await saveData({ ...data, models: updatedModels });
    alert("Mannequin enregistré avec succès.");

    setEditingModel(null);
    setIsCreating(false);
  };

  const handleDelete = async (modelId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce mannequin ?")) {
      if (!data) return;
      const updatedModels = localModels.filter(m => m.id !== modelId);
      await saveData({ ...data, models: updatedModels });
      alert("Mannequin supprimé avec succès.");
    }
  };

  const handleStartCreate = () => {
      setEditingModel({
          id: '',
          name: '',
          username: '',
          password: '',
          height: '',
          gender: 'Femme',
          imageUrl: '',
          measurements: { chest: '', waist: '', hips: '', shoeSize: '' },
          categories: [],
          experience: '',
          journey: '',
          quizScores: {}
      });
      setIsCreating(true);
  };

  if (editingModel) {
    return <ModelForm 
        model={editingModel} 
        onSave={handleFormSave} 
        onCancel={() => { setEditingModel(null); setIsCreating(false); }} 
        isCreating={isCreating}
        mode="admin"
    />;
  }

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Gérer les Mannequins" noIndex />
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
              <ChevronLeftIcon className="w-5 h-5" />
              Retour au Dashboard
            </Link>
            <h1 className="text-4xl font-playfair text-pm-gold">Gérer les Mannequins</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleStartCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full hover:bg-pm-gold hover:text-pm-dark">
              <PlusIcon className="w-5 h-5"/> Ajouter Mannequin
            </button>
          </div>
        </div>

        <div className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden shadow-lg shadow-black/30">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-pm-dark/50">
                        <tr className="border-b border-pm-gold/20">
                            <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Photo</th>
                            <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Nom</th>
                            <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70 hidden md:table-cell">Matricule</th>
                            <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70 hidden md:table-cell">Taille</th>
                            <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70 hidden md:table-cell">Genre</th>
                            <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {localModels.map(model => (
                            <tr key={model.id} className="border-b border-pm-dark hover:bg-pm-dark/50 [&:nth-child(even)]:bg-pm-dark/30">
                                <td className="p-2"><img src={model.imageUrl} alt={model.name} className="w-12 h-16 object-cover rounded-md"/></td>
                                <td className="p-4 font-semibold">{model.name}</td>
                                <td className="p-4 font-mono text-xs text-pm-gold/80 hidden md:table-cell">{model.username}</td>
                                <td className="p-4 text-pm-off-white/80 hidden md:table-cell">{model.height}</td>
                                <td className="p-4 text-pm-off-white/80 hidden md:table-cell">{model.gender}</td>
                                <td className="p-4">
                                    <div className="flex items-center justify-end gap-4">
                                        <button onClick={() => { setEditingModel(model); setIsCreating(false); }} className="text-pm-gold/70 hover:text-pm-gold"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(model.id)} className="text-red-500/70 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModels;
