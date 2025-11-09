
import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { AppData } from '../hooks/useDataStore';
import { Testimonial, Partner, FAQCategory, FAQItem } from '../../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import ImageUploader from '../components/ImageUploader';

type EditableData = Pick<AppData, 'contactInfo' | 'siteConfig' | 'siteImages' | 'socialLinks' | 'agencyPartners' | 'testimonials' | 'faqData' | 'apiKeys'>;

const AdminSettings: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [localData, setLocalData] = useState<EditableData | null>(null);

    useEffect(() => {
        if (isInitialized && data) {
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

    const handleSimpleChange = (section: keyof EditableData, key: string, value: any) => {
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
                            <ImageUploader label="Logo" value={localData.siteConfig.logo} onChange={value => handleSimpleChange('siteConfig', 'logo', value)} />
                            <ImageUploader label="Image Héros (Accueil)" value={localData.siteImages.hero} onChange={value => handleSimpleChange('siteImages', 'hero', value)} />
                            <ImageUploader label="Image 'À Propos' (Accueil)" value={localData.siteImages.about} onChange={value => handleSimpleChange('siteImages', 'about', value)} />
                            <ImageUploader label="Fond 'Fashion Day' (Accueil)" value={localData.siteImages.fashionDayBg} onChange={value => handleSimpleChange('siteImages', 'fashionDayBg', value)} />
                            <ImageUploader label="Image 'Notre Histoire' (Agence)" value={localData.siteImages.agencyHistory} onChange={value => handleSimpleChange('siteImages', 'agencyHistory', value)} />
                            <ImageUploader label="Fond 'Classroom'" value={localData.siteImages.classroomBg} onChange={value => handleSimpleChange('siteImages', 'classroomBg', value)} />
                            <ImageUploader label="Affiche 'Casting'" value={localData.siteImages.castingBg} onChange={value => handleSimpleChange('siteImages', 'castingBg', value)} />
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
                            <ArrayEditor 
                                items={localData.agencyPartners}
                                setItems={newItems => setLocalData(p => ({...p!, agencyPartners: newItems}))}
                                renderItem={(item: Partner, updateItem) => (
                                    <FormInput label="Nom du partenaire" value={item.name} onChange={e => updateItem({ ...item, name: e.target.value })} />
                                )}
                                getNewItem={() => ({ name: 'Nouveau Partenaire' })}
                                getItemTitle={item => item.name}
                            />
                        </div>
                    </div>
                    
                     <div className="admin-section-wrapper">
                        <h2 className="admin-section-title">Témoignages</h2>
                        <div className="space-y-4">
                            <ArrayEditor 
                                items={localData.testimonials}
                                setItems={newItems => setLocalData(p => ({...p!, testimonials: newItems}))}
                                renderItem={(item: Testimonial, updateItem) => (
                                    <>
                                        <FormInput label="Nom" value={item.name} onChange={e => updateItem({ ...item, name: e.target.value })} />
                                        <FormInput label="Rôle" value={item.role} onChange={e => updateItem({ ...item, role: e.target.value })} />
                                        <ImageUploader label="Photo" value={item.imageUrl} onChange={value => updateItem({ ...item, imageUrl: value })} />
                                        <FormTextArea 
                                            label="Citation" 
                                            value={item.quote} 
                                            onChange={e => updateItem({ ...item, quote: e.target.value })}
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
                        <ArrayEditor 
                            items={localData.faqData}
                            setItems={newItems => setLocalData(p => ({...p!, faqData: newItems}))}
                            renderItem={(item: FAQCategory, updateItem) => (
                                <>
                                    <FormInput label="Catégorie" value={item.category} onChange={e => updateItem({ ...item, category: e.target.value })} />
                                    <SubArrayEditor
                                        title="Questions"
                                        items={item.items || []}
                                        setItems={newItems => updateItem({ ...item, items: newItems })}
                                        getNewItem={() => ({ question: 'Nouvelle Question ?', answer: 'Réponse...' })}
                                        getItemTitle={subItem => subItem.question}
                                        renderItem={(faq: FAQItem, updateFaq) => (
                                            <>
                                                <FormInput label="Question" value={faq.question} onChange={e => updateFaq({ ...faq, question: e.target.value })} />
                                                <FormTextArea label="Réponse" value={faq.answer} onChange={e => updateFaq({ ...faq, answer: e.target.value })} />
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
    );
};

const FormInput: React.FC<{label: string, value: any, onChange: any}> = ({label, value, onChange}) => (
    <div>
        <label className="admin-label">{label}</label>
        <input type="text" value={value} onChange={onChange} className="admin-input" />
    </div>
);
const FormTextArea: React.FC<{label: string, value: any, onChange: any}> = ({label, value, onChange}) => (
    <div>
        <label className="admin-label">{label}</label>
        <textarea value={value} onChange={onChange} rows={5} className="admin-input admin-textarea" />
    </div>
);

const ArrayEditor: React.FC<{
    items: any[];
    setItems: (items: any[]) => void;
    renderItem: (item: any, updateItem: (newItem: any) => void, index: number) => React.ReactNode;
    getNewItem: () => any;
    getItemTitle: (item: any) => string;
}> = ({ items, setItems, renderItem, getNewItem, getItemTitle }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleUpdateItem = (index: number, newItem: any) => {
        const newItems = [...items];
        newItems[index] = newItem;
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
                            {renderItem(item, (newItem) => handleUpdateItem(index, newItem), index)}
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

const SubArrayEditor: React.FC<{ title: string } & Omit<React.ComponentProps<typeof ArrayEditor>, 'items' | 'setItems'> & { items: any[], setItems: (items: any[]) => void }> = ({ title, ...props }) => (
    <div className="p-3 bg-black/50 border border-pm-off-white/10 rounded-md">
        <h4 className="text-md font-bold text-pm-gold/80 mb-3">{title}</h4>
        <ArrayEditor {...props} />
    </div>
);


export default AdminSettings;
