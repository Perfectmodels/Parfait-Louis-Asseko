import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { CalendarDaysIcon, MapPinIcon, SparklesIcon, ChevronLeftIcon, ShareIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

const FashionDayEdition: React.FC = () => {
  const { edition } = useParams<{ edition: string }>();
  const { data, isInitialized } = useData();
  const [shareOpen, setShareOpen] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  if (!isInitialized || !data) return <div className="min-h-screen bg-pm-dark"/>;
  const event = (data.fashionDayEvents || []).find(e => String(e.edition) === String(edition));
  if (!event) return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        <Link to="/fashion-day" className="inline-flex items-center gap-2 text-pm-gold mb-8 hover:underline"><ChevronLeftIcon className="w-5 h-5"/>Retour au PFD</Link>
        <p>Édition introuvable.</p>
      </div>
    </div>
  );

  const cover = event.stylists?.[0]?.images?.[0] || data.siteImages.fashionDayBg || '';

  const handleShare = () => {
    setShareUrl(`${window.location.origin}/api/s/fd/${encodeURIComponent(event.edition)}`);
    setShareOpen(true);
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title={`Perfect Fashion Day – Édition ${event.edition}`} description={event.theme} image={cover} type="event" />
      <div className="container mx-auto px-6 max-w-5xl">
        <Link to="/fashion-day" className="inline-flex items-center gap-2 text-pm-gold mb-8 hover:underline"><ChevronLeftIcon className="w-5 h-5"/>Retour au PFD</Link>

        <header className="text-center mb-8">
          <h1 className="page-title !mb-2">Édition {event.edition}</h1>
          <p className="page-subtitle !mb-0">{event.theme}</p>
        </header>

        {cover && <img src={cover} alt={event.theme} className="w-full rounded-xl border border-pm-gold/20 mb-8" />}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Info icon={CalendarDaysIcon} label="Date" value={new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} />
          {event.location && <Info icon={MapPinIcon} label="Lieu" value={event.location} />}
          {event.promoter && <Info icon={SparklesIcon} label="Promoteur" value={event.promoter} />}
        </div>

        {event.description && (
          <div className="content-section">
            <p className="text-lg leading-relaxed text-pm-off-white/80">{event.description}</p>
          </div>
        )}

        <div className="text-center mt-8">
          <button onClick={handleShare} className="px-6 py-3 border border-pm-gold text-pm-gold rounded-full uppercase text-xs font-bold inline-flex items-center gap-2 hover:bg-pm-gold/10"><ShareIcon className="w-4 h-4"/>Partager</button>
        </div>
      </div>

      {shareOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShareOpen(false)}>
          <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <header className="p-4 flex justify-between items-center border-b border-pm-gold/20">
              <h2 className="text-xl font-playfair text-pm-gold">Partager l'édition PFD</h2>
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

const Info: React.FC<{ icon: React.ElementType; label: string; value: string }>=({ icon:Icon, label, value }) => (
  <div className="bg-black border border-pm-gold/20 rounded-lg p-5 flex items-start gap-4">
    <div className="p-2 rounded-md bg-pm-gold/10 border border-pm-gold/30 text-pm-gold"><Icon className="w-6 h-6"/></div>
    <div>
      <p className="text-sm text-pm-off-white/70">{label}</p>
      <p className="text-lg font-playfair text-pm-gold leading-tight">{value}</p>
    </div>
  </div>
);

export default FashionDayEdition;
