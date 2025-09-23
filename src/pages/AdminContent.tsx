import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/AdminLayout';
import AdminTable from '../components/admin/AdminTable';
import AdminModal from '../components/admin/AdminModal';
import { 
    DocumentTextIcon, 
    PencilIcon, 
    EyeIcon,
    PlusIcon,
    PhotoIcon,
    DocumentIcon
} from '@heroicons/react/24/outline';
import { PageContent, SiteImages } from '../types';

interface PageContentFormData {
    id: string;
    title: string;
    slug: string;
    content: string;
    metaDescription: string;
    featuredImage: string;
    isPublished: boolean;
    lastModified: string;
}

const AdminContent: React.FC = () => {
    const { data, saveData } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState<PageContentFormData | null>(null);
    const [formData, setFormData] = useState<PageContentFormData>({
        id: '',
        title: '',
        slug: '',
        content: '',
        metaDescription: '',
        featuredImage: '',
        isPublished: false,
        lastModified: new Date().toISOString()
    });

    // Initialiser les pages par défaut si elles n'existent pas
    useEffect(() => {
        if (data && !data.pageContents) {
            const defaultPages: PageContent[] = [
                {
                    id: 'home',
                    title: 'Page d\'Accueil',
                    slug: '/',
                    content: `
                        <h1>Bienvenue chez Perfect Models Management</h1>
                        <p>L'agence de mannequins de référence à Libreville, Gabon. Découvrez nos talents, nos événements mode exclusifs et notre vision qui redéfinit l'élégance africaine.</p>
                        <h2>Notre Mission</h2>
                        <p>Nous nous engageons à promouvoir la beauté africaine et à offrir des opportunités exceptionnelles à nos mannequins.</p>
                    `,
                    metaDescription: 'Perfect Models Management, l\'agence de mannequins de référence à Libreville, Gabon.',
                    featuredImage: 'https://i.ibb.co/K2wS0Pz/hero-bg.jpg',
                    isPublished: true,
                    lastModified: new Date().toISOString()
                },
                {
                    id: 'about',
                    title: 'À Propos',
                    slug: '/agence',
                    content: `
                        <h1>Notre Histoire</h1>
                        <p>Fondée avec passion et détermination, Perfect Models Management est devenue l'agence de référence au Gabon.</p>
                        <h2>Notre Vision</h2>
                        <p>Redéfinir l'élégance africaine et promouvoir la diversité dans l'industrie de la mode.</p>
                    `,
                    metaDescription: 'Découvrez l\'histoire et la vision de Perfect Models Management.',
                    featuredImage: 'https://i.ibb.co/mCcD1Gfq/DSC-0272.jpg',
                    isPublished: true,
                    lastModified: new Date().toISOString()
                },
                {
                    id: 'contact',
                    title: 'Contact',
                    slug: '/contact',
                    content: `
                        <h1>Contactez-nous</h1>
                        <p>Nous sommes là pour répondre à toutes vos questions et vous accompagner dans vos projets.</p>
                        <h2>Nos Coordonnées</h2>
                        <p>Adresse: Libreville, Gabon</p>
                        <p>Téléphone: +241 XX XX XX XX</p>
                        <p>Email: contact@perfectmodels.ga</p>
                    `,
                    metaDescription: 'Contactez Perfect Models Management pour vos projets de mode.',
                    featuredImage: 'https://i.ibb.co/K2wS0Pz/hero-bg.jpg',
                    isPublished: true,
                    lastModified: new Date().toISOString()
                }
            ];

            saveData({ ...data, pageContents: defaultPages });
        }
    }, [data, saveData]);

    const pages = data?.pageContents || [];
    const filteredPages = pages.filter(page =>
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreate = () => {
        setEditingPage(null);
        setFormData({
            id: '',
            title: '',
            slug: '',
            content: '',
            metaDescription: '',
            featuredImage: '',
            isPublished: false,
            lastModified: new Date().toISOString()
        });
        setIsModalOpen(true);
    };

    const handleEdit = (page: PageContent) => {
        setEditingPage(page);
        setFormData({
            id: page.id,
            title: page.title,
            slug: page.slug,
            content: page.content,
            metaDescription: page.metaDescription,
            featuredImage: page.featuredImage,
            isPublished: page.isPublished,
            lastModified: page.lastModified
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!data) return;

        const pageData: PageContent = {
            id: formData.id || `page_${Date.now()}`,
            title: formData.title,
            slug: formData.slug,
            content: formData.content,
            metaDescription: formData.metaDescription,
            featuredImage: formData.featuredImage,
            isPublished: formData.isPublished,
            lastModified: new Date().toISOString()
        };

        let updatedPages: PageContent[];
        if (editingPage) {
            updatedPages = pages.map(p => p.id === editingPage.id ? pageData : p);
        } else {
            updatedPages = [...pages, pageData];
        }

        await saveData({ ...data, pageContents: updatedPages });
        setIsModalOpen(false);
        setEditingPage(null);
    };

    const handleDelete = async (pageId: string) => {
        if (!data) return;
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) {
            const updatedPages = pages.filter(p => p.id !== pageId);
            await saveData({ ...data, pageContents: updatedPages });
        }
    };

    const columns = [
        {
            key: 'title',
            label: 'Titre',
            render: (value: string, page: PageContent) => (
                <div className="flex items-center gap-3">
                    <DocumentTextIcon className="w-5 h-5 text-pm-gold" />
                    <div>
                        <div className="font-semibold text-pm-off-white">{value}</div>
                        <div className="text-sm text-pm-off-white/60">{page.slug}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Statut',
            render: (value: any, page: PageContent) => (
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    page.isPublished
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                }`}>
                    {page.isPublished ? 'Publié' : 'Brouillon'}
                </span>
            )
        },
        {
            key: 'lastModified',
            label: 'Modifié',
            render: (value: string) => (
                <span className="text-pm-off-white/70">
                    {new Date(value).toLocaleDateString('fr-FR')}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (value: any, page: PageContent) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEdit(page)}
                        className="p-2 text-pm-gold hover:bg-pm-gold/10 rounded-lg transition-colors duration-200"
                        title="Modifier"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => window.open(page.slug, '_blank')}
                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors duration-200"
                        title="Voir"
                    >
                        <EyeIcon className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <AdminLayout 
            title="Gestion du Contenu" 
            description="Modifiez le contenu de vos pages"
            breadcrumbs={[
                { label: "Contenu" }
            ]}
            showSearch={true}
            onSearch={setSearchQuery}
        >
            <div className="space-y-6">
                {/* Actions */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-playfair text-pm-gold">Pages du Site</h2>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark font-semibold rounded-lg hover:bg-yellow-400 transition-colors duration-200"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Nouvelle Page
                    </button>
                </div>

                {/* Table */}
                <AdminTable
                    data={filteredPages}
                    columns={columns}
                    onDelete={handleDelete}
                />

                {/* Modal */}
                <AdminModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editingPage ? 'Modifier la Page' : 'Nouvelle Page'}
                    size="lg"
                >
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="admin-label">Titre de la Page</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="admin-input"
                                    placeholder="Ex: À Propos"
                                />
                            </div>
                            <div>
                                <label className="admin-label">URL (Slug)</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                    className="admin-input"
                                    placeholder="Ex: /a-propos"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="admin-label">Description Meta</label>
                            <textarea
                                value={formData.metaDescription}
                                onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                                className="admin-textarea"
                                rows={3}
                                placeholder="Description pour les moteurs de recherche"
                            />
                        </div>

                        <div>
                            <label className="admin-label">Image de Couverture</label>
                            <input
                                type="url"
                                value={formData.featuredImage}
                                onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                                className="admin-input"
                                placeholder="URL de l'image"
                            />
                            {formData.featuredImage && (
                                <div className="mt-2">
                                    <img 
                                        src={formData.featuredImage} 
                                        alt="Aperçu" 
                                        className="w-32 h-20 object-cover rounded-lg border border-pm-gold/20"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="admin-label">Contenu de la Page (HTML)</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                className="admin-textarea"
                                rows={10}
                                placeholder="Contenu HTML de la page..."
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isPublished}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                                    className="w-4 h-4 text-pm-gold bg-pm-dark border-pm-gold/30 rounded focus:ring-pm-gold/50"
                                />
                                <span className="text-pm-off-white">Publier la page</span>
                            </label>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-pm-gold border border-pm-gold/30 rounded-lg hover:bg-pm-gold/10 transition-colors duration-200"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-pm-gold text-pm-dark font-semibold rounded-lg hover:bg-yellow-400 transition-colors duration-200"
                            >
                                {editingPage ? 'Mettre à jour' : 'Créer'}
                            </button>
                        </div>
                    </div>
                </AdminModal>
            </div>
        </AdminLayout>
    );
};

export default AdminContent;
