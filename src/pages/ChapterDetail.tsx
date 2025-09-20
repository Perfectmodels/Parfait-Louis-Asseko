import React from 'react';
import { Link, useParams } from 'react-router-dom';
import NotFound from './NotFound';
import SEO from '../components/SEO';
import { ChevronLeftIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';
import { QuizQuestion, Model, Chapter, Module } from '../types';
import QuizComponent from '../components/QuizComponent';

const generateChapterHtml = (chapter: Chapter, module: Module, siteConfig: any): string => {
    const contentHtml = chapter.content.split('\n').map(p => `<p style="margin-bottom: 1em; line-height: 1.6;">${p}</p>`).join('');
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.5; }
                .page { padding: 40px; }
                .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 20px; }
                .header img { height: 50px; }
                .module-title { color: #888; font-size: 14px; text-transform: uppercase; }
                h1 { font-family: 'Times New Roman', Times, serif; font-size: 36px; color: #D4AF37; margin: 0 0 20px 0; }
                .content { font-size: 16px; }
                .footer { margin-top: 40px; padding-top: 10px; border-top: 1px solid #ccc; text-align: center; font-size: 12px; color: #aaa; }
            </style>
        </head>
        <body>
            <div class="page">
                <header class="header">
                    <div>
                        <p class="module-title">${module.title}</p>
                        <h1>${chapter.title}</h1>
                    </div>
                     ${siteConfig?.logo ? `<img src="${siteConfig.logo}" alt="Logo" />` : ''}
                </header>
                <div class="content">
                    ${contentHtml}
                </div>
                <footer class="footer">
                    &copy; ${new Date().getFullYear()} Perfect Models Management - Contenu de formation confidentiel
                </footer>
            </div>
        </body>
        </html>
    `;
};


const ChapterDetail: React.FC = () => {
  const { data, isInitialized } = useData();
  const { moduleSlug, chapterSlug } = useParams<{ moduleSlug: string, chapterSlug: string }>();
  
  const module = data?.courseData.find(m => m.slug === moduleSlug);
  const chapter = module?.chapters.find(c => c.slug === chapterSlug);

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }

  if (!chapter || !module) {
    return <NotFound />;
  }

  const handlePrint = () => {
    if (!data.siteConfig) return;
    const html = generateChapterHtml(chapter, module, data.siteConfig);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    } else {
        alert("Veuillez autoriser les pop-ups pour imprimer le chapitre.");
    }
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO 
        title={`${chapter.title} | PMM Classroom`}
        description={`Leçon détaillée sur "${chapter.title}" du module "${module.title}". Maîtrisez les compétences essentielles du mannequinat avec le programme de formation de Perfect Models Management.`}
        keywords={`apprendre le mannequinat, cours ${chapter.title}, formation ${module.title}, pmm classroom`}
        image={data.siteImages.classroomBg}
      />
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex justify-between items-center mb-8 print-hide">
          <Link to="/formations" className="inline-flex items-center gap-2 text-pm-gold hover:underline">
            <ChevronLeftIcon className="w-5 h-5" />
            Retour au Classroom
          </Link>
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Imprimer / PDF
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
          <QuizComponent quiz={module.quiz} moduleSlug={module.slug} moduleTitle={module.title} />
        )}

      </div>
    </div>
  );
};

export default ChapterDetail;
