import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { AppData } from '../hooks/useDataStore';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

type EditableData = Omit<AppData, 'models' | 'articles' | 'courseData'>;

const AdminSettings: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [localData, setLocalData] = useState<EditableData | null>(null);

    useEffect(() => {
        if (isInitialized && data) {
            setLocalData(JSON.parse(JSON.stringify({
                siteConfig: data.siteConfig,
                navLinks: data.navLinks,
                socialLinks: data.socialLinks,
                agencyTimeline: data.agencyTimeline,
                agencyInfo: data.agencyInfo,
                modelDistinctions: data.modelDistinctions,
                agencyServices: data.agencyServices,
                agencyAchievements: data.agencyAchievements,
                agencyPartners: data.agencyPartners,
                testimonials: data.testimonials,
            })));
        }
    }, [isInitialized, data]);
    
    const handleSave = () => {
        if (!data || !localData) return;
        if (window.confirm("Sauvegarder tous les paramètres du site ?")) {
            const newData: AppData = { ...data, ...localData };
            saveData(newData);
            alert("Paramètres sauvegardés !");
        }
    };

    const handleSimpleChange = (section: keyof EditableData, key: string, value: any) => {
        if (!localData) return;
        setLocalData(prev => ({
            ...prev!,
            [section]: {
                ...(prev![section] as object),
                [key]: value
            }
        }));
    };
    
    if (!localData || !data) {
        return <div className="min-h-screen flex items-center justify-center text-pm-gold">Chargement des paramètres...</div>;
    }

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Paramètres du Site" />
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Dashboard
                        </Link>
                        <h1 className="text-4xl font-playfair text-pm-gold">Paramètres du Site</h1>
                    </div>
                    <button onClick={handleSave} className="px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-lg shadow-pm-gold/30">
                        Sauvegarder les Changements
                    </button>
                </div>

                <div className="space-y-8">
                    <SectionWrapper title="Configuration Générale">
                        <FormInput label="URL du Logo" value={localData.siteConfig.logo} onChange={e => handleSimpleChange('siteConfig', 'logo', e.target.value)} />
                    </SectionWrapper>
                    
                     <SectionWrapper title="Réseaux Sociaux">
                        <FormInput label="URL Facebook" value={localData.socialLinks.facebook} onChange={e => handleSimpleChange('socialLinks', 'facebook', e.target.value)} />
                        <FormInput label="URL Instagram" value={localData.socialLinks.instagram} onChange={e => handleSimpleChange('socialLinks', 'instagram', e.target.value)} />
                        <FormInput label="URL YouTube" value={localData.socialLinks.youtube} onChange={e => handleSimpleChange('socialLinks', 'youtube', e.target.value)} />
                    </SectionWrapper>
                    
                    <SectionWrapper title="Partenaires de l'Agence">
                        <FormTextArea 
                            label="Liste des partenaires (un par ligne)" 
                            value={localData.agencyPartners.join('\n')} 
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLocalData(p => ({...p!, agencyPartners: e.target.value.split('\n')}))} 
                        />
                    </SectionWrapper>
                    
                     <SectionWrapper title="Témoignages">
                        <ArrayEditor 
                            items={localData.testimonials}
                            setItems={newItems => setLocalData(p => ({...p!, testimonials: newItems}))}
                            renderItem={(item, onChange) => (
                                <>
                                    <FormInput label="Nom" value={item.name} onChange={e => onChange('name', e.target.value)} />
                                    <FormInput label="Rôle" value={item.role} onChange={e => onChange('role', e.target.value)} />
                                    <FormInput label="URL Image" value={item.imageUrl} onChange={e => onChange('imageUrl', e.target.value)} />
                                    <FormTextArea label="Citation" value={item.quote} onChange={e => onChange('quote', e.target.value)} />
                                </>
                            )}
                            getNewItem={() => ({ name: 'Nouveau Témoin', role: 'Rôle', quote: '', imageUrl: ''})}
                            getItemTitle={item => item.name}
                        />
                    </SectionWrapper>
                </div>
            </div>
        </div>
    );
};

const SectionWrapper: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-black border border-pm-gold/20 p-6 rounded-lg shadow-lg shadow-black/30">
        <h2 className="text-2xl font-playfair text-pm-gold mb-6 border-b border-pm-gold/20 pb-3">{title}</h2>
        <div className="space-y-4">{children}</div>
    </div>
);

const FormInput: React.FC<{label: string, value: any, onChange: any}> = ({label, value, onChange}) => (
    <div>
        <label className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <input type="text" value={value} onChange={onChange} className="admin-input" />
    </div>
);
const FormTextArea: React.FC<{label: string, value: any, onChange: any}> = ({label, value, onChange}) => (
    <div>
        <label className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <textarea value={value} onChange={onChange} rows={5} className="admin-input admin-textarea" />
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
                    <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full p-3 text-left font-bold flex justify-between items-center hover:bg-pm-gold/5">
                        <span>{getItemTitle(item)}</span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
                    </button>
                    {openIndex === index && (
                        <div className="p-4 border-t border-pm-off-white/10 space-y-3 bg-pm-dark">
                            {renderItem(item, (key, value) => handleItemChange(index, key, value), index)}
                            <div className="text-right pt-2">
                                <button onClick={() => handleDeleteItem(index)} className="text-red-500/80 hover:text-red-500 text-sm inline-flex items-center gap-1"><TrashIcon className="w-4 h-4" /> Supprimer</button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
            <button onClick={handleAddItem} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold text-xs font-bold uppercase tracking-widest rounded-full hover:bg-pm-gold hover:text-pm-dark mt-4">
                <PlusIcon className="w-4 h-4"/> Ajouter un élément
            </button>
        </div>
    );
};


export default AdminSettings;