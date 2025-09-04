import React, { useState, useEffect } from 'react';
import { Model, AIAssistantProps } from '../types';
import ImageInput from './ImageInput';
import AIAssistant from './AIAssistant';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface ModelFormProps {
    model: Model;
    onSave: (model: Model) => void;
    onCancel: () => void;
    isCreating: boolean;
    mode: 'admin' | 'model';
}

const ModelForm: React.FC<ModelFormProps> = ({ model, onSave, onCancel, isCreating, mode }) => {
    const [formData, setFormData] = useState<Model>(model);
    const [assistantProps, setAssistantProps] = useState<Omit<AIAssistantProps, 'isOpen' | 'onClose'> | null>(null);

    useEffect(() => {
        setFormData(model);
    }, [model]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const target = e.target as HTMLInputElement;
        const isNumber = target.type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber && value !== '' ? Number(value) : value }));
    };

    const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            measurements: {
                ...prev.measurements,
                [name]: value,
            }
        }));
    };

    const handleArrayChange = (name: 'distinctions' | 'categories', value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value.split(',').map(item => item.trim()).filter(Boolean)
        }));
    };

    const handleImageChange = (value: string) => {
        setFormData(prev => ({ ...prev, imageUrl: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const isAdmin = mode === 'admin';

    return (
        <>
            <h1 className="text-4xl font-playfair text-pm-gold mb-8">
                {isCreating ? 'Ajouter un Mannequin' : (isAdmin ? `Modifier le profil de ${model.name}` : `Mon Profil`)}
            </h1>
            <form onSubmit={handleSubmit} className="bg-black p-8 border border-pm-gold/20 space-y-8 rounded-lg shadow-lg shadow-black/30">
                
                <Section title="Informations de Base">
                    <FormInput label="Nom Complet" name="name" value={formData.name} onChange={handleChange} disabled={!isAdmin} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput label="Âge" name="age" type="number" value={formData.age || ''} onChange={handleChange} />
                        <FormSelect label="Genre" name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="Femme">Femme</option>
                            <option value="Homme">Homme</option>
                        </FormSelect>
                    </div>
                    <FormInput label="Lieu de résidence" name="location" value={formData.location || ''} onChange={handleChange} />
                </Section>

                <Section title="Contact">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput label="Email" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
                        <FormInput label="Téléphone" name="phone" type="tel" value={formData.phone || ''} onChange={handleChange} />
                     </div>
                </Section>

                <Section title="Physique & Mensurations">
                    <ImageInput label="Photo Principale" value={formData.imageUrl} onChange={handleImageChange} />
                    <FormInput label="Taille (ex: 1m80)" name="height" value={formData.height} onChange={handleChange} />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <FormInput label="Poitrine (cm)" name="chest" value={formData.measurements.chest} onChange={handleMeasurementChange} />
                        <FormInput label="Taille (cm)" name="waist" value={formData.measurements.waist} onChange={handleMeasurementChange} />
                        <FormInput label="Hanches (cm)" name="hips" value={formData.measurements.hips} onChange={handleMeasurementChange} />
                        <FormInput label="Pointure (EU)" name="shoeSize" value={formData.measurements.shoeSize} onChange={handleMeasurementChange} />
                    </div>
                </Section>

                <Section title="Carrière & Portfolio">
                    <FormTextArea label="Distinctions (séparées par des virgules)" name="distinctions" value={(formData.distinctions || []).join(', ')} onChange={(e) => handleArrayChange('distinctions', e.target.value)} disabled={!isAdmin} onAssistantClick={isAdmin ? () => setAssistantProps({
                        fieldName: 'Distinctions',
                        initialPrompt: `Génère 3 suggestions de distinctions ou titres prestigieux pour un mannequin nommé ${formData.name}.`,
                        onInsertContent: (content) => handleArrayChange('distinctions', (formData.distinctions || []).join(', ') + ', ' + content.split('\n').join(', '))
                    }) : undefined} />
                    <FormTextArea label="Catégories (séparées par des virgules)" name="categories" value={(formData.categories || []).join(', ')} onChange={(e) => handleArrayChange('categories', e.target.value)} disabled={!isAdmin} />
                    <FormTextArea label="Expérience" name="experience" value={formData.experience} onChange={handleChange} disabled={!isAdmin} rows={5} onAssistantClick={isAdmin ? () => setAssistantProps({
                        fieldName: 'Expérience',
                        initialPrompt: `Rédige une biographie professionnelle de 2 à 3 paragraphes décrivant l'expérience d'un mannequin. Inclus des détails sur les types de défilés, les collaborations avec des marques et les publications dans des magazines.`,
                        onInsertContent: (content) => setFormData(p => ({...p, experience: content}))
                    }) : undefined} />
                    <FormTextArea label="Parcours" name="journey" value={formData.journey} onChange={handleChange} disabled={!isAdmin} rows={5} onAssistantClick={isAdmin ? () => setAssistantProps({
                        fieldName: 'Parcours',
                        initialPrompt: `Rédige une description inspirante du parcours d'un mannequin, en mettant l'accent sur ses débuts, sa détermination, les défis surmontés et sa vision pour l'avenir dans l'industrie de la mode.`,
                        onInsertContent: (content) => setFormData(p => ({...p, journey: content}))
                    }) : undefined} />
                </Section>

                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onCancel} className="px-6 py-2 bg-pm-dark border border-pm-off-white/50 text-pm-off-white/80 font-bold uppercase tracking-widest text-sm rounded-full hover:border-white">Annuler</button>
                    <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-md shadow-pm-gold/30">Sauvegarder</button>
                </div>
            </form>
            {assistantProps && <AIAssistant isOpen={!!assistantProps} onClose={() => setAssistantProps(null)} {...assistantProps} />}
        </>
    );
};

const Section: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div className="space-y-6 pt-6 border-t border-pm-gold/10 first:pt-0 first:border-none">
        <h2 className="text-xl font-playfair text-pm-gold">{title}</h2>
        {children}
    </div>
);

const FormInput: React.FC<{label: string, name: string, value: any, onChange: any, type?: string, disabled?: boolean}> = ({label, name, value, onChange, type="text", disabled = false}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} className="admin-input" disabled={disabled} />
    </div>
);

const FormSelect: React.FC<{label: string, name: string, value: any, onChange: any, children: React.ReactNode, disabled?: boolean}> = ({label, name, value, onChange, children, disabled = false}) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className="admin-input" disabled={disabled}>
            {children}
        </select>
    </div>
);

const FormTextArea: React.FC<{label: string, name: string, value: any, onChange: any, rows?: number, disabled?: boolean, onAssistantClick?: () => void}> = ({label, name, value, onChange, rows = 3, disabled = false, onAssistantClick}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70">{label}</label>
            {onAssistantClick && (
                <button type="button" onClick={onAssistantClick} className="flex items-center gap-1 text-xs text-pm-gold/80 hover:text-pm-gold">
                    <SparklesIcon className="w-4 h-4" /> Assister
                </button>
            )}
        </div>
        <textarea id={name} name={name} value={value} onChange={onChange} rows={rows} className="admin-input admin-textarea" disabled={disabled} />
    </div>
);

export default ModelForm;
