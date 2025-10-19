import React, { useState, useCallback } from 'react';
import {
  PlusIcon,
  EyeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  CodeBracketIcon,
  ListBulletIcon,
  QuoteIcon,
  TableCellsIcon,
  LinkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TrashIcon,
  PencilIcon,
  SparklesIcon,
  PaintBrushIcon,
  CursorArrowRaysIcon
} from '@heroicons/react/24/outline';
import ContentBuilder, { ContentBlock } from './ContentBuilder';

export interface PageSection {
  id: string;
  name: string;
  type: 'hero' | 'content' | 'gallery' | 'testimonials' | 'contact' | 'custom';
  content: ContentBlock[];
  styles: {
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    backgroundImage?: string;
    textAlign?: 'left' | 'center' | 'right';
    [key: string]: any;
  };
  order: number;
  isVisible: boolean;
}

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  sections: PageSection[];
  category: 'landing' | 'about' | 'services' | 'portfolio' | 'contact' | 'blog';
}

interface PageBuilderProps {
  initialSections?: PageSection[];
  onSectionsChange: (sections: PageSection[]) => void;
  onSave?: () => void;
  previewMode?: boolean;
}

const PageBuilder: React.FC<PageBuilderProps> = ({
  initialSections = [],
  onSectionsChange,
  onSave,
  previewMode = false
}) => {
  const [sections, setSections] = useState<PageSection[]>(initialSections);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(previewMode);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);

  const templates: PageTemplate[] = [
    {
      id: 'hero-landing',
      name: 'Page d\'accueil Hero',
      description: 'Section hero avec titre, sous-titre et bouton d\'action',
      thumbnail: '/api/templates/hero-landing.jpg',
      category: 'landing',
      sections: [
        {
          id: 'hero-1',
          name: 'Section Hero',
          type: 'hero',
          content: [
            {
              id: 'hero-title',
              type: 'heading',
              content: { text: 'Bienvenue chez Perfect Models', level: 1 },
              styles: { fontSize: '5xl', fontWeight: 'bold', color: 'pm-gold' },
              order: 0
            },
            {
              id: 'hero-subtitle',
              type: 'paragraph',
              content: { text: 'L\'agence de mannequins de référence' },
              styles: { fontSize: 'xl', color: 'pm-off-white' },
              order: 1
            },
            {
              id: 'hero-button',
              type: 'button',
              content: { text: 'Découvrir', url: '/models' },
              styles: { backgroundColor: 'pm-gold', textColor: 'black' },
              order: 2
            }
          ],
          styles: {
            backgroundColor: 'pm-dark',
            padding: 'py-20',
            textAlign: 'center',
            backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
          },
          order: 0,
          isVisible: true
        }
      ]
    },
    {
      id: 'about-page',
      name: 'Page À propos',
      description: 'Page complète avec sections texte, images et témoignages',
      thumbnail: '/api/templates/about-page.jpg',
      category: 'about',
      sections: [
        {
          id: 'about-intro',
          name: 'Introduction',
          type: 'content',
          content: [
            {
              id: 'about-title',
              type: 'heading',
              content: { text: 'À propos de nous', level: 2 },
              styles: { fontSize: '3xl', fontWeight: 'bold', color: 'pm-gold' },
              order: 0
            },
            {
              id: 'about-text',
              type: 'paragraph',
              content: { text: 'Notre histoire et notre mission...' },
              styles: { fontSize: 'lg', lineHeight: 'relaxed' },
              order: 1
            }
          ],
          styles: { padding: 'py-16', backgroundColor: 'pm-dark' },
          order: 0,
          isVisible: true
        }
      ]
    }
  ];

  const addSection = useCallback((type: PageSection['type']) => {
    const newSection: PageSection = {
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `Section ${type}`,
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
      order: sections.length,
      isVisible: true
    };
    
    const newSections = [...sections, newSection];
    setSections(newSections);
    onSectionsChange(newSections);
  }, [sections, onSectionsChange]);

  const updateSection = useCallback((id: string, updates: Partial<PageSection>) => {
    const newSections = sections.map(section => 
      section.id === id ? { ...section, ...updates } : section
    );
    setSections(newSections);
    onSectionsChange(newSections);
  }, [sections, onSectionsChange]);

  const deleteSection = useCallback((id: string) => {
    const newSections = sections.filter(section => section.id !== id);
    setSections(newSections);
    onSectionsChange(newSections);
    if (selectedSection === id) setSelectedSection(null);
  }, [sections, onSectionsChange, selectedSection]);

  const moveSection = useCallback((id: string, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(section => section.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const newSections = [...sections];
    [newSections[currentIndex], newSections[newIndex]] = [newSections[newIndex], newSections[currentIndex]];
    
    // Update order
    newSections.forEach((section, index) => {
      section.order = index;
    });
    
    setSections(newSections);
    onSectionsChange(newSections);
  }, [sections, onSectionsChange]);

  const applyTemplate = useCallback((template: PageTemplate) => {
    setSections(template.sections);
    onSectionsChange(template.sections);
    setShowTemplates(false);
  }, [onSectionsChange]);

  const getDefaultContent = (type: PageSection['type']): ContentBlock[] => {
    switch (type) {
      case 'hero':
        return [
          {
            id: `hero-title-${Date.now()}`,
            type: 'heading',
            content: { text: 'Titre principal', level: 1 },
            styles: { fontSize: '4xl', fontWeight: 'bold', color: 'pm-gold' },
            order: 0
          },
          {
            id: `hero-subtitle-${Date.now()}`,
            type: 'paragraph',
            content: { text: 'Sous-titre descriptif' },
            styles: { fontSize: 'lg', color: 'pm-off-white' },
            order: 1
          }
        ];
      case 'content':
        return [
          {
            id: `content-text-${Date.now()}`,
            type: 'paragraph',
            content: { text: 'Contenu de la section...' },
            styles: { fontSize: 'base', lineHeight: 'relaxed' },
            order: 0
          }
        ];
      case 'gallery':
        return [
          {
            id: `gallery-title-${Date.now()}`,
            type: 'heading',
            content: { text: 'Galerie', level: 2 },
            styles: { fontSize: '2xl', fontWeight: 'bold', color: 'pm-gold' },
            order: 0
          }
        ];
      default:
        return [];
    }
  };

  const getDefaultStyles = (type: PageSection['type']) => {
    switch (type) {
      case 'hero':
        return {
          backgroundColor: 'pm-dark',
          padding: 'py-20',
          textAlign: 'center',
          backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
        };
      case 'content':
        return {
          backgroundColor: 'white',
          padding: 'py-16',
          textAlign: 'left'
        };
      case 'gallery':
        return {
          backgroundColor: 'pm-dark',
          padding: 'py-16',
          textAlign: 'center'
        };
      default:
        return {
          backgroundColor: 'pm-dark',
          padding: 'py-16',
          textAlign: 'left'
        };
    }
  };

  const renderSection = (section: PageSection) => {
    if (isPreviewMode) {
      return <SectionPreview section={section} device={previewDevice} />;
    }

    return (
      <div
        key={section.id}
        className={`relative group border-2 rounded-lg p-4 mb-4 transition-all ${
          selectedSection === section.id 
            ? 'border-pm-gold bg-pm-gold/10' 
            : 'border-transparent hover:border-pm-gold/50'
        }`}
        onClick={() => setSelectedSection(section.id)}
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-pm-gold">{section.name}</h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-pm-off-white/50 bg-black/30 px-2 py-1 rounded">
              {section.type}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingSection(section);
              }}
              className="p-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"
            >
              <Cog6ToothIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <ContentBuilder
          initialContent={section.content}
          onContentChange={(content) => updateSection(section.id, { content })}
          previewMode={false}
        />

        {/* Section Controls */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveSection(section.id, 'up');
            }}
            className="p-1 bg-black/50 rounded text-pm-gold hover:bg-pm-gold/20"
            disabled={sections.findIndex(s => s.id === section.id) === 0}
          >
            <ArrowUpIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveSection(section.id, 'down');
            }}
            className="p-1 bg-black/50 rounded text-pm-gold hover:bg-pm-gold/20"
            disabled={sections.findIndex(s => s.id === section.id) === sections.length - 1}
          >
            <ArrowDownIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteSection(section.id);
            }}
            className="p-1 bg-red-500/20 rounded text-red-400 hover:bg-red-500/30"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="page-builder">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 p-4 bg-black/30 rounded-lg">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-pm-gold">Constructeur de Pages</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTemplates(true)}
              className="px-3 py-1 bg-pm-gold/20 text-pm-gold rounded hover:bg-pm-gold/30"
            >
              <SparklesIcon className="w-4 h-4 inline mr-1" />
              Templates
            </button>
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`px-3 py-1 rounded text-sm ${
                isPreviewMode 
                  ? 'bg-pm-gold text-black' 
                  : 'bg-pm-gold/20 text-pm-gold hover:bg-pm-gold/30'
              }`}
            >
              <EyeIcon className="w-4 h-4 inline mr-1" />
              {isPreviewMode ? 'Éditer' : 'Aperçu'}
            </button>
            {onSave && (
              <button
                onClick={onSave}
                className="px-4 py-2 bg-pm-gold text-black rounded hover:bg-pm-gold/90"
              >
                Sauvegarder
              </button>
            )}
          </div>
        </div>

        {/* Device Preview Controls */}
        {isPreviewMode && (
          <div className="flex gap-2">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`p-2 rounded ${previewDevice === 'desktop' ? 'bg-pm-gold text-black' : 'bg-pm-gold/20 text-pm-gold'}`}
            >
              <ComputerDesktopIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPreviewDevice('tablet')}
              className={`p-2 rounded ${previewDevice === 'tablet' ? 'bg-pm-gold text-black' : 'bg-pm-gold/20 text-pm-gold'}`}
            >
              <DeviceTabletIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-2 rounded ${previewDevice === 'mobile' ? 'bg-pm-gold text-black' : 'bg-pm-gold/20 text-pm-gold'}`}
            >
              <DevicePhoneMobileIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Section Library */}
      {!isPreviewMode && (
        <div className="mb-6 p-4 bg-black/20 rounded-lg">
          <h4 className="text-sm font-medium text-pm-off-white/80 mb-3">Ajouter une section</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {[
              { type: 'hero', icon: CursorArrowRaysIcon, label: 'Hero' },
              { type: 'content', icon: DocumentTextIcon, label: 'Contenu' },
              { type: 'gallery', icon: PhotoIcon, label: 'Galerie' },
              { type: 'testimonials', icon: QuoteIcon, label: 'Témoignages' },
              { type: 'contact', icon: LinkIcon, label: 'Contact' },
              { type: 'custom', icon: CodeBracketIcon, label: 'Personnalisé' },
            ].map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => addSection(type as PageSection['type'])}
                className="flex flex-col items-center gap-2 p-3 bg-black/30 rounded hover:bg-pm-gold/20 text-pm-off-white/70 hover:text-pm-gold transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className={`min-h-[400px] p-4 bg-black/10 rounded-lg ${
        isPreviewMode ? 'overflow-x-auto' : ''
      }`}>
        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-pm-off-white/50">
            <PaintBrushIcon className="w-12 h-12 mb-4" />
            <p className="text-lg">Commencez par ajouter une section</p>
            <p className="text-sm">Utilisez les boutons ci-dessus ou choisissez un template</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map(renderSection)}
          </div>
        )}
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-pm-dark p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-pm-gold mb-4">Choisir un template</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map(template => (
                <div
                  key={template.id}
                  className="border border-pm-gold/30 rounded-lg p-4 hover:border-pm-gold/50 transition-colors cursor-pointer"
                  onClick={() => applyTemplate(template)}
                >
                  <div className="aspect-video bg-black/30 rounded mb-3 flex items-center justify-center">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <h4 className="font-semibold text-pm-gold mb-1">{template.name}</h4>
                  <p className="text-sm text-pm-off-white/70 mb-2">{template.description}</p>
                  <span className="text-xs text-pm-gold/70 bg-pm-gold/10 px-2 py-1 rounded">
                    {template.category}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowTemplates(false)}
                className="px-4 py-2 bg-gray-500/20 text-gray-300 rounded hover:bg-gray-500/30"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Editor Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-pm-dark p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-pm-gold mb-4">Éditer la section</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-pm-off-white/70 mb-1">Nom</label>
                <input
                  type="text"
                  value={editingSection.name}
                  onChange={(e) => setEditingSection({...editingSection, name: e.target.value})}
                  className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-pm-off-white/70 mb-1">Couleur de fond</label>
                <input
                  type="color"
                  value={editingSection.styles.backgroundColor || '#1a1a1a'}
                  onChange={(e) => setEditingSection({
                    ...editingSection, 
                    styles: {...editingSection.styles, backgroundColor: e.target.value}
                  })}
                  className="w-full h-10 bg-black/50 border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-pm-off-white/70 mb-1">Alignement du texte</label>
                <select
                  value={editingSection.styles.textAlign || 'left'}
                  onChange={(e) => setEditingSection({
                    ...editingSection, 
                    styles: {...editingSection.styles, textAlign: e.target.value as any}
                  })}
                  className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
                >
                  <option value="left">Gauche</option>
                  <option value="center">Centre</option>
                  <option value="right">Droite</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 bg-gray-500/20 text-gray-300 rounded hover:bg-gray-500/30"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  updateSection(editingSection.id, editingSection);
                  setEditingSection(null);
                }}
                className="px-4 py-2 bg-pm-gold text-black rounded hover:bg-pm-gold/90"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Section Preview Component
const SectionPreview: React.FC<{ section: PageSection; device: 'desktop' | 'tablet' | 'mobile' }> = ({ 
  section, 
  device 
}) => {
  const getDeviceWidth = () => {
    switch (device) {
      case 'mobile': return 'w-80';
      case 'tablet': return 'w-96';
      case 'desktop': return 'w-full';
      default: return 'w-full';
    }
  };

  return (
    <div className={`${getDeviceWidth()} mx-auto`}>
      <div
        className="rounded-lg overflow-hidden"
        style={{
          backgroundColor: section.styles.backgroundColor,
          padding: section.styles.padding,
          textAlign: section.styles.textAlign,
          backgroundImage: section.styles.backgroundImage
        }}
      >
        {section.content.map(block => (
          <div key={block.id} className="mb-4">
            {block.type === 'heading' && (
              <h1 className="text-pm-gold font-bold">
                {block.content.text}
              </h1>
            )}
            {block.type === 'paragraph' && (
              <p className="text-pm-off-white/80">
                {block.content.text}
              </p>
            )}
            {block.type === 'button' && (
              <a
                href={block.content.url}
                className="inline-block bg-pm-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-pm-gold/90 transition-colors"
              >
                {block.content.text}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageBuilder;