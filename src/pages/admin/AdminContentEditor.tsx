import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Article, NewsItem, ArticleContent } from '../../types';
import {
    ChevronLeftIcon,
    TrashIcon,
    DocumentTextIcon,
    ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';
import ImageUploader from '../../components/ImageUploader';

type ContentType = 'article' | 'news';

const AdminContentEditor: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { data, saveData } = useData();

    const [contentType, setContentType] = useState<ContentType>('article');
    const [isEditing, setIsEditing] = useState(false);

    // Article fields
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Interview');
    const [excerpt, setExcerpt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [author, setAuthor] = useState('Focus Model 241');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [tags, setTags] = useState<string[]>([]);
    const [contentBlocks, setContentBlocks] = useState<ArticleContent[]>([
        { type: 'paragraph', text: '' }
    ]);

    // News-specific fields
    const [newsLink, setNewsLink] = useState('');

    useEffect(() => {
        if (slug && data) {
            // Try to find in articles
            const article = data.articles?.find(a => a.slug === slug);
            if (article) {
                setIsEditing(true);
                setContentType('article');
                setTitle(article.title);
                setCategory(article.category);
                setExcerpt(article.excerpt);
                setImageUrl(article.imageUrl);
                setAuthor(article.author);
                setDate(article.date);
                setTags(article.tags || []);
                setContentBlocks(article.content);
                return;
            }

            // Try to find in news
            const newsItem = data.newsItems?.find(n => n.id === slug);
            if (newsItem) {
                setIsEditing(true);
                setContentType('news');
                setTitle(newsItem.title);
                setExcerpt(newsItem.excerpt);
                setImageUrl(newsItem.imageUrl);
                setDate(newsItem.date);
                setNewsLink(newsItem.link || '');
            }
        }
    }, [slug, data]);

    const addContentBlock = (type: ArticleContent['type']) => {
        let newBlock: ArticleContent;

        switch (type) {
            case 'heading':
                newBlock = { type: 'heading', level: 2, text: '' };
                break;
            case 'paragraph':
                newBlock = { type: 'paragraph', text: '' };
                break;
            case 'quote':
                newBlock = { type: 'quote', text: '', author: '' };
                break;
            case 'image':
                newBlock = { type: 'image', src: '', alt: '', caption: '' };
                break;
            default:
                newBlock = { type: 'paragraph', text: '' };
        }

        setContentBlocks([...contentBlocks, newBlock]);
    };

    const updateContentBlock = (index: number, updates: Partial<ArticleContent>) => {
        const newBlocks = [...contentBlocks];
        newBlocks[index] = { ...newBlocks[index], ...updates } as ArticleContent;
        setContentBlocks(newBlocks);
    };

    const removeContentBlock = (index: number) => {
        setContentBlocks(contentBlocks.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!data) return;

        if (!title || !excerpt || !imageUrl) {
            alert('Veuillez remplir tous les champs obligatoires (titre, extrait, image)');
            return;
        }

        try {
            if (contentType === 'article') {
                const articleSlug = slug || title.toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-') + '-' + Date.now();

                const articleData: Article = {
                    slug: articleSlug,
                    title,
                    category,
                    excerpt,
                    imageUrl,
                    author,
                    date,
                    content: contentBlocks,
                    tags,
                    isFeatured: false
                };

                let updatedArticles;
                if (isEditing) {
                    updatedArticles = data.articles?.map(a =>
                        a.slug === slug ? articleData : a
                    ) || [];
                } else {
                    updatedArticles = [articleData, ...(data.articles || [])];
                }

                await saveData({ ...data, articles: updatedArticles });
                alert('Article enregistré avec succès !');
                navigate('/admin/magazine');

            } else {
                const newsId = slug || `news-${Date.now()}`;

                const newsData: NewsItem = {
                    id: newsId,
                    title,
                    date,
                    imageUrl,
                    excerpt,
                    link: newsLink
                };

                let updatedNews;
                if (isEditing) {
                    updatedNews = data.newsItems?.map(n =>
                        n.id === slug ? newsData : n
                    ) || [];
                } else {
                    updatedNews = [newsData, ...(data.newsItems || [])];
                }

                await saveData({ ...data, newsItems: updatedNews });
                alert('Actualité enregistrée avec succès !');
                navigate('/admin/news');
            }
        } catch (error) {
            console.error('Error saving:', error);
            alert('Erreur lors de l\'enregistrement');
        }
    };

    return (
        <div className="min-h-screen bg-pm-dark text-pm-off-white py-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <Link
                    to={contentType === 'article' ? '/admin/magazine' : '/admin/news'}
                    className="inline-flex items-center gap-2 text-pm-gold mb-6 hover:underline"
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour à la liste
                </Link>

                <div className="bg-black/30 border border-pm-gold/20 rounded-lg p-8">
                    <h1 className="text-3xl font-playfair text-pm-gold mb-6">
                        {isEditing ? 'Modifier' : 'Créer'} {contentType === 'article' ? 'un Article' : 'une Actualité'}
                    </h1>

                    {/* Type Selector (only for new content) */}
                    {!isEditing && (
                        <div className="mb-8 pb-6 border-b border-pm-gold/20">
                            <label className="admin-label">Type de contenu</label>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setContentType('article')}
                                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${contentType === 'article'
                                            ? 'border-pm-gold bg-pm-gold/10 text-white'
                                            : 'border-pm-gold/20 text-pm-off-white/60 hover:border-pm-gold/40'
                                        }`}
                                >
                                    <DocumentTextIcon className="w-8 h-8 mx-auto mb-2" />
                                    <p className="font-bold">Article Magazine</p>
                                    <p className="text-xs mt-1">Contenu détaillé avec sections</p>
                                </button>
                                <button
                                    onClick={() => setContentType('news')}
                                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${contentType === 'news'
                                            ? 'border-pm-gold bg-pm-gold/10 text-white'
                                            : 'border-pm-gold/20 text-pm-off-white/60 hover:border-pm-gold/40'
                                        }`}
                                >
                                    <ChatBubbleBottomCenterTextIcon className="w-8 h-8 mx-auto mb-2" />
                                    <p className="font-bold">Actualité</p>
                                    <p className="text-xs mt-1">Annonce courte et rapide</p>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Common Fields */}
                    <div className="space-y-6">
                        <div>
                            <label className="admin-label">Titre *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="admin-input"
                                placeholder="Titre accrocheur..."
                            />
                        </div>

                        <ImageUploader
                            label="Image de couverture *"
                            value={imageUrl}
                            onChange={setImageUrl}
                        />

                        <div>
                            <label className="admin-label">Extrait / Résumé *</label>
                            <textarea
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                className="admin-input admin-textarea"
                                rows={3}
                                placeholder="Résumé court pour les aperçus..."
                            />
                        </div>

                        <div>
                            <label className="admin-label">Date de publication</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="admin-input"
                            />
                        </div>

                        {/* Article-specific fields */}
                        {contentType === 'article' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="admin-label">Catégorie</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="admin-input"
                                        >
                                            <option>Interview</option>
                                            <option>Événement</option>
                                            <option>Tendance</option>
                                            <option>Conseils</option>
                                            <option>Portrait</option>
                                            <option>Actualité</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="admin-label">Auteur</label>
                                        <input
                                            type="text"
                                            value={author}
                                            onChange={(e) => setAuthor(e.target.value)}
                                            className="admin-input"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="admin-label">Tags (séparés par des virgules)</label>
                                    <input
                                        type="text"
                                        value={tags.join(', ')}
                                        onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                                        className="admin-input"
                                        placeholder="mode, fashion, tendance..."
                                    />
                                </div>

                                {/* Content Blocks */}
                                <div className="border-t border-pm-gold/20 pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="admin-label !mb-0">Contenu de l'article</label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => addContentBlock('heading')}
                                                className="px-3 py-1 bg-pm-gold/20 text-pm-gold rounded text-sm hover:bg-pm-gold/30"
                                            >
                                                + Titre
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => addContentBlock('paragraph')}
                                                className="px-3 py-1 bg-pm-gold/20 text-pm-gold rounded text-sm hover:bg-pm-gold/30"
                                            >
                                                + Paragraphe
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => addContentBlock('quote')}
                                                className="px-3 py-1 bg-pm-gold/20 text-pm-gold rounded text-sm hover:bg-pm-gold/30"
                                            >
                                                + Citation
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => addContentBlock('image')}
                                                className="px-3 py-1 bg-pm-gold/20 text-pm-gold rounded text-sm hover:bg-pm-gold/30"
                                            >
                                                + Image
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {contentBlocks.map((block, index) => (
                                            <div key={index} className="bg-black/20 border border-pm-gold/10 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm text-pm-gold uppercase">{block.type}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeContentBlock(index)}
                                                        className="text-red-500 hover:text-red-400"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {block.type === 'heading' && (
                                                    <>
                                                        <select
                                                            value={block.level}
                                                            onChange={(e) => updateContentBlock(index, { level: Number(e.target.value) as 2 | 3 })}
                                                            className="admin-input mb-2"
                                                        >
                                                            <option value={2}>Titre H2</option>
                                                            <option value={3}>Titre H3</option>
                                                        </select>
                                                        <input
                                                            type="text"
                                                            value={block.text}
                                                            onChange={(e) => updateContentBlock(index, { text: e.target.value })}
                                                            className="admin-input"
                                                            placeholder="Texte du titre..."
                                                        />
                                                    </>
                                                )}

                                                {block.type === 'paragraph' && (
                                                    <textarea
                                                        value={block.text}
                                                        onChange={(e) => updateContentBlock(index, { text: e.target.value })}
                                                        className="admin-input admin-textarea"
                                                        rows={4}
                                                        placeholder="Contenu du paragraphe..."
                                                    />
                                                )}

                                                {block.type === 'quote' && (
                                                    <>
                                                        <textarea
                                                            value={block.text}
                                                            onChange={(e) => updateContentBlock(index, { text: e.target.value })}
                                                            className="admin-input admin-textarea mb-2"
                                                            rows={3}
                                                            placeholder="Texte de la citation..."
                                                        />
                                                        <input
                                                            type="text"
                                                            value={block.author || ''}
                                                            onChange={(e) => updateContentBlock(index, { author: e.target.value })}
                                                            className="admin-input"
                                                            placeholder="Auteur de la citation (optionnel)"
                                                        />
                                                    </>
                                                )}

                                                {block.type === 'image' && (
                                                    <>
                                                        <ImageUploader
                                                            label="URL de l'image"
                                                            value={block.src}
                                                            onChange={(url) => updateContentBlock(index, { src: url })}
                                                        />
                                                        <input
                                                            type="text"
                                                            value={block.alt}
                                                            onChange={(e) => updateContentBlock(index, { alt: e.target.value })}
                                                            className="admin-input mt-2"
                                                            placeholder="Texte alternatif..."
                                                        />
                                                        <input
                                                            type="text"
                                                            value={block.caption || ''}
                                                            onChange={(e) => updateContentBlock(index, { caption: e.target.value })}
                                                            className="admin-input mt-2"
                                                            placeholder="Légende (optionnel)"
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* News-specific fields */}
                        {contentType === 'news' && (
                            <div>
                                <label className="admin-label">Lien externe (optionnel)</label>
                                <input
                                    type="url"
                                    value={newsLink}
                                    onChange={(e) => setNewsLink(e.target.value)}
                                    className="admin-input"
                                    placeholder="https://..."
                                />
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 mt-8 pt-6 border-t border-pm-gold/20">
                        <button
                            type="button"
                            onClick={() => navigate(contentType === 'article' ? '/admin/magazine' : '/admin/news')}
                            className="px-6 py-3 bg-transparent border border-pm-off-white/30 text-pm-off-white rounded-full hover:border-pm-off-white transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="flex-1 px-6 py-3 bg-pm-gold text-black font-bold rounded-full hover:bg-white transition-colors"
                        >
                            {isEditing ? 'Mettre à jour' : 'Publier'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminContentEditor;
