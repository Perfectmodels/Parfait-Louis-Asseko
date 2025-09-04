

import React from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

const AdminClassroomProgress: React.FC = () => {
    const { data } = useData();
    const models = data?.models || [];
    const courseModulesWithQuizzes = data?.courseData.filter(m => m.quiz && m.quiz.length > 0) || [];

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400 bg-green-500/10';
        if (score >= 50) return 'text-yellow-400 bg-yellow-500/10';
        return 'text-red-400 bg-red-500/10';
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Suivi Classroom" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Tableau de Bord
                </Link>
                <h1 className="text-4xl font-playfair text-pm-gold mb-2">Suivi de Progression Classroom</h1>
                <p className="text-pm-off-white/70 mb-8">
                    Consultez les scores des mannequins aux quiz des différents modules de formation.
                </p>

                <div className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden shadow-lg shadow-black/30">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-pm-dark/50">
                                <tr className="border-b border-pm-gold/20">
                                    <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70 sticky left-0 bg-pm-dark/50 z-10">Nom du Mannequin</th>
                                    {courseModulesWithQuizzes.map(module => (
                                        <th key={module.slug} className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70 text-center whitespace-nowrap">{module.title}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {models.map(model => (
                                    <tr key={model.id} className="border-b border-pm-dark hover:bg-pm-dark/50 [&:nth-child(even)]:bg-pm-dark/30 group">
                                        <td className="p-4 font-semibold sticky left-0 bg-black group-hover:bg-pm-dark/50 z-10">{model.name}</td>
                                        {courseModulesWithQuizzes.map(module => {
                                            const score = model.quizScores?.[module.slug];
                                            return (
                                                <td key={module.slug} className="p-4 text-center">
                                                    {score !== undefined ? (
                                                        <span className={`px-2 py-1 text-sm font-bold rounded ${getScoreColor(score)}`}>{score}%</span>
                                                    ) : (
                                                        <span className="text-xs text-pm-off-white/50">N/A</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {models.length === 0 && <p className="text-center p-8 text-pm-off-white/60">Aucun mannequin trouvé.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminClassroomProgress;