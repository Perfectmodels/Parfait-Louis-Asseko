import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import ContentBuilder, { ContentBlock } from '../components/cms/ContentBuilder';
import MediaManager, { MediaItem } from '../components/cms/MediaManager';
import PageBuilder, { PageSection } from '../components/cms/PageBuilder';
import SEOTools, { SEOData } from '../components/cms/SEOTools';
import {
  DocumentTextIcon,
  PhotoIcon,
  PaintBrushIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  SparklesIcon,
  FolderIcon,
  TagIcon,
  CalendarIcon,
  UserIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: ContentBlock[];
  sections: PageSection[];
  seo: SEOData;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  excerpt?: string;
}

interface CMSTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  content: ContentBlock[];
  sections: PageSection[];
  seo: Partial<SEOData>;
}

const AdminCMS: React.FC = () => {
  const { data, saveData } = useData();
  const [activeTab, setActiveTab] = useState<'pages' | 'media' | 'templates' | 'seo' | 'settings'>('pages');
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [templates, setTemplates] = useState<CMSTemplate[]>([]);
  const [selectedPage, setSelectedPage] = useState<CMSPage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showPageBuilder, setShowPageBuilder] = useState(false);
  const [showMediaManager, setShowMediaManager] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockPages: CMSPage[] = [
      {
        id: '1',
        title: 'Page d\'accueil',
        slug: 'home',
        content: [],
        sections: [],
        seo: {
          title: 'Perfect Models Management - Agence de Mannequins',
          description: 'Découvrez notre agence de mannequins professionnels. Casting, formation et accompagnement pour une carrière réussie.',
          keywords: ['mannequin', 'agence', 'casting', 'mode', 'fashion'],
          canonicalUrl: 'https://perfectmodels.com',
          robots: 'index, follow'
        },
        status: 'published',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        author: 'Admin',
        category: 'homepage',
        tags: ['accueil', 'hero'],
        featuredImage: '/api/media/hero-image.jpg',
        excerpt: 'Page principale du site'
      },
      {
        id: '2',
        title: 'À propos',
        slug: 'about',
        content: [],
        sections: [],
        seo: {
          title: 'À propos - Perfect Models Management',
          description: 'Découvrez l\'histoire et la mission de Perfect Models Management, votre partenaire de confiance dans l\'industrie de la mode.',
          keywords: ['à propos', 'histoire', 'mission', 'équipe'],
          canonicalUrl: 'https://perfectmodels.com/about',
          robots: 'index, follow'
        },
        status: 'published',
        createdAt: '2024-01-14T15:30:00Z',
        updatedAt: '2024-01-14T15:30:00Z',
        author: 'Admin',
        category: 'about',
        tags: ['entreprise', 'équipe'],
        featuredImage: '/api/media/about-image.jpg',
        excerpt: 'Présentation de l\'agence'
      }
    ];

    const mockTemplates: CMSTemplate[] = [
      {
        id: '1',
        name: 'Page d\'accueil Hero',
        description: 'Template avec section hero et call-to-action',
        thumbnail: '/api/templates/hero-homepage.jpg',
        category: 'homepage',
        content: [],
        sections: [],
        seo: {
          title: 'Titre de la page',
          description: 'Description de la page',
          keywords: []
        }
      },
      {
        id: '2',
        name: 'Page de service',
        description: 'Template pour présenter un service',
        thumbnail: '/api/templates/service-page.jpg',
        category: 'service',
        content: [],
        sections: [],
        seo: {
          title: 'Service - Titre',
          description: 'Description du service',
          keywords: []
        }
      }
    ];

    setPages(mockPages);
    setTemplates(mockTemplates);
  }, []);

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || page.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || page.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCreatePage = () => {
    const newPage: CMSPage = {
      id: `page-${Date.now()}`,
      title: 'Nouvelle page',
      slug: 'nouvelle-page',
      content: [],
      sections: [],
      seo: {
        title: '',
        description: '',
        keywords: [],
        canonicalUrl: '',
        robots: 'index, follow'
      },
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'Admin',
      category: 'page',
      tags: []
    };
    setPages(prev => [newPage, ...prev]);
    setSelectedPage(newPage);
    setIsCreating(true);
  };

  const handleEditPage = (page: CMSPage) => {
    setSelectedPage(page);
    setIsCreating(false);
  };

  const handleSavePage = (updatedPage: CMSPage) => {
    setPages(prev => prev.map(page => page.id === updatedPage.id ? updatedPage : page));
    setSelectedPage(null);
    setIsCreating(false);
  };

  const handleDeletePage = (pageId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) {
      setPages(prev => prev.filter(page => page.id !== pageId));
      if (selectedPage?.id === pageId) {
        setSelectedPage(null);
      }
    }
  };

  const handleDuplicatePage = (page: CMSPage) => {
    const duplicatedPage: CMSPage = {
      ...page,
      id: `page-${Date.now()}`,
      title: `${page.title} (Copie)`,
      slug: `${page.slug}-copie`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPages(prev => [duplicatedPage, ...prev]);
  };

  const handleApplyTemplate = (template: CMSTemplate) => {
    if (selectedPage) {
      const updatedPage: CMSPage = {
        ...selectedPage,
        content: template.content,
        sections: template.sections,
        seo: { ...selectedPage.seo, ...template.seo }
      };
      handleSavePage(updatedPage);
    }
  };

  const getStatusColor = (status: CMSPage['status']) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400';
      case 'archived': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusLabel = (status: CMSPage['status']) => {
    switch (status) {
      case 'published': return 'Publié';
      case 'draft': return 'Brouillon';
      case 'archived': return 'Archivé';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (selectedPage) {
    return (
      <div className="bg-pm-dark text-pm-off-white min-h-screen">
        <SEO title="Éditeur CMS" noIndex />
        
        {/* Header */}
        <div className="bg-black/30 border-b border-pm-gold/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedPage(null)}
                className="p-2 bg-pm-gold/20 text-pm-gold rounded hover:bg-pm-gold/30"
              >
                ← Retour
              </button>
              <div>
                <h1 className="text-xl font-bold text-pm-gold">{selectedPage.title}</h1>
                <p className="text-sm text-pm-off-white/70">
                  {selectedPage.slug} • {getStatusLabel(selectedPage.status)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPageBuilder(true)}
                className="flex items-center gap-2 px-4 py-2 bg-pm-gold/20 text-pm-gold rounded hover:bg-pm-gold/30"
              >
                <PaintBrushIcon className="w-4 h-4" />
                Constructeur
              </button>
              <button
                onClick={() => handleSavePage(selectedPage)}
                className="px-4 py-2 bg-pm-gold text-black rounded hover:bg-pm-gold/90"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-black/20 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-pm-gold mb-4">Contenu</h2>
                <ContentBuilder
                  initialContent={selectedPage.content}
                  onContentChange={(content) => setSelectedPage({...selectedPage, content})}
                  onSave={() => handleSavePage(selectedPage)}
                />
              </div>

              <div className="bg-black/20 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-pm-gold mb-4">Sections de page</h2>
                <PageBuilder
                  initialSections={selectedPage.sections}
                  onSectionsChange={(sections) => setSelectedPage({...selectedPage, sections})}
                  onSave={() => handleSavePage(selectedPage)}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* SEO Tools */}
              <div className="bg-black/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-pm-gold mb-4">SEO</h3>
                <SEOTools
                  initialData={selectedPage.seo}
                  onDataChange={(seo) => setSelectedPage({...selectedPage, seo})}
                  content={selectedPage.content.map(block => block.content.text || '').join(' ')}
                  url={`https://perfectmodels.com/${selectedPage.slug}`}
                />
              </div>

              {/* Page Settings */}
              <div className="bg-black/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-pm-gold mb-4">Paramètres</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
                      Titre
                    </label>
                    <input
                      type="text"
                      value={selectedPage.title}
                      onChange={(e) => setSelectedPage({...selectedPage, title: e.target.value})}
                      className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={selectedPage.slug}
                      onChange={(e) => setSelectedPage({...selectedPage, slug: e.target.value})}
                      className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
                      Statut
                    </label>
                    <select
                      value={selectedPage.status}
                      onChange={(e) => setSelectedPage({...selectedPage, status: e.target.value as any})}
                      className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
                    >
                      <option value="draft">Brouillon</option>
                      <option value="published">Publié</option>
                      <option value="archived">Archivé</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
                      Catégorie
                    </label>
                    <input
                      type="text"
                      value={selectedPage.category}
                      onChange={(e) => setSelectedPage({...selectedPage, category: e.target.value})}
                      className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
                      Tags (séparés par des virgules)
                    </label>
                    <input
                      type="text"
                      value={selectedPage.tags.join(', ')}
                      onChange={(e) => setSelectedPage({...selectedPage, tags: e.target.value.split(',').map(tag => tag.trim())})}
                      className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pm-dark text-pm-off-white min-h-screen">
      <SEO title="CMS - Administration" noIndex />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-pm-gold">CMS - Gestion de contenu</h1>
            <p className="text-pm-off-white/70 mt-2">Gérez vos pages, médias et contenu</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowMediaManager(true)}
              className="flex items-center gap-2 px-4 py-2 bg-pm-gold/20 text-pm-gold rounded hover:bg-pm-gold/30"
            >
              <PhotoIcon className="w-5 h-5" />
              Médias
            </button>
            <button
              onClick={handleCreatePage}
              className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-black rounded hover:bg-pm-gold/90"
            >
              <PlusIcon className="w-5 h-5" />
              Nouvelle page
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'pages', label: 'Pages', icon: DocumentTextIcon },
            { id: 'templates', label: 'Templates', icon: SparklesIcon },
            { id: 'seo', label: 'SEO', icon: ChartBarIcon },
            { id: 'settings', label: 'Paramètres', icon: Cog6ToothIcon }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                activeTab === tab.id
                  ? 'bg-pm-gold text-black'
                  : 'bg-pm-gold/20 text-pm-gold hover:bg-pm-gold/30'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'pages' && (
          <div>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Rechercher des pages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
              >
                <option value="all">Tous les statuts</option>
                <option value="published">Publié</option>
                <option value="draft">Brouillon</option>
                <option value="archived">Archivé</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
              >
                <option value="all">Toutes les catégories</option>
                <option value="homepage">Page d'accueil</option>
                <option value="about">À propos</option>
                <option value="service">Service</option>
                <option value="page">Page</option>
              </select>
            </div>

            {/* Pages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPages.map(page => (
                <div key={page.id} className="bg-black/20 rounded-lg p-6 hover:bg-black/30 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-pm-gold mb-1">{page.title}</h3>
                      <p className="text-sm text-pm-off-white/70 mb-2">/{page.slug}</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(page.status)}`}>
                        {getStatusLabel(page.status)}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditPage(page)}
                        className="p-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"
                        title="Éditer"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicatePage(page)}
                        className="p-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
                        title="Dupliquer"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePage(page.id)}
                        className="p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                        title="Supprimer"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-pm-off-white/70">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      {page.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      {formatDate(page.updatedAt)}
                    </div>
                    <div className="flex items-center gap-2">
                      <TagIcon className="w-4 h-4" />
                      {page.tags.join(', ')}
                    </div>
                  </div>
                  
                  {page.excerpt && (
                    <p className="text-sm text-pm-off-white/60 mt-4 line-clamp-2">
                      {page.excerpt}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div>
            <h2 className="text-xl font-semibold text-pm-gold mb-6">Templates disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => (
                <div key={template.id} className="bg-black/20 rounded-lg p-6 hover:bg-black/30 transition-colors">
                  <div className="aspect-video bg-black/30 rounded mb-4 flex items-center justify-center">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-pm-gold mb-2">{template.name}</h3>
                  <p className="text-sm text-pm-off-white/70 mb-4">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-pm-gold/70 bg-pm-gold/10 px-2 py-1 rounded">
                      {template.category}
                    </span>
                    <button
                      onClick={() => handleApplyTemplate(template)}
                      className="px-3 py-1 bg-pm-gold text-black rounded hover:bg-pm-gold/90 text-sm"
                    >
                      Utiliser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div>
            <h2 className="text-xl font-semibold text-pm-gold mb-6">Analyse SEO globale</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-black/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-pm-gold mb-2">Pages indexées</h3>
                <div className="text-3xl font-bold text-green-400">{pages.filter(p => p.status === 'published').length}</div>
                <p className="text-sm text-pm-off-white/70">sur {pages.length} pages</p>
              </div>
              <div className="bg-black/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-pm-gold mb-2">Score SEO moyen</h3>
                <div className="text-3xl font-bold text-yellow-400">78/100</div>
                <p className="text-sm text-pm-off-white/70">Score global</p>
              </div>
              <div className="bg-black/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-pm-gold mb-2">Mots-clés</h3>
                <div className="text-3xl font-bold text-blue-400">
                  {pages.reduce((acc, page) => acc + page.seo.keywords.length, 0)}
                </div>
                <p className="text-sm text-pm-off-white/70">mots-clés uniques</p>
              </div>
            </div>
            
            <div className="bg-black/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-pm-gold mb-4">Recommandations SEO</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-pm-off-white">Optimisez les balises meta de vos pages</p>
                    <p className="text-sm text-pm-off-white/70">3 pages n'ont pas de description optimisée</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-pm-off-white">Ajoutez des images alt text</p>
                    <p className="text-sm text-pm-off-white/70">Améliorez l'accessibilité et le SEO</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-semibold text-pm-gold mb-6">Paramètres CMS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-pm-gold mb-4">Général</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
                      Nom du site
                    </label>
                    <input
                      type="text"
                      defaultValue="Perfect Models Management"
                      className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
                      URL du site
                    </label>
                    <input
                      type="url"
                      defaultValue="https://perfectmodels.com"
                      className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-pm-gold mb-4">SEO</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      placeholder="GA-XXXXXXXXX"
                      className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
                      Google Search Console
                    </label>
                    <input
                      type="text"
                      placeholder="XXXXXXXXXXXX"
                      className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Media Manager Modal */}
      {showMediaManager && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-pm-dark rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-pm-gold">Gestionnaire de médias</h2>
                <button
                  onClick={() => setShowMediaManager(false)}
                  className="p-2 bg-gray-500/20 text-gray-300 rounded hover:bg-gray-500/30"
                >
                  ×
                </button>
              </div>
              <MediaManager />
            </div>
          </div>
        </div>
      )}

      {/* Page Builder Modal */}
      {showPageBuilder && selectedPage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-pm-dark rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-pm-gold">Constructeur de pages</h2>
                <button
                  onClick={() => setShowPageBuilder(false)}
                  className="p-2 bg-gray-500/20 text-gray-300 rounded hover:bg-gray-500/30"
                >
                  ×
                </button>
              </div>
              <PageBuilder
                initialSections={selectedPage.sections}
                onSectionsChange={(sections) => setSelectedPage({...selectedPage, sections})}
                onSave={() => {
                  handleSavePage(selectedPage);
                  setShowPageBuilder(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCMS;