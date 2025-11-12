import React, { useState, useEffect } from 'react';
<<<<<<< HEAD:src/pages/admin/AdminFashionDayEvents.tsx
import { useData } from '../../contexts/DataContext';
import { FashionDayEvent } from '../../types';
=======
import { useData } from '../contexts/DataContext';
import { AppData } from '../hooks/useDataStore';
import { FashionDayEvent, Stylist, Partner, Artist } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import ImageUploader from '../components/ImageUploader';
>>>>>>> 95ce282020fa4c741066597c693e1256e3332cb0:pages/AdminFashionDayEvents.tsx

interface Stylist {
    name: string;
    description: string;
    images: string[];
}

interface FeaturedModel {
    name: string;
    bio: string;
    imageUrl: string;
}

interface Artist {
    name: string;
    description: string;
    images: string[];
}

interface Partner {
    type: string;
    name: string;
}
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import ImageUploader from '../../components/ImageUploader';

interface EditableData {
    fashionDayEvents: FashionDayEvent[];
}

const AdminFashionDayEvents: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [localData, setLocalData] = useState<EditableData | null>(null);

    const getNewEvent = (): FashionDayEvent & { id: string } => ({
        id: `event-${Date.now()}`,
        edition: 0,
        date: new Date().toISOString().split('T')[0],
        theme: 'Nouvel événement',
        description: '',
        location: '',
        mc: '',
        promoter: '',
        stylists: [],
        featuredModels: [],
        artists: [],
        partners: []
    });

    useEffect(() => {
        if (isInitialized && data) {
            setLocalData(JSON.parse(JSON.stringify({ fashionDayEvents: data.fashionDayEvents || [] })));
        }
    }, [isInitialized, data]);

    const handleSave = async () => {
        if (!data || !localData) return;
        await saveData({ ...data, fashionDayEvents: localData.fashionDayEvents });
    };

    if (!localData) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <SEO title="Admin - Événements Fashion Day" />
            
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <Link to="/admin" className="flex items-center text-blue-600 hover:text-blue-800">
                        <ChevronLeftIcon className="w-5 h-5 mr-1" />
                        Retour
                    </Link>
                    <h1 className="text-2xl font-bold">Gestion des Événements Fashion Day</h1>
                    <button 
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Enregistrer
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <ArrayEditor<FashionDayEvent>
                        items={localData.fashionDayEvents}
                        setItems={newItems => setLocalData({...localData, fashionDayEvents: newItems})}
                        getNewItem={getNewEvent}
                        renderItem={(item, updateItem) => (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold mb-2">
                                    Édition {item.edition} - {item.theme}
                                </h3>
                                <div className="text-sm text-gray-500">
                                    {new Date(item.date).toLocaleDateString('fr-FR')} - {item.location || 'Lieu non défini'}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Édition</label>
                                        <input
                                            type="number"
                                            value={item.edition}
                                            onChange={(e) => updateItem({...item, edition: parseInt(e.target.value)})}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Date</label>
                                        <input
                                            type="date"
                                            value={item.date}
                                            onChange={(e) => updateItem({...item, date: e.target.value})}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Thème</label>
                                    <input
                                        type="text"
                                        value={item.theme}
                                        onChange={(e) => updateItem({...item, theme: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        value={item.description}
                                        onChange={(e) => updateItem({...item, description: e.target.value})}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Lieu</label>
                                    <input
                                        type="text"
                                        value={item.location}
                                        onChange={(e) => updateItem({...item, location: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">MC</label>
                                    <input
                                        type="text"
                                        value={item.mc}
                                        onChange={(e) => updateItem({...item, mc: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Promoteur</label>
                                    <input
                                        type="text"
                                        value={item.promoter}
                                        onChange={(e) => updateItem({...item, promoter: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-medium">Stylistes</h3>
                                    <ArrayEditor<Stylist>
                                        items={item.stylists || []}
                                        setItems={(stylists) => updateItem({...item, stylists})}
                                        getNewItem={() => ({
                                            name: '',
                                            description: '',
                                            images: []
                                        } as Stylist)}
                                        renderItem={(stylist, updateStylist) => (
                                            <div className="space-y-4 p-4 bg-gray-50 rounded">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Nom du styliste</label>
                                                    <input
                                                        type="text"
                                                        value={stylist.name}
                                                        onChange={(e) => updateStylist({...stylist, name: e.target.value})}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Photo du styliste</label>
                                                    <ImageUploader
                                                        onUploadComplete={(url) => updateStylist({...stylist, imageUrl: url})}
                                                        storagePath="fashion-day-events/stylists"
                                                        currentImageUrl={stylist.imageUrl}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Biographie</label>
                                                    <textarea
                                                        value={stylist.bio}
                                                        onChange={(e) => updateStylist({...stylist, bio: e.target.value})}
                                                        rows={2}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    />
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-medium">Modèles vedettes</h3>
                                    <ArrayEditor<FeaturedModel>
                                        items={item.featuredModels?.map(m => ({
                                            name: typeof m === 'string' ? m : m.name || '',
                                            bio: typeof m === 'string' ? '' : m.bio || '',
                                            imageUrl: typeof m === 'string' ? '' : m.imageUrl || ''
                                        } as FeaturedModel)) || []}
                                        setItems={(models) => updateItem({...item, featuredModels: models})}
                                        getNewItem={() => ({
                                            name: '',
                                            bio: '',
                                            imageUrl: ''
                                        } as FeaturedModel)}
                                        renderItem={(model, updateModel) => (
                                            <div className="space-y-4 p-4 bg-gray-50 rounded">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Nom du modèle</label>
                                                    <input
                                                        type="text"
                                                        value={model.name}
                                                        onChange={(e) => updateModel({...model, name: e.target.value})}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Photo du modèle</label>
                                                    <ImageUploader
                                                        onUploadComplete={(url) => updateModel({...model, imageUrl: url})}
                                                        storagePath="fashion-day-events/models"
                                                        currentImageUrl={model.imageUrl}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Biographie</label>
                                                    <textarea
                                                        value={model.bio}
                                                        onChange={(e) => updateModel({...model, bio: e.target.value})}
                                                        rows={2}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    />
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-medium">Artistes</h3>
                                    <ArrayEditor<Artist>
                                        items={item.artists || []}
                                        setItems={(artists) => updateItem({...item, artists})}
                                        getNewItem={() => ({
                                            name: '',
                                            description: '',
                                            images: []
                                        } as Artist)}
                                        renderItem={(artist, updateArtist) => (
                                            <div className="space-y-4 p-4 bg-gray-50 rounded">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Nom de l'artiste</label>
                                                        <input
                                                            type="text"
                                                            value={artist.name}
                                                            onChange={(e) => updateArtist({...artist, name: e.target.value})}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                                        <input
                                                            type="text"
                                                            value={artist.description}
                                                            onChange={(e) => updateArtist({...artist, description: e.target.value})}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                            placeholder="Description de l'artiste"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Photos de l'artiste</label>
                                                    <div className="mt-2 space-y-2">
                                                        {(artist.images || []).map((image, idx) => (
                                                            <div key={idx} className="flex items-center space-x-2">
                                                                <input
                                                                    type="text"
                                                                    value={image}
                                                                    onChange={(e) => {
                                                                        const newImages = [...(artist.images || [])];
                                                                        newImages[idx] = e.target.value;
                                                                        updateArtist({...artist, images: newImages});
                                                                    }}
                                                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                                    placeholder="URL de l'image"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newImages = (artist.images || []).filter((_, i) => i !== idx);
                                                                        updateArtist({...artist, images: newImages});
                                                                    }}
                                                                    className="text-red-500 hover:text-red-700"
                                                                >
                                                                    <TrashIcon className="h-5 w-5" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newImages = [...(artist.images || []), ''];
                                                                updateArtist({...artist, images: newImages});
                                                            }}
                                                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" />
                                                            Ajouter une image
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    />
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-medium">Partenaires</h3>
                                    <ArrayEditor<Partner>
                                        items={(item.partners || []).map(p => ({
                                            type: typeof p === 'string' ? '' : p.type || '',
                                            name: typeof p === 'string' ? p : p.name || ''
                                        } as Partner))}
                                        setItems={(partners) => updateItem({...item, partners: partners.map(({type, name}) => ({type, name}))})}
                                        getNewItem={() => ({
                                            type: '',
                                            name: ''
                                        } as Partner)}
                                        renderItem={(partner, updatePartner) => (
                                            <div className="space-y-4 p-4 bg-gray-50 rounded">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Nom du partenaire</label>
                                                    <input
                                                        type="text"
                                                        value={partner.name}
                                                        onChange={(e) => updatePartner({...partner, name: e.target.value})}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Logo</label>
                                                    <ImageUploader
                                                        onUploadComplete={(url) => updatePartner({...partner, logoUrl: url})}
                                                        storagePath="fashion-day-events/partners"
                                                        currentImageUrl={partner.logoUrl}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Site web</label>
                                                    <input
                                                        type="url"
                                                        value={partner.website}
                                                        onChange={(e) => updatePartner({...partner, website: e.target.value})}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        placeholder="https://"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

// Composant utilitaire pour gérer les tableaux modifiables
interface ArrayEditorProps<T> {
    items: T[];
    setItems: (items: T[]) => void;
    getNewItem: () => T;
    renderItem: (item: T, updateItem: (item: T) => void) => React.ReactNode;
}

const ArrayEditor = <T extends { id: string }>({ 
    items, 
    setItems, 
    getNewItem, 
    renderItem 
}: ArrayEditorProps<T>) => {
    const addItem = () => {
        setItems([...items, getNewItem()]);
    };

    const updateItem = (index: number, updatedItem: T) => {
        const newItems = [...items];
        newItems[index] = updatedItem;
        setItems(newItems);
    };

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    return (
        <div className="space-y-4">
            {items.map((item, index) => (
                <div key={item.id} className="border rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center bg-gray-50 px-4 py-2 border-b">
                        <h4 className="font-medium">Élément {index + 1}</h4>
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-800"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="p-4">
                        {renderItem(item, (updatedItem) => updateItem(index, updatedItem))}
                    </div>
                </div>
            ))}
            <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" />
                Ajouter un élément
            </button>
        </div>
    );
};

export default AdminFashionDayEvents;