import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { AppData } from '../hooks/useDataStore';
import { Testimonial, Partner } from '../types';
import SEO from '../components/SEO';
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import ImageUpload from '../components/ImageUpload';

type EditableData = Omit<AppData, 'models' | 'articles' | 'courseData' | 'beginnerCourseData' | 'beginnerStudents' | 'castingApplications' | 'fashionDayApplications' | 'newsItems' | 'forumThreads' | 'forumReplies' | 'articleComments' | 'recoveryRequests' | 'bookingRequests' | 'contactMessages' | 'juryMembers' | 'registrationStaff' >;

const AdminSettings: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [localData, setLocalData] = useState<EditableData | null>(null);

    useEffect(() => {
        if (isInitialized && data) {
            const { models, articles, courseData, beginnerCourseData, beginnerStudents, castingApplications, fashionDayApplications, newsItems, forumThreads, forumReplies, articleComments, recoveryRequests, bookingRequests, contactMessages, juryMembers, registrationStaff, ...editableData } = data;
            setLocalData(JSON.parse(JSON.stringify(editableData)));
        }
    }, [isInitialized, data]);
    
    const handleSave = () => {
        if (!data || !localData) return;
        const newData: AppData = { ...data, ...localData };
        saveData(newData);
        alert("Changements enregistrés avec succès dans la base de données.");
    };

    const handleSimpleChange = (section: keyof EditableData, key: string, value: any) => {
        if (!localData) return;
        setLocalData(prev => ({
            ...prev!,
            [section]: {
                ...(prev![section] as object),
                [key]: value
            }
        }));
    };
    
    if (!localData || !data) {
        return <div className="min-h-screen flex items-center justify-center text-pm-gold">Chargement des paramètres...</div>;
    }

    return (
        <>
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Paramètres du Site" noIndex />
            <div className="container mx-auto px-6">
                <div className="admin-page-header">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Dashboard
                        </Link>
                        <h1 className="admin-page-title">Paramètres du Site</h1>
                        <p className="admin-page-subtitle">Modifiez les informations globales, les images et les configurations.</p>
                    </div>
                    <button onClick={handleSave} className="px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-lg shadow-pm-gold/30">
                        Sauvegarder les Changements
                    </button>
                </div>

                <div className="space-y-8">
                    <div className="admin-section-wrapper">
                        <h2 className="admin-section-title">Informations de Contact</h2>
                        <div className="space-y-4">
                            <FormInput label="Email public" value={localData.contactInfo.email} onChange={e => handleSimpleChange('contactInfo', 'email', e.target.value)} />
                            <FormInput label="Téléphone" value={localData.contactInfo.phone} onChange={e => handleSimpleChange('contactInfo', 'phone', e.target.value)} />
                            <FormInput label="Adresse" value={localData.contactInfo.address} onChange={e => handleSimpleChange('contactInfo', 'address', e.target.value)} />
                        </div>
                    </div>

                    <div className="admin-section-wrapper">
                        <h2 className="admin-section-title">Images du Site</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="admin-label">Logo</label>
                                <ImageUpload 
                                    currentImage={localData.siteConfig.logo} 
                                    onImageUploaded={value => handleSimpleChange('siteConfig', 'logo', value)}
                                    placeholder="Cliquez pour uploader le logo"
                                />
                            </div>
                            <div>
                                <label className="admin-label">Image Héros (Accueil)</label>
                                <ImageUpload 
                                    currentImage={localData.siteImages.hero} 
                                    onImageUploaded={value => handleSimpleChange('siteImages', 'hero', value)}
                                    placeholder="Cliquez pour uploader l'image héros"
                                />
                            </div>
                            <div>
                                <label className="admin-label">Image 'À Propos' (Accueil)</label>
                                <ImageUpload 
                                    currentImage={localData.siteImages.about} 
                                    onImageUploaded={value => handleSimpleChange('siteImages', 'about', value)}
                                    placeholder="Cliquez pour uploader l'image à propos"
                                />
                            </div>
                            <div>
                                <label className="admin-label">Fond 'Fashion Day' (Accueil)</label>
                                <ImageUpload 
                                    currentImage={localData.siteImages.fashionDayBg} 
                                    onImageUploaded={value => handleSimpleChange('siteImages', 'fashionDayBg', value)}
                                    placeholder="Cliquez pour uploader le fond Fashion Day"
                                />
                            </div>
                            <div>
                                <label className="admin-label">Image 'Notre Histoire' (Agence)</label>
                                <ImageUpload 
                                    currentImage={localData.siteImages.agencyHistory} 
                                    onImageUploaded={value => handleSimpleChange('siteImages', 'agencyHistory', value)}
                                    placeholder="Cliquez pour uploader l'image histoire"
                                />
                            </div>
                            <div>
                                <label className="admin-label">Fond 'Classroom'</label>
                                <ImageUpload 
                                    currentImage={localData.siteImages.classroomBg} 
                                    onImageUploaded={value => handleSimpleChange('siteImages', 'classroomBg', value)}
                                    placeholder="Cliquez pour uploader le fond classroom"
                                />
                            </div>
                            <div>
                                <label className="admin-label">Affiche 'Casting'</label>
                                <ImageUpload 
                                    currentImage={localData.siteImages.castingBg} 
                                    onImageUploaded={value => handleSimpleChange('siteImages', 'castingBg', value)}
                                    placeholder="Cliquez pour uploader l'affiche casting"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section Hero Backgrounds */}
                    <div className="admin-section-wrapper">
                        <h2 className="admin-section-title">Backgrounds des Sections Hero</h2>
                        <p className="text-pm-off-white/70 mb-6">Configurez les images d'arrière-plan pour les sections hero de chaque page principale.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="admin-label">Services - Hero Background</label>
                                <ImageUpload 
                                    currentImage={localData.siteImages.servicesHero} 
                                    onImageUploaded={value => handleSimpleChange('siteImages', 'servicesHero', value)}
                                    placeholder="Cliquez pour uploader le background Services"
                                />
                            </div>
                            <div>
                                <label className="admin-label">Mannequins - Hero Background</label>
                                <ImageUpload 
                                    currentImage={localData.siteImages.modelsHero} 
                                    onImageUploaded={value => handleSimpleChange('siteImages', 'modelsHero', value)}
                                    placeholder="Cliquez pour uploader le background Mannequins"
                                />
                            </div>
                            <div>
                                <label className="admin-label">Magazine - Hero Background</label>
                                <ImageUpload 
                                    currentImage={localData.siteImages.magazineHero} 
                                    onImageUploaded={value => handleSimpleChange('siteImages', 'magazineHero', value)}
                                    placeholder="Cliquez pour uploader le background Magazine"
                                />
                            </div>
                            <div>
                                <label className="admin-label">Galerie - Hero Background</label>
                                <ImageUpload 
                                    currentImage={localData.siteImages.galleryHero} 
                                    onImageUploaded={value => handleSimpleChange('siteImages', 'galleryHero', value)}
                                    placeholder="Cliquez pour uploader le background Galerie"
                                />
                            </div>
                            <div>
                                <label className="admin-label">Contact - Hero Background</label>
                                <ImageUpload 
                                    currentImage={localData.siteImages.contactHero} 
                                    onImageUploaded={value => handleSimpleChange('siteImages', 'contactHero', value)}
                                    placeholder="Cliquez pour uploader le background Contact"
                                />
                            </div>
                            <div>
                                <label className="admin-label">Agence - Hero Background</label>
                                <ImageUpload 
                                    currentImage={localData.siteImages.agencyHero} 
                                    onImageUploaded={value => handleSimpleChange('siteImages', 'agencyHero', value)}
                                    placeholder="Cliquez pour uploader le background Agence"
                                />
                            </div>
                            <div>
                                <label className="admin-label">Casting - Hero Background</label>
                                <ImageUpload 
                                    currentImage={localData.siteImages.castingHero} 
                                    onImageUploaded={value => handleSimpleChange('siteImages', 'castingHero', value)}
                                    placeholder="Cliquez pour uploader le background Casting"
                                />
                            </div>
                        </div>
                    </div>
                    
                     <div className="admin-section-wrapper">
                        <h2 className="admin-section-title">Réseaux Sociaux</h2>
                        <div className="space-y-4">
                            <FormInput label="URL Facebook" value={localData.socialLinks.facebook} onChange={e => handleSimpleChange('socialLinks', 'facebook', e.target.value)} />
                            <FormInput label="URL Instagram" value={localData.socialLinks.instagram} onChange={e => handleSimpleChange('socialLinks', 'instagram', e.target.value)} />
                            <FormInput label="URL YouTube" value={localData.socialLinks.youtube} onChange={e => handleSimpleChange('socialLinks', 'youtube', e.target.value)} />
                        </div>
                    </div>
                    
                    <div className="admin-section-wrapper">
                        <h2 className="admin-section-title">Partenaires de l'Agence</h2>
                        <div className="space-y-4">
                            <ArrayEditor 
                                items={localData.agencyPartners}
                                setItems={newItems => setLocalData(p => ({...p!, agencyPartners: newItems}))}
                                renderItem={(item: Partner, onChange) => (
                                    <>
                                        <FormInput label="Nom du partenaire" value={item.name} onChange={e => onChange('name', e.target.value)} />
                                    </>
                                )}
                                getNewItem={() => ({ name: 'Nouveau Partenaire' })}
                                getItemTitle={item => item.name}
                            />
                        </div>
                    </div>
                    
                     <div className="admin-section-wrapper">
                        <h2 className="admin-section-title">Témoignages</h2>
                        <div className="space-y-4">
                            <ArrayEditor 
                                items={localData.testimonials}
                                setItems={newItems => setLocalData(p => ({...p!, testimonials: newItems}))}
                                renderItem={(item: Testimonial, onChange) => (
                                    <>
                                        <FormInput label="Nom" value={item.name} onChange={e => onChange('name', e.target.value)} />
                                        <FormInput label="Rôle" value={item.role} onChange={e => onChange('role', e.target.value)} />
                                        <div>
                                            <label className="admin-label">Photo</label>
                                            <ImageUpload 
                                                currentImage={item.imageUrl} 
                                                onImageUploaded={value => onChange('imageUrl', value)}
                                                placeholder="Cliquez pour uploader la photo"
                                            />
                                        </div>
                                        <FormTextArea 
                                            label="Citation" 
                                            value={item.quote} 
                                            onChange={e => onChange('quote', e.target.value)}
                                        />
                                    </>
                                )}
                                getNewItem={() => ({ name: 'Nouveau Témoin', role: 'Rôle', quote: '', imageUrl: ''})}
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

const FormInput: React.FC<{label: string, value: any, onChange: any}> = ({label, value, onChange}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label className="admin-label !mb-0">{label}</label>
        </div>
        <input type="text" value={value} onChange={onChange} className="admin-input" />
    </div>
);
const FormTextArea: React.FC<{label: string, value: any, onChange: any}> = ({label, value, onChange}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label className="admin-label !mb-0">{label}</label>
        </div>
        <textarea value={value} onChange={onChange} rows={5} className="admin-input admin-textarea" />
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

export default AdminSettings;