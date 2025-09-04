
import React, { useState, useEffect } from 'react';
import { Model, AIAssistantProps } from '../types';
import AIAssistant from './AIAssistant';
import ImageInput from './ImageInput';
import { SparklesIcon } from '@heroicons/react/24/outline';

// --- HELPER COMPONENTS ---

const FormInput: React.FC<{label: string, name: string, value: any, onChange: any, type?: string, required?: boolean}> = ({label, name, value, onChange, type="text", required = true}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} className="admin-input" required={required} />
    </div>
);

const FormTextArea: React.FC<{label: string, name: string, value: any, onChange: any, onAssistantClick?: (() => void) | null}> = ({label, name, value, onChange, onAssistantClick}) => (
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


// --- MAIN FORM COMPONENT ---

interface ModelFormProps {
    model: Model;
    onSave: (model: Model) => void;
    onCancel: () => void;
    mode: 'admin' | 'model';
    isCreating: boolean;
}

const ModelForm: React.FC<ModelFormProps> = ({ model, onSave, onCancel, mode, isCreating }) => {
    const [formData, setFormData] = useState<Model>(JSON.parse(JSON.stringify(model)));
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [assistantProps, setAssistantProps] = useState<Omit<AIAssistantProps, 'isOpen' | 'onClose'> | null>(null);

    useEffect(() => {
        setFormData(JSON.parse(JSON.stringify(model)));
    }, [model]);

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
        let modelToSave = { ...formData };
        
        if (mode === 'model' && newPassword) {
            if (newPassword !== confirmPassword) {
                alert("Les nouveaux mots de passe ne correspondent pas.");
                return;
            }
            if (newPassword.length < 6) {
                alert("Le nouveau mot de passe doit contenir au moins 6 caractères.");
                return;
            }
            modelToSave.password = newPassword;
        }
        
        onSave(modelToSave);
    };

    const title = mode === 'admin' 
        ? (isCreating ? 'Ajouter un mannequin' : 'Modifier le mannequin')
        : 'Modifier mon profil';

    return (
        <>
         <div className="bg-pm-dark text-pm-off-white py-10 min-h-screen">
            <div className={`container mx-auto px-6 ${mode === 'admin' ? 'max-w-3xl' : ''}`}>
                <h1 className="text-4xl font-playfair text-pm-gold mb-8">{title}</h1>
                <form onSubmit={handleSubmit} className="bg-black p-8 border border-pm-gold/20 space-y-6 rounded-lg shadow-lg shadow-black/30">
                    <h3 className="text-xl font-playfair text-pm-gold">Informations Générales</h3>
                    <FormInput label="Nom Complet" name="name" value={formData.name} onChange={handleChange} />
                     {mode === 'admin' && (
                         isCreating ? (
                            <p className="text-xs text-pm-off-white/60 -mt-4">L'identifiant de connexion (matricule) et le mot de passe seront générés automatiquement lors de la sauvegarde.</p>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-pm-off-white/70 mb-1">Identifiant (Matricule)</label>
                                <input type="text" readOnly value={formData.username} className="admin-input bg-pm-dark/50" />
                            </div>
                        )
                     )}
                    <ImageInput label="Photo Principale" value={formData.imageUrl} onChange={handleImageChange} />
                    <FormInput label="Taille (ex: 1m80)" name="height" value={formData.height} onChange={handleChange} />
                    <FormInput label="Âge" name="age" type="number" value={formData.age || ''} onChange={e => setFormData(p => ({...p, age: e.target.value ? parseInt(e.target.value) : undefined }))} required={false} />
                    <FormSelect label="Genre" name="gender" value={formData.gender} onChange={handleChange} options={['Femme', 'Homme']} />
                    <FormInput label="Lieu de résidence" name="location" value={formData.location || ''} onChange={handleChange} />
                    
                    <h3 className="text-xl font-playfair text-pm-gold pt-4 border-t border-pm-gold/20">Mensurations</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <FormInput label="Poitrine (cm)" name="chest" value={formData.measurements.chest} onChange={handleMeasurementsChange} />
                        <FormInput label="Taille (cm)" name="waist" value={formData.measurements.waist} onChange={handleMeasurementsChange} />
                        <FormInput label="Hanches (cm)" name="hips" value={formData.measurements.hips} onChange={handleMeasurementsChange} />
                        <FormInput label="Pointure (EU)" name="shoeSize" value={formData.measurements.shoeSize} onChange={handleMeasurementsChange} />
                    </div>

                    {mode === 'model' && (
                        <>
                            <h3 className="text-xl font-playfair text-pm-gold pt-4 border-t border-pm-gold/20">Changer le mot de passe</h3>
                             <p className="text-xs text-pm-off-white/60 -mt-4">Laissez les champs vides pour ne pas changer de mot de passe.</p>
                            <FormInput label="Nouveau mot de passe" name="newPassword" type="password" value={newPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)} required={false} />
                            <FormInput label="Confirmer le mot de passe" name="confirmPassword" type="password" value={confirmPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} required={false} />
                        </>
                    )}

                    <h3 className="text-xl font-playfair text-pm-gold pt-4 border-t border-pm-gold/20">Portfolio</h3>
                    <FormInput label="Catégories (séparées par des virgules)" name="categories" value={Array.isArray(formData.categories) ? formData.categories.join(', ') : ''} onChange={(e) => setFormData(p => ({...p, categories: e.target.value.split(',').map(c => c.trim())}))} />
                    <FormTextArea 
                        label="Expérience" 
                        name="experience" 
                        value={formData.experience} 
                        onChange={handleChange}
                        onAssistantClick={mode === 'admin' ? () => setAssistantProps({
                            fieldName: 'Expérience',
                            initialPrompt: `Rédige un paragraphe de 3-4 phrases décrivant l'expérience d'un mannequin nommé ${formData.name}. Mets en avant ses points forts et ses participations notables.`,
                            onInsertContent: (content) => setFormData(p => ({...p, experience: content}))
                        }) : null}
                    />
                     <FormTextArea 
                        label="Parcours" 
                        name="journey" 
                        value={formData.journey} 
                        onChange={handleChange}
                        onAssistantClick={mode === 'admin' ? () => setAssistantProps({
                            fieldName: 'Parcours',
                            initialPrompt: `Rédige un paragraphe de 3-4 phrases racontant le parcours de ${formData.name}, de sa découverte à son statut actuel dans l'agence. Sois inspirant et professionnel.`,
                            onInsertContent: (content) => setFormData(p => ({...p, journey: content}))
                        }) : null}
                    />
                    {mode === 'admin' && (
                        <FormTextArea 
                            label="Distinctions (une par ligne)" 
                            name="distinctions" 
                            value={Array.isArray(formData.distinctions) ? formData.distinctions.join('\n') : ''} 
                            onChange={(e) => setFormData(p => ({...p, distinctions: e.target.value.split('\n').filter(line => line.trim() !== '')}))}
                        />
                    )}

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="px-6 py-2 bg-pm-dark border border-pm-off-white/50 text-pm-off-white/80 font-bold uppercase tracking-widest text-sm rounded-full hover:border-white">Annuler</button>
                        <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-md shadow-pm-gold/30">Sauvegarder les changements</button>
                    </div>
                </form>
            </div>
        </div>
        {assistantProps && <AIAssistant isOpen={!!assistantProps} onClose={() => setAssistantProps(null)} {...assistantProps} />}
       </>
    );
};

export default ModelForm;
