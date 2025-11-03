
import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { AppData } from '../hooks/useDataStore';
import { FashionDayEvent, Stylist, Partner, Artist } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import ImageUploader from '../components/ImageUploader';

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
                 <div className="admin-page-header">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Tableau de Bord
                        </Link>
                        <h1 className="admin-page-title">Gérer les Événements Perfect Fashion Day</h1>
                        <p className="admin-page-subtitle">Modifiez les informations pour chaque édition du PFD.</p>
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
                            renderItem={(item: FashionDayEvent, updateItem) => (
                                <div className="space-y-4">
                                    <FormInput label="Édition (Numéro)" type="number" value={item.edition} onChange={e => updateItem({...item, edition: parseInt(e.target.value, 10)})} />
                                    <FormInput label="Date (AAAA-MM-JJTHH:MM:SS)" value={item.date} onChange={e => updateItem({...item, date: e.target.value})} />
                                    <FormInput label="Thème" value={item.theme} onChange={e => updateItem({...item, theme: e.target.value})} />
                                    <FormTextArea label="Description" value={item.description} onChange={e => updateItem({...item, description: e.target.value})} />
                                    <FormInput label="Lieu" value={item.location || ''} onChange={e => updateItem({...item, location: e.target.value})} />
                                    <FormInput label="Promoteur" value={item.promoter || ''} onChange={e => updateItem({...item, promoter: e.target.value})} />

                                    <SubArrayEditor
                                        title="Stylistes"
                                        items={item.stylists || []}
                                        setItems={newStylists => updateItem({...item, stylists: newStylists})}
                                        getNewItem={() => ({ name: 'Nouveau Styliste', description: '', images: [] })}
                                        getItemTitle={stylist => stylist.name}
                                        renderItem={(stylist: Stylist, updateStylist) => (
                                            <>
                                                <FormInput label="Nom du Styliste" value={stylist.name} onChange={e => updateStylist({ ...stylist, name: e.target.value })} />
                                                <FormTextArea label="Description" value={stylist.description} onChange={e => updateStylist({ ...stylist, description: e.target.value })} />
                                                <SubArrayEditor
                                                    title="Images du Styliste"
                                                    items={stylist.images || []}
                                                    setItems={newImages => updateStylist({ ...stylist, images: newImages })}
                                                    getNewItem={() => ''}
                                                    getItemTitle={(_, index) => `Image ${index + 1}`}
                                                    renderItem={(image: string, updateImage, index) => (
                                                        <ImageUploader label={`Image ${index + 1}`} value={image} onChange={newUrl => updateImage(newUrl)} />
                                                    )}
                                                />
                                            </>
                                        )}
                                    />
                                    
                                     <FormTextArea label="Mannequins Vedettes (séparés par des virgules)" value={(item.featuredModels || []).join(', ')} onChange={e => updateItem({...item, featuredModels: e.target.value.split(',').map((s: string) => s.trim())})} />
                                     
                                     <SubArrayEditor
                                        title="Artistes"
                                        items={item.artists || []}
                                        setItems={newArtists => updateItem({...item, artists: newArtists})}
                                        getNewItem={() => ({ name: 'Nouvel Artiste', description: '', images: [] })}
                                        getItemTitle={artist => artist.name}
                                        renderItem={(artist: Artist, updateArtist) => (
                                            <>
                                                <FormInput label="Nom de l'Artiste" value={artist.name} onChange={e => updateArtist({ ...artist, name: e.target.value })} />
                                                <FormTextArea label="Description" value={artist.description} onChange={e => updateArtist({ ...artist, description: e.target.value })} />
                                                <SubArrayEditor
                                                    title="Images de l'Artiste"
                                                    items={artist.images || []}
                                                    setItems={newImages => updateArtist({ ...artist, images: newImages })}
                                                    getNewItem={() => ''}
                                                    getItemTitle={(_, index) => `Image ${index + 1}`}
                                                    renderItem={(image: string, updateImage, index) => (
                                                        <ImageUploader label={`Image ${index + 1}`} value={image} onChange={newUrl => updateImage(newUrl)} />
                                                    )}
                                                />
                                            </>
                                        )}
                                    />
                                    
                                    <SubArrayEditor
                                        title="Partenaires"
                                        items={item.partners || []}
                                        setItems={newPartners => updateItem({...item, partners: newPartners})}
                                        getNewItem={() => ({ name: 'Nouveau Partenaire', type: 'Partenaire' })}
                                        getItemTitle={partner => partner.name}
                                        renderItem={(partner: Partner, updatePartner) => (
                                            <>
                                                <FormInput label="Nom du Partenaire" value={partner.name} onChange={e => updatePartner({ ...partner, name: e.target.value })} />
                                                <FormInput label="Type de Partenariat" value={(partner as any).type} onChange={e => updatePartner({ ...partner, type: e.target.value })} />
                                            </>
                                        )}
                                    />
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
        <h2 className="admin-section-title">{title}</h2>
        <div className="space-y-4">{children}</div>
    </div>
);

const FormInput: React.FC<{label: string, value: any, onChange: any, type?: string}> = ({label, value, onChange, type = "text"}) => (
    <div>
        <label className="admin-label">{label}</label>
        <input type={type} value={value} onChange={onChange} className="admin-input" />
    </div>
);

const FormTextArea: React.FC<{label: string, value: any, onChange: any}> = ({label, value, onChange}) => (
    <div>
        <label className="admin-label">{label}</label>
        <textarea value={value} onChange={onChange} rows={4} className="admin-input admin-textarea" />
    </div>
);


const ArrayEditor: React.FC<{
    items: any[];
    setItems: (items: any[]) => void;
    renderItem: (item: any, updateItem: (newItem: any) => void, index: number) => React.ReactNode;
    getNewItem: () => any;
    getItemTitle: (item: any) => string;
}> = ({ items, setItems, renderItem, getNewItem, getItemTitle }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

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
