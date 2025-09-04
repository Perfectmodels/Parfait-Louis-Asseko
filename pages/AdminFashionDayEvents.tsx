
import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { AppData } from '../hooks/useDataStore';
import { FashionDayEvent, Stylist, Partner } from '../types';
import SEO from '../components/SEO';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import { ChevronLeftIcon, TrashIcon, PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import ImageInput from '../components/ImageInput';

type EditableData = Pick<AppData, 'fashionDayEvents'>;

const AdminFashionDayEvents: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [localData, setLocalData] = useState<EditableData | null>(null);

    useEffect(() => {
        if (isInitialized && data) {
            setLocalData(JSON.parse(JSON.stringify({ fashionDayEvents: data.fashionDayEvents })));
        }
    }, [isInitialized, data]);

    const handleSave = () => {
        if (!data || !localData) return;
        const newData: AppData = { ...data, ...localData };
        saveData(newData);
        alert("Événements Fashion Day enregistrés avec succès.");
    };

    if (!localData) {
        return <div className="min-h-screen flex items-center justify-center text-pm-gold">Chargement...</div>;
    }

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Gérer les Événements PFD" noIndex />
            <div className="container mx-auto px-6">
                 <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Tableau de Bord
                        </Link>
                        <h1 className="text-4xl font-playfair text-pm-gold">Gérer les Événements Perfect Fashion Day</h1>
                    </div>
                    <button onClick={handleSave} className="px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-lg shadow-pm-gold/30">
                        Sauvegarder les Changements
                    </button>
                </div>

                <div className="space-y-8">
                    <SectionWrapper title="Éditions du Perfect Fashion Day">
                        <ArrayEditor 
                            items={localData.fashionDayEvents}
                            setItems={newItems => setLocalData(p => ({...p!, fashionDayEvents: newItems}))}
                            renderItem={(item: FashionDayEvent, onChange) => (
                                <div className="space-y-4">
                                    <FormInput label="Édition (Numéro)" type="number" value={item.edition} onChange={e => onChange('edition', parseInt(e.target.value, 10))} />
                                    <FormInput label="Date" value={item.date} onChange={e => onChange('date', e.target.value)} />
                                    <FormInput label="Thème" value={item.theme} onChange={e => onChange('theme', e.target.value)} />
                                    <FormTextArea label="Description" value={item.description} onChange={e => onChange('description', e.target.value)} />
                                    <FormInput label="Lieu" value={item.location || ''} onChange={e => onChange('location', e.target.value)} />
                                    <FormInput label="MC" value={item.mc || ''} onChange={e => onChange('mc', e.target.value)} />
                                    <FormInput label="Promoteur" value={item.promoter || ''} onChange={e => onChange('promoter', e.target.value)} />

                                    <SubArrayEditor
                                        title="Stylistes"
                                        items={item.stylists || []}
                                        setItems={newStylists => onChange('stylists', newStylists)}
                                        getNewItem={() => ({ name: 'Nouveau Styliste', description: '', images: [] })}
                                        getItemTitle={stylist => stylist.name}
                                        renderItem={(stylist: Stylist, onStylistChange) => (
                                            <>
                                                <FormInput label="Nom du Styliste" value={stylist.name} onChange={e => onStylistChange('name', e.target.value)} />
                                                <FormTextArea label="Description" value={stylist.description} onChange={e => onStylistChange('description', e.target.value)} />
                                                <FormTextArea label="Images (URLs, une par ligne)" value={(stylist.images || []).join('\n')} onChange={e => onStylistChange('images', e.target.value.split('\n'))} />
                                            </>
                                        )}
                                    />
                                    
                                     <FormTextArea label="Mannequins Vedettes (séparés par des virgules)" value={(item.featuredModels || []).join(', ')} onChange={e => onChange('featuredModels', e.target.value.split(',').map((s: string) => s.trim()))} />
                                     <FormTextArea label="Artistes (un par ligne)" value={(item.artists || []).join('\n')} onChange={e => onChange('artists', e.target.value.split('\n'))} />
                                </div>
                            )}
                            getNewItem={() => ({ edition: (localData.fashionDayEvents.length + 1), date: '', theme: 'Nouveau Thème', description: '', stylists: [], featuredModels: [], artists: [], partners: [] })}
                            getItemTitle={item => `Édition ${item.edition}: "${item.theme}"`}
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

const FormInput: React.FC<{label: string, value: any, onChange: any, type?: string}> = ({label, value, onChange, type = "text"}) => (
    <div>
        <label className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <input type={type} value={value} onChange={onChange} className="admin-input" />
    </div>
);

const FormTextArea: React.FC<{label: string, value: any, onChange: any}> = ({label, value, onChange}) => (
    <div>
        <label className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <textarea value={value} onChange={onChange} rows={4} className="admin-input admin-textarea" />
    </div>
);


const ArrayEditor: React.FC<{
    items: any[];
    setItems: (items: any[]) => void;
    renderItem: (item: any, onChange: (key: string, value: any) => void, index: number) => React.ReactNode;
    getNewItem: () => any;
    getItemTitle: (item: any) => string;
}> = ({ items, setItems, renderItem, getNewItem, getItemTitle }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

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
                        <span className="truncate pr-4">{getItemTitle(item)}</span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`} />
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
                <PlusIcon className="w-4 h-4"/> Ajouter une Édition
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


export default AdminFashionDayEvents;
