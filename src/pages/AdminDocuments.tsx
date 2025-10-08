import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { db } from '../firebase';
import { ref, set } from 'firebase/database';
import { 
    DocumentIcon, 
    PlusIcon, 
    TrashIcon, 
    ArrowDownTrayIcon,
    EyeIcon,
    PencilIcon,
    FolderIcon
} from '@heroicons/react/24/outline';
import { Document as DocumentType } from '../types';

const AdminDocuments: React.FC = () => {
    const { data, reloadData } = useData();
    const documents = data?.documents || [];
    
    const [showModal, setShowModal] = useState(false);
    const [editingDoc, setEditingDoc] = useState<DocumentType | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('tous');
    const [formData, setFormData] = useState<Partial<DocumentType>>({
        title: '',
        description: '',
        category: 'autre',
        fileUrl: '',
        fileName: '',
        isPublic: false,
        accessibleTo: ['admin']
    });

    const categories = [
        { id: 'tous', label: 'Tous', icon: '📁' },
        { id: 'contrat', label: 'Contrats', icon: '📄' },
        { id: 'facture', label: 'Factures', icon: '🧾' },
        { id: 'planning', label: 'Plannings', icon: '📅' },
        { id: 'formation', label: 'Formation', icon: '📚' },
        { id: 'règlement', label: 'Règlements', icon: '⚖️' },
        { id: 'autre', label: 'Autres', icon: '📌' }
    ];

    const categoryColors: Record<string, string> = {
        'contrat': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'facture': 'bg-green-500/20 text-green-400 border-green-500/30',
        'planning': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        'formation': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'règlement': 'bg-red-500/20 text-red-400 border-red-500/30',
        'autre': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };

    const handleOpenModal = (doc?: DocumentType) => {
        if (doc) {
            setEditingDoc(doc);
            setFormData(doc);
        } else {
            setEditingDoc(null);
            setFormData({
                title: '',
                description: '',
                category: 'autre',
                fileUrl: '',
                fileName: '',
                isPublic: false,
                accessibleTo: ['admin']
            });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.title || !formData.fileUrl) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        try {
            const docData: DocumentType = {
                id: editingDoc?.id || `doc-${Date.now()}`,
                title: formData.title || '',
                description: formData.description || '',
                category: formData.category || 'autre',
                fileUrl: formData.fileUrl || '',
                fileName: formData.fileName || formData.title || 'document',
                fileSize: formData.fileSize,
                fileType: formData.fileType || getFileType(formData.fileUrl || ''),
                uploadedBy: sessionStorage.getItem('user_name') || 'Admin',
                uploadedAt: editingDoc?.uploadedAt || new Date().toISOString(),
                isPublic: formData.isPublic !== undefined ? formData.isPublic : false,
                accessibleTo: formData.accessibleTo || ['admin']
            };

            const updatedDocs = editingDoc
                ? documents.map((d: DocumentType) => d.id === editingDoc.id ? docData : d)
                : [...documents, docData];

            await set(ref(db, 'documents'), updatedDocs);
            await reloadData();
            setShowModal(false);
            alert('Document enregistré avec succès !');
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement:', error);
            alert('Erreur lors de l\'enregistrement du document');
        }
    };

    const handleDelete = async (docId: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
            try {
                const updatedDocs = documents.filter((d: DocumentType) => d.id !== docId);
                await set(ref(db, 'documents'), updatedDocs);
                await reloadData();
                alert('Document supprimé avec succès !');
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                alert('Erreur lors de la suppression du document');
            }
        }
    };

    const getFileType = (url: string): string => {
        const extension = url.split('.').pop()?.toLowerCase();
        if (['pdf'].includes(extension || '')) return 'PDF';
        if (['doc', 'docx'].includes(extension || '')) return 'Word';
        if (['xls', 'xlsx'].includes(extension || '')) return 'Excel';
        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) return 'Image';
        return 'Fichier';
    };

    const formatFileSize = (bytes?: number): string => {
        if (!bytes) return 'N/A';
        const kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(2)} KB`;
        return `${(kb / 1024).toFixed(2)} MB`;
    };

    const filteredDocuments = selectedCategory === 'tous'
        ? documents
        : documents.filter((doc: DocumentType) => doc.category === selectedCategory);

    const handleAccessChange = (role: 'admin' | 'model' | 'jury' | 'beginner') => {
        const current = formData.accessibleTo || [];
        const updated = current.includes(role)
            ? current.filter(r => r !== role)
            : [...current, role];
        setFormData({ ...formData, accessibleTo: updated });
    };

    return (
        <div className="min-h-screen bg-pm-dark p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="admin-page-header">
                    <div>
                        <h1 className="admin-page-title">Gestion des Documents</h1>
                        <p className="admin-page-subtitle">Téléchargez et gérez les documents de l'agence</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-pm-gold text-black font-bold rounded-lg hover:bg-pm-gold/90 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Nouveau Document
                    </button>
                </div>

                {/* Category Filters */}
                <div className="mb-8 flex flex-wrap gap-3">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`
                                px-4 py-2 rounded-lg font-semibold text-sm transition-all
                                ${selectedCategory === cat.id
                                    ? 'bg-pm-gold text-black'
                                    : 'bg-black border border-pm-gold/20 text-pm-off-white hover:border-pm-gold'
                                }
                            `}
                        >
                            <span className="mr-2">{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Documents Grid */}
                {filteredDocuments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDocuments.map((doc: DocumentType) => (
                            <div
                                key={doc.id}
                                className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden hover:border-pm-gold transition-all group"
                            >
                                <div className={`p-4 ${categoryColors[doc.category]} border-b`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <DocumentIcon className="w-6 h-6" />
                                            <span className="text-xs uppercase font-bold">{doc.category}</span>
                                        </div>
                                        <span className="text-xs px-2 py-1 bg-black/30 rounded">
                                            {doc.fileType}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 space-y-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-pm-gold line-clamp-2 group-hover:text-pm-off-white transition-colors">
                                            {doc.title}
                                        </h3>
                                        <p className="text-sm text-pm-off-white/70 line-clamp-2 mt-1">
                                            {doc.description}
                                        </p>
                                    </div>

                                    <div className="text-xs text-pm-off-white/60 space-y-1">
                                        <p>📎 {doc.fileName}</p>
                                        <p>📊 {formatFileSize(doc.fileSize)}</p>
                                        <p>👤 {doc.uploadedBy}</p>
                                        <p>📅 {new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}</p>
                                        {!doc.isPublic && (
                                            <p className="text-orange-400">🔒 Privé - {doc.accessibleTo?.join(', ')}</p>
                                        )}
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <a
                                            href={doc.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-pm-off-white/10 hover:bg-pm-off-white/20 rounded text-sm text-pm-off-white transition-colors"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                            Voir
                                        </a>
                                        <a
                                            href={doc.fileUrl}
                                            download
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-pm-gold/20 hover:bg-pm-gold/30 rounded text-sm text-pm-gold transition-colors"
                                        >
                                            <ArrowDownTrayIcon className="w-4 h-4" />
                                            Télécharger
                                        </a>
                                        <button
                                            onClick={() => handleOpenModal(doc)}
                                            className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400 transition-colors"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(doc.id)}
                                            className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 transition-colors"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <FolderIcon className="w-24 h-24 text-pm-off-white/20 mx-auto mb-4" />
                        <p className="text-pm-off-white/60">Aucun document dans cette catégorie</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-pm-dark border border-pm-gold/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-pm-dark border-b border-pm-gold/30 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-playfair text-pm-gold">
                                {editingDoc ? 'Modifier le document' : 'Nouveau document'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-pm-off-white/60 hover:text-pm-gold transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <label className="admin-label">Titre du document *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="admin-input"
                                    placeholder="Ex: Contrat mannequin 2024"
                                />
                            </div>

                            <div>
                                <label className="admin-label">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="admin-textarea"
                                    rows={3}
                                    placeholder="Description du document"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="admin-label">Catégorie</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                        className="admin-input"
                                    >
                                        <option value="contrat">Contrat</option>
                                        <option value="facture">Facture</option>
                                        <option value="planning">Planning</option>
                                        <option value="formation">Formation</option>
                                        <option value="règlement">Règlement</option>
                                        <option value="autre">Autre</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="admin-label">Nom du fichier</label>
                                    <input
                                        type="text"
                                        value={formData.fileName}
                                        onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                                        className="admin-input"
                                        placeholder="document.pdf"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="admin-label">URL du fichier * (Google Drive, Dropbox, etc.)</label>
                                <input
                                    type="url"
                                    value={formData.fileUrl}
                                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                                    className="admin-input"
                                    placeholder="https://drive.google.com/..."
                                />
                                <p className="text-xs text-pm-off-white/50 mt-1">
                                    💡 Conseil : Utilisez Google Drive ou Dropbox et partagez le lien public
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="admin-label">Taille (octets)</label>
                                    <input
                                        type="number"
                                        value={formData.fileSize || ''}
                                        onChange={(e) => setFormData({ ...formData, fileSize: parseInt(e.target.value) })}
                                        className="admin-input"
                                        placeholder="1024000"
                                    />
                                </div>

                                <div>
                                    <label className="admin-label">Type de fichier</label>
                                    <input
                                        type="text"
                                        value={formData.fileType || ''}
                                        onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                                        className="admin-input"
                                        placeholder="PDF"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <input
                                        type="checkbox"
                                        id="isPublic"
                                        checked={formData.isPublic}
                                        onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="isPublic" className="text-pm-off-white">
                                        Document public (visible par tous)
                                    </label>
                                </div>

                                {!formData.isPublic && (
                                    <div className="bg-black/50 p-4 rounded-lg">
                                        <label className="admin-label">Accessible aux rôles :</label>
                                        <div className="grid grid-cols-2 gap-3 mt-2">
                                            {(['admin', 'model', 'jury', 'beginner'] as const).map(role => (
                                                <label key={role} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.accessibleTo?.includes(role)}
                                                        onChange={() => handleAccessChange(role)}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-pm-off-white capitalize">{role}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                                className="px-6 py-3 bg-pm-gold text-black font-bold rounded-lg hover:bg-pm-gold/90 transition-colors"
                            >
                                {editingDoc ? 'Mettre à jour' : 'Créer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDocuments;

