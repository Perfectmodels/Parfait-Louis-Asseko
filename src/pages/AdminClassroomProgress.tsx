import React, { useState } from 'react';
import SEO from '../../components/SEO';
import { useData } from '../contexts/DataContext';
import { ChartBarIcon, UserGroupIcon, AcademicCapIcon, TrophyIcon } from '@heroicons/react/24/outline';

const AdminClassroomProgress: React.FC = () => {
  const { data } = useData();
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');

  const models = data?.models || [];
  // const courseData = data?.courseData || [];
  const beginnerStudents = data?.beginnerStudents || [];

  // Calculer les statistiques de progression
  const getProgressStats = () => {
    const allUsers = [...models, ...beginnerStudents] as any[];
    const totalUsers = allUsers.length;
    
    let completedChapters = 0;
    let totalChapters = 0;
    let averageScore = 0;
    let totalScores = 0;
    let scoreCount = 0;

    allUsers.forEach(user => {
      if (user.quizScores) {
        Object.values(user.quizScores).forEach((score: any) => {
          totalChapters++;
          if (score.score > 0) {
            completedChapters++;
            totalScores += score.score;
            scoreCount++;
          }
        });
      }
    });

    averageScore = scoreCount > 0 ? Math.round(totalScores / scoreCount) : 0;
    const completionRate = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

    return {
      totalUsers,
      completedChapters,
      totalChapters,
      averageScore,
      completionRate
    };
  };

  const stats = getProgressStats();

  // Filtrer les utilisateurs selon les critères
  const getFilteredUsers = () => {
    let filteredUsers = [...models, ...beginnerStudents] as any[];
    
    if (selectedModel !== 'all') {
      filteredUsers = filteredUsers.filter(user => 
        selectedModel === 'models' ? models.includes(user) : beginnerStudents.includes(user)
      );
    }
    
    return filteredUsers;
  };

  const filteredUsers = getFilteredUsers();

  // Obtenir les chapitres disponibles
  const getAvailableChapters = () => {
    const chapters = new Set<string>();
    filteredUsers.forEach(user => {
      if (user.quizScores) {
        Object.keys(user.quizScores).forEach(chapterSlug => {
          chapters.add(chapterSlug);
        });
      }
    });
    return Array.from(chapters);
  };

  const availableChapters = getAvailableChapters();

  // Obtenir les données de progression pour un utilisateur
  const getUserProgress = (user: any) => {
    if (!user.quizScores) return { completed: 0, total: 0, averageScore: 0 };
    
    const scores = Object.values(user.quizScores) as any[];
    const completed = scores.filter(score => score.score > 0).length;
    const total = scores.length;
    const averageScore = completed > 0 ? Math.round(scores.reduce((sum, score) => sum + score.score, 0) / completed) : 0;
    
    return { completed, total, averageScore };
  };

  // Obtenir les données de progression pour un chapitre
  const getChapterProgress = (chapterSlug: string) => {
    const chapterUsers = filteredUsers.filter(user => 
      user.quizScores && user.quizScores[chapterSlug]
    );
    
    const totalAttempts = chapterUsers.length;
    const completedAttempts = chapterUsers.filter(user => 
      user.quizScores[chapterSlug].score > 0
    ).length;
    
    const averageScore = completedAttempts > 0 ? Math.round(
      chapterUsers.reduce((sum, user) => sum + user.quizScores[chapterSlug].score, 0) / completedAttempts
    ) : 0;
    
    return { totalAttempts, completedAttempts, averageScore };
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Progression Classroom" noIndex />
      <div className="container mx-auto px-6 lg:px-8">
        <header className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Progression Classroom</h1>
            <p className="admin-page-subtitle">Suivre la progression des mannequins et étudiants dans la formation.</p>
          </div>
        </header>

        {/* Statistiques générales */}
        <div className="admin-section-wrapper mb-8">
          <h2 className="admin-section-title">Statistiques Générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-base p-6 text-center">
              <UserGroupIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-pm-gold mb-2">{stats.totalUsers}</h3>
              <p className="text-pm-off-white/70">Utilisateurs Total</p>
            </div>
            
            <div className="card-base p-6 text-center">
              <ChartBarIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-pm-gold mb-2">{stats.completionRate}%</h3>
              <p className="text-pm-off-white/70">Taux de Completion</p>
            </div>
            
            <div className="card-base p-6 text-center">
              <AcademicCapIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-pm-gold mb-2">{stats.completedChapters}</h3>
              <p className="text-pm-off-white/70">Chapitres Complétés</p>
            </div>
            
            <div className="card-base p-6 text-center">
              <TrophyIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-pm-gold mb-2">{stats.averageScore}%</h3>
              <p className="text-pm-off-white/70">Score Moyen</p>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="admin-section-wrapper mb-8">
          <h2 className="admin-section-title">Filtres</h2>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="admin-label">Type d'utilisateur</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="admin-input"
              >
                <option value="all">Tous</option>
                <option value="models">Mannequins</option>
                <option value="students">Étudiants Débutants</option>
              </select>
            </div>
            
            <div>
              <label className="admin-label">Chapitre</label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="admin-input"
              >
                <option value="all">Tous les chapitres</option>
                {availableChapters.map(chapterSlug => (
                  <option key={chapterSlug} value={chapterSlug}>
                    {chapterSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Progression par utilisateur */}
        <div className="admin-section-wrapper mb-8">
          <h2 className="admin-section-title">Progression par Utilisateur</h2>
          <div className="space-y-4">
            {filteredUsers.map((user, index) => {
              const progress = getUserProgress(user);
              const progressPercentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
              
              return (
                <div key={user.id || index} className="card-base p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-pm-gold mb-2">
                        {user.name} {user.username && `(${user.username})`}
                      </h3>
                      <p className="text-pm-off-white/70 mb-2">
                        {user.type === 'model' ? 'Mannequin' : 'Étudiant Débutant'}
                        {user.email && ` • ${user.email}`}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-pm-off-white/70">
                        <span>Chapitres complétés: {progress.completed}/{progress.total}</span>
                        <span>Score moyen: {progress.averageScore}%</span>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between text-sm text-pm-off-white/70 mb-1">
                          <span>Progression</span>
                          <span>{progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-pm-off-white/10 rounded-full h-2">
                          <div 
                            className="bg-pm-gold h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progression par chapitre */}
        <div className="admin-section-wrapper">
          <h2 className="admin-section-title">Progression par Chapitre</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableChapters.map(chapterSlug => {
              const chapterProgress = getChapterProgress(chapterSlug);
              const completionRate = chapterProgress.totalAttempts > 0 
                ? Math.round((chapterProgress.completedAttempts / chapterProgress.totalAttempts) * 100) 
                : 0;
              
              return (
                <div key={chapterSlug} className="card-base p-6">
                  <h3 className="text-lg font-bold text-pm-gold mb-4">
                    {chapterSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-pm-off-white/70">Tentatives</span>
                      <span className="text-pm-off-white">{chapterProgress.totalAttempts}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-pm-off-white/70">Complétées</span>
                      <span className="text-pm-off-white">{chapterProgress.completedAttempts}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-pm-off-white/70">Score moyen</span>
                      <span className="text-pm-off-white">{chapterProgress.averageScore}%</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-pm-off-white/70">Taux de completion</span>
                      <span className="text-pm-gold font-bold">{completionRate}%</span>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-pm-off-white/70 mb-1">
                        <span>Progression</span>
                        <span>{completionRate}%</span>
                      </div>
                      <div className="w-full bg-pm-off-white/10 rounded-full h-2">
                        <div 
                          className="bg-pm-gold h-2 rounded-full transition-all duration-300"
                          style={{ width: `${completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminClassroomProgress;
