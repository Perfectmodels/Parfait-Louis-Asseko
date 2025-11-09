
import React, { useState, useMemo } from 'react';
import { useModels } from '../../hooks/useModels';
import { Model, ContactInfo } from '../../types';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import {
    ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon, EyeIcon, EyeSlashIcon, PrinterIcon,
    MagnifyingGlassIcon, AdjustmentsHorizontalIcon, ChevronDownIcon, ChevronUpIcon
} from '@heroicons/react/24/outline';
import ModelForm from '../../components/ModelForm';
import toast from 'react-hot-toast';

const generateModelSheetHtml = (model: Model, siteConfig: any, contactInfo: ContactInfo): string => {
    const portfolioImagesHtml = (model.portfolioImages || []).slice(0, 4).map(img =>
        `<img src="${img}" alt="Portfolio" style="width: 100%; aspect-ratio: 3/4; object-fit: cover;" />`
    ).join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #fff; }
                .sheet { padding: 40px; }
                .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 16px; }
                .header h1 { font-family: 'Times New Roman', Times, serif; font-size: 48px; color: #111; margin: 0; }
                .header p { color: #666; font-size: 18px; margin: 0; }
                .header img { height: 80px; width: auto; }
                .main { margin-top: 32px; display: grid; grid-template-columns: 1fr 2fr; gap: 32px; }
                .profile-pic { width: 100%; aspect-ratio: 3/4; object-fit: cover; border: 4px solid #f0f0f0; }
                .section { margin-bottom: 24px; }
                .section h2 { font-family: 'Times New Roman', Times, serif; font-size: 22px; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
                .info-item strong { display: block; color: #777; font-size: 12px; font-weight: bold; text-transform: uppercase; }
                .info-item span { font-size: 14px; }
                .portfolio { margin-top: 32px; }
                .portfolio-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 16px; }
                .experience { margin-top: 32px; font-size: 12px; color: #555; line-height: 1.6; }
                .footer { margin-top: 48px; padding-top: 24px; border-top: 2px solid #eee; text-align: center; font-size: 10px; color: #888; }
                .footer p { margin: 0; }
                .footer span { margin: 0 8px; }
            </style>
        </head>
        <body>
            <div class="sheet">
                <header class="header">
                    <div>
                        <h1>${model.name}</h1>
                        <p>Mannequin Professionnel</p>
                    </div>
                    ${siteConfig?.logo ? `<img src="${siteConfig.logo}" alt="Logo" />` : ''}
                </header>
                <main class="main">
                    <div>
                        <img src="${model.imageUrl}" alt="${model.name}" class="profile-pic" />
                    </div>
                    <div class="space-y-6">
                        <div class="section">
                            <h2>Détails Personnels</h2>
                            <div class="info-grid">
                                <div class="info-item"><strong>Âge</strong><span>${model.age || 'N/A'} ans</span></div>
                                <div class="info-item"><strong>Genre</strong><span>${model.gender}</span></div>
                                <div class="info-item"><strong>Lieu</strong><span>${model.location || 'N/A'}</span></div>
                            </div>
                        </div>
                        <div class="section">
                            <h2>Mensurations</h2>
                            <div class="info-grid">
                                <div class="info-item"><strong>Taille</strong><span>${model.height}</span></div>
                                <div class="info-item"><strong>Poitrine</strong><span>${model.measurements.chest}</span></div>
                                <div class="info-item"><strong>Taille (vêt.)</strong><span>${model.measurements.waist}</span></div>
                                <div class="info-item"><strong>Hanches</strong><span>${model.measurements.hips}</span></div>
                                <div class="info-item"><strong>Pointure</strong><span>${model.measurements.shoeSize} (EU)</span></div>
                            </div>
                        </div>
                        <div class="section">
                            <h2>Contact Agence</h2>
                            <div class="info-grid">
                                <div class="info-item"><strong>Email</strong><span>${contactInfo.email || 'N/A'}</span></div>
                                <div class="info-item"><strong>Téléphone</strong><span>${contactInfo.phone || 'N/A'}</span></div>
                            </div>
                        </div>
                    </div>
                </main>
                ${(model.portfolioImages && model.portfolioImages.length > 0) ? `
                <section class="portfolio">
                    <h2>Portfolio</h2>
                    <div class="portfolio-grid">${portfolioImagesHtml}</div>
                </section>` : ''}
                <section class="experience">
                    <h2>Expérience & Parcours</h2>
                    <p>${model.experience} ${model.journey}</p>
                </section>
                <footer class="footer">
                    <p style="font-size: 16px; font-weight: bold; color: #333;">Perfect Models Management</p>
                    <div>
                        <span>${contactInfo.email}</span> |
                        <span>${contactInfo.phone}</span> |
                        <span>${contactInfo.address}</span>
                    </div>
                </footer>
            </div>
        </body>
        </html>
    `;
};

const AdminModels: React.FC = () => {
    const { data, saveData } = useData();
    const {
        models: paginatedModels,
        totalPages,
        currentPage,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        levelFilter,
        setLevelFilter,
        statusFilter,
        setStatusFilter,
        handleUpdateModel,
    } = useModels();

    const [editingModel, setEditingModel] = useState<Model | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedModels, setSelectedModels] = useState<string[]>([]);

    const handleFormSave = async (modelToSave: Model) => {
        if (!data) return;

        let updatedModels;
        if (isCreating) {
            if (data.models.some(m => m.username === modelToSave.username)) {
                toast.error("Erreur : Cet identifiant (matricule) est déjà utilisé.");
                return;
            }
            if (modelToSave.id && data.models.some(m => m.id === modelToSave.id)) {
                toast.error("Erreur : Cet ID est déjà utilisé.");
                return;
            }
            if (!modelToSave.id) {
                modelToSave.id = `${modelToSave.name.toLowerCase().replace(/ /g, '-')}-${Date.now()}`;
            }
            updatedModels = [...data.models, modelToSave];
        } else {
            updatedModels = data.models.map(m => m.id === modelToSave.id ? modelToSave : m);
        }

        try {
            await handleUpdateModel(updatedModels);
            toast.success(`Mannequin ${isCreating ? 'créé' : 'mis à jour'} avec succès.`);
            setEditingModel(null);
            setIsCreating(false);
        } catch (error) {
            toast.error("Une erreur est survenue lors de la sauvegarde.");
        }
    };

    const handleDelete = async (modelIds: string[]) => {
        if (!data) return;
        const modelsToDelete = data.models.filter(m => modelIds.includes(m.id)).map(m => m.name).join(', ');
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${modelIds.length > 1 ? 'ces mannequins' : 'ce mannequin'} : ${modelsToDelete} ? Cette action est irréversible.`)) {
            const updatedModels = data.models.filter(m => !modelIds.includes(m.id));
            try {
                await handleUpdateModel(updatedModels);
                toast.success("Mannequin(s) supprimé(s) avec succès.");
                setSelectedModels([]);
            } catch (error) {
                toast.error("Erreur lors de la suppression.");
            }
        }
    };

    const handleTogglePublic = async (modelIds: string[], isPublic: boolean) => {
        if (!data) return;
        const updatedModels = data.models.map(m =>
            modelIds.includes(m.id) ? { ...m, isPublic } : m
        );
        try {
            await handleUpdateModel(updatedModels);
            toast.success(`Statut de ${modelIds.length} mannequin(s) mis à jour.`);
            setSelectedModels([]);
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du statut.");
        }
    };

    const handleStartCreate = () => {
        setIsCreating(true);
        const newModelTemplate: Model = {
            id: '',
            name: '',
            username: '',
            password: '',
            level: 'Débutant',
            gender: 'Femme',
            height: '1m',
            imageUrl: '',
            isPublic: false,
            measurements: { chest: '', waist: '', hips: '', shoeSize: '' },
            categories: [],
            experience: '',
            journey: '',
            quizScores: {}
        };
        setEditingModel(newModelTemplate);
    };

    const handlePrint = (model: Model) => {
        if (!data?.siteConfig || !data?.contactInfo) {
            toast.error("Les informations du site ne sont pas chargées.");
            return;
        }
        const htmlContent = generateModelSheetHtml(model, data.siteConfig, data.contactInfo);
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
        } else {
            toast.error("Veuillez autoriser les pop-ups pour imprimer la fiche.");
        }
    };

    const handleSelectModel = (modelId: string) => {
        setSelectedModels(prev =>
            prev.includes(modelId) ? prev.filter(id => id !== modelId) : [...prev, modelId]
        );
    };

    const handleSelectAll = () => {
        if (selectedModels.length === paginatedModels.length) {
            setSelectedModels([]);
        } else {
            setSelectedModels(paginatedModels.map(m => m.id));
        }
    };

    if (editingModel) {
        return (
            <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
                <div className="container mx-auto px-6 max-w-4xl">
                    <button onClick={() => { setEditingModel(null); setIsCreating(false); }} className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                        <ChevronLeftIcon className="w-5 h-5" />
                        Retour à la liste
                    </button>
                    <ModelForm
                        model={editingModel}
                        onSave={handleFormSave}
                        onCancel={() => { setEditingModel(null); setIsCreating(false); }}
                        isCreating={isCreating}
                        mode="admin"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Gérer les Mannequins" noIndex />
            <div className="container mx-auto px-6">
                <div className="admin-page-header">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Dashboard
                        </Link>
                        <h1 className="admin-page-title">Gérer les Mannequins</h1>
                        <p className="admin-page-subtitle">Ajoutez, modifiez ou supprimez les profils des mannequins.</p>
                    </div>
                    <button onClick={handleStartCreate} className="action-btn !flex !items-center !gap-2 !px-4 !py-2">
                        <PlusIcon className="w-5 h-5" /> Ajouter un Mannequin
                    </button>
                </div>

                <div className="admin-section-wrapper">
                    {/* Search and Filters */}
                    <div className="mb-4 p-4 bg-black/30 rounded-lg flex flex-wrap items-center gap-4">
                        <div className="relative flex-grow">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-pm-off-white/50" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="admin-input pl-10 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <AdjustmentsHorizontalIcon className="w-5 h-5 text-pm-off-white/50" />
                            <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="admin-input">
                                <option value="all">Tous les niveaux</option>
                                <option value="Pro">Pro</option>
                                <option value="Débutant">Débutant</option>
                            </select>
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="admin-input">
                                <option value="all">Tous les statuts</option>
                                <option value="public">Public</option>
                                <option value="private">Privé</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Bulk Actions */}
                    {selectedModels.length > 0 && (
                         <div className="mb-4 p-3 bg-pm-gold/10 rounded-lg flex items-center justify-between gap-4">
                            <p className="text-sm font-semibold">{selectedModels.length} mannequin(s) sélectionné(s)</p>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleTogglePublic(selectedModels, true)} className="action-btn text-xs">Rendre Public</button>
                                <button onClick={() => handleTogglePublic(selectedModels, false)} className="action-btn text-xs">Rendre Privé</button>
                                <button onClick={() => handleDelete(selectedModels)} className="action-btn !bg-red-500/20 !text-red-300 text-xs">Supprimer</button>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th className="w-12"><input type="checkbox" onChange={handleSelectAll} checked={selectedModels.length === paginatedModels.length && paginatedModels.length > 0} className="admin-checkbox"/></th>
                                    <th>Photo</th>
                                    <th>Nom</th>
                                    <th>Niveau</th>
                                    <th>Public</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedModels.map((model) => (
                                    <tr key={model.id} className={selectedModels.includes(model.id) ? 'bg-pm-gold/5' : ''}>
                                        <td><input type="checkbox" checked={selectedModels.includes(model.id)} onChange={() => handleSelectModel(model.id)} className="admin-checkbox"/></td>
                                        <td><img src={model.imageUrl} alt={model.name} className="w-12 h-16 object-cover rounded" /></td>
                                        <td className="font-semibold">{model.name}</td>
                                        <td><span className={`px-2 py-0.5 text-xs rounded-full ${model.level === 'Pro' ? 'bg-pm-gold/20 text-pm-gold' : 'bg-blue-500/20 text-blue-300'}`}>{model.level}</span></td>
                                        <td>
                                            <button onClick={() => handleTogglePublic([model.id], !model.isPublic)} title={model.isPublic ? "Rendre privé" : "Rendre public"}>
                                                {model.isPublic ? <EyeIcon className="w-6 h-6 text-green-500" /> : <EyeSlashIcon className="w-6 h-6 text-pm-off-white/50" />}
                                            </button>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handlePrint(model)} className="p-2 text-pm-gold/70 hover:text-pm-gold" title="Imprimer la Fiche">
                                                    <PrinterIcon className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => setEditingModel(model)} className="p-2 text-pm-gold/70 hover:text-pm-gold" title="Modifier"><PencilIcon className="w-5 h-5" /></button>
                                                <button onClick={() => handleDelete([model.id])} className="p-2 text-red-500/70 hover:text-red-500" title="Supprimer"><TrashIcon className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-4 flex justify-between items-center">
                            <p className="text-sm text-pm-off-white/60">Page {currentPage} sur {totalPages}</p>
                            <div className="flex gap-2">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="pagination-btn"><ChevronLeftIcon className="w-5 h-5"/></button>
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="pagination-btn"><ChevronUpIcon className="w-5 h-5 transform rotate-90" /></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminModels;
