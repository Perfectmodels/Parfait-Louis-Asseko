
import React, { useState, useRef } from 'react';
import { dropboxService, DropboxFile } from '../utils/dropboxService';
import { CloudArrowUpIcon, CheckCircleIcon, ExclamationCircleIcon, ArrowPathIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface DropboxUploaderProps {
    onUploadSuccess?: (file: DropboxFile) => void;
    path?: string;
    label?: string;
}

const DropboxUploader: React.FC<DropboxUploaderProps> = ({
    onUploadSuccess,
    path = '',
    label = "Uploader vers Dropbox"
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<DropboxFile | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isAuthed = dropboxService.isAuthenticated();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setStatus('idle');
        setErrorMessage(null);

        try {
            const result = await dropboxService.uploadFile(file, path);
            setUploadedFile(result);
            setStatus('success');
            if (onUploadSuccess) onUploadSuccess(result);
        } catch (err: any) {
            console.error("Dropbox Upload Error:", err);
            setStatus('error');
            setErrorMessage(err.message || "Une erreur est survenue lors de l'upload.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const triggerUpload = () => {
        if (!isAuthed) {
            window.location.href = dropboxService.getAuthUrl();
            return;
        }
        fileInputRef.current?.click();
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-pm-gold mb-4">{label}</h3>

            <div
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-colors group cursor-pointer ${isAuthed ? 'border-white/10 hover:border-pm-gold/50' : 'border-red-500/20 bg-red-500/5'
                    }`}
                onClick={triggerUpload}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                {!isAuthed ? (
                    <div className="flex flex-col items-center text-center">
                        <LockClosedIcon className="w-12 h-12 text-red-400 mb-3" />
                        <p className="text-sm text-red-200 font-bold underline">Connexion Dropbox Requise</p>
                        <p className="text-[10px] text-red-300/50 mt-2 uppercase tracking-widest">Cliquez pour autoriser l'accès</p>
                    </div>
                ) : isUploading ? (
                    <div className="flex flex-col items-center">
                        <ArrowPathIcon className="w-12 h-12 text-pm-gold animate-spin mb-3" />
                        <p className="text-sm text-pm-off-white/70">Upload en cours...</p>
                    </div>
                ) : status === 'success' ? (
                    <div className="flex flex-col items-center text-center">
                        <CheckCircleIcon className="w-12 h-12 text-green-500 mb-3" />
                        <p className="text-sm text-white font-bold">Fichier envoyé !</p>
                        {uploadedFile && (
                            <a
                                href={uploadedFile.sharing_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-pm-gold hover:underline mt-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Voir le lien Dropbox
                            </a>
                        )}
                        <button
                            className="mt-4 text-[10px] uppercase tracking-widest text-pm-off-white/40 hover:text-white"
                            onClick={(e) => { e.stopPropagation(); setStatus('idle'); }}
                        >
                            En envoyer un autre
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center">
                        <CloudArrowUpIcon className="w-12 h-12 text-pm-off-white/30 group-hover:text-pm-gold transition-colors mb-3" />
                        <p className="text-sm text-pm-off-white/70 group-hover:text-pm-off-white transition-colors">
                            Cliquez pour uploader un fichier
                        </p>
                        <p className="text-[10px] text-pm-off-white/30 mt-2 uppercase tracking-tighter">
                            Sera sauvegardé dans votre Dropbox
                        </p>
                    </div>
                )}
            </div>

            {status === 'error' && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                    <ExclamationCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs text-red-200 font-bold">Erreur Dropbox</p>
                        <p className="text-[10px] text-red-300/70 leading-relaxed">{errorMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropboxUploader;
