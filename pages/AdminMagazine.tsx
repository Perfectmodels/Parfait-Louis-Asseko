import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Article, AIAssistantProps } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';
import AIAssistant from '../components/AIAssistant';
import ImageInput from '../components/ImageInput';

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
        updatedArticles = [...localArticles, newArticle];
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

  if (editingArticle) {
    return <ArticleForm article={editingArticle} onSave={handleFormSave} onCancel={() => {setEditingArticle(null); setIsCreating(false);}} isCreating={isCreating}/>
  }

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Gérer le Magazine" noIndex />
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
            <div>
                 <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Dashboard
                </Link>
                <h1 className="text-4xl font-playfair text-pm-gold">Gérer le Magazine</h1>
            </div>
            <div className="flex items-center gap-4">
                 <button onClick={handleStartCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full hover:bg-pm-gold hover:text-pm-dark">
                    <PlusIcon className="w-5 h-5"/> Ajouter Article
                </button>
            </div>
        </div>

        <div className="bg-black border border-pm-gold/20 p-6 rounded-lg shadow-lg shadow-black/30 space-y-4">
          {localArticles.map(article => (
            <div key={article.slug} className="flex items-center justify-between p-4 bg-pm-dark/50 rounded-md hover:bg-pm-dark">
              <div className="flex items-center gap-4">
                <img src={article.imageUrl} alt={article.title} className="w-24 h-16 object-cover rounded"/>
                <div>
                  <h2 className="font-bold">{article.title}</h2>
                  <p className="text-sm text-pm-off-white/70">{article.category} - {article.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => { setEditingArticle(article); setIsCreating(false); }} className="text-pm-gold/70 hover:text-pm-gold"><PencilIcon className="w-5 h-5"/></button>
                <button onClick={() => handleDelete(article.slug)} className="text-red-500/70 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const articleContentSchema = {
    type: 'ARRAY',
    items: {
        type: 'OBJECT',
        properties: {
            type: { type: 'STRING' },
            level: { type: 'INTEGER' },
            text: { type: 'STRING' },
            author: { type: 'STRING' },
        },
        required: ['type', 'text']
    }
};

const ArticleForm: React.FC<{ article: Article, onSave: (article: Article) => void, onCancel: () => void, isCreating: boolean }> = ({ article, onSave, onCancel, isCreating }) => {
    const [formData, setFormData] = useState(article);
    const [contentJson, setContentJson] = useState(JSON.stringify(article.content, null, 2));
    const [assistantProps, setAssistantProps] = useState<Omit<AIAssistantProps, 'isOpen' | 'onClose'> | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleImageChange = (value: string) => {
        setFormData(prev => ({ ...prev, imageUrl: value }));
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

    return (
        <>
         <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <div className="container mx-auto px-6 max-w-3xl">
                <h1 className="text-4xl font-playfair text-pm-gold mb-8">{isCreating ? 'Nouvel Article' : 'Modifier l\'Article'}</h1>
                <form onSubmit={handleSubmit} className="bg-black p-8 border border-pm-gold/20 space-y-6 rounded-lg shadow-lg shadow-black/30">
                    <FormInput label="Titre" name="title" value={formData.title} onChange={handleChange} onAssistantClick={() => setAssistantProps({
                        fieldName: 'Titre de l\'article',
                        initialPrompt: 'Génère 5 suggestions de titres accrocheurs pour un article de magazine de mode sur le sujet : ',
                        onInsertContent: (content) => setFormData(p => ({...p, title: content.split('\n')[0]}))
                    })} />
                    <ImageInput label="Image de l'article" value={formData.imageUrl} onChange={handleImageChange} />
                    <FormInput label="Catégorie" name="category" value={formData.category} onChange={handleChange} />
                    <FormTextArea label="Extrait" name="excerpt" value={formData.excerpt} onChange={handleChange} onAssistantClick={() => setAssistantProps({
                        fieldName: 'Extrait',
                        initialPrompt: `Rédige un extrait (résumé) engageant de 2-3 phrases pour un article de magazine de mode intitulé "${formData.title}".`,
                        onInsertContent: (content) => setFormData(p => ({...p, excerpt: content}))
                    })}/>
                    <FormTextArea label="Contenu (JSON)" name="content" value={contentJson} onChange={(e) => setContentJson(e.target.value)} isJson={true} onAssistantClick={() => setAssistantProps({
                        fieldName: 'Contenu de l\'article',
                        initialPrompt: `Rédige le contenu complet d'un article de magazine de mode sur le sujet "${formData.title}". Structure la réponse avec des titres, des paragraphes et des citations.`,
                        onInsertContent: (content) => setContentJson(JSON.stringify(JSON.parse(content), null, 2)),
                        jsonSchema: articleContentSchema
                    })}/>
                    <div className="text-xs text-pm-off-white/50">
                        <p>Format: tableau d'objets. Types: 'paragraph', 'heading' (avec level: 2 ou 3), 'quote' (avec author?).</p>
                        <p>{'Ex: [{"type": "paragraph", "text": "Bonjour."}]'}</p>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="px-6 py-2 bg-pm-dark border border-pm-off-white/50 text-pm-off-white/80 font-bold uppercase tracking-widest text-sm rounded-full hover:border-white">Annuler</button>
                        <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-md shadow-pm-gold/30">Sauvegarder</button>
                    </div>
                </form>
            </div>
        </div>
        {assistantProps && <AIAssistant isOpen={!!assistantProps} onClose={() => setAssistantProps(null)} {...assistantProps} />}
       </>
    )
}

const FormInput: React.FC<{label: string, name: string, value: any, onChange: any, type?: string, onAssistantClick?: () => void}> = ({label, name, value, onChange, type="text", onAssistantClick}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70">{label}</label>
            {onAssistantClick && (
                <button type="button" onClick={onAssistantClick} className="flex items-center gap-1 text-xs text-pm-gold/80 hover:text-pm-gold">
                    <SparklesIcon className="w-4 h-4" /> Assister
                </button>
            )}
        </div>
        <input type={type} id={name} name={name} value={value} onChange={onChange} className="admin-input" />
    </div>
);
const FormTextArea: React.FC<{label: string, name: string, value: any, onChange: any, isJson?: boolean, onAssistantClick?: () => void}> = ({label, name, value, onChange, isJson=false, onAssistantClick}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70">{label}</label>
            {onAssistantClick && (
                <button type="button" onClick={onAssistantClick} className="flex items-center gap-1 text-xs text-pm-gold/80 hover:text-pm-gold">
                    <SparklesIcon className="w-4 h-4" /> Assister
                </button>
            )}
        </div>
        <textarea id={name} name={name} value={value} onChange={onChange} rows={isJson ? 10 : 5} className={`admin-input admin-textarea ${isJson ? 'font-mono text-sm' : ''}`} />
    </div>
);

export default AdminMagazine;