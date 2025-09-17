import React from 'react';
import { useData } from '../../contexts/DataContext';
import { motion } from 'framer-motion';

const Marquee: React.FC = () => {
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) {
    return (
      <div className="fixed top-0 left-0 right-0 z-40 h-10 bg-gradient-to-r from-black via-pm-dark to-black border-b border-pm-gold/10">
        <div className="h-full bg-gradient-to-r from-pm-gold/5 via-transparent to-pm-gold/5 animate-pulse"></div>
      </div>
    );
  }

  const { models, fashionDayEvents, agencyPartners } = data;

  // Consolidate all names into one array with better categorization
  const allItems = [
    ...new Set([
      ...models.map(m => ({ name: m.name, type: 'model' })),
      ...fashionDayEvents.flatMap(e => e.stylists?.map(s => ({ name: s.name, type: 'stylist' })) || []),
      ...fashionDayEvents.flatMap(e => e.partners?.map(p => ({ name: p.name, type: 'partner' })) || []),
      ...fashionDayEvents.map(e => ({ name: e.theme, type: 'theme' })),
      ...agencyPartners.map(p => ({ name: p.name, type: 'partner' })),
    ]),
  ].filter(item => item.name); // Filter out any potential undefined/null values

  const getItemStyle = (type: string) => {
    switch (type) {
      case 'model':
        return 'text-pm-gold font-semibold';
      case 'stylist':
        return 'text-yellow-400 font-medium';
      case 'partner':
        return 'text-blue-400 font-medium';
      case 'theme':
        return 'text-purple-400 font-medium';
      default:
        return 'text-pm-gold';
    }
  };

  const getSeparator = (type: string) => {
    switch (type) {
      case 'model':
        return '✨';
      case 'stylist':
        return '🎨';
      case 'partner':
        return '🤝';
      case 'theme':
        return '🌟';
      default:
        return '✦';
    }
  };

  const marqueeItems = allItems.map((item, index) => (
    <React.Fragment key={index}>
      <motion.span 
        className={`${getItemStyle(item.type)} transition-colors duration-300 hover:text-white`}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        {item.name}
      </motion.span>
      <span className="text-pm-off-white/30 mx-6 text-lg">
        {getSeparator(item.type)}
      </span>
    </React.Fragment>
  ));

  return (
    <motion.div 
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-40 h-10 bg-gradient-to-r from-black via-pm-dark to-black border-b border-pm-gold/20 overflow-hidden shadow-lg"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-pm-gold/5 via-transparent to-pm-gold/5"></div>
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full bg-gradient-to-r from-transparent via-pm-gold/10 to-transparent animate-pulse"></div>
      </div>

      {/* Marquee content */}
      <div className="relative h-full flex items-center">
        <motion.div 
          className="flex whitespace-nowrap"
          animate={{ x: [0, -50 + '%'] }}
          transition={{ 
            duration: 60, 
            repeat: Infinity, 
            ease: 'linear' 
          }}
        >
          {/* Render the list twice for a seamless loop */}
          <div className="flex items-center px-8 text-sm font-medium tracking-wide">
            {marqueeItems}
          </div>
          <div className="flex items-center px-8 text-sm font-medium tracking-wide" aria-hidden="true">
            {marqueeItems}
          </div>
        </motion.div>
      </div>

      {/* Left and right fade effects */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
    </motion.div>
  );
};

export default Marquee;