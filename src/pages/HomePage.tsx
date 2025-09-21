
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import PublicPageLayout from '../components/PublicPageLayout';
import MagazineCard from '../components/MagazineCard';
import ModelCard from '../components/ModelCard';
import { 
  UserGroupIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useData();

  const featuredModels = data?.models?.slice(0, 4) || [];
  const latestArticles = data?.magazineArticles?.slice(0, 3) || [];

  const heroProps = {
    title: "L'Élégance <br /> Redéfinie",
    subtitle: "Au cœur de la mode africaine, nous façonnons les icônes de demain. Découvrez des talents d'exception et une vision qui transcende les podiums.",
    heroImage: data?.siteConfig?.heroImages?.home || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2574&auto=format&fit=crop',
    callToAction: {
      text: "Devenir Mannequin",
      onClick: () => navigate('/casting'),
    },
    features: [
      { icon: UserGroupIcon, title: "Mannequins d'Élite", description: "Une sélection rigoureuse de talents pour des performances exceptionnelles." },
      { icon: AcademicCapIcon, title: "Formation Professionnelle", description: "Un encadrement complet pour développer le potentiel de chaque mannequin." },
      { icon: GlobeAltIcon, title: "Présence Internationale", description: "Des opportunités de carrière et une visibilité sur la scène mondiale." },
    ]
  };

  return (
    <PublicPageLayout {...heroProps}>
      {/* Featured Models Section */}
      <section className="py-20 text-center">
        <h2 className="text-4xl font-playfair font-bold text-white mb-4">Nos Mannequins à la Une</h2>
        <p className="text-lg text-pm-off-white/70 max-w-2xl mx-auto mb-12">Découvrez les visages qui captivent l'industrie et représentent l'excellence de Perfect Models.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredModels.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ModelCard model={model} />
            </motion.div>
          ))}
        </div>
        <div className="mt-12">
            <Link to="/mannequins" className="inline-flex items-center gap-3 px-8 py-4 bg-pm-dark border border-pm-gold/30 text-pm-off-white font-bold text-lg rounded-full hover:bg-pm-gold hover:text-pm-dark transition-all shadow-lg hover:shadow-pm-gold/20">
                <span>Voir tous nos mannequins</span>
                <ArrowRightIcon className="w-5 h-5" />
            </Link>
        </div>
      </section>

      {/* Latest from Magazine */}
      <section className="py-20 bg-black/30 rounded-3xl">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold text-white mb-4">Dernières Actualités</h2>
            <p className="text-lg text-pm-off-white/70 max-w-2xl mx-auto">Plongez dans les coulisses de la mode, découvrez nos conseils et suivez nos événements.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {latestArticles.map((article, index) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            >
              <MagazineCard article={article} />
            </motion.div>
          ))}
        </div>
      </section>

    </PublicPageLayout>
  );
};

export default HomePage;
