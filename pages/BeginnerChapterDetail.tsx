import React from 'react';
import { Link, useParams } from 'react-router-dom';
import NotFound from './NotFound';
import SEO from '../components/SEO';
import { ChevronLeftIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';
import BeginnerQuiz from '../components/BeginnerQuiz';

const BeginnerChapterDetail: React.FC = () => {
  const { data, isInitialized } = useData();
  const { moduleSlug, chapterSlug } = useParams<{ moduleSlug: string, chapterSlug: string }>();
  
  const module = data?.beginnerCourseData.find(m => m.slug === moduleSlug);
  const chapter = module?.chapters.find(c => c.slug === chapterSlug);

  if (!isInitialized) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }

  if (!chapter || !module) {
    return <NotFound />;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO 
        title={`${chapter.title} | Classroom Débutant`}
        description={`Leçon détaillée sur "${chapter.title}" du module "${module.title}".`}
        noIndex
      />
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex justify-between items-center mb-8 print-hide">
          <Link to="/classroom-debutant" className="inline-flex items-center gap-2 text-pm-gold hover:underline">
            <ChevronLeftIcon className="w-5 h-5" />
            Retour au Classroom Débutant
          </Link>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Télécharger en PDF
          </button>
        </div>
        
        <div className="printable-content">
          <article className="bg-black p-8 md:p-12 border border-pm-gold/20">
            <header>
              <p className="text-sm uppercase tracking-widest text-pm-gold/80 font-bold">{module.title}</p>
              <h1 className="text-4xl lg:text-5xl font-playfair text-pm-off-white my-4 leading-tight">
                {chapter.title}
              </h1>
            </header>
            <div className="mt-8 text-lg text-pm-off-white/80 leading-relaxed">
              {chapter.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </article>
        </div>
        
        {module.quiz && module.quiz.length > 0 && (
            <BeginnerQuiz quiz={module.quiz} moduleSlug={module.slug} chapterSlug={chapter.slug} />
        )}

      </div>
    </div>
  );
};

export default BeginnerChapterDetail;