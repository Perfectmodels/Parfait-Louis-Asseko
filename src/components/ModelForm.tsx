import React, { useState, useEffect } from 'react';
import { Model, ModelDistinction } from '../types';
import ImageUploader from './ImageUploader';
import { ChevronDownIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const isAdmin = mode === 'admin';

    return (
        <div className="space-y-12">
            <header className="flex justify-between items-end border-b border-white/5 pb-12">
                <div>
                   <span className="section-label">{isAdmin ? "Admin Console" : "Model Portal"}</span>
                   <h1 className="text-6xl font-playfair font-black">
                       {isCreating ? 'New Face' : 'Profile Edit'}
                   </h1>
                </div>
                <div className="flex gap-6">
                    <button onClick={onCancel} className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-colors">Discard</button>
                    <button onClick={handleSubmit} className="btn-premium !py-3 !px-12 text-[10px]">Save Changes</button>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                
                {/* Main Column */}
                <div className="lg:col-span-8 space-y-24">
                    
                    <Section title="Identity & Stats">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <FormInput label="Full Name" name="name" value={formData.name} onChange={handleChange} disabled={!isAdmin} placeholder="ex: Jane Doe" />
                            <FormInput label="Current Location" name="location" value={formData.location || ''} onChange={handleChange} placeholder="ex: Libreville, Gabon" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <FormInput label="Age" name="age" type="number" value={formData.age || ''} onChange={handleChange} placeholder="Years" />
                            <FormSelect label="Gender" name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="Femme">Femme</option>
                                <option value="Homme">Homme</option>
                            </FormSelect>
                             <FormInput label="Height" name="height" value={formData.height} onChange={handleChange} placeholder="ex: 1m80" />
                        </div>
                    </Section>
                    
                    <Section title="Measurements">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                            <FormInput label="Chest (cm)" name="chest" value={formData.measurements.chest} onChange={handleMeasurementChange} />
                            <FormInput label="Waist (cm)" name="waist" value={formData.measurements.waist} onChange={handleMeasurementChange} />
                            <FormInput label="Hips (cm)" name="hips" value={formData.measurements.hips} onChange={handleMeasurementChange} />
                            <FormInput label="Shoe Size" name="shoeSize" value={formData.measurements.shoeSize} onChange={handleMeasurementChange} />
                        </div>
                    </Section>

                    <Section title="The Editorial">
                        <FormTextArea label="Professional Experience" name="experience" value={formData.experience} onChange={handleChange} rows={5} placeholder="Describe main campaigns, runway shows..." />
                        <FormTextArea label="Career Journey" name="journey" value={formData.journey} onChange={handleChange} rows={5} placeholder="How did you start? What are your goals?" />
                        <FormTextArea label="Categories (comma separated)" name="categories" value={(formData.categories || []).join(', ')} onChange={(e) => handleArrayChange('categories', e.target.value)} placeholder="Runway, Commercial, Beauty..." />
                    </Section>

                    <Section title="Portfolio Management">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {(formData.portfolioImages || []).map((url, index) => (
                                <div key={index} className="relative group">
                                    <ImageUploader 
                                        label={`Story ${index + 1}`} 
                                        value={url} 
                                        onChange={(value) => handlePortfolioImagesChange(index, value)} 
                                    />
                                    <button type="button" onClick={() => handleRemovePortfolioImage(index)} className="absolute top-0 right-0 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            <button 
                                type="button" 
                                onClick={handleAddPortfolioImage} 
                                className="aspect-[4/3] flex flex-col items-center justify-center border-2 border-dashed border-white/5 hover:border-pm-gold/40 hover:bg-pm-gold/5 transition-all group"
                            >
                                <PlusIcon className="w-12 h-12 text-white/10 group-hover:text-pm-gold transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-pm-gold mt-4">Add Editorial</span>
                            </button>
                        </div>
                    </Section>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 space-y-16">
                    <div className="glass-card p-10 space-y-10">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pm-gold mb-8">Main Image</h3>
                        <ImageUploader label="" value={formData.imageUrl} onChange={handleImageChange} />
                        <p className="text-[10px] text-white/20 italic">This image will represent the model on the main directory page.</p>
                    </div>

                    <Section title="Connectivity">
                        <FormInput label="Professional Email" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
                        <FormInput label="Phone Contact" name="phone" type="tel" value={formData.phone || ''} onChange={handleChange} />
                    </Section>

                    {isAdmin && (
                        <div className="glass-card p-10 space-y-10 border-pm-gold/20">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pm-gold">System Controls</h3>
                            <div className="space-y-8">
                                <FormInput label="System Username" name="username" value={formData.username} onChange={handleChange} disabled={!isCreating} />
                                <FormInput label="System Password" name="password" value={formData.password} onChange={handleChange} />
                                <FormSelect label="Tier Level" name="level" value={formData.level || 'Débutant'} onChange={handleChange}>
                                    <option value="Débutant">New Talent</option>
                                    <option value="Pro">Elite Pro</option>
                                </FormSelect>
                                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                    <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pm-gold focus:ring-offset-2 bg-pm-dark">
                                        <input 
                                            type="checkbox"
                                            id="isPublic"
                                            name="isPublic"
                                            checked={!!formData.isPublic}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <label htmlFor="isPublic" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.isPublic ? 'translate-x-5 !bg-pm-gold' : 'translate-x-0'}`}></label>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Public Visibility</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

const Section: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div className="space-y-10">
        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 border-b border-white/5 pb-4">{title}</h2>
        <div className="space-y-10">{children}</div>
    </div>
);

const FormInput: React.FC<{label: string, name: string, value: any, onChange: any, type?: string, disabled?: boolean, placeholder?: string}> = (props) => (
    <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <input type={props.type || "text"} {...props} className="admin-input" />
    </div>
);

const FormSelect: React.FC<{label: string, name: string, value: any, onChange: any, children: React.ReactNode, disabled?: boolean}> = (props) => (
     <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <select {...props} className="admin-select">
            {props.children}
        </select>
    </div>
);

const FormTextArea: React.FC<{label: string, name: string, value: any, onChange: any, rows?: number, disabled?: boolean, placeholder?: string}> = (props) => (
    <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <textarea {...props} rows={props.rows || 3} className="admin-textarea" />
    </div>
);

export default ModelForm;