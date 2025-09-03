import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Article } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';

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

  const handleFormSave = (articleToSave: Article) => {
    let updatedArticles;
    if (isCreating) {
        const newArticle = { ...articleToSave, slug: articleToSave.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') + '-' + Date.now() };
        updatedArticles = [...localArticles, newArticle];
    } else {
        updatedArticles = localArticles.map(a => a.slug === articleToSave.slug ? articleToSave : a);
    }
    setLocalArticles(updatedArticles);
    setEditingArticle(null);
    setIsCreating(false);
  };

  const handleDelete = (slug: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ? N'oubliez pas de sauvegarder les changements.")) {
      setLocalArticles(prevArticles => prevArticles.filter(a => a.slug !== slug));
    }
  };
  
  const handleSaveChanges = () => {
    if (!data) return;
    if (window.confirm("Sauvegarder toutes les modifications apportées au magazine ?")) {
      saveData({ ...data, articles: localArticles });
      alert("Magazine mis à jour avec succès !");
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
      <SEO title="Admin - Gérer le Magazine" />
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
                <button onClick={handleSaveChanges} className="px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-lg shadow-pm-gold/30">
                    Sauvegarder les Changements
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

const ArticleForm: React.FC<{ article: Article, onSave: (article: Article) => void, onCancel: () => void, isCreating: boolean }> = ({ article, onSave, onCancel, isCreating }) => {
    const [formData, setFormData] = useState(article);
    const [contentJson, setContentJson] = useState(JSON.stringify(article.content, null, 2));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
         <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <div className="container mx-auto px-6 max-w-3xl">
                <h1 className="text-4xl font-playfair text-pm-gold mb-8">{isCreating ? 'Nouvel Article' : 'Modifier l\'Article'}</h1>
                <form onSubmit={handleSubmit} className="bg-black p-8 border border-pm-gold/20 space-y-6 rounded-lg shadow-lg shadow-black/30">
                    <FormInput label="Titre" name="title" value={formData.title} onChange={handleChange} />
                    <FormInput label="URL de l'image" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
                    <FormInput label="Catégorie" name="category" value={formData.category} onChange={handleChange} />
                    <FormTextArea label="Extrait" name="excerpt" value={formData.excerpt} onChange={handleChange} />
                    <FormTextArea label="Contenu (JSON)" name="content" value={contentJson} onChange={(e) => setContentJson(e.target.value)} isJson={true} />
                    <div className="text-xs text-pm-off-white/50">
                        <p>Format du contenu: tableau d'objets. Types valides: 'paragraph', 'heading', 'quote'.</p>
                        <p>Ex: [{"type": "paragraph", "text": "Bonjour."}]</p>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="px-6 py-2 bg-pm-dark border border-pm-off-white/50 text-pm-off-white/80 font-bold uppercase tracking-widest text-sm rounded-full hover:border-white">Annuler</button>
                        <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-md shadow-pm-gold/30">Sauvegarder</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const FormInput: React.FC<{label: string, name: string, value: any, onChange: any, type?: string}> = ({label, name, value, onChange, type="text"}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} className="admin-input" />
    </div>
);
const FormTextArea: React.FC<{label: string, name: string, value: any, onChange: any, isJson?: boolean}> = ({label, name, value, onChange, isJson=false}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} rows={isJson ? 10 : 5} className={`admin-input admin-textarea ${isJson ? 'font-mono text-sm' : ''}`} />
    </div>
);

export default AdminMagazine;