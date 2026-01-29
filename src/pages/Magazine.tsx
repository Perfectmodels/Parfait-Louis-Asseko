import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { motion } from 'framer-motion';

const Magazine: React.FC = () => {
  const { data, isInitialized } = useData();
  const articles = data?.articles || [];

  if (!isInitialized) return <div className="h-screen bg-pm-dark"></div>;

  const featured = articles.find(a => a.isFeatured) || articles[0];
  const others = articles.filter(a => a.slug !== featured?.slug);

  return (
    <div className="bg-pm-dark pt-20">
      <SEO title="Focus Model 241 | Magazine" description="Editorial mode by PMM." />
      
      <header className="page-container !pb-12 text-center">
         <span className="section-label">Editorial</span>
         <h1 className="text-6xl md:text-9xl font-playfair font-black gold-gradient-text uppercase tracking-tighter">
            Focus Model 241
         </h1>
      </header>

      {/* Featured Story */}
      {featured && (
        <section className="max-w-[1800px] mx-auto px-6 mb-32">
          <Link to={`/magazine/${featured.slug}`} className="group relative block h-[80vh] overflow-hidden">
            <img src={featured.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={featured.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-pm-dark via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-12 lg:p-20 max-w-4xl">
              <span className="text-pm-gold text-sm font-bold uppercase tracking-[0.3em] mb-4 block">{featured.category}</span>
              <h2 className="text-5xl md:text-8xl font-playfair font-black text-white leading-none mb-8">{featured.title}</h2>
              <p className="text-xl text-white/60 font-light max-w-2xl mb-12">{featured.excerpt}</p>
              <div className="btn-premium inline-block">Lire l'histoire</div>
            </div>
          </Link>
        </section>
      )}

      {/* Articles Grid */}
      <section className="page-container !pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {others.map((article, index) => (
            <motion.div 
              key={article.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
                <Link to={`/magazine/${article.slug}`} className="group block space-y-6">
                    <div className="relative aspect-[4/5] overflow-hidden bg-pm-gray">
                        <img src={article.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={article.title} />
                        <div className="absolute inset-0 bg-pm-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    </div>
                    <div className="space-y-3">
                        <span className="text-pm-gold text-[10px] font-black uppercase tracking-[0.3em]">{article.category}</span>
                        <h3 className="text-3xl font-playfair font-bold text-white group-hover:text-pm-gold transition-colors duration-500">{article.title}</h3>
                        <p className="text-sm text-white/40 line-clamp-3">{article.excerpt}</p>
                    </div>
                </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Magazine;