import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Service } from '../../types';
import { PlusIcon, TrashIcon, PencilIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

const AdminServices: React.FC = () => {
    const { data, saveData } = useData();
    const [services, setServices] = useState<Service[]>([]);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [currentService, setCurrentService] = useState<Partial<Service>>({});

    useEffect(() => {
        if (data?.services) {
            setServices(data.services);
        }
    }, [data]);

    const handleAddNew = () => {
        setIsEditing('new');
        setCurrentService({
            id: `service-${Date.now()}`,
            title: '',
            slug: '',
            price: 0,
            category: 'Services Mannequinat',
            description: '',
            icon: 'CogIcon',
            buttonText: 'En savoir plus',
            buttonLink: '/services'
        });
    };

    const handleEdit = (service: Service) => {
        setIsEditing(service.id);
        setCurrentService(service);
    };

    const handleDelete = async (serviceId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
            const updatedServices = services.filter(s => s.id !== serviceId);
            await saveData({ ...data, services: updatedServices });
        }
    };

    const handleSave = async () => {
        if (!currentService.id) return;

        const updatedServices = [...services];
        const existingIndex = updatedServices.findIndex(s => s.id === currentService.id);

        if (existingIndex > -1) {
            updatedServices[existingIndex] = currentService as Service;
        } else {
            updatedServices.push(currentService as Service);
        }

        await saveData({ ...data, services: updatedServices });
        setIsEditing(null);
        setCurrentService({});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentService(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
    };
    
    const generateSlug = () => {
        if (currentService.title) {
            const newSlug = currentService.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            setCurrentService(prev => ({...prev, slug: newSlug}));
        }
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Gestion des Services</h1>
                <button 
                    onClick={handleAddNew}
                    className="bg-pm-gold text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    Ajouter un service
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                 <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {services.map(service => (
                            <tr key={service.id}>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{service.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{service.price} XOF</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{service.category}</td>
                                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                                    <button onClick={() => handleEdit(service)} className="text-indigo-600 hover:text-indigo-900"><PencilIcon className="w-5 h-5"/></button>
                                    <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                         <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">{isEditing === 'new' ? 'Nouveau Service' : 'Modifier le Service'}</h2>
                            <button onClick={() => setIsEditing(null)}><XMarkIcon className="w-6 h-6"/></button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                           <input name="title" value={currentService.title || ''} onChange={handleChange} placeholder="Titre du service" className="w-full p-2 border rounded" />
                           <div className='flex gap-2 items-center'>
                             <input name="slug" value={currentService.slug || ''} onChange={handleChange} placeholder="Slug" className="w-full p-2 border rounded" />
                             <button onClick={generateSlug} className='bg-gray-200 px-3 py-2 rounded text-sm'>Générer</button>
                           </div>
                           <input name="price" type="number" value={currentService.price || 0} onChange={handleChange} placeholder="Prix" className="w-full p-2 border rounded" />
                           <select name="category" value={currentService.category || ''} onChange={handleChange} className="w-full p-2 border rounded">
                                <option>Services Mannequinat</option>
                                <option>Services Mode et Stylisme</option>
                                <option>Services Événementiels</option>
                           </select>
                           <textarea name="description" value={currentService.description || ''} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" rows={4}></textarea>
                           <input name="icon" value={currentService.icon || ''} onChange={handleChange} placeholder="Icône (Heroicon)" className="w-full p-2 border rounded" />
                        </div>
                        <div className="p-6 border-t flex justify-end gap-3">
                            <button onClick={() => setIsEditing(null)} className="px-4 py-2 bg-gray-200 rounded-lg">Annuler</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-pm-gold text-white rounded-lg flex items-center gap-2"><CheckIcon className="w-5 h-5"/> Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminServices;
