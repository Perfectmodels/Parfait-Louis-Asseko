
import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../../contexts/DataContext';
import { Model, ContactInfo, BeginnerStudent, ModelActivity, ModelPerformance, ModelTrackingData } from '../../../types';
import SEO from '../../../components/SEO';
import { Link } from 'react-router-dom';
import { 
    ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon, EyeIcon, EyeSlashIcon, PrinterIcon, ArrowDownTrayIcon, ChevronDownIcon, ArrowUpIcon,
    UserIcon, ChartBarIcon, ClockIcon, AcademicCapIcon, CurrencyDollarIcon, CalendarDaysIcon, TagIcon, StarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon,
    CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, FunnelIcon, MagnifyingGlassIcon, ClipboardDocumentIcon, CheckIcon as CheckIconOutline,
    CameraIcon, PhotoIcon
} from '@heroicons/react/24/outline';
import ModelForm from '../../../components/ModelForm';
import PaymentStatusBadge from '../../../components/PaymentStatusBadge';
import PhotoUpload from '../../../components/PhotoUpload';
import { imgbbService } from '../../../services/imgbbService';
import { getModelsWithRealActivity } from '../../../utils/modelTrackingUtils';
import { motion } from 'framer-motion';

// Combined component for Model Management

const ModelManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('list');

    return (
        <div className="admin-page">
            <SEO title="Admin - Gestion des Mannequins" noIndex />
            <div className="admin-page-header">
                <div>
                    <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                        <ChevronLeftIcon className="w-5 h-5" />
                        Retour au Dashboard
                    </Link>
                    <h1 className="admin-page-title">Gestion des Mannequins</h1>
                    <p className="admin-page-subtitle">Gérez les profils, le suivi, les accès et les photos des mannequins.</p>
                </div>
            </div>
            
            <div className="flex border-b border-pm-gold/20 mb-6">
                <TabButton title="Liste des Mannequins" isActive={activeTab === 'list'} onClick={() => setActiveTab('list')} />
                <TabButton title="Suivi & Activité" isActive={activeTab === 'tracking'} onClick={() => setActiveTab('tracking')} />
                <TabButton title="Accès & Identifiants" isActive={activeTab === 'access'} onClick={() => setActiveTab('access')} />
                <TabButton title="Photos" isActive={activeTab === 'photos'} onClick={() => setActiveTab('photos')} />
            </div>

            <div>
                {activeTab === 'list' && <ModelList />}
                {activeTab === 'tracking' && <ModelTracking />}
                {activeTab === 'access' && <ModelAccess />}
                {activeTab === 'photos' && <ModelPhotos />}
            </div>
        </div>
    );
}

const TabButton: React.FC<{ title: string; isActive: boolean; onClick: () => void }> = ({ title, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
            isActive
                ? 'text-pm-gold border-b-2 border-pm-gold'
                : 'text-pm-off-white/70 hover:text-pm-gold'
        }`}
    >
        {title}
    </button>
);


// ModelList Component (from AdminModels.tsx)
const ModelList: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [localModels, setLocalModels] = useState<Model[]>([]);
    const [editingModel, setEditingModel] = useState<Model | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [demoteDropdownOpen, setDemoteDropdownOpen] = useState<string | null>(null);

    useEffect(() => {
        if (data?.models) {
            setLocalModels([...data.models].sort((a,b) => a.name.localeCompare(b.name)));
        }
    }, [data?.models, isInitialized]);

    // ... (rest of the functions from AdminModels.tsx: handleFormSave, handleDelete, etc.)
    
    return (
        <div className="admin-section-wrapper">
             <p className="text-pm-off-white">Contenu de la liste des mannequins ici.</p>
        </div>
    )
};

// ModelTracking Component (from AdminModelTracking.tsx)
const ModelTracking: React.FC = () => {
    const { data, isInitialized } = useData();
    // ... (rest of the state and logic from AdminModelTracking.tsx)
    
    return (
        <div className="admin-section-wrapper">
            <p className="text-pm-off-white">Contenu du suivi des mannequins ici.</p>
        </div>
    );
};

// ModelAccess Component (from AdminModelAccess.tsx)
const ModelAccess: React.FC = () => {
    const { data } = useData();
    const [copiedUsername, setCopiedUsername] = useState<string | null>(null);
    // ... (rest of the functions from AdminModelAccess.tsx: handleCopy, handleDownloadCSV)

    return (
        <div className="admin-section-wrapper">
             <p className="text-pm-off-white">Contenu de la gestion des accès ici.</p>
        </div>
    );
};

// ModelPhotos Component (from AdminPhotoUpload.tsx)
const ModelPhotos: React.FC = () => {
    const { data, saveData } = useData();
    const [selectedModel, setSelectedModel] = useState<any>(null);
    // ... (rest of the state and logic from AdminPhotoUpload.tsx)

    return (
        <div className="admin-section-wrapper">
            <p className="text-pm-off-white">Contenu de la gestion des photos ici.</p>
        </div>
    );
};

export default ModelManagement;
