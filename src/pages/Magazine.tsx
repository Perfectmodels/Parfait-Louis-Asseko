import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Article } from '../types';
import { useData } from '../contexts/DataContext';

const Pagination: React.FC<{ currentPage: number, totalPages: number, onPageChange: (page: number) => void }> = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav aria-label="Pagination" className="flex justify-center items-center gap-4 mt-12 text-pm-off-white">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-black border border-pm-gold/50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pm-gold hover:text-pm-dark transition-colors"
            >
                Précédent
            </button>
            <div className="flex items-center gap-2">
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => onPageChange(number)}
                        className={`w-10 h-10 flex items-center justify-center rounded-md border transition-colors ${
                            currentPage === number 
                                ? 'bg-pm-gold text-pm-dark border-pm-gold' 
                                : 'bg-black border-pm-gold/50 hover:bg-pm-gold/20'
                        }`}
                        aria-current={currentPage === number ? 'page' : undefined}
                    >
                        {number}
                    </button>
                ))}
            </div>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-black border border-pm-gold/50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pm-gold hover:text-pm-dark transition-colors"
            >
                Suivant
            </button>
        </nav>
    );
};


const Magazine: React.FC = () => {
  const { data, isInitialized } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState<string>('Toutes');
  const ARTICLES_PER_PAGE = 9;

  const articles = data?.articles || [];
  const categories = useMemo(() => ['Toutes', ...Array.from(new Set(articles.map(a => a.category).filter(Boolean)))], [articles]);

  let featuredArticle = articles.find(a => a.isFeatured);
  if (!featuredArticle && articles.length > 0) {
    featuredArticle = articles[0]; // Fallback to the first article if none is featured
  }
  
  const otherArticlesBase = articles.filter(a => a.slug !== featuredArticle?.slug);
  const otherArticles = otherArticlesBase.filter(a => category === 'Toutes' || a.category === category);

  const totalPages = Math.ceil(otherArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const currentArticles = otherArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };


  if (!isInitialized) {
      return <div className="min-h-screen flex items-center justify-center text-pm-gold">Chargement du magazine...</div>;
  }

  return (
    <div className="bg-pm-dark text-pm-off-white">
      <SEO 
        title="Magazine | Focus Model 241"
        description="Focus Model 241, le magazine en ligne de Perfect Models Management. Plongez dans les coulisses de la mode gabonaise avec des interviews exclusives, des analyses de tendances et des conseils de pro."
        keywords="magazine mode gabon, focus model 241, interview mannequin, tendances mode afrique, mode libreville"
        image={featuredArticle?.imageUrl}
      />
      <header className="bg-black py-8 border-b-2 border-pm-gold">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-playfair text-pm-gold tracking-widest">FOCUS MODEL 241</h1>
          <p className="text-pm-off-white/80 mt-2">Le magazine de la mode et des talents gabonais.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-sm uppercase tracking-widest border transition-colors ${category === cat ? 'bg-pm-gold text-pm-dark border-pm-gold' : 'bg-transparent text-pm-gold border-pm-gold hover:bg-pm-gold hover:text-pm-dark'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="page-container">
        {/* Featured Article */}
        {featuredArticle && (
          <section className="mb-12 md:mb-16">
            <Link to={`/magazine/${featuredArticle.slug}`} className="group block md:grid md:grid-cols-2 gap-8 items-center content-section">
              <div className="overflow-hidden">
                <img src={featuredArticle.imageUrl} alt={featuredArticle.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-widest text-pm-gold font-bold">{featuredArticle.category}</p>
                <h2 className="text-4xl font-playfair my-3 text-pm-off-white transition-colors group-hover:text-pm-gold">{featuredArticle.title}</h2>
                <p className="text-pm-off-white/70 mb-4">{featuredArticle.excerpt}</p>
                <span className="font-bold text-pm-gold">
                    Lire la suite <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </section>
        )}

        {/* Other Articles Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentArticles.map(article => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
          {totalPages > 1 && (
             <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
          )}

          {/* Newsletter CTA */}
          <div className="content-section mt-12 text-center">
            <h3 className="text-2xl font-playfair text-pm-gold mb-3">Restez informé</h3>
            <p className="text-pm-off-white/80 mb-6">Recevez nos nouveaux articles, interviews et tendances directement dans votre boîte mail.</p>
            <form className="flex flex-col sm:flex-row gap-3 justify-center">
              <label htmlFor="newsletter-email" className="sr-only">Votre email</label>
              <input id="newsletter-email" type="email" required placeholder="Votre email" className="bg-black border border-pm-gold/40 rounded-full px-4 py-2 text-sm w-full sm:w-80 focus:outline-none focus:border-pm-gold focus:ring-2 focus:ring-pm-gold/50" />
              <button type="button" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white transition-colors">S'abonner</button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => (
  <Link to={`/magazine/${article.slug}`} className="group card-base overflow-hidden relative">
    <div className="relative h-96 overflow-hidden">
      <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div>
    </div>
    <div className="absolute bottom-0 left-0 p-6 w-full">
      <p className="text-sm uppercase tracking-widest text-pm-gold font-bold">{article.category}</p>
      <h3 className="text-2xl font-playfair text-pm-off-white mt-2 group-hover:text-pm-gold transition-colors">{article.title}</h3>
      <div className="overflow-hidden max-h-0 group-hover:max-h-40 transition-all duration-500 ease-in-out">
        <p className="text-sm text-pm-off-white/70 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
          {article.excerpt}
        </p>
      </div>
    </div>
  </Link>
);

export default Magazine;
