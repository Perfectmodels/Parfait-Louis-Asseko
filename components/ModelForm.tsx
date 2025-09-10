import React, { useState, useEffect, useCallback } from 'react';
import { Model, ModelDistinction } from '../types';
import ImageInput from './icons/ImageInput';
import { ChevronDownIcon, PlusIcon, TrashIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import debounce from 'lodash/debounce';

interface ModelFormProps {
    model: Model;
    onSave: (model: Model) => void;
    onCancel: () => void;
    isCreating: boolean;
    mode: 'admin' | 'model';
}

interface FormErrors {
    [key: string]: string | undefined;
    name?: string;
    username?: string;
    password?: string;
    email?: string;
    phone?: string;
    height?: string;
    imageUrl?: string;
    age?: string;
}

const ModelForm: React.FC<ModelFormProps> = ({ model, onSave, onCancel, isCreating, mode }) => {
    const [formData, setFormData] = useState<Model>(model);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        setFormData(model);
        // Réinitialiser les erreurs et le statut lors du chargement d'un nouveau modèle
        setErrors({});
        setSaveStatus(null);
    }, [model]);

    // Validation des champs
    const validateField = (name: string, value: any): string | undefined => {
        switch (name) {
            case 'name':
                return value.trim() ? undefined : 'Le nom est requis';
            case 'username':
                if (!value.trim()) return 'L\'identifiant est requis';
                if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'L\'identifiant ne peut contenir que des lettres, chiffres et tirets bas';
                return undefined;
            case 'password':
                return value.length >= 6 ? undefined : 'Le mot de passe doit contenir au moins 6 caractères';
            case 'email':
                if (!value) return undefined; // Email optionnel
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : 'Email invalide';
            case 'phone':
                if (!value) return undefined; // Téléphone optionnel
                return /^[0-9+\s-]{10,20}$/.test(value) ? undefined : 'Numéro de téléphone invalide';
            case 'height':
                if (!value) return 'La taille est requise';
                return /^\d{1,3}([.,]\d{1,2})?m$/.test(value) ? undefined : 'Format: 1.75m ou 175cm';
            case 'imageUrl':
                if (!value) return 'Une image est requise';
                try {
                    new URL(value);
                    return undefined;
                } catch {
                    return 'URL invalide';
                }
            default:
                return undefined;
        }
    };

    // Validation du formulaire complet
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        const requiredFields = ['name', 'username', 'password', 'height', 'imageUrl'] as const;
        
        requiredFields.forEach((field) => {
            const error = validateField(field, formData[field as keyof Model]);
            if (error) newErrors[field as keyof FormErrors] = error;
        });

        // Validation des emails et téléphones si fournis
        if (formData.email) {
            const emailError = validateField('email', formData.email);
            if (emailError) newErrors.email = emailError;
        }
        
        if (formData.phone) {
            const phoneError = validateField('phone', formData.phone);
            if (phoneError) newErrors.phone = phoneError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Mise à jour avec debounce pour les champs de texte
    const debouncedValidation = useCallback(
        debounce((name: string, value: any) => {
            const error = validateField(name, value);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }, 500),
        []
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        let newValue: any = value;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            newValue = checked;
        } else if (type === 'number') {
            newValue = value !== '' ? Number(value) : '';
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Validation en temps réel pour les champs modifiés
        if (['text', 'email', 'tel', 'number', 'url', 'textarea', 'select-one'].includes(type)) {
            debouncedValidation(name, newValue);
        }
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

    const handleArrayChange = (name: 'categories', value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value.split(',').map(item => item.trim()).filter(Boolean)
        }));
    };

    const handlePortfolioImagesChange = (index: number, value: string) => {
        const newImages = [...(formData.portfolioImages || [])];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, portfolioImages: newImages }));
    };

    const handleAddPortfolioImage = () => {
        setFormData(prev => ({ ...prev, portfolioImages: [...(prev.portfolioImages || []), ''] }));
    };

    const handleRemovePortfolioImage = (index: number) => {
        setFormData(prev => ({ ...prev, portfolioImages: (prev.portfolioImages || []).filter((_, i) => i !== index) }));
    };

    const handleImageChange = (value: string) => {
        setFormData(prev => ({ ...prev, imageUrl: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveStatus(null);
        
        if (!validateForm()) {
            setSaveStatus({ type: 'error', message: 'Veuillez corriger les erreurs dans le formulaire.' });
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave(formData);
            setSaveStatus({ type: 'success', message: 'Modifications enregistrées avec succès !' });
            
            // Effacer le message de succès après 5 secondes
            setTimeout(() => setSaveStatus(null), 5000);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            setSaveStatus({ 
                type: 'error', 
                message: `Erreur lors de la sauvegarde: ${error instanceof Error ? error.message : 'Erreur inconnue'}` 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isAdmin = mode === 'admin';

    // Rendu du statut de sauvegarde
    const renderSaveStatus = () => {
        if (!saveStatus) return null;
        
        const isSuccess = saveStatus.type === 'success';
        const Icon = isSuccess ? CheckCircleIcon : ExclamationCircleIcon;
        
        return (
            <div className={`mb-6 p-4 rounded-lg ${isSuccess ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${isSuccess ? 'text-green-400' : 'text-red-400'}`} />
                    <span className={isSuccess ? 'text-green-300' : 'text-red-300'}>{saveStatus.message}</span>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="admin-page-title">
                    {isCreating ? 'Ajouter un Mannequin' : (isAdmin ? `Modifier le profil de ${model.name}` : `Mon Profil`)}
                </h1>
                {!isCreating && isAdmin && (
                    <div className="flex items-center gap-2 bg-pm-dark/50 border border-pm-off-white/10 px-3 py-1 rounded-full text-sm">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
                        <span>Dernière modification: {new Date().toLocaleString()}</span>
                    </div>
                )}
            </div>
            
            {renderSaveStatus()}
            <form onSubmit={handleSubmit} className="admin-section-wrapper space-y-8">
                
                <Section title="Informations de Base">
                    <FormInput 
                        label="Nom Complet" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        error={errors.name}
                        required
                        disabled={!isAdmin} 
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput 
                            label="Âge" 
                            name="age" 
                            type="number" 
                            min="14" 
                            max="99"
                            value={formData.age || ''} 
                            onChange={handleChange} 
                            error={errors.age}
                        />
                        <FormSelect label="Genre" name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="Femme">Femme</option>
                            <option value="Homme">Homme</option>
                        </FormSelect>
                    </div>
                    <FormInput 
                        label="Lieu de résidence" 
                        name="location" 
                        value={formData.location || ''} 
                        onChange={handleChange} 
                        placeholder="Ville, Pays"
                    />
                </Section>
                
                {isAdmin && (
                    <Section title="Accès, Niveau & Visibilité (Admin)">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput 
                                label="Identifiant (Matricule)" 
                                name="username" 
                                value={formData.username} 
                                onChange={handleChange} 
                                error={errors.username}
                                required
                                disabled={!isCreating} 
                                helperText={isCreating ? "L'identifiant ne peut pas être modifié après la création" : ""}
                            />
                            <FormInput 
                                label="Mot de passe" 
                                name="password" 
                                type="password"
                                value={formData.password} 
                                onChange={handleChange} 
                                error={errors.password}
                                required
                                helperText="Minimum 6 caractères"
                            />
                        </div>
                        <FormSelect label="Niveau" name="level" value={formData.level || 'Débutant'} onChange={handleChange}>
                            <option value="Débutant">Débutant</option>
                            <option value="Pro">Pro</option>
                        </FormSelect>
                        <div className="flex items-center gap-3 pt-2">
                            <input 
                                type="checkbox"
                                id="isPublic"
                                name="isPublic"
                                checked={!!formData.isPublic}
                                onChange={handleChange}
                                className="h-5 w-5 rounded bg-pm-dark border-pm-gold text-pm-gold focus:ring-pm-gold"
                            />
                            <label htmlFor="isPublic" className="admin-label !mb-0">
                                Rendre le profil public sur le site
                            </label>
                        </div>
                        <p className="text-xs text-pm-off-white/60">L'identifiant est généré automatiquement. La visibilité publique rend le mannequin visible dans la section `/mannequins`.</p>
                    </Section>
                )}

                <Section title="Contact">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput 
                            label="Email" 
                            name="email" 
                            type="email" 
                            value={formData.email || ''} 
                            onChange={handleChange} 
                            error={errors.email}
                            placeholder="email@exemple.com"
                        />
                        <FormInput 
                            label="Téléphone" 
                            name="phone" 
                            type="tel" 
                            value={formData.phone || ''} 
                            onChange={handleChange} 
                            error={errors.phone}
                            placeholder="+33 6 12 34 56 78"
                        />
                     </div>
                </Section>

                <Section title="Physique & Mensurations">
                    <div className="relative">
                        <ImageInput 
                            label="Photo Principale" 
                            value={formData.imageUrl} 
                            onChange={handleImageChange} 
                            error={errors.imageUrl}
                            required
                        />
                        {formData.imageUrl && (
                            <a 
                                href={formData.imageUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="absolute right-0 top-0 mt-6 text-xs text-pm-gold/80 hover:text-pm-gold flex items-center gap-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Voir l'image
                            </a>
                        )}
                    </div>
                    <FormInput 
                        label="Taille" 
                        name="height" 
                        value={formData.height} 
                        onChange={handleChange} 
                        error={errors.height}
                        required
                        placeholder="Ex: 1m80 ou 180cm"
                    />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <FormInput label="Poitrine (cm)" name="chest" value={formData.measurements.chest} onChange={handleMeasurementChange} />
                        <FormInput label="Taille (cm)" name="waist" value={formData.measurements.waist} onChange={handleMeasurementChange} />
                        <FormInput label="Hanches (cm)" name="hips" value={formData.measurements.hips} onChange={handleMeasurementChange} />
                        <FormInput label="Pointure (EU)" name="shoeSize" value={formData.measurements.shoeSize} onChange={handleMeasurementChange} />
                    </div>
                </Section>

                <Section title="Carrière & Portfolio">
                    {isAdmin && (
                        <div>
                            <label className="admin-label">Distinctions</label>
                            <ArrayEditor
                                items={formData.distinctions || []}
                                setItems={newItems => setFormData(p => ({...p, distinctions: newItems}))}
                                renderItem={(item: ModelDistinction, onChange) => (
                                    <>
                                        <FormInput label="Nom de la distinction" name="name" value={item.name} onChange={e => onChange('name', e.target.value)} />
                                        <FormTextArea 
                                            label="Titres (un par ligne)" 
                                            name="titles"
                                            value={(item.titles || []).join('\n')} 
                                            onChange={e => onChange('titles', e.target.value.split('\n').filter(Boolean))} 
                                        />
                                    </>
                                )}
                                getNewItem={() => ({ name: 'Nouveau Palmarès', titles: [] })}
                                getItemTitle={item => item.name}
                            />
                        </div>
                    )}
                    {!isAdmin && formData.distinctions && formData.distinctions.length > 0 && (
                        <div>
                            <label className="admin-label">Distinctions (non modifiable)</label>
                            <div className="p-4 bg-pm-dark rounded-md border border-pm-off-white/10 space-y-2">
                                {formData.distinctions.map((d, i) => (
                                    <div key={i}>
                                        <p className="font-semibold">{d.name}</p>
                                        {d.titles && d.titles.length > 0 && (
                                            <ul className="list-disc list-inside text-sm text-pm-off-white/80 pl-2">
                                                {d.titles.map((t, ti) => <li key={ti}>{t}</li>)}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <FormTextArea label="Catégories (séparées par des virgules)" name="categories" value={(formData.categories || []).join(', ')} onChange={(e) => handleArrayChange('categories', e.target.value)} disabled={!isAdmin} />
                    <FormTextArea 
                        label="Expérience" name="experience" value={formData.experience} onChange={handleChange} disabled={!isAdmin} rows={5}
                    />
                    <FormTextArea 
                        label="Parcours" name="journey" value={formData.journey} onChange={handleChange} disabled={!isAdmin} rows={5} 
                    />
                </Section>
                
                <Section title="Photos du Portfolio">
                    <div className="space-y-4">
                        {(formData.portfolioImages || []).map((url, index) => (
                            <div key={index} className="flex items-end gap-2">
                                <div className="flex-grow">
                                    <ImageInput 
                                        label={`Photo ${index + 1}`} 
                                        value={url} 
                                        onChange={(value) => handlePortfolioImagesChange(index, value)} 
                                    />
                                </div>
                                <button type="button" onClick={() => handleRemovePortfolioImage(index)} className="p-2 text-red-500/80 hover:text-red-500 bg-black rounded-md border border-pm-off-white/10 mb-2">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddPortfolioImage} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold text-xs font-bold uppercase tracking-widest rounded-full hover:bg-pm-gold hover:text-pm-dark mt-2">
                            <PlusIcon className="w-4 h-4" /> Ajouter une photo
                        </button>
                    </div>
                </Section>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 mt-8 border-t border-pm-off-white/10">
                    <div className="text-sm text-pm-off-white/60">
                        {isCreating ? 'Tous les champs marqués d\'un * sont obligatoires' : 'Modifié pour la dernière fois le ' + new Date().toLocaleDateString()}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button 
                            type="button" 
                            onClick={onCancel} 
                            className="px-6 py-2.5 bg-pm-dark border border-pm-off-white/20 text-pm-off-white/80 font-bold uppercase tracking-widest text-sm rounded-full hover:border-pm-gold hover:text-pm-gold transition-colors"
                            disabled={isSubmitting}
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit" 
                            className="px-6 py-2.5 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-md shadow-pm-gold/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={isSubmitting || Object.keys(errors).length > 0}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-pm-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enregistrement...
                                </>
                            ) : (
                                'Enregistrer les modifications'
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

const Section: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div className="pt-8 first:pt-0">
        <h2 className="admin-section-title">{title}</h2>
        <div className="space-y-6">{children}</div>
    </div>
);

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    helperText?: string;
    required?: boolean;
    type?: string;
    disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
    label,
    name,
    value,
    onChange,
    error,
    helperText,
    required = false,
    type = 'text',
    disabled = false,
    className = '',
    ...props
}) => (
    <div className={`mb-4 ${className}`}>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={name} className="admin-label">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {helperText && (
                <span className="text-xs text-pm-off-white/50">{helperText}</span>
            )}
        </div>
        <div className="relative">
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`admin-input ${error ? 'border-red-500 focus:border-red-500' : ''} ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
                aria-invalid={!!error}
                aria-describedby={`${name}-error`}
                {...props}
            />
            {error && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                </div>
            )}
        </div>
        {error && (
            <p id={`${name}-error`} className="mt-1 text-sm text-red-400">
                {error}
            </p>
        )}
    </div>
);

const FormSelect: React.FC<{label: string, name: string, value: any, onChange: any, children: React.ReactNode, disabled?: boolean}> = (props) => (
     <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <select {...props} className="admin-input">
            {props.children}
        </select>
    </div>
);

interface ImageInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
}

interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    name: string;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
    helperText?: string;
    required?: boolean;
    rows?: number;
    disabled?: boolean;
}

const FormTextArea: React.FC<FormTextAreaProps> = ({
    label,
    name,
    value,
    onChange,
    error,
    helperText,
    required = false,
    rows = 3,
    disabled = false,
    ...props
}) => (
    <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={name} className="admin-label !mb-0">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {helperText && (
                <span className="text-xs text-pm-off-white/50">{helperText}</span>
            )}
        </div>
        <div className="relative">
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                rows={rows}
                disabled={disabled}
                className={`admin-input admin-textarea ${error ? 'border-red-500 focus:border-red-500' : ''} ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
                aria-invalid={!!error}
                aria-describedby={`${name}-error`}
                {...props}
            />
            {error && (
                <div className="absolute right-3 top-3">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                </div>
            )}
        </div>
        {error && (
            <p id={`${name}-error`} className="mt-1 text-sm text-red-400">
                {error}
            </p>
        )}
    </div>
);

const ArrayEditor: React.FC<{
    items: any[];
    setItems: (items: any[]) => void;
    renderItem: (item: any, onChange: (key: string, value: any) => void, index: number) => React.ReactNode;
    getNewItem: () => any;
    getItemTitle: (item: any) => string;
}> = ({ items, setItems, renderItem, getNewItem, getItemTitle }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleItemChange = (index: number, key: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [key]: value };
        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, getNewItem()]);
        setOpenIndex(items.length);
    };

    const handleDeleteItem = (index: number) => {
        if (window.confirm(`Supprimer "${getItemTitle(items[index])}" ?`)) {
            setItems(items.filter((_, i) => i !== index));
        }
    };
    
    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <div key={index} className="bg-pm-dark/50 border border-pm-off-white/10 rounded-md overflow-hidden">
                    <button type="button" onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full p-3 text-left font-bold flex justify-between items-center hover:bg-pm-gold/5">
                        <span className="truncate pr-4">{getItemTitle(item)}</span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`} />
                    </button>
                    {openIndex === index && (
                        <div className="p-4 border-t border-pm-off-white/10 space-y-3 bg-pm-dark">
                            {renderItem(item, (key, value) => handleItemChange(index, key, value), index)}
                            <div className="text-right pt-2">
                                <button type="button" onClick={() => handleDeleteItem(index)} className="text-red-500/80 hover:text-red-500 text-sm inline-flex items-center gap-1"><TrashIcon className="w-4 h-4" /> Supprimer</button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
            <button type="button" onClick={handleAddItem} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold text-xs font-bold uppercase tracking-widest rounded-full hover:bg-pm-gold hover:text-pm-dark mt-4">
                <PlusIcon className="w-4 h-4"/> Ajouter une distinction
            </button>
        </div>
    );
};

export default ModelForm;