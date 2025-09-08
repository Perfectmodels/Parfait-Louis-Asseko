
import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { CastingApplication, CastingApplicationStatus, Model } from '../types';
import SEO from '../components/SEO';
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, EyeIcon, XMarkIcon, PrinterIcon } from '@heroicons/react/24/outline';
import PrintableCastingSheet from '../components/icons/PrintableCastingSheet';

const AdminCasting: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [localApps, setLocalApps] = useState<CastingApplication[]>([]);
    const [filter, setFilter] = useState<CastingApplicationStatus | 'Toutes'>('Nouveau');
    const [selectedApp, setSelectedApp] = useState<CastingApplication | null>(null);
    const [printingApp, setPrintingApp] = useState<CastingApplication | null>(null);

    useEffect(() => {
        if (data?.castingApplications) {
            setLocalApps([...data.castingApplications].sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()));
        }
    }, [data?.castingApplications, isInitialized]);
    
    const filteredApps = useMemo(() => {
        if (filter === 'Toutes') return localApps;
        return localApps.filter(app => app.status === filter);
    }, [filter, localApps]);

    const handleDelete = async (appId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette candidature ?")) {
            if (!data) return;
            const updatedApps = localApps.filter(app => app.id !== appId);
            await saveData({ ...data, castingApplications: updatedApps });
        }
    };

    const handleUpdateStatus = async (appId: string, newStatus: CastingApplicationStatus) => {
        if (!data) return;
        const updatedApps: CastingApplication[] = localApps.map(app => app.id === appId ? { ...app, status: newStatus } : app);
        await saveData({ ...data, castingApplications: updatedApps });
        if (selectedApp?.id === appId) {
            setSelectedApp({ ...selectedApp, status: newStatus });
        }
    };

    const handleValidateAndCreateModel = async (app: CastingApplication) => {
        if (!data) return;

        const modelExists = data.models.some(m => m.name.toLowerCase() === `${app.firstName} ${app.lastName}`.toLowerCase());
        if (modelExists) {
            alert("Un mannequin avec ce nom existe déjà. Impossible de créer un duplicata.");
            return;
        }

        const currentYear = new Date().getFullYear();
        const sanitizeForPassword = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f\u0027--- START OF FILE pages/FashionDayApplicationForm.tsx ---


import React, { useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { FashionDayApplication, FashionDayApplicationRole } from '../src/types';
import { Link } from 'react-router-dom';

const FashionDayApplicationForm: React.FC = () => {
    const { data, saveData } = useData();
    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        phone: string;
        role: FashionDayApplicationRole;
        message: string;
    }>({
        name: '',
        email: '',
        phone: '',
        role: 'Mannequin',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        if (!data) {
            setStatus('error');
            setStatusMessage('Erreur: Impossible de charger les données de l\'application.');
            return;
        }

        const newApplication: FashionDayApplication = {
            ...formData,
            id: `pfd-${Date.now()}`,
            submissionDate: new Date().toISOString(),
            status: 'Nouveau',
        };

        try {
            const updatedApplications = [...(data.fashionDayApplications || []), newApplication];
            await saveData({ ...data, fashionDayApplications: updatedApplications });

            setStatus('success');
            setStatusMessage('Votre candidature a été envoyée ! L\'équipe du Perfect Fashion Day vous recontactera prochainement.');
            setFormData({ name: '', email: '', phone: '', role: 'Mannequin', message: '' });

        } catch (error) {
            setStatus('error');
            setStatusMessage("Une erreur est survenue lors de l'envoi de votre candidature.");
            console.error(error);
        }
    };
    
    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Candidature Perfect Fashion Day" description="Postulez pour participer à la prochaine édition du Perfect Fashion Day. Mannequins, stylistes, photographes, partenaires, rejoignez l'aventure." noIndex />
            <div className="container mx-auto px-6 max-w-2xl">
                <h1 className="text-5xl font-playfair text-pm-gold text-center mb-4">Candidature Perfect Fashion Day</h1>
                <p className="text-center max-w-2xl mx-auto text-pm-off-white/80 mb-12">
                    Vous souhaitez participer à la prochaine édition ? Remplissez le formulaire ci-dessous.
                </p>
                <form onSubmit={handleSubmit} className="bg-black p-8 border border-pm-gold/20 space-y-6 rounded-lg shadow-lg">
                    <FormInput label="Nom Complet ou Nom de la Marque" name="name" value={formData.name} onChange={handleChange} required />
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                        <FormInput label="Téléphone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <FormSelect label="Je postule en tant que" name="role" value={formData.role} onChange={handleChange} required>
                        <option value="Mannequin">Mannequin</option>
                        <option value="Styliste">Styliste / Créateur</option>
                        <option value="Partenaire">Partenaire / Sponsor</option>
                        <option value="Photographe">Photographe / Vidéaste</option>
                        <option value="MUA">Maquilleur(se) / Coiffeur(se) (MUA)</option>
                        <option value="Autre">Autre (précisez dans le message)</option>
                    </FormSelect>
                    <FormTextArea
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Présentez-vous, décrivez votre projet, ou laissez un lien vers votre portfolio..."
                        required
                    />
                     <div className="pt-4">
                        <button type="submit" disabled={status === 'loading'} className="w-full px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all hover:bg-white disabled:opacity-50">
                            {status === 'loading' ? 'Envoi en cours...' : 'Envoyer ma candidature'}
                        </button>
                    </div>

                    {statusMessage && (
                        <p className={`text-center text-sm p-3 rounded-md ${status === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {statusMessage}
                            {status === 'success' && <Link to="/fashion-day" className="underline ml-2">Retour à la page de l'événement</Link>}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

const FormInput: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, required?: boolean, placeholder?: string}> = (props) => (
    <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <input {...props} id={props.name} className="admin-input" />
    </div>
);
const FormSelect: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, required?: boolean, children: React.ReactNode}> = (props) => (
    <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <select {...props} id={props.name} className="admin-input">{props.children}</select>
    </div>
);
const FormTextArea: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, rows: number, required?: boolean, placeholder?: string}> = (props) => (
    <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <textarea {...props} id={props.name} className="admin-input admin-textarea" />
    </div>
);

export default FashionDayApplicationForm;--- START OF FILE pages/AdminFashionDay.tsx ---


import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { FashionDayApplication, FashionDayApplicationStatus, FashionDayApplicationRole } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AdminFashionDayApps: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [localApps, setLocalApps] = useState<FashionDayApplication[]>([]);
    const [statusFilter, setStatusFilter] = useState<FashionDayApplicationStatus | 'Toutes'>('Toutes');
    const [roleFilter, setRoleFilter] = useState<FashionDayApplicationRole | 'Tous'>('Tous');
    const [selectedApp, setSelectedApp] = useState<FashionDayApplication | null>(null);

    useEffect(() => {
        if (data?.fashionDayApplications) {
            setLocalApps([...data.fashionDayApplications].sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()));
        }
    }, [data?.fashionDayApplications, isInitialized]);
    
    const filteredApps = useMemo(() => {
        return localApps
            .filter(app => statusFilter === 'Toutes' || app.status === statusFilter)
            .filter(app => roleFilter === 'Tous' || app.role === roleFilter);
    }, [statusFilter, roleFilter, localApps]);

    const handleDelete = async (appId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette candidature ?")) {
            if (!data) return;
            const updatedApps = localApps.filter(app => app.id !== appId);
            await saveData({ ...data, fashionDayApplications: updatedApps });
        }
    };

    const handleUpdateStatus = async (appId: string, newStatus: FashionDayApplicationStatus) => {
        if (!data) return;
        const updatedApps = localApps.map(app => app.id === appId ? { ...app, status: newStatus } : app);
        await saveData({ ...data, fashionDayApplications: updatedApps });
        if (selectedApp?.id === appId) {
            setSelectedApp({ ...selectedApp, status: newStatus });
        }
    };
    
    const getStatusColor = (status: FashionDayApplicationStatus) => {
        switch (status) {
            case 'Nouveau': return 'bg-blue-500/20 text-blue-300 border-blue-500';
            case 'En attente': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
            case 'Accepté': return 'bg-green-500/20 text-green-300 border-green-500';
            case 'Refusé': return 'bg-red-500/20 text-red-300 border-red-500';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    }

    const statusOptions: (FashionDayApplicationStatus | 'Toutes')[] = ['Toutes', 'Nouveau', 'En attente', 'Accepté', 'Refusé'];
    const roleOptions: (FashionDayApplicationRole | 'Tous')[] = ['Tous', 'Mannequin', 'Styliste', 'Partenaire', 'Photographe', 'MUA', 'Autre'];

    return (
        <>
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Candidatures Fashion Day" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Tableau de Bord
                </Link>
                <h1 className="text-4xl font-playfair text-pm-gold mb-8">Candidatures Perfect Fashion Day</h1>

                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <div>
                        <label className="text-xs mr-2">Statut:</label>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="admin-input !w-auto !inline-block text-sm">
                            {statusOptions.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="text-xs mr-2">Rôle:</label>
                        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value as any)} className="admin-input !w-auto !inline-block text-sm">
                            {roleOptions.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden shadow-lg shadow-black/30">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-pm-dark/50">
                                <tr className="border-b border-pm-gold/20">
                                    <th className="p-4 uppercase text-xs tracking-wider">Nom</th>
                                    <th className="p-4 uppercase text-xs tracking-wider hidden sm:table-cell">Rôle</th>
                                    <th className="p-4 uppercase text-xs tracking-wider hidden sm:table-cell">Date</th>
                                    <th className="p-4 uppercase text-xs tracking-wider">Statut</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApps.map(app => (
                                    <tr key={app.id} className="border-b border-pm-dark hover:bg-pm-dark/50">
                                        <td className="p-4 font-semibold">{app.name}</td>
                                        <td className="p-4 hidden sm:table-cell">{app.role}</td>
                                        <td className="p-4 text-sm hidden sm:table-cell">{new Date(app.submissionDate).toLocaleDateString()}</td>
                                        <td className="p-4"><span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusColor(app.status)}`}>{app.status}</span></td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-4">
                                                <button onClick={() => setSelectedApp(app)} className="text-pm-gold/70 hover:text-pm-gold"><EyeIcon className="w-5 h-5"/></button>
                                                <button onClick={() => handleDelete(app.id)} className="text-red-500/70 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredApps.length === 0 && <p className="text-center p-8 text-pm-off-white/60">Aucune candidature trouvée.</p>}
                    </div>
                </div>
            </div>
        </div>
        {selectedApp && <ApplicationModal app={selectedApp} onClose={() => setSelectedApp(null)} onUpdateStatus={handleUpdateStatus} getStatusColor={getStatusColor} />}
        </>
    );
};

const ApplicationModal: React.FC<{app: FashionDayApplication, onClose: () => void, onUpdateStatus: (id: string, status: FashionDayApplicationStatus) => void, getStatusColor: (status: FashionDayApplicationStatus) => string}> = ({ app, onClose, onUpdateStatus, getStatusColor }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog">
            <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="p-4 flex justify-between items-center border-b border-pm-gold/20">
                    <h2 className="text-2xl font-playfair text-pm-gold">Candidature de {app.name}</h2>
                    <button onClick={onClose} className="text-pm-off-white/70 hover:text-white"><XMarkIcon className="w-6 h-6"/></button>
                </header>
                <main className="p-6 overflow-y-auto flex-grow space-y-4">
                    <Section title="Informations">
                        <InfoItem label="Nom" value={app.name} />
                        <InfoItem label="Email" value={app.email} />
                        <InfoItem label="Téléphone" value={app.phone} />
                        <InfoItem label="Rôle" value={app.role} />
                        <InfoItem label="Date" value={new Date(app.submissionDate).toLocaleString()} />
                    </Section>
                    <Section title="Message">
                        <p className="text-sm whitespace-pre-wrap">{app.message}</p>
                    </Section>
                     <Section title="Statut">
                        <div className="flex items-center gap-2 flex-wrap">
                            {(['Nouveau', 'En attente', 'Accepté', 'Refusé'] as const).map(status => (
                                <button key={status} onClick={() => onUpdateStatus(app.id, status)} className={`px-2 py-0.5 text-xs font-bold rounded-full border transition-all ${app.status === status ? getStatusColor(status) : 'border-pm-off-white/50 text-pm-off-white/80 hover:bg-pm-dark'}`}>
                                    {status}
                                </button>
                            ))}
                        </div>
                    </Section>
                </main>
            </div>
        </div>
    );
};

const Section: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div className="bg-black p-4 border border-pm-gold/10 rounded-md">
        <h3 className="text-lg font-bold text-pm-gold mb-3">{title}</h3>
        <div className="space-y-2">{children}</div>
    </div>
);
const InfoItem: React.FC<{label: string, value: React.ReactNode}> = ({label, value}) => (
    <div className="grid grid-cols-3 text-sm">
        <strong className="text-pm-off-white/70 col-span-1">{label}:</strong>
        <span className="truncate col-span-2">{value}</span>
    </div>
);

export default AdminFashionDayApps;--- START OF FILE pages/AdminAgency.tsx ---

import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { AppData } from '../hooks/useDataStore';
import { Service, AchievementCategory, AIAssistantProps } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PlusIcon, ChevronDownIcon, SparklesIcon } from '@heroicons/react/24/outline';
import AIAssistant from '../components/AIAssistant';

type EditableData = Pick<AppData, 'agencyInfo' | 'agencyTimeline' | 'agencyServices' | 'agencyAchievements'>;

const AdminAgency: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [localData, setLocalData] = useState<EditableData | null>(null);
    const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
    const [aiAssistantProps, setAIAssistantProps] = useState<Omit<AIAssistantProps, 'isOpen' | 'onClose'>>({
        onInsertContent: () => {}, fieldName: '', initialPrompt: '',
    });

    const openAIAssistant = (fieldName: string, onInsert: (content: string) => void, initialPrompt: string = '') => {
        setAIAssistantProps({ fieldName, onInsertContent: onInsert, initialPrompt });
        setIsAIAssistantOpen(true);
    };

    useEffect(() => {
        if (isInitialized && data) {
            setLocalData(JSON.parse(JSON.stringify({
                agencyInfo: data.agencyInfo,
                agencyTimeline: data.agencyTimeline,
                agencyServices: data.agencyServices,
                agencyAchievements: data.agencyAchievements,
            })));
        }
    }, [isInitialized, data]);

    const handleSave = () => {
        if (!data || !localData) return;
        const newData: AppData = { ...data, ...localData };
        saveData(newData as AppData);
        alert("Contenu de l'agence enregistré avec succès.");
    };

    const handleAgencyInfoChange = (field: 'p1' | 'p2', value: string) => {
        if (!localData) return;
        setLocalData(prev => ({
            ...prev!,
            agencyInfo: { ...prev!.agencyInfo, about: { ...prev!.agencyInfo.about, [field]: value } },
        }));
    };

    if (!localData) {
        return <div className="min-h-screen flex items-center justify-center text-pm-gold">Chargement...</div>;
    }

    return (
        <>
        <AIAssistant 
            isOpen={isAIAssistantOpen} 
            onClose={() => setIsAIAssistantOpen(false)}
            {...aiAssistantProps} 
        />
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Gérer l'Agence" noIndex />
            <div className="container mx-auto px-6">
                 <div className="admin-page-header">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Tableau de Bord
                        </Link>
                        <h1 className="admin-page-title">Gérer le Contenu de l'Agence</h1>
                        <p className="admin-page-subtitle">Mettez à jour les informations publiques de l'agence.</p>
                    </div>
                    <button onClick={handleSave} className="px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-lg shadow-pm-gold/30">
                        Sauvegarder les Changements
                    </button>
                </div>

                <div className="space-y-8">
                    <div className="admin-section-wrapper">
                        <h2 className="admin-section-title">Textes 'À Propos'</h2>
                        <div className="space-y-4">
                            <FormTextArea 
                                label="Paragraphe 1" value={localData.agencyInfo.about.p1} onChange={(e) => handleAgencyInfoChange('p1', e.target.value)} 
                                onOpenAI={() => openAIAssistant(
                                    'Paragraphe d\'introduction',
                                    (content) => handleAgencyInfoChange('p1', content),
                                    "Rédige un paragraphe d'introduction percutant sur la vision et la fondation de l'agence Perfect Models Management au Gabon."
                                )}
                            />
                            <FormTextArea 
                                label="Paragraphe 2" value={localData.agencyInfo.about.p2} onChange={(e) => handleAgencyInfoChange('p2', e.target.value)}
                                 onOpenAI={() => openAIAssistant(
                                    'Paragraphe de mission',
                                    (content) => handleAgencyInfoChange('p2', content),
                                    "Rédige un paragraphe décrivant la mission de l'agence, en mettant l'accent sur la découverte de talents et le professionnalisme."
                                )}
                            />
                        </div>
                    </div>

                    <div className="admin-section-wrapper">
                        <h2 className="admin-section-title">Nos Valeurs</h2>
                        <div className="space-y-4">
                            <ArrayEditor 
                                items={localData.agencyInfo.values}
                                setItems={newItems => setLocalData(p => ({...p!, agencyInfo: {...p!.agencyInfo, values: newItems}}))}
                                renderItem={(item, onChange) => (
                                    <>
                                        <FormInput label="Nom de la valeur" value={item.name} onChange={e => onChange('name', e.target.value)} />
                                        <FormTextArea 
                                            label="Description" value={item.description} onChange={e => onChange('description', e.target.value)} 
                                            onOpenAI={() => openAIAssistant(
                                                `Description de la valeur "${item.name}"`,
                                                (content) => onChange('description', content),
                                                `Rédige une courte description pour la valeur d'entreprise suivante : "${item.name}".`
                                            )}
                                        />
                                    </>
                                )}
                                getNewItem={() => ({ name: 'Nouvelle Valeur', description: 'Description...' })}
                                getItemTitle={item => item.name}
                            />
                        </div>
                    </div>

                    <div className="admin-section-wrapper">
                        <h2 className="admin-section-title">Notre Parcours (Chronologie)</h2>
                        <div className="space-y-4">
                             <ArrayEditor 
                                items={localData.agencyTimeline}
                                setItems={newItems => setLocalData(p => ({...p!, agencyTimeline: newItems}))}
                                renderItem={(item, onChange) => (
                                    <>
                                        <FormInput label="Année" value={item.year} onChange={e => onChange('year', e.target.value)} />
                                        <FormInput 
                                            label="Événement" value={item.event} onChange={e => onChange('event', e.target.value)} 
                                            onOpenAI={() => openAIAssistant(
                                                'Événement de la chronologie',
                                                (content) => onChange('event', content),
                                                `Suggère un événement marquant pour une agence de mannequins pour l'année ${item.year}.`
                                            )}
                                        />
                                    </>
                                )}
                                getNewItem={() => ({ year: new Date().getFullYear().toString(), event: 'Nouvel événement...' })}
                                getItemTitle={item => `${item.year}: ${item.event}`}
                            />
                        </div>
                    </div>
                    
                     <div className="admin-section-wrapper">
                        <h2 className="admin-section-title">Nos Services</h2>
                        <div className="space-y-4">
                             <ArrayEditor 
                                items={localData.agencyServices}
                                setItems={newItems => setLocalData(p => ({...p!, agencyServices: newItems}))}
                                renderItem={(item: Service, onChange) => (
                                    <>
                                        <FormInput label="Icône (Heroicons)" value={item.icon} onChange={e => onChange('icon', e.target.value)} />
                                        <p className="text-xs text-pm-off-white/60 -mt-2">Utilisez le nom exact d'une icône de Heroicons (ex: AcademicCapIcon, CameraIcon, etc.)</p>
                                        <FormInput label="Titre" value={item.title} onChange={e => onChange('title', e.target.value)} />
                                        <FormTextArea 
                                            label="Description" value={item.description} onChange={e => onChange('description', e.target.value)} 
                                            onOpenAI={() => openAIAssistant(
                                                'Description de service',
                                                (content) => onChange('description', content),
                                                `Rédige une description complète et attractive pour un service intitulé "${item.title}".`
                                            )}
                                        />
                                        <FormInput label="Texte du Bouton" value={item.buttonText} onChange={e => onChange('buttonText', e.target.value)} />
                                        <FormInput label="Lien du Bouton" value={item.buttonLink} onChange={e => onChange('buttonLink', e.target.value)} />

                                    </>
                                )}
                                getNewItem={() => ({ icon: 'SparklesIcon', title: 'Nouveau Service', description: 'Description...', buttonText: 'Découvrir', buttonLink: '/services' })}
                                getItemTitle={item => item.title}
                            />
                        </div>
                    </div>
                    
                    <div className="admin-section-wrapper">
                        <h2 className="admin-section-title">Nos Réalisations</h2>
                        <div className="space-y-4">
                             <ArrayEditor 
                                items={localData.agencyAchievements}
                                setItems={newItems => setLocalData(p => ({...p!, agencyAchievements: newItems}))}
                                renderItem={(item: AchievementCategory, onChange) => (
                                    <>
                                        <FormInput label="Nom de la catégorie" value={item.name} onChange={e => onChange('name', e.target.value)} />
                                        <FormTextArea 
                                            label="Éléments (un par ligne)" 
                                            value={(item.items || []).join('\n')} 
                                            onChange={e => onChange('items', e.target.value.split('\n'))} 
                                            onOpenAI={() => openAIAssistant(
                                                `Éléments pour "${item.name}"`,
                                                (content) => onChange('items', content.split('\n')),
                                                `Suggère une liste de 5 réalisations typiques pour une agence de mannequins dans la catégorie "${item.name}". Sépare chaque élément par un retour à la ligne.`
                                            )}
                                        />
                                    </>
                                )}
                                getNewItem={() => ({ name: 'Nouvelle Catégorie', items: [] })}
                                getItemTitle={item => item.name}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

const FormInput: React.FC<{label: string, value: any, onChange: any, onOpenAI?: () => void}> = ({label, value, onChange, onOpenAI}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label className="admin-label !mb-0">{label}</label>
            {onOpenAI && (
                <button type="button" onClick={onOpenAI} className="inline-flex items-center gap-1 text-xs text-pm-gold/80 hover:text-pm-gold">
                    <SparklesIcon className="w-4 h-4" /> Assister
                </button>
            )}
        </div>
        <input type="text" value={value} onChange={onChange} className="admin-input" />
    </div>
);

const FormTextArea: React.FC<{label: string, value: any, onChange: any, onOpenAI?: () => void}> = ({label, value, onChange, onOpenAI}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label className="admin-label !mb-0">{label}</label>
            {onOpenAI && (
                <button type="button" onClick={onOpenAI} className="inline-flex items-center gap-1 text-xs text-pm-gold/80 hover:text-pm-gold">
                    <SparklesIcon className="w-4 h-4" /> Assister
                </button>
            )}
        </div>
        <textarea value={value} onChange={onChange} rows={4} className="admin-input admin-textarea" />
    </div>
);

const ArrayEditor: React.FC<{
    items: any[];
    setItems: (items: any[]) => void;
    renderItem: (item: any, onChange: (key: string, value: any) => void, index: number) => React.ReactNode;
    getNewItem: () => any;
    getItemTitle: (item: any) => string;
}> = ({ items, setItems, renderItem, getNewItem, getItemTitle }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleItemChange = (index: number, key: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [key]: value };
        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, getNewItem()]);
        setOpenIndex(items.length);
    };

    const handleDeleteItem = (index: number) => {
        if (window.confirm(`Supprimer "${getItemTitle(items[index])}" ?`)) {
            setItems(items.filter((_, i) => i !== index));
        }
    };
    
    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <div key={index} className="bg-pm-dark/50 border border-pm-off-white/10 rounded-md overflow-hidden">
                    <button type="button" onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full p-3 text-left font-bold flex justify-between items-center hover:bg-pm-gold/5">
                        <span className="truncate pr-4">{getItemTitle(item)}</span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`} />
                    </button>
                    {openIndex === index && (
                        <div className="p-4 border-t border-pm-off-white/10 space-y-3 bg-pm-dark">
                            {renderItem(item, (key, value) => handleItemChange(index, key, value), index)}
                            <div className="text-right pt-2">
                                <button type="button" onClick={() => handleDeleteItem(index)} className="text-red-500/80 hover:text-red-500 text-sm inline-flex items-center gap-1"><TrashIcon className="w-4 h-4" /> Supprimer</button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
            <button type="button" onClick={handleAddItem} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold text-xs font-bold uppercase tracking-widest rounded-full hover:bg-pm-gold hover:text-pm-dark mt-4">
                <PlusIcon className="w-4 h-4"/> Ajouter un élément
            </button>
        </div>
    );
};

export default AdminAgency;--- START OF FILE pages/AdminFashionDayEvents.tsx ---


import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { AppData } from '../hooks/useDataStore';
import { FashionDayEvent, Stylist, Partner } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import ImageInput from '../components/ImageInput';

type EditableData = Pick<AppData, 'fashionDayEvents'>;

const AdminFashionDayEvents: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [localData, setLocalData] = useState<EditableData | null>(null);

    useEffect(() => {
        if (isInitialized && data) {
            setLocalData(JSON.parse(JSON.stringify({ fashionDayEvents: data.fashionDayEvents })));
        }
    }, [isInitialized, data]);

    const handleSave = () => {
        if (!data || !localData) return;
        const newData: AppData = { ...data, ...localData };
        saveData(newData);
        alert("Événements Fashion Day enregistrés avec succès.");
    };

    if (!localData) {
        return <div className="min-h-screen flex items-center justify-center text-pm-gold">Chargement...</div>;
    }

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Gérer les Événements PFD" noIndex />
            <div className="container mx-auto px-6">
                 <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Tableau de Bord
                        </Link>
                        <h1 className="text-4xl font-playfair text-pm-gold">Gérer les Événements Perfect Fashion Day</h1>
                    </div>
                    <button onClick={handleSave} className="px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-lg shadow-pm-gold/30">
                        Sauvegarder les Changements
                    </button>
                </div>

                <div className="space-y-8">
                    <SectionWrapper title="Éditions du Perfect Fashion Day">
                        <ArrayEditor 
                            items={localData.fashionDayEvents}
                            setItems={newItems => setLocalData(p => ({...p!, fashionDayEvents: newItems}))}
                            renderItem={(item: FashionDayEvent, onChange) => (
                                <div className="space-y-4">
                                    <FormInput label="Édition (Numéro)" type="number" value={item.edition} onChange={e => onChange('edition', parseInt(e.target.value, 10))} />
                                    <FormInput label="Date" value={item.date} onChange={e => onChange('date', e.target.value)} />
                                    <FormInput label="Thème" value={item.theme} onChange={e => onChange('theme', e.target.value)} />
                                    <FormTextArea label="Description" value={item.description} onChange={e => onChange('description', e.target.value)} />
                                    <FormInput label="Lieu" value={item.location || ''} onChange={e => onChange('location', e.target.value)} />
                                    <FormInput label="MC" value={item.mc || ''} onChange={e => onChange('mc', e.target.value)} />
                                    <FormInput label="Promoteur" value={item.promoter || ''} onChange={e => onChange('promoter', e.target.value)} />

                                    <SubArrayEditor
                                        title="Stylistes"
                                        items={item.stylists || []}
                                        setItems={newStylists => onChange('stylists', newStylists)}
                                        getNewItem={() => ({ name: 'Nouveau Styliste', description: '', images: [] })}
                                        getItemTitle={stylist => stylist.name}
                                        renderItem={(stylist: Stylist, onStylistChange) => (
                                            <>
                                                <FormInput label="Nom du Styliste" value={stylist.name} onChange={e => onStylistChange('name', e.target.value)} />
                                                <FormTextArea label="Description" value={stylist.description} onChange={e => onStylistChange('description', e.target.value)} />
                                                <FormTextArea label="Images (URLs, une par ligne)" value={(stylist.images || []).join('\n')} onChange={e => onStylistChange('images', e.target.value.split('\n'))} />
                                            </>
                                        )}
                                    />
                                    
                                     <FormTextArea label="Mannequins Vedettes (séparés par des virgules)" value={(item.featuredModels || []).join(', ')} onChange={e => onChange('featuredModels', e.target.value.split(',').map((s: string) => s.trim()))} />
                                     <FormTextArea label="Artistes (un par ligne)" value={(item.artists || []).join('\n')} onChange={e => onChange('artists', e.target.value.split('\n'))} />
                                </div>
                            )}
                            getNewItem={() => ({ edition: (localData.fashionDayEvents.length + 1), date: '', theme: 'Nouveau Thème', description: '', stylists: [], featuredModels: [], artists: [], partners: [] })}
                            getItemTitle={item => `Édition ${item.edition}: "${item.theme}"`}
                        />
                    </SectionWrapper>
                </div>
            </div>
        </div>
    );
};


const SectionWrapper: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-black border border-pm-gold/20 p-6 rounded-lg shadow-lg shadow-black/30">
        <h2 className="text-2xl font-playfair text-pm-gold mb-6 border-b border-pm-gold/20 pb-3">{title}</h2>
        <div className="space-y-4">{children}</div>
    </div>
);

const FormInput: React.FC<{label: string, value: any, onChange: any, type?: string}> = ({label, value, onChange, type = "text"}) => (
    <div>
        <label className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <input type={type} value={value} onChange={onChange} className="admin-input" />
    </div>
);

const FormTextArea: React.FC<{label: string, value: any, onChange: any}> = ({label, value, onChange}) => (
    <div>
        <label className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <textarea value={value} onChange={onChange} rows={4} className="admin-input admin-textarea" />
    </div>
);


const ArrayEditor: React.FC<{
    items: any[];
    setItems: (items: any[]) => void;
    renderItem: (item: any, onChange: (key: string, value: any) => void, index: number) => React.ReactNode;
    getNewItem: () => any;
    getItemTitle: (item: any) => string;
}> = ({ items, setItems, renderItem, getNewItem, getItemTitle }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleItemChange = (index: number, key: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [key]: value };
        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, getNewItem()]);
        setOpenIndex(items.length);
    };

    const handleDeleteItem = (index: number) => {
        if (window.confirm(`Supprimer "${getItemTitle(items[index])}" ?`)) {
            setItems(items.filter((_, i) => i !== index));
        }
    };
    
    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <div key={index} className="bg-pm-dark/50 border border-pm-off-white/10 rounded-md overflow-hidden">
                    <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full p-3 text-left font-bold flex justify-between items-center hover:bg-pm-gold/5">
                        <span className="truncate pr-4">{getItemTitle(item)}</span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`} />
                    </button>
                    {openIndex === index && (
                        <div className="p-4 border-t border-pm-off-white/10 space-y-3 bg-pm-dark">
                            {renderItem(item, (key, value) => handleItemChange(index, key, value), index)}
                            <div className="text-right pt-2">
                                <button onClick={() => handleDeleteItem(index)} className="text-red-500/80 hover:text-red-500 text-sm inline-flex items-center gap-1"><TrashIcon className="w-4 h-4" /> Supprimer</button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
            <button onClick={handleAddItem} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold text-xs font-bold uppercase tracking-widest rounded-full hover:bg-pm-gold hover:text-pm-dark mt-4">
                <PlusIcon className="w-4 h-4"/> Ajouter une Édition
            </button>
        </div>
    );
};

const SubArrayEditor: React.FC<{ title: string } & Omit<React.ComponentProps<typeof ArrayEditor>, 'items' | 'setItems'> & { items: any[], setItems: (items: any[]) => void }> = ({ title, ...props }) => (
    <div className="p-3 bg-black/50 border border-pm-off-white/10 rounded-md">
        <h4 className="text-md font-bold text-pm-gold/80 mb-3">{title}</h4>
        <ArrayEditor {...props} />
    </div>
);


export default AdminFashionDayEvents;--- START OF FILE components/ArticleGenerator.tsx ---

import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Article } from '../types';
import CloseIcon from './icons/CloseIcon';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface ArticleGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    onArticleGenerated: (articleData: Partial<Article>) => void;
}

const FormTextArea: React.FC<{label: string, name: string, value: any, onChange: any, rows: number}> = ({label, name, value, onChange, rows}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} rows={rows} className="admin-input admin-textarea" />
    </div>
);

const ArticleGenerator: React.FC<ArticleGeneratorProps> = ({ isOpen, onClose, onArticleGenerated }) => {
    const [formData, setFormData] = useState({
        subject: '',
        bio: '',
        role: '',
        event: '',
        photos: '',
        quotes: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        const prompt = `
            Tu es un assistant IA pour un site web de mode et d'événementiel (Perfect Models Management) basé au Gabon. 
            Ton rôle est de générer un article complet et formaté en JSON.
            
            Consignes de style :
            - Le ton doit être inspirant, professionnel et culturellement ancré dans le Gabon et l’Afrique.
            - Le contenu doit mettre en valeur le talent ou l'événement.
            - Les paragraphes doivent être fluides et bien structurés.
            - Laisse le champ "imageUrl" principal vide. Utilise les URLs des photos fournies UNIQUEMENT pour les blocs de type "image" dans le tableau "content".
            - Incorpore les citations fournies dans des blocs de type "quote".
            - Choisis une catégorie pertinente parmi : "Interview", "Événement", "Tendance", "Conseils".
            - Génère des tags pertinents pour le SEO.

            Informations fournies :
            - Sujet / Nom : ${formData.subject}
            - Biographie / Description : ${formData.bio}
            - Rôle : ${formData.role}
            - Événement associé : ${formData.event}
            - URLs des photos (une par ligne) : ${formData.photos}
            - Citations (une par ligne) : ${formData.quotes}

            Génère l'article en respectant scrupuleusement le schéma JSON.
        `;
        
        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                author: { type: Type.STRING, description: "Doit être 'Perfect Models Management' ou 'Focus Model 241'" },
                date: { type: Type.STRING, description: "Date au format AAAA-MM-JJ" },
                category: { type: Type.STRING, description: "Ex: Interview, Événement, Tendance, Conseils"},
                excerpt: { type: Type.STRING, description: "Résumé court de 2-3 phrases." },
                imageUrl: { type: Type.STRING, description: "Laisse ce champ vide. Il sera rempli par l'utilisateur." },
                content: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, description: "heading, paragraph, quote, ou image" },
                            level: { type: Type.INTEGER, description: "Pour le type 'heading', 2 ou 3" },
                            text: { type: Type.STRING },
                            author: { type: Type.STRING, description: "Pour le type 'quote'" },
                            src: { type: Type.STRING, description: "Pour le type 'image'" },
                            alt: { type: Type.STRING, description: "Pour le type 'image'" },
                            caption: { type: Type.STRING, description: "Pour le type 'image'" }
                        },
                        required: ["type"]
                    }
                },
                tags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            },
            required: ["title", "author", "date", "category", "excerpt", "content", "tags"]
        };

        try {
            if (!process.env.API_KEY) {
                throw new Error("La clé API Gemini n'est pas configurée.");
            }
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema
                }
            });

            const jsonResult = response.text;
            const parsedArticle: Partial<Article> = JSON.parse(jsonResult);
            onArticleGenerated(parsedArticle);

        } catch (err: any) {
            console.error("Erreur de l'API Gemini:", err);
            setError(err.message || "Une erreur est survenue lors de la génération de l'article.");
        } finally {
            setIsLoading(false);
        }

    }, [formData, onArticleGenerated]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl shadow-pm-gold/10 w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-pm-gold/20">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-playfair text-pm-gold flex items-center gap-2">
                            <SparklesIcon className="w-6 h-6" />
                            Générateur d'Article par IA
                        </h2>
                        <button onClick={onClose} className="text-pm-off-white/70 hover:text-white">
                            <CloseIcon />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto flex-grow">
                    <p className="text-sm text-pm-off-white/80">Fournissez les informations de base ci-dessous. L'IA rédigera un article complet et structuré que vous pourrez ensuite réviser et publier.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormTextArea label="Nom / Sujet Principal" name="subject" value={formData.subject} onChange={handleChange} rows={2} />
                        <FormTextArea label="Rôle / Fonction" name="role" value={formData.role} onChange={handleChange} rows={2} />
                    </div>
                    <FormTextArea label="Biographie / Description" name="bio" value={formData.bio} onChange={handleChange} rows={4} />
                    <FormTextArea label="Événement Associé (optionnel)" name="event" value={formData.event} onChange={handleChange} rows={2} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormTextArea label="URLs des Photos (une par ligne)" name="photos" value={formData.photos} onChange={handleChange} rows={4} />
                        <FormTextArea label="Citations (une par ligne)" name="quotes" value={formData.quotes} onChange={handleChange} rows={4} />
                    </div>
                    {error && <div className="p-3 bg-red-900/50 border border-red-500 text-red-300 text-sm rounded-md">{error}</div>}
                </div>
                
                <div className="p-6 border-t border-pm-gold/20 flex justify-end gap-4">
                     <button
                        onClick={handleGenerate}
                        disabled={isLoading || !formData.subject}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Génération en cours...' : 'Générer l\'article'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArticleGenerator;--- START OF FILE pages/ModelDashboard.tsx ---


import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
// FIX: Updated react-router-dom imports for v6 compatibility. Replaced `useHistory` with `useNavigate`.
import { Link, useNavigate } from 'react-router-dom';
import { BookOpenIcon, PresentationChartLineIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { Model } from '../src/types';
import ModelForm from '../components/ModelForm';

type ActiveTab = 'profile' | 'results';

const ModelDashboard: React.FC = () => {
    const { data, saveData } = useData();
    // FIX: Use useNavigate for react-router-dom v6 compatibility.
    const navigate = useNavigate();
    const userId = sessionStorage.getItem('userId');
    const [editableModel, setEditableModel] = useState<Model | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>('profile');

    const originalModel = data?.models.find(m => m.id === userId);
    const courseModulesWithQuizzes = data?.courseData?.filter(m => m.quiz && m.quiz.length > 0) || [];

    useEffect(() => {
        if (originalModel) {
            setEditableModel(JSON.parse(JSON.stringify(originalModel)));
        }
    }, [originalModel]);
    
    const handleSave = async (updatedModel: Model) => {
        if (!data || !editableModel) return;
        
        const updatedModels = data.models.map(m => 
            m.id === updatedModel.id ? updatedModel : m
        );
        
        await saveData({ ...data, models: updatedModels });
        alert("Profil mis à jour avec succès.");
    };
    
    const handleCancel = () => {
        if (originalModel) {
            setEditableModel(JSON.parse(JSON.stringify(originalModel)));
            alert("Les modifications ont été annulées.");
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        // FIX: Use navigate for navigation in react-router-dom v6.
        navigate('/login');
    };

    if (!editableModel) {
        return (
            <div className="bg-pm-dark text-pm-off-white min-h-screen flex items-center justify-center">
                <p>Chargement du profil...</p>
            </div>
        );
    }
    
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title={`Profil de ${editableModel.name}`} noIndex />
            <div className="container mx-auto px-6 max-w-7xl">
                <header className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-playfair text-pm-gold">Bienvenue, {editableModel.name.split(' ')[0]}</h1>
                        <p className="text-pm-off-white/80">Votre espace personnel pour gérer votre profil et suivre votre progression.</p>
                    </div>
                     <button onClick={handleLogout} className="inline-flex items-center gap-2 text-sm text-pm-gold/80 hover:text-pm-gold">
                        <ArrowRightOnRectangleIcon className="w-5 h-5" /> Déconnexion
                     </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar / Quick Links */}
                    <aside className="lg:col-span-1 space-y-4">
                         <Link to="/formations" className="group block bg-black p-6 border border-pm-gold/20 hover:border-pm-gold transition-all duration-300 rounded-lg">
                             <BookOpenIcon className="w-8 h-8 text-pm-gold mb-3" />
                            <h2 className="text-xl font-playfair text-pm-gold mb-1">Accéder au Classroom</h2>
                            <p className="text-sm text-pm-off-white/70">Continuez votre formation.</p>
                        </Link>
                        <Link to={`/mannequins/${editableModel.id}`} className="group block bg-black p-6 border border-pm-gold/20 hover:border-pm-gold transition-all duration-300 rounded-lg">
                             <UserIcon className="w-8 h-8 text-pm-gold mb-3" />
                            <h2 className="text-xl font-playfair text-pm-gold mb-1">Voir mon Portfolio Public</h2>
                            <p className="text-sm text-pm-off-white/70">Consultez votre profil public.</p>
                        </Link>
                    </aside>
                    
                    {/* Main Content with Tabs */}
                    <main className="lg:col-span-3">
                        <div className="border-b border-pm-gold/20 mb-6">
                            <nav className="flex space-x-4" aria-label="Tabs">
                                <TabButton name="Mon Profil" icon={UserIcon} isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                                <TabButton name="Mes Résultats" icon={PresentationChartLineIcon} isActive={activeTab === 'results'} onClick={() => setActiveTab('results')} />
                            </nav>
                        </div>
                        
                        <div>
                            {activeTab === 'profile' && (
                                <ModelForm 
                                    model={editableModel}
                                    onSave={handleSave}
                                    onCancel={handleCancel}
                                    mode="model"
                                    isCreating={false}
                                />
                            )}
                            {activeTab === 'results' && (
                                <div className="bg-black p-8 border border-pm-gold/20 rounded-lg shadow-lg shadow-black/30">
                                    <h2 className="text-2xl font-playfair text-pm-gold mb-6">Résultats des Quiz</h2>
                                    {courseModulesWithQuizzes && courseModulesWithQuizzes.length > 0 ? (
                                        <ul className="space-y-3">
                                            {courseModulesWithQuizzes.map(module => {
                                                const score = editableModel.quizScores?.[module.slug];
                                                return (
                                                    <li key={module.slug} className="flex justify-between items-center bg-pm-dark p-3 rounded-md text-sm">
                                                        <span className="text-pm-off-white/80">{module.title}</span>
                                                        {score !== undefined ? (
                                                            <span className={`font-bold text-lg ${getScoreColor(score)}`}>{score}%</span>
                                                        ) : (
                                                            <span className="text-xs text-pm-off-white/50">Non complété</span>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <p className="text-pm-off-white/70 text-sm">Aucun quiz disponible pour le moment.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

const TabButton: React.FC<{name: string, icon: React.ElementType, isActive: boolean, onClick: () => void}> = ({ name, icon: Icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 font-medium text-sm rounded-t-lg transition-colors border-b-2 ${
            isActive 
            ? 'border-pm-gold text-pm-gold' 
            : 'border-transparent text-pm-off-white/70 hover:text-pm-gold'
        }`}
    >
        <Icon className="w-5 h-5" />
        {name}
    </button>
);

export default ModelDashboard;--- START OF FILE pages/AdminClassroomProgress.tsx ---

import React from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

const AdminClassroomProgress: React.FC = () => {
    const { data } = useData();
    const models = data?.models || [];
    const courseModulesWithQuizzes = data?.courseData?.filter(m => m.quiz && m.quiz.length > 0) || [];

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Suivi Classroom" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Tableau de Bord
                </Link>
                <h1 className="text-4xl font-playfair text-pm-gold">Suivi de Progression Classroom</h1>
                <p className="text-pm-off-white/70 mt-2 mb-8">
                    Consultez les scores des mannequins aux différents quiz de la formation.
                </p>

                <div className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden shadow-lg shadow-black/30">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-pm-dark/50">
                                <tr className="border-b border-pm-gold/20">
                                    <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70 sticky left-0 bg-pm-dark/50 z-10">Mannequin</th>
                                    {courseModulesWithQuizzes.map(module => (
                                        <th key={module.slug} className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70 text-center whitespace-nowrap">{module.title}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {models.map(model => (
                                    <tr key={model.id} className="border-b border-pm-dark hover:bg-pm-dark/50 [&:nth-child(even)]:bg-pm-dark/30 group">
                                        <td className="p-4 font-semibold sticky left-0 bg-black group-hover:bg-pm-dark/50 z-10 whitespace-nowrap">{model.name}</td>
                                        {courseModulesWithQuizzes.map(module => {
                                            const score = model.quizScores?.[module.slug];
                                            return (
                                                <td key={module.slug} className="p-4 text-center">
                                                    {score !== undefined ? (
                                                        <span className={`font-bold text-lg ${getScoreColor(score)}`}>{score}%</span>
                                                    ) : (
                                                        <span className="text-xs text-pm-off-white/50">-</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {models.length === 0 && <p className="text-center p-8 text-pm-off-white/60">Aucun mannequin trouvé.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminClassroomProgress;--- START OF FILE pages/AdminModelAccess.tsx ---



import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

const AdminModelAccess: React.FC = () => {
    const { data } = useData();
    const models = data?.models || [];
    const [copiedUsername, setCopiedUsername] = useState<string | null>(null);

    const handleCopy = (textToCopy: string, username: string) => {
        navigator.clipboard.writeText(textToCopy);
        setCopiedUsername(username);
        setTimeout(() => setCopiedUsername(null), 2000);
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Accès Mannequins" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Tableau de Bord
                </Link>
                <h1 className="text-4xl font-playfair text-pm-gold mb-2">Accès des Mannequins</h1>
                <p className="text-pm-off-white/70 mb-8">
                    Tableau récapitulatif des identifiants de connexion uniques pour chaque mannequin.
                </p>

                <div className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden shadow-lg shadow-black/30">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-pm-dark/50">
                                <tr className="border-b border-pm-gold/20">
                                    <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Nom du Mannequin</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Identifiant (Matricule)</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Mot de passe</th>
                                </tr>
                            </thead>
                            <tbody>
                                {models.map(model => (
                                    <tr key={model.id} className="border-b border-pm-dark hover:bg-pm-dark/50 [&:nth-child(even)]:bg-pm-dark/30">
                                        <td className="p-4 font-semibold">{model.name}</td>
                                        <td className="p-4 font-mono text-xs text-pm-gold/80">{model.username}</td>
                                        <td className="p-4 text-pm-off-white/80">
                                            <div className="flex items-center gap-2">
                                                <span>{model.password}</span>
                                                <button onClick={() => handleCopy(model.password, model.username)} className="text-pm-off-white/60 hover:text-pm-gold">
                                                    {copiedUsername === model.username ? (
                                                        <CheckIcon className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <ClipboardDocumentIcon className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {models.length === 0 && <p className="text-center p-8 text-pm-off-white/60">Aucun mannequin trouvé.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminModelAccess;--- START OF FILE components/ModelForm.tsx ---

import React, { useState, useEffect } from 'react';
import { Model, ModelDistinction, AIAssistantProps } from '../src/types';
import ImageInput from './ImageInput';
import { ChevronDownIcon, PlusIcon, TrashIcon, SparklesIcon } from '@heroicons/react/24/outline';
import AIAssistant from './AIAssistant';

interface ModelFormProps {
    model: Model;
    onSave: (model: Model) => void;
    onCancel: () => void;
    isCreating: boolean;
    mode: 'admin' | 'model';
}

const ModelForm: React.FC<ModelFormProps> = ({ model, onSave, onCancel, isCreating, mode }) => {
    const [formData, setFormData] = useState<Model>(model);
    const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
    const [aiAssistantProps, setAIAssistantProps] = useState<Omit<AIAssistantProps, 'isOpen' | 'onClose'>>({
        onInsertContent: () => {}, fieldName: '', initialPrompt: '',
    });

    const openAIAssistant = (fieldName: string, onInsert: (content: string) => void, initialPrompt: string = '') => {
        setAIAssistantProps({ fieldName, onInsertContent: onInsert, initialPrompt });
        setIsAIAssistantOpen(true);
    };

    useEffect(() => {
        setFormData(model);
    }, [model]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            const isNumber = type === 'number';
            setFormData(prev => ({ ...prev, [name]: isNumber && value !== '' ? Number(value) : value }));
        }
    };

    const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            measurements: {
                ...prev.measurements,
                [name]: value,
            }
        }));
    };

    const handleArrayChange = (name: 'categories', value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value.split(',').map(item => item.trim()).filter(Boolean)
        }));
    };

    const handlePortfolioImagesChange = (index: number, value: string) => {
        const newImages = [...(formData.portfolioImages || [])];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, portfolioImages: newImages }));
    };

    const handleAddPortfolioImage = () => {
        setFormData(prev => ({ ...prev, portfolioImages: [...(prev.portfolioImages || []), ''] }));
    };

    const handleRemovePortfolioImage = (index: number) => {
        setFormData(prev => ({ ...prev, portfolioImages: (prev.portfolioImages || []).filter((_, i) => i !== index) }));
    };

    const handleImageChange = (value: string) => {
        setFormData(prev => ({ ...prev, imageUrl: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const isAdmin = mode === 'admin';

    return (
        <>
            <AIAssistant 
                isOpen={isAIAssistantOpen} 
                onClose={() => setIsAIAssistantOpen(false)}
                {...aiAssistantProps} 
            />
            <h1 className="admin-page-title mb-8">
                {isCreating ? 'Ajouter un Mannequin' : (isAdmin ? `Modifier le profil de ${model.name}` : `Mon Profil`)}
            </h1>
            <form onSubmit={handleSubmit} className="admin-section-wrapper space-y-8">
                
                <Section title="Informations de Base">
                    <FormInput label="Nom Complet" name="name" value={formData.name} onChange={handleChange} disabled={!isAdmin} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput label="Âge" name="age" type="number" value={formData.age || ''} onChange={handleChange} />
                        <FormSelect label="Genre" name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="Femme">Femme</option>
                            <option value="Homme">Homme</option>
                        </FormSelect>
                    </div>
                    <FormInput label="Lieu de résidence" name="location" value={formData.location || ''} onChange={handleChange} />
                </Section>
                
                {isAdmin && (
                    <Section title="Accès, Niveau & Visibilité (Admin)">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Identifiant (Matricule)" name="username" value={formData.username} onChange={handleChange} disabled={!isCreating} />
                            <FormInput label="Mot de passe" name="password" value={formData.password} onChange={handleChange} />
                        </div>
                        <FormSelect label="Niveau" name="level" value={formData.level || 'Débutant'} onChange={handleChange}>
                            <option value="Débutant">Débutant</option>
                            <option value="Pro">Pro</option>
                        </FormSelect>
                        <div className="flex items-center gap-3 pt-2">
                            <input 
                                type="checkbox"
                                id="isPublic"
                                name="isPublic"
                                checked={!!formData.isPublic}
                                onChange={handleChange}
                                className="h-5 w-5 rounded bg-pm-dark border-pm-gold text-pm-gold focus:ring-pm-gold"
                            />
                            <label htmlFor="isPublic" className="admin-label !mb-0">
                                Rendre le profil public sur le site
                            </label>
                        </div>
                        <p className="text-xs text-pm-off-white/60">L'identifiant est généré automatiquement. La visibilité publique rend le mannequin visible dans la section `/mannequins`.</p>
                    </Section>
                )}

                <Section title="Contact">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput label="Email" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
                        <FormInput label="Téléphone" name="phone" type="tel" value={formData.phone || ''} onChange={handleChange} />
                     </div>
                </Section>

                <Section title="Physique & Mensurations">
                    <ImageInput label="Photo Principale" value={formData.imageUrl} onChange={handleImageChange} />
                    <FormInput label="Taille (ex: 1m80)" name="height" value={formData.height} onChange={handleChange} />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <FormInput label="Poitrine (cm)" name="chest" value={formData.measurements.chest} onChange={handleMeasurementChange} />
                        <FormInput label="Taille (cm)" name="waist" value={formData.measurements.waist} onChange={handleMeasurementChange} />
                        <FormInput label="Hanches (cm)" name="hips" value={formData.measurements.hips} onChange={handleMeasurementChange} />
                        <FormInput label="Pointure (EU)" name="shoeSize" value={formData.measurements.shoeSize} onChange={handleMeasurementChange} />
                    </div>
                </Section>

                <Section title="Carrière & Portfolio">
                    {isAdmin && (
                        <div>
                            <label className="admin-label">Distinctions</label>
                            <ArrayEditor
                                items={formData.distinctions || []}
                                setItems={newItems => setFormData(p => ({...p, distinctions: newItems}))}
                                renderItem={(item: ModelDistinction, onChange) => (
                                    <>
                                        <FormInput label="Nom de la distinction" name="name" value={item.name} onChange={e => onChange('name', e.target.value)} />
                                        <FormTextArea 
                                            label="Titres (un par ligne)" 
                                            name="titles"
                                            value={(item.titles || []).join('\n')} 
                                            onChange={e => onChange('titles', e.target.value.split('\n').filter(Boolean))} 
                                        />
                                    </>
                                )}
                                getNewItem={() => ({ name: 'Nouveau Palmarès', titles: [] })}
                                getItemTitle={item => item.name}
                            />
                        </div>
                    )}
                    {!isAdmin && formData.distinctions && formData.distinctions.length > 0 && (
                        <div>
                            <label className="admin-label">Distinctions (non modifiable)</label>
                            <div className="p-4 bg-pm-dark rounded-md border border-pm-off-white/10 space-y-2">
                                {formData.distinctions.map((d, i) => (
                                    <div key={i}>
                                        <p className="font-semibold">{d.name}</p>
                                        {d.titles && d.titles.length > 0 && (
                                            <ul className="list-disc list-inside text-sm text-pm-off-white/80 pl-2">
                                                {d.titles.map((t, ti) => <li key={ti}>{t}</li>)}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <FormTextArea label="Catégories (séparées par des virgules)" name="categories" value={(formData.categories || []).join(', ')} onChange={(e) => handleArrayChange('categories', e.target.value)} disabled={!isAdmin} />
                    <FormTextArea 
                        label="Expérience" name="experience" value={formData.experience} onChange={handleChange} disabled={!isAdmin} rows={5}
                        onOpenAI={isAdmin ? () => openAIAssistant(
                            'Expérience Mannequin',
                            (content) => setFormData(p => ({...p, experience: content})),
                            `Rédige une description d'expérience professionnelle pour le mannequin ${formData.name}, spécialisé(e) dans les catégories suivantes : ${formData.categories.join(', ')}. Mets en avant sa polyvalence et son professionnalisme.`
                        ) : undefined} 
                    />
                    <FormTextArea 
                        label="Parcours" name="journey" value={formData.journey} onChange={handleChange} disabled={!isAdmin} rows={5} 
                        onOpenAI={isAdmin ? () => openAIAssistant(
                            'Parcours Mannequin',
                            (content) => setFormData(p => ({...p, journey: content})),
                            `Rédige un paragraphe inspirant sur le parcours du mannequin ${formData.name}. Mentionne comment il/elle a été découvert(e) et sa passion pour la mode.`
                        ) : undefined}
                    />
                </Section>
                
                <Section title="Photos du Portfolio">
                    <div className="space-y-4">
                        {(formData.portfolioImages || []).map((url, index) => (
                            <div key={index} className="flex items-end gap-2">
                                <div className="flex-grow">
                                    <ImageInput 
                                        label={`Photo ${index + 1}`} 
                                        value={url} 
                                        onChange={(value) => handlePortfolioImagesChange(index, value)} 
                                    />
                                </div>
                                <button type="button" onClick={() => handleRemovePortfolioImage(index)} className="p-2 text-red-500/80 hover:text-red-500 bg-black rounded-md border border-pm-off-white/10 mb-2">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddPortfolioImage} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold text-xs font-bold uppercase tracking-widest rounded-full hover:bg-pm-gold hover:text-pm-dark mt-2">
                            <PlusIcon className="w-4 h-4" /> Ajouter une photo
                        </button>
                    </div>
                </Section>

                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onCancel} className="px-6 py-2 bg-pm-dark border border-pm-off-white/50 text-pm-off-white/80 font-bold uppercase tracking-widest text-sm rounded-full hover:border-white">Annuler</button>
                    <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-md shadow-pm-gold/30">Sauvegarder</button>
                </div>
            </form>
        </>
    );
};

const Section: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div className="pt-8 first:pt-0">
        <h2 className="admin-section-title">{title}</h2>
        <div className="space-y-6">{children}</div>
    </div>
);

const FormInput: React.FC<{label: string, name: string, value: any, onChange: any, type?: string, disabled?: boolean}> = (props) => (
    <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <input type={props.type || "text"} {...props} className="admin-input" />
    </div>
);

const FormSelect: React.FC<{label: string, name: string, value: any, onChange: any, children: React.ReactNode, disabled?: boolean}> = (props) => (
     <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <select {...props} className="admin-input">
            {props.children}
        </select>
    </div>
);

const FormTextArea: React.FC<{label: string, name: string, value: any, onChange: any, rows?: number, disabled?: boolean, onOpenAI?: () => void}> = (props) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={props.name} className="admin-label !mb-0">{props.label}</label>
             {props.onOpenAI && (
                <button type="button" onClick={props.onOpenAI} className="inline-flex items-center gap-1 text-xs text-pm-gold/80 hover:text-pm-gold">
                    <SparklesIcon className="w-4 h-4" /> Assister
                </button>
            )}
        </div>
        <textarea {...props} rows={props.rows || 3} className="admin-input admin-textarea" />
    </div>
);

const ArrayEditor: React.FC<{
    items: any[];
    setItems: (items: any[]) => void;
    renderItem: (item: any, onChange: (key: string, value: any) => void, index: number) => React.ReactNode;
    getNewItem: () => any;
    getItemTitle: (item: any) => string;
}> = ({ items, setItems, renderItem, getNewItem, getItemTitle }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleItemChange = (index: number, key: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [key]: value };
        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, getNewItem()]);
        setOpenIndex(items.length);
    };

    const handleDeleteItem = (index: number) => {
        if (window.confirm(`Supprimer "${getItemTitle(items[index])}" ?`)) {
            setItems(items.filter((_, i) => i !== index));
        }
    };
    
    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <div key={index} className="bg-pm-dark/50 border border-pm-off-white/10 rounded-md overflow-hidden">
                    <button type="button" onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full p-3 text-left font-bold flex justify-between items-center hover:bg-pm-gold/5">
                        <span className="truncate pr-4">{getItemTitle(item)}</span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`} />
                    </button>
                    {openIndex === index && (
                        <div className="p-4 border-t border-pm-off-white/10 space-y-3 bg-pm-dark">
                            {renderItem(item, (key, value) => handleItemChange(index, key, value), index)}
                            <div className="text-right pt-2">
                                <button type="button" onClick={() => handleDeleteItem(index)} className="text-red-500/80 hover:text-red-500 text-sm inline-flex items-center gap-1"><TrashIcon className="w-4 h-4" /> Supprimer</button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
            <button type="button" onClick={handleAddItem} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold text-xs font-bold uppercase tracking-widest rounded-full hover:bg-pm-gold hover:text-pm-dark mt-4">
                <PlusIcon className="w-4 h-4"/> Ajouter une distinction
            </button>
        </div>
    );
};

export default ModelForm;--- START OF FILE pages/AdminNews.tsx ---

import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { NewsItem, AIAssistantProps } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon, SparklesIcon } from '@heroicons/react/24/outline';
import ImageInput from '../components/ImageInput';
import AIAssistant from '../components/AIAssistant';

const AdminNews: React.FC = () => {
  const { data, saveData } = useData();
  const [localNews, setLocalNews] = useState<NewsItem[]>([]);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (data?.newsItems) {
      setLocalNews([...data.newsItems]);
    }
  }, [data?.newsItems]);

  const handleFormSave = async (itemToSave: NewsItem) => {
    if (!data) return;
    let updatedNews;
    if (isCreating) {
        const newItem = { ...itemToSave, id: itemToSave.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') + '-' + Date.now() };
        updatedNews = [newItem, ...localNews];
    } else {
        updatedNews = localNews.map(a => a.id === itemToSave.id ? itemToSave : a);
    }
    
    await saveData({ ...data, newsItems: updatedNews });
    alert("Actualité enregistrée avec succès.");

    setEditingItem(null);
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) {
      if (!data) return;
      const updatedNews = localNews.filter(a => a.id !== id);
      await saveData({ ...data, newsItems: updatedNews });
      alert("Actualité supprimée avec succès.");
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (!data) return;
    const newItems = [...localNews];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    
    await saveData({ ...data, newsItems: newItems });
  };
  
  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingItem({
      id: '',
      title: '',
      date: new Date().toISOString().split('T')[0],
      imageUrl: '',
      excerpt: '',
      link: ''
    });
  };

  if (editingItem) {
    return <NewsForm item={editingItem} onSave={handleFormSave} onCancel={() => {setEditingItem(null); setIsCreating(false);}} isCreating={isCreating}/>
  }

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Gérer les Actualités" noIndex />
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div>
                 <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Dashboard
                </Link>
                <h1 className="text-4xl font-playfair text-pm-gold">Gérer les Actualités</h1>
            </div>
             <div className="flex items-center gap-4">
                <button onClick={handleStartCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full hover:bg-pm-gold hover:text-pm-dark">
                    <PlusIcon className="w-5 h-5"/> Ajouter une Actualité
                </button>
            </div>
        </div>

        <div className="bg-black border border-pm-gold/20 p-6 rounded-lg shadow-lg shadow-black/30 space-y-4">
          {localNews.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-pm-dark/50 rounded-md hover:bg-pm-dark">
              <div className="flex items-center gap-4">
                <img src={item.imageUrl} alt={item.title} className="w-24 h-16 object-cover rounded"/>
                <div>
                  <h2 className="font-bold">{item.title}</h2>
                  <p className="text-sm text-pm-off-white/70">{item.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="disabled:opacity-30" title="Monter"><ArrowUpIcon className="w-5 h-5"/></button>
                <button onClick={() => handleMove(index, 'down')} disabled={index === localNews.length - 1} className="disabled:opacity-30" title="Descendre"><ArrowDownIcon className="w-5 h-5"/></button>
                <button onClick={() => { setEditingItem(item); setIsCreating(false); }} className="text-pm-gold/70 hover:text-pm-gold"><PencilIcon className="w-5 h-5"/></button>
                <button onClick={() => handleDelete(item.id)} className="text-red-500/70 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NewsForm: React.FC<{ item: NewsItem, onSave: (item: NewsItem) => void, onCancel: () => void, isCreating: boolean }> = ({ item, onSave, onCancel, isCreating }) => {
    const [formData, setFormData] = useState(item);
    const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
    const [aiAssistantProps, setAIAssistantProps] = useState<Omit<AIAssistantProps, 'isOpen' | 'onClose'>>({
        onInsertContent: () => {}, fieldName: '', initialPrompt: '',
    });

    const openAIAssistant = (fieldName: string, onInsert: (content: string) => void, initialPrompt: string = '') => {
        setAIAssistantProps({ fieldName, onInsertContent: onInsert, initialPrompt });
        setIsAIAssistantOpen(true);
    };

    useEffect(() => {
        setFormData(item);
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleImageChange = (value: string) => {
        setFormData(prev => ({ ...prev, imageUrl: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <>
            <AIAssistant 
                isOpen={isAIAssistantOpen} 
                onClose={() => setIsAIAssistantOpen(false)}
                {...aiAssistantProps} 
            />
            <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h1 className="text-4xl font-playfair text-pm-gold mb-8">{isCreating ? 'Nouvelle Actualité' : "Modifier l'Actualité"}</h1>
                    <form onSubmit={handleSubmit} className="bg-black p-8 border border-pm-gold/20 space-y-6 rounded-lg shadow-lg shadow-black/30">
                        <FormInput 
                            label="Titre" name="title" value={formData.title} onChange={handleChange} 
                            onOpenAI={() => openAIAssistant(
                                'Titre de l\'actualité',
                                (content) => setFormData(p => ({...p, title: content.replace(/"/g, '')})),
                                `Génère 5 titres accrocheurs pour une actualité sur le thème : "${formData.excerpt || 'un événement de mode'}"`
                            )}
                        />
                        <ImageInput label="Image" value={formData.imageUrl} onChange={handleImageChange} />
                        <FormInput label="Date" name="date" type="date" value={formData.date} onChange={handleChange} />
                        <FormTextArea 
                            label="Extrait" name="excerpt" value={formData.excerpt} onChange={handleChange}
                             onOpenAI={() => openAIAssistant(
                                'Extrait de l\'actualité',
                                (content) => setFormData(p => ({...p, excerpt: content})),
                                `Rédige une brève description (1-2 phrases) pour une actualité intitulée : "${formData.title}"`
                            )}
                        />
                        <FormInput label="Lien (optionnel)" name="link" value={formData.link || ''} onChange={handleChange} />
                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={onCancel} className="px-6 py-2 bg-pm-dark border border-pm-off-white/50 text-pm-off-white/80 font-bold uppercase tracking-widest text-sm rounded-full hover:border-white">Annuler</button>
                            <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-md shadow-pm-gold/30">Sauvegarder</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

const FormInput: React.FC<{label: string, name: string, value: any, onChange: any, type?: string, onOpenAI?: () => void}> = ({label, name, value, onChange, type="text", onOpenAI}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70">{label}</label>
            {onOpenAI && (
                <button type="button" onClick={onOpenAI} className="inline-flex items-center gap-1 text-xs text-pm-gold/80 hover:text-pm-gold">
                    <SparklesIcon className="w-4 h-4" /> Assister
                </button>
            )}
        </div>
        <input type={type} id={name} name={name} value={value} onChange={onChange} className="admin-input" />
    </div>
);
const FormTextArea: React.FC<{label: string, name: string, value: any, onChange: any, onOpenAI?: () => void}> = ({label, name, value, onChange, onOpenAI}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70">{label}</label>
             {onOpenAI && (
                <button type="button" onClick={onOpenAI} className="inline-flex items-center gap-1 text-xs text-pm-gold/80 hover:text-pm-gold">
                    <SparklesIcon className="w-4 h-4" /> Assister
                </button>
            )}
        </div>
        <textarea id={name} name={name} value={value} onChange={onChange} rows={5} className="admin-input admin-textarea" />
    </div>
);

export default AdminNews;--- START OF FILE pages/Chat.tsx ---

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat as GeminiChat } from '@google/genai';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/solid';
import SEO from '../components/SEO';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const Chat: React.FC = () => {
  const [chat, setChat] = useState<GeminiChat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        if (!process.env.API_KEY) {
          throw new Error("API key is not configured.");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chatSession = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: "You are the PMM Assistant, an expert AI for Perfect Models Management. You are friendly, professional, and knowledgeable about the modeling industry, fashion in Gabon, and the agency's activities. You answer questions and provide advice based on the agency's context. Your responses should be concise and helpful. Start the conversation by introducing yourself and asking how you can help.",
          },
        });
        setChat(chatSession);
        
        // Fetch initial welcome message
        setIsLoading(true);
        const response = await chatSession.sendMessageStream({ message: "Hello" });
        let fullResponse = "";
        for await (const chunk of response) {
            fullResponse += chunk.text;
        }
        setMessages([{ sender: 'ai', text: fullResponse }]);
        setIsLoading(false);

      } catch (err: any) {
        console.error("Chat initialization error:", err);
        setError("Impossible d'initialiser l'assistant IA. Vérifiez la configuration de la clé API.");
        setIsLoading(false);
      }
    };
    initChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chat || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const responseStream = await chat.sendMessageStream({ message: input });
      
      let aiResponseText = "";
      setMessages(prev => [...prev, { sender: 'ai', text: "" }]);
      
      for await (const chunk of responseStream) {
        aiResponseText += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { sender: 'ai', text: aiResponseText };
          return newMessages;
        });
      }

    } catch (err: any) {
      console.error("Gemini API error:", err);
      const errorMessage = "Désolé, une erreur est survenue. Veuillez réessayer.";
      setError(errorMessage);
      setMessages(prev => [...prev, { sender: 'ai', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="Assistant IA | PMM" description="Discutez avec l'assistant IA de Perfect Models Management." noIndex />
      <div className="bg-pm-dark text-pm-off-white h-screen flex flex-col pt-28">
         <div className="container mx-auto px-6 flex-grow flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-4 mb-4">
                <Link to="/" className="text-pm-gold hover:underline">
                    <ArrowLeftIcon className="w-6 h-6" />
                </Link>
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-8 h-8 text-pm-gold" />
                    <h1 className="text-3xl font-playfair text-pm-gold">Assistant PMM</h1>
                </div>
            </div>

            <div className="flex-grow bg-black border border-pm-gold/20 rounded-t-lg overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-pm-gold flex items-center justify-center text-pm-dark font-bold flex-shrink-0">IA</div>}
                        <div className={`max-w-lg p-3 rounded-lg ${msg.sender === 'user' ? 'bg-pm-gold text-pm-dark' : 'bg-pm-dark'}`}>
                           <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-end gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-pm-gold flex items-center justify-center text-pm-dark font-bold flex-shrink-0">IA</div>
                        <div className="max-w-lg p-3 rounded-lg bg-pm-dark">
                           <div className="flex items-center gap-1">
                               <span className="w-2 h-2 bg-pm-gold rounded-full animate-pulse"></span>
                               <span className="w-2 h-2 bg-pm-gold rounded-full animate-pulse [animation-delay:0.2s]"></span>
                               <span className="w-2 h-2 bg-pm-gold rounded-full animate-pulse [animation-delay:0.4s]"></span>
                           </div>
                        </div>
                    </div>
                )}
                {error && <p className="text-red-400 text-center text-sm">{error}</p>}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="bg-black border-x border-b border-pm-gold/20 rounded-b-lg p-4 flex items-center gap-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Posez votre question ici..."
                    className="flex-grow bg-pm-dark border border-pm-off-white/30 rounded-full p-3 px-5 focus:outline-none focus:border-pm-gold transition-colors"
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="bg-pm-gold text-pm-dark p-3 rounded-full hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed">
                    <PaperAirplaneIcon className="w-6 h-6" />
                </button>
            </form>
        </div>
      </div>
    </>
  );
};

export default Chat;--- START OF FILE components/AIAssistantIcon.tsx ---

import React from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/24/solid';

const AIAssistantIcon: React.FC = () => {
    return (
        <Link 
            to="/chat"
            className="fixed bottom-8 right-8 bg-pm-gold text-pm-dark p-4 rounded-full shadow-lg shadow-pm-gold/30 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pm-gold focus:ring-offset-pm-dark transition-all duration-300 z-30 transform hover:scale-110 animate-pulse-slow"
            aria-label="Ouvrir l'assistant IA"
            title="Assistant IA"
        >
            <SparklesIcon className="h-8 w-8" />
        </Link>
    );
};

export default AIAssistantIcon;--- START OF FILE pages/ClassroomForum.tsx ---


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChatBubbleLeftRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { ForumThread } from '../src/types';

const ClassroomForum: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [isCreating, setIsCreating] = useState(false);
    const [newThread, setNewThread] = useState({ title: '', initialPost: '' });

    const userId = sessionStorage.getItem('userId');
    const user = data?.models.find(m => m.id === userId);
    
    const threads = data?.forumThreads.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || [];

    const handleCreateThread = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newThread.title.trim() || !newThread.initialPost.trim() || !user || !data) return;

        const threadData: ForumThread = {
            id: Date.now().toString(),
            title: newThread.title,
            initialPost: newThread.initialPost,
            authorId: user.id,
            authorName: user.name,
            createdAt: new Date().toISOString()
        };

        const updatedThreads = [...data.forumThreads, threadData];
        try {
            await saveData({ ...data, forumThreads: updatedThreads });
            setNewThread({ title: '', initialPost: '' });
            setIsCreating(false);
        } catch (error) {
            console.error("Erreur lors de la création de la discussion:", error);
            alert("Impossible de créer la discussion.");
        }
    };
    
    if (!isInitialized || !user) {
        return <div className="bg-pm-dark text-pm-off-white min-h-screen flex items-center justify-center"><p>Chargement...</p></div>;
    }

    return (
        <>
            <SEO title="Forum | PMM Classroom" noIndex />
            <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                    <header className="flex justify-between items-center mb-8 flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <ChatBubbleLeftRightIcon className="w-10 h-10 text-pm-gold" />
                            <div>
                                <h1 className="text-4xl font-playfair text-pm-gold">Forum de Discussion</h1>
                                <p className="text-sm text-pm-off-white/70">Échangez, posez des questions et partagez avec la communauté.</p>
                            </div>
                        </div>
                        <button onClick={() => setIsCreating(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-lg shadow-pm-gold/20">
                            <PlusIcon className="w-5 h-5"/> Lancer une Discussion
                        </button>
                    </header>

                    {isCreating && (
                        <div className="bg-black p-6 border border-pm-gold/20 rounded-lg mb-8">
                            <h2 className="text-2xl font-playfair text-pm-gold mb-4">Nouvelle Discussion</h2>
                            <form onSubmit={handleCreateThread} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Titre de la discussion"
                                    value={newThread.title}
                                    onChange={(e) => setNewThread(prev => ({ ...prev, title: e.target.value }))}
                                    className="admin-input"
                                    required
                                />
                                <textarea
                                    placeholder="Votre premier message..."
                                    value={newThread.initialPost}
                                    onChange={(e) => setNewThread(prev => ({ ...prev, initialPost: e.target.value }))}
                                    className="admin-input admin-textarea"
                                    rows={5}
                                    required
                                />
                                <div className="flex justify-end gap-4">
                                    <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-pm-off-white/70 hover:text-white">Annuler</button>
                                    <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white">Publier</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="space-y-4">
                        {threads.map(thread => (
                            <Link to={`/formations/forum/${thread.id}`} key={thread.id} className="block bg-black p-4 border border-pm-gold/10 rounded-lg hover:border-pm-gold hover:bg-pm-dark transition-all duration-300">
                                <h3 className="text-xl font-bold text-pm-gold">{thread.title}</h3>
                                <div className="flex items-center justify-between text-xs text-pm-off-white/60 mt-2">
                                    <p>Par <span className="font-semibold">{thread.authorName}</span></p>
                                    <p>{new Date(thread.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </Link>
                        ))}
                         {threads.length === 0 && !isCreating && (
                            <div className="text-center py-16">
                                <p className="text-pm-off-white/70">Aucune discussion pour le moment.</p>
                                <p className="mt-2 text-pm-off-white/70">Soyez le premier à en lancer une !</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
};

export default ClassroomForum;--- START OF FILE supabaseConfig.ts ---

// This file is no longer in use as Supabase has been removed from the project.
// All functionality now relies exclusively on Firebase.--- START OF FILE pages/ForumThread.tsx ---


import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, PaperAirplaneIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { ForumReply } from '../src/types';
import NotFound from './NotFound';

const ForumThread: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const { threadId } = useParams<{ threadId: string }>();
    const [newReply, setNewReply] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const userId = sessionStorage.getItem('userId');
    const user = data?.models.find(m => m.id === userId);

    const thread = data?.forumThreads.find(t => t.id === threadId);
    const replies = data?.forumReplies.filter(r => r.threadId === threadId).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) || [];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [replies]);

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReply.trim() || !user || !data || !thread) return;

        const replyData: ForumReply = {
            id: Date.now().toString(),
            threadId: thread.id,
            authorId: user.id,
            authorName: user.name,
            createdAt: new Date().toISOString(),
            content: newReply
        };

        const updatedReplies = [...data.forumReplies, replyData];
        try {
            await saveData({ ...data, forumReplies: updatedReplies });
            setNewReply('');
        } catch (error) {
            console.error("Erreur lors de l'envoi de la réponse:", error);
            alert("Impossible d'envoyer la réponse.");
        }
    };
    
    if (!isInitialized) {
        return <div className="bg-pm-dark text-pm-off-white min-h-screen flex items-center justify-center"><p>Chargement...</p></div>;
    }

    if (!thread) {
        return <NotFound />;
    }
    
    const formatTimestamp = (timestamp: string) => {
      const date = new Date(timestamp);
      return date.toLocaleString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            <SEO title={thread.title} noIndex />
             <div className="bg-pm-dark text-pm-off-white h-screen flex flex-col pt-28">
                <div className="container mx-auto px-4 sm:px-6 flex-grow flex flex-col h-full overflow-hidden">
                    <header className="flex items-center gap-4 mb-4 flex-shrink-0">
                        <Link to="/formations/forum" className="text-pm-gold hover:underline p-2">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-playfair text-pm-gold truncate">{thread.title}</h1>
                            <p className="text-xs text-pm-off-white/60">Lancé par {thread.authorName}</p>
                        </div>
                    </header>
                    
                    <main className="flex-grow bg-black border border-pm-gold/20 rounded-t-lg overflow-y-auto p-4 space-y-4">
                        {/* Initial Post */}
                        <div className="bg-pm-dark p-4 border border-pm-gold/20 rounded-lg">
                            <div className="flex justify-between items-center text-sm mb-2">
                                <p className="font-bold text-pm-gold">{thread.authorName}</p>
                                <p className="text-xs text-pm-off-white/50">{formatTimestamp(thread.createdAt)}</p>
                            </div>
                            <p className="whitespace-pre-wrap">{thread.initialPost}</p>
                        </div>

                        {/* Replies */}
                        {replies.map(reply => {
                            const isCurrentUser = reply.authorId === userId;
                            return (
                                <div key={reply.id} className={`flex items-start gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                    {!isCurrentUser && (
                                        <div className="flex-shrink-0 bg-pm-dark rounded-full h-10 w-10 flex items-center justify-center mt-1">
                                            <UserCircleIcon className="h-8 w-8 text-pm-gold/50" />
                                        </div>
                                    )}
                                    <div className={`max-w-md md:max-w-lg p-3 rounded-lg flex flex-col ${isCurrentUser ? 'bg-pm-gold/80 text-pm-dark' : 'bg-pm-dark'}`}>
                                        <div className="flex justify-between items-center gap-4">
                                            {!isCurrentUser && <p className="font-bold text-sm text-pm-gold">{reply.authorName}</p>}
                                            <p className={`text-xs ${isCurrentUser ? 'text-pm-dark/70' : 'text-pm-off-white/50'}`}>{formatTimestamp(reply.createdAt)}</p>
                                        </div>
                                        <p className="whitespace-pre-wrap mt-1">{reply.content}</p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </main>

                    <footer className="flex-shrink-0">
                        <form onSubmit={handleReplySubmit} className="bg-black border-x border-b border-pm-gold/20 rounded-b-lg p-3 flex items-center gap-3">
                            <input
                                type="text"
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                                placeholder="Écrivez votre réponse..."
                                className="flex-grow bg-pm-dark border border-pm-off-white/30 rounded-full p-3 px-5 focus:outline-none focus:border-pm-gold transition-colors"
                            />
                            <button type="submit" disabled={!newReply.trim()} className="bg-pm-gold text-pm-dark p-3 rounded-full hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed">
                                <PaperAirplaneIcon className="w-6 h-6" />
                            </button>
                        </form>
                    </footer>
                </div>
             </div>
        </>
    );
};

export default ForumThread;--- START OF FILE pages/PrivacyPolicy.tsx ---

import React from 'react';
import SEO from '../components/SEO';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Politique de Confidentialité" noIndex />
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl font-playfair text-pm-gold mb-8">Politique de Confidentialité</h1>
                <div className="prose prose-invert prose-lg max-w-none prose-h2:font-playfair prose-h2:text-pm-gold">
                    <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    
                    <h2>1. Introduction</h2>
                    <p>Perfect Models Management ("nous", "notre") s'engage à protéger la vie privée des visiteurs de notre site web et des utilisateurs de nos services. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations.</p>
                    
                    <h2>2. Informations que nous collectons</h2>
                    <p>Nous pouvons collecter des informations personnelles vous concernant lorsque vous :</p>
                    <ul>
                        <li>Remplissez un formulaire de contact ou de candidature sur notre site.</li>
                        <li>Communiquez avec nous par e-mail, téléphone ou via les réseaux sociaux.</li>
                        <li>Naviguez sur notre site web (via les cookies).</li>
                    </ul>
                    <p>Les informations collectées peuvent inclure votre nom, vos coordonnées (email, téléphone), vos mensurations, vos photos et toute autre information que vous choisissez de nous fournir.</p>

                    <h2>3. Utilisation de vos informations</h2>
                    <p>Nous utilisons vos informations pour :</p>
                    <ul>
                        <li>Évaluer votre candidature pour devenir mannequin.</li>
                        <li>Répondre à vos demandes de renseignements.</li>
                        <li>Vous fournir des informations sur nos services et événements.</li>
                        <li>Améliorer notre site web et nos services.</li>
                    </ul>
                    
                    <h2>4. Partage de vos informations</h2>
                    <p>Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers. Vos informations peuvent être partagées avec des clients potentiels (marques, photographes, etc.) dans le cadre de castings ou de propositions de travail, mais uniquement avec votre consentement préalable.</p>
                    
                    <h2>5. Sécurité des données</h2>
                    <p>Nous mettons en œuvre des mesures de sécurité raisonnables pour protéger vos informations contre l'accès, l'utilisation ou la divulgation non autorisés. Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est 100% sécurisée.</p>

                    <h2>6. Vos droits</h2>
                    <p>Vous avez le droit d'accéder, de corriger ou de supprimer vos informations personnelles que nous détenons. Pour exercer ces droits, veuillez nous contacter à l'adresse indiquée sur notre page de contact.</p>

                    <h2>7. Modifications de cette politique</h2>
                    <p>Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous notifierons de tout changement en publiant la nouvelle politique sur cette page.</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;--- START OF FILE pages/TermsOfUse.tsx ---

import React from 'react';
import SEO from '../components/SEO';

const TermsOfUse: React.FC = () => {
    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Conditions d'Utilisation" noIndex />
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl font-playfair text-pm-gold mb-8">Conditions d'Utilisation</h1>
                <div className="prose prose-invert prose-lg max-w-none prose-h2:font-playfair prose-h2:text-pm-gold">
                    <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                    <h2>1. Acceptation des conditions</h2>
                    <p>En accédant et en utilisant le site web de Perfect Models Management (le "Site"), vous acceptez d'être lié par les présentes Conditions d'Utilisation. Si vous n'êtes pas d'accord avec une partie de ces conditions, vous ne devez pas utiliser notre Site.</p>
                    
                    <h2>2. Utilisation du Site</h2>
                    <p>Vous vous engagez à utiliser le Site uniquement à des fins légales et d'une manière qui ne porte pas atteinte aux droits d'autrui, ni ne restreint ou n'empêche l'utilisation et la jouissance du Site par quiconque.</p>
                    <p>Le contenu de ce Site, y compris les images, textes, logos et designs, est la propriété de Perfect Models Management ou de ses concédants de licence et est protégé par les lois sur le droit d'auteur et la propriété intellectuelle. Toute reproduction ou utilisation non autorisée est strictement interdite.</p>
                    
                    <h2>3. Contenu Utilisateur</h2>
                    <p>En soumettant des informations, des photos ou tout autre contenu via nos formulaires de candidature ou de contact, vous nous accordez une licence non exclusive, mondiale et libre de droits pour utiliser ce contenu dans le but d'évaluer votre candidature et de promouvoir vos services auprès de clients potentiels si vous êtes accepté(e) dans notre agence.</p>
                    
                    <h2>4. Limitation de responsabilité</h2>
                    <p>Le Site et son contenu sont fournis "en l'état". Nous ne garantissons pas que le Site sera exempt d'erreurs ou ininterrompu. Dans toute la mesure permise par la loi, Perfect Models Management décline toute responsabilité pour tout dommage direct ou indirect résultant de l'utilisation de ce Site.</p>
                    
                    <h2>5. Liens vers des sites tiers</h2>
                    <p>Notre Site peut contenir des liens vers des sites web tiers. Ces liens sont fournis pour votre commodité uniquement. Nous n'avons aucun contrôle sur le contenu de ces sites et n'assumons aucune responsabilité à leur égard.</p>

                    <h2>6. Modifications des conditions</h2>
                    <p>Nous nous réservons le droit de modifier ces Conditions d'Utilisation à tout moment. Votre utilisation continue du Site après de telles modifications constitue votre acceptation des nouvelles conditions.</p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfUse;--- START OF FILE components/ServiceCard.tsx ---

import React from 'react';
import { Link } from 'react-router-dom';
import { Service } from '../types';
import { 
    AcademicCapIcon, CameraIcon, UserGroupIcon, SparklesIcon, ClipboardDocumentCheckIcon, 
    MegaphoneIcon, IdentificationIcon, ScissorsIcon, PaintBrushIcon, CalendarDaysIcon, 
    PresentationChartLineIcon, ChatBubbleLeftRightIcon, VideoCameraIcon, PhotoIcon, StarIcon, HeartIcon
} from '@heroicons/react/24/outline';

const iconMap: { [key: string]: React.ElementType } = {
  AcademicCapIcon, CameraIcon, UserGroupIcon, SparklesIcon, ClipboardDocumentCheckIcon, 
  MegaphoneIcon, IdentificationIcon, ScissorsIcon, PaintBrushIcon, CalendarDaysIcon, 
  PresentationChartLineIcon, ChatBubbleLeftRightIcon, VideoCameraIcon, PhotoIcon, StarIcon
};

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
    const Icon = iconMap[service.icon] || HeartIcon;
    return (
        <div className="relative card-base p-8 flex flex-col h-full text-left">
            {service.isComingSoon && (
                <span className="absolute top-4 right-4 bg-pm-dark text-pm-gold text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-pm-gold/50">
                    Bientôt disponible
                </span>
            )}
            <div className="flex-shrink-0 mb-4">
                <Icon className="w-12 h-12 text-pm-gold" />
            </div>
            <div className="flex-grow">
                <h3 className="text-2xl font-playfair text-pm-gold mb-3">{service.title}</h3>
                <p className="text-pm-off-white/80 mb-6">{service.description}</p>
            </div>
            <div className="mt-auto pt-6">
                <Link 
                    to={service.buttonLink}
                    className={`inline-block px-8 py-3 font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 shadow-md ${
                        service.isComingSoon 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600' 
                        : 'bg-pm-gold text-pm-dark hover:bg-white hover:scale-105 shadow-pm-gold/20'
                    }`}
                >
                    {service.buttonText}
                </Link>
            </div>
        </div>
    );
};

export default ServiceCard;--- START OF FILE pages/Services.tsx ---

import React from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import ServiceCard from '../components/ServiceCard';

const Services: React.FC = () => {
    const { data } = useData();
    const services = data?.agencyServices || [];

    return (
        <div className="bg-pm-dark text-pm-off-white">
            <SEO
                title="Nos Services | Accompagnement & Production"
                description="Découvrez l'ensemble des services proposés par Perfect Models Management : gestion de carrière, formation, production de shootings, direction de casting et organisation d'événements mode."
                keywords="services agence mannequin, formation mannequin, production photo mode, casting mannequin, événementiel mode gabon"
                image={data?.siteImages.about}
            />
            <div className="page-container">
                <h1 className="page-title">Nos Services sur Mesure</h1>
                <p className="page-subtitle">
                    De la révélation de talents à la production d'événements d'envergure, notre expertise couvre tous les aspects de l'écosystème de la mode.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {services.map((service, index) => (
                        <ServiceCard key={index} service={service} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;--- START OF FILE pages/AdminRecovery.tsx ---

import React from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, CheckCircleIcon, XCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { RecoveryRequest } from '../types';

const AdminRecovery: React.FC = () => {
  const { data, saveData } = useData();

  const requests = data?.recoveryRequests?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) || [];
  const models = data?.models || [];

  const handleUpdateStatus = async (requestId: string, status: 'Nouveau' | 'Traité') => {
    if (!data) return;
    const updatedRequests = requests.map(req => req.id === requestId ? { ...req, status } : req);
    await saveData({ ...data, recoveryRequests: updatedRequests });
  };

  const handleDelete = async (requestId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) {
      if (!data) return;
      const updatedRequests = requests.filter(req => req.id !== requestId);
      await saveData({ ...data, recoveryRequests: updatedRequests });
    }
  };
  
  const getStatusColor = (status: 'Nouveau' | 'Traité') => {
    return status === 'Nouveau' ? 'bg-blue-500/20 text-blue-300 border-blue-500' : 'bg-green-500/20 text-green-300 border-green-500';
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Demandes de Récupération" noIndex />
      <div className="container mx-auto px-6">
        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
          <ChevronLeftIcon className="w-5 h-5" />
          Retour au Dashboard
        </Link>
        <h1 className="text-4xl font-playfair text-pm-gold">Demandes de Récupération</h1>
        <p className="text-pm-off-white/70 mt-2 mb-8">
          Gérez les demandes de coordonnées oubliées soumises par les mannequins.
        </p>

        <div className="bg-black border border-pm-gold/20 rounded-lg shadow-lg shadow-black/30">
            {requests.map(req => {
                const modelExists = models.some(m => m.name.toLowerCase() === req.modelName.toLowerCase());
                return (
                    <div key={req.id} className="p-4 border-b border-pm-dark flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-pm-dark/50">
                        <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${getStatusColor(req.status)}`}>{req.status}</span>
                                <h2 className="font-bold text-lg text-pm-off-white">{req.modelName}</h2>
                            </div>
                            <p className="text-sm text-pm-off-white/70">Téléphone: <span className="font-mono">{req.phone}</span></p>
                            <p className="text-xs text-pm-off-white/50 mt-1">
                                Demandé le: {new Date(req.timestamp).toLocaleString('fr-FR')}
                            </p>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="flex-grow md:flex-grow-0">
                                {modelExists ? (
                                    <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircleIcon className="w-4 h-4" /> Mannequin trouvé</span>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs text-red-400"><XCircleIcon className="w-4 h-4" /> Mannequin inconnu</span>
                                )}
                            </div>
                            {req.status === 'Nouveau' && (
                                <button onClick={() => handleUpdateStatus(req.id, 'Traité')} className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-green-500 text-green-300 rounded-full hover:bg-green-500/20">
                                    Marquer comme Traité
                                </button>
                            )}
                            <button onClick={() => handleDelete(req.id)} className="text-red-500/70 hover:text-red-500 p-1"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    </div>
                )
            })}
             {requests.length === 0 && (
                <div className="text-center p-16">
                    <QuestionMarkCircleIcon className="w-16 h-16 mx-auto text-pm-off-white/30 mb-4"/>
                    <p className="text-pm-off-white/70">Aucune demande de récupération pour le moment.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminRecovery;--- START OF FILE sw.js ---

const CACHE_NAME = 'pmm-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  'https://i.ibb.co/fVBxPNTP/T-shirt.png',
  'https://i.ibb.co/K2wS0Pz/hero-bg.jpg',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Montserrat:wght@300;400;500&display=swap',
];

// Install event: cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching core assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event: serve from cache, fall back to network, and cache new requests
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Network-first for APIs to ensure data freshness
  if (event.request.url.includes('firebaseio.com')) {
     event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
     );
     return;
  }

  // Cache-first for all other requests
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
        
        return response || fetchPromise;
      });
    })
  );
});--- START OF FILE pages/JuryCasting.tsx ---

import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { CastingApplication, JuryScore } from '../types';
import SEO from '../components/SEO';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import ScoreInput from '../components/ScoreInput';

const JuryCasting: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [selectedApp, setSelectedApp] = useState<CastingApplication | null>(null);
    const [currentScores, setCurrentScores] = useState<Omit<JuryScore, 'overall'>>({
        physique: 5,
        presence: 5,
        photogenie: 5,
        potentiel: 5,
        notes: '',
    });

    const juryId = sessionStorage.getItem('userId');
    const juryName = sessionStorage.getItem('userName');
    
    const applications = useMemo(() => {
        return data?.castingApplications
            .filter(app => app.status === 'Présélectionné' && app.passageNumber)
            .sort((a, b) => (a.passageNumber || 0) - (b.passageNumber || 0)) || [];
    }, [data?.castingApplications]);

    const candidatesToGrade = useMemo(() => {
        return applications.filter(app => !(app.scores && app.scores[juryId!]));
    }, [applications, juryId]);

    const gradedCandidates = useMemo(() => {
        return applications.filter(app => app.scores && app.scores[juryId!]);
    }, [applications, juryId]);

    const openScoringModal = (app: CastingApplication) => {
        setSelectedApp(app);
        const existingScores = app.scores && juryId ? app.scores[juryId] : null;
        if (existingScores) {
            setCurrentScores({
                physique: existingScores.physique,
                presence: existingScores.presence,
                photogenie: existingScores.photogenie,
                potentiel: existingScores.potentiel,
                notes: existingScores.notes || '',
            });
        } else {
            setCurrentScores({
                physique: 5,
                presence: 5,
                photogenie: 5,
                potentiel: 5,
                notes: '',
            });
        }
    };

    const handleScoreChange = (field: keyof Omit<JuryScore, 'overall' | 'notes'>, value: number) => {
        setCurrentScores(prev => ({ ...prev, [field]: value }));
    };
    
    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentScores(prev => ({ ...prev, notes: e.target.value }));
    };

    const handleSubmitScore = async () => {
        if (!selectedApp || !juryId || !data) return;

        const overall = (currentScores.physique + currentScores.presence + currentScores.photogenie + currentScores.potentiel) / 4;
        const newScore: JuryScore = { ...currentScores, overall };

        const updatedApps = data.castingApplications.map(app => {
            if (app.id === selectedApp.id) {
                return {
                    ...app,
                    scores: {
                        ...(app.scores || {}),
                        [juryId]: newScore,
                    }
                };
            }
            return app;
        });

        try {
            await saveData({ ...data, castingApplications: updatedApps });
            alert('Note enregistrée avec succès !');
            setSelectedApp(null);
        } catch (error) {
            console.error(error);
            alert('Erreur lors de l\'enregistrement de la note.');
        }
    };
    
    const calculateAge = (birthDate: string): string => {
        if (!birthDate) return 'N/A';
        const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
        return `${age} ans`;
    };

    if (!isInitialized) {
        return <div className="min-h-screen flex items-center justify-center bg-pm-dark text-pm-gold">Chargement...</div>;
    }

    if (!juryId || !juryName) {
        return <div className="min-h-screen flex items-center justify-center bg-pm-dark text-pm-gold">Erreur: membre du jury non identifié. Veuillez vous reconnecter.</div>;
    }

    return (
        <>
            <SEO title={`Jury Casting - ${juryName}`} noIndex />
            <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl font-playfair text-pm-gold">Panel de Notation du Jury</h1>
                    <p className="text-pm-off-white/80 mb-8">Bonjour, {juryName}. Veuillez évaluer les candidats présélectionnés.</p>

                    <section className="mb-16">
                        <h2 className="text-3xl font-playfair text-pm-gold border-b-2 border-pm-gold/20 pb-2 mb-6">
                            Candidats à Noter ({candidatesToGrade.length})
                        </h2>
                        {candidatesToGrade.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {candidatesToGrade.map(app => (
                                    <button 
                                        key={app.id} 
                                        onClick={() => openScoringModal(app)}
                                        className="group block bg-black border border-pm-gold/30 p-4 text-left overflow-hidden transition-all duration-300 hover:border-pm-gold hover:shadow-lg hover:shadow-pm-gold/10 hover:-translate-y-1"
                                    >
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-2xl font-bold text-pm-off-white group-hover:text-pm-gold transition-colors duration-300">{app.firstName} {app.lastName}</h3>
                                            <p className="text-3xl font-playfair font-bold text-pm-gold">#{String(app.passageNumber).padStart(3, '0')}</p>
                                        </div>
                                        <div className="mt-4 border-t border-pm-gold/20 pt-3 space-y-2 text-sm text-pm-off-white/80">
                                            <p><strong>Âge:</strong> {calculateAge(app.birthDate)}</p>
                                            <p><strong>Taille:</strong> {app.height} cm</p>
                                            <p><strong>Genre:</strong> {app.gender}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-10 bg-black border border-pm-gold/10 rounded-lg">
                                <CheckCircleIcon className="w-12 h-12 mx-auto text-green-500 mb-2" />
                                <p className="text-pm-off-white/80">Tous les candidats ont été notés. Excellent travail !</p>
                            </div>
                        )}
                    </section>
                    
                    <section>
                        <h2 className="text-3xl font-playfair text-pm-gold border-b-2 border-pm-gold/20 pb-2 mb-6">
                            Candidats Notés ({gradedCandidates.length})
                        </h2>
                        {gradedCandidates.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {gradedCandidates.map(app => {
                                    const myScore = app.scores![juryId!].overall;
                                    return (
                                        <button 
                                            key={app.id} 
                                            onClick={() => openScoringModal(app)}
                                            className="group block bg-pm-dark border border-pm-gold/50 p-4 text-left overflow-hidden transition-all duration-300 opacity-70 hover:opacity-100"
                                        >
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-2xl font-bold text-pm-off-white">{app.firstName} {app.lastName}</h3>
                                                <p className="text-3xl font-playfair font-bold text-pm-gold">#{String(app.passageNumber).padStart(3, '0')}</p>
                                            </div>
                                            <div className="mt-4 border-t border-pm-gold/20 pt-3 space-y-2 text-sm text-pm-off-white/80">
                                                <p><strong>Âge:</strong> {calculateAge(app.birthDate)}</p>
                                                <p><strong>Taille:</strong> {app.height} cm</p>
                                                <p><strong>Genre:</strong> {app.gender}</p>
                                            </div>
                                            <div className="mt-4 bg-pm-gold/10 p-2 rounded-md text-center">
                                                <p className="text-xs text-pm-gold uppercase tracking-wider">Votre Note</p>
                                                <p className="text-2xl font-bold text-pm-gold">{myScore.toFixed(1)}/10</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                             <div className="text-center py-10 bg-black border border-pm-gold/10 rounded-lg">
                                <p className="text-pm-off-white/70">Aucun candidat noté pour le moment.</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {selectedApp && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
                    <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl shadow-pm-gold/10 w-full max-w-lg max-h-[90vh] flex flex-col">
                        <header className="p-4 flex justify-between items-center border-b border-pm-gold/20">
                             <h2 className="text-2xl font-playfair text-pm-gold">Noter {selectedApp.firstName} {selectedApp.lastName}</h2>
                             <button onClick={() => setSelectedApp(null)} className="text-pm-off-white/70 hover:text-white"><XMarkIcon className="w-6 h-6"/></button>
                        </header>
                         <main className="p-6 overflow-y-auto flex-grow">
                             <form onSubmit={(e) => { e.preventDefault(); handleSubmitScore(); }} className="space-y-4">
                                <ScoreInput label="Physique & Harmonie" value={currentScores.physique} onChange={val => handleScoreChange('physique', val)} />
                                <ScoreInput label="Présence & Charisme" value={currentScores.presence} onChange={val => handleScoreChange('presence', val)} />
                                <ScoreInput label="Photogénie" value={currentScores.photogenie} onChange={val => handleScoreChange('photogenie', val)} />
                                <ScoreInput label="Potentiel de développement" value={currentScores.potentiel} onChange={val => handleScoreChange('potentiel', val)} />
                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-pm-off-white/70 mb-1">Notes / Remarques</label>
                                    <textarea
                                        id="notes"
                                        value={currentScores.notes}
                                        onChange={handleNotesChange}
                                        rows={3}
                                        className="admin-input admin-textarea"
                                        placeholder="Commentaires optionnels..."
                                    />
                                </div>
                                <div className="pt-4 flex justify-end gap-4">
                                    <button type="button" onClick={() => setSelectedApp(null)} className="px-6 py-2 bg-pm-dark border border-pm-off-white/50 text-pm-off-white/80 font-bold uppercase tracking-widest text-xs rounded-full hover:border-white">
                                        Annuler
                                    </button>
                                     <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white shadow-md shadow-pm-gold/30">
                                        Enregistrer la Note
                                    </button>
                                </div>
                             </form>
                         </main>
                    </div>
                </div>
            )}
        </>
    );
};

export default JuryCasting;--- START OF FILE components/ScoreInput.tsx ---

import React, { useMemo } from 'react';

interface ScoreInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
}

const SCORES = Array.from({ length: 21 }, (_, i) => i * 0.5); // [0, 0.5, 1, ..., 10]

const ScoreInput: React.FC<ScoreInputProps> = ({ label, value, onChange }) => {
    
    const description = useMemo(() => {
        if (value >= 9) return 'Excellent';
        if (value >= 7.5) return 'Très Bon';
        if (value >= 6) return 'Bon';
        if (value >= 5) return 'Moyen';
        if (value >= 3) return 'Faible';
        return 'Insuffisant';
    }, [value]);
    
    const descriptionColor = useMemo(() => {
        if (value >= 9) return 'text-green-400';
        if (value >= 7.5) return 'text-yellow-400';
        if (value >= 6) return 'text-orange-400';
        return 'text-red-400';
    }, [value]);

    return (
        <div className="bg-pm-dark/50 p-4 rounded-lg border border-pm-off-white/10">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <label className="font-semibold text-pm-off-white/90 text-lg">{label}</label>
                    <p className={`text-sm font-medium ${descriptionColor}`}>{description}</p>
                </div>
                <p className="text-3xl font-bold text-pm-gold tabular-nums">{value.toFixed(1)}</p>
            </div>

            <div className="flex flex-wrap gap-1.5 justify-center">
                {SCORES.map(score => {
                    const isSelected = value === score;
                    const isHalfPoint = score % 1 !== 0;

                    return (
                        <button
                            key={score}
                            type="button"
                            onClick={() => onChange(score)}
                            className={`w-9 h-9 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-xs font-mono transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pm-gold focus:ring-offset-2 focus:ring-offset-pm-dark ${
                                isSelected 
                                    ? 'bg-pm-gold text-pm-dark font-bold shadow-lg shadow-pm-gold/30' 
                                    : isHalfPoint 
                                        ? 'bg-black text-pm-off-white/50 border border-pm-off-white/20' 
                                        : 'bg-pm-dark text-pm-off-white border border-pm-off-white/30'
                            }`}
                            aria-label={`Note ${score}`}
                            aria-pressed={isSelected}
                        >
                            {isHalfPoint ? '' : score}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ScoreInput;--- START OF FILE pages/RegistrationCasting.tsx ---

import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { CastingApplication } from '../types';
import SEO from '../components/SEO';
import { UserPlusIcon, PrinterIcon } from '@heroicons/react/24/outline';

const RegistrationCasting: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const initialFormState = {
        firstName: '', lastName: '', birthDate: '', email: '', phone: '', nationality: '', city: '',
        gender: 'Femme' as 'Homme' | 'Femme', height: '', weight: '', chest: '', waist: '', hips: '', shoeSize: '',
        eyeColor: '', hairColor: '', experience: 'none', instagram: '', portfolioLink: ''
    };
    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const staffName = sessionStorage.getItem('userName');

    const registeredApplicants = useMemo(() => {
        return data?.castingApplications
            .filter(app => app.passageNumber)
            .sort((a, b) => a.passageNumber! - b.passageNumber!) || [];
    }, [data?.castingApplications]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data || !formData.firstName.trim() || !formData.lastName.trim()) return;

        setIsSubmitting(true);

        const existingPassageNumbers = data.castingApplications
            .map(app => app.passageNumber)
            .filter((num): num is number => num !== undefined && num !== null);
        
        const nextPassageNumber = existingPassageNumbers.length > 0 ? Math.max(...existingPassageNumbers) + 1 : 1;

        const newApplicant: CastingApplication = {
            ...formData,
            id: `reg-${Date.now()}`,
            submissionDate: new Date().toISOString(),
            status: 'Présélectionné', // Automatically prescreened as they are on-site
            passageNumber: nextPassageNumber,
        };

        const updatedApplications = [...(data.castingApplications || []), newApplicant];

        try {
            await saveData({ ...data, castingApplications: updatedApplications });
            setFormData(initialFormState); // Reset form
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'enregistrement.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (!isInitialized) {
        return <div className="min-h-screen flex items-center justify-center bg-pm-dark text-pm-gold">Chargement...</div>;
    }

    return (
        <>
            <SEO title={`Enregistrement Casting - ${staffName}`} noIndex />
            <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
                <div className="container mx-auto px-6">
                    <div className="admin-page-header">
                        <div>
                            <h1 className="admin-page-title">Enregistrement Casting</h1>
                            <p className="admin-page-subtitle">Connecté en tant que {staffName}.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Registration Form */}
                        <div className="lg:col-span-1">
                            <form onSubmit={handleRegister} className="admin-section-wrapper">
                                <h2 className="admin-section-title flex items-center gap-2">
                                    <UserPlusIcon className="w-6 h-6" />
                                    Ajouter un Postulant
                                </h2>
                                
                                <Section title="Informations Personnelles">
                                    <FormInput label="Prénom" name="firstName" value={formData.firstName} onChange={handleChange} required />
                                    <FormInput label="Nom" name="lastName" value={formData.lastName} onChange={handleChange} required />
                                    <FormInput label="Date de Naissance" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} />
                                    <FormSelect label="Genre" name="gender" value={formData.gender} onChange={handleChange}>
                                        <option value="Femme">Femme</option>
                                        <option value="Homme">Homme</option>
                                    </FormSelect>
                                    <FormInput label="Téléphone" name="phone" value={formData.phone} onChange={handleChange} />
                                    <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                                </Section>

                                <Section title="Mensurations">
                                    <FormInput label="Taille (cm)" name="height" type="number" value={formData.height} onChange={handleChange} />
                                    <FormInput label="Poids (kg)" name="weight" type="number" value={formData.weight} onChange={handleChange} />
                                    <FormInput label="Pointure (EU)" name="shoeSize" type="number" value={formData.shoeSize} onChange={handleChange} />
                                    <FormInput label="Poitrine (cm)" name="chest" type="number" value={formData.chest} onChange={handleChange} />
                                    <FormInput label="Taille (vêtement, cm)" name="waist" type="number" value={formData.waist} onChange={handleChange} />
                                    <FormInput label="Hanches (cm)" name="hips" type="number" value={formData.hips} onChange={handleChange} />
                                </Section>

                                <Section title="Expérience">
                                    <FormSelect label="Niveau d'expérience" name="experience" value={formData.experience} onChange={handleChange}>
                                        <option value="none">Aucune expérience</option>
                                        <option value="beginner">Débutant(e)</option>
                                        <option value="intermediate">Intermédiaire</option>
                                        <option value="professional">Professionnel(le)</option>
                                    </FormSelect>
                                </Section>

                                <button type="submit" disabled={isSubmitting} className="w-full px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all hover:bg-white disabled:opacity-50 mt-6">
                                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer et Attribuer Numéro'}
                                </button>
                            </form>
                        </div>

                        {/* Registered List */}
                        <div className="lg:col-span-2">
                             <div className="flex justify-between items-center mb-6">
                                <h2 className="admin-page-title !text-3xl">Liste des Passages</h2>
                                <button onClick={handlePrint} className="print-hide inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full hover:bg-pm-gold hover:text-pm-dark">
                                    <PrinterIcon className="w-5 h-5"/> Imprimer la Liste
                                </button>
                            </div>
                            <div className="admin-section-wrapper printable-content">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-pm-dark/50">
                                            <tr className="border-b border-pm-gold/20">
                                                <th className="p-3 uppercase text-xs tracking-wider">Passage #</th>
                                                <th className="p-3 uppercase text-xs tracking-wider">Nom Complet</th>
                                                <th className="p-3 uppercase text-xs tracking-wider hidden sm:table-cell">Téléphone</th>
                                                <th className="p-3 uppercase text-xs tracking-wider hidden sm:table-cell">Heure</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {registeredApplicants.map(app => (
                                                <tr key={app.id} className="border-b border-pm-dark hover:bg-pm-dark/50">
                                                    <td className="p-3 font-bold text-pm-gold">#{String(app.passageNumber).padStart(3, '0')}</td>
                                                    <td className="p-3 font-semibold">{app.firstName} {app.lastName}</td>
                                                    <td className="p-3 text-sm hidden sm:table-cell">{app.phone || 'N/A'}</td>
                                                    <td className="p-3 text-xs hidden sm:table-cell">{new Date(app.submissionDate).toLocaleTimeString('fr-FR')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {registeredApplicants.length === 0 && (
                                        <p className="text-center p-8 text-pm-off-white/60">Aucun postulant enregistré pour le moment.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Reusable components
const Section: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div className="pt-6 border-t border-pm-gold/20 first:pt-0 first:border-none">
        <h2 className="text-2xl font-playfair text-pm-gold mb-4">{title}</h2>
        <div className="space-y-4">{children}</div>
    </div>
);
const FormInput: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, required?: boolean}> = (props) => (
    <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <input {...props} id={props.name} className="admin-input" />
    </div>
);
const FormSelect: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode}> = (props) => (
    <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <select {...props} id={props.name} className="admin-input">{props.children}</select>
    </div>
);


export default RegistrationCasting;--- START OF FILE pages/AdminCastingLive.tsx ------ START OF FILE pages/AdminComments.tsx ---

import React from 'react';
import { useData } from '../contexts/DataContext';
import { ArticleComment } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

const AdminComments: React.FC = () => {
    const { data, saveData } = useData();
    const comments = data?.articleComments.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || [];
    const articles = data?.articles || [];

    const handleDelete = async (commentId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.")) {
            if (!data) return;
            const updatedComments = data.articleComments.filter(c => c.id !== commentId);
            await saveData({ ...data, articleComments: updatedComments });
            alert("Commentaire supprimé.");
        }
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Modérer les Commentaires" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Tableau de Bord
                </Link>
                <h1 className="text-4xl font-playfair text-pm-gold">Modérer les Commentaires</h1>
                <p className="text-pm-off-white/70 mt-2 mb-8">
                    Gérez les commentaires laissés sur les articles du magazine.
                </p>

                <div className="bg-black border border-pm-gold/20 rounded-lg shadow-lg shadow-black/30">
                    {comments.map(comment => {
                        const article = articles.find(a => a.slug === comment.articleSlug);
                        return (
                            <div key={comment.id} className="p-4 border-b border-pm-dark flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-pm-dark/50">
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <h2 className="font-bold text-lg text-pm-off-white">{comment.authorName}</h2>
                                        <span className="text-xs text-pm-off-white/50">a commenté sur</span>
                                        {article ? (
                                            <Link to={`/magazine/${article.slug}`} className="text-xs text-pm-gold underline truncate" target="_blank" rel="noopener noreferrer">
                                                {article.title}
                                            </Link>
                                        ) : (
                                            <span className="text-xs text-pm-off-white/50">Article inconnu</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-pm-off-white/80 italic">"{comment.content}"</p>
                                    <p className="text-xs text-pm-off-white/50 mt-1">
                                        Le: {new Date(comment.createdAt).toLocaleString('fr-FR')}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <button onClick={() => handleDelete(comment.id)} className="text-red-500/70 hover:text-red-500 p-1">
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {comments.length === 0 && (
                        <div className="text-center p-16">
                            <ChatBubbleBottomCenterTextIcon className="w-16 h-16 mx-auto text-pm-off-white/30 mb-4"/>
                            <p className="text-pm-off-white/70">Aucun commentaire à modérer pour le moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminComments;--- START OF FILE components/PrintableCastingSheet.tsx ---


import React, { useEffect } from 'react';
import { CastingApplication, JuryMember, JuryScore } from '../../src/types';
import { useData } from '../../contexts/DataContext';

interface PrintableCastingSheetProps {
    app: CastingApplication;
    juryMembers: JuryMember[];
    onDonePrinting: () => void;
}

const PrintableCastingSheet: React.FC<PrintableCastingSheetProps> = ({ app, juryMembers, onDonePrinting }) => {
    const { data } = useData();

    useEffect(() => {
        const handleAfterPrint = () => {
            onDonePrinting();
            window.removeEventListener('afterprint', handleAfterPrint);
        };
        window.addEventListener('afterprint', handleAfterPrint);
        
        const timer = setTimeout(() => {
            window.print();
        }, 500);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('afterprint', handleAfterPrint);
        };
    }, [onDonePrinting]);
    
    const calculateAge = (birthDate: string): string => {
        if (!birthDate) return 'N/A';
        const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
        return `${age} ans`;
    };
    
    const juryScores: [string, JuryScore][] = app.scores ? Object.entries(app.scores) : [];
    const overallScores = juryScores.map(([, score]) => score.overall);
    const averageScore = overallScores.length > 0 ? (overallScores.reduce((a, b) => a + b, 0) / overallScores.length) : 0;
    const decision = averageScore >= 5 ? 'Présélectionné' : 'Recalé';

    return (
        <div className="printable-content printable-sheet p-8 bg-white text-black font-montserrat">
            <header className="flex justify-between items-center border-b-2 border-black pb-4">
                <div>
                    <h1 className="text-4xl font-bold font-playfair">Fiche Candidat</h1>
                    <p className="text-lg">Casting Perfect Models Management</p>
                </div>
                {data?.siteConfig?.logo && <img src={data.siteConfig.logo} alt="Logo" className="h-20 w-auto" />}
            </header>

            <section className="mt-6 grid grid-cols-3 gap-6">
                <div className="col-span-2">
                    <h2 className="text-5xl font-playfair font-bold text-pm-gold">{app.firstName} {app.lastName}</h2>
                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-lg">
                        <div><strong>Âge:</strong> {calculateAge(app.birthDate)}</div>
                        <div><strong>Genre:</strong> {app.gender}</div>
                        <div><strong>Taille:</strong> {app.height} cm</div>
                        <div><strong>Poids:</strong> {app.weight} kg</div>
                        <div><strong>Téléphone:</strong> {app.phone}</div>
                        <div><strong>Email:</strong> {app.email}</div>
                    </div>
                </div>
                <div className="col-span-1 text-center bg-black p-4 flex flex-col justify-center items-center">
                    <p className="text-sm uppercase tracking-widest">Numéro de Passage</p>
                    <p className="text-8xl font-playfair font-bold">#{String(app.passageNumber).padStart(3, '0')}</p>
                </div>
            </section>
            
            <section className="mt-6">
                 <h3 className="text-2xl font-playfair border-b border-black pb-1 mb-2">Mensurations</h3>
                 <div className="flex space-x-8 text-md">
                    <span><strong>Poitrine:</strong> {app.chest || 'N/A'} cm</span>
                    <span><strong>Taille:</strong> {app.waist || 'N/A'} cm</span>
                    <span><strong>Hanches:</strong> {app.hips || 'N/A'} cm</span>
                    <span><strong>Pointure:</strong> {app.shoeSize || 'N/A'} EU</span>
                 </div>
            </section>

            <section className="mt-6">
                <h3 className="text-2xl font-playfair border-b border-black pb-1 mb-2">Évaluation du Jury</h3>
                {juryScores.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black border-b-2 border-black">
                                <th className="p-2 font-bold">Jury</th>
                                <th className="p-2 font-bold text-center">Physique</th>
                                <th className="p-2 font-bold text-center">Présence</th>
                                <th className="p-2 font-bold text-center">Photogénie</th>
                                <th className="p-2 font-bold text-center">Potentiel</th>
                                <th className="p-2 font-bold text-center text-pm-gold">Note Globale</th>
                            </tr>
                        </thead>
                        <tbody>
                            {juryScores.map(([juryId, score]) => {
                                const jury = juryMembers.find(j => j.id === juryId);
                                return (
                                    <tr key={juryId} className="border-b">
                                        <td className="p-2 font-semibold">{jury?.name || juryId}</td>
                                        <td className="p-2 text-center">{score.physique.toFixed(1)}</td>
                                        <td className="p-2 text-center">{score.presence.toFixed(1)}</td>
                                        <td className="p-2 text-center">{score.photogenie.toFixed(1)}</td>
                                        <td className="p-2 text-center">{score.potentiel.toFixed(1)}</td>
                                        <td className="p-2 text-center font-bold text-pm-gold">{score.overall.toFixed(1)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <p>Aucune note enregistrée.</p>
                )}
            </section>
            
            {juryScores.some(([, score]) => score.notes) && (
                <section className="mt-6">
                     <h3 className="text-2xl font-playfair border-b border-black pb-1 mb-2">Remarques des Jurys</h3>
                     <div className="space-y-2">
                        {juryScores.filter(([, score]) => score.notes).map(([juryId, score]) => {
                             const jury = juryMembers.find(j => j.id === juryId);
                             return (
                                <div key={juryId}>
                                    <strong>{jury?.name || juryId}:</strong>
                                    <span className="italic"> "{score.notes}"</span>
                                </div>
                             )
                        })}
                     </div>
                </section>
            )}

            <section className="mt-8 pt-4 border-t-2 border-black flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-playfair">Moyenne Générale</h3>
                    <p className="text-6xl font-playfair font-bold text-pm-gold">{averageScore.toFixed(2)} <span className="text-3xl text-black">/ 10</span></p>
                 </div>
                 <div>
                    <h3 className="text-xl font-playfair">Décision Provisoire</h3>
                    <p className={`text-4xl font-playfair font-bold ${decision === 'Présélectionné' ? 'text-green-600' : 'text-red-600'}`}>{decision}</p>
                 </div>
            </section>
        </div>
    );
};

export default PrintableCastingSheet;--- START OF FILE components/BookingForm.tsx ---

import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { BookingRequest } from '../types';

interface BookingFormProps {
    prefilledModelName?: string;
    onSuccess?: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ prefilledModelName, onSuccess }) => {
    const { data, saveData } = useData();
    const [formData, setFormData] = useState({
        clientName: '',
        clientEmail: '',
        clientCompany: '',
        requestedModels: prefilledModelName || '',
        startDate: '',
        endDate: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        if (prefilledModelName) {
            setFormData(prev => ({ ...prev, requestedModels: prefilledModelName }));
        }
    }, [prefilledModelName]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setStatusMessage('');

        if (!data) {
            setStatus('error');
            setStatusMessage('Erreur: Impossible de charger les données.');
            return;
        }

        const newRequest: BookingRequest = {
            id: `booking-${Date.now()}`,
            submissionDate: new Date().toISOString(),
            status: 'Nouveau',
            ...formData
        };

        try {
            const updatedRequests = [...(data.bookingRequests || []), newRequest];
            await saveData({ ...data, bookingRequests: updatedRequests });

            setStatus('success');
            setStatusMessage('Demande de booking envoyée ! Notre équipe vous contactera prochainement.');
            setFormData({
                clientName: '', clientEmail: '', clientCompany: '',
                requestedModels: prefilledModelName || '', startDate: '', endDate: '', message: ''
            });
            if (onSuccess) onSuccess();
        } catch (error) {
            setStatus('error');
            setStatusMessage("Une erreur est survenue lors de l'envoi de votre demande.");
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Votre Nom Complet" name="clientName" value={formData.clientName} onChange={handleChange} required />
                <FormInput label="Votre Email" name="clientEmail" type="email" value={formData.clientEmail} onChange={handleChange} required />
            </div>
            <FormInput label="Société (optionnel)" name="clientCompany" value={formData.clientCompany} onChange={handleChange} />
            <FormInput 
                label="Mannequin(s) souhaité(s)" 
                name="requestedModels" 
                value={formData.requestedModels} 
                onChange={handleChange} 
                required 
                disabled={!!prefilledModelName}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Date de début (souhaitée)" name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
                <FormInput label="Date de fin (souhaitée)" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
            </div>
            <FormTextArea label="Message / Détails du projet" name="message" value={formData.message} onChange={handleChange} required />

            <div>
                <button type="submit" disabled={status === 'loading'} className="w-full px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all hover:bg-white disabled:opacity-50">
                    {status === 'loading' ? 'Envoi...' : 'Envoyer la demande'}
                </button>
            </div>
            {statusMessage && (
                <p className={`text-center text-sm p-3 rounded-md ${status === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {statusMessage}
                </p>
            )}
        </form>
    );
};

const FormInput: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, required?: boolean, disabled?: boolean}> = (props) => (
    <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <input {...props} id={props.name} className="admin-input" />
    </div>
);

const FormTextArea: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, required?: boolean}> = (props) => (
    <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <textarea {...props} id={props.name} rows={5} className="admin-input admin-textarea" />
    </div>
);

export default BookingForm;--- START OF FILE pages/AdminBookings.tsx ---

import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { BookingRequest } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

type StatusFilter = 'Toutes' | 'Nouveau' | 'Confirmé' | 'Annulé';

const AdminBookings: React.FC = () => {
    const { data, saveData } = useData();
    const [filter, setFilter] = useState<StatusFilter>('Toutes');

    const requests = useMemo(() => {
        return [...(data?.bookingRequests || [])].sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
    }, [data?.bookingRequests]);

    const filteredRequests = useMemo(() => {
        if (filter === 'Toutes') return requests;
        return requests.filter(req => req.status === filter);
    }, [filter, requests]);

    const handleUpdateStatus = async (requestId: string, status: BookingRequest['status']) => {
        if (!data) return;
        const updatedRequests = requests.map(req => req.id === requestId ? { ...req, status } : req);
        await saveData({ ...data, bookingRequests: updatedRequests });
    };

    const handleDelete = async (requestId: string) => {
        if (!data || !window.confirm("Supprimer cette demande de booking ?")) return;
        const updatedRequests = requests.filter(req => req.id !== requestId);
        await saveData({ ...data, bookingRequests: updatedRequests });
    };
    
    const getStatusColor = (status: BookingRequest['status']) => {
        switch (status) {
            case 'Nouveau': return 'bg-blue-500/20 text-blue-300 border-blue-500';
            case 'Confirmé': return 'bg-green-500/20 text-green-300 border-green-500';
            case 'Annulé': return 'bg-red-500/20 text-red-300 border-red-500';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Demandes de Booking" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Dashboard
                </Link>
                <h1 className="text-4xl font-playfair text-pm-gold">Demandes de Booking</h1>
                <p className="text-pm-off-white/70 mt-2 mb-8">Gérez les demandes de réservation des clients.</p>

                <div className="flex items-center gap-4 mb-8 flex-wrap">
                    {(['Toutes', 'Nouveau', 'Confirmé', 'Annulé'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 text-sm uppercase tracking-wider rounded-full transition-all ${filter === f ? 'bg-pm-gold text-pm-dark' : 'bg-black border border-pm-gold text-pm-gold hover:bg-pm-gold/20'}`}>
                            {f}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {filteredRequests.map(req => (
                        <div key={req.id} className="bg-black p-4 border border-pm-gold/10 rounded-lg">
                            <div className="flex justify-between items-start flex-wrap gap-4">
                                <div>
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusColor(req.status)}`}>{req.status}</span>
                                    <h2 className="text-xl font-bold text-pm-gold mt-2">{req.requestedModels}</h2>
                                    <p className="text-sm text-pm-off-white/80">de <span className="font-semibold">{req.clientName}</span> ({req.clientEmail})</p>
                                    {req.clientCompany && <p className="text-xs text-pm-off-white/60">Société: {req.clientCompany}</p>}
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm">Du {req.startDate || 'N/A'} au {req.endDate || 'N/A'}</p>
                                    <p className="text-xs text-pm-off-white/60">Soumis le {new Date(req.submissionDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <p className="mt-4 pt-3 border-t border-pm-gold/10 text-sm text-pm-off-white/90 whitespace-pre-wrap bg-pm-dark/50 p-3 rounded-md">
                                {req.message}
                            </p>
                            <div className="mt-4 flex justify-end items-center gap-2">
                                {req.status === 'Nouveau' && (
                                    <button onClick={() => handleUpdateStatus(req.id, 'Confirmé')} className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-green-500 text-green-300 rounded-full hover:bg-green-500/20">
                                        Confirmer
                                    </button>
                                )}
                                {req.status !== 'Annulé' && (
                                     <button onClick={() => handleUpdateStatus(req.id, 'Annulé')} className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-red-500 text-red-300 rounded-full hover:bg-red-500/20">
                                        Annuler
                                    </button>
                                )}
                                <button onClick={() => handleDelete(req.id)} className="text-red-500/70 hover:text-red-500 p-1"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    ))}
                     {filteredRequests.length === 0 && (
                        <div className="text-center p-16 bg-black rounded-lg border border-pm-gold/10">
                            <CheckCircleIcon className="w-16 h-16 mx-auto text-pm-off-white/30 mb-4"/>
                            <p className="text-pm-off-white/70">Aucune demande de booking dans cette catégorie.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminBookings;--- START OF FILE components/icons/AnimatedHamburgerIcon.tsx ---

import React from 'react';

const AnimatedHamburgerIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const commonClasses = "block absolute h-0.5 w-6 bg-current transform transition duration-500 ease-in-out";
  return (
    <div className="w-6 h-6 relative">
      <span className={`${commonClasses} ${isOpen ? 'rotate-45' : '-translate-y-1.5'}`}></span>
      <span className={`${commonClasses} ${isOpen ? 'opacity-0' : ''}`}></span>
      <span className={`${commonClasses} ${isOpen ? '-rotate-45' : 'translate-y-1.5'}`}></span>
    </div>
  );
};

export default AnimatedHamburgerIcon;--- START OF FILE pages/AdminMessages.tsx ---


import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { ContactMessage } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, CheckCircleIcon, EyeIcon } from '@heroicons/react/24/outline';

type StatusFilter = 'Toutes' | 'Nouveau' | 'Lu' | 'Archivé';

const AdminMessages: React.FC = () => {
    const { data, saveData } = useData();
    const [filter, setFilter] = useState<StatusFilter>('Toutes');

    const messages = useMemo(() => {
        return [...(data?.contactMessages || [])].sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
    }, [data?.contactMessages]);

    const filteredMessages = useMemo(() => {
        if (filter === 'Toutes') return messages;
        return messages.filter(req => req.status === filter);
    }, [filter, messages]);

    const handleUpdateStatus = async (messageId: string, status: ContactMessage['status']) => {
        if (!data) return;
        const updatedMessages = messages.map(msg => msg.id === messageId ? { ...msg, status } : msg);
        await saveData({ ...data, contactMessages: updatedMessages });
    };

    const handleDelete = async (messageId: string) => {
        if (!data || !window.confirm("Supprimer ce message ?")) return;
        const updatedMessages = messages.filter(msg => msg.id !== messageId);
        await saveData({ ...data, contactMessages: updatedMessages });
    };

    const getStatusColor = (status: ContactMessage['status']) => {
        switch (status) {
            case 'Nouveau': return 'bg-blue-500/20 text-blue-300 border-blue-500';
            case 'Lu': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
            case 'Archivé': return 'bg-gray-500/20 text-gray-400 border-gray-500';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };
    
    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Messages de Contact" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Dashboard
                </Link>
                <h1 className="text-4xl font-playfair text-pm-gold">Messages de Contact</h1>
                <p className="text-pm-off-white/70 mt-2 mb-8">Gérez les messages reçus via le formulaire de contact public.</p>

                <div className="flex items-center gap-4 mb-8 flex-wrap">
                    {(['Toutes', 'Nouveau', 'Lu', 'Archivé'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 text-sm uppercase tracking-wider rounded-full transition-all ${filter === f ? 'bg-pm-gold text-pm-dark' : 'bg-black border border-pm-gold text-pm-gold hover:bg-pm-gold/20'}`}>
                            {f}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {filteredMessages.map(msg => (
                        <div key={msg.id} className="bg-black p-4 border border-pm-gold/10 rounded-lg">
                            <div className="flex justify-between items-start flex-wrap gap-4">
                                <div>
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusColor(msg.status)}`}>{msg.status}</span>
                                    <h2 className="text-xl font-bold text-pm-gold mt-2">{msg.subject}</h2>
                                    <p className="text-sm text-pm-off-white/80">de <span className="font-semibold">{msg.name}</span> ({msg.email})</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xs text-pm-off-white/60">Reçu le {new Date(msg.submissionDate).toLocaleString('fr-FR')}</p>
                                </div>
                            </div>
                            <p className="mt-4 pt-3 border-t border-pm-gold/10 text-sm text-pm-off-white/90 whitespace-pre-wrap bg-pm-dark/50 p-3 rounded-md">
                                {msg.message}
                            </p>
                            <div className="mt-4 flex justify-end items-center gap-2">
                                {msg.status === 'Nouveau' && (
                                    <button onClick={() => handleUpdateStatus(msg.id, 'Lu')} className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-yellow-500 text-yellow-300 rounded-full hover:bg-yellow-500/20">
                                        Marquer comme Lu
                                    </button>
                                )}
                                {msg.status !== 'Archivé' && (
                                     <button onClick={() => handleUpdateStatus(msg.id, 'Archivé')} className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-gray-500 text-gray-400 rounded-full hover:bg-gray-500/20">
                                        Archiver
                                    </button>
                                )}
                                <button onClick={() => handleDelete(msg.id)} className="text-red-500/70 hover:text-red-500 p-1"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    ))}
                     {filteredMessages.length === 0 && (
                        <div className="text-center p-16 bg-black rounded-lg border border-pm-gold/10">
                            <EyeIcon className="w-16 h-16 mx-auto text-pm-off-white/30 mb-4"/>
                            <p className="text-pm-off-white/70">Aucun message dans cette catégorie.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminMessages;--- START OF FILE pages/AdminCastingResults.tsx ---

import React, { useMemo, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { CastingApplication, CastingApplicationStatus, Model, JuryMember } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, CheckBadgeIcon, XCircleIcon, ArrowPathIcon, PrinterIcon } from '@heroicons/react/24/outline';
import PrintableCastingSheet from '../components/icons/PrintableCastingSheet';

const AdminCastingResults: React.FC = () => {
    const { data, saveData } = useData();
    const [filter, setFilter] = useState<CastingApplicationStatus | 'AllScored'>('AllScored');
    const [printingApp, setPrintingApp] = useState<CastingApplication | null>(null);

    const applicantsWithScores = useMemo(() => {
        const juryMembers: JuryMember[] = data?.juryMembers || [];
        return (data?.castingApplications || [])
            .filter(app => app.scores && Object.keys(app.scores).length > 0)
            .map(app => {
                const scores = Object.values(app.scores!);
                const averageScore = scores.reduce((sum, s) => sum + s.overall, 0) / scores.length;
                
                const scoredJuryIds = Object.keys(app.scores || {});
                const missingJuries = juryMembers.filter(j => !scoredJuryIds.includes(j.id));
                const isFullyScored = missingJuries.length === 0 && juryMembers.length > 0;

                return { ...app, averageScore, juryVotes: scores.length, missingJuries, isFullyScored };
            })
            .sort((a, b) => b.averageScore - a.averageScore);
    }, [data?.castingApplications, data?.juryMembers]);

    const filteredApplicants = useMemo(() => {
        if (filter === 'AllScored') return applicantsWithScores;
        return applicantsWithScores.filter(app => app.status === filter);
    }, [filter, applicantsWithScores]);

    const handleUpdateStatus = async (appId: string, newStatus: CastingApplicationStatus) => {
        if (!data) return;
        const updatedApps = data.castingApplications.map(app =>
            app.id === appId ? { ...app, status: newStatus } : app
        );
        await saveData({ ...data, castingApplications: updatedApps });
    };
    
    const handleValidateAndCreateModel = async (app: CastingApplication) => {
        if (!data) return;

        if (app.status === 'Accepté') {
            alert("Ce candidat a déjà été accepté et un profil a été créé.");
            return;
        }

        const modelExists = data.models.some(m => m.name.toLowerCase() === `${app.firstName} ${app.lastName}`.toLowerCase());
        if (modelExists) {
            alert("Un mannequin avec ce nom existe déjà. Impossible de créer un duplicata.");
            await handleUpdateStatus(app.id, 'Accepté'); // Mark as accepted anyway if name clash
            return;
        }

        const currentYear = new Date().getFullYear();
        const sanitizeForPassword = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f\u0027]/g, "").replace(/[^a-z0-9-]/g, "");

        const initial = app.firstName.charAt(0).toUpperCase();
        const modelsWithSameInitial = data.models.filter(m => m.username && m.username.startsWith(`Man-PMM${initial}`));
        const existingNumbers = modelsWithSameInitial.map(m => {
            const numPart = m.username.replace(`Man-PMM${initial}`, '');
            return parseInt(numPart, 10) || 0;
        });
        const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
        const username = `Man-PMM${initial}${String(nextNumber).padStart(2, '0')}`;
        const password = `${sanitizeForPassword(app.firstName)}${currentYear}`;
        const id = `${app.lastName.toLowerCase()}-${app.firstName.toLowerCase()}`.replace(/[^a-z0-9-]/g, '') + `-${app.id.slice(-4)}`;

        let experienceText = "Expérience à renseigner par l'administrateur.";
        switch (app.experience) {
            case 'none': experienceText = "Débutant(e) sans expérience préalable, prêt(e) à apprendre les bases du métier."; break;
            case 'beginner': experienceText = "A déjà participé à quelques shootings photo en amateur ou pour de petites marques."; break;
            case 'intermediate': experienceText = "A une expérience préalable en agence et a participé à des défilés ou des campagnes locales."; break;
            case 'professional': experienceText = "Carrière de mannequin professionnel(le) établie avec un portfolio solide."; break;
        }
        
        const age = app.birthDate ? new Date().getFullYear() - new Date(app.birthDate).getFullYear() : undefined;

        const newModel: Model = {
            id: id,
            name: `${app.firstName} ${app.lastName}`,
            username: username,
            password: password,
            level: 'Débutant',
            email: app.email,
            phone: app.phone,
            age: age,
            height: `${app.height}cm`,
            gender: app.gender,
            location: app.city,
            imageUrl: `https://i.ibb.co/fVBxPNTP/T-shirt.png`, // Placeholder image
            isPublic: false, // Default to private
            distinctions: [],
            measurements: {
                chest: `${app.chest || '0'}cm`,
                waist: `${app.waist || '0'}cm`,
                hips: `${app.hips || '0'}cm`,
                shoeSize: `${app.shoeSize || '0'}`,
            },
            categories: ['Défilé', 'Commercial'],
            experience: experienceText,
            journey: "Parcours à renseigner par l'administrateur.",
            quizScores: {}
        };

        const updatedModels = [...data.models, newModel];
        // FIX: Explicitly type `updatedApps` to prevent TypeScript from widening the `status` property to a generic `string`.
        const updatedApps: CastingApplication[] = data.castingApplications.map(localApp => localApp.id === app.id ? { ...localApp, status: 'Accepté' } : localApp);

        try {
            await saveData({ ...data, models: updatedModels, castingApplications: updatedApps });
            alert(`Le mannequin ${newModel.name} a été créé avec succès et la candidature a été marquée comme "Accepté".`);
        } catch (error) {
            console.error("Erreur lors de la création du mannequin:", error);
            alert("Une erreur est survenue lors de la sauvegarde.");
        }
    };
    
    const getStatusColor = (status: CastingApplicationStatus) => {
        switch (status) {
            case 'Nouveau': return 'bg-blue-500/20 text-blue-300 border-blue-500';
            case 'Présélectionné': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
            case 'Accepté': return 'bg-green-500/20 text-green-300 border-green-500';
            case 'Refusé': return 'bg-red-500/20 text-red-300 border-red-500';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };
    
    const getScoreColor = (score: number) => {
        if (score >= 7.5) return 'text-green-400';
        if (score >= 5) return 'text-yellow-400';
        return 'text-red-400';
    };

    const filterOptions: { value: CastingApplicationStatus | 'AllScored', label: string }[] = [
        { value: 'AllScored', label: 'Tous les Notés' },
        { value: 'Présélectionné', label: 'Présélectionnés' },
        { value: 'Accepté', label: 'Acceptés' },
        { value: 'Refusé', label: 'Refusés' }
    ];

    if (printingApp) {
        return <PrintableCastingSheet app={printingApp} juryMembers={data?.juryMembers || []} onDonePrinting={() => setPrintingApp(null)} />;
    }

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Résultats & Validation Casting" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Tableau de Bord
                </Link>
                <h1 className="text-4xl font-playfair text-pm-gold">Résultats & Validation Casting</h1>
                <p className="text-pm-off-white/70 mt-2 mb-8">
                    Consultez les moyennes des candidats et validez leur entrée dans l'agence.
                </p>

                <div className="flex items-center gap-4 mb-8 flex-wrap">
                    {filterOptions.map(f => (
                        <button key={f.value} onClick={() => setFilter(f.value)} className={`px-4 py-1.5 text-sm uppercase tracking-wider rounded-full transition-all duration-300 ${filter === f.value ? 'bg-pm-gold text-pm-dark' : 'bg-black border border-pm-gold text-pm-gold hover:bg-pm-gold/20'}`}>
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden shadow-lg shadow-black/30">
                    <div className="overflow-x-auto">
                         <table className="w-full text-left">
                            <thead className="bg-pm-dark/50">
                                <tr className="border-b border-pm-gold/20">
                                    <th className="p-4 uppercase text-xs tracking-wider">Passage</th>
                                    <th className="p-4 uppercase text-xs tracking-wider">Candidat</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-center">Votes Jury</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-center">Moyenne</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-center">Statut</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplicants.map(app => {
                                    const missingJuryNames = app.missingJuries.map(j => j.name).join(', ');
                                    const tooltip = app.isFullyScored
                                        ? "Toutes les notes ont été enregistrées."
                                        : `Notes manquantes: ${missingJuryNames}`;
                                    return (
                                    <tr key={app.id} className={`border-b border-pm-dark hover:bg-pm-dark/50 ${app.isFullyScored ? 'bg-pm-dark border-l-4 border-l-pm-gold' : ''}`}>
                                        <td className="p-4 font-bold text-pm-gold">#{String(app.passageNumber).padStart(3, '0')}</td>
                                        <td className="p-4 font-semibold">{app.firstName} {app.lastName}</td>
                                        <td className="p-4 text-center" title={tooltip}>
                                            {app.juryVotes} / {data?.juryMembers.length || 4}
                                            {!app.isFullyScored && <span className="text-red-500 ml-1">*</span>}
                                        </td>
                                        <td className={`p-4 text-center font-bold text-lg ${getScoreColor(app.averageScore)}`}>{app.averageScore.toFixed(2)}</td>
                                        <td className="p-4 text-center"><span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusColor(app.status)}`}>{app.status}</span></td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setPrintingApp(app)}
                                                    className="action-btn bg-blue-500/10 text-blue-300 border-blue-500/50 hover:bg-blue-500/20"
                                                    title="Télécharger la fiche PDF"
                                                >
                                                    <PrinterIcon className="w-5 h-5"/>
                                                </button>
                                                {app.status === 'Présélectionné' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleValidateAndCreateModel(app)} 
                                                            className="action-btn bg-green-500/10 text-green-300 border-green-500/50 hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed" 
                                                            title={app.isFullyScored ? "Accepter & Créer le profil" : "En attente de toutes les notes"}
                                                            disabled={!app.isFullyScored}
                                                        >
                                                            <CheckBadgeIcon className="w-5 h-5"/>
                                                        </button>
                                                        <button onClick={() => handleUpdateStatus(app.id, 'Refusé')} className="action-btn bg-red-500/10 text-red-300 border-red-500/50 hover:bg-red-500/20" title="Refuser">
                                                            <XCircleIcon className="w-5 h-5"/>
                                                        </button>
                                                    </>
                                                )}
                                                {app.status === 'Accepté' && (
                                                    <span className="text-xs text-green-400">Profil Créé</span>
                                                )}
                                                {app.status === 'Refusé' && (
                                                    <button onClick={() => handleUpdateStatus(app.id, 'Présélectionné')} className="action-btn bg-yellow-500/10 text-yellow-300 border-yellow-500/50 hover:bg-yellow-500/20" title="Annuler le refus">
                                                        <ArrowPathIcon className="w-5 h-5"/>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                         </table>
                         {filteredApplicants.length === 0 && <p className="text-center p-8 text-pm-off-white/60">Aucun candidat ne correspond à ce filtre.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCastingResults;--- START OF FILE vite.config.ts ---

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})--- START OF FILE postcss.config.js ---

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}--- START OF FILE tailwind.config.js ---

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pm-dark': '#111111',
        'pm-gold': '#D4AF37',
        'pm-off-white': '#f0f0f0',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'montserrat': ['"Montserrat"', 'sans-serif'],
      },
      animation: {
          'marquee': 'marquee 60s linear infinite',
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
          marquee: {
              '0%': { transform: 'translateX(0%)' },
              '100%': { transform: 'translateX(-50%)' },
          },
          fadeIn: {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 },
          },
      }
    }
  },
  plugins: [],
}--- START OF FILE src/index.tsx ---

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);--- START OF FILE public/sw.js ---

const CACHE_NAME = 'pmm-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  'https://i.ibb.co/fVBxPNTP/T-shirt.png',
  'https://i.ibb.co/K2wS0Pz/hero-bg.jpg',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Montserrat:wght@300;400;500&display=swap',
];

// Install event: cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching core assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event: serve from cache, fall back to network, and cache new requests
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Network-first for APIs to ensure data freshness
  if (event.request.url.includes('firebaseio.com')) {
     event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
     );
     return;
  }

  // Cache-first for all other requests
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
        
        return response || fetchPromise;
      });
    })
  );
});--- START OF FILE src/App.tsx ---

import React, { useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { DataProvider, useData } from 'contexts/DataContext';
import Layout from 'components/Layout';
import ProtectedRoute from 'components/ProtectedRoute';

// Pages
import Home from 'pages/Home';
import Agency from 'pages/Agency';
import Models from 'pages/Models';
import ModelDetail from 'pages/ModelDetail';
import FashionDay from 'pages/FashionDay';
import Magazine from 'pages/Magazine';
import ArticleDetail from 'pages/ArticleDetail';
import Contact from 'pages/Contact';
import Services from 'pages/Services';
import Casting from 'pages/Casting';
import CastingForm from 'pages/CastingForm';
import FashionDayApplicationForm from 'pages/FashionDayApplicationForm';
import Login from 'pages/Login';
import Activity from 'pages/Activity'; // Renamed Formations
import ChapterDetail from 'pages/ChapterDetail';
import ModelDashboard from 'pages/ModelDashboard'; // Profil
import ClassroomForum from 'pages/ClassroomForum';
import ForumThread from 'pages/ForumThread';
import Chat from 'pages/Chat';


// Admin Pages
import Admin from 'pages/Admin';
import AdminAgency from 'pages/AdminAgency';
import AdminCasting from 'pages/AdminCasting';
import AdminCastingResults from 'pages/AdminCastingResults'; // Nouvelle page
import AdminClassroom from 'pages/AdminClassroom';
import AdminClassroomProgress from 'pages/AdminClassroomProgress';
import AdminFashionDay from 'pages/AdminFashionDay';
import AdminFashionDayEvents from 'pages/AdminFashionDayEvents';
import AdminMagazine from 'pages/AdminMagazine';
import AdminModelAccess from 'pages/AdminModelAccess';
import AdminModels from 'pages/AdminModels';
import AdminNews from 'pages/AdminNews';
import AdminRecovery from 'pages/AdminRecovery';
import AdminSettings from 'pages/AdminSettings';
import AdminComments from 'pages/AdminComments';
import AdminBookings from 'pages/AdminBookings';
import AdminMessages from 'pages/AdminMessages';

// Role-specific pages
import JuryCasting from 'pages/JuryCasting';
import RegistrationCasting from 'pages/RegistrationCasting';

// Static Pages
import PrivacyPolicy from 'pages/PrivacyPolicy';
import TermsOfUse from 'pages/TermsOfUse';
import NotFound from 'pages/NotFound';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent = () => {
    const location = useLocation();
    const { data } = useData();
    const hideAIAssistant = [
        '/login', '/admin', '/jury', '/enregistrement', '/profil', '/chat'
    ].some(path => location.pathname.startsWith(path));

    // Notification logic for browser tab title
    useEffect(() => {
        const originalTitle = "Perfect Models Management";
        if (data && location.pathname.startsWith('/admin')) {
            const newCastingApps = data.castingApplications?.filter(app => app.status === 'Nouveau').length || 0;
            const newFashionDayApps = data.fashionDayApplications?.filter(app => app.status === 'Nouveau').length || 0;
            const newRecoveryRequests = data.recoveryRequests?.filter(req => req.status === 'Nouveau').length || 0;
            const newBookingRequests = data.bookingRequests?.filter(req => req.status === 'Nouveau').length || 0;
            const newMessages = data.contactMessages?.filter(msg => msg.status === 'Nouveau').length || 0;

            const totalNotifications = newCastingApps + newFashionDayApps + newRecoveryRequests + newBookingRequests + newMessages;

            if (totalNotifications > 0) {
                document.title = `(${totalNotifications}) Admin | ${originalTitle}`;
            } else {
                document.title = `Admin | ${originalTitle}`;
            }
        } else {
            // Restore title if not on an admin page (this will be handled by SEO component for other pages)
            if (document.title.startsWith('(') || document.title.startsWith('Admin |')) {
                 document.title = originalTitle;
            }
        }
        
        // Cleanup function to restore original title on component unmount
        return () => {
            document.title = originalTitle;
        };
    }, [location.pathname, data]);


    return (
        <>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/agence" element={<Agency />} />
                    <Route path="/mannequins" element={<Models />} />
                    <Route path="/mannequins/:id" element={<ModelDetail />} />
                    <Route path="/fashion-day" element={<FashionDay />} />
                    <Route path="/magazine" element={<Magazine />} />
                    <Route path="/magazine/:slug" element={<ArticleDetail />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/casting" element={<Casting />} />
                    <Route path="/casting-formulaire" element={<CastingForm />} />
                    <Route path="/fashion-day-application" element={<FashionDayApplicationForm />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-use" element={<TermsOfUse />} />

                    {/* Protected Routes */}
                    <Route path="/formations" element={<ProtectedRoute role="student"><Activity /></ProtectedRoute>} />
                    <Route path="/formations/forum" element={<ProtectedRoute role="student"><ClassroomForum /></ProtectedRoute>} />
                    <Route path="/formations/forum/:threadId" element={<ProtectedRoute role="student"><ForumThread /></ProtectedRoute>} />
                    <Route path="/formations/:moduleSlug/:chapterSlug" element={<ProtectedRoute role="student"><ChapterDetail /></ProtectedRoute>} />
                    <Route path="/profil" element={<ProtectedRoute role="student"><ModelDashboard /></ProtectedRoute>} />
                    
                    <Route path="/jury/casting" element={<ProtectedRoute role="jury"><JuryCasting /></ProtectedRoute>} />
                    <Route path="/enregistrement/casting" element={<ProtectedRoute role="registration"><RegistrationCasting /></ProtectedRoute>} />
                    
                    <Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
                    <Route path="/admin/models" element={<ProtectedRoute role="admin"><AdminModels /></ProtectedRoute>} />
                    <Route path="/admin/magazine" element={<ProtectedRoute role="admin"><AdminMagazine /></ProtectedRoute>} />
                    <Route path="/admin/classroom" element={<ProtectedRoute role="admin"><AdminClassroom /></ProtectedRoute>} />
                    <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />
                    <Route path="/admin/agency" element={<ProtectedRoute role="admin"><AdminAgency /></ProtectedRoute>} />
                    <Route path="/admin/casting-applications" element={<ProtectedRoute role="admin"><AdminCasting /></ProtectedRoute>} />
                    <Route path="/admin/casting-results" element={<ProtectedRoute role="admin"><AdminCastingResults /></ProtectedRoute>} />
                    <Route path="/admin/fashion-day-applications" element={<ProtectedRoute role="admin"><AdminFashionDay /></ProtectedRoute>} />
                    <Route path="/admin/fashion-day-events" element={<ProtectedRoute role="admin"><AdminFashionDayEvents /></ProtectedRoute>} />
                    <Route path="/admin/news" element={<ProtectedRoute role="admin"><AdminNews /></ProtectedRoute>} />
                    <Route path="/admin/classroom-progress" element={<ProtectedRoute role="admin"><AdminClassroomProgress /></ProtectedRoute>} />
                    <Route path="/admin/model-access" element={<ProtectedRoute role="admin"><AdminModelAccess /></ProtectedRoute>} />
                    <Route path="/admin/recovery-requests" element={<ProtectedRoute role="admin"><AdminRecovery /></ProtectedRoute>} />
                    <Route path="/admin/comments" element={<ProtectedRoute role="admin"><AdminComments /></ProtectedRoute>} />
                    <Route path="/admin/messages" element={<ProtectedRoute role="admin"><AdminMessages /></ProtectedRoute>} />
                    <Route path="/admin/bookings" element={<ProtectedRoute role="admin"><AdminBookings /></ProtectedRoute>} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        </>
    );
}

const App: React.FC = () => {

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
      });
    }
  }, []);

  return (
    <DataProvider>
      <HashRouter>
        <ScrollToTop />
        <AppContent />
      </HashRouter>
    </DataProvider>
  );
};

export default App;--- START OF FILE src/types.ts ---

import React from 'react';

export interface Model {
  id: string;
  name: string;
  username: string;
  password: string;
  email?: string;
  phone?: string;
  age?: number;
  height: string;
  gender: 'Homme' | 'Femme';
  location?: string;
  imageUrl: string;
  portfolioImages?: string[];
  distinctions?: ModelDistinction[];
  isPublic?: boolean; // True if the model profile is visible on the public site
  level?: 'Pro' | 'Débutant';
  // New portfolio fields
  measurements: {
    chest: string;
    waist: string;
    hips: string;
    shoeSize: string;
  };
  categories: string[];
  experience: string;
  journey: string;
  quizScores: { [quizId: string]: number };
}

// FIX: Add BeginnerStudent interface to be used by the beginner classroom and admin pages.
export interface BeginnerStudent {
  id: string; // Corresponds to the CastingApplication ID
  name: string;
  matricule: string;
  password: string;
  quizScores: { [chapterSlug: string]: number }; // Score out of 20
}

export interface Stylist {
  name: string;
  description: string;
  images: string[];
}

export interface FashionDayEvent {
  edition: number;
  date: string;
  theme: string;
  location?: string;
  mc?: string;
  promoter?: string;
  stylists?: Stylist[];
  featuredModels?: string[];
  artists?: string[];
  partners?: { type: string; name: string }[];
  description: string;
}

// FIX: Add missing SocialLinks interface
export interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  isComingSoon?: boolean;
}

export interface AchievementCategory {
  name: string;
  items: string[];
}

export interface ModelDistinction {
    name: string;
    titles: string[];
}

// Types for Magazine Feature
export type ArticleContent = 
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'image'; src: string; alt: string; caption?: string };

export interface Article {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  date: string;
  content: ArticleContent[];
  tags?: string[];
  isFeatured?: boolean;
  viewCount?: number;
  reactions?: {
    likes: number;
    dislikes: number;
  };
}


// Types for Classroom feature
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Chapter {
  slug: string;
  title: string;
  content: string;
}

export interface Module {
  slug: string;
  title: string;
  chapters: Chapter[];
  quiz: QuizQuestion[];
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  imageUrl: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  excerpt: string;
  link?: string;
}

// Types for Site Settings
export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  notificationEmail?: string;
}

export interface SiteImages {
  hero: string;
  about: string;
  fashionDayBg: string;
  agencyHistory: string;
  classroomBg: string;
  castingBg: string;
}

export interface Partner {
  name: string;
}

export interface ApiKeys {
  resendApiKey: string;
  formspreeEndpoint: string;
  cloudflareWorkerUrl?: string;
}

export type CastingApplicationStatus = 'Nouveau' | 'Présélectionné' | 'Accepté' | 'Refusé';

export interface JuryScore {
  physique: number;
  presence: number;
  photogenie: number;
  potentiel: number;
  notes?: string;
  overall: number;
}

export interface JuryMember {
  id: string;
  name: string;
  username: string;
  password: string;
}

export interface RegistrationStaff {
  id: string;
  name: string;
  username: string;
  password: string;
}

export interface CastingApplication {
  id: string;
  submissionDate: string;
  status: CastingApplicationStatus;
  
  // From form
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  nationality: string;
  city: string;
  gender: 'Homme' | 'Femme';
  height: string;
  weight: string;
  chest: string;
  waist: string;
  hips: string;
  shoeSize: string;
  eyeColor: string;
  hairColor: string;
  experience: string;
  instagram: string;
  portfolioLink: string;

  // Photo URLs from storage
  photoPortraitUrl?: string | null;
  photoFullBodyUrl?: string | null;
  photoProfileUrl?: string | null;

  scores?: {
    [juryId: string]: JuryScore;
  };
  
  passageNumber?: number;
}

export type FashionDayApplicationRole = 'Mannequin' | 'Styliste' | 'Partenaire' | 'Photographe' | 'MUA' | 'Autre';
export type FashionDayApplicationStatus = 'Nouveau' | 'En attente' | 'Accepté' | 'Refusé';

export interface FashionDayApplication {
  id: string;
  submissionDate: string;
  name: string;
  email: string;
  phone: string;
  role: FashionDayApplicationRole;
  message: string;
  status: FashionDayApplicationStatus;
}

export interface ForumThread {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  initialPost: string;
}

export interface ForumReply {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  content: string;
}

export interface ArticleComment {
  id: string;
  articleSlug: string;
  authorName: string; // "Anonyme" or model name
  createdAt: string;
  content: string;
}

export interface RecoveryRequest {
  id: string;
  modelName: string;
  phone: string;
  timestamp: string;
  status: 'Nouveau' | 'Traité';
}

export interface BookingRequest {
  id: string;
  submissionDate: string;
  status: 'Nouveau' | 'Confirmé' | 'Annulé';
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  requestedModels: string;
  startDate?: string;
  endDate?: string;
  message: string;
}

export interface ContactMessage {
  id: string;
  submissionDate: string;
  status: 'Nouveau' | 'Lu' | 'Archivé';
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertContent: (content: string) => void;
  fieldName: string;
  initialPrompt: string;
  jsonSchema?: any;
}--- START OF FILE src/firebaseConfig.ts ---

import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  databaseURL: "https://pmmdb-89a3f-default-rtdb.firebaseio.com/",
  storageBucket: "pmmdb-89a3f.appspot.com",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
export const db = getDatabase(app);--- START OF FILE src/contexts/DataContext.tsx ---

import React, { createContext, useContext } from 'react';
import { useDataStore, AppData } from '../hooks/useDataStore';

interface DataContextType {
  data: AppData | null;
  saveData: (newData: AppData) => void;
  isInitialized: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useDataStore();
  return <DataContext.Provider value={store}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};--- START OF FILE src/hooks/useDataStore.tsx ---

import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebaseConfig';
import { ref, onValue, set } from 'firebase/database';
// FIX: Add BeginnerStudent to the type imports.
import { Model, FashionDayEvent, Service, AchievementCategory, ModelDistinction, Testimonial, ContactInfo, SiteImages, Partner, ApiKeys, CastingApplication, FashionDayApplication, NewsItem, ForumThread, ForumReply, Article, Module, ArticleComment, RecoveryRequest, JuryMember, RegistrationStaff, BookingRequest, ContactMessage, BeginnerStudent } from '../types';

// Import initial data to seed the database if it's empty
import { 
    models as initialModels, 
    siteConfig as initialSiteConfig, 
    contactInfo as initialContactInfo, 
    siteImages as initialSiteImages, 
    apiKeys as initialApiKeys, 
    castingApplications as initialCastingApplications, 
    fashionDayApplications as initialFashionDayApplications, 
    forumThreads as initialForumThreads,
    forumReplies as initialForumReplies,
    articleComments as initialArticleComments,
    recoveryRequests as initialRecoveryRequests,
    bookingRequests as initialBookingRequests,
    contactMessages as initialContactMessages,
    newsItems as initialNewsItems, 
    navLinks as initialNavLinks, 
    fashionDayEvents as initialFashionDayEvents, 
    socialLinks as initialSocialLinks, 
    agencyTimeline as initialAgencyTimeline, 
    agencyInfo as initialAgencyInfo, 
    modelDistinctions as initialModelDistinctions, 
    agencyServices as initialAgencyServices, 
    agencyAchievements as initialAgencyAchievements, 
    agencyPartners as initialAgencyPartners, 
    testimonials as initialTestimonials,
    juryMembers as initialJuryMembers,
    registrationStaff as initialRegistrationStaff,
    beginnerStudents as initialBeginnerStudents,
    beginnerCourseData as initialBeginnerCourseData
} from '../constants/data';
import { articles as initialArticles } from '../constants/magazineData';
import { courseData as initialCourseData } from '../constants/courseData';

export interface NavLink {
    path: string;
    label: string;
    inFooter: boolean;
    footerLabel?: string;
}

export interface AppData {
    siteConfig: { logo: string };
    navLinks: NavLink[];
    socialLinks: { facebook: string; instagram: string; youtube: string; };
    agencyTimeline: { year: string; event: string; }[];
    agencyInfo: {
        about: { p1: string; p2: string; };
        values: { name: string; description: string; }[];
    };
    modelDistinctions: ModelDistinction[];
    agencyServices: Service[];
    agencyAchievements: AchievementCategory[];
    agencyPartners: Partner[];
    models: Model[];
    fashionDayEvents: FashionDayEvent[];
    testimonials: Testimonial[];
    articles: Article[];
    courseData: Module[];
    contactInfo: ContactInfo;
    siteImages: SiteImages;
    apiKeys: ApiKeys;
    castingApplications: CastingApplication[];
    fashionDayApplications: FashionDayApplication[];
    newsItems: NewsItem[];
    forumThreads: ForumThread[];
    forumReplies: ForumReply[];
    articleComments: ArticleComment[];
    recoveryRequests: RecoveryRequest[];
    bookingRequests: BookingRequest[];
    contactMessages: ContactMessage[];
    juryMembers: JuryMember[];
    registrationStaff: RegistrationStaff[];
    // FIX: Add missing properties for beginner classroom functionality.
    beginnerCourseData: Module[];
    beginnerStudents: BeginnerStudent[];
}

export const useDataStore = () => {
    const [data, setData] = useState<AppData | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const getInitialData = useCallback((): AppData => ({
        models: initialModels,
        siteConfig: initialSiteConfig,
        contactInfo: initialContactInfo,
        siteImages: initialSiteImages,
        apiKeys: initialApiKeys,
        castingApplications: initialCastingApplications,
        fashionDayApplications: initialFashionDayApplications,
        forumThreads: initialForumThreads,
        forumReplies: initialForumReplies,
        articleComments: initialArticleComments,
        recoveryRequests: initialRecoveryRequests,
        bookingRequests: initialBookingRequests,
        contactMessages: initialContactMessages,
        newsItems: initialNewsItems,
        navLinks: initialNavLinks,
        fashionDayEvents: initialFashionDayEvents,
        socialLinks: initialSocialLinks,
        agencyTimeline: initialAgencyTimeline,
        agencyInfo: initialAgencyInfo,
        modelDistinctions: initialModelDistinctions,
        agencyServices: initialAgencyServices,
        agencyAchievements: initialAgencyAchievements,
        agencyPartners: initialAgencyPartners,
        testimonials: initialTestimonials,
        articles: initialArticles,
        courseData: initialCourseData,
        juryMembers: initialJuryMembers,
        registrationStaff: initialRegistrationStaff,
        beginnerCourseData: initialBeginnerCourseData,
        beginnerStudents: initialBeginnerStudents,
    }), []);
    
    useEffect(() => {
        const dbRef = ref(db, '/');
        
        const unsubscribe = onValue(dbRef, (snapshot) => {
            const dbData = snapshot.val();
            const initialData = getInitialData();
            if (dbData) {
                // Defensive merge: prevent critical data arrays from being overwritten by empty/null values from DB
                const mergedData = {
                    ...initialData,
                    ...dbData,
                    models: (dbData.models && dbData.models.length > 0) ? dbData.models : initialData.models,
                    articles: (dbData.articles && dbData.articles.length > 0) ? dbData.articles : initialData.articles,
                    courseData: (dbData.courseData && dbData.courseData.length > 0) ? dbData.courseData : initialData.courseData,
                    beginnerCourseData: (dbData.beginnerCourseData && dbData.beginnerCourseData.length > 0) ? dbData.beginnerCourseData : initialData.beginnerCourseData,
                    newsItems: (dbData.newsItems && dbData.newsItems.length > 0) ? dbData.newsItems : initialData.newsItems,
                    testimonials: (dbData.testimonials && dbData.testimonials.length > 0) ? dbData.testimonials : initialData.testimonials,
                    agencyServices: (dbData.agencyServices && dbData.agencyServices.length > 0) ? dbData.agencyServices : initialData.agencyServices,
                    fashionDayEvents: (dbData.fashionDayEvents && dbData.fashionDayEvents.length > 0) ? dbData.fashionDayEvents : initialData.fashionDayEvents,
                };
                
                // Always use navLinks from code to ensure route integrity
                mergedData.navLinks = initialData.navLinks;
                setData(mergedData);
            } else {
                // If DB is empty, seed it with initial data
                set(dbRef, initialData).then(() => {
                    setData(initialData);
                    console.log("Firebase database seeded with initial data.");
                }).catch(error => {
                    console.error("Error seeding database:", error);
                });
            }
            setIsInitialized(true);
        }, (error) => {
            console.error("Firebase read failed: " + error.message);
            // Fallback to local data if Firebase fails
            setData(getInitialData());
            setIsInitialized(true);
        });

        // Detach the listener when the component unmounts
        return () => unsubscribe();
    }, [getInitialData]);

    const saveData = useCallback(async (newData: Partial<AppData>) => {
        try {
            const fullData = { ...data, ...newData } as AppData;
            await set(ref(db, '/'), fullData);
            // The local state will be updated by the 'on' listener,
            // but we can set it here for immediate UI feedback if desired.
            setData(fullData);
        } catch (error) {
            console.error("Error saving data to Firebase:", error);
            throw error; // Re-throw to be caught by the caller
        }
    }, [data]);

    return { data, saveData, isInitialized };
};--- START OF FILE src/constants/beginnerCourseData.ts ---

import { Module } from '../types';

export const beginnerCourseData: Module[] = [
  {
    slug: "module-1-decouverte-du-mannequinat",
    title: "Module 1: Découverte du Mannequinat",
    chapters: [
      { 
        slug: "chap-1-1-quest-ce-quun-mannequin",
        title: "Chapitre 1: Qu'est-ce qu'un Mannequin en 2025 ?", 
        content: `Bienvenue dans le monde fascinant du mannequinat ! Oubliez les clichés. En 2025, un mannequin est bien plus qu'un simple porte-manteau. C'est un communicant, un athlète de l'image, et un entrepreneur. Votre rôle est de donner vie à une vision, que ce soit celle d'un créateur de mode, d'une marque ou d'un photographe. Vous êtes l'interprète silencieux qui transforme un vêtement en désir et une idée en émotion. Cela demande de la polyvalence : vous serez tour à tour acteur, sportif et artiste. Le marché gabonais, en pleine effervescence, recherche des personnalités authentiques qui peuvent représenter la richesse et la modernité de notre culture. Préparez-vous à un métier exigeant mais incroyablement gratifiant.`
      },
      { 
        slug: "chap-1-2-les-differents-metiers-du-mannequinat",
        title: "Chapitre 2: Les Différents Métiers du Mannequinat", 
        content: `Le mannequinat n'est pas un bloc monolithique. Il existe plusieurs spécialisations, et connaître celle qui vous correspond est la première étape vers le succès.
        1. **Mannequin de Défilé (Runway)** : Le plus connu. Il faut une taille spécifique et une démarche maîtrisée pour présenter les collections.
        2. **Mannequin Commercial** : Pour les publicités, catalogues, sites e-commerce. On recherche des visages accessibles, souriants, qui inspirent confiance.
        3. **Mannequin Éditorial** : Pour les séries mode des magazines. Le but est artistique, les poses sont plus créatives et expressives.
        4. **Mannequin Beauté** : Spécialisé dans les plans serrés sur le visage pour les cosmétiques et le maquillage. Une peau parfaite et des traits harmonieux sont essentiels.
        5. **Mannequin de Détail (Parts Model)** : Focus sur une partie du corps : mains, pieds, cheveux...
        Chaque domaine a ses propres codes et exigences. PMM vous aidera à identifier et à développer votre potentiel dans le ou les domaines qui vous conviennent le mieux.`
      },
      { 
        slug: "chap-1-3-la-mode-au-gabon-un-ecosysteme-en-plein-essor",
        title: "Chapitre 3: La Mode au Gabon, un Écosystème en Essor", 
        content: `La scène de la mode gabonaise est vibrante et pleine d'opportunités. Des événements comme le Perfect Fashion Day (PFD) ou la Libreville Fashion Week sont des vitrines majeures pour les talents locaux. Des créateurs comme Gilles Touré, Franck Biyong ou des marques comme Yalerri créent une mode qui mêle inspirations traditionnelles et coupes contemporaines. En tant que mannequin au Gabon, vous serez au cœur de cette effervescence. Vous aurez la chance de travailler avec des photographes talentueux (NR Picture, par exemple), des stylistes visionnaires et de participer à la construction d'une identité mode forte pour notre pays. C'est une chance unique de faire partie d'un mouvement culturel important.`
      },
      { 
        slug: "chap-1-4-les-qualites-essentielles-dun-bon-mannequin",
        title: "Chapitre 4: Les Qualités Essentielles d'un Bon Mannequin", 
        content: `Le physique ne fait pas tout. Pour réussir, un mannequin doit cultiver des qualités humaines et professionnelles.
        1. **La Discipline** : Respecter les horaires, prendre soin de son corps, suivre les instructions.
        2. **La Persévérance** : Le mannequinat est fait de hauts et de bas. Il faut savoir gérer le rejet en casting sans se décourager.
        3. **L'Adaptabilité** : Être capable de changer d'attitude, de style, de coiffure, et de travailler avec des équipes différentes chaque jour.
        