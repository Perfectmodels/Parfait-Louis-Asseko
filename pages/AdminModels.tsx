

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
      
      const newModel = { ...modelToSave, id, username, password };
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

interface ModelFormProps {
    model: Model;
    onSave: (model: Model) => void;
    onCancel: () => void;
    isCreating: boolean;
}

const ModelForm: React.FC<ModelFormProps> = ({ model, onSave, onCancel, isCreating }) => {
    const [formData, setFormData] = useState<Model>({
        ...model,
        measurements: model.measurements || { chest: '', waist: '', hips: '', shoeSize: '' }
    });
    const [assistantProps, setAssistantProps] = useState<Omit<AIAssistantProps, 'isOpen' | 'onClose'> | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleMeasurementsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, measurements: { ...prev.measurements, [name]: value } }));
    };

    const handleImageChange = (value: string) => {
        setFormData(prev => ({ ...prev, imageUrl: value }));
    };

    const handleRegeneratePassword = () => {
        if (!formData.name) {
            alert("Veuillez d'abord renseigner le nom du mannequin.");
            return;
        }
        const firstName = formData.name.split(' ')[0];
        const year = new Date().getFullYear();
        const newPassword = `${firstName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9-]/g, "")}${year}`;
        setFormData(prev => ({ ...prev, password: newPassword }));
        alert(`Nouveau mot de passe généré : ${newPassword}. N'oubliez pas de sauvegarder.`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <>
         <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <div className="container mx-auto px-6 max-w-3xl">
                <h1 className="text-4xl font-playfair text-pm-gold mb-8">{isCreating ? 'Ajouter un mannequin' : 'Modifier le mannequin'}</h1>
                <form onSubmit={handleSubmit} className="bg-black p-8 border border-pm-gold/20 space-y-6 rounded-lg shadow-lg shadow-black/30">
                    <FormInput label="Nom Complet" name="name" value={formData.name} onChange={handleChange} />
                     {isCreating ? (
                        <p className="text-xs text-pm-off-white/60 -mt-4">L'identifiant de connexion (matricule) et le mot de passe seront générés automatiquement lors de la sauvegarde.</p>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-pm-off-white/70 mb-1">Identifiant (Matricule)</label>
                            <input type="text" readOnly value={formData.username} className="admin-input bg-pm-dark/50" />
                        </div>
                    )}
                    <ImageInput label="Photo Principale" value={formData.imageUrl} onChange={handleImageChange} />
                    <FormInput label="Taille (ex: 1m80)" name="height" value={formData.height} onChange={handleChange} />
                    <FormInput label="Âge" name="age" type="number" value={formData.age || ''} onChange={handleChange} />
                    <FormSelect label="Genre" name="gender" value={formData.gender} onChange={handleChange} options={['Femme', 'Homme']} />
                    <FormInput label="Lieu de résidence" name="location" value={formData.location || ''} onChange={handleChange} />
                    
                    <h3 className="text-xl font-playfair text-pm-gold pt-4 border-t border-pm-gold/20">Mensurations</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <FormInput label="Poitrine (cm)" name="chest" value={formData.measurements.chest} onChange={handleMeasurementsChange} />
                        <FormInput label="Taille (cm)" name="waist" value={formData.measurements.waist} onChange={handleMeasurementsChange} />
                        <FormInput label="Hanches (cm)" name="hips" value={formData.measurements.hips} onChange={handleMeasurementsChange} />
                        <FormInput label="Pointure (EU)" name="shoeSize" value={formData.measurements.shoeSize} onChange={handleMeasurementsChange} />
                    </div>

                    <h3 className="text-xl font-playfair text-pm-gold pt-4 border-t border-pm-gold/20">Accès</h3>
                    {!isCreating ? (
                        <div>
                            <label className="block text-sm font-medium text-pm-off-white/70 mb-1">Mot de passe</label>
                            <div className="flex items-center gap-2">
                                <input type="text" readOnly value={formData.password} className="admin-input flex-grow bg-pm-dark/50" />
                                <button type="button" onClick={handleRegeneratePassword} className="px-4 py-2 text-xs border border-pm-gold text-pm-gold rounded-full hover:bg-pm-gold hover:text-pm-dark">
                                    Régénérer
                                </button>
                            </div>
                        </div>
                    ) : (
                         <p className="text-xs text-pm-off-white/60">Un mot de passe simple (ex: prenom{new Date().getFullYear()}) sera généré automatiquement.</p>
                    )}

                    <h3 className="text-xl font-playfair text-pm-gold pt-4 border-t border-pm-gold/20">Portfolio</h3>
                    <FormInput label="Catégories (séparées par des virgules)" name="categories" value={Array.isArray(formData.categories) ? formData.categories.join(', ') : ''} onChange={(e) => setFormData(p => ({...p, categories: e.target.value.split(',').map(c => c.trim())}))} />
                    <FormTextArea 
                        label="Expérience" 
                        name="experience" 
                        value={formData.experience} 
                        onChange={handleChange}
                        onAssistantClick={() => setAssistantProps({
                            fieldName: 'Expérience',
                            initialPrompt: `Rédige un paragraphe de 3-4 phrases décrivant l'expérience d'un mannequin nommé ${formData.name}. Mets en avant ses points forts et ses participations notables.`,
                            onInsertContent: (content) => setFormData(p => ({...p, experience: content}))
                        })}
                    />
                     <FormTextArea 
                        label="Parcours" 
                        name="journey" 
                        value={formData.journey} 
                        onChange={handleChange}
                        onAssistantClick={() => setAssistantProps({
                            fieldName: 'Parcours',
                            initialPrompt: `Rédige un paragraphe de 3-4 phrases racontant le parcours de ${formData.name}, de sa découverte à son statut actuel dans l'agence. Sois inspirant et professionnel.`,
                            onInsertContent: (content) => setFormData(p => ({...p, journey: content}))
                        })}
                    />
                    <FormTextArea 
                        label="Distinctions (une par ligne)" 
                        name="distinctions" 
                        value={Array.isArray(formData.distinctions) ? formData.distinctions.join('\n') : ''} 
                        onChange={(e) => setFormData(p => ({...p, distinctions: e.target.value.split('\n').filter(line => line.trim() !== '')}))}
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