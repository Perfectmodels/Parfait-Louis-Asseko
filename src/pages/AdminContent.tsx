import React, { useState, useMemo } from 'react';
import AdminPageWrapper from '../components/AdminPageWrapper';
import AdminCard from '../components/admin/AdminCard';
import { StatCard } from '../components/admin/AdminStats';
import ArticleModal from '../components/admin/ArticleModal';
import NewsModal from '../components/admin/NewsModal';
import PageModal from '../components/admin/PageModal';
import ModuleModal from '../components/admin/ModuleModal';
import { 
    NewspaperIcon, PresentationChartLineIcon, DocumentTextIcon, BookOpenIcon,
    CameraIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

const AdminContent: React.FC = () => {
    const { data, saveData } = useData();
    const [activeSection, setActiveSection] = useState<'articles' | 'pages' | 'media' | 'classroom'>('articles');
    const [showArticleModal, setShowArticleModal] = useState(false);
    const [showNewsModal, setShowNewsModal] = useState(false);
    const [showPageModal, setShowPageModal] = useState(false);
    const [showModuleModal, setShowModuleModal] = useState(false);

    // ---- Statistiques ----
    const totalArticles = (data as any)?.articles?.length || 0;
    const totalPages = (data as any)?.pageContents?.length || 0;
    const totalMedia = data?.siteImages ? Object.keys(data.siteImages).length : 0;
    const totalClassroomModules = (data as any)?.classroomModules?.length || 0;

    // Fonction de modification des pages
    const handleEditPage = (page: any) => {
        const newTitle = prompt('Nouveau titre de la page:', page.title);
        if (newTitle && newTitle !== page.title) {
            if (!data) return;
            
            const updatedPages = (data.pageContents || []).map((p: any) => 
                p.id === page.id ? { ...p, title: newTitle, updatedAt: new Date().toISOString() } : p
            );
            saveData({ ...data, pageContents: updatedPages });
        }
    };

    const handlePreviewPage = (page: any) => {
        // Ouvrir la page dans un nouvel onglet
        window.open(`/page/${page.slug || page.id}`, '_blank');
    };

    // Fonctions de gestion des modals
    const handleSaveArticle = (articleData: any) => {
        if (!data) return;
        
        const updatedArticles = [...(data.articles || []), articleData];
        saveData({ ...data, articles: updatedArticles });
        setShowArticleModal(false);
    };

    const handleSaveNews = (newsData: any) => {
        if (!data) return;
        
        const updatedNews = [...(data.newsItems || []), newsData];
        saveData({ ...data, newsItems: updatedNews });
        setShowNewsModal(false);
    };

    const handleSavePage = (pageData: any) => {
        if (!data) return;
        
        const updatedPages = [...(data.pageContents || []), pageData];
        saveData({ ...data, pageContents: updatedPages });
        setShowPageModal(false);
    };

    const handleSaveModule = (moduleData: any) => {
        if (!data) return;
        
        const updatedModules = [...(data.trainingModules || []), moduleData];
        saveData({ ...data, trainingModules: updatedModules });
        setShowModuleModal(false);
    };

    // ---- Filtrage des articles ----
    const publishedArticles = useMemo(() => 
        (data as any)?.articles?.filter((article: any) => article.status === 'Publié') || [], 
        [data]
    );

    const draftArticles = useMemo(() => 
        (data as any)?.articles?.filter((article: any) => article.status === 'Brouillon') || [], 
        [data]
    );

    const sections = [
        { id: 'articles', label: 'Articles & Actualités', icon: NewspaperIcon, count: totalArticles },
        { id: 'pages', label: 'Pages du Site', icon: DocumentTextIcon, count: totalPages },
        { id: 'media', label: 'Médias', icon: CameraIcon, count: totalMedia },
        { id: 'classroom', label: 'Formation', icon: BookOpenIcon, count: totalClassroomModules },
    ];

    return (
        <AdminPageWrapper>
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Articles Publiés"
                    value={publishedArticles.length}
                    icon={NewspaperIcon}
                    color="blue"
                    change={{
                        value: 5,
                        type: 'increase',
                        label: 'cette semaine'
                    }}
                />
                <StatCard
                    title="Pages du Site"
                    value={totalPages}
                    icon={DocumentTextIcon}
                    color="green"
                />
                <StatCard
                    title="Médias Stockés"
                    value={totalMedia}
                    icon={CameraIcon}
                    color="purple"
                />
                <StatCard
                    title="Modules Formation"
                    value={totalClassroomModules}
                    icon={BookOpenIcon}
                    color="orange"
                />
            </div>

            {/* Navigation des sections */}
            <div className="mb-8">
                <nav className="flex space-x-1 bg-black/30 p-1 rounded-lg">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id as any)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeSection === section.id
                                    ? 'bg-pm-gold text-black'
                                    : 'text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10'
                            }`}
                        >
                            <section.icon className="w-4 h-4" />
                            {section.label}
                            <span className="bg-black/20 px-2 py-1 rounded-full text-xs">
                                {section.count}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AdminCard 
                    title="Nouvel Article" 
                    icon={NewspaperIcon} 
                    description="Créer un nouvel article pour le magazine."
                    color="blue"
                    onClick={() => setShowArticleModal(true)}
                />
                <AdminCard 
                    title="Actualité" 
                    icon={PresentationChartLineIcon} 
                    description="Publier une actualité sur la page d'accueil."
                    color="green"
                    onClick={() => setShowNewsModal(true)}
                />
                <AdminCard 
                    title="Page du Site" 
                    icon={DocumentTextIcon} 
                    description="Créer ou modifier une page du site."
                    color="purple"
                    onClick={() => setShowPageModal(true)}
                />
                <AdminCard 
                    title="Module Formation" 
                    icon={BookOpenIcon} 
                    description="Ajouter un module de formation."
                    color="orange"
                    onClick={() => setShowModuleModal(true)}
                />
            </div>

            {/* Contenu selon la section active */}
            {activeSection === 'articles' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Articles publiés */}
                        <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                            <h3 className="text-xl font-playfair text-pm-gold mb-4">
                                Articles Publiés ({publishedArticles.length})
                            </h3>
                            {publishedArticles.length === 0 ? (
                                <p className="text-pm-off-white/70">Aucun article publié.</p>
                            ) : (
                                <div className="space-y-3">
                                    {publishedArticles.slice(0, 5).map((article: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                                            <div>
                                                <h4 className="text-pm-gold font-medium">{article.title}</h4>
                                                <p className="text-pm-off-white/70 text-sm">
                                                    {new Date(article.publishedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="px-3 py-1 bg-pm-gold/20 text-pm-gold text-xs rounded hover:bg-pm-gold/30">
                                                    Modifier
                                                </button>
                                                <button className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded hover:bg-red-500/30">
                                                    Dépublier
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Brouillons */}
                        <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                            <h3 className="text-xl font-playfair text-pm-gold mb-4">
                                Brouillons ({draftArticles.length})
                            </h3>
                            {draftArticles.length === 0 ? (
                                <p className="text-pm-off-white/70">Aucun brouillon.</p>
                            ) : (
                                <div className="space-y-3">
                                    {draftArticles.slice(0, 5).map((article: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                                            <div>
                                                <h4 className="text-pm-gold font-medium">{article.title}</h4>
                                                <p className="text-pm-off-white/70 text-sm">
                                                    Modifié le {new Date(article.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="px-3 py-1 bg-pm-gold/20 text-pm-gold text-xs rounded hover:bg-pm-gold/30">
                                                    Modifier
                                                </button>
                                                <button className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded hover:bg-green-500/30">
                                                    Publier
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeSection === 'pages' && (
                <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                    <h3 className="text-xl font-playfair text-pm-gold mb-4">
                        Pages du Site ({totalPages})
                    </h3>
                    {totalPages === 0 ? (
                        <p className="text-pm-off-white/70">Aucune page créée.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(data as any)?.pageContents?.map((page: any, index: number) => (
                                <div key={index} className="bg-black/30 border border-pm-gold/10 rounded-lg p-4">
                                    <h4 className="text-pm-gold font-medium mb-2">{page.title}</h4>
                                    <p className="text-pm-off-white/70 text-sm mb-3">{page.description}</p>
                                    <div className="flex gap-2">
                                        <button 
                                            className="flex-1 px-3 py-1 bg-pm-gold/20 text-pm-gold text-xs rounded hover:bg-pm-gold/30"
                                            onClick={() => handleEditPage(page)}
                                        >
                                            Modifier
                                        </button>
                                        <button 
                                            className="flex-1 px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded hover:bg-blue-500/30"
                                            onClick={() => handlePreviewPage(page)}
                                        >
                                            Prévisualiser
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeSection === 'media' && (
                <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                    <h3 className="text-xl font-playfair text-pm-gold mb-4">
                        Médias Stockés ({totalMedia})
                    </h3>
                    <div className="text-center py-12">
                        <CameraIcon className="w-16 h-16 text-pm-gold/50 mx-auto mb-4" />
                        <p className="text-pm-off-white/70 text-lg mb-4">
                            Gestion des médias à implémenter
                        </p>
                        <button className="px-6 py-2 bg-pm-gold text-black rounded-lg hover:bg-pm-gold/90 transition-colors">
                            Uploader des fichiers
                        </button>
                    </div>
                </div>
            )}

            {activeSection === 'classroom' && (
                <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                    <h3 className="text-xl font-playfair text-pm-gold mb-4">
                        Modules de Formation ({totalClassroomModules})
                    </h3>
                    <div className="text-center py-12">
                        <BookOpenIcon className="w-16 h-16 text-pm-gold/50 mx-auto mb-4" />
                        <p className="text-pm-off-white/70 text-lg mb-4">
                            Gestion de la formation à implémenter
                        </p>
                        <button className="px-6 py-2 bg-pm-gold text-black rounded-lg hover:bg-pm-gold/90 transition-colors">
                            Créer un module
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            <ArticleModal
                isOpen={showArticleModal}
                onClose={() => setShowArticleModal(false)}
                onSave={handleSaveArticle}
            />

            <NewsModal
                isOpen={showNewsModal}
                onClose={() => setShowNewsModal(false)}
                onSave={handleSaveNews}
            />

            <PageModal
                isOpen={showPageModal}
                onClose={() => setShowPageModal(false)}
                onSave={handleSavePage}
            />

            <ModuleModal
                isOpen={showModuleModal}
                onClose={() => setShowModuleModal(false)}
                onSave={handleSaveModule}
            />
        </AdminPageWrapper>
    );
};

export default AdminContent;