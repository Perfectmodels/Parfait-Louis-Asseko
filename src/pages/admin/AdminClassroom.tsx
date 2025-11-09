import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Module, Chapter } from '../../types';
import SEO from '../components/SEO';
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronDownIcon, PlusIcon, TrashIcon, SparklesIcon } from '@heroicons/react/24/outline';

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
    return <div className="min-h-screen flex items-center justify-center text-pm-gold">Chargement...</div>;
  }

  const generateSlug = (text: string) => {
      return text.toLowerCase()
                 .replace(/[^a-z0-9\s-]/g, '')
                 .replace(/\s+/g, '-')
                 .slice(0, 50) + '-' + Date.now();
  }

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
      if (window.confirm(`Êtes-vous sûr de vouloir supprimer le module "${course[moduleIndex].title}" ? Cette action est irréversible.`)) {
          const updatedCourse = course.filter((_, index) => index !== moduleIndex);
          setCourse(updatedCourse);
      }
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
      if (window.confirm(`Êtes-vous sûr de vouloir supprimer le chapitre "${course[moduleIndex].chapters[chapterIndex].title}" ?`)) {
          const updatedCourse = [...course];
          updatedCourse[moduleIndex].chapters = updatedCourse[moduleIndex].chapters.filter((_, index) => index !== chapterIndex);
          setCourse(updatedCourse);
      }
  };

  const handleModuleChange = (moduleIndex: number, field: keyof Module, value: any) => {
    const updatedCourse = [...course];
    if (field === 'title') {
        const newSlug = generateSlug(value);
        updatedCourse[moduleIndex] = { ...updatedCourse[moduleIndex], title: value, slug: newSlug };
    } else {
        (updatedCourse[moduleIndex] as any)[field] = value;
    }
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

  const handleSave = () => {
    if (!data || !course) return;
    saveData({ ...data, courseData: course });
    alert("Changements enregistrés avec succès dans la base de données.");
  };

  return (
    <>
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Gérer le Classroom" noIndex />
      <div className="container mx-auto px-6">
        <div className="admin-page-header">
            <div>
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Dashboard
                </Link>
                <h1 className="admin-page-title">Gérer le Classroom Pro</h1>
                <p className="admin-page-subtitle">Modifier les modules, chapitres et quiz de la formation professionnelle.</p>
            </div>
            <div className="flex items-center gap-4">
                 <button onClick={handleAddModule} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full hover:bg-pm-gold hover:text-pm-dark">
                    <PlusIcon className="w-5 h-5"/> Ajouter un Module
                </button>
                <button onClick={handleSave} className="px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-lg shadow-pm-gold/30">
                    Sauvegarder les Changements
                </button>
            </div>
        </div>

        <div className="space-y-4">
          {course.map((module, moduleIndex) => (
            <div key={module.slug} className="admin-section-wrapper !p-0 overflow-hidden">
                 <button
                    onClick={() => setOpenModule(openModule === moduleIndex ? null : moduleIndex)}
                    className="w-full flex justify-between items-center p-4 text-left text-xl font-bold text-pm-gold hover:bg-pm-gold/5"
                >
                    <span>Module {moduleIndex+1}: {module.title}</span>
                    <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${openModule === moduleIndex ? 'rotate-180' : ''}`} />
                </button>
                 <div className={`transition-all duration-500 ease-in-out ${openModule === moduleIndex ? 'max-h-[5000px] visible' : 'max-h-0 invisible'}`}>
                    <div className="p-4 border-t border-pm-gold/20 space-y-6">
                        <div className="flex justify-between items-end gap-4 bg-pm-dark p-4 rounded-md">
                            <div className="flex-grow">
                                <FormInput label="Titre du Module" value={module.title} onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)} />
                            </div>
                            <button onClick={() => handleDeleteModule(moduleIndex)} className="text-red-500/70 hover:text-red-500 p-2"><TrashIcon className="w-5 h-5"/> Supprimer Module</button>
                        </div>
                        
                        <div className="pt-4 border-t border-pm-dark/50">
                             <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-playfair text-pm-gold">Chapitres</h3>
                                <button onClick={() => handleAddChapter(moduleIndex)} className="inline-flex items-center gap-2 px-3 py-1 bg-pm-dark border border-pm-gold/50 text-pm-gold/80 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-pm-gold hover:text-pm-dark">
                                    <PlusIcon className="w-4 h-4"/> Ajouter Chapitre
                                </button>
                             </div>
                            {module.chapters.map((chapter, chapterIndex) => (
                                <div key={chapter.slug} className="p-4 bg-pm-dark space-y-3 border border-pm-off-white/10 mb-4 rounded-md">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-md font-semibold text-pm-off-white/80">Chapitre {chapterIndex + 1}</h4>
                                        <button onClick={() => handleDeleteChapter(moduleIndex, chapterIndex)} className="text-red-500/70 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                    <FormInput label={`Titre du Chapitre`} value={chapter.title} onChange={(e) => handleChapterChange(moduleIndex, chapterIndex, 'title', e.target.value)} />
                                    <FormTextArea label="Contenu du Chapitre" value={chapter.content} onChange={(e) => handleChapterChange(moduleIndex, chapterIndex, 'content', e.target.value)} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

const FormInput: React.FC<{label: string, value: any, onChange: any}> = ({label, value, onChange}) => (
    <div>
        <label className="admin-label">{label}</label>
        <input type="text" value={value} onChange={onChange} className="admin-input" />
    </div>
);
const FormTextArea: React.FC<{label: string, value: any, onChange: any}> = ({label, value, onChange}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label className="admin-label !mb-0">{label}</label>
        </div>
        <textarea value={value} onChange={onChange} rows={10} className="admin-input admin-textarea" />
    </div>
);

export default AdminClassroom;