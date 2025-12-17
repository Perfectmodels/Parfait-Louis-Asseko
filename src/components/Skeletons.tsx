/**
 * Skeleton Loaders Components
 * 
 * Composants de chargement pour améliorer la perception de vitesse
 * Affichent des placeholders pendant le chargement des données
 * 
 * Composants disponibles:
 * - ModelCardSkeleton: Pour les cartes de mannequins
 * - ArticleCardSkeleton: Pour les articles du magazine
 * - ServiceCardSkeleton: Pour les cartes de services
 * - ProfileSkeleton: Pour les profils détaillés
 * 
 * @author Perfect Models Management
 * @version 1.0
 */

import React from 'react';

/**
 * Skeleton pour carte de mannequin
 */
export const ModelCardSkeleton: React.FC = () => (
    <div className="animate-pulse">
        {/* Image */}
        <div className="aspect-[3/4] bg-gray-800 rounded-lg mb-4" />

        {/* Nom */}
        <div className="h-5 bg-gray-800 rounded w-3/4 mb-2" />

        {/* Catégorie */}
        <div className="h-4 bg-gray-800 rounded w-1/2 mb-3" />

        {/* Stats */}
        <div className="flex gap-2">
            <div className="h-3 bg-gray-800 rounded w-16" />
            <div className="h-3 bg-gray-800 rounded w-16" />
        </div>
    </div>
);

/**
 * Skeleton pour carte d'article
 */
export const ArticleCardSkeleton: React.FC = () => (
    <div className="animate-pulse">
        {/* Image */}
        <div className="aspect-video bg-gray-800 rounded-lg mb-4" />

        {/* Catégorie */}
        <div className="h-3 bg-gray-800 rounded w-20 mb-3" />

        {/* Titre */}
        <div className="h-6 bg-gray-800 rounded w-full mb-2" />
        <div className="h-6 bg-gray-800 rounded w-2/3 mb-3" />

        {/* Extrait */}
        <div className="h-4 bg-gray-800 rounded w-full mb-2" />
        <div className="h-4 bg-gray-800 rounded w-5/6 mb-4" />

        {/* Meta */}
        <div className="flex items-center gap-4">
            <div className="h-3 bg-gray-800 rounded w-24" />
            <div className="h-3 bg-gray-800 rounded w-20" />
        </div>
    </div>
);

/**
 * Skeleton pour carte de service
 */
export const ServiceCardSkeleton: React.FC = () => (
    <div className="animate-pulse p-6 bg-pm-dark border border-gray-800 rounded-xl">
        {/* Icône */}
        <div className="w-12 h-12 bg-gray-800 rounded-lg mb-4" />

        {/* Titre */}
        <div className="h-6 bg-gray-800 rounded w-3/4 mb-3" />

        {/* Description */}
        <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-800 rounded w-full" />
            <div className="h-4 bg-gray-800 rounded w-5/6" />
            <div className="h-4 bg-gray-800 rounded w-4/6" />
        </div>

        {/* Bouton */}
        <div className="h-10 bg-gray-800 rounded w-32" />
    </div>
);

/**
 * Skeleton pour profil détaillé
 */
export const ProfileSkeleton: React.FC = () => (
    <div className="animate-pulse">
        <div className="grid md:grid-cols-2 gap-8">
            {/* Image principale */}
            <div className="aspect-[3/4] bg-gray-800 rounded-xl" />

            {/* Informations */}
            <div className="space-y-6">
                {/* Nom */}
                <div className="h-10 bg-gray-800 rounded w-3/4" />

                {/* Catégorie */}
                <div className="h-6 bg-gray-800 rounded w-1/3" />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="h-16 bg-gray-800 rounded" />
                    <div className="h-16 bg-gray-800 rounded" />
                    <div className="h-16 bg-gray-800 rounded" />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-800 rounded w-full" />
                    <div className="h-4 bg-gray-800 rounded w-full" />
                    <div className="h-4 bg-gray-800 rounded w-3/4" />
                </div>

                {/* Boutons */}
                <div className="flex gap-4">
                    <div className="h-12 bg-gray-800 rounded flex-1" />
                    <div className="h-12 bg-gray-800 rounded flex-1" />
                </div>
            </div>
        </div>
    </div>
);

/**
 * Skeleton pour grille de mannequins
 */
export const ModelsGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
            <ModelCardSkeleton key={i} />
        ))}
    </div>
);

/**
 * Skeleton pour grille d'articles
 */
export const ArticlesGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: count }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
        ))}
    </div>
);

/**
 * Skeleton pour liste de services
 */
export const ServicesGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array.from({ length: count }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
        ))}
    </div>
);

/**
 * Skeleton générique pour texte
 */
export const TextSkeleton: React.FC<{ lines?: number; className?: string }> = ({
    lines = 3,
    className = ''
}) => (
    <div className={`animate-pulse space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
            <div
                key={i}
                className="h-4 bg-gray-800 rounded"
                style={{ width: i === lines - 1 ? '75%' : '100%' }}
            />
        ))}
    </div>
);

/**
 * Skeleton pour image
 */
export const ImageSkeleton: React.FC<{ aspectRatio?: string; className?: string }> = ({
    aspectRatio = 'aspect-video',
    className = ''
}) => (
    <div className={`animate-pulse ${aspectRatio} bg-gray-800 rounded-lg ${className}`} />
);
