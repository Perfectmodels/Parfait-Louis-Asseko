import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import NotFound from './NotFound';
import SEO from '../components/SEO';
import { 
    ChevronLeftIcon, ArrowDownTrayIcon, Bars3Icon, XMarkIcon, 
    BookOpenIcon, AcademicCapIcon, ArrowLeftOnRectangleIcon,
    HomeIcon, ClockIcon, UserIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';
import BeginnerQuiz from '../components/BeginnerQuiz';
import { Chapter, Module } from '../types';

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

const BeginnerChapterDetail: React.FC = () => {
  const { data, isInitialized } = useData();
  const navigate = useNavigate();
  const { moduleSlug, chapterSlug } = useParams<{ moduleSlug: string, chapterSlug: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const module = data?.beginnerCourseData.find(m => m.slug === moduleSlug);
  const chapter = module?.chapters.find(c => c.slug === chapterSlug);
  const userName = sessionStorage.getItem('userName');
  const courseData = data?.beginnerCourseData || [];

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

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-pm-dark">
      <SEO 
        title={`${chapter.title} | Classroom Débutant`}
        description={`Leçon détaillée sur "${chapter.title}" du module "${module.title}".`}
        image={data.siteImages.classroomBg}
        noIndex
      />
      
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-pm-gold/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-pm-gold hover:bg-pm-gold/10 transition-colors"
              >
                {sidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <BookOpenIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-pm-gold">{chapter.title}</h1>
                  <p className="text-xs text-pm-off-white/60">{module.title}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark font-medium rounded-lg hover:bg-pm-gold/90 transition-colors"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                <span className="text-sm">Imprimer</span>
              </button>
              
              {/* User Info */}
              <div className="hidden sm:flex items-center gap-3 text-sm">
                <div className="text-right">
                  <p className="text-pm-gold font-medium">{userName || 'Mannequin'}</p>
                  <p className="text-pm-off-white/60 text-xs">Niveau Débutant</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md text-pm-gold hover:bg-pm-gold/10 transition-colors"
                  title="Déconnexion"
                >
                  <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-black/80 backdrop-blur-sm border-r border-pm-gold/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            <nav className="flex-1 px-4 py-6 space-y-2">
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 mb-4">
                <h3 className="text-sm font-medium text-blue-400 mb-2">Module Actuel</h3>
                <p className="text-xs text-pm-off-white/70">{module.title}</p>
                <p className="text-xs text-pm-off-white/60 mt-1">{chapter.title}</p>
              </div>
              
              <h3 className="text-sm font-medium text-pm-gold mb-3">Navigation</h3>
              <Link 
                to="/classroom-debutant" 
                className="flex items-center gap-3 p-3 rounded-lg text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <ChevronLeftIcon className="w-4 h-4" />
                <span className="text-sm">Retour au Classroom</span>
              </Link>
              
              <h3 className="text-sm font-medium text-pm-gold mb-3 mt-6">Autres Modules</h3>
              {courseData.map((courseModule, index) => (
                <Link
                  key={index}
                  to={`/classroom-debutant/${courseModule.slug}/${courseModule.chapters[0]?.slug || ''}`}
                  className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                    courseModule.slug === module.slug
                      ? 'bg-pm-gold/20 text-pm-gold border border-pm-gold/30'
                      : 'text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <BookOpenIcon className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{courseModule.title}</p>
                    <p className="text-xs opacity-60">{courseModule.chapters.length} chapitres</p>
                  </div>
                </Link>
              ))}
            </nav>
            
            {/* Quick Actions */}
            <div className="p-4 border-t border-pm-gold/20 space-y-2">
              <h3 className="text-sm font-medium text-pm-gold mb-3">Actions</h3>
              <button 
                onClick={handlePrint}
                className="flex items-center gap-3 p-3 rounded-lg text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10 transition-colors w-full text-left"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                <span className="text-sm">Imprimer le chapitre</span>
              </button>
            </div>
          </div>
        </aside>

               {/* Main Content */}
               <main className="flex-1 lg:ml-0">
                 <div className="p-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-pm-off-white/60 mb-4">
              <Link to="/classroom-debutant" className="hover:text-pm-gold transition-colors">
                Classroom Débutant
              </Link>
              <span>/</span>
              <span className="text-pm-gold">{module.title}</span>
              <span>/</span>
              <span className="text-pm-off-white">{chapter.title}</span>
            </div>

            {/* Chapter Content */}
            <div className="max-w-4xl mx-auto">
              <article className="bg-black/50 p-8 border border-pm-gold/20 rounded-lg">
                <header className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <BookOpenIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-widest text-pm-gold/80 font-bold">{module.title}</p>
                      <h1 className="text-3xl lg:text-4xl font-bold text-pm-off-white mt-1">
                        {chapter.title}
                      </h1>
                    </div>
                  </div>
                </header>
                
                <div className="prose prose-lg max-w-none">
                  <div className="text-pm-off-white/80 leading-relaxed space-y-4">
                    {chapter.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-base leading-7">{paragraph}</p>
                    ))}
                  </div>
                </div>
              </article>
              
              {/* Quiz Section */}
              {module.quiz && module.quiz.length > 0 && (
                <div className="mt-8">
                  <BeginnerQuiz quiz={module.quiz} moduleSlug={module.slug} />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default BeginnerChapterDetail;