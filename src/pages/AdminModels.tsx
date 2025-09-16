import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Model, ContactInfo, BeginnerStudent } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon, EyeIcon, EyeSlashIcon, PrinterIcon, ArrowDownTrayIcon, ChevronDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import ModelForm from '../components/ModelForm';
import PaymentStatusBadge from '../components/PaymentStatusBadge'; 

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
    const [editingModel, setEditableModel] = useState<Model | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [demoteDropdownOpen, setDemoteDropdownOpen] = useState<string | null>(null);

    useEffect(() => {
        if (data?.models) {
            setLocalModels([...data.models].sort((a,b) => a.name.localeCompare(b.name)));
        }
    }, [data?.models, isInitialized]);

    // Fermer le menu déroulant quand on clique ailleurs
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (demoteDropdownOpen) {
                setDemoteDropdownOpen(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [demoteDropdownOpen]);

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
            
            // Ajouter le statut de paiement par défaut pour les nouveaux mannequins
            const newModel: Model = {
                ...modelToSave,
                adminAccess: false,
                paymentStatus: {
                    isUpToDate: false,
                    nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
                    amount: 50000, // 50,000 FCFA par défaut
                    currency: 'FCFA',
                    warnings: []
                }
            };
            
            updatedModels = [...localModels, newModel];
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

    const handleDemote = async (proModel: Model, targetLevel: 'Débutant' | 'Inactif') => {
        if (!data) return;
        if (proModel.level !== 'Pro') {
            alert("Ce profil n'est pas au niveau Professionnel.");
            return;
        }
        
        const confirmMessage = targetLevel === 'Débutant' 
            ? `Rétrograder ${proModel.name} au statut Débutant ? Le profil pro sera retiré et un accès débutant sera créé.`
            : `Marquer ${proModel.name} comme Inactif ? Le profil sera désactivé mais conservé.`;
            
        if (!window.confirm(confirmMessage)) return;

        if (targetLevel === 'Débutant') {
            // Générer un matricule unique pour débutant
            const initial = (proModel.name.split(' ')[0] || 'X').charAt(0).toUpperCase();
            const existingDebuts = (data.beginnerStudents || []).filter(s => s.matricule && s.matricule.startsWith(`DEB-${initial}`));
            const existingNums = existingDebuts.map(s => parseInt(s.matricule.replace(`DEB-${initial}`, ''), 10) || 0);
            const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1;
            const matricule = `DEB-${initial}${String(nextNum).padStart(3, '0')}`;

            const newBeginner: BeginnerStudent = {
                id: proModel.id || `${proModel.name.toLowerCase().replace(/\s+/g,'-')}-${Date.now()}`,
                name: proModel.name,
                matricule,
                password: proModel.password || `pmm${new Date().getFullYear()}`,
                quizScores: proModel.quizScores || {}
            };

            const updatedModels = (data.models || []).filter(m => m.id !== proModel.id);
            const updatedBeginners = [ ...(data.beginnerStudents || []), newBeginner ];

            try {
                await saveData({ ...data, models: updatedModels, beginnerStudents: updatedBeginners });
                alert(`${proModel.name} a été rétrogradé(e) au statut Débutant avec succès.`);
            } catch (e) {
                console.error('Demotion failed:', e);
                alert("Une erreur est survenue lors de la rétrogradation.");
            }
        } else if (targetLevel === 'Inactif') {
            // Marquer comme inactif
            const updatedModels = data.models.map(m => 
                m.id === proModel.id ? { ...m, level: 'Inactif' as const } : m
            );

            try {
                await saveData({ ...data, models: updatedModels });
                alert(`${proModel.name} a été marqué(e) comme Inactif avec succès.`);
            } catch (e) {
                console.error('Status change failed:', e);
                alert("Une erreur est survenue lors du changement de statut.");
            }
        }
        
        setDemoteDropdownOpen(null);
    };

    const handleReactivate = async (inactiveModel: Model) => {
        if (!data) return;
        if (inactiveModel.level !== 'Inactif') {
            alert("Ce profil n'est pas inactif.");
            return;
        }
        
        if (!window.confirm(`Réactiver ${inactiveModel.name} au statut Professionnel ?`)) return;

        const updatedModels = data.models.map(m => 
            m.id === inactiveModel.id ? { ...m, level: 'Pro' as const } : m
        );

        try {
            await saveData({ ...data, models: updatedModels });
            alert(`${inactiveModel.name} a été réactivé(e) au statut Professionnel avec succès.`);
        } catch (e) {
            console.error('Reactivation failed:', e);
            alert("Une erreur est survenue lors de la réactivation.");
        }
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
                        onCancel={() => {setEditingModel(null); setIsCreating(false);}} 
                        isCreating={isCreating}
                        mode="admin"
                    />
                </div>
            </div>
        )
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
                        <PlusIcon className="w-5 h-5"/> Ajouter un Mannequin
                    </button>
                </div>

                <div className="admin-section-wrapper overflow-x-auto">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Nom</th>
                                <th>Niveau</th>
                                <th>Statut Paiement</th>
                                <th>Public</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {localModels.map((model) => (
                                <tr key={model.id}>
                                    <td><img src={model.imageUrl} alt={model.name} className="w-12 h-16 object-cover rounded"/></td>
                                    <td className="font-semibold">{model.name}</td>
                                    <td>
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                                            model.level === 'Pro' ? 'bg-pm-gold/20 text-pm-gold' : 
                                            model.level === 'Inactif' ? 'bg-red-500/20 text-red-300' : 
                                            'bg-blue-500/20 text-blue-300'
                                        }`}>
                                            {model.level}
                                        </span>
                                    </td>
                                    <td>
                                        <PaymentStatusBadge paymentStatus={model.paymentStatus} />
                                    </td>
                                    <td>
                                        <button onClick={() => handleTogglePublic(model.id)} title={model.isPublic ? "Rendre privé" : "Rendre public"}>
                                            {model.isPublic ? <EyeIcon className="w-6 h-6 text-green-500"/> : <EyeSlashIcon className="w-6 h-6 text-pm-off-white/50"/>}
                                        </button>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handlePrint(model)} 
                                                className="p-2 text-pm-gold/70 hover:text-pm-gold" 
                                                title="Imprimer la Fiche"
                                            >
                                                <PrinterIcon className="w-5 h-5"/>
                                            </button>
                                            {(model.level && /pro/i.test(model.level)) && (
                                              <div className="relative">
                                                <button 
                                                  onClick={() => setDemoteDropdownOpen(demoteDropdownOpen === model.id ? null : model.id)}
                                                  className="action-btn !flex !items-center !gap-1 bg-blue-500/10 text-blue-300 border-blue-500/50 hover:bg-blue-500/20" 
                                                  title="Options de rétrogradation"
                                                >
                                                  <ArrowDownTrayIcon className="w-5 h-5"/>
                                                  <ChevronDownIcon className="w-3 h-3"/>
                                                </button>
                                                
                                                {demoteDropdownOpen === model.id && (
                                                  <div className="absolute right-0 top-full mt-1 w-48 bg-pm-dark border border-pm-gold/20 rounded-lg shadow-lg z-50">
                                                    <button
                                                      onClick={() => handleDemote(model, 'Débutant')}
                                                      className="w-full px-4 py-2 text-left text-sm text-pm-off-white hover:bg-pm-gold/10 hover:text-pm-gold transition-colors"
                                                    >
                                                      Rétrograder en Débutant
                                                    </button>
                                                    <button
                                                      onClick={() => handleDemote(model, 'Inactif')}
                                                      className="w-full px-4 py-2 text-left text-sm text-pm-off-white hover:bg-pm-gold/10 hover:text-pm-gold transition-colors"
                                                    >
                                                      Marquer comme Inactif
                                                    </button>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                            
                                            {(model.level && /inactif/i.test(model.level)) && (
                                              <button 
                                                onClick={() => handleReactivate(model)} 
                                                className="action-btn !flex !items-center !gap-1 bg-green-500/10 text-green-300 border-green-500/50 hover:bg-green-500/20" 
                                                title="Réactiver"
                                              >
                                                <ArrowUpIcon className="w-5 h-5"/>
                                                <span className="hidden xl:inline text-xs uppercase">Réactiver</span>
                                              </button>
                                            )}
                                            <button onClick={() => setEditingModel(model)} className="p-2 text-pm-gold/70 hover:text-pm-gold" title="Modifier"><PencilIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDelete(model.id)} className="p-2 text-red-500/70 hover:text-red-500" title="Supprimer"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminModels;