
import React, { useState, useEffect } from 'react';
<<<<<<< HEAD:src/pages/admin/AdminMagazine.tsx
import { useData } from '../../contexts/DataContext';
import { Article, ArticleContent } from '../../types';
import SEO from '../../components/SEO';
=======
import { useData } from '../contexts/DataContext';
import { Article, ArticleContent } from '../types';
import SEO from '../components/SEO';
>>>>>>> 95ce282020fa4c741066597c693e1256e3332cb0:pages/AdminMagazine.tsx
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon, StarIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ImageUploader from '../components/ImageUploader';
import ArticleGenerator from '../components/ArticleGenerator';
import AIAssistant from '../components/AIAssistant';
import ArticlePreview from '../components/ArticlePreview';


const AdminMagazine: React.FC = () => {
  const { data, saveData, isInitialized } = useData();
  const [localArticles, setLocalArticles] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  useEffect(() => {
    if (data?.articles) {
      setLocalArticles([...data.articles].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, [data?.articles, isInitialized]);
  
  const handleFormSave = async (articleToSave: Article) => {
    if (!data) return;
    let updatedArticles;
    
    if (isCreating) {
        if (!articleToSave.slug) {
            articleToSave.slug = articleToSave.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') + '-' + Date.now();
        }
        updatedArticles = [articleToSave, ...localArticles];
    } else {
        updatedArticles = localArticles.map(a => a.slug === articleToSave.slug ? articleToSave : a);
    }
    
    await saveData({ ...data, articles: updatedArticles });
    alert("Article enregistré avec succès.");

    setEditingArticle(null);
    setIsCreating(false);
  };

  const handleDelete = async (slug: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      if (!data) return;
      const updatedArticles = localArticles.filter(a => a.slug !== slug);
      await saveData({ ...data, articles: updatedArticles });
      alert("Article supprimé avec succès.");
    }
  };

  const handleSetFeatured = async (slugToFeature: string) => {
    if (!data) return;
    const updatedArticles = localArticles.map(article => ({
      ...article,
      isFeatured: article.slug === slugToFeature
    }));
    await saveData({ ...data, articles: updatedArticles });
  };
  
  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingArticle({
      slug: '',
      title: '',
      category: 'Interview',
      excerpt: '',
      imageUrl: '',
      author: 'Focus Model 241',
      date: new Date().toISOString().split('T')[0],
      content: [{ type: 'paragraph', text: '' }],
    });
  };

  const handleArticleGenerated = (generatedData: Partial<Article>) => {
    setIsCreating(true);
    setEditingArticle(prev => ({
        slug: '',
        title: '',
        category: 'Interview',
        excerpt: '',
        imageUrl: '',
        author: 'Focus Model 241',
        date: new Date().toISOString().split('T')[0],
        content: [{ type: 'paragraph', text: '' }],
        ...prev, // Keep any existing data if any
        ...generatedData
    }));
    setIsGeneratorOpen(false);
  };

  if (editingArticle) {
    return <ArticleForm article={editingArticle} onSave={handleFormSave} onCancel={() => {setEditingArticle(null); setIsCreating(false);}} isCreating={isCreating}/>
  }

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Gérer le Magazine" noIndex />
      <div className="container mx-auto px-6">
        <div className="admin-page-header">
            <div>
                 <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Dashboard
                </Link>
                <h1 className="admin-page-title">Gérer le Magazine</h1>
                <p className="admin-page-subtitle">Gérez les articles du magazine en ligne Focus Model 241.</p>
            </div>
            <div className="flex items-center gap-4">
                <button onClick={() => setIsGeneratorOpen(true)} className="action-btn-outline !flex !items-center !gap-2">
                    <SparklesIcon className="w-5 h-5"/> Générer avec IA
                </button>
                 <button onClick={handleStartCreate} className="action-btn !flex !items-center !gap-2">
                    <PlusIcon className="w-5 h-5"/> Ajouter un Article
                </button>
            </div>
        </div>

        <div className="admin-section-wrapper">
          {localArticles.map((article) => (
            <div key={article.slug} className="flex items-center justify-between p-3 border-b border-pm-dark hover:bg-pm-dark/50">
              <div className="flex items-center gap-4">
                {article.isFeatured && <StarIcon className="w-5 h-5 text-pm-gold flex-shrink-0" title="Article à la une"/>}
                <img src={article.imageUrl} alt={article.title} className="w-24 h-16 object-cover rounded hidden sm:block"/>
                <div>
                  <h2 className="font-bold">{article.title}</h2>
                  <p className="text-sm text-pm-off-white/70">{article.category} - {new Date(article.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!article.isFeatured && (
                  <button onClick={() => handleSetFeatured(article.slug)} className="p-2 text-pm-gold/70 hover:text-pm-gold" title="Mettre à la une">
                      <StarIcon className="w-5 h-5"/>
                  </button>
                )}
                <button onClick={() => { setEditingArticle(article); setIsCreating(false); }} className="p-2 text-pm-gold/70 hover:text-pm-gold" title="Modifier"><PencilIcon className="w-5 h-5"/></button>
                <button onClick={() => handleDelete(article.slug)} className="p-2 text-red-500/70 hover:text-red-500" title="Supprimer"><TrashIcon className="w-5 h-5"/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ArticleGenerator isOpen={isGeneratorOpen} onClose={() => setIsGeneratorOpen(false)} onArticleGenerated={handleArticleGenerated} />
    </div>
  );
};


interface ArticleFormProps {
  article: Article;
  onSave: (article: Article) => void;
  onCancel: () => void;
  isCreating: boolean;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ article, onSave, onCancel, isCreating }) => {
    const [formData, setFormData] = useState(article);
    const [contentJson, setContentJson] = useState(JSON.stringify(article.content, null, 2));
    const [isAIOpen, setIsAIOpen] = useState(false);
    const [activeAIField, setActiveAIField] = useState<{ fieldName: string, prompt: string, schema?: any } | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePreview = () => {
        try {
            const parsedContent = JSON.parse(contentJson);
            const currentArticleState = { ...formData, content: parsedContent };
            setFormData(currentArticleState); // Update formData to pass to preview
            setIsPreviewOpen(true);
        } catch (error) {
            alert("Le format JSON du contenu est invalide. Impossible de prévisualiser.");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const parsedContent = JSON.parse(contentJson);
            onSave({ ...formData, content: parsedContent });
        } catch (error) {
            alert("Le format JSON du contenu est invalide.");
        }
    };
    
    const openAIAssistant = (fieldName: string, prompt: string, schema?: any) => {
        setActiveAIField({ fieldName, prompt, schema });
        setIsAIOpen(true);
    };

    const handleAIInsert = (content: string) => {
        if (!activeAIField) return;
        
        if (activeAIField.fieldName === 'content') {
            try {
                const parsed = JSON.parse(content);
                setContentJson(JSON.stringify(parsed, null, 2));
            } catch {
                const newContent = JSON.stringify([{ type: 'paragraph', text: content }], null, 2);
                setContentJson(newContent);
            }
        } else if (activeAIField.fieldName === 'tags') {
            setFormData(prev => ({...prev, tags: content.split(',').map(tag => tag.trim())}));
        }
        else {
            setFormData(prev => ({ ...prev, [activeAIField.fieldName]: content }));
        }
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <div className="container mx-auto px-6 max-w-3xl">
                <button onClick={onCancel} className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour à la liste
                </button>
                <h1 className="admin-page-title mb-8">{isCreating ? 'Nouvel Article' : 'Modifier l\'Article'}</h1>
                <form onSubmit={handleSubmit} className="admin-section-wrapper space-y-6">
                    <FormInput label="Titre" name="title" value={formData.title} onChange={handleChange} onAIAssist={() => openAIAssistant('title', 'Génère 5 titres accrocheurs pour un article de mode.')} />
                    <ImageUploader label="Image de couverture" value={formData.imageUrl} onChange={value => setFormData(p => ({...p, imageUrl: value}))} />
                    <FormSelect label="Catégorie" name="category" value={formData.category} onChange={handleChange}>
                        <option>Interview</option><option>Événement</option><option>Tendance</option><option>Conseils</option><option>Portrait</option>
                    </FormSelect>
                    <FormTextArea label="Extrait (résumé)" name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} onAIAssist={() => openAIAssistant('excerpt', `Rédige un résumé de 2 phrases pour un article intitulé "${formData.title}".`)} />
                    <FormTextArea label="Contenu (JSON)" name="content" value={contentJson} onChange={(e) => setContentJson(e.target.value)} rows={15} onAIAssist={() => openAIAssistant('content', `Rédige un article complet sur "${formData.title}" en respectant le format JSON.`, { type: 'array', items: { type: 'object' }})} />
                    <FormInput label="Tags (séparés par des virgules)" name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''} onChange={(e) => setFormData(p => ({...p, tags: e.target.value.split(',').map(tag => tag.trim())}))} onAIAssist={() => openAIAssistant('tags', `Génère 5 tags SEO pertinents pour un article sur "${formData.title}". Sépare-les par des virgules.`)} />

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="px-6 py-2 bg-pm-dark border border-pm-off-white/50 text-pm-off-white/80 font-bold uppercase tracking-widest text-sm rounded-full hover:border-white">Annuler</button>
                        <button type="button" onClick={handlePreview} className="px-6 py-2 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full hover:bg-pm-gold hover:text-pm-dark">Prévisualiser</button>
                        <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white">Sauvegarder</button>
                    </div>
                </form>
            </div>
            {activeAIField && (
                <AIAssistant 
                    isOpen={isAIOpen}
                    onClose={() => setIsAIOpen(false)}
                    onInsertContent={handleAIInsert}
                    fieldName={activeAIField.fieldName}
                    initialPrompt={activeAIField.prompt}
                    jsonSchema={activeAIField.schema}
                />
            )}
            <ArticlePreviewModal 
                isOpen={isPreviewOpen} 
                onClose={() => setIsPreviewOpen(false)} 
                article={formData} 
            />
        </div>
    );
};

const ArticlePreviewModal: React.FC<{ isOpen: boolean, onClose: () => void, article: Article }> = ({ isOpen, onClose, article }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 flex justify-between items-center border-b border-pm-gold/20 flex-shrink-0">
                    <h2 className="text-2xl font-playfair text-pm-gold">Prévisualisation de l'Article</h2>
                    <button onClick={onClose} className="text-pm-off-white/70 hover:text-white" aria-label="Fermer la prévisualisation"><XMarkIcon className="w-6 h-6"/></button>
                </header>
                <main className="overflow-y-auto flex-grow">
                   <div className="p-4 sm:p-8">
                      <ArticlePreview article={article} />
                   </div>
                </main>
            </div>
        </div>
    );
};


const FormInput: React.FC<{label: string, name: string, value: any, onChange: any, onAIAssist?: () => void}> = ({label, onAIAssist, ...props}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={props.name} className="admin-label !mb-0">{label}</label>
            {onAIAssist && <AIAssistButton onClick={onAIAssist} />}
        </div>
        <input {...props} className="admin-input" />
    </div>
);
const FormTextArea: React.FC<{label: string, name: string, value: any, onChange: any, rows: number, onAIAssist?: () => void}> = ({label, onAIAssist, ...props}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={props.name} className="admin-label !mb-0">{label}</label>
            {onAIAssist && <AIAssistButton onClick={onAIAssist} />}
        </div>
        <textarea {...props} className="admin-input admin-textarea" />
    </div>
);
const FormSelect: React.FC<any> = (props) => (
    <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <select {...props} className="admin-input">{props.children}</select>
    </div>
);
const AIAssistButton: React.FC<{onClick: () => void}> = ({onClick}) => (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1 text-xs text-pm-gold/80 hover:text-pm-gold">
        <SparklesIcon className="w-4 h-4" /> Assister
    </button>
);

export default AdminMagazine;


