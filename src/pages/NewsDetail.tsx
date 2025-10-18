import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { CalendarIcon, ShareIcon, ChevronLeftIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isInitialized } = useData();
  const [shareOpen, setShareOpen] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  if (!isInitialized || !data) return <div className="min-h-screen bg-pm-dark"/>;
  const news = (data.newsItems || []).find(n => n.id === id);
  if (!news) return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-pm-gold mb-8 hover:underline"><ChevronLeftIcon className="w-5 h-5"/>Retour</Link>
        <p>Actualité introuvable.</p>
      </div>
    </div>
  );

  const handleShare = () => {
    setShareUrl(`${window.location.origin}/api/s/n/${encodeURIComponent(news.id)}`);
    setShareOpen(true);
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title={news.title} description={news.excerpt} image={news.imageUrl} type="website" />
      <div className="container mx-auto px-6 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-pm-gold mb-8 hover:underline"><ChevronLeftIcon className="w-5 h-5"/>Retour</Link>

        <article className="content-section">
          <header className="mb-6">
            <h1 className="page-title !mb-2">{news.title}</h1>
            <p className="text-pm-off-white/70 flex items-center gap-2 justify-center"><CalendarIcon className="w-5 h-5"/>{news.date}</p>
          </header>
          {news.imageUrl && (
            <img src={news.imageUrl} alt={news.title} className="w-full h-auto object-cover rounded-lg border border-pm-gold/20 mb-6" />
          )}
          <p className="text-lg leading-relaxed text-center max-w-2xl mx-auto mb-8 text-pm-off-white/80">{news.excerpt}</p>

          <div className="flex items-center justify-center gap-4">
            {news.link && (
              <Link to={news.link} className="px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white">Lire la suite</Link>
            )}
            <button onClick={handleShare} className="px-6 py-3 border border-pm-gold text-pm-gold rounded-full uppercase text-xs font-bold inline-flex items-center gap-2 hover:bg-pm-gold/10"><ShareIcon className="w-4 h-4"/>Partager</button>
          </div>
        </article>
      </div>

      {shareOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShareOpen(false)}>
          <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <header className="p-4 flex justify-between items-center border-b border-pm-gold/20">
              <h2 className="text-xl font-playfair text-pm-gold">Partager cette actualité</h2>
              <button onClick={() => setShareOpen(false)} className="text-pm-off-white/70 hover:text-white">✕</button>
            </header>
            <main className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <input type="text" readOnly value={shareUrl} className="admin-input flex-grow !pr-10" />
                <button onClick={() => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="relative -ml-10 text-pm-off-white/70 hover:text-pm-gold">
                  {copied ? <CheckIcon className="w-5 h-5 text-green-500"/> : <ClipboardDocumentIcon className="w-5 h-5"/>}
                </button>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetail;
