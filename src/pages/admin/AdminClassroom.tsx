import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Module, Chapter, QuizQuestion } from '../../types';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronDownIcon, PlusIcon, TrashIcon, SparklesIcon, BookOpenIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

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
      return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 50) + '-' + Date.now();
  }

  // --- GESTION DES MODULES ---
  const handleAddModule = () => {
      const newModule: Module = { slug: generateSlug('nouveau-module'), title: 'Nouveau Module', chapters: [], quiz: [] };
      setCourse([...course, newModule]);
  };

  const handleDeleteModule = (moduleIndex: number) => {
      if (window.confirm(`Supprimer le module "${course[moduleIndex].title}" ?`)) {
          setCourse(course.filter((_, index) => index !== moduleIndex));
      }
  };

  const handleModuleChange = (moduleIndex: number, field: keyof Module, value: any) => {
    const updatedCourse = [...course];
    if (field === 'title') {
        updatedCourse[moduleIndex] = { ...updatedCourse[moduleIndex], title: value, slug: generateSlug(value) };
    } else {
        (updatedCourse[moduleIndex] as any)[field] = value;
    }
    setCourse(updatedCourse);
  };

  // --- GESTION DES CHAPITRES ---
  const handleAddChapter = (moduleIndex: number) => {
      const newChapter: Chapter = { slug: generateSlug('nouveau-chapitre'), title: 'Nouveau Chapitre', content: 'Contenu...' };
      const updatedCourse = [...course];
      updatedCourse[moduleIndex].chapters.push(newChapter);
      setCourse(updatedCourse);
  };

  const handleDeleteChapter = (moduleIndex: number, chapterIndex: number) => {
      if (window.confirm(`Supprimer le chapitre "${course[moduleIndex].chapters[chapterIndex].title}" ?`)) {
          const updatedCourse = [...course];
          updatedCourse[moduleIndex].chapters = updatedCourse[moduleIndex].chapters.filter((_, index) => index !== chapterIndex);
          setCourse(updatedCourse);
      }
  };

  const handleChapterChange = (moduleIndex: number, chapterIndex: number, field: keyof Chapter, value: string) => {
    const updatedCourse = [...course];
    const updatedChapters = [...updatedCourse[moduleIndex].chapters];
    if (field === 'title') {
        updatedChapters[chapterIndex] = { ...updatedChapters[chapterIndex], title: value, slug: generateSlug(value) };
    } else {
        (updatedChapters[chapterIndex] as any)[field] = value;
    }
    updatedCourse[moduleIndex].chapters = updatedChapters;
    setCourse(updatedCourse);
  };

  // --- GESTION DES QUIZ ---
  const handleAddQuestion = (moduleIndex: number) => {
      const newQuestion: QuizQuestion = { question: 'Nouvelle question ?', options: ['Option A', 'Option B', 'Option C'], correctAnswer: 'Option A' };
      const updatedCourse = [...course];
      updatedCourse[moduleIndex].quiz = [...(updatedCourse[moduleIndex].quiz || []), newQuestion];
      setCourse(updatedCourse);
  };

  const handleDeleteQuestion = (moduleIndex: number, questionIndex: number) => {
      if (window.confirm("Supprimer cette question ?")) {
        const updatedCourse = [...course];
        updatedCourse[moduleIndex].quiz = updatedCourse[moduleIndex].quiz.filter((_, index) => index !== questionIndex);
        setCourse(updatedCourse);
      }
  };

  const handleQuestionChange = (moduleIndex: number, questionIndex: number, value: string) => {
    const updatedCourse = [...course];
    updatedCourse[moduleIndex].quiz[questionIndex].question = value;
    setCourse(updatedCourse);
  };

  const handleOptionChange = (moduleIndex: number, questionIndex: number, optionIndex: number, value: string) => {
      const updatedCourse = [...course];
      updatedCourse[moduleIndex].quiz[questionIndex].options[optionIndex] = value;
      setCourse(updatedCourse);
  };

  const handleCorrectAnswerChange = (moduleIndex: number, questionIndex: number, value: string) => {
      const updatedCourse = [...course];
      updatedCourse[moduleIndex].quiz[questionIndex].correctAnswer = value;
      setCourse(updatedCourse);
  };

  // --- SAUVEGARDE ---
  const handleSave = () => {
    if (!data || !course) return;
    saveData({ ...data, courseData: course });
    alert("Changements enregistrés avec succès !");
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Gérer le Classroom" noIndex />
      <div className="container mx-auto px-6">
        <div className="admin-page-header">{/* Header... */}</div>
        <div className="space-y-4">
          {course.map((module, moduleIndex) => (
            <div key={module.slug} className="admin-section-wrapper !p-0 overflow-hidden">
                 <button onClick={() => setOpenModule(openModule === moduleIndex ? null : moduleIndex)} className="w-full flex justify-between items-center p-4 text-left text-xl font-bold text-pm-gold hover:bg-pm-gold/5">
                    <span>Module {moduleIndex+1}: {module.title}</span>
                    <ChevronDownIcon className={`w-6 h-6 transition-transform ${openModule === moduleIndex ? 'rotate-180' : ''}`} />
                </button>
                 <div className={`transition-all duration-500 ${openModule === moduleIndex ? 'max-h-[5000px]' : 'max-h-0 overflow-hidden'}`}>
                    <div className="p-4 border-t border-pm-gold/20 space-y-6">
                        <div className="flex justify-between items-end gap-4 bg-pm-dark p-4 rounded-md">
                            <FormInput label="Titre du Module" value={module.title} onChange={(e: any) => handleModuleChange(moduleIndex, 'title', e.target.value)} />
                            <button onClick={() => handleDeleteModule(moduleIndex)} className="text-red-500/70 hover:text-red-500 p-2"><TrashIcon className="w-5 h-5"/> Module</button>
                        </div>
                        
                        {/* Section Chapitres */}
                        <div className="pt-4 border-t border-pm-dark/50">
                             <div className="flex items-center gap-2 text-pm-gold mb-4"><BookOpenIcon className="w-6 h-6"/> <h3 className="text-xl">Chapitres</h3></div>
                             <button onClick={() => handleAddChapter(moduleIndex)} className="action-btn-sm mb-4">Ajouter Chapitre</button>
                            {module.chapters.map((chapter, chapterIndex) => (
                                <div key={chapter.slug} className="p-4 bg-pm-dark space-y-3 border border-pm-off-white/10 mb-4 rounded-md">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-md font-semibold">Chapitre {chapterIndex + 1}</h4>
                                        <button onClick={() => handleDeleteChapter(moduleIndex, chapterIndex)} className="text-red-500/70 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                    <FormInput label="Titre" value={chapter.title} onChange={(e: any) => handleChapterChange(moduleIndex, chapterIndex, 'title', e.target.value)} />
                                    <FormTextArea label="Contenu" value={chapter.content} onChange={(e: any) => handleChapterChange(moduleIndex, chapterIndex, 'content', e.target.value)} />
                                </div>
                            ))}
                        </div>

                        {/* Section Quiz */}
                        <div className="pt-4 border-t border-pm-dark/50">
                            <div className="flex items-center gap-2 text-pm-gold mb-4"><QuestionMarkCircleIcon className="w-6 h-6"/> <h3 className="text-xl">Quiz du Module</h3></div>
                            <button onClick={() => handleAddQuestion(moduleIndex)} className="action-btn-sm mb-4">Ajouter une Question</button>
                            {(module.quiz || []).map((q, qIndex) => (
                                <div key={qIndex} className="p-4 bg-pm-dark space-y-4 border border-pm-off-white/10 mb-4 rounded-md">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold">Question {qIndex + 1}</h4>
                                        <button onClick={() => handleDeleteQuestion(moduleIndex, qIndex)} className="text-red-500/70 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                    <FormTextArea label="Question" value={q.question} onChange={(e: any) => handleQuestionChange(moduleIndex, qIndex, e.target.value)} rows={2} />
                                    {q.options.map((opt, optIndex) => (
                                        <FormInput key={optIndex} label={`Option ${optIndex + 1}`} value={opt} onChange={(e: any) => handleOptionChange(moduleIndex, qIndex, optIndex, e.target.value)} />
                                    ))}
                                    <div>
                                        <label className="admin-label">Bonne réponse</label>
                                        <select value={q.correctAnswer} onChange={(e) => handleCorrectAnswerChange(moduleIndex, qIndex, e.target.value)} className="admin-input">
                                            {q.options.map((opt, optIndex) => (
                                                <option key={optIndex} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
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
  );
};

const FormInput: React.FC<{label: string, value: any, onChange: any}> = ({label, value, onChange}) => (
    <div><label className="admin-label">{label}</label><input type="text" value={value} onChange={onChange} className="admin-input" /></div>
);
const FormTextArea: React.FC<{label: string, value: any, onChange: any, rows?: number}> = ({label, value, onChange, rows=10}) => (
    <div><label className="admin-label">{label}</label><textarea value={value} onChange={onChange} rows={rows} className="admin-input admin-textarea" /></div>
);

export default AdminClassroom;
