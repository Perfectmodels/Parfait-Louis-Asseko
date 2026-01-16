
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { GalleryItem } from '../types';
import ImageUploader from '../components/ImageUploader';
import MultiImageUploader from '../components/MultiImageUploader';
import { PlusIcon, TrashIcon, PencilIcon, MagnifyingGlassIcon, PlayIcon, PhotoIcon } from '@heroicons/react/24/outline';

const AdminGallery: React.FC = () => {
    const { data, addDocument, updateDocument, deleteDocument, isInitialized } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<GalleryItem>>({
        title: '',
        category: 'Show',
        date: new Date().toISOString().split('T')[0],
        imageUrl: '',
        additionalImages: [],
        videoUrl: '',
        description: '',
        featured: false
    });

    const items = data?.gallery || [];

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentItem.id) {
                await updateDocument('gallery', currentItem.id, currentItem);
                alert("Élément modifié avec succès !");
            } else {
                await addDocument('gallery', currentItem);
                alert("Élément ajouté avec succès !");
            }
            setIsEditing(false);
            setCurrentItem({
                title: '',
                category: 'Show',
                date: new Date().toISOString().split('T')[0],
                imageUrl: '',
                additionalImages: [],
                videoUrl: '',
                description: '',
                featured: false
            });
        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue.");
        }
    };

    const handleEdit = (item: GalleryItem) => {
        setCurrentItem(item);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
            await deleteDocument('gallery', id);
        }
    };

    if (!isInitialized) return <div className="p-8 text-white">Chargement...</div>;

    return (
        <div className="space-y-6">
            <h2 className="admin-title text-2xl font-bold text-pm-gold mb-6">Gestion de la Galerie</h2>

            {/* List View */}
            {!isEditing ? (
                <div className="bg-pm-dark-light rounded-lg p-6 shadow-xl border border-pm-gold/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/30 border border-pm-gold/20 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-pm-gold"
                            />
                            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                        <button
                            onClick={() => {
                                setCurrentItem({
                                    title: '',
                                    category: 'Show',
                                    date: new Date().toISOString().split('T')[0],
                                    imageUrl: '',
                                    additionalImages: [],
                                    videoUrl: '',
                                    description: '',
                                    featured: false
                                });
                                setIsEditing(true);
                            }}
                            className="flex items-center gap-2 bg-pm-gold text-pm-dark px-4 py-2 rounded-lg font-bold hover:bg-white transition-colors"
                        >
                            <PlusIcon className="w-5 h-5" /> Ajouter un élément
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-pm-gold/20 text-pm-gold">
                                    <th className="p-3">Image</th>
                                    <th className="p-3">Titre</th>
                                    <th className="p-3">Catégorie</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredItems.map(item => (
                                    <tr key={item.id} className="hover:bg-white/5">
                                        <td className="p-3">
                                            <div className="w-16 h-16 bg-black rounded overflow-hidden">
                                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="p-3 font-medium text-white">{item.title}</td>
                                        <td className="p-3 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${item.category === 'Show' ? 'bg-purple-900/50 text-purple-200' :
                                                item.category === 'Video' ? 'bg-red-900/50 text-red-200' :
                                                    'bg-blue-900/50 text-blue-200'
                                                }`}>
                                                {item.category === 'Show' ? 'Défilé' : item.category === 'Video' ? 'Vidéo' : 'Shooting'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-gray-400">{item.date}</td>
                                        <td className="p-3">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(item)} className="p-2 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600 hover:text-white transition-colors">
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600 hover:text-white transition-colors">
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredItems.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">Aucun élément trouvé.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Form View */
                <div className="bg-pm-dark-light rounded-lg p-6 shadow-xl border border-pm-gold/10 max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                        {currentItem.id ? "Modifier l'élément" : "Ajouter un élément"}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Titre</label>
                                <input
                                    type="text"
                                    required
                                    value={currentItem.title}
                                    onChange={e => setCurrentItem({ ...currentItem, title: e.target.value })}
                                    className="w-full bg-black/30 border border-pm-gold/20 rounded p-2 text-white focus:border-pm-gold outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Date</label>
                                <input
                                    type="date"
                                    required
                                    value={currentItem.date}
                                    onChange={e => setCurrentItem({ ...currentItem, date: e.target.value })}
                                    className="w-full bg-black/30 border border-pm-gold/20 rounded p-2 text-white focus:border-pm-gold outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Catégorie</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={currentItem.category === 'Show'}
                                        onChange={() => setCurrentItem({ ...currentItem, category: 'Show' })}
                                        className="text-pm-gold focus:ring-pm-gold bg-black/30 border-gray-600"
                                    />
                                    <span className="text-white">Défilé</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={currentItem.category === 'Shooting'}
                                        onChange={() => setCurrentItem({ ...currentItem, category: 'Shooting' })}
                                        className="text-pm-gold focus:ring-pm-gold bg-black/30 border-gray-600"
                                    />
                                    <span className="text-white">Shooting</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={currentItem.category === 'Video'}
                                        onChange={() => setCurrentItem({ ...currentItem, category: 'Video' })}
                                        className="text-pm-gold focus:ring-pm-gold bg-black/30 border-gray-600"
                                    />
                                    <span className="text-white">Vidéo</span>
                                </label>
                            </div>
                        </div>

                        <ImageUploader
                            label="Image de couverture (ou miniature vidéo)"
                            value={currentItem.imageUrl || ''}
                            onChange={(url) => setCurrentItem({ ...currentItem, imageUrl: url })}
                        />

                        {/* Photos supplémentaires */}
                        <div className="border-t border-white/10 pt-6">
                            <MultiImageUploader
                                label="Photos supplémentaires (optionnel)"
                                description="Ajoutez jusqu'à 10 photos supplémentaires pour créer une galerie complète"
                                values={currentItem.additionalImages || []}
                                onChange={(urls) => setCurrentItem({ ...currentItem, additionalImages: urls })}
                                maxImages={10}
                            />
                        </div>

                        {currentItem.category === 'Video' && (
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Lien Vidéo (YouTube)</label>
                                <div className="relative">
                                    <PlayIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
                                    <input
                                        type="url"
                                        placeholder="https://youtube.com/..."
                                        value={currentItem.videoUrl || ''}
                                        onChange={e => setCurrentItem({ ...currentItem, videoUrl: e.target.value })}
                                        className="w-full bg-black/30 border border-pm-gold/20 rounded p-2 pl-10 text-white focus:border-pm-gold outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Description (Optionnelle)</label>
                            <textarea
                                rows={3}
                                value={currentItem.description || ''}
                                onChange={e => setCurrentItem({ ...currentItem, description: e.target.value })}
                                className="w-full bg-black/30 border border-pm-gold/20 rounded p-2 text-white focus:border-pm-gold outline-none"
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 border border-white/20 rounded text-gray-300 hover:bg-white/5 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-pm-gold text-pm-dark font-bold rounded hover:bg-white transition-colors"
                            >
                                {currentItem.id ? "Enregistrer" : "Ajouter"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminGallery;
