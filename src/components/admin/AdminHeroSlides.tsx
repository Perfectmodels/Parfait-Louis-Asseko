/**
 * AdminHeroSlides Component
 * 
 * Panneau d'administration pour gérer les slides du hero section dynamique
 * Permet d'ajouter, modifier, supprimer et réorganiser les slides
 * 
 * @author Perfect Models Management
 * @version 1.0
 */

import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { HeroSlide } from '../../types';
import { PlusIcon, PencilIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import ImageUploader from './ImageUploader';

const AdminHeroSlides: React.FC = () => {
    const { data, saveData } = useData();
    const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState<Partial<HeroSlide>>({
        image: '',
        title: '',
        subtitle: '',
        description: '',
        cta: '',
        ctaLink: '',
        order: 1,
        isActive: true
    });

    if (!data) return <div>Chargement...</div>;

    const heroSlides = data.heroSlides || [];
    const sortedSlides = [...heroSlides].sort((a, b) => a.order - b.order);

    const handleSave = () => {
        if (!formData.image || !formData.title || !formData.subtitle) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        let updatedSlides: HeroSlide[];

        if (editingSlide) {
            // Update existing slide
            updatedSlides = heroSlides.map(slide =>
                slide.id === editingSlide.id ? { ...slide, ...formData } as HeroSlide : slide
            );
        } else {
            // Add new slide
            const newSlide: HeroSlide = {
                id: Date.now().toString(),
                image: formData.image!,
                title: formData.title!,
                subtitle: formData.subtitle!,
                description: formData.description || '',
                cta: formData.cta || 'En savoir plus',
                ctaLink: formData.ctaLink || '/',
                order: formData.order || heroSlides.length + 1,
                isActive: formData.isActive !== undefined ? formData.isActive : true
            };
            updatedSlides = [...heroSlides, newSlide];
        }

        saveData({ ...data, heroSlides: updatedSlides });
        resetForm();
    };

    const handleDelete = (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce slide ?')) return;
        const updatedSlides = heroSlides.filter(slide => slide.id !== id);
        saveData({ ...data, heroSlides: updatedSlides });
    };

    const handleToggleActive = (id: string) => {
        const updatedSlides = heroSlides.map(slide =>
            slide.id === id ? { ...slide, isActive: !slide.isActive } : slide
        );
        saveData({ ...data, heroSlides: updatedSlides });
    };

    const handleMoveUp = (id: string) => {
        const index = sortedSlides.findIndex(s => s.id === id);
        if (index === 0) return;

        const updatedSlides = [...heroSlides];
        const currentSlide = updatedSlides.find(s => s.id === id)!;
        const previousSlide = sortedSlides[index - 1];
        const prevSlideInArray = updatedSlides.find(s => s.id === previousSlide.id)!;

        const tempOrder = currentSlide.order;
        currentSlide.order = prevSlideInArray.order;
        prevSlideInArray.order = tempOrder;

        saveData({ ...data, heroSlides: updatedSlides });
    };

    const handleMoveDown = (id: string) => {
        const index = sortedSlides.findIndex(s => s.id === id);
        if (index === sortedSlides.length - 1) return;

        const updatedSlides = [...heroSlides];
        const currentSlide = updatedSlides.find(s => s.id === id)!;
        const nextSlide = sortedSlides[index + 1];
        const nextSlideInArray = updatedSlides.find(s => s.id === nextSlide.id)!;

        const tempOrder = currentSlide.order;
        currentSlide.order = nextSlideInArray.order;
        nextSlideInArray.order = tempOrder;

        saveData({ ...data, heroSlides: updatedSlides });
    };

    const handleEdit = (slide: HeroSlide) => {
        setEditingSlide(slide);
        setFormData(slide);
        setIsAdding(true);
    };

    const resetForm = () => {
        setEditingSlide(null);
        setIsAdding(false);
        setFormData({
            image: '',
            title: '',
            subtitle: '',
            description: '',
            cta: '',
            ctaLink: '',
            order: heroSlides.length + 1,
            isActive: true
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Hero Slides</h2>
                    <p className="text-gray-400 mt-1">Gérez les slides du hero section de la page d'accueil</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-black rounded-lg hover:bg-white transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Ajouter un slide
                    </button>
                )}
            </div>

            {/* Form */}
            {isAdding && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                        {editingSlide ? 'Modifier le slide' : 'Nouveau slide'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Image */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Image de fond *
                            </label>
                            <ImageUploader
                                currentImage={formData.image}
                                onImageChange={(url) => setFormData({ ...formData, image: url })}
                                folder="hero"
                            />
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Titre *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-pm-gold"
                                placeholder="L'Élégance"
                            />
                        </div>

                        {/* Subtitle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Sous-titre *
                            </label>
                            <input
                                type="text"
                                value={formData.subtitle}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-pm-gold"
                                placeholder="Redéfinie"
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description
                            </label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-pm-gold"
                                placeholder="Agence de Mannequins & Événementiel"
                            />
                        </div>

                        {/* CTA */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Texte du bouton
                            </label>
                            <input
                                type="text"
                                value={formData.cta}
                                onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-pm-gold"
                                placeholder="Devenir Mannequin"
                            />
                        </div>

                        {/* CTA Link */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Lien du bouton
                            </label>
                            <input
                                type="text"
                                value={formData.ctaLink}
                                onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-pm-gold"
                                placeholder="/casting-formulaire"
                            />
                        </div>

                        {/* Order */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Ordre
                            </label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-pm-gold"
                                min="1"
                            />
                        </div>

                        {/* Active */}
                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-5 h-5 text-pm-gold bg-white/5 border-white/10 rounded focus:ring-pm-gold"
                                />
                                <span className="ml-2 text-gray-300">Actif</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-pm-gold text-black rounded-lg hover:bg-white transition-colors font-medium"
                        >
                            {editingSlide ? 'Mettre à jour' : 'Ajouter'}
                        </button>
                        <button
                            onClick={resetForm}
                            className="px-6 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}

            {/* Slides List */}
            <div className="space-y-4">
                {sortedSlides.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 border border-white/10 rounded-lg">
                        <p className="text-gray-400">Aucun slide. Ajoutez-en un pour commencer.</p>
                    </div>
                ) : (
                    sortedSlides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`bg-white/5 border border-white/10 rounded-lg p-4 ${!slide.isActive ? 'opacity-50' : ''
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Preview */}
                                <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <h4 className="text-white font-bold">
                                        {slide.title} <span className="text-pm-gold italic">{slide.subtitle}</span>
                                    </h4>
                                    <p className="text-gray-400 text-sm mt-1">{slide.description}</p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        CTA: {slide.cta} → {slide.ctaLink}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {/* Move Up */}
                                    <button
                                        onClick={() => handleMoveUp(slide.id)}
                                        disabled={index === 0}
                                        className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Monter"
                                    >
                                        <ArrowUpIcon className="w-5 h-5" />
                                    </button>

                                    {/* Move Down */}
                                    <button
                                        onClick={() => handleMoveDown(slide.id)}
                                        disabled={index === sortedSlides.length - 1}
                                        className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Descendre"
                                    >
                                        <ArrowDownIcon className="w-5 h-5" />
                                    </button>

                                    {/* Toggle Active */}
                                    <button
                                        onClick={() => handleToggleActive(slide.id)}
                                        className="p-2 text-gray-400 hover:text-pm-gold"
                                        title={slide.isActive ? 'Désactiver' : 'Activer'}
                                    >
                                        {slide.isActive ? (
                                            <EyeIcon className="w-5 h-5" />
                                        ) : (
                                            <EyeSlashIcon className="w-5 h-5" />
                                        )}
                                    </button>

                                    {/* Edit */}
                                    <button
                                        onClick={() => handleEdit(slide)}
                                        className="p-2 text-gray-400 hover:text-blue-400"
                                        title="Modifier"
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </button>

                                    {/* Delete */}
                                    <button
                                        onClick={() => handleDelete(slide.id)}
                                        className="p-2 text-gray-400 hover:text-red-400"
                                        title="Supprimer"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminHeroSlides;
