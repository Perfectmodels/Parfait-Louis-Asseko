import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { Model, BeginnerStudent } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon, EyeIcon, EyeSlashIcon, XMarkIcon, PrinterIcon, EnvelopeIcon, PhoneIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import ModelForm from '../components/ModelForm';
import PrintableModelSheet from '../components/PrintableModelSheet';

const Pagination: React.FC<{ currentPage: number; totalPages: number; onPageChange: (page: number) => void; }> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    return (
        <nav aria-label="Pagination" className="flex justify-center items-center gap-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="action-btn disabled:opacity-50"
            >
                Préc.
            </button>
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`h-10 w-10 rounded-md font-bold transition-colors ${currentPage === number ? 'bg-pm-gold text-pm-dark' : 'bg-black/50 hover:bg-pm-gold/20'}`}
                    aria-current={currentPage === number ? 'page' : undefined}
                >
                    {number}
                </button>
            ))}
             <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="action-btn disabled:opacity-50"
            >
                Suiv.
            </button>
        </nav>
    );
};


const AdminModels: React.FC = () => {
  const { data, saveData } = useData();
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [viewingModel, setViewingModel] = useState<Model | null>(null);
  const [printingModel, setPrintingModel] = useState<Model | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const allModels = useMemo(() => data?.models || [], [data?.models]);
  const proModels = useMemo(() => allModels.filter(m => m.level !== 'Débutant'), [allModels]);

  const totalPages = Math.ceil(proModels.length / ITEMS_PER_PAGE);
  const paginatedModels = useMemo(() => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      return proModels.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [proModels, currentPage]);

  const handleFormSave = async (modelToSave: Model) => {
    if (!data) return;
    let updatedModels;
    if (isCreating) {
      const id = modelToSave.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      const firstName = modelToSave.name.split(' ')[0] || 'new';
      const initial = firstName.charAt(0).toUpperCase();

      const modelsWithSameInitial = allModels.filter(m => m.username && m.username.startsWith(`Man-PMM${initial}`));
      const existingNumbers = modelsWithSameInitial.map(m => {
          const numPart = m.username.replace(`Man-PMM${initial}`, '');
          return parseInt(numPart, 10) || 0;
      });
      const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
      const username = `Man-PMM${initial}${String(nextNumber).padStart(2, '0')}`;
      
      const year = new Date().getFullYear();
      const password = `${firstName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')}${year}`;
      
      const newModel = {
          ...modelToSave,
          id: id,
          username: username,
          password: password,
          isPublic: modelToSave.isPublic || false,
          level: 'Pro' as const,
          measurements: modelToSave.measurements || { chest: '0cm', waist: '0cm', hips: '0cm', shoeSize: '0' },
          categories: modelToSave.categories || ['Défilé', 'Commercial'],
          experience: modelToSave.experience || "Expérience à renseigner par l'administrateur.",
          journey: modelToSave.journey || "Parcours à renseigner par l'administrateur.",
          quizScores: modelToSave.quizScores || {},
          distinctions: modelToSave.distinctions || [],
      };

      updatedModels = [newModel, ...allModels];
    } else {
      updatedModels = allModels.map(m => m.id === modelToSave.id ? modelToSave : m);
    }
    
    await saveData({ ...data, models: updatedModels });
    alert("Mannequin enregistré avec succès.");

    setEditingModel(null);
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce mannequin ?")) {
      if (!data) return;
      const updatedModels = allModels.filter(m => m.id !== id);
      await saveData({ ...data, models: updatedModels });
      alert("Mannequin supprimé avec succès.");
    }
  };
  
    const handleDemote = async (modelToDemote: Model) => {
        if (!data || !window.confirm(`Êtes-vous sûr de vouloir rétrograder ${modelToDemote.name} au niveau Débutant ? Son profil et ses accès Pro seront supprimés et un nouveau profil Débutant sera créé.`)) return;

        // 1. Create new BeginnerStudent
        const currentYear = new Date().getFullYear();
        const sanitizeForPassword = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f\']/g, "").replace(/[^a-z0-9-]/g, "");

        const existingMatricules = (data.beginnerStudents || []).map(s => parseInt(s.matricule.split('-')[2], 10) || 0);
        const nextNumber = existingMatricules.length > 0 ? Math.max(...existingMatricules) + 1 : 1;
        const matricule = `DEB-${currentYear}-${String(nextNumber).padStart(3, '0')}`;
        const password = `${sanitizeForPassword(modelToDemote.name.split(' ')[0])}${currentYear}`;

        const newBeginner: BeginnerStudent = {
            id: `demoted-${modelToDemote.id}`,
            name: modelToDemote.name,
            matricule: matricule,
            password: password,
            quizScores: {},
        };

        // 2. Remove model from 'models' array
        const updatedModels = data.models.filter(m => m.id !== modelToDemote.id);

        // 3. Add new student to 'beginnerStudents' array
        const updatedBeginnerStudents = [...(data.beginnerStudents || []), newBeginner];

        // 4. Save data
        try {
            await saveData({ ...data, models: updatedModels, beginnerStudents: updatedBeginnerStudents });
            alert(`${modelToDemote.name} a été rétrogradé(e) au statut Débutant avec succès.`);
        } catch (error) {
            console.error("Failed to demote model:", error);
            alert("Une erreur est survenue lors de la rétrogradation.");
        }
    };
  
  const handleMove = async (modelId: string, direction: 'up' | 'down') => {
    if (!data) return;
    const newModels = [...allModels];
    const index = newModels.findIndex(m => m.id === modelId);

    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newModels.length) return;

    [newModels[index], newModels[targetIndex]] = [newModels[targetIndex], newModels[index]];
    
    await saveData({ ...data, models: newModels });
  };
  
  const handleTogglePublicStatus = async (modelId: string) => {
    if (!data) return;
    const updatedModels = allModels.map(m => 
        m.id === modelId ? { ...m, isPublic: !m.isPublic } : m
    );
    await saveData({ ...data, models: updatedModels });
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    const currentYear = new Date().getFullYear();
    setEditingModel({
      id: '',
      name: '',
      username: '',
      password: `changeme${currentYear}`,
      height: '',
      gender: 'Femme',
      imageUrl: '',
      isPublic: false,
      level: 'Pro',
      measurements: { chest: '', waist: '', hips: '', shoeSize: '' },
      categories: [],
      experience: '',
      journey: '',
      quizScores: {},
      distinctions: [],
    });
  };

  if (editingModel) {
    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <div className="container mx-auto px-6">
                <ModelForm model={editingModel} onSave={handleFormSave} onCancel={() => {setEditingModel(null); setIsCreating(false);}} isCreating={isCreating} mode="admin" />
            </div>
        </div>
    );
  }

  if (printingModel) {
      return <PrintableModelSheet model={printingModel} onDonePrinting={() => setPrintingModel(null)} />;
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
            <h1 className="admin-page-title">Gérer les Mannequins Professionnels</h1>
          </div>
          <button onClick={handleStartCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full hover:bg-pm-gold hover:text-pm-dark">
            <PlusIcon className="w-5 h-5"/> Ajouter un mannequin
          </button>
        </div>

        <section className="admin-section-wrapper !p-2 sm:!p-4 space-y-2">
            {paginatedModels.map((model, index) => (
                <ModelListItem 
                    key={model.id}
                    model={model}
                    onView={() => setViewingModel(model)}
                    onDelete={() => handleDelete(model.id)}
                    onDemote={() => handleDemote(model)}
                    onTogglePublic={() => handleTogglePublicStatus(model.id)}
                    onMove={handleMove}
                    isFirst={index === 0 && currentPage === 1}
                    isLast={index === paginatedModels.length - 1 && currentPage === totalPages}
                />
            ))}
            {proModels.length === 0 && <p className="text-center py-4 text-pm-off-white/70">Aucun mannequin professionnel.</p>}
        </section>
        
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
      {viewingModel && (
          <ModelPreviewModal
            model={viewingModel}
            onClose={() => setViewingModel(null)}
            onEdit={() => { setEditingModel(viewingModel); setViewingModel(null); }}
            onPrint={() => { setPrintingModel(viewingModel); setViewingModel(null); }}
          />
      )}
    </div>
  );
};

interface ModelListItemProps {
    model: Model;
    onView: () => void;
    onDelete: () => void;
    onDemote: () => void;
    onTogglePublic: () => void;
    onMove: (id: string, direction: 'up' | 'down') => void;
    isFirst: boolean;
    isLast: boolean;
}

const ModelListItem: React.FC<ModelListItemProps> = ({ model, onView, onDelete, onDemote, onTogglePublic, onMove, isFirst, isLast }) => (
    <div className="flex items-center justify-between p-2 sm:p-4 bg-pm-dark/50 rounded-md hover:bg-pm-dark transition-colors duration-200">
      <button onClick={onView} className="flex items-center gap-4 text-left flex-grow">
        <img src={model.imageUrl} alt={model.name} className="w-16 h-20 object-cover rounded"/>
        <div>
          <h3 className="font-bold text-pm-off-white">{model.name}</h3>
          <p className="text-sm text-pm-off-white/70">{model.username}</p>
           {model.isPublic ? (
                <span className="text-xs font-bold text-green-400">Public</span>
            ) : (
                <span className="text-xs font-bold text-yellow-400">Privé</span>
            )}
        </div>
      </button>
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
         {/* FIX: Removed typo "_" after button tag. */}
         <button onClick={onTogglePublic} title={model.isPublic ? 'Rendre privé' : 'Rendre public'} className="action-btn">
            {model.isPublic ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
         </button>
         <button onClick={onDemote} title="Rétrograder en Débutant" className="action-btn">
            <ArrowPathIcon className="w-5 h-5"/>
         </button>
        <button onClick={() => onMove(model.id, 'up')} disabled={isFirst} className="action-btn disabled:opacity-30"><ArrowUpIcon className="w-5 h-5"/></button>
        <button onClick={() => onMove(model.id, 'down')} disabled={isLast} className="action-btn disabled:opacity-30"><ArrowDownIcon className="w-5 h-5"/></button>
        <button onClick={onDelete} className="action-btn text-red-500/70 hover:text-red-500 hover:bg-red-500/10 border-red-500/50"><TrashIcon className="w-5 h-5"/></button>
      </div>
    </div>
);

const ModelPreviewModal: React.FC<{ model: Model; onClose: () => void; onEdit: () => void; onPrint: () => void; }> = ({ model, onClose, onEdit, onPrint }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" onClick={onClose}>
            <div ref={modalRef} onClick={e => e.stopPropagation()} className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <header className="p-4 flex justify-between items-center border-b border-pm-gold/20 flex-shrink-0">
                    <h2 className="text-2xl font-playfair text-pm-gold">{model.name}</h2>
                    <button onClick={onClose} className="text-pm-off-white/70 hover:text-white"><XMarkIcon className="w-6 h-6"/></button>
                </header>
                <main className="p-6 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <img src={model.imageUrl} alt={model.name} className="w-full aspect-[3/4] object-cover rounded-md" />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <Section title="Informations Clés">
                            <InfoItem label="Identifiant" value={model.username} />
                            <InfoItem label="Mot de passe" value={model.password} />
                            <InfoItem label="Contact" value={<><EnvelopeIcon className="w-4 h-4 inline mr-1"/>{model.email || 'N/A'} <br/> <PhoneIcon className="w-4 h-4 inline mr-1"/>{model.phone || 'N/A'}</>} />
                        </Section>
                        <Section title="Mensurations">
                            <div className="grid grid-cols-2 gap-2">
                                <InfoItem label="Taille" value={model.height} />
                                <InfoItem label="Poitrine" value={model.measurements.chest} />
                                <InfoItem label="Taille (vêt.)" value={model.measurements.waist} />
                                <InfoItem label="Hanches" value={model.measurements.hips} />
                                <InfoItem label="Pointure" value={model.measurements.shoeSize} />
                                <InfoItem label="Genre" value={model.gender} />
                            </div>
                        </Section>
                         <Section title="Portfolio">
                            <div className="flex flex-wrap gap-2">
                                {(model.portfolioImages || []).slice(0, 5).map((img, i) => (
                                    <img key={i} src={img} alt={`Portfolio ${i+1}`} className="w-20 h-20 object-cover rounded" />
                                ))}
                                {(model.portfolioImages?.length || 0) > 5 && <div className="w-20 h-20 bg-black flex items-center justify-center rounded text-pm-gold">+{ (model.portfolioImages?.length || 0) - 5}</div>}
                            </div>
                        </Section>
                    </div>
                </main>
                <footer className="p-4 border-t border-pm-gold/20 flex-shrink-0 flex justify-end items-center gap-4">
                    <button onClick={onPrint} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-xs rounded-full hover:bg-pm-gold hover:text-pm-dark">
                        <PrinterIcon className="w-4 h-4" /> Télécharger la Fiche
                    </button>
                    <button onClick={onEdit} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white">
                        <PencilIcon className="w-4 h-4" /> Modifier
                    </button>
                </footer>
            </div>
        </div>
    );
};

const Section: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div>
        <h3 className="text-lg font-bold text-pm-gold mb-2 border-b border-pm-gold/10 pb-1">{title}</h3>
        {children}
    </div>
);
const InfoItem: React.FC<{label: string, value: React.ReactNode}> = ({label, value}) => (
    <div className="text-sm">
        <strong className="text-pm-off-white/60 block">{label}</strong>
        <span className="text-pm-off-white/90">{value}</span>
    </div>
);

export default AdminModels;