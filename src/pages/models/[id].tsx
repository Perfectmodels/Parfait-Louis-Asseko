import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  HeartIcon, 
  ShareIcon,
  EyeIcon,
  CalendarDaysIcon,
  MapPinIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import SEO from '../../../components/SEO';
import { useData } from '../../../contexts/DataContext';

const ModelDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useData();

  if (router.isFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center text-pm-gold">
        Chargement...
      </div>
    );
  }

  const model = data?.models.find(m => m.id === id);

  if (!model) {
    return (
      <div className="min-h-screen bg-pm-dark text-pm-off-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-playfair text-pm-gold mb-4">Modèle non trouvé</h1>
          <p className="text-pm-off-white/80 mb-8">Ce modèle n'existe pas ou a été supprimé.</p>
          <Link 
            href="/mannequins" 
            className="px-6 py-3 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-white transition-colors"
          >
            Retour aux mannequins
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pm-dark text-pm-off-white">
      <SEO 
        title={`${model.name} | Perfect Models Management`}
        description={`Découvrez le profil de ${model.name}, mannequin professionnel chez Perfect Models Management. ${model.bio || 'Portfolio et informations détaillées.'}`}
        image={model.imageUrl}
      />
      
      {/* Back Button */}
      <div className="page-container pt-8">
        <Link 
          href="/mannequins" 
          className="inline-flex items-center gap-2 text-pm-gold hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Retour aux mannequins
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-16">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="p-1 border-2 border-pm-gold/30 hover:border-pm-gold transition-all duration-300 rounded-lg">
                <img 
                  src={model.imageUrl} 
                  alt={model.name}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-md"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-4xl lg:text-5xl font-playfair text-pm-gold mb-2">
                  {model.name}
                </h1>
                <p className="text-xl text-pm-off-white/80 mb-4">
                  {model.gender} • {model.age} ans
                </p>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-pm-gold/20 text-pm-gold text-sm font-semibold rounded-full">
                    {model.experience || 'Professionnel'}
                  </span>
                  <span className="px-3 py-1 bg-pm-gold/10 text-pm-gold text-sm rounded-full">
                    {model.specialties?.join(', ') || 'Mode'}
                  </span>
                </div>
              </div>

              {model.bio && (
                <div>
                  <h2 className="text-2xl font-playfair text-pm-gold mb-4">À propos</h2>
                  <p className="text-pm-off-white/80 leading-relaxed">
                    {model.bio}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 border border-pm-gold/20 rounded-lg p-4">
                  <h3 className="text-pm-gold font-semibold mb-2">Taille</h3>
                  <p className="text-pm-off-white/80">{model.measurements?.size || 'N/A'}</p>
                </div>
                <div className="bg-black/30 border border-pm-gold/20 rounded-lg p-4">
                  <h3 className="text-pm-gold font-semibold mb-2">Poids</h3>
                  <p className="text-pm-off-white/80">{model.measurements?.weight || 'N/A'}</p>
                </div>
                <div className="bg-black/30 border border-pm-gold/20 rounded-lg p-4">
                  <h3 className="text-pm-gold font-semibold mb-2">Cheveux</h3>
                  <p className="text-pm-off-white/80">{model.measurements?.hair || 'N/A'}</p>
                </div>
                <div className="bg-black/30 border border-pm-gold/20 rounded-lg p-4">
                  <h3 className="text-pm-gold font-semibold mb-2">Yeux</h3>
                  <p className="text-pm-off-white/80">{model.measurements?.eyes || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-white transition-colors">
                  <HeartIcon className="w-5 h-5" />
                  Favoris
                </button>
                <button className="flex items-center gap-2 px-6 py-3 border border-pm-gold text-pm-gold font-bold rounded-lg hover:bg-pm-gold hover:text-pm-dark transition-colors">
                  <ShareIcon className="w-5 h-5" />
                  Partager
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-16 bg-black/30">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-playfair text-pm-gold mb-4">Portfolio</h2>
            <p className="text-pm-off-white/80 max-w-2xl mx-auto">
              Découvrez les dernières créations de {model.name}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {model.portfolio?.slice(0, 6).map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="relative group cursor-pointer"
              >
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img 
                    src={photo} 
                    alt={`Portfolio ${model.name} ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <EyeIcon className="w-8 h-8 text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-gradient-to-r from-pm-gold/10 to-pm-gold/5 border border-pm-gold/20 rounded-2xl p-8 text-center"
          >
            <h2 className="text-3xl font-playfair text-pm-gold mb-6">
              Intéressé par {model.name} ?
            </h2>
            <p className="text-pm-off-white/80 mb-8 max-w-2xl mx-auto">
              Contactez-nous pour réserver ce mannequin pour votre prochain projet.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/contact" 
                className="px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20"
              >
                Réserver ce mannequin
              </Link>
              <Link 
                href="/mannequins" 
                className="px-8 py-3 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark"
              >
                Voir d'autres mannequins
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ModelDetail;
