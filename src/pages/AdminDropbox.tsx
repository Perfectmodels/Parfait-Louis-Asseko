
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import {
    ChevronLeftIcon, CloudIcon, ArrowPathIcon,
    ArrowTopRightOnSquareIcon, DocumentIcon, ExclamationTriangleIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import DropboxUploader from '../components/DropboxUploader';
import { dropboxService, DropboxFile } from '../utils/dropboxService';

const AdminDropbox: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [files, setFiles] = useState<DropboxFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthed, setIsAuthed] = useState(dropboxService.isAuthenticated());

    // Gestion du callback OAuth
    useEffect(() => {
        if (location.hash || location.search) {
            const params = new URLSearchParams(location.hash.substring(1) || location.search);
            const accessToken = params.get('access_token');
            if (accessToken) {
                dropboxService.setToken(accessToken);
                setIsAuthed(true);
                navigate('/admin/dropbox', { replace: true });
            }
        }
    }, [location, navigate]);

    const fetchFiles = async () => {
        if (!isAuthed) return;
        setIsLoading(true);
        try {
            const result = await dropboxService.listFiles();
            setFiles(result);
        } catch (err) {
            console.error("Error fetching dropbox files:", err);
            if ((err as any).status === 401) {
                dropboxService.logout();
                setIsAuthed(false);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthed) {
            fetchFiles();
        }
    }, [isAuthed]);

    const handleLogout = () => {
        dropboxService.logout();
        setIsAuthed(false);
        setFiles([]);
    };

    return (
        <div className="bg-pm-dark text-pm-off-white min-h-screen py-20">
            <SEO title="Admin - Dropbox" noIndex />

            <div className="container mx-auto px-6 max-w-4xl">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Dashboard
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-600/20 rounded-2xl border border-blue-600/20">
                                <CloudIcon className="w-8 h-8 text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-playfair font-bold text-white">Dropbox</h1>
                                <p className="text-pm-off-white/50">Gérez vos fichiers via l'intégration Dropbox.</p>
                            </div>
                        </div>
                    </div>

                    {isAuthed && (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                            <ArrowRightOnRectangleIcon className="w-4 h-4" /> Déconnecter Dropbox
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="md:col-span-2">
                        <DropboxUploader onUploadSuccess={() => fetchFiles()} />
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-pm-gold mb-4">Statut API</h3>
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${isAuthed ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                <span className="text-xs font-bold">{isAuthed ? 'Connecté à Dropbox' : 'Déconnecté'}</span>
                            </div>
                            {!isAuthed && (
                                <p className="text-[10px] text-pm-off-white/40 mt-3 leading-relaxed">
                                    L'authentification est requise pour uploader et lister vos fichiers.
                                </p>
                            )}
                        </div>

                        <div className="bg-pm-gold/5 border border-pm-gold/10 rounded-2xl p-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-pm-gold mb-2">Note Importante</h3>
                            <p className="text-[10px] text-pm-off-white/60 leading-relaxed italic">
                                Les liens générés après l'upload sont directs (?raw=1) pour une utilisation immédiate dans vos fiches ou articles.
                            </p>
                        </div>
                    </div>
                </div>

                {/* File List */}
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-xl font-bold font-playfair text-white flex items-center gap-3">
                            <DocumentIcon className="w-5 h-5 text-blue-400" />
                            Fichiers Dropbox
                        </h2>
                        {isAuthed && (
                            <button
                                onClick={fetchFiles}
                                disabled={isLoading}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
                            >
                                <ArrowPathIcon className={`w-5 h-5 text-pm-gold ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                        )}
                    </div>

                    {!isAuthed ? (
                        <div className="p-20 text-center space-y-4">
                            <ExclamationTriangleIcon className="w-12 h-12 text-pm-off-white/20 mx-auto" />
                            <p className="text-pm-off-white/40 italic text-sm">Veuillez vous connecter pour voir vos fichiers.</p>
                            <button
                                onClick={() => window.location.href = dropboxService.getAuthUrl()}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-500 transition-all"
                            >
                                Se connecter à Dropbox
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-pm-off-white/40">Nom</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-pm-off-white/40">Date</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-pm-off-white/40 text-right">Preview</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {isLoading && files.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center text-pm-off-white/40 italic">Chargement...</td>
                                        </tr>
                                    ) : files.length > 0 ? (
                                        files.map((file) => (
                                            <tr key={file.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-medium text-white block truncate max-w-xs">{file.name}</span>
                                                    <span className="text-[9px] text-pm-off-white/30 uppercase tracking-tighter">{file.path_display}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs text-pm-off-white/60">
                                                        {new Date(file.client_modified).toLocaleDateString()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => window.open(`https://www.dropbox.com/home${file.path_display}`, '_blank')}
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-pm-off-white/70 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                                                    >
                                                        Ouvrir <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center text-pm-off-white/40 italic">Aucun fichier trouvé.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDropbox;
