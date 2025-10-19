import React, { useState, useRef, useCallback } from 'react';
import { 
  PlusIcon, 
  TrashIcon, 
  PencilIcon, 
  EyeIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  CodeBracketIcon,
  ListBulletIcon,
  QuoteIcon,
  TableCellsIcon,
  LinkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export interface ContentBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'image' | 'video' | 'code' | 'list' | 'quote' | 'table' | 'button' | 'spacer' | 'divider';
  content: any;
  styles?: Record<string, any>;
  order: number;
}

interface ContentBuilderProps {
  initialContent?: ContentBlock[];
  onContentChange: (content: ContentBlock[]) => void;
  onSave?: () => void;
  previewMode?: boolean;
}

const ContentBuilder: React.FC<ContentBuilderProps> = ({
  initialContent = [],
  onContentChange,
  onSave,
  previewMode = false
}) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialContent);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(previewMode);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const addBlock = useCallback((type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: getDefaultContent(type),
      order: blocks.length,
      styles: getDefaultStyles(type)
    };
    
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    onContentChange(newBlocks);
  }, [blocks, onContentChange]);

  const updateBlock = useCallback((id: string, updates: Partial<ContentBlock>) => {
    const newBlocks = blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    );
    setBlocks(newBlocks);
    onContentChange(newBlocks);
  }, [blocks, onContentChange]);

  const deleteBlock = useCallback((id: string) => {
    const newBlocks = blocks.filter(block => block.id !== id);
    setBlocks(newBlocks);
    onContentChange(newBlocks);
    if (selectedBlock === id) setSelectedBlock(null);
  }, [blocks, onContentChange, selectedBlock]);

  const moveBlock = useCallback((id: string, direction: 'up' | 'down') => {
    const currentIndex = blocks.findIndex(block => block.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    [newBlocks[currentIndex], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[currentIndex]];
    
    // Update order
    newBlocks.forEach((block, index) => {
      block.order = index;
    });
    
    setBlocks(newBlocks);
    onContentChange(newBlocks);
  }, [blocks, onContentChange]);

  const getDefaultContent = (type: ContentBlock['type']) => {
    switch (type) {
      case 'heading': return { text: 'Nouveau titre', level: 2 };
      case 'paragraph': return { text: 'Nouveau paragraphe' };
      case 'image': return { src: '', alt: '', caption: '' };
      case 'video': return { src: '', title: '', description: '' };
      case 'code': return { language: 'javascript', code: '// Votre code ici' };
      case 'list': return { items: ['Élément 1', 'Élément 2'], type: 'bullet' };
      case 'quote': return { text: 'Citation', author: '' };
      case 'table': return { headers: ['Colonne 1', 'Colonne 2'], rows: [['Donnée 1', 'Donnée 2']] };
      case 'button': return { text: 'Bouton', url: '', style: 'primary' };
      case 'spacer': return { height: 20 };
      case 'divider': return { style: 'solid' };
      default: return {};
    }
  };

  const getDefaultStyles = (type: ContentBlock['type']) => {
    switch (type) {
      case 'heading': return { fontSize: '2xl', fontWeight: 'bold', color: 'pm-gold' };
      case 'paragraph': return { fontSize: 'base', lineHeight: 'relaxed' };
      case 'image': return { width: 'full', borderRadius: 'lg' };
      case 'button': return { backgroundColor: 'pm-gold', textColor: 'white', padding: 'md' };
      default: return {};
    }
  };

  const renderBlock = (block: ContentBlock) => {
    if (isPreviewMode) {
      return <BlockPreview block={block} />;
    }

    return (
      <div
        key={block.id}
        className={`relative group border-2 rounded-lg p-4 mb-4 transition-all ${
          selectedBlock === block.id 
            ? 'border-pm-gold bg-pm-gold/10' 
            : 'border-transparent hover:border-pm-gold/50'
        }`}
        onClick={() => setSelectedBlock(block.id)}
      >
        <BlockEditor block={block} onUpdate={(updates) => updateBlock(block.id, updates)} />
        
        {/* Block Controls */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveBlock(block.id, 'up');
            }}
            className="p-1 bg-black/50 rounded text-pm-gold hover:bg-pm-gold/20"
            disabled={blocks.findIndex(b => b.id === block.id) === 0}
          >
            <ArrowUpIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveBlock(block.id, 'down');
            }}
            className="p-1 bg-black/50 rounded text-pm-gold hover:bg-pm-gold/20"
            disabled={blocks.findIndex(b => b.id === block.id) === blocks.length - 1}
          >
            <ArrowDownIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteBlock(block.id);
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
    <div className="content-builder">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 p-4 bg-black/30 rounded-lg">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-pm-gold">Constructeur de Contenu</h3>
          <div className="flex gap-2">
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
      </div>

      {/* Block Library */}
      {!isPreviewMode && (
        <div className="mb-6 p-4 bg-black/20 rounded-lg">
          <h4 className="text-sm font-medium text-pm-off-white/80 mb-3">Ajouter un bloc</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {[
              { type: 'heading', icon: DocumentTextIcon, label: 'Titre' },
              { type: 'paragraph', icon: DocumentTextIcon, label: 'Texte' },
              { type: 'image', icon: PhotoIcon, label: 'Image' },
              { type: 'video', icon: VideoCameraIcon, label: 'Vidéo' },
              { type: 'code', icon: CodeBracketIcon, label: 'Code' },
              { type: 'list', icon: ListBulletIcon, label: 'Liste' },
              { type: 'quote', icon: QuoteIcon, label: 'Citation' },
              { type: 'table', icon: TableCellsIcon, label: 'Tableau' },
              { type: 'button', icon: LinkIcon, label: 'Bouton' },
              { type: 'spacer', icon: ArrowUpIcon, label: 'Espace' },
              { type: 'divider', icon: ArrowDownIcon, label: 'Séparateur' },
            ].map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => addBlock(type as ContentBlock['type'])}
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
      <div className="min-h-[400px] p-4 bg-black/10 rounded-lg">
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-pm-off-white/50">
            <SparklesIcon className="w-12 h-12 mb-4" />
            <p className="text-lg">Commencez par ajouter un bloc de contenu</p>
            <p className="text-sm">Utilisez les boutons ci-dessus pour créer votre contenu</p>
          </div>
        ) : (
          <div className="space-y-4">
            {blocks.map(renderBlock)}
          </div>
        )}
      </div>
    </div>
  );
};

