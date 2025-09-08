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
        saveData(newData);
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
                 <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Tableau de Bord
                        </Link>
                        <h1 className="text-4xl font-playfair text-pm-gold">Gérer le Contenu de l'Agence</h1>
                    </div>
                    <button onClick={handleSave} className="px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-lg shadow-pm-gold/30">
                        Sauvegarder les Changements
                    </button>
                </div>

                <div className="space-y-8">
                    <SectionWrapper title="Textes 'À Propos'">
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
                    </SectionWrapper>

                    <SectionWrapper title="Nos Valeurs">
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
                    </SectionWrapper>

                    <SectionWrapper title="Notre Parcours (Chronologie)">
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
                    </SectionWrapper>
                    
                     <SectionWrapper title="Nos Services">
                         <ArrayEditor 
                            items={localData.agencyServices}
                            setItems={newItems => setLocalData(p => ({...p!, agencyServices: newItems}))}
                            renderItem={(item: Service, onChange) => (
                                <>
                                    <FormInput label="Icône" value={item.icon} onChange={e => onChange('icon', e.target.value)} />
                                    <p className="text-xs text-pm-off-white/60 -mt-2">Noms valides: UserGroupIcon, AcademicCapIcon, CameraIcon, SparklesIcon, ScaleIcon, GlobeAltIcon, HeartIcon</p>
                                    <FormInput label="Titre" value={item.title} onChange={e => onChange('title', e.target.value)} />
                                    <FormTextArea 
                                        label="Description" value={item.description} onChange={e => onChange('description', e.target.value)} 
                                        onOpenAI={() => openAIAssistant(
                                            'Description de service',
                                            (content) => onChange('description', content),
                                            `Rédige une description complète et attractive pour un service intitulé "${item.title}".`
                                        )}
                                    />
                                </>
                            )}
                            getNewItem={() => ({ icon: 'HeartIcon', title: 'Nouveau Service', description: 'Description...' })}
                            getItemTitle={item => item.title}
                        />
                    </SectionWrapper>
                    
                    <SectionWrapper title="Nos Réalisations">
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
                    </SectionWrapper>
                </div>
            </div>
        </div>
        </>
    );
};


const SectionWrapper: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-black border border-pm-gold/20 p-6 rounded-lg shadow-lg shadow-black/30">
        <h2 className="text-2xl font-playfair text-pm-gold mb-6 border-b border-pm-gold/20 pb-3">{title}</h2>
        <div className="space-y-4">{children}</div>
    </div>
);

const FormInput: React.FC<{label: string, value: any, onChange: any, onOpenAI?: () => void}> = ({label, value, onChange, onOpenAI}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-pm-off-white/70">{label}</label>
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
            <label className="block text-sm font-medium text-pm-off-white/70">{label}</label>
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
                <PlusIcon className="w-4 h-4"/> Ajouter un élément
            </button>
        </div>
    );
};

export default AdminAgency;