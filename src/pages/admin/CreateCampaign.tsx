
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Campaign } from '../../types';
import SEO from '../../components/SEO';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { ArrowLeftIcon, PaperAirplaneIcon, BookmarkIcon } from '@heroicons/react/24/outline';

const CreateCampaign: React.FC = () => {
    const navigate = useNavigate();
    const { data, saveData } = useData();
    
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [recipientTags, setRecipientTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const allContactTags = Array.from(new Set(data?.contacts?.flatMap(c => c.tags) || []));

    const handleSaveCampaign = async (status: Campaign['status'] = 'draft') => {
        if (!name || !subject || !htmlContent) {
            alert('Veuillez remplir le nom, le sujet et le contenu de la campagne.');
            return;
        }

        if (!data) {
            alert('Erreur: Les données de l\'application ne sont pas chargées.');
            return;
        }

        setIsLoading(true);

        const newCampaign: Campaign = {
            id: `camp_${new Date().getTime()}`,
            name,
            subject,
            fromName: 'Perfect Models Management', // Default sender name
            fromEmail: 'contact@perfectmodels.ga', // Default sender email
            htmlContent,
            status,
            tags: [], // Add tags for the campaign itself if needed
            recipients: {
                type: 'tag',
                value: recipientTags,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            sentCount: 0,
            openCount: 0,
            clickCount: 0,
            bounceCount: 0,
            unsubscribeCount: 0,
        };

        try {
            const updatedData = {
                ...data,
                campaigns: [...(data.campaigns || []), newCampaign],
            };
            await saveData(updatedData as any);
            alert(`Campagne "${name}" sauvegardée comme ${status} !`);
            navigate('/admin/marketing-campaigns');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la campagne:', error);
            alert('Une erreur est survenue lors de la sauvegarde.');
        } finally {
            setIsLoading(false);
        }
    };

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Créer une Campagne" noIndex />
            <div className="container mx-auto px-6">
                <button onClick={() => navigate('/admin/marketing-campaigns')} className="inline-flex items-center gap-2 text-pm-gold mb-6 hover:underline">
                    <ArrowLeftIcon className="w-5 h-5" />
                    Retour aux Campagnes
                </button>

                <h1 className="text-4xl font-playfair text-pm-gold mb-8">Nouvelle Campagne Marketing</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 bg-black p-8 border border-pm-gold/10 rounded-lg">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="campaign-name" className="block text-sm font-semibold text-pm-gold mb-2">Nom de la Campagne</label>
                                <input 
                                    type="text"
                                    id="campaign-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: Annonce Fashion Day Hiver 2024"
                                    className="w-full px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg focus:border-pm-gold focus:outline-none"
                                />
                            </div>

                            <div>
                                <label htmlFor="campaign-subject" className="block text-sm font-semibold text-pm-gold mb-2">Sujet de l'Email</label>
                                <input 
                                    type="text"
                                    id="campaign-subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Ne manquez pas notre prochain événement !"
                                    className="w-full px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg focus:border-pm-gold focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-pm-gold mb-2">Contenu de l'Email</label>
                                <div className='bg-white text-gray-900 rounded-lg'>
                                    <ReactQuill 
                                        theme="snow"
                                        value={htmlContent}
                                        onChange={setHtmlContent}
                                        modules={quillModules}
                                        className='h-64 mb-12'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings & Actions */}
                    <div className="bg-black p-8 border border-pm-gold/10 rounded-lg self-start">
                        <h2 className="text-2xl font-bold text-pm-gold mb-6">Paramètres</h2>
                        
                        <div>
                            <h3 className="text-lg font-semibold text-pm-gold mb-3">Destinataires</h3>
                            <p className="text-sm text-pm-off-white/70 mb-3">Ciblez les contacts par tags.</p>
                            <div className="space-y-2">
                                {allContactTags.map(tag => (
                                    <div key={tag} className="flex items-center">
                                        <input 
                                            type="checkbox"
                                            id={`tag-${tag}`}
                                            value={tag}
                                            checked={recipientTags.includes(tag)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setRecipientTags([...recipientTags, tag]);
                                                } else {
                                                    setRecipientTags(recipientTags.filter(t => t !== tag));
                                                }
                                            }}
                                            className="h-4 w-4 rounded border-gray-300 text-pm-gold focus:ring-pm-gold"
                                        />
                                        <label htmlFor={`tag-${tag}`} className="ml-3 text-sm text-pm-off-white">
                                            {tag}
                                        </label>
                                    </div>
                                ))}
                                {allContactTags.length === 0 && <p className='text-sm text-pm-off-white/50'>Aucun tag de contact trouvé.</p>}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-pm-gold/10">
                            <h3 className="text-lg font-semibold text-pm-gold mb-4">Actions</h3>
                            <div className="space-y-3">
                                <button 
                                    onClick={() => handleSaveCampaign('draft')}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                                >
                                    <BookmarkIcon className="w-5 h-5" />
                                    Sauvegarder en Brouillon
                                </button>
                                <button 
                                    onClick={() => handleSaveCampaign('scheduled')} 
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
                                >
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                    {isLoading ? 'Sauvegarde...' : 'Planifier l\'envoi'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCampaign;
