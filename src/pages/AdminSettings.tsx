import React, { useState, useEffect } from 'react';
<<<<<<< HEAD:src/pages/admin/AdminSettings.tsx
import { useData } from '../../../contexts/DataContext';
import { AppData } from '../../../types';
import { Testimonial, Partner, FAQCategory, FAQItem } from '../../../types';
import SEO from '../../../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import ImageUploader from '../../../components/ImageUploader';
=======
import { useData } from '../contexts/DataContext';
import { AppData } from '../hooks/useDataStore';
import { Testimonial, Partner, FAQCategory, FAQItem, ApiKeys } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import ImageInput from '../components/icons/ImageInput';
>>>>>>> 95ce282020fa4c741066597c693e1256e3332cb0:src/pages/AdminSettings.tsx

// FIX: Removed beginner-related data types from the editable data definition.
type EditableData = Pick<AppData, 'contactInfo' | 'siteConfig' | 'siteImages' | 'socialLinks' | 'agencyPartners' | 'testimonials' | 'faqData' | 'apiKeys'>;

const AdminSettings: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [localData, setLocalData] = useState<EditableData | null>(null);

    useEffect(() => {
        if (isInitialized && data) {
            // FIX: Removed deprecated beginner-related properties from destructuring.
            const { 
                contactInfo, siteConfig, siteImages, socialLinks, agencyPartners, 
                testimonials, faqData, apiKeys
            } = data;
            setLocalData(JSON.parse(JSON.stringify({ 
                contactInfo, siteConfig, siteImages, socialLinks, agencyPartners, 
                testimonials, faqData, apiKeys 
            })));
        }
    }, [isInitialized, data]);
    
    const handleSave = () => {
        if (!data || !localData) return;
        const newData: AppData = { ...data, ...localData };
        saveData(newData);
        alert("Changements enregistrés avec succès dans la base de données.");
    };

    const handleSimpleChange = (section: keyof EditableData, key: string, value: string) => {
        if (!localData) return;
        setLocalData(prev => {
            if (!prev) return null;
            const sectionData = prev[section];
            if (typeof sectionData === 'object' && sectionData !== null) {
                return {
                    ...prev,
                    [section]: {
                        ...(sectionData as object),
                        [key]: value
                    }
                };
            }
            return prev;
        });
    };
    
    if (!localData || !data) {
        return <div className="min-h-screen flex items-center justify-center text-pm-gold">Chargement des paramètres...</div>;
    }

    return (
        <>
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Paramètres du Site" noIndex />
            <div className="container mx-auto px-6">
                <div className="admin-page-header">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Dashboard
                        </Link>
                        <h1 className="admin-page-title">Paramètres du Site</h1>
                        <p className="admin-page-subtitle">Modifiez les informations globales, les images et les configurations.</p>
                    </div>
                    <button onClick={handleSave} className="px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-lg shadow-pm-gold/30">
                        Sauvegarder les Changements
                    </button>
                </div>

                <div className="space-y-8">
                    <div className="admin-section-wrapper">
                        <h2 className="admin-section-title">Informations de Contact</h2>
                        <div className="space-y-4">
                            <FormInput label="Email public" value={localData.contactInfo.email} onChange={e => handleSimpleChange('contactInfo', 'email', e.target.value)} />
                            <FormInput label="Téléphone" value={localData.contactInfo.phone} onChange={e => handleSimpleChange('contactInfo', 'phone', e.target.value)} />
                            <FormInput label="Adresse" value={localData.contactInfo.address} onChange={e => handleSimpleChange('contactInfo', 'address', e.target.value)} />
                        </div>
                    </div>

                    <div className="admin-section-wrapper">
                        <h2 className="admin-section-title">Clés API</h2>
                        <div className="space-y-4">
                            <FormInput label="Clé API Brevo (pour les emails)" value={localData.apiKeys.brevoApiKey || ''} onChange={e => handleSimpleChange('apiKeys', 'brevoApiKey', e.target.value)} />
                            <FormInput label="Clé API ImgBB (pour les images)" value={localData.apiKeys.imgbbApiKey || ''} onChange={e => handleSimpleChange('apiKeys', 'imgbbApiKey', e.target.value)} />
                        </div>
                    </div>

                    <div className="admin-section-wrapper">
                        <h2 className="admin-section-title">Images du Site</h2>
                        <div className="space-y-4">
                            <ImageInput label="Logo" value={localData.siteConfig.logo} onChange={value => handleSimpleChange('siteConfig', 'logo', value)} />
                            <ImageInput label="Image Héros (Accueil)" value={localData.siteImages.hero} onChange={value => handleSimpleChange('siteImages', 'hero', value)} />
                            <ImageInput label="Image 'À Propos' (Accueil)" value={localData.siteImages.about} onChange={value => handleSimpleChange('siteImages', 'about', value)} />
                            <ImageInput label="Fond 'Fashion Day' (Accueil)" value={localData.siteImages.fashionDayBg} onChange={value => handleSimpleChange('siteImages', 'fashionDayBg', value)} />
                            <ImageInput label="Image 'Notre Histoire' (Agence)" value={localData.siteImages.agencyHistory} onChange={value => handleSimpleChange('siteImages', 'agencyHistory', value)} />
                            <ImageInput label="Fond 'Classroom'" value={localData.siteImages.classroomBg} onChange={value => handleSimpleChange('siteImages', 'classroomBg', value)} />
                            <ImageInput label="Affiche 'Casting'" value={localData.siteImages.castingBg} onChange={value => handleSimpleChange('siteImages', 'castingBg', value)} />
                        </div>
                    </div>
                    
                     <div className="admin-section-wrapper">
                        <h2 className="admin-section-title">Réseaux Sociaux</h2>
                        <div className="space-y-4">
                            <FormInput label="URL Facebook" value={localData.socialLinks.facebook} onChange={e => handleSimpleChange('socialLinks', 'facebook', e.target.value)} />
                            <FormInput label="URL Instagram" value={localData.socialLinks.instagram} onChange={e => handleSimpleChange('socialLinks', 'instagram', e.target.value)} />
                            <FormInput label="URL YouTube" value={localData.socialLinks.youtube} onChange={e => handleSimpleChange('socialLinks', 'youtube', e.target.value)} />
                        </div>
                    </div>
                    
                    <div className="admin-section-wrapper">
                        <h2 className="admin-section-title">Partenaires de l'Agence</h2>
                        <div className="space-y-4">
                            <ArrayEditor<Partner>
                                items={localData.agencyPartners}
                                setItems={newItems => setLocalData(p => ({...p!, agencyPartners: newItems}))}
<<<<<<< HEAD:src/pages/admin/AdminSettings.tsx
                                renderItem={(item, updateItem) => (
                                    <FormInput 
                                        label="Nom du partenaire" 
                                        value={item.name} 
                                        onChange={e => updateItem({ ...item, name: e.target.value })} 
                                    />
=======
                                renderItem={(item: Partner, onChange) => (
                                    <>
                                        <FormInput label="Nom du partenaire" value={item.name} onChange={e => onChange('name', e.target.value)} />
                                    </>
>>>>>>> 95ce282020fa4c741066597c693e1256e3332cb0:src/pages/AdminSettings.tsx
                                )}
                                getNewItem={() => ({ name: 'Nouveau Partenaire' })}
                                getItemTitle={item => item.name}
                            />
                        </div>
                    </div>
                    
                     <div className="admin-section-wrapper">
                        <h2 className="admin-section-title">Témoignages</h2>
                        <div className="space-y-4">
                            <ArrayEditor<Testimonial>
                                items={localData.testimonials}
                                setItems={newItems => setLocalData(p => ({...p!, testimonials: newItems}))}
<<<<<<< HEAD:src/pages/admin/AdminSettings.tsx
                                renderItem={(item, updateItem) => (
                                    <>
                                        <FormInput 
                                            label="Nom" 
                                            value={item.name} 
                                            onChange={e => updateItem({ ...item, name: e.target.value })} 
                                        />
                                        <FormInput 
                                            label="Rôle" 
                                            value={item.role} 
                                            onChange={e => updateItem({ ...item, role: e.target.value })} 
                                        />
                                        <ImageUploader 
                                            label="Photo" 
                                            value={item.imageUrl} 
                                            onChange={value => updateItem({ ...item, imageUrl: value })} 
                                        />
=======
                                renderItem={(item: Testimonial, onChange) => (
                                    <>
                                        <FormInput label="Nom" value={item.name} onChange={e => onChange('name', e.target.value)} />
                                        <FormInput label="Rôle" value={item.role} onChange={e => onChange('role', e.target.value)} />
                                        <ImageInput label="Photo" value={item.imageUrl} onChange={value => onChange('imageUrl', value)} />
>>>>>>> 95ce282020fa4c741066597c693e1256e3332cb0:src/pages/AdminSettings.tsx
                                        <FormTextArea 
                                            label="Citation" 
                                            value={item.quote} 
                                            onChange={e => onChange('quote', e.target.value)}
                                        />
                                    </>
                                )}
                                getNewItem={() => ({ name: 'Nouveau Témoin', role: 'Rôle', quote: '', imageUrl: ''})}
                                getItemTitle={item => item.name}
                            />
                        </div>
                    </div>

                    <div className="admin-section-wrapper">
                        <h2 className="admin-section-title">FAQ (Foire Aux Questions)</h2>
                        <ArrayEditor<FAQCategory>
                            items={localData.faqData}
                            setItems={newItems => setLocalData(p => ({...p!, faqData: newItems}))}
<<<<<<< HEAD:src/pages/admin/AdminSettings.tsx
                            renderItem={(item, updateItem) => (
                                <>
                                    <FormInput 
                                        label="Catégorie" 
                                        value={item.category} 
                                        onChange={e => updateItem({ ...item, category: e.target.value })} 
                                    />
                                    <SubArrayEditor<FAQItem>
=======
                            renderItem={(item: FAQCategory, onChange) => (
                                <>
                                    <FormInput label="Catégorie" value={item.category} onChange={e => onChange('category', e.target.value)} />
                                    <SubArrayEditor
>>>>>>> 95ce282020fa4c741066597c693e1256e3332cb0:src/pages/AdminSettings.tsx
                                        title="Questions"
                                        items={item.items || []}
                                        setItems={newItems => onChange('items', newItems)}
                                        getNewItem={() => ({ question: 'Nouvelle Question ?', answer: 'Réponse...' })}
<<<<<<< HEAD:src/pages/admin/AdminSettings.tsx
                                        getItemTitle={subItem => subItem.question}
                                        renderItem={(faq, updateFaq) => (
                                            <>
                                                <FormInput 
                                                    label="Question" 
                                                    value={faq.question} 
                                                    onChange={e => updateFaq({ ...faq, question: e.target.value })} 
                                                />
                                                <FormTextArea 
                                                    label="Réponse" 
                                                    value={faq.answer} 
                                                    onChange={e => updateFaq({ ...faq, answer: e.target.value })} 
                                                />
=======
                                        getItemTitle={item => item.question}
                                        renderItem={(faq: FAQItem, onFaqChange) => (
                                            <>
                                                <FormInput label="Question" value={faq.question} onChange={e => onFaqChange('question', e.target.value)} />
                                                <FormTextArea label="Réponse" value={faq.answer} onChange={e => onFaqChange('answer', e.target.value)} />
>>>>>>> 95ce282020fa4c741066597c693e1256e3332cb0:src/pages/AdminSettings.tsx
                                            </>
                                        )}
                                    />
                                </>
                            )}
                            getNewItem={() => ({ category: 'Nouvelle Catégorie', items: [] })}
                            getItemTitle={item => item.category}
                        />
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

const FormInput: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({label, value, onChange}) => (
    <div>
        <label className="admin-label">{label}</label>
        <input type="text" value={value} onChange={onChange} className="admin-input" />
    </div>
);
const FormTextArea: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void}> = ({label, value, onChange}) => (
    <div>
        <label className="admin-label">{label}</label>
        <textarea value={value} onChange={onChange} rows={5} className="admin-input admin-textarea" />
    </div>
);

<<<<<<< HEAD:src/pages/admin/AdminSettings.tsx
interface ArrayEditorProps<T> {
    items: T[];
    setItems: (items: T[]) => void;
    renderItem: (item: T, updateItem: (newItem: T) => void, index: number) => React.ReactNode;
    getNewItem: () => T;
    getItemTitle: (item: T) => string;
}

interface SubArrayEditorProps<T> {
    title: string;
    items: T[];
    setItems: (items: T[]) => void;
    renderItem: (item: T, updateItem: (newItem: T) => void, index: number) => React.ReactNode;
    getNewItem: () => T;
    getItemTitle: (item: T) => string;
}

const ArrayEditor = <T extends object>({ 
    items, 
    setItems, 
    renderItem, 
    getNewItem, 
    getItemTitle 
}: ArrayEditorProps<T>) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleUpdateItem = (index: number, newItem: T) => {
=======
const ArrayEditor: React.FC<{
    items: any[];
    setItems: (items: any[]) => void;
    renderItem: (item: any, onChange: (key: string, value: any) => void, index: number) => React.ReactNode;
    getNewItem: () => any;
    getItemTitle: (item: any) => string;
}> = ({ items, setItems, renderItem, getNewItem, getItemTitle }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleItemChange = (index: number, key: string, value: any) => {
>>>>>>> 95ce282020fa4c741066597c693e1256e3332cb0:src/pages/AdminSettings.tsx
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [key]: value };
        setItems(newItems);
    };

    const handleAddItem = (): void => {
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
                <PlusIcon className="w-4 h-4"/> Ajouter un élément
            </button>
        </div>
    );
};

const SubArrayEditor = <T extends object>({ 
    title, 
    items, 
    setItems, 
    renderItem, 
    getNewItem, 
    getItemTitle 
}: SubArrayEditorProps<T>) => (
    <div className="p-3 bg-black/50 border border-pm-off-white/10 rounded-md">
        <h4 className="text-md font-bold text-pm-gold/80 mb-3">{title}</h4>
        <ArrayEditor<T>
            items={items}
            setItems={setItems}
            renderItem={renderItem}
            getNewItem={getNewItem}
            getItemTitle={getItemTitle}
        />
    </div>
);


export default AdminSettings;


