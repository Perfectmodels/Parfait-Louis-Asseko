import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Model, ContactInfo } from '../types';
import AdminLayout from '../components/AdminLayout';
import AdminTable from '../components/admin/AdminTable';
import AdminModal from '../components/admin/AdminModal';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon, EyeIcon, EyeSlashIcon, PrinterIcon, FunnelIcon, UsersIcon, AcademicCapIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import ModelForm from '../components/ModelForm'; 

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
    const { data, saveData, isInitialized } = useData();
    const [localModels, setLocalModels] = useState<Model[]>([]);
    const [editingModel, setEditingModel] = useState<Model | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [levelFilter, setLevelFilter] = useState<string>('all');
    const [visibilityFilter, setVisibilityFilter] = useState<string>('all');
    const [sortColumn, setSortColumn] = useState<string>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        if (data?.models) {
            setLocalModels([...data.models].sort((a,b) => a.name.localeCompare(b.name)));
        }
    }, [data?.models, isInitialized]);

    const handleFormSave = async (modelToSave: Model) => {
        if (!data) return;
        let updatedModels;
        
        if (isCreating) {
            if (localModels.some(m => m.username === modelToSave.username)) {
                alert("Erreur : Cet identifiant (matricule) est déjà utilisé.");
                return;
            }
            if (modelToSave.id && localModels.some(m => m.id === modelToSave.id)) {
                 alert("Erreur : Cet ID est déjà utilisé.");
                return;
            }
            if(!modelToSave.id) {
                modelToSave.id = `${modelToSave.name.toLowerCase().replace(/ /g, '-')}-${Date.now()}`;
            }
            updatedModels = [...localModels, modelToSave];
        } else {
            updatedModels = localModels.map(m => m.id === modelToSave.id ? modelToSave : m);
        }
        
        await saveData({ ...data, models: updatedModels.sort((a,b) => a.name.localeCompare(b.name)) });
        alert(`Mannequin ${isCreating ? 'créé' : 'mis à jour'} avec succès.`);

        setEditingModel(null);
        setIsCreating(false);
    };

    const handleDelete = async (modelId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce mannequin ? Cette action est irréversible.")) {
            if (!data) return;
            const updatedModels = localModels.filter(m => m.id !== modelId);
            await saveData({ ...data, models: updatedModels });
            alert("Mannequin supprimé avec succès.");
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

    const handleTogglePublic = async (modelId: string) => {
        if (!data) return;
        const updatedModels = localModels.map(m => 
            m.id === modelId ? { ...m, isPublic: !m.isPublic } : m
        );
        await saveData({ ...data, models: updatedModels });
    };

    const handlePrint = (model: Model) => {
        if (!data?.siteConfig || !data?.contactInfo) {
            alert("Les informations du site ne sont pas chargées.");
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
            alert("Veuillez autoriser les pop-ups pour imprimer la fiche.");
        }
    };

    // Filtrage et tri des données
    const filteredAndSortedModels = useMemo(() => {
        let filtered = localModels.filter(model => {
            const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                model.username.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLevel = levelFilter === 'all' || model.level === levelFilter;
            const matchesVisibility = visibilityFilter === 'all' || 
                                   (visibilityFilter === 'public' && model.isPublic) ||
                                   (visibilityFilter === 'private' && !model.isPublic);
            
            return matchesSearch && matchesLevel && matchesVisibility;
        });

        // Tri
        filtered.sort((a, b) => {
            let aValue = a[sortColumn as keyof Model] || '';
            let bValue = b[sortColumn as keyof Model] || '';
            
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }
            
            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [localModels, searchQuery, levelFilter, visibilityFilter, sortColumn, sortDirection]);

    const handleSort = (column: string, direction: 'asc' | 'desc') => {
        setSortColumn(column);
        setSortDirection(direction);
    };

    // Colonnes pour AdminTable
    const columns = [
        {
            key: 'image',
            label: 'Photo',
            render: (value: any, model: Model) => (
                <div className="flex items-center">
                    <img 
                        src={model.imageUrl} 
                        alt={model.name} 
                        className="w-12 h-16 object-cover rounded-lg border border-pm-gold/20"
                    />
                </div>
            )
        },
        {
            key: 'name',
            label: 'Nom',
            sortable: true,
            render: (value: any, model: Model) => (
                <div>
                    <div className="font-semibold text-pm-off-white">{model.name}</div>
                    <div className="text-sm text-pm-off-white/60">@{model.username}</div>
                </div>
            )
        },
        {
            key: 'level',
            label: 'Niveau',
            sortable: true,
            render: (value: any, model: Model) => (
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    model.level === 'Pro' 
                        ? 'bg-pm-gold/20 text-pm-gold border border-pm-gold/30' 
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                    {model.level}
                </span>
            )
        },
        {
            key: 'isPublic',
            label: 'Visibilité',
            sortable: true,
            render: (value: any, model: Model) => (
                <div className="flex items-center gap-2">
                    {model.isPublic ? (
                        <div className="flex items-center gap-1 text-green-400">
                            <EyeIcon className="w-4 h-4" />
                            <span className="text-sm">Public</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-pm-off-white/60">
                            <EyeSlashIcon className="w-4 h-4" />
                            <span className="text-sm">Privé</span>
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (value: any, model: Model) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleTogglePublic(model.id)}
                        className="p-2 text-pm-gold/70 hover:text-pm-gold hover:bg-pm-gold/10 rounded-lg transition-all duration-200"
                        title={model.isPublic ? "Rendre privé" : "Rendre public"}
                    >
                        {model.isPublic ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={() => handlePrint(model)}
                        className="p-2 text-blue-400/70 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                        title="Imprimer la fiche"
                    >
                        <PrinterIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setEditingModel(model)}
                        className="p-2 text-pm-gold/70 hover:text-pm-gold hover:bg-pm-gold/10 rounded-lg transition-all duration-200"
                        title="Modifier"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(model.id)}
                        className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                        title="Supprimer"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    if (editingModel) {
        return (
            <AdminLayout 
                title={isCreating ? "Ajouter un Mannequin" : "Modifier le Mannequin"} 
                description={isCreating ? "Créer un nouveau profil de mannequin" : `Modifier le profil de ${editingModel.name}`}
                breadcrumbs={[
                    { label: "Mannequins", href: "/admin/models" },
                    { label: isCreating ? "Ajouter" : "Modifier" }
                ]}
            >
                <div className="max-w-4xl mx-auto">
                    <button 
                        onClick={() => { setEditingModel(null); setIsCreating(false); }} 
                        className="inline-flex items-center gap-2 text-pm-gold mb-6 hover:text-yellow-300 transition-colors"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                        Retour à la liste
                    </button>
                    <ModelForm 
                        model={editingModel} 
                        onSave={handleFormSave} 
                        onCancel={() => {setEditingModel(null); setIsCreating(false);}} 
                        isCreating={isCreating}
                        mode="admin"
                    />
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout 
            title="Gestion des Mannequins" 
            description="Ajoutez, modifiez ou supprimez les profils des mannequins"
            breadcrumbs={[
                { label: "Mannequins" }
            ]}
            showSearch={true}
            onSearch={setSearchQuery}
        >
            {/* En-tête avec statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-pm-gold/10 to-pm-gold/5 border border-pm-gold/30 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-pm-gold/20 rounded-lg flex items-center justify-center">
                            <UsersIcon className="w-6 h-6 text-pm-gold" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-pm-gold">{localModels.length}</p>
                            <p className="text-sm text-pm-off-white/70">Total Mannequins</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <EyeIcon className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-400">{localModels.filter(m => m.isPublic).length}</p>
                            <p className="text-sm text-pm-off-white/70">Publics</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <AcademicCapIcon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-400">{localModels.filter(m => m.level === 'Pro').length}</p>
                            <p className="text-sm text-pm-off-white/70">Professionnels</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <UserGroupIcon className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-purple-400">{localModels.filter(m => m.level === 'Débutant').length}</p>
                            <p className="text-sm text-pm-off-white/70">Débutants</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtres et actions */}
            <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        {/* Filtre par niveau */}
                        <div className="flex items-center gap-2">
                            <FunnelIcon className="w-5 h-5 text-pm-gold" />
                            <select
                                value={levelFilter}
                                onChange={(e) => setLevelFilter(e.target.value)}
                                className="bg-pm-off-white/5 border border-pm-gold/30 rounded-lg px-3 py-2 text-pm-off-white text-sm focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                            >
                                <option value="all">Tous les niveaux</option>
                                <option value="Pro">Professionnels</option>
                                <option value="Débutant">Débutants</option>
                            </select>
                        </div>

                        {/* Filtre par visibilité */}
                        <div className="flex items-center gap-2">
                            <select
                                value={visibilityFilter}
                                onChange={(e) => setVisibilityFilter(e.target.value)}
                                className="bg-pm-off-white/5 border border-pm-gold/30 rounded-lg px-3 py-2 text-pm-off-white text-sm focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                            >
                                <option value="all">Toutes les visibilités</option>
                                <option value="public">Publics</option>
                                <option value="private">Privés</option>
                            </select>
                        </div>
                    </div>

                    {/* Bouton d'ajout */}
                    <button
                        onClick={handleStartCreate}
                        className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pm-gold to-yellow-400 text-pm-dark font-bold rounded-lg hover:from-yellow-400 hover:to-pm-gold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pm-gold/25"
                    >
                        <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        Ajouter un Mannequin
                    </button>
                </div>
            </div>

            {/* Tableau des mannequins */}
            <AdminTable
                columns={columns}
                data={filteredAndSortedModels}
                onSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                emptyMessage="Aucun mannequin trouvé"
            />

            {/* Modal d'édition */}
            {editingModel && (
                <AdminModal
                    isOpen={!!editingModel}
                    onClose={() => { setEditingModel(null); setIsCreating(false); }}
                    title={isCreating ? "Ajouter un Mannequin" : "Modifier le Mannequin"}
                    size="xl"
                >
                    <ModelForm 
                        model={editingModel} 
                        onSave={handleFormSave} 
                        onCancel={() => {setEditingModel(null); setIsCreating(false);}} 
                        isCreating={isCreating}
                        mode="admin"
                    />
                </AdminModal>
            )}
        </AdminLayout>
    );
};

export default AdminModels;