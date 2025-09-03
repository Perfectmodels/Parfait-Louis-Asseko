import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import TestimonialCarousel from '../components/TestimonialCarousel';
import { useData } from '../contexts/DataContext';


const Home: React.FC = () => {
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }

  const { agencyInfo, agencyPartners, fashionDayEvents, articles } = data;

  const magazineArticlesPreview = articles.slice(0, 3).map(article => ({
      image: article.imageUrl,
      category: article.category,
      title: article.title,
      link: `/magazine/${article.slug}`
  }));

  return (
    <div className="text-pm-off-white">
      <SEO 
        title="Accueil"
        description="Agence de mannequins à Libreville, Gabon. Découvrez nos talents, événements exclusifs comme le Perfect Fashion Day, et notre magazine Focus Model 241."
        keywords="agence de mannequins, mannequin Gabon, Perfect Models Management, mode Libreville, casting mannequin"
      />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center bg-cover bg-center bg-[url('https://i.ibb.co/vvc0k6TQ/titostyle-36.jpg')] bg-fixed">
        <div className="absolute inset-0 bg-pm-dark/80"></div>
        <div className="relative z-10 p-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair text-pm-gold font-extrabold leading-tight tracking-tighter" style={{ textShadow: '0 0 15px rgba(212, 175, 55, 0.7)' }}>
            L'Élégance Redéfinie
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-pm-off-white/90">
            Découvrez une nouvelle ère de la mode où talent, professionnalisme et culture se rencontrent.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link to="/mannequins" className="w-full sm:w-auto px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-pm-gold/30 hover:scale-105 transform">
                Découvrir nos mannequins
            </Link>
            <Link to="/casting" className="w-full sm:w-auto px-10 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest rounded-full text-center transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark hover:scale-105 transform">
                Rejoindre l'agence
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Preview */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 p-2 border-2 border-pm-gold/50 hover:border-pm-gold transition-all duration-300">
              <img src="https://i.ibb.co/hR9Sfy5Q/agstyle-15.jpg" alt="Perfect Models Management" className="w-full h-full object-cover"/>
            </div>
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-4xl font-playfair text-pm-gold mb-4">Perfect Models Management</h2>
              <p className="text-pm-off-white/80 mb-8 leading-relaxed">
                {agencyInfo.about.p1}
              </p>
              <Link to="/agence" className="px-10 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest rounded-full text-center transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark">
                Découvrir l'agence
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 bg-pm-dark">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-playfair text-pm-gold text-center mb-4">Ce qu'ils disent de nous</h2>
          <p className="text-center max-w-2xl mx-auto text-pm-off-white/80 mb-12">
            La confiance et le succès de nos talents et partenaires sont notre plus grande fierté.
          </p>
          <TestimonialCarousel />
        </div>
      </section>
      
      {/* Perfect Fashion Day Preview */}
      <section className="py-24 bg-cover bg-center bg-fixed bg-[url('https://i.ibb.co/LDm73BY2/ventex-44.jpg')]">
        <div className="container mx-auto px-6 text-center bg-black/80 py-12 backdrop-blur-sm">
            <h2 className="text-4xl font-playfair text-pm-gold mb-4">Perfect Fashion Day</h2>
            <p className="text-pm-off-white/80 max-w-3xl mx-auto mb-8">
                {fashionDayEvents.find(e => e.edition === 2)?.description}
            </p>
            <Link to="/fashion-day" className="px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-pm-gold/30 hover:scale-105 transform">
                Découvrir l'événement
            </Link>
        </div>
      </section>

      {/* Magazine Preview */}
      <section className="py-20 bg-pm-dark">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-playfair text-pm-gold text-center mb-4">Magazine Focus</h2>
          <p className="text-center max-w-2xl mx-auto text-pm-off-white/80 mb-12">
              Plongez dans l'univers de la mode avec nos articles exclusifs, interviews et analyses de tendances.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {magazineArticlesPreview.map(article => (
              <Link to={article.link} key={article.title} className="group block bg-black border border-pm-gold/20 overflow-hidden relative shadow-lg shadow-black/30 hover:border-pm-gold hover:shadow-xl hover:shadow-pm-gold/20">
                <div className="relative h-80 overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-6 transition-transform duration-300 group-hover:-translate-y-2">
                  <p className="text-sm uppercase tracking-widest text-pm-gold font-bold">{article.category}</p>
                  <h3 className="text-xl font-playfair text-pm-off-white mt-2">{article.title}</h3>
                </div>
              </Link>
            ))}
          </div>
           <div className="text-center mt-12">
              <Link to="/magazine" className="px-10 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest rounded-full text-center transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark">
                  Lire le magazine
              </Link>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
       <section className="py-20 bg-black text-center">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-playfair text-pm-gold mb-4">Devenez le Prochain Visage de la Mode</h2>
                <p className="text-pm-off-white/80 max-w-2xl mx-auto mb-8">
                    Prêt à lancer votre carrière ? Nous sommes toujours à la recherche de nouveaux talents.
                </p>
                <Link to="/casting" className="px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-pm-gold/30 hover:scale-105 transform">
                    Postuler maintenant
                </Link>
            </div>
        </section>

      {/* Partners */}
      <section className="py-16 bg-pm-dark">
          <div className="container mx-auto px-6 text-center">
              <h3 className="text-sm uppercase tracking-widest text-pm-off-white/50 mb-8">Nos Partenaires de Confiance</h3>
              <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
                  {agencyPartners.slice(0, 5).map(partner => (
                      <p key={partner} className="text-lg font-semibold text-pm-off-white/70 transition-colors hover:text-pm-gold">{partner}</p>
                  ))}
              </div>
          </div>
      </section>
    </div>
  );
};

export default Home;