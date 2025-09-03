import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Model, AIAssistantProps } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';
import AIAssistant from '../components/AIAssistant';
import ImageInput from '../components/ImageInput';

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
      const newModel = { ...modelToSave, id: modelToSave.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now() };
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
          height: '',
          gender: 'Femme',
          imageUrl: '',
      });
      setIsCreating(true);
  };

  if (editingModel) {
    return <ModelForm model={editingModel} onSave={handleFormSave} onCancel={() => { setEditingModel(null); setIsCreating(false); }} isCreating={isCreating} />;
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

interface ModelFormProps {
    model: Model;
    onSave: (model: Model) => void;
    onCancel: () => void;
    isCreating: boolean;
}

const ModelForm: React.FC<ModelFormProps> = ({ model, onSave, onCancel, isCreating }) => {
    const [formData, setFormData] = useState<Model>(model);
    const [assistantProps, setAssistantProps] = useState<Omit<AIAssistantProps, 'isOpen' | 'onClose'> | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleImageChange = (value: string) => {
        setFormData(prev => ({ ...prev, imageUrl: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <>
         <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <div className="container mx-auto px-6 max-w-2xl">
                <h1 className="text-4xl font-playfair text-pm-gold mb-8">{isCreating ? 'Ajouter un mannequin' : 'Modifier le mannequin'}</h1>
                <form onSubmit={handleSubmit} className="bg-black p-8 border border-pm-gold/20 space-y-6 rounded-lg shadow-lg shadow-black/30">
                    <FormInput label="Nom" name="name" value={formData.name} onChange={handleChange} />
                    <ImageInput label="Photo" value={formData.imageUrl} onChange={handleImageChange} />
                    <FormInput label="Taille (ex: 1m80)" name="height" value={formData.height} onChange={handleChange} />
                    <FormInput label="Âge" name="age" type="number" value={formData.age || ''} onChange={handleChange} />
                    <FormSelect label="Genre" name="gender" value={formData.gender} onChange={handleChange} options={['Femme', 'Homme']} />
                    <FormInput label="Lieu" name="location" value={formData.location || ''} onChange={handleChange} />
                    <FormTextArea 
                        label="Distinctions (une par ligne)" 
                        name="distinctions" 
                        value={Array.isArray(formData.distinctions) ? formData.distinctions.join('\n') : ''} 
                        onChange={(e) => setFormData(p => ({...p, distinctions: e.target.value.split('\n').filter(line => line.trim() !== '')}))}
                        onAssistantClick={() => setAssistantProps({
                            fieldName: 'Distinctions',
                            initialPrompt: `Génère une liste de 2 à 3 distinctions ou titres prestigieux pour un mannequin nommé ${formData.name}. Sois créatif et professionnel.`,
                            onInsertContent: (content) => setFormData(p => ({...p, distinctions: content.split('\n').filter(line => line.trim() !== '')}))
                        })}
                    />

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="px-6 py-2 bg-pm-dark border border-pm-off-white/50 text-pm-off-white/80 font-bold uppercase tracking-widest text-sm rounded-full hover:border-white">Annuler</button>
                        <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-md shadow-pm-gold/30">Sauvegarder</button>
                    </div>
                </form>
            </div>
        </div>
        {assistantProps && <AIAssistant isOpen={!!assistantProps} onClose={() => setAssistantProps(null)} {...assistantProps} />}
       </>
    );
};

const FormInput: React.FC<{label: string, name: string, value: any, onChange: any, type?: string}> = ({label, name, value, onChange, type="text"}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} className="admin-input" />
    </div>
);
const FormTextArea: React.FC<{label: string, name: string, value: any, onChange: any, onAssistantClick?: () => void}> = ({label, name, value, onChange, onAssistantClick}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70">{label}</label>
            {onAssistantClick && (
                <button type="button" onClick={onAssistantClick} className="flex items-center gap-1 text-xs text-pm-gold/80 hover:text-pm-gold">
                    <SparklesIcon className="w-4 h-4" /> Assister
                </button>
            )}
        </div>
        <textarea id={name} name={name} value={value} onChange={onChange} rows={4} className="admin-input admin-textarea" />
    </div>
);
const FormSelect: React.FC<{label: string, name: string, value: any, onChange: any, options: string[]}> = ({label, name, value, onChange, options}) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className="admin-input">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

export default AdminModels;