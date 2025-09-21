
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface PublicPageLayoutProps {
  title: string;
  subtitle: string;
  heroImage: string;
  callToAction?: {
    text: string;
    onClick: () => void;
  };
  features?: Feature[];
  children: React.ReactNode;
}

const PublicPageLayout: React.FC<PublicPageLayoutProps> = ({
  title,
  subtitle,
  heroImage,
  callToAction,
  features,
  children,
}) => {
  return (
    <div className="bg-pm-dark">
      {/* Hero Section */}
      <div className="relative h-[90vh] min-h-[700px] text-white overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pm-dark via-pm-dark/60 to-transparent" />
        </motion.div>
        
        <div className="container mx-auto px-6 h-full flex flex-col justify-end pb-24 relative">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-6xl md:text-8xl font-playfair font-bold text-white mb-6"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="text-lg md:text-xl text-pm-off-white/80 max-w-2xl mb-8"
          >
            {subtitle}
          </motion.p>
          {callToAction && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            >
              <button
                onClick={callToAction.onClick}
                className="inline-flex items-center gap-3 px-8 py-4 bg-pm-gold text-pm-dark font-bold text-lg rounded-full hover:bg-white transition-all shadow-lg hover:shadow-pm-gold/20"
              >
                <span>{callToAction.text}</span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Features Section */}
      {features && (
        <div className="bg-pm-dark -mt-20 relative z-10">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-px bg-pm-gold/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-lg">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-black/50 p-8 text-left md:text-center"
                >
                  <feature.icon className="w-10 h-10 text-pm-gold mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-pm-off-white/70">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Children Content */}
      <div className="container mx-auto px-6">
        {children}
      </div>
    </div>
  );
};

export default PublicPageLayout;
