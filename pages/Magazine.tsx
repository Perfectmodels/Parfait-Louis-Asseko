import React from 'react';
import SEO from '../components/SEO';

const Magazine: React.FC = () => {
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content - Articles */}
          <div className="lg:col-span-2 space-y-12">
            <ArticleCard
              image="https://i.ibb.co/mCcD1Gfq/DSC-0272.jpg"
              category="Interview"
              title="Noemi Kim : Au-delà du podium"
              excerpt="Plongez dans le parcours inspirant de notre mannequin phare, entre discipline, ambition et passion pour l'art."
            />
            <ArticleCard
              image="https://i.ibb.co/C5rcPJHz/titostyle-53.jpg"
              category="Événement"
              title="Retour sur le Perfect Fashion Day"
              excerpt="Les moments forts, les coulisses et les plus belles créations de l'événement qui a marqué les esprits."
            />
            <ArticleCard
              image="https://i.ibb.co/Rk1fG3ph/farelmd-37.jpg"
              category="Tendance"
              title="L'audace du sur-mesure masculin"
              excerpt="Analyse du style affirmé des créateurs comme Farel MD et Miguel Fashion Style, stars de notre dernier défilé."
            />
             <ArticleCard
              image="https://i.ibb.co/TBt9FBSv/AJC-4630.jpg"
              category="Conseils"
              title="Devenir mannequin : Les clés du succès"
              excerpt="Nos coachs partagent leurs secrets pour réussir un casting, construire son book et développer sa carrière."
            />
          </div>

          {/* Sidebar */}
          <aside>
            <div className="bg-black p-6 border border-pm-gold/20 sticky top-24">
              <h3 className="text-xl font-playfair text-pm-gold mb-4">Catégories</h3>
              <div className="flex flex-wrap gap-2">
                <CategoryBadge>Interviews</CategoryBadge>
                <CategoryBadge>Événements</CategoryBadge>
                <CategoryBadge>Tendances</CategoryBadge>
                <CategoryBadge>Coulisses</CategoryBadge>
                <CategoryBadge>Conseils</CategoryBadge>
              </div>
            
              <div className="mt-8">
               <h3 className="text-xl font-playfair text-pm-gold mb-4">Interviews Vidéo</h3>
               <div className="space-y-4">
                 <div className="aspect-video bg-pm-dark border border-pm-gold/50 flex items-center justify-center text-pm-gold/50">Lecteur Vidéo Minimal</div>
                 <p className="text-center font-bold">"Parfait Asseko : La Vision d'un Fondateur"</p>
               </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

interface ArticleCardProps {
    image: string;
    category: string;
    title: string;
    excerpt: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ image, category, title, excerpt }) => (
    <div className="group bg-pm-off-white text-black flex flex-col md:flex-row gap-6 p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-pm-gold/20">
        <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="md:w-2/3">
            <p className="text-sm uppercase tracking-widest text-pm-gold font-bold">{category}</p>
            <h2 className="text-3xl font-playfair my-2 text-pm-dark">{title}</h2>
            <p className="text-pm-dark/70">{excerpt}</p>
            <a href="#" className="inline-block mt-4 text-pm-gold font-bold group-hover:underline">Lire la suite...</a>
        </div>
    </div>
);

const CategoryBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <button className="px-3 py-1 bg-pm-gold text-pm-dark text-xs font-bold rounded-full hover:bg-white transition-colors">{children}</button>
);


export default Magazine;