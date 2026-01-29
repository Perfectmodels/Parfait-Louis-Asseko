import React, { useState, useMemo } from 'react';
import ModelCard from '../components/ModelCard';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

type GenderFilter = 'Tous' | 'Femme' | 'Homme';

const Models: React.FC = () => {
  const { data, isInitialized } = useData();
  const [filter, setFilter] = useState<GenderFilter>('Tous');
  const [searchTerm, setSearchTerm] = useState('');

  const models = data?.models || [];
  const publicModels = useMemo(() => models.filter(model => model.isPublic === true), [models]);

  const filteredModels = useMemo(() => {
    return publicModels
      .filter(model => filter === 'Tous' || model.gender === filter)
      .filter(model => model.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [filter, searchTerm, publicModels]);

  if (!isInitialized) {
      return <div className="h-screen bg-pm-dark flex items-center justify-center"><div className="w-12 h-px bg-pm-gold animate-pulse"></div></div>;
  }

  return (
    <div className="bg-pm-dark min-h-screen pt-20">
      <SEO title="Elite Models | Runway & Editorial" description="Découvrez les visages de l'agence PMM." />
      
      <div className="page-container">
        <header className="mb-32 text-center">
            <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="section-label"
            >
                The Talent Board
            </motion.span>
            <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-7xl md:text-[10rem] font-playfair font-black italic tracking-tighter"
            >
                Nos <span className="gold-gradient-text">Talents</span>
            </motion.h1>
        </header>

        {/* HIGH-FASHION FILTERS */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-16 mb-24 border-b border-white/5 pb-16">
          <div className="flex gap-16">
            {(['Tous', 'Femme', 'Homme'] as GenderFilter[]).map(g => (
                <button
                    key={g}
                    onClick={() => setFilter(g)}
                    className={`text-[11px] uppercase font-black tracking-[0.5em] transition-all duration-700 relative py-2 ${
                        filter === g ? 'text-pm-gold' : 'text-white/20 hover:text-white'
                    }`}
                >
                    {g}
                    {filter === g && (
                        <motion.div layoutId="filterUnderline" className="absolute bottom-0 left-0 right-0 h-px bg-pm-gold" />
                    )}
                </button>
            ))}
          </div>
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="RECHERCHER UN NOM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input !text-xs !tracking-[0.4em] !font-black !uppercase"
            />
          </div>
        </div>

        {/* GRID WITH ASYMMETRIC STYLING */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredModels.map((model, idx) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 4) * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={idx % 3 === 0 ? 'lg:translate-y-12' : ''}
            >
                <ModelCard model={model} />
            </motion.div>
          ))}
        </div>
        
        {filteredModels.length === 0 && (
          <div className="text-center py-64">
            <p className="text-white/10 font-playfair italic text-4xl">Aucun talent dans cette catégorie</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Models;