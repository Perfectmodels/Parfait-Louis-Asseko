
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import {
    ChevronLeftIcon, CloudIcon, FolderPlusIcon, InformationCircleIcon,
    DocumentIcon, PhotoIcon, ArrowPathIcon, ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import GoogleDriveUploader from '../components/GoogleDriveUploader';
import { googleDriveService, GoogleDriveFile } from '../utils/googleDriveService';

const AdminGoogleDrive: React.FC = () => {
    const [files, setFiles] = useState<GoogleDriveFile[]>([]);
    const [isLoadingFiles, setIsLoadingFiles] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [creationStatus, setCreationStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    const fetchFiles = async () => {
        setIsLoadingFiles(true);
        try {
            const result = await googleDriveService.listFiles();
            setFiles(result);
        } catch (err) {
            console.error("Error fetching files:", err);
        } finally {
            setIsLoadingFiles(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleCreateFolder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;

        setIsCreatingFolder(true);
        setCreationStatus(null);
        try {
            const folderId = await googleDriveService.createFolder(newFolderName);
            setCreationStatus({ type: 'success', msg: `Dossier créé avec succès ! ID: ${folderId}` });
            setNewFolderName('');
            fetchFiles(); // Refresh list to show new folder
        } catch (err: any) {
            setCreationStatus({ type: 'error', msg: err.message || "Erreur lors de la création du dossier." });
        } finally {
            setIsCreatingFolder(false);
        }
    };

    return (
        <div className="bg-pm-dark text-pm-off-white min-h-screen py-20">
            <SEO title="Admin - Google Drive" noIndex />

            <div className="container mx-auto px-6 max-w-4xl">
                <div className="mb-12">
                    <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                        <ChevronLeftIcon className="w-5 h-5" />
                        Retour au Dashboard
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-pm-gold/20 rounded-2xl border border-pm-gold/20">
                            <CloudIcon className="w-8 h-8 text-pm-gold" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-playfair font-bold text-white">Google Drive</h1>
                            <p className="text-pm-off-white/50">Gérez vos fichiers et dossiers directement sur Google Drive.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Upload Section */}
                    <div className="space-y-6">
                        <GoogleDriveUploader label="Uploader un fichier" onUploadSuccess={() => fetchFiles()} />

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                            <div className="flex gap-3">
                                <InformationCircleIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-blue-200">Guide</p>
                                    <p className="text-[10px] text-blue-300/70 leading-relaxed">
                                        Les fichiers sont envoyés dans votre espace Google Drive personnel. Assurez-vous d'avoir les variables d'environnement configurées.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Folder Management Section */}
                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-pm-gold mb-6 flex items-center gap-2">
                                <FolderPlusIcon className="w-5 h-5" />
                                Créer un dossier
                            </h3>

                            <form onSubmit={handleCreateFolder} className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-pm-off-white/40 block mb-2">Nom du dossier</label>
                                    <input
                                        type="text"
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        placeholder="ex: Portfolio 2024"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-pm-gold outline-none transition-colors"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isCreatingFolder || !newFolderName}
                                    className="w-full bg-pm-gold text-pm-dark py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isCreatingFolder ? 'Création...' : 'Créer le dossier'}
                                </button>
                            </form>

                            {creationStatus && (
                                <div className={`mt-4 p-3 rounded-lg text-xs ${creationStatus.type === 'success' ? 'bg-green-500/10 text-green-300 border border-green-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'}`}>
                                    {creationStatus.msg}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Files List */}
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-xl font-bold font-playfair text-white flex items-center gap-3">
                            <DocumentIcon className="w-5 h-5 text-pm-gold" />
                            Fichiers Récents
                        </h2>
                        <button
                            onClick={fetchFiles}
                            disabled={isLoadingFiles}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
                        >
                            <ArrowPathIcon className={`w-5 h-5 text-pm-gold ${isLoadingFiles ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-pm-off-white/40">Nom</th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-pm-off-white/40">Type</th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-pm-off-white/40">Modifié</th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-pm-off-white/40 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoadingFiles && files.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-pm-off-white/40 italic">
                                            Chargement des fichiers...
                                        </td>
                                    </tr>
                                ) : files.length > 0 ? (
                                    files.map((file) => (
                                        <tr key={file.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {file.thumbnailLink ? (
                                                        <img src={file.thumbnailLink} alt="" className="w-8 h-8 rounded object-cover border border-white/10" />
                                                    ) : file.mimeType.includes('image') ? (
                                                        <PhotoIcon className="w-8 h-8 text-pm-gold/40" />
                                                    ) : (
                                                        <DocumentIcon className="w-8 h-8 text-pm-off-white/30" />
                                                    )}
                                                    <span className="text-sm font-medium text-white truncate max-w-[200px] md:max-w-xs block" title={file.name}>{file.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] uppercase tracking-widest text-pm-off-white/40">
                                                    {file.mimeType.split('/').pop()?.replace('vnd.google-apps.', '').replace('vnd.google-makersuite.', '')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs text-pm-off-white/60">
                                                    {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <a
                                                    href={file.webViewLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-pm-gold/10 hover:bg-pm-gold text-pm-gold hover:text-pm-dark rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                                                >
                                                    Ouvrir <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-pm-off-white/40 italic">
                                            Aucun fichier trouvé.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminGoogleDrive;
