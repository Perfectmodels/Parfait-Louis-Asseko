import React, { useState, useRef, useCallback } from 'react';
import { 
    CameraIcon, 
    PhotoIcon, 
    XMarkIcon, 
    CloudArrowUpIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

interface PhotoUploadProps {
    onUpload: (files: File[]) => Promise<string[]>;
    onDelete?: (url: string) => void;
    existingPhotos?: string[];
    maxPhotos?: number;
    maxSize?: number; // en MB
    acceptedTypes?: string[];
    className?: string;
    disabled?: boolean;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
    onUpload,
    onDelete,
    existingPhotos = [],
    maxPhotos = 10,
    maxSize = 5, // 5MB par défaut
    acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    className = '',
    disabled = false
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
    const [errors, setErrors] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        if (!acceptedTypes.includes(file.type)) {
            return `Type de fichier non supporté. Types acceptés: ${acceptedTypes.join(', ')}`;
        }
        if (file.size > maxSize * 1024 * 1024) {
            return `Fichier trop volumineux. Taille maximale: ${maxSize}MB`;
        }
        return null;
    };

    const handleFiles = useCallback(async (files: FileList) => {
        const fileArray = Array.from(files);
        const validFiles: File[] = [];
        const newErrors: string[] = [];

        // Validation des fichiers
        fileArray.forEach((file, index) => {
            const error = validateFile(file);
            if (error) {
                newErrors.push(`${file.name}: ${error}`);
            } else {
                validFiles.push(file);
            }
        });

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        if (existingPhotos.length + validFiles.length > maxPhotos) {
            setErrors([`Maximum ${maxPhotos} photos autorisées`]);
            return;
        }

        setErrors([]);
        setUploading(true);

        try {
            // Simulation du progrès d'upload
            const progress: Record<string, number> = {};
            validFiles.forEach(file => {
                progress[file.name] = 0;
            });
            setUploadProgress(progress);

            // Upload des fichiers
            const uploadedUrls = await onUpload(validFiles);
            
            // Nettoyer le progrès
            setUploadProgress({});
            setUploading(false);
        } catch (error) {
            console.error('Erreur lors de l\'upload:', error);
            setErrors(['Erreur lors de l\'upload des photos']);
            setUploading(false);
        }
    }, [onUpload, existingPhotos.length, maxPhotos, maxSize, acceptedTypes]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (!disabled) {
            const files = e.dataTransfer.files;
            handleFiles(files);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
    };

    const handleDeletePhoto = (url: string) => {
        if (onDelete) {
            onDelete(url);
        }
    };

    const openFileDialog = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Zone d'upload */}
            <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                        ? 'border-pm-gold bg-pm-gold/10'
                        : disabled
                        ? 'border-gray-600 bg-gray-800/50 cursor-not-allowed'
                        : 'border-pm-gold/50 hover:border-pm-gold hover:bg-pm-gold/5 cursor-pointer'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={openFileDialog}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={acceptedTypes.join(',')}
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={disabled}
                />

                <div className="space-y-4">
                    <div className="flex justify-center">
                        {uploading ? (
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold"></div>
                        ) : (
                            <CloudArrowUpIcon className="w-12 h-12 text-pm-gold" />
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-pm-gold mb-2">
                            {uploading ? 'Upload en cours...' : 'Ajouter des photos'}
                        </h3>
                        <p className="text-pm-off-white/70">
                            Glissez-déposez vos photos ici ou cliquez pour sélectionner
                        </p>
                        <p className="text-sm text-pm-off-white/50 mt-2">
                            Types acceptés: JPG, PNG, WebP • Max {maxSize}MB par photo • {maxPhotos - existingPhotos.length} photos restantes
                        </p>
                    </div>

                    {uploading && Object.keys(uploadProgress).length > 0 && (
                        <div className="space-y-2">
                            {Object.entries(uploadProgress).map(([filename, progress]) => (
                                <div key={filename} className="text-left">
                                    <div className="flex justify-between text-sm text-pm-off-white/70 mb-1">
                                        <span className="truncate">{filename}</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-pm-gold h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Messages d'erreur */}
            {errors.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                        <h4 className="font-semibold text-red-400">Erreurs d'upload</h4>
                    </div>
                    <ul className="space-y-1">
                        {errors.map((error, index) => (
                            <li key={index} className="text-sm text-red-300">
                                • {error}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Galerie des photos existantes */}
            {existingPhotos.length > 0 && (
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-pm-gold">
                        Photos actuelles ({existingPhotos.length}/{maxPhotos})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {existingPhotos.map((url, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={url}
                                    alt={`Photo ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border border-pm-gold/20"
                                />
                                {onDelete && (
                                    <button
                                        onClick={() => handleDeletePhoto(url)}
                                        className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                        title="Supprimer cette photo"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                )}
                                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                    {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotoUpload;
