import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import SEO from '../../components/SEO';
import PhotoUpload from '../../components/PhotoUpload';
import { imgbbService } from '../../services/imgbbService';
import { 
    CameraIcon, 
    PhotoIcon, 
    UserIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ArrowLeftIcon,
    MagnifyingGlassIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const AdminPhotoUpload: React.FC = () => {
    const { data, saveData } = useData();
    const [selectedModel, setSelectedModel] = useState<any>(null);
    const [models, setModels] = useState<any[]>([]);
    const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        // Charger tous les mannequins
        const allModels = [
            ...(data?.models || []),
            ...(data?.beginnerStudents || [])
        ];
        setModels(allModels);
    }, [data]);

    const filteredModels = models.filter(model => 
        model.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleModelSelect = (model: any) => {
        setSelectedModel(model);
        setExistingPhotos(model.photos || []);
        setMessage(null);
    };

    const handleUpload = async (files: File[]): Promise<string[]> => {
        if (!selectedModel) {
            throw new Error('Aucun mannequin sélectionné');
        }

        if (!imgbbService.isConfigured()) {
            throw new Error('Service d\'upload non configuré. Vérifiez la configuration ImgBB.');
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
            const updatedModels = data?.models?.map(model => 
                model.id === selectedModel.id 
                    ? { ...model, photos: updatedPhotos }
                    : model
            ) || [];

            const updatedBeginnerStudents = data?.beginnerStudents?.map(student => 
                student.id === selectedModel.id 
                    ? { ...student, photos: updatedPhotos }
                    : student
            ) || [];

            await saveData({ 
                ...data, 
                models: updatedModels,
                beginnerStudents: updatedBeginnerStudents
            });

            setMessage({ type: 'success', text: `${files.length} photo(s) uploadée(s) pour ${selectedModel.name} !` });
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
        if (!selectedModel) return;

        try {
            // Pour ImgBB, on ne peut pas supprimer via l'API publique
            // On supprime seulement de la base de données locale
            console.log('Suppression de la photo:', url);

            // Mettre à jour la liste locale
            const updatedPhotos = existingPhotos.filter(photo => photo !== url);
            setExistingPhotos(updatedPhotos);

            // Sauvegarder dans le contexte
            const updatedModels = data?.models?.map(model => 
                model.id === selectedModel.id 
                    ? { ...model, photos: updatedPhotos }
                    : model
            ) || [];

            const updatedBeginnerStudents = data?.beginnerStudents?.map(student => 
                student.id === selectedModel.id 
                    ? { ...student, photos: updatedPhotos }
                    : student
            ) || [];

            await saveData({ 
                ...data, 
                models: updatedModels,
                beginnerStudents: updatedBeginnerStudents
            });

            setMessage({ type: 'success', text: 'Photo supprimée avec succès !' });
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            setMessage({ 
                type: 'error', 
                text: `Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}` 
            });
        }
    };

    return (
        <div className="min-h-screen bg-pm-dark">
            <SEO 
                title="Gestion des Photos - Perfect Models Admin"
                description="Gérez les photos des mannequins"
            />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link 
                        to="/admin" 
                        className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Retour au panel admin
                    </Link>
                    
                    <h1 className="text-4xl font-bold text-pm-gold mb-2">Gestion des Photos</h1>
                    <p className="text-pm-off-white/60">
                        Uploadez et gérez les photos des mannequins
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sélection du mannequin */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900/50 border border-pm-gold/20 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-pm-gold mb-4">Sélectionner un Mannequin</h2>
                            
                            {/* Recherche */}
                            <div className="mb-4">
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pm-off-white/60" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un mannequin..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/60 focus:border-pm-gold focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Liste des mannequins */}
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {filteredModels.map((model) => (
                                    <button
                                        key={model.id}
                                        onClick={() => handleModelSelect(model)}
                                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                                            selectedModel?.id === model.id
                                                ? 'bg-pm-gold/20 border border-pm-gold text-pm-gold'
                                                : 'bg-gray-800 hover:bg-gray-700 text-pm-off-white'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {model.imageUrl ? (
                                                <img 
                                                    src={model.imageUrl} 
                                                    alt={model.name}
                                                    className="w-10 h-10 rounded-full object-cover border border-pm-gold/30"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-pm-gold/20 flex items-center justify-center">
                                                    <UserIcon className="w-5 h-5 text-pm-gold" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold">{model.name}</p>
                                                <p className="text-sm opacity-70">
                                                    {model.photos?.length || 0} photo(s)
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Zone d'upload */}
                    <div className="lg:col-span-2">
                        {selectedModel ? (
                            <div className="space-y-6">
                                {/* Informations du mannequin sélectionné */}
                                <div className="bg-gray-900/50 border border-pm-gold/20 rounded-lg p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        {selectedModel.imageUrl && (
                                            <img 
                                                src={selectedModel.imageUrl} 
                                                alt={selectedModel.name}
                                                className="w-16 h-16 rounded-full object-cover border-2 border-pm-gold/50"
                                            />
                                        )}
                                        <div>
                                            <h2 className="text-2xl font-bold text-pm-gold">{selectedModel.name}</h2>
                                            <p className="text-pm-off-white/60">
                                                {existingPhotos.length} photo(s) dans le portfolio
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                {message && (
                                    <div className={`p-4 rounded-lg flex items-center gap-3 ${
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
                                    <PhotoUpload
                                        onUpload={handleUpload}
                                        onDelete={handleDeletePhoto}
                                        existingPhotos={existingPhotos}
                                        maxPhotos={50}
                                        maxSize={15} // 15MB
                                        acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                                        disabled={uploading}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-900/50 border border-pm-gold/20 rounded-lg p-12 text-center">
                                <CameraIcon className="w-16 h-16 text-pm-off-white/40 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-pm-gold mb-2">Sélectionnez un mannequin</h3>
                                <p className="text-pm-off-white/60">
                                    Choisissez un mannequin dans la liste pour commencer à gérer ses photos
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPhotoUpload;
