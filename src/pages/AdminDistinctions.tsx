import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { db } from '../firebase';
import { ref, set } from 'firebase/database';
import { 
    TrophyIcon, 
    PlusIcon, 
    TrashIcon, 
    PencilIcon,
    StarIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { Model, ModelDistinction } from '../types';
import ImageInput from '../components/ImageInput';

const AdminDistinctions: React.FC = () => {
    const { data, reloadData } = useData();
    const models = data?.models || [];
    const [selectedModelId, setSelectedModelId] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingDistinction, setEditingDistinction] = useState<ModelDistinction | null>(null);
    const [formData, setFormData] = useState<Partial<ModelDistinction>>({
        title: '',
        year: new Date().getFullYear(),
        category: 'national',
        description: '',
        icon: '🏆'
    });

    const distinctionCategories = [
        { value: 'international', label: 'International', icon: '🌍', color: 'text-purple-400' },
        { value: 'national', label: 'National', icon: '🇬🇦', color: 'text-blue-400' },
        { value: 'regional', label: 'Régional', icon: '🏙️', color: 'text-green-400' },
        { value: 'special', label: 'Spécial', icon: '⭐', color: 'text-yellow-400' }
    ];

    const iconOptions = ['🏆', '🥇', '🥈', '🥉', '👑', '⭐', '💫', '✨', '🌟', '🎖️', '🏅', '🎯'];

    useEffect(() => {
        if (selectedModelId) {
            const model = models.find((m: Model) => m.id === selectedModelId);
            setSelectedModel(model || null);
        } else {
            setSelectedModel(null);
        }
    }, [selectedModelId, models]);

    const handleOpenModal = (distinction?: ModelDistinction) => {
        if (distinction) {
            setEditingDistinction(distinction);
            setFormData(distinction);
        } else {
            setEditingDistinction(null);
            setFormData({
                title: '',
                year: new Date().getFullYear(),
                category: 'national',
                description: '',
                icon: '🏆'
            });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!selectedModel || !formData.title || !formData.year) {
            alert('Veuillez sélectionner un mannequin et remplir tous les champs obligatoires');
            return;
        }

        try {
            const distinctionData: ModelDistinction = {
                title: formData.title || '',
                year: formData.year || new Date().getFullYear(),
                category: formData.category || 'national',
                description: formData.description,
                icon: formData.icon || '🏆'
            };

            const currentDistinctions = selectedModel.distinctions || [];
            const updatedDistinctions = editingDistinction
                ? currentDistinctions.map(d => 
                    d.title === editingDistinction.title && d.year === editingDistinction.year 
                        ? distinctionData 
                        : d
                  )
                : [...currentDistinctions, distinctionData];

            const updatedModel = {
                ...selectedModel,
                distinctions: updatedDistinctions
            };

            const updatedModels = models.map((m: Model) => 
                m.id === selectedModel.id ? updatedModel : m
            );

            await set(ref(db, 'models'), updatedModels);
            await reloadData();
            setShowModal(false);
            alert('Distinction enregistrée avec succès !');
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement:', error);
            alert('Erreur lors de l\'enregistrement de la distinction');
        }
    };

    const handleDelete = async (distinction: ModelDistinction) => {
        if (!selectedModel) return;
        
        if (confirm(`Êtes-vous sûr de vouloir supprimer la distinction "${distinction.title}" ?`)) {
            try {
                const updatedDistinctions = (selectedModel.distinctions || []).filter(
                    d => !(d.title === distinction.title && d.year === distinction.year)
                );

                const updatedModel = {
                    ...selectedModel,
                    distinctions: updatedDistinctions
                };

                const updatedModels = models.map((m: Model) => 
                    m.id === selectedModel.id ? updatedModel : m
                );

                await set(ref(db, 'models'), updatedModels);
                await reloadData();
                alert('Distinction supprimée avec succès !');
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                alert('Erreur lors de la suppression de la distinction');
            }
        }
    };

    const getCategoryColor = (category: string) => {
        const cat = distinctionCategories.find(c => c.value === category);
        return cat?.color || 'text-gray-400';
    };

    const getCategoryIcon = (category: string) => {
        const cat = distinctionCategories.find(c => c.value === category);
        return cat?.icon || '🏆';
    };

    return (
        <div className="min-h-screen bg-pm-dark p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="admin-page-header">
                    <div>
                        <h1 className="admin-page-title flex items-center gap-3">
                            <TrophyIcon className="w-10 h-10" />
                            Gestion des Distinctions
                        </h1>
                        <p className="admin-page-subtitle">Ajoutez et gérez les prix et distinctions des mannequins</p>
                    </div>
                </div>

                {/* Sélection du mannequin */}
                <div className="mb-8 admin-section-wrapper">
                    <label className="admin-label">Sélectionner un mannequin</label>
                    <select
                        value={selectedModelId}
                        onChange={(e) => setSelectedModelId(e.target.value)}
                        className="admin-input"
                    >
                        <option value="">-- Choisir un mannequin --</option>
                        {models.map((model: Model) => (
                            <option key={model.id} value={model.id}>
                                {model.name} {model.isPro && '⭐'}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedModel ? (
                    <>
                        {/* Carte du mannequin sélectionné */}
                        <div className="mb-8 bg-gradient-to-r from-pm-gold/10 via-transparent to-pm-gold/10 border border-pm-gold/30 rounded-xl p-6 flex items-center gap-6">
                            <img
                                src={selectedModel.imageUrl}
                                alt={selectedModel.name}
                                className="w-24 h-24 object-cover rounded-full border-2 border-pm-gold shadow-lg"
                            />
                            <div className="flex-1">
                                <h2 className="text-2xl font-playfair text-pm-gold mb-1">{selectedModel.name}</h2>
                                <p className="text-pm-off-white/70 text-sm mb-2">{selectedModel.category}</p>
                                <div className="flex items-center gap-2">
                                    <TrophyIcon className="w-5 h-5 text-pm-gold" />
                                    <span className="text-pm-off-white font-semibold">
                                        {selectedModel.distinctions?.length || 0} distinction(s)
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleOpenModal()}
                                className="px-6 py-3 bg-pm-gold text-black font-bold rounded-lg hover:bg-pm-gold/90 transition-colors flex items-center gap-2"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Ajouter une distinction
                            </button>
                        </div>

                        {/* Liste des distinctions */}
                        {selectedModel.distinctions && selectedModel.distinctions.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {selectedModel.distinctions.map((distinction, index) => (
                                    <div
                                        key={index}
                                        className="bg-black border border-pm-gold/20 rounded-lg p-6 hover:border-pm-gold transition-all group relative overflow-hidden"
                                    >
                                        {/* Background décoratif */}
                                        <div className="absolute top-0 right-0 text-8xl opacity-5 group-hover:opacity-10 transition-opacity">
                                            {distinction.icon}
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-4xl">{distinction.icon}</span>
                                                    <span className={`text-xs px-2 py-1 rounded-full bg-black/50 border ${getCategoryColor(distinction.category)} border-current`}>
                                                        {getCategoryIcon(distinction.category)} {distinction.category}
                                                    </span>
                                                </div>
                                                <span className="text-pm-gold font-bold text-lg">{distinction.year}</span>
                                            </div>

                                            <h3 className="text-lg font-playfair font-bold text-pm-gold mb-2 group-hover:text-pm-off-white transition-colors">
                                                {distinction.title}
                                            </h3>

                                            {distinction.description && (
                                                <p className="text-sm text-pm-off-white/70 mb-4 line-clamp-3">
                                                    {distinction.description}
                                                </p>
                                            )}

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(distinction)}
                                                    className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400 text-sm transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                    Modifier
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(distinction)}
                                                    className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 text-sm transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                    Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 admin-section-wrapper">
                                <TrophyIcon className="w-24 h-24 text-pm-off-white/20 mx-auto mb-4" />
                                <p className="text-pm-off-white/60 mb-4">Aucune distinction pour ce mannequin</p>
                                <button
                                    onClick={() => handleOpenModal()}
                                    className="px-6 py-3 bg-pm-gold text-black font-bold rounded-lg hover:bg-pm-gold/90 transition-colors inline-flex items-center gap-2"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    Ajouter la première distinction
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <StarIcon className="w-24 h-24 text-pm-off-white/20 mx-auto mb-4" />
                        <p className="text-pm-off-white/60">Veuillez sélectionner un mannequin pour gérer ses distinctions</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-pm-dark border border-pm-gold/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-pm-dark border-b border-pm-gold/30 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-playfair text-pm-gold flex items-center gap-3">
                                <SparklesIcon className="w-6 h-6" />
                                {editingDistinction ? 'Modifier la distinction' : 'Nouvelle distinction'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-pm-off-white/60 hover:text-pm-gold transition-colors text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <label className="admin-label">Titre de la distinction *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="admin-input"
                                    placeholder="Ex: Miss Perfect Fashion Day 2024"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="admin-label">Année *</label>
                                    <input
                                        type="number"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                        className="admin-input"
                                        min="1900"
                                        max={new Date().getFullYear() + 10}
                                    />
                                </div>

                                <div>
                                    <label className="admin-label">Catégorie *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                        className="admin-input"
                                    >
                                        {distinctionCategories.map(cat => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.icon} {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="admin-label">Icône</label>
                                <div className="grid grid-cols-6 gap-3">
                                    {iconOptions.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icon })}
                                            className={`text-3xl p-3 rounded-lg border-2 transition-all hover:scale-110 ${
                                                formData.icon === icon
                                                    ? 'border-pm-gold bg-pm-gold/20'
                                                    : 'border-pm-off-white/20 hover:border-pm-gold/50'
                                            }`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="admin-label">Description (optionnelle)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="admin-textarea"
                                    rows={4}
                                    placeholder="Décrivez cette distinction, les circonstances, l'importance..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-pm-dark border-t border-pm-gold/30 p-6 flex justify-end gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-3 bg-pm-off-white/10 hover:bg-pm-off-white/20 rounded-lg text-pm-off-white transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-3 bg-pm-gold text-black font-bold rounded-lg hover:bg-pm-gold/90 transition-colors flex items-center gap-2"
                            >
                                <StarIcon className="w-5 h-5" />
                                {editingDistinction ? 'Mettre à jour' : 'Créer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDistinctions;

