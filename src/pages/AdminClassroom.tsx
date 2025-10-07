import React, { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Module, Chapter } from '../types';
import SEO from '../components/SEO';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import AdminCard from '../components/admin/AdminCard';

const AdminClassroom: React.FC = () => {
  const { data, saveData, isInitialized } = useData();
  const [course, setCourse] = useState<Module[] | null>(null);
  const [openModule, setOpenModule] = useState<number | null>(null);

  useEffect(() => {
    if (isInitialized && data?.courseData) {
      setCourse(JSON.parse(JSON.stringify(data.courseData)));
      setOpenModule(0);
    }
  }, [isInitialized, data?.courseData]);

  if (!course || !data) {
    return (
      <AdminLayout>
        <SEO title="Admin - Gérer le Classroom" noIndex />
        <div className="text-pm-gold">Chargement...</div>
      </AdminLayout>
    );
  }

  const generateSlug = (text: string) => {
      return text.toLowerCase()
                 .replace(/[^a-z0-9\s-]/g, '')
                 .replace(/\s+/g, '-')
                 .slice(0, 50) + '-' + Date.now();
  };

  const handleAddModule = () => {
      const newModule: Module = {
          slug: generateSlug('nouveau-module'),
          title: 'Nouveau Module',
          chapters: [],
          quiz: []
      };
      setCourse([...course, newModule]);
  };

  const handleDeleteModule = (moduleIndex: number) => {
    if (!window.confirm(`Supprimer le module "${course[moduleIndex].title}" ?`)) return;
          const updatedCourse = course.filter((_, index) => index !== moduleIndex);
          setCourse(updatedCourse);
  };

  const handleAddChapter = (moduleIndex: number) => {
      const newChapter: Chapter = {
          slug: generateSlug('nouveau-chapitre'),
          title: 'Nouveau Chapitre',
          content: 'Contenu à rédiger...'
      };
      const updatedCourse = [...course];
      updatedCourse[moduleIndex].chapters.push(newChapter);
      setCourse(updatedCourse);
  };

  const handleDeleteChapter = (moduleIndex: number, chapterIndex: number) => {
    if (!window.confirm(`Supprimer le chapitre "${course[moduleIndex].chapters[chapterIndex].title}" ?`)) return;
          const updatedCourse = [...course];
    updatedCourse[moduleIndex].chapters = updatedCourse[moduleIndex].chapters.filter((_, i) => i !== chapterIndex);
          setCourse(updatedCourse);
  };

  const handleModuleChange = (moduleIndex: number, title: string) => {
    const updatedCourse = [...course];
    const newSlug = generateSlug(title);
    updatedCourse[moduleIndex] = { ...updatedCourse[moduleIndex], title, slug: newSlug };
    setCourse(updatedCourse);
  };
  
  const handleChapterChange = (moduleIndex: number, chapterIndex: number, field: keyof Chapter, value: string) => {
    const updatedCourse = [...course];
    const updatedChapters = [...updatedCourse[moduleIndex].chapters];
    if (field === 'title') {
        const newSlug = generateSlug(value);
        updatedChapters[chapterIndex] = { ...updatedChapters[chapterIndex], title: value, content: updatedChapters[chapterIndex].content, slug: newSlug };
    } else {
        (updatedChapters[chapterIndex] as any)[field] = value;
    }
    updatedCourse[moduleIndex].chapters = updatedChapters;
    setCourse(updatedCourse);
  };

  const handleSave = async () => {
    if (!data || !course) return;
    await saveData({ ...data, courseData: course });
    alert('Changements enregistrés dans la base de données.');
  };

  return (
    <AdminLayout>
      <SEO title="Admin - Gérer le Classroom" noIndex />
      <AdminPageHeader
        title="Gérer le Classroom Pro"
        subtitle="Modifier les modules, chapitres et quiz de la formation professionnelle."
        right={(
          <button onClick={handleSave} className="px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white">
                    Sauvegarder les Changements
                </button>
        )}
      />

      <AdminSection title="Modules">
        <AdminCard className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={handleAddModule} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full hover:bg-pm-gold hover:text-pm-dark">
              <PlusIcon className="w-5 h-5" /> Ajouter un Module
            </button>
        </div>

        <div className="space-y-4">
          {course.map((module, moduleIndex) => (
            <div key={module.slug} className="admin-section-wrapper !p-0 overflow-hidden">
                <button onClick={() => setOpenModule(openModule === moduleIndex ? null : moduleIndex)} className="w-full flex justify-between items-center p-4 text-left text-xl font-bold text-pm-gold hover:bg-pm-gold/5">
                  <span>Module {moduleIndex + 1}: {module.title}</span>
                </button>
                <div className={`${openModule === moduleIndex ? 'block' : 'hidden'}`}>
                    <div className="p-4 border-t border-pm-gold/20 space-y-6">
                        <div className="flex justify-between items-end gap-4 bg-pm-dark p-4 rounded-md">
                            <div className="flex-grow">
                        <label className="admin-label">Titre du Module</label>
                        <input type="text" value={module.title} onChange={(e) => handleModuleChange(moduleIndex, e.target.value)} className="admin-input" />
                            </div>
                      <button onClick={() => handleDeleteModule(moduleIndex)} className="text-red-500/70 hover:text-red-500 p-2">
                        <TrashIcon className="w-5 h-5" /> Supprimer Module
                      </button>
                        </div>
                        
                        <div className="pt-4 border-t border-pm-dark/50">
                             <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-playfair text-pm-gold">Chapitres</h3>
                                <button onClick={() => handleAddChapter(moduleIndex)} className="inline-flex items-center gap-2 px-3 py-1 bg-pm-dark border border-pm-gold/50 text-pm-gold/80 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-pm-gold hover:text-pm-dark">
                          <PlusIcon className="w-4 h-4" /> Ajouter Chapitre
                                </button>
                             </div>
                            {module.chapters.map((chapter, chapterIndex) => (
                                <div key={chapter.slug} className="p-4 bg-pm-dark space-y-3 border border-pm-off-white/10 mb-4 rounded-md">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-md font-semibold text-pm-off-white/80">Chapitre {chapterIndex + 1}</h4>
                            <button onClick={() => handleDeleteChapter(moduleIndex, chapterIndex)} className="text-red-500/70 hover:text-red-500">
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                          <div>
                            <label className="admin-label">Titre du Chapitre</label>
                            <input type="text" value={chapter.title} onChange={(e) => handleChapterChange(moduleIndex, chapterIndex, 'title', e.target.value)} className="admin-input" />
                          </div>
                          <div>
                            <label className="admin-label">Contenu du Chapitre</label>
                            <textarea value={chapter.content} onChange={(e) => handleChapterChange(moduleIndex, chapterIndex, 'content', e.target.value)} rows={8} className="admin-input admin-textarea" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          ))}
        </div>
        </AdminCard>
      </AdminSection>
    </AdminLayout>
  );
};

export default AdminClassroom;