// Block Editor Component
const BlockEditor: React.FC<{ 
  block: ContentBlock; 
  onUpdate: (updates: Partial<ContentBlock>) => void 
}> = ({ block, onUpdate }) => {
  const updateContent = (content: any) => {
    onUpdate({ content: { ...block.content, ...content } });
  };

  const updateStyles = (styles: any) => {
    onUpdate({ styles: { ...block.styles, ...styles } });
  };

  switch (block.type) {
    case 'heading':
      return (
        <div>
          <input
            type="text"
            value={block.content.text}
            onChange={(e) => updateContent({ text: e.target.value })}
            className="w-full bg-transparent text-2xl font-bold text-pm-gold border-none outline-none"
            placeholder="Titre..."
          />
          <select
            value={block.content.level}
            onChange={(e) => updateContent({ level: parseInt(e.target.value) })}
            className="mt-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded px-2 py-1"
          >
            <option value={1}>H1</option>
            <option value={2}>H2</option>
            <option value={3}>H3</option>
            <option value={4}>H4</option>
          </select>
        </div>
      );

    case 'paragraph':
      return (
        <textarea
          value={block.content.text}
          onChange={(e) => updateContent({ text: e.target.value })}
          className="w-full bg-transparent text-pm-off-white border-none outline-none resize-none"
          placeholder="Votre texte..."
          rows={3}
        />
      );

    case 'image':
      return (
        <div>
          <input
            type="url"
            value={block.content.src}
            onChange={(e) => updateContent({ src: e.target.value })}
            className="w-full bg-black/50 text-pm-off-white border border-pm-gold/30 rounded px-3 py-2 mb-2"
            placeholder="URL de l'image..."
          />
          <input
            type="text"
            value={block.content.alt}
            onChange={(e) => updateContent({ alt: e.target.value })}
            className="w-full bg-black/50 text-pm-off-white border border-pm-gold/30 rounded px-3 py-2 mb-2"
            placeholder="Texte alternatif..."
          />
          <input
            type="text"
            value={block.content.caption}
            onChange={(e) => updateContent({ caption: e.target.value })}
            className="w-full bg-black/50 text-pm-off-white border border-pm-gold/30 rounded px-3 py-2"
            placeholder="Légende..."
          />
          {block.content.src && (
            <img
              src={block.content.src}
              alt={block.content.alt}
              className="mt-4 max-w-full h-auto rounded-lg"
            />
          )}
        </div>
      );

    case 'button':
      return (
        <div>
          <input
            type="text"
            value={block.content.text}
            onChange={(e) => updateContent({ text: e.target.value })}
            className="w-full bg-black/50 text-pm-off-white border border-pm-gold/30 rounded px-3 py-2 mb-2"
            placeholder="Texte du bouton..."
          />
          <input
            type="url"
            value={block.content.url}
            onChange={(e) => updateContent({ url: e.target.value })}
            className="w-full bg-black/50 text-pm-off-white border border-pm-gold/30 rounded px-3 py-2"
            placeholder="URL de destination..."
          />
        </div>
      );

    default:
      return (
        <div className="p-4 bg-black/20 rounded text-pm-off-white/70">
          <p>Éditeur pour {block.type} - En développement</p>
        </div>
      );
  }
};

// Block Preview Component
const BlockPreview: React.FC<{ block: ContentBlock }> = ({ block }) => {
  switch (block.type) {
    case 'heading':
      const HeadingTag = `h${block.content.level}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag className="text-pm-gold font-bold mb-4">
          {block.content.text}
        </HeadingTag>
      );

    case 'paragraph':
      return (
        <p className="text-pm-off-white/80 mb-4 leading-relaxed">
          {block.content.text}
        </p>
      );

    case 'image':
      return (
        <figure className="mb-4">
          <img
            src={block.content.src}
            alt={block.content.alt}
            className="w-full h-auto rounded-lg"
          />
          {block.content.caption && (
            <figcaption className="text-sm text-pm-off-white/60 mt-2 text-center">
              {block.content.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'button':
      return (
        <div className="mb-4">
          <a
            href={block.content.url}
            className="inline-block bg-pm-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-pm-gold/90 transition-colors"
          >
            {block.content.text}
          </a>
        </div>
      );

    case 'spacer':
      return <div style={{ height: block.content.height }} className="mb-4" />;

    case 'divider':
      return <hr className="border-pm-gold/30 my-4" />;

    default:
      return (
        <div className="p-4 bg-black/20 rounded text-pm-off-white/70 mb-4">
          <p>Aperçu pour {block.type} - En développement</p>
        </div>
      );
  }
};

export default ContentBuilder;