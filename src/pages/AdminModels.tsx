import React, { useState, useMemo } from 'react';
import AdminPageWrapper from '../components/AdminPageWrapper';
import AdminCard from '../components/admin/AdminCard';
import { StatCard } from '../components/admin/AdminStats';
import AddModelModal from '../components/admin/AddModelModal';
import PromoteStudentModal from '../components/admin/PromoteStudentModal';
import { 
    UsersIcon, UserGroupIcon, PaintBrushIcon, ClipboardDocumentListIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

const AdminModels: React.FC = () => {
    const { data, saveData } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pro' | 'beginner'>('all');
    const [showAddModelModal, setShowAddModelModal] = useState(false);
    const [showPromoteModal, setShowPromoteModal] = useState(false);

    // ---- Comptage notifications ----
    const newCastingApps = useMemo(() => (data as any)?.castingApplications?.filter((a: any) => a.status === 'Nouveau').length || 0, [data]);
    const newFashionDayApps = useMemo(() => (data as any)?.fashionDayApplications?.filter((a: any) => a.status === 'Nouveau').length || 0, [data]);

    // ---- Statistiques ----
    const totalModels = (data as any)?.models?.length || 0;
    const totalBeginnerStudents = (data as any)?.beginnerStudents?.length || 0;

    // ---- Filtrage des modèles ----
    const filteredModels = useMemo(() => {
        let models = (data as any)?.models || [];
        
        if (filterStatus === 'pro') {
            models = models.filter((model: any) => model.status === 'Pro');
        } else if (filterStatus === 'beginner') {
            models = models.filter((model: any) => model.status === 'Débutant');
        }
        
        if (searchTerm) {
            models = models.filter((model: any) => 
                model.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                model.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        return models;
    }, [data, searchTerm, filterStatus]);

    // Fonctions de gestion des modaux
    const handleAddModel = (modelData: any) => {
        if (!data) return;
        
        const updatedModels = [...(data.models || []), modelData];
        saveData({ ...data, models: updatedModels });
        setShowAddModelModal(false);
    };

    const handlePromoteStudent = (studentId: string, promotionData: any) => {
        if (!data) return;
        
        // Trouver l'étudiant à promouvoir
        const studentIndex = (data.beginnerStudents || []).findIndex((s: any) => s.id === studentId);
        if (studentIndex === -1) return;
        
        const student = data.beginnerStudents[studentIndex];
        
        // Créer le nouveau mannequin pro
        const newModel = {
            ...student,
            id: Date.now().toString(),
            status: 'Pro',
            level: promotionData.newLevel,
            contractType: promotionData.contractType,
            startDate: promotionData.startDate,
            salary: promotionData.salary,
            promotionNotes: promotionData.notes,
            promotedAt: promotionData.promotedAt
        };
        
        // Ajouter au modèle pro et retirer des étudiants
        const updatedModels = [...(data.models || []), newModel];
        const updatedStudents = (data.beginnerStudents || []).filter((s: any) => s.id !== studentId);
        
        saveData({ 
            ...data, 
            models: updatedModels,
            beginnerStudents: updatedStudents
        });
        setShowPromoteModal(false);
    };

    // Préparer les données des étudiants pour la promotion
    const studentsForPromotion = useMemo(() => {
        return (data?.beginnerStudents || []).map((student: any) => ({
            id: student.id,
            name: student.name,
            email: student.email,
            level: student.level || 'beginner',
            progress: student.progress || 0,
            joinDate: student.createdAt || student.joinDate
        }));
    }, [data]);

    return (
        <AdminPageWrapper>
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Mannequins Pro"
                    value={totalModels}
                    icon={UsersIcon}
                    color="gold"
                    change={{
                        value: 12,
                        type: 'increase',
                        label: 'ce mois'
                    }}
                />
                <StatCard
                    title="Étudiants Débutants"
                    value={totalBeginnerStudents}
                    icon={UserGroupIcon}
                    color="blue"
                />
                <StatCard
                    title="Candidatures Casting"
                    value={newCastingApps}
                    icon={ClipboardDocumentListIcon}
                    color="green"
                />
                <StatCard
                    title="Candidatures PFD"
                    value={newFashionDayApps}
                    icon={SparklesIcon}
                    color="purple"
                />
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                <AdminCard 
                    title="Ajouter Mannequin Pro" 
                    icon={UsersIcon} 
                    description="Créer un nouveau profil de mannequin professionnel."
                    color="gold"
                    onClick={() => setShowAddModelModal(true)}
                />
                <AdminCard 
                    title="Promouvoir Débutant" 
                    icon={UserGroupIcon} 
                    description="Promouvoir un étudiant débutant vers le statut pro."
                    color="blue"
                    onClick={() => setShowPromoteModal(true)}
                />
                <AdminCard 
                    title="Direction Artistique" 
                    icon={PaintBrushIcon} 
                    description="Assigner des thèmes de séance photo."
                    color="purple"
                    href="/admin/artistic-direction"
                />
                <AdminCard 
                    title="Candidatures Casting" 
                    icon={ClipboardDocumentListIcon} 
                    description="Traiter les candidatures pour les castings."
                    notificationCount={newCastingApps}
                    color="green"
                    href="/admin/casting-applications"
                />
            </div>

            {/* Filtres et recherche */}
            <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-playfair text-pm-gold mb-4">Recherche et Filtres</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-pm-off-white mb-2">
                            Rechercher un mannequin
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Nom, email..."
                            className="w-full px-4 py-2 bg-black/50 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-pm-off-white mb-2">
                            Filtrer par statut
                        </label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="w-full px-4 py-2 bg-black/50 border border-pm-gold/30 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="pro">Mannequins Pro</option>
                            <option value="beginner">Débutants</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Liste des modèles */}
            <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                <h3 className="text-xl font-playfair text-pm-gold mb-4">
                    Liste des Mannequins ({filteredModels.length})
                </h3>
                
                {filteredModels.length === 0 ? (
                    <div className="text-center py-12">
                        <UsersIcon className="w-16 h-16 text-pm-gold/50 mx-auto mb-4" />
                        <p className="text-pm-off-white/70 text-lg">
                            {searchTerm ? 'Aucun mannequin trouvé pour cette recherche.' : 'Aucun mannequin enregistré.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredModels.map((model: any, index: number) => (
                            <div key={index} className="bg-black/30 border border-pm-gold/10 rounded-lg p-4 hover:border-pm-gold/30 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-lg font-semibold text-pm-gold">{model.name || 'Nom non défini'}</h4>
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        model.status === 'Pro' 
                                            ? 'bg-green-500/20 text-green-400' 
                                            : 'bg-blue-500/20 text-blue-400'
                                    }`}>
                                        {model.status || 'Non défini'}
                                    </span>
                                </div>
                                <p className="text-pm-off-white/70 text-sm mb-2">{model.email || 'Email non défini'}</p>
                                <p className="text-pm-off-white/50 text-xs">
                                    Taille: {model.height || 'N/A'} | Poids: {model.weight || 'N/A'}
                                </p>
                                <div className="flex gap-2 mt-3">
                                    <button className="flex-1 px-3 py-1 bg-pm-gold/20 text-pm-gold text-xs rounded hover:bg-pm-gold/30 transition-colors">
                                        Modifier
                                    </button>
                                    <button className="flex-1 px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded hover:bg-red-500/30 transition-colors">
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modaux */}
            <AddModelModal
                isOpen={showAddModelModal}
                onClose={() => setShowAddModelModal(false)}
                onSave={handleAddModel}
            />

            <PromoteStudentModal
                isOpen={showPromoteModal}
                onClose={() => setShowPromoteModal(false)}
                onPromote={handlePromoteStudent}
                students={studentsForPromotion}
            />
        </AdminPageWrapper>
    );
};

export default AdminModels;