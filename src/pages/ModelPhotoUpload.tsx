import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import PhotoUpload from '../components/PhotoUpload';
import { imgbbService } from '../services/imgbbService';
import { 
    CameraIcon, 
    PhotoIcon, 
    UserIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const ModelPhotoUpload: React.FC = () => {
    const { data, saveData } = useData();
    const [currentModel, setCurrentModel] = useState<any>(null);
    const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        // Simuler la récupération du mannequin actuel
        // En réalité, cela viendrait de l'authentification
        const modelId = 'current-model-id'; // À remplacer par l'ID du mannequin connecté
        const model = data?.models?.find(m => m.id === modelId);
        setCurrentModel(model);
        
        if (model?.photos) {
            setExistingPhotos(model.photos);
        }
    }, [data]);

    const handleUpload = async (files: File[]): Promise<string[]> => {
        if (!imgbbService.isConfigured()) {
            throw new Error('Service d\'upload non configuré. Contactez l\'administrateur.');
        }

        setUploading(true);
        setMessage(null);

        try {
            const uploadResults = await imgbbService.uploadMultipleFiles(files, 'perfect_models/models');
            const newUrls = uploadResults.map(result => result.url);
            
            // Mettre à jour les photos du mannequin
            const updatedPhotos = [...existingPhotos, ...newUrls];
            setExistingPhotos(updatedPhotos);

            // Sauvegarder dans le contexte
            if (currentModel) {
                const updatedModels = data?.models?.map(model => 
                    model.id === currentModel.id 
                        ? { ...model, photos: updatedPhotos }
                        : model
                ) || [];

                await saveData({ ...data, models: updatedModels });
            }

            setMessage({ type: 'success', text: `${files.length} photo(s) uploadée(s) avec succès !` });
            return newUrls;
        } catch (error) {
            console.error('Erreur lors de l\'upload:', error);
            setMessage({ 
                type: 'error', 
                text: `Erreur lors de l'upload: ${error instanceof Error ? error.message : 'Erreur inconnue'}` 
            });
            throw error;
        } finally {
            setUploading(false);
        }
    };

    const handleDeletePhoto = async (url: string) => {
        try {
            // Pour ImgBB, on ne peut pas supprimer via l'API publique
            // On supprime seulement de la base de données locale
            console.log('Suppression de la photo:', url);

            // Mettre à jour la liste locale
            const updatedPhotos = existingPhotos.filter(photo => photo !== url);
            setExistingPhotos(updatedPhotos);

            // Sauvegarder dans le contexte
            if (currentModel) {
                const updatedModels = data?.models?.map(model => 
                    model.id === currentModel.id 
                        ? { ...model, photos: updatedPhotos }
                        : model
                ) || [];

                await saveData({ ...data, models: updatedModels });
            }

            setMessage({ type: 'success', text: 'Photo supprimée avec succès !' });
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            setMessage({ 
                type: 'error', 
                text: `Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}` 
            });
        }
    };

    if (!currentModel) {
        return (
            <div className="min-h-screen bg-pm-dark flex items-center justify-center">
                <div className="text-center">
                    <ExclamationTriangleIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-pm-gold mb-2">Mannequin non trouvé</h2>
                    <p className="text-pm-off-white/60 mb-6">Impossible de récupérer vos informations.</p>
                    <Link 
                        to="/model-dashboard" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-pm-gold text-black rounded-lg hover:bg-pm-gold/80 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Retour au tableau de bord
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-pm-dark">
            <SEO 
                title="Upload de Photos - Perfect Models"
                description="Gérez vos photos de portfolio"
            />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link 
                        to="/model-dashboard" 
                        className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Retour au tableau de bord
                    </Link>
                    
                    <div className="flex items-center gap-4 mb-6">
                        {currentModel.imageUrl && (
                            <img 
                                src={currentModel.imageUrl} 
                                alt={currentModel.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-pm-gold/50"
                            />
                        )}
                        <div>
                            <h1 className="text-4xl font-bold text-pm-gold mb-2">Mes Photos</h1>
                            <p className="text-pm-off-white/60">
                                Gérez votre portfolio photo • {currentModel.name}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                        message.type === 'success' 
                            ? 'bg-green-500/10 border border-green-500/20 text-green-300'
                            : 'bg-red-500/10 border border-red-500/20 text-red-300'
                    }`}>
                        {message.type === 'success' ? (
                            <CheckCircleIcon className="w-5 h-5" />
                        ) : (
                            <ExclamationTriangleIcon className="w-5 h-5" />
                        )}
                        <span>{message.text}</span>
                    </div>
                )}

                {/* Zone d'upload */}
                <div className="bg-gray-900/50 border border-pm-gold/20 rounded-lg p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-pm-gold mb-2">Ajouter des Photos</h2>
                        <p className="text-pm-off-white/60">
                            Uploadez vos meilleures photos pour enrichir votre portfolio. 
                            Les photos seront automatiquement optimisées et ajoutées à votre profil.
                        </p>
                    </div>

                    <PhotoUpload
                        onUpload={handleUpload}
                        onDelete={handleDeletePhoto}
                        existingPhotos={existingPhotos}
                        maxPhotos={20}
                        maxSize={10} // 10MB
                        acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                        disabled={uploading}
                    />
                </div>

                {/* Conseils pour les photos */}
                <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-4">💡 Conseils pour vos photos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-pm-off-white/70">
                        <div>
                            <h4 className="font-semibold text-blue-300 mb-2">Qualité recommandée :</h4>
                            <ul className="space-y-1">
                                <li>• Résolution minimale : 1080x1080px</li>
                                <li>• Format : JPG, PNG ou WebP</li>
                                <li>• Taille maximale : 10MB par photo</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-300 mb-2">Types de photos :</h4>
                            <ul className="space-y-1">
                                <li>• Photos de profil professionnelles</li>
                                <li>• Portraits en studio</li>
                                <li>• Photos de mode et défilés</li>
                                <li>• Photos de casting récentes</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelPhotoUpload;
