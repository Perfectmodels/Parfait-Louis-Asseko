
import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Model } from '../types';
import SEO from '../components/SEO';
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
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

  const proModels = useMemo(() => localModels.filter(m => m.level === 'Pro' || !m.level), [localModels]);
  const beginnerModels = useMemo(() => localModels.filter(m => m.level === 'Débutant'), [localModels]);

  const handleFormSave = async (modelToSave: Model) => {
    if (!data) return;
    let updatedModels;
    if (isCreating) {
      const id = modelToSave.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      const firstName = modelToSave.name.split(' ')[0] || 'new';
      const initial = firstName.charAt(0).toUpperCase();

      const modelsWithSameInitial = localModels.filter(m => m.username && m.username.startsWith(`Man-PMM${initial}`));
      const existingNumbers = modelsWithSameInitial.map(m => {
          const numPart = m.username.replace(`Man-PMM${initial}`, '');
          return parseInt(numPart, 10) || 0;
      });
      const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
      const username = `Man-PMM${initial}${String(nextNumber).padStart(2, '0')}`;
      
      const year = new Date().getFullYear();
      const password = `${firstName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')}${year}`;
      
      const newModel = {
          ...modelToSave,
          id: id,
          username: username,
          password: password,
          isPublic: modelToSave.isPublic || false,
          level: modelToSave.level || 'Débutant',
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
  
  const handleMove = async (modelId: string, direction: 'up' | 'down') => {
    if (!data) return;
    const newModels = [...localModels];
    const index = newModels.findIndex(m => m.id === modelId);
    if (index === -1) return;

    const modelToMove = newModels[index];
    const modelLevel = modelToMove.level || 'Pro';

    let swapIndex = -1;
    if (direction === 'up') {
      for (let i = index - 1; i >= 0; i--) {
        if ((newModels[i].level || 'Pro') === modelLevel) {
          swapIndex = i;
          break;
        }
      }
    } else { // down
      for (let i = index + 1; i < newModels.length; i++) {
        if ((newModels[i].level || 'Pro') === modelLevel) {
          swapIndex = i;
          break;
        }
      }
    }

    if (swapIndex === -1) return; // No model of the same level to swap with

    [newModels[index], newModels[swapIndex]] = [newModels[swapIndex], newModels[index]];
    
    await saveData({ ...data, models: newModels });
  };
  
  const handleTogglePublicStatus = async (modelId: string) => {
    if (!data) return;
    const updatedModels = localModels.map(m => 
        m.id === modelId ? { ...m, isPublic: !m.isPublic } : m
    );
    await saveData({ ...data, models: updatedModels });
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
      isPublic: false,
      level: 'Débutant',
      measurements: { chest: '', waist: '', hips: '', shoeSize: '' },
      categories: [],
      experience: '',
      journey: '',
      quizScores: {},
      distinctions: [],
    });
  };

  if (editingModel) {
    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <div className="container mx-auto px-6">
                <ModelForm model={editingModel} onSave={handleFormSave} onCancel={() => {setEditingModel(null); setIsCreating(false);}} isCreating={isCreating} mode="admin" />
            </div>
        </div>
    );
  }

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Gérer les Mannequins" noIndex />
      <div className="container mx-auto px-6">
        <div className="admin-page-header">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
              <ChevronLeftIcon className="w-5 h-5" />
              Retour au Dashboard
            </Link>
            <h1 className="admin-page-title">Gérer les Mannequins</h1>
          </div>
          <button onClick={handleStartCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full hover:bg-pm-gold hover:text-pm-dark">
            <PlusIcon className="w-5 h-5"/> Ajouter un mannequin
          </button>
        </div>

        <div className="space-y-12">
            <section>
                <h2 className="admin-section-title">Mannequins Professionnels ({proModels.length})</h2>
                <div className="admin-section-wrapper !p-2 sm:!p-4 space-y-2">
                    {proModels.map((model, index) => (
                        <ModelListItem 
                            key={model.id}
                            model={model}
                            onEdit={() => { setEditingModel(model); setIsCreating(false); }}
                            onDelete={() => handleDelete(model.id)}
                            onTogglePublic={() => handleTogglePublicStatus(model.id)}
                            onMove={handleMove}
                            isFirst={index === 0}
                            isLast={index === proModels.length - 1}
                        />
                    ))}
                    {proModels.length === 0 && <p className="text-center py-4 text-pm-off-white/70">Aucun mannequin professionnel.</p>}
                </div>
            </section>
            
            <section>
                <h2 className="admin-section-title">Mannequins Débutants ({beginnerModels.length})</h2>
                <div className="admin-section-wrapper !p-2 sm:!p-4 space-y-2">
                    {beginnerModels.map((model, index) => (
                        <ModelListItem 
                            key={model.id}
                            model={model}
                            onEdit={() => { setEditingModel(model); setIsCreating(false); }}
                            onDelete={() => handleDelete(model.id)}
                            onTogglePublic={() => handleTogglePublicStatus(model.id)}
                            onMove={handleMove}
                            isFirst={index === 0}
                            isLast={index === beginnerModels.length - 1}
                        />
                    ))}
                    {beginnerModels.length === 0 && <p className="text-center py-4 text-pm-off-white/70">Aucun mannequin débutant.</p>}
                </div>
            </section>
        </div>
      </div>
    </div>
  );
};

interface ModelListItemProps {
    model: Model;
    onEdit: () => void;
    onDelete: () => void;
    onTogglePublic: () => void;
    onMove: (id: string, direction: 'up' | 'down') => void;
    isFirst: boolean;
    isLast: boolean;
}

const ModelListItem: React.FC<ModelListItemProps> = ({ model, onEdit, onDelete, onTogglePublic, onMove, isFirst, isLast }) => (
    <div className="flex items-center justify-between p-2 sm:p-4 bg-pm-dark/50 rounded-md hover:bg-pm-dark transition-colors duration-200">
      <div className="flex items-center gap-4">
        <img src={model.imageUrl} alt={model.name} className="w-16 h-20 object-cover rounded"/>
        <div>
          <h3 className="font-bold text-pm-off-white">{model.name}</h3>
          <p className="text-sm text-pm-off-white/70">{model.username}</p>
           {model.isPublic ? (
                <span className="text-xs font-bold text-green-400">Public</span>
            ) : (
                <span className="text-xs font-bold text-yellow-400">Privé</span>
            )}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
         <button onClick={onTogglePublic} title={model.isPublic ? 'Rendre privé' : 'Rendre public'} className="text-pm-gold/70 hover:text-pm-gold">
            {model.isPublic ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
         </button>
        <button onClick={() => onMove(model.id, 'up')} disabled={isFirst} className="disabled:opacity-30"><ArrowUpIcon className="w-5 h-5"/></button>
        <button onClick={() => onMove(model.id, 'down')} disabled={isLast} className="disabled:opacity-30"><ArrowDownIcon className="w-5 h-5"/></button>
        <button onClick={onEdit} className="text-pm-gold/70 hover:text-pm-gold"><PencilIcon className="w-5 h-5"/></button>
        <button onClick={onDelete} className="text-red-500/70 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
      </div>
    </div>
);

export default AdminModels;