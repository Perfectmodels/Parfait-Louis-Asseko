
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MagazineArticle } from '../types';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

interface MagazineCardProps {
  article: MagazineArticle;
}

const MagazineCard: React.FC<MagazineCardProps> = ({ article }) => {
  const placeholderImage = 'https://via.placeholder.com/400x300.png/000000/D4AF37?text=Perfect+Models';

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-black/50 rounded-lg overflow-hidden border border-pm-gold/20 h-full flex flex-col"
    >
      <Link to={`/magazine/${article.slug}`} className="block">
        <div className="overflow-hidden">
          <motion.img
            src={article.coverImage || placeholderImage}
            alt={article.title}
            className="w-full h-48 object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="p-6 flex-grow flex flex-col">
          <p className="text-sm text-pm-gold font-semibold uppercase tracking-wider mb-2">{article.category}</p>
          <h3 className="text-xl font-playfair font-bold text-white mb-3 flex-grow">{article.title}</h3>
          <div className="flex items-center justify-between text-sm text-pm-off-white/70 mt-4">
            <span>Par {article.author}</span>
            <div className="flex items-center gap-2 text-pm-gold font-semibold">
              Lire la suite
              <ArrowRightIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MagazineCard;
