
import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Article } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon, SparklesIcon, ArrowUpIcon, ArrowDownIcon, StarIcon } from '@heroicons/react/24/outline';
import ImageInput from '../components/ImageInput';
import { FacebookIcon } from '../components/icons/SocialIcons';
import ArticleGenerator from '../components/ArticleGenerator';

const AdminMagazine: React.FC = () => {
  const { data, saveData, isInitialized } = useData();
  const [localArticles, setLocalArticles] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

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
  
  const handleArticleGenerated = (articleData: Partial<Article>) => {
      setIsCreating(true);
      setEditingArticle({
          slug: '',
          title: articleData.title || '',
          category: articleData.category || 'Interview',
          excerpt: articleData.excerpt || '',
          imageUrl: '', // User needs to add this
          author: articleData.author || 'Focus Model 241',
          date: articleData.date || new Date().toISOString().split('T')[0],
          content: articleData.content || [{ type: 'paragraph', text: '' }],
          tags: articleData.tags || [],
          isFeatured: false,
          viewCount: articleData.viewCount || 0,
          reactions: articleData.reactions || { likes: 0, dislikes: 0 },
      });
      setIsGeneratorOpen(false);
  };

  if (editingArticle) {
    return <ArticleForm article={editingArticle} onSave={handleFormSave} onCancel={() => {setEditingArticle(null); setIsCreating(false);}} isCreating={isCreating}/>
  }

  return (
    <>
      <ArticleGenerator
          isOpen={isGeneratorOpen}
          onClose={() => setIsGeneratorOpen(false)}
          onArticleGenerated={handleArticleGenerated}
      />
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
                  <button onClick={() => setIsGeneratorOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-lg shadow-pm-gold/20">
                      <SparklesIcon className="w-5 h-5"/> Générer avec IA
                  </button>
                   <button onClick={handleStartCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full hover:bg-pm-gold hover:text-pm-dark">
                      <PlusIcon className="w-5 h-5"/> Ajouter Article
                  </button>
              </div>
          </div>

          <div className="bg-black border border-pm-gold/20 p-6 rounded-lg shadow-lg shadow-black/30 space-y-4">
            {localArticles.map((article, index) => {
              const articleUrl = `${window.location.origin}/magazine/${article.slug}`;
              const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
              
              return (
              <div key={article.slug} className="flex items-center justify-between p-4 bg-pm-dark/50 rounded-md hover:bg-pm-dark">
                <div className="flex items-center gap-4">
                  {article.isFeatured && <StarIcon className="w-6 h-6 text-pm-gold flex-shrink-0" title="Article à la une"/>}
                  <img src={article.imageUrl} alt={article.title} className="w-24 h-16 object-cover rounded"/>
                  <div>
                    <h2 className="font-bold">{article.title}</h2>
                    <p className="text-sm text-pm-off-white/70">{article.category} - {article.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" className="text-pm-gold/70 hover:text-pm-gold" title="Partager sur Facebook">
                      <FacebookIcon className="w-5 h-5"/>
                  </a>
                  <button onClick={() => handleSetFeatured(article.slug)} className="text-pm-gold/70 hover:text-pm-gold" title="Mettre à la une">
                      <StarIcon className="w-5 h-5"/>
                  </button>
                  <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="disabled:opacity-30" title="Monter"><ArrowUpIcon className="w-5 h-5"/></button>
                  <button onClick={() => handleMove(index, 'down')} disabled={index === localArticles.length - 1} className="disabled:opacity-30" title="Descendre"><ArrowDownIcon className="w-5 h-5"/></button>
                  <button onClick={() => { setEditingArticle(article); setIsCreating(false); }} className="text-pm-gold/70 hover:text-pm-gold" title="Modifier"><PencilIcon className="w-5 h-5"/></button>
                  <button onClick={() => handleDelete(article.slug)} className="text-red-500/70 hover:text-red-500" title="Supprimer"><TrashIcon className="w-5 h-5"/></button>
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
                    <FormInput label="Titre" name="title" value={formData.title} onChange={handleChange} />
                    <ImageInput label="Image de l'article" value={formData.imageUrl} onChange={handleImageChange} />
                    <FormInput label="Catégorie" name="category" value={formData.category} onChange={handleChange} />
                    <FormTextArea label="Extrait" name="excerpt" value={formData.excerpt} onChange={handleChange}/>
                    <FormTextArea label="Contenu (JSON)" name="content" value={contentJson} onChange={(e) => setContentJson(e.target.value)} isJson={true}/>
                    <div className="text-xs text-pm-off-white/50">
                        <p>Format: tableau d'objets. Types: 'paragraph', 'heading' (avec level: 2 ou 3), 'quote' (avec author?), 'image' (avec src, alt, caption?).</p>
                        <p>{'Ex: [{"type": "paragraph", "text": "Bonjour."}]'}</p>
                    </div>
                     <FormInput label="Tags (séparés par des virgules)" name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''} onChange={(e) => setFormData(p => ({...p, tags: e.target.value.split(',').map(tag => tag.trim())}))} />

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="px-6 py-2 bg-pm-dark border border-pm-off-white/50 text-pm-off-white/80 font-bold uppercase tracking-widest text-sm rounded-full hover:border-white">Annuler</button>
                        <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-md shadow-pm-gold/30">Sauvegarder</button>
                    </div>
                </form>
            </div>
        </div>
       </>
    )
}

const FormInput: React.FC<{label: string, name: string, value: any, onChange: any, type?: string}> = ({label, name, value, onChange, type="text"}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70">{label}</label>
        </div>
        <input type={type} id={name} name={name} value={value} onChange={onChange} className="admin-input" />
    </div>
);
const FormTextArea: React.FC<{label: string, name: string, value: any, onChange: any, isJson?: boolean}> = ({label, name, value, onChange, isJson=false}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70">{label}</label>
        </div>
        <textarea id={name} name={name} value={value} onChange={onChange} rows={isJson ? 10 : 5} className={`admin-input admin-textarea ${isJson ? 'font-mono text-sm' : ''}`} />
    </div>
);

export default AdminMagazine;