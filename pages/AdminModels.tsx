import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Model } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';

const AdminModels: React.FC = () => {
  const { data, saveData } = useData();
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSave = (modelToSave: Model) => {
    if (!data) return;

    let updatedModels;
    if (isCreating) {
      // Simple ID generation for the example
      const newModel = { ...modelToSave, id: modelToSave.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now() };
      updatedModels = [...data.models, newModel];
    } else {
      updatedModels = data.models.map(m => m.id === modelToSave.id ? modelToSave : m);
    }
    saveData({ ...data, models: updatedModels });
    setEditingModel(null);
    setIsCreating(false);
  };

  const handleDelete = (modelId: string) => {
    if (!data) return;
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce mannequin ?")) {
      const updatedModels = data.models.filter(m => m.id !== modelId);
      saveData({ ...data, models: updatedModels });
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
    return <ModelForm model={editingModel} onSave={handleSave} onCancel={() => { setEditingModel(null); setIsCreating(false); }} isCreating={isCreating} />;
  }

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Gérer les Mannequins" />
      <div className="container mx-auto px-6">
        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-8 hover:underline">
            <ChevronLeftIcon className="w-5 h-5" />
            Retour au Dashboard
        </Link>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-playfair text-pm-gold">Gérer les Mannequins</h1>
            <button onClick={handleStartCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white">
                <PlusIcon className="w-5 h-5"/> Ajouter un mannequin
            </button>
        </div>

        <div className="bg-black border border-pm-gold/20 p-6">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-pm-gold/20">
                            <th className="p-4">Photo</th>
                            <th className="p-4">Nom</th>
                            <th className="p-4">Taille</th>
                            <th className="p-4">Genre</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.models.map(model => (
                            <tr key={model.id} className="border-b border-pm-dark hover:bg-pm-dark">
                                <td className="p-4"><img src={model.imageUrl} alt={model.name} className="w-12 h-16 object-cover"/></td>
                                <td className="p-4">{model.name}</td>
                                <td className="p-4">{model.height}</td>
                                <td className="p-4">{model.gender}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-4">
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
         <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <div className="container mx-auto px-6 max-w-2xl">
                <h1 className="text-4xl font-playfair text-pm-gold mb-8">{isCreating ? 'Ajouter un mannequin' : 'Modifier le mannequin'}</h1>
                <form onSubmit={handleSubmit} className="bg-black p-8 border border-pm-gold/20 space-y-4">
                    <FormInput label="Nom" name="name" value={formData.name} onChange={handleChange} />
                    <FormInput label="URL de l'image" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
                    <FormInput label="Taille (ex: 1m80)" name="height" value={formData.height} onChange={handleChange} />
                    <FormInput label="Âge" name="age" type="number" value={formData.age || ''} onChange={handleChange} />
                    <FormSelect label="Genre" name="gender" value={formData.gender} onChange={handleChange} options={['Femme', 'Homme']} />
                    <FormInput label="Lieu" name="location" value={formData.location || ''} onChange={handleChange} />
                    <FormTextArea label="Distinctions (une par ligne)" name="distinctions" value={Array.isArray(formData.distinctions) ? formData.distinctions.join('\n') : ''} onChange={(e) => setFormData(p => ({...p, distinctions: e.target.value.split('\n')}))} />

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="px-6 py-2 bg-pm-dark border border-pm-off-white/50 text-pm-off-white/80 font-bold uppercase tracking-widest text-sm rounded-full hover:border-white">Annuler</button>
                        <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white">Sauvegarder</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const FormInput: React.FC<{label: string, name: string, value: any, onChange: any, type?: string}> = ({label, name, value, onChange, type="text"}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} className="w-full bg-pm-dark border border-pm-off-white/20 p-2 focus:outline-none focus:border-pm-gold" />
    </div>
);
const FormTextArea: React.FC<{label: string, name: string, value: any, onChange: any}> = ({label, name, value, onChange}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} rows={4} className="w-full bg-pm-dark border border-pm-off-white/20 p-2 focus:outline-none focus:border-pm-gold" />
    </div>
);
const FormSelect: React.FC<{label: string, name: string, value: any, onChange: any, options: string[]}> = ({label, name, value, onChange, options}) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className="w-full bg-pm-dark border border-pm-off-white/20 p-2 focus:outline-none focus:border-pm-gold">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

export default AdminModels;
