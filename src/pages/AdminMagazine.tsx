import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Article } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon, StarIcon, SparklesIcon } from '@heroicons/react/24/outline';
import ImageInput from '../components/icons/ImageInput';
import { FacebookIcon } from '../components/SocialIcons';
import AIAssistant from '../components/AIAssistant';
import ArticleGenerator from '../components/ArticleGenerator';


const AdminMagazine: React.FC = () => {
  const { data, saveData, isInitialized } = useData();
  const [localArticles, setLocalArticles] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (data?.articles) {
      setLocalArticles([...data.articles]);
    }
  }, [data?.articles, isInitialized]);
  
  const handleFormSave = async (articleToSave: Article) => {
    if (!data) return;
    let updatedArticles;
    if (isCreating) {
        const newArticle = { ...articleToSave, slug: articleToSave.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') + '-' + Date.now() };
        updatedArticles = [newArticle, ...localArticles];
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
    alert(`L'article a été mis à la une.`);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (!data) return;
    const newArticles = [...localArticles];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newArticles.length) return;

    [newArticles[index], newArticles[targetIndex]] = [newArticles[targetIndex], newArticles[index]];
    
    await saveData({ ...data, articles: newArticles });
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
      viewCount: 0,
      reactions: { likes: 0, dislikes: 0 },
    });
  };

  if (editingArticle) {
    return <ArticleForm article={editingArticle} onSave={handleFormSave} onCancel={() => {setEditingArticle(null); setIsCreating(false);}} isCreating={isCreating}/>
  }

  return (
    <>
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
                  <p className="admin-page-subtitle">Créez, modifiez et organisez les articles de Focus Model 241.</p>
              </div>
              <div className="flex items-center gap-4">
                   <button onClick={handleStartCreate} className="action-btn !flex !items-center !gap-2 !px-4 !py-2">
                      <PlusIcon className="w-5 h-5"/> Ajouter Article
                  </button>
              </div>
          </div>

          <div className="admin-section-wrapper !p-4 space-y-4">
            {localArticles.map((article, index) => {
              const articleUrl = `${window.location.origin}/#/magazine/${article.slug}`;
              const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
              
              return (
              <div key={article.slug} className="flex items-center justify-between p-4 bg-pm-dark/50 rounded-md hover:bg-pm-dark transition-colors duration-200">
                <div className="flex items-center gap-4 flex-grow min-w-0">
                  {article.isFeatured && <StarIcon className="w-6 h-6 text-pm-gold flex-shrink-0" title="Article à la une"/>}
                  <img src={article.imageUrl} alt={article.title} className="w-24 h-16 object-cover rounded flex-shrink-0"/>
                  <div className="truncate">
                    <h2 className="font-bold truncate">{article.title}</h2>
                    <p className="text-sm text-pm-off-white/70">{article.category} - {article.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 ml-4">
                  <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" className="action-btn" title="Partager sur Facebook">
                      <FacebookIcon className="w-5 h-5"/>
                  </a>
                  <button onClick={() => handleSetFeatured(article.slug)} className="action-btn" title="Mettre à la une">
                      <StarIcon className="w-5 h-5"/>
                  </button>
                  <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="action-btn disabled:opacity-30" title="Monter"><ArrowUpIcon className="w-5 h-5"/></button>
                  <button onClick={() => handleMove(index, 'down')} disabled={index === localArticles.length - 1} className="action-btn disabled:opacity-30" title="Descendre"><ArrowDownIcon className="w-5 h-5"/></button>
                  <button onClick={() => { setEditingArticle(article); setIsCreating(false); }} className="action-btn" title="Modifier"><PencilIcon className="w-5 h-5"/></button>
                  <button onClick={() => handleDelete(article.slug)} className="action-btn !border-red-500/50 hover:!bg-red-500/20" title="Supprimer"><TrashIcon className="w-5 h-5"/></button>
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
    </>
  );
};

const ArticleForm: React.FC<{ article: Article, onSave: (article: Article) => void, onCancel: () => void, isCreating: boolean }> = ({ article, onSave, onCancel, isCreating }) => {
    const [formData, setFormData] = useState(article);
    const [contentJson, setContentJson] = useState(JSON.stringify(article.content, null, 2));
    
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
    const [assistantState, setAssistantState] = useState<{isOpen: boolean; fieldName: string; initialPrompt: string; jsonSchema?: any}>({
        isOpen: false,
        fieldName: '',
        initialPrompt: '',
        jsonSchema: undefined
    });

    useEffect(() => {
        setFormData(article);
        setContentJson(JSON.stringify(article.content, null, 2));
    }, [article]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleImageChange = (value: string) => {
        setFormData(prev => ({ ...prev, imageUrl: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Accept either JSON array or plain text; if plain text, wrap as paragraphs
        let parsedContent: any = [];
        try {
            parsedContent = JSON.parse(contentJson);
        } catch {
            parsedContent = String(contentJson)
              .split(/\n\n+/)
              .map((p: string) => ({ type: 'paragraph', text: p.trim() }))
              .filter((b: any) => b.text);
        }
        onSave({ ...formData, content: parsedContent });
    };
    
    const handleArticleGenerated = (generatedData: Partial<Article>) => {
        setFormData(prev => ({
            ...prev,
            ...generatedData,
            imageUrl: prev.imageUrl
        }));
        if (generatedData.content) {
            setContentJson(JSON.stringify(generatedData.content, null, 2));
        }
        setIsGeneratorOpen(false);
    };
    
    const openAssistant = (fieldName: string, initialPrompt: string, jsonSchema?: any) => {
        setAssistantState({ isOpen: true, fieldName, initialPrompt, jsonSchema });
    };

    const handleInsertContent = (content: string) => {
        const field = assistantState.fieldName.toLowerCase();
        if (field.includes('titre')) {
            setFormData(p => ({ ...p, title: content }));
        } else if (field.includes('extrait')) {
            setFormData(p => ({ ...p, excerpt: content }));
        } else if (field.includes('contenu')) {
            setContentJson(content);
        }
        setAssistantState({ isOpen: false, fieldName: '', initialPrompt: '' });
    };
    
    const contentJsonSchema = {
        type: "ARRAY",
        items: {
            type: "OBJECT",
            properties: {
                type: { type: "STRING", description: "heading, paragraph, quote, ou image" },
                level: { type: "INTEGER", description: "Pour le type 'heading', 2 ou 3" },
                text: { type: "STRING" },
                author: { type: "STRING", description: "Pour le type 'quote'" },
                src: { type: "STRING", description: "Pour le type 'image'" },
                alt: { type: "STRING", description: "Pour le type 'image'" },
                caption: { type: "STRING", description: "Pour le type 'image'" }
            }
        }
    };

    return (
        <>
         <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="admin-page-header !mb-8">
                     <div>
                        <h1 className="admin-page-title">{isCreating ? 'Nouvel Article' : 'Modifier l\'Article'}</h1>
                        <p className="admin-page-subtitle">Remplissez les champs pour créer ou mettre à jour un article.</p>
                     </div>
                    {isCreating && (
                        <button type="button" onClick={() => setIsGeneratorOpen(true)} className="action-btn !flex !items-center !gap-2 !px-4 !py-2">
                            <SparklesIcon className="w-5 h-5"/> Générer avec l'IA
                        </button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="admin-section-wrapper space-y-8">
                    <div className="space-y-6">
                        <h2 className="admin-section-title">Informations Principales</h2>
                        <FormInput 
                            label="Titre" name="title" value={formData.title} onChange={handleChange}
                            onAIAssist={() => openAssistant('Titre', `Propose 5 titres accrocheurs pour un article de mode sur le thème: "${formData.title || 'nouveau sujet'}"`)}
                        />
                        <ImageInput label="Image de l'article" value={formData.imageUrl} onChange={handleImageChange} />
                        <FormInput label="Catégorie" name="category" value={formData.category} onChange={handleChange} />
                        <FormTextArea 
                            label="Extrait" name="excerpt" value={formData.excerpt} onChange={handleChange}
                            onAIAssist={() => openAssistant('Extrait', `Rédige un extrait court et percutant de 2 phrases pour un article intitulé : "${formData.title}"`)}
                        />
                    </div>
                    
                    <div className="space-y-6">
                         <h2 className="admin-section-title">Contenu & Métadonnées</h2>
                        <FormTextArea 
                            label="Contenu (collez du texte ou JSON)" name="content" value={contentJson} onChange={(e) => setContentJson(e.target.value)} isJson={true}
                            onAIAssist={() => openAssistant('Contenu', `Rédige le contenu d'un article de mode sur "${formData.title}". Structure-le en paragraphes, titres (level 2-3), une citation et des images si besoin. Donne du texte brut (je gèrerai la mise en forme).`)}
                        />
                        <div className="text-xs text-pm-off-white/50">
                            <p>Astuce: collez du texte simple; il sera converti en paragraphes automatiquement. Le JSON reste supporté.</p>
                        </div>
                         <FormInput label="Tags (séparés par des virgules)" name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''} onChange={(e) => setFormData(p => ({...p, tags: e.target.value.split(',').map(tag => tag.trim())}))} />
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-pm-gold/20">
                        <div className="flex items-center gap-2 text-xs">
                            <kbd className="px-2 py-0.5 bg-black/60 border border-pm-off-white/20 rounded">Tab</kbd>
                            <span className="text-pm-off-white/60">pour naviguer</span>
                            <span className="text-pm-off-white/30">•</span>
                            <kbd className="px-2 py-0.5 bg-black/60 border border-pm-off-white/20 rounded">Échap</kbd>
                            <span className="text-pm-off-white/60">pour fermer</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={onCancel} className="px-4 py-2 bg-pm-dark border border-pm-off-white/50 text-pm-off-white/80 font-bold uppercase tracking-widest text-xs rounded-full hover:border-white">Annuler</button>
                            <button type="submit" className="px-5 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white shadow-md shadow-pm-gold/30">Sauvegarder</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <ArticleGenerator isOpen={isGeneratorOpen} onClose={() => setIsGeneratorOpen(false)} onArticleGenerated={handleArticleGenerated} />
        <AIAssistant 
            isOpen={assistantState.isOpen}
            onClose={() => setAssistantState(p => ({...p, isOpen: false}))}
            onInsertContent={handleInsertContent}
            fieldName={assistantState.fieldName}
            initialPrompt={assistantState.initialPrompt}
            jsonSchema={assistantState.jsonSchema}
        />
       </>
    )
}

const FormInput: React.FC<{label: string, name: string, value: any, onChange: any, type?: string, onAIAssist?: () => void}> = ({label, name, value, onChange, type="text", onAIAssist}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={name} className="admin-label !mb-0">{label}</label>
            {onAIAssist && (
                <button type="button" onClick={onAIAssist} className="inline-flex items-center gap-1 text-xs text-pm-gold/70 hover:text-pm-gold">
                    <SparklesIcon className="w-4 h-4" /> Assister
                </button>
            )}
        </div>
        <input type={type} id={name} name={name} value={value} onChange={onChange} className="admin-input" />
    </div>
);
const FormTextArea: React.FC<{label: string, name: string, value: any, onChange: any, isJson?: boolean, onAIAssist?: () => void}> = ({label, name, value, onChange, isJson=false, onAIAssist}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={name} className="admin-label !mb-0">{label}</label>
            {onAIAssist && (
                <button type="button" onClick={onAIAssist} className="inline-flex items-center gap-1 text-xs text-pm-gold/70 hover:text-pm-gold">
                    <SparklesIcon className="w-4 h-4" /> Assister
                </button>
            )}
        </div>
        <textarea id={name} name={name} value={value} onChange={onChange} rows={isJson ? 10 : 5} className={`admin-input admin-textarea ${isJson ? 'font-mono text-sm' : ''}`} />
    </div>
);

export default AdminMagazine;