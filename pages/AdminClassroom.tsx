
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Module } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const AdminClassroom: React.FC = () => {
  const { data, saveData } = useData();
  const [course, setCourse] = useState<Module[] | null>(data?.courseData || null);
  const [openModule, setOpenModule] = useState<number | null>(null);

  if (!course || !data) {
    return <div>Loading...</div>;
  }

  const handleModuleChange = (moduleIndex: number, field: string, value: string) => {
    const updatedCourse = [...course];
    updatedCourse[moduleIndex] = { ...updatedCourse[moduleIndex], [field]: value };
    setCourse(updatedCourse);
  };
  
  const handleChapterChange = (moduleIndex: number, chapterIndex: number, field: string, value: string) => {
    const updatedCourse = [...course];
    updatedCourse[moduleIndex].chapters[chapterIndex] = { ...updatedCourse[moduleIndex].chapters[chapterIndex], [field]: value };
    setCourse(updatedCourse);
  };

  const handleSave = () => {
    if (window.confirm("Êtes-vous sûr de vouloir sauvegarder toutes les modifications du Classroom ?")) {
        saveData({ ...data, courseData: course });
        alert("Contenu du Classroom sauvegardé !");
    }
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Gérer le Classroom" />
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-start mb-8">
            <div>
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Dashboard
                </Link>
                <h1 className="text-4xl font-playfair text-pm-gold">Gérer le Classroom</h1>
            </div>
            <button onClick={handleSave} className="px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white">
                Sauvegarder les Changements
            </button>
        </div>

        <div className="space-y-4">
          {course.map((module, moduleIndex) => (
            <div key={moduleIndex} className="bg-black border border-pm-gold/20 overflow-hidden">
                 <button
                    onClick={() => setOpenModule(openModule === moduleIndex ? null : moduleIndex)}
                    className="w-full flex justify-between items-center p-4 text-left text-xl font-bold text-pm-gold hover:bg-pm-gold/5"
                >
                    <span>Module {moduleIndex+1}: {module.title}</span>
                    <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${openModule === moduleIndex ? 'rotate-180' : ''}`} />
                </button>
                 <div className={`transition-all duration-500 ease-in-out ${openModule === moduleIndex ? 'max-h-full visible' : 'max-h-0 invisible'}`}>
                    <div className="p-4 border-t border-pm-gold/20 space-y-6">
                        <FormInput label="Titre du Module" value={module.title} onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)} />
                        
                        <h3 className="text-lg font-bold text-pm-gold pt-4 border-t border-pm-dark">Chapitres</h3>
                        {module.chapters.map((chapter, chapterIndex) => (
                            <div key={chapterIndex} className="p-4 bg-pm-dark space-y-3">
                                <FormInput label={`Titre du Chapitre ${chapterIndex + 1}`} value={chapter.title} onChange={(e) => handleChapterChange(moduleIndex, chapterIndex, 'title', e.target.value)} />
                                <FormTextArea label="Contenu du Chapitre" value={chapter.content} onChange={(e) => handleChapterChange(moduleIndex, chapterIndex, 'content', e.target.value)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FormInput: React.FC<{label: string, value: any, onChange: any}> = ({label, value, onChange}) => (
    <div>
        <label className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <input type="text" value={value} onChange={onChange} className="w-full bg-pm-dark border border-pm-off-white/20 p-2 focus:outline-none focus:border-pm-gold" />
    </div>
);
const FormTextArea: React.FC<{label: string, value: any, onChange: any}> = ({label, value, onChange}) => (
    <div>
        <label className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <textarea value={value} onChange={onChange} rows={10} className="w-full bg-pm-dark border border-pm-off-white/20 p-2 focus:outline-none focus:border-pm-gold" />
    </div>
);

export default AdminClassroom;