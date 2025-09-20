import React, { useState, useEffect } from 'react';
import { Model, ModelDistinction } from '../types';
import ImageUpload from './ImageUpload';
import MultipleImageUpload from './MultipleImageUpload';
import { ChevronDownIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ModelFormProps {
    model: Model;
    onSave: (model: Model) => void;
    onCancel: () => void;
    isCreating: boolean;
    mode: 'admin' | 'model';
}

const ModelForm: React.FC<ModelFormProps> = ({ model, onSave, onCancel, isCreating, mode }) => {
    const [formData, setFormData] = useState<Model>(model);

    useEffect(() => {
        setFormData(model);
    }, [model]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            const isNumber = type === 'number';
            setFormData(prev => ({ ...prev, [name]: isNumber && value !== '' ? Number(value) : value }));
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
            <h1 className="admin-page-title mb-8">
                {isCreating ? 'Ajouter un Mannequin' : (isAdmin ? `Modifier le profil de ${model.name}` : `Mon Profil`)}
            </h1>
            <form onSubmit={handleSubmit} className="admin-section-wrapper space-y-8">
                
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
                
                {isAdmin && (
                    <Section title="Accès & Visibilité (Admin)">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Identifiant (Matricule)" name="username" value={formData.username} onChange={handleChange} disabled={!isCreating} />
                            <FormInput label="Mot de passe" name="password" value={formData.password} onChange={handleChange} />
                        </div>
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
                        <FormInput label="Email" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
                        <FormInput label="Téléphone" name="phone" type="tel" value={formData.phone || ''} onChange={handleChange} />
                     </div>
                </Section>

                <Section title="Physique & Mensurations">
                    <div>
                        <label className="admin-label">Photo Principale</label>
                        <ImageUpload 
                            currentImage={formData.imageUrl}
                            onImageUploaded={handleImageChange}
                            placeholder="Cliquez pour uploader une photo de profil"
                        />
                    </div>
                    <FormInput label="Taille (ex: 1m80)" name="height" value={formData.height} onChange={handleChange} />
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
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="admin-label">Expérience</label>
                            {/* AI Assistant removed */}
                        </div>
                        <textarea
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            disabled={!isAdmin}
                            rows={5}
                            className="admin-input"
                            placeholder="Décrivez l'expérience professionnelle du mannequin..."
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="admin-label">Parcours</label>
                            {/* AI Assistant removed */}
                        </div>
                        <textarea
                            name="journey"
                            value={formData.journey}
                            onChange={handleChange}
                            disabled={!isAdmin}
                            rows={5}
                            className="admin-input"
                            placeholder="Décrivez le parcours et l'évolution du mannequin..."
                        />
                    </div>
                </Section>
                
                <Section title="Photos du Portfolio">
                    <MultipleImageUpload
                        images={formData.portfolioImages || []}
                        onImagesChange={(newImages) => setFormData(prev => ({ ...prev, portfolioImages: newImages }))}
                        maxImages={10}
                        placeholder="Ajouter des photos au portfolio"
                    />
                </Section>

                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onCancel} className="px-6 py-2 bg-pm-dark border border-pm-off-white/50 text-pm-off-white/80 font-bold uppercase tracking-widest text-sm rounded-full hover:border-white">Annuler</button>
                    <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-md shadow-pm-gold/30">Sauvegarder</button>
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

const FormInput: React.FC<{label: string, name: string, value: any, onChange: any, type?: string, disabled?: boolean}> = (props) => (
    <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <input type={props.type || "text"} {...props} className="admin-input" />
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

const FormTextArea: React.FC<{label: string, name: string, value: any, onChange: any, rows?: number, disabled?: boolean}> = (props) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={props.name} className="admin-label !mb-0">{props.label}</label>
        </div>
        <textarea {...props} rows={props.rows || 3} className="admin-input admin-textarea" />
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
