import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Article } from '../types';
import { useData } from '../contexts/DataContext';

const Magazine: React.FC = () => {
  const { data, isInitialized } = useData();
  const articles = data?.articles || [];

  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  if (!isInitialized) {
      return <div className="min-h-screen flex items-center justify-center text-pm-gold">Chargement du magazine...</div>;
  }

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO 
        title="Magazine Focus Model 241"
        description="Plongez dans l'univers de la mode gabonaise avec le magazine Focus Model 241. Interviews exclusives, tendances, et coulisses des événements."
        keywords="magazine mode Gabon, Focus Model 241, interview mannequin, tendances mode africaine"
      />
      <header className="bg-black py-8 border-b-2 border-pm-gold">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-playfair text-pm-gold tracking-widest">FOCUS MODEL 241</h1>
          <p className="text-pm-off-white/80 mt-2">Le magazine de la mode et des talents gabonais.</p>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16">
        {/* Featured Article */}
        {featuredArticle && (
          <section className="mb-16">
            <Link to={`/magazine/${featuredArticle.slug}`} className="group block md:grid md:grid-cols-2 gap-8 items-center bg-black border border-pm-gold/20 p-6">
              <div className="overflow-hidden">
                <img src={featuredArticle.imageUrl} alt={featuredArticle.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-widest text-pm-gold font-bold">{featuredArticle.category}</p>
                <h2 className="text-4xl font-playfair my-3 text-pm-off-white transition-colors group-hover:text-pm-gold">{featuredArticle.title}</h2>
                <p className="text-pm-off-white/70 mb-4">{featuredArticle.excerpt}</p>
                <span className="font-bold text-pm-gold group-hover:underline">Lire la suite...</span>
              </div>
            </Link>
          </section>
        )}

        {/* Other Articles Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherArticles.map(article => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => (
  <Link to={`/magazine/${article.slug}`} className="group block bg-black border border-pm-gold/20 overflow-hidden transition-all duration-300 hover:border-pm-gold hover:shadow-lg hover:shadow-pm-gold/20">
    <div className="relative h-64 overflow-hidden">
      <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
    </div>
    <div className="p-6">
      <p className="text-sm uppercase tracking-widest text-pm-gold font-bold">{article.category}</p>
      <h3 className="text-xl font-playfair text-pm-off-white mt-2 transition-colors group-hover:text-pm-gold">{article.title}</h3>
      <p className="text-sm text-pm-off-white/70 mt-2">{article.excerpt}</p>
      <span className="block mt-4 font-bold text-sm text-pm-gold/80 group-hover:text-pm-gold group-hover:underline">Lire la suite...</span>
    </div>
  </Link>
);

export default Magazine;