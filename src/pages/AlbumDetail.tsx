import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { ShareIcon, ChevronLeftIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

const AlbumDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isInitialized } = useData();
  const [current, setCurrent] = React.useState(0);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  if (!isInitialized || !data) return <div className="min-h-screen bg-pm-dark"/>;
  const album = (data.galleryAlbums || []).find(a => a.id === id);
  if (!album) return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        <Link to="/galerie" className="inline-flex items-center gap-2 text-pm-gold mb-8 hover:underline"><ChevronLeftIcon className="w-5 h-5"/>Retour à la Galerie</Link>
        <p>Album introuvable.</p>
      </div>
    </div>
  );

  const img = album.coverUrl || album.images?.[0] || '';

  const handleShare = () => {
    setShareUrl(`${window.location.origin}/api/s/al/${encodeURIComponent(album.id)}`);
    setShareOpen(true);
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title={album.title} description={album.description} image={img} type="website" />
      <div className="container mx-auto px-6 max-w-5xl">
        <Link to="/galerie" className="inline-flex items-center gap-2 text-pm-gold mb-8 hover:underline"><ChevronLeftIcon className="w-5 h-5"/>Retour à la Galerie</Link>
        <header className="text-center mb-8">
          <h1 className="page-title !mb-2">{album.title}</h1>
          {album.description && <p className="page-subtitle !mb-0">{album.description}</p>}
        </header>

        {/* Hero image */}
        {img && (
          <div className="relative mb-8">
            <img src={album.images?.[current] || img} alt={album.title} className="w-full rounded-xl border border-pm-gold/20" />
            {album.images && album.images.length > 1 && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {album.images.map((u, i) => (
                  <button key={i} onClick={() => setCurrent(i)} className={`aspect-[4/3] overflow-hidden rounded-lg border ${i===current ? 'border-pm-gold' : 'border-pm-gold/20 hover:border-pm-gold/60'}`}>
                    <img src={u} alt={`${album.title} ${i+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="text-center">
          <button onClick={handleShare} className="px-6 py-3 border border-pm-gold text-pm-gold rounded-full uppercase text-xs font-bold inline-flex items-center gap-2 hover:bg-pm-gold/10"><ShareIcon className="w-4 h-4"/>Partager</button>
        </div>
      </div>

      {shareOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShareOpen(false)}>
          <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <header className="p-4 flex justify-between items-center border-b border-pm-gold/20">
              <h2 className="text-xl font-playfair text-pm-gold">Partager l'album</h2>
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

export default AlbumDetail;
