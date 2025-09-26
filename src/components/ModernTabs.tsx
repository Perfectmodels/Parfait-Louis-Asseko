import React from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface ModernTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

const ModernTabs: React.FC<ModernTabsProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.3 }}
      className={`mb-16 ${className}`}
    >
      <div className="border-b border-pm-gold/20">
        <nav className="flex flex-wrap justify-center gap-2" role="tablist">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`group flex items-center gap-3 px-8 py-4 text-lg font-semibold transition-all duration-300 border-b-2 relative ${
                activeTab === tab.id
                  ? 'text-pm-gold border-pm-gold bg-pm-gold/5'
                  : 'text-pm-off-white/70 border-transparent hover:text-pm-gold hover:border-pm-gold/50'
              }`}
            >
              <tab.icon className={`w-6 h-6 transition-colors duration-300 ${
                activeTab === tab.id ? 'text-pm-gold' : 'text-pm-off-white/70 group-hover:text-pm-gold'
              }`} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-pm-gold"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default ModernTabs;
