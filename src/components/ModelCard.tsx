import React from 'react';
import { Link } from 'react-router-dom';
import { Model } from '../types';
import { motion } from 'framer-motion';

interface ModelCardProps {
  model: Model;
}

/**
 * ⚡ Bolt Optimization:
 * Wrapped ModelCard in React.memo() to prevent unnecessary re-renders.
 * Because ModelCard is rendered in a list inside Models.tsx, parent state changes
 * (like typing in the search input or changing the gender filter) would previously
 * cause all cards to re-render. This optimization significantly reduces CPU cycles
 * during filtering by only re-rendering cards when their specific `model` prop changes.
 */
const ModelCard = React.memo(({ model }: ModelCardProps) => {
  return (
    <motion.div 
      whileHover={{ y: -15 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative h-[650px] overflow-hidden bg-pm-gray border border-white/5"
    >
      <Link to={`/mannequins/${model.id}`} className="block h-full">
        <img 
            src={model.imageUrl} 
            alt={model.name} 
            className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pm-dark via-transparent to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-700"></div>
        
        <div className="absolute bottom-0 left-0 p-10 w-full transform translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-[0.16, 1, 0.3, 1]">
          <div className="overflow-hidden">
             <motion.h3 
               className="text-4xl font-playfair font-black text-white tracking-tight"
             >
                {model.name}
             </motion.h3>
          </div>
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-pm-gold">
               {model.height} • {model.gender}
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-pm-gold transition-colors">
                View Profile
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

export default ModelCard;