import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const ModelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) return <div className="h-screen bg-pm-dark flex items-center justify-center"><div className="w-12 h-px bg-pm-gold animate-pulse" /></div>;

  const model = data.models.find(m => m.id === id);
  if (!model) return <div className="h-screen bg-pm-dark flex items-center justify-center text-white">Mannequin introuvable.</div>;

  return (
    <div className="bg-pm-dark min-h-screen text-pm-off-white">
      <SEO title={model.name} description={model.experience || `Profil de ${model.name} — Perfect Models Management`} image={model.imageUrl} />
      <div className="page-container">
        <Link to="/mannequins" className="inline-flex items-center gap-2 text-pm-gold/60 hover:text-pm-gold text-xs uppercase tracking-widest font-black mb-10 sm:mb-16 transition-colors">
          <ArrowLeftIcon className="w-4 h-4" /> Tous les mannequins
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-20">
          <div className="aspect-[3/4] overflow-hidden bg-pm-gray">
            <img src={model.imageUrl} alt={model.name} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-8 sm:space-y-10 lg:pt-10">
            <div>
              <span className="section-label">{model.level}</span>
              <h1 className="text-4xl sm:text-6xl font-playfair font-black italic mt-2">{model.name}</h1>
            </div>
            <div className="grid grid-cols-3 gap-4 sm:gap-8 border-y border-white/5 py-8 sm:py-10">
              {model.height && <Stat label="Taille" value={model.height} />}
              {model.gender && <Stat label="Genre" value={model.gender} />}
              {model.location && <Stat label="Ville" value={model.location} />}
            </div>
            {model.categories && model.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {model.categories.map(c => (
                  <span key={c} className="px-3 sm:px-4 py-1 border border-pm-gold/20 text-[10px] uppercase tracking-widest font-black text-pm-gold/60">{c}</span>
                ))}
              </div>
            )}
            {model.experience && <p className="text-white/50 leading-relaxed font-light">{model.experience}</p>}
            {model.portfolioImages && model.portfolioImages.length > 0 && (
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-4">
                {model.portfolioImages.map((img, i) => (
                  <div key={i} className="aspect-square overflow-hidden bg-pm-gray">
                    <img src={img} alt={`${model.name} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/30 block mb-1">{label}</span>
    <span className="text-lg font-playfair font-bold text-white">{value}</span>
  </div>
);

export default ModelDetail;
