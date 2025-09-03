
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import NotFound from './NotFound';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';

const ModelDetail: React.FC = () => {
  const { data, isInitialized } = useData();
  const { id } = useParams<{ id: string }>();
  
  const model = data?.models.find(m => m.id === id);

  if (!isInitialized) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }

  if (!model) {
    return <NotFound />;
  }

  return (
    <>
      <SEO
        title={model.name}
        description={`Découvrez ${model.name}, talentueux mannequin de l'agence Perfect Models Management. Profil complet, mensurations (${model.height}), et palmarès. Prêt(e) à illuminer votre prochain projet.`}
        keywords={`${model.name}, mannequin ${model.gender}, modèle photo gabon, agence pmm, booker ${model.name}, mensurations mannequin`}
        image={model.imageUrl}
      />
      <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
        <div className="container mx-auto px-6">
          <Link to="/mannequins" className="inline-flex items-center gap-2 text-pm-gold mb-8 hover:underline">
            <ChevronLeftIcon className="w-5 h-5" />
            Retour au catalogue
          </Link>
          <div className="flex flex-col lg:flex-row gap-12 bg-black p-8 border border-pm-gold/20">
            <div className="lg:w-1/3">
              <div className="aspect-[3/4] border-2 border-pm-gold p-2">
                  <img src={model.imageUrl} alt={model.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="lg:w-2/3">
              <h1 className="text-5xl font-playfair text-pm-gold">{model.name}</h1>
              <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 text-lg">
                <div><span className="font-bold text-pm-off-white/60">Taille:</span> {model.height}</div>
                <div><span className="font-bold text-pm-off-white/60">Genre:</span> {model.gender}</div>
                {model.age && <div><span className="font-bold text-pm-off-white/60">Âge:</span> {model.age} ans</div>}
                {model.location && <div><span className="font-bold text-pm-off-white/60">Lieu:</span> {model.location}</div>}
              </div>
              
              {model.distinctions && model.distinctions.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-2xl font-playfair text-pm-gold mb-4">Palmarès</h2>
                  <ul className="list-none space-y-2">
                    {model.distinctions.map((dist, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-pm-gold mt-1">✦</span>
                        <span>{dist}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

               <div className="mt-10">
                  <Link to="/contact" className="inline-block text-center px-10 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20">
                      Booker ce mannequin
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModelDetail;