import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, SignalIcon, CheckCircleIcon, XCircleIcon, AcademicCapIcon, ClockIcon, TrophyIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const AdminClassroomProgress: React.FC = () => {
  const { data } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update time every 10 seconds to refresh "connected" status
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const models = data?.models || [];
  const beginnerStudents = data?.beginnerStudents || [];
  const courseData = data?.courseData || [];

  // Helper: Check if user is connected (active in last 5 minutes)
  const isConnected = (lastActivity?: string) => {
    if (!lastActivity) return false;
    const fiveMinutesAgo = currentTime - 5 * 60 * 1000;
    return new Date(lastActivity).getTime() > fiveMinutesAgo;
  };

  // Combine all users (models + beginners)
  const allUsers = [
    ...models.map(m => ({ ...m, type: 'pro' as const })),
    ...beginnerStudents.map(b => ({ ...b, type: 'beginner' as const }))
  ];

  // Filter and calculate data for each user
  const usersWithProgress = allUsers.map(user => {
    const quizScores = user.quizScores || {};
    const quizEntries = Object.entries(quizScores);
    
    const totalQuizzes = quizEntries.length;
    const passedQuizzes = quizEntries.filter(([_, quiz]) => 
      (quiz.score / quiz.total) >= 0.5
    ).length;
    
    const averageScore = totalQuizzes > 0
      ? (quizEntries.reduce((sum, [_, quiz]) => 
          sum + (quiz.score / quiz.total) * 100, 0) / totalQuizzes)
      : 0;

    const connected = isConnected(user.lastActivity);

    return {
      id: user.id,
      name: user.name,
      email: (user as any).email || '',
      type: user.type,
      quizScores,
      totalQuizzes,
      passedQuizzes,
      averageScore: Math.round(averageScore),
      lastActivity: user.lastActivity,
      lastLogin: user.lastLogin,
      connected
    };
  });

  // Apply filters
  const filteredUsers = usersWithProgress.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = 
      activeFilter === 'all' ||
      (activeFilter === 'connected' && user.connected) ||
      (activeFilter === 'pro' && user.type === 'pro') ||
      (activeFilter === 'beginner' && user.type === 'beginner');

    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const stats = {
    totalUsers: allUsers.length,
    connectedUsers: usersWithProgress.filter(u => u.connected).length,
    totalQuizzes: usersWithProgress.reduce((sum, u) => sum + u.totalQuizzes, 0),
    avgScore: usersWithProgress.length > 0
      ? Math.round(usersWithProgress.reduce((sum, u) => sum + u.averageScore, 0) / usersWithProgress.length)
      : 0
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Suivi Classroom" noIndex />
      <div className="container mx-auto px-6">
        <div className="admin-page-header">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
              <ChevronLeftIcon className="w-5 h-5" />
              Retour au Tableau de Bord
            </Link>
            <h1 className="admin-page-title">Suivi Formation & Classroom</h1>
            <p className="admin-page-subtitle">
              Suivez en temps réel les mannequins connectés et leurs résultats de quiz
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="bg-pm-dark/30 border border-pm-gold/20 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <UserGroupIcon className="w-10 h-10 text-pm-gold" />
              <div>
                <p className="text-3xl font-bold text-pm-gold">{stats.totalUsers}</p>
                <p className="text-pm-off-white/70 text-sm">Total Mannequins</p>
              </div>
            </div>
          </div>

          <div className="bg-pm-dark/30 border border-green-500/20 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <SignalIcon className="w-10 h-10 text-green-400 animate-pulse" />
              <div>
                <p className="text-3xl font-bold text-green-400">{stats.connectedUsers}</p>
                <p className="text-pm-off-white/70 text-sm">Connectés Maintenant</p>
              </div>
            </div>
          </div>

          <div className="bg-pm-dark/30 border border-pm-gold/20 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AcademicCapIcon className="w-10 h-10 text-pm-gold" />
              <div>
                <p className="text-3xl font-bold text-pm-gold">{stats.totalQuizzes}</p>
                <p className="text-pm-off-white/70 text-sm">Quiz Complétés</p>
              </div>
            </div>
          </div>

          <div className="bg-pm-dark/30 border border-pm-gold/20 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <TrophyIcon className="w-10 h-10 text-pm-gold" />
              <div>
                <p className="text-3xl font-bold text-pm-gold">{stats.avgScore}%</p>
                <p className="text-pm-off-white/70 text-sm">Score Moyen</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="🔍 Rechercher un mannequin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[250px] px-4 py-2 bg-pm-dark/50 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold"
          />
          
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'Tous', count: allUsers.length },
              { id: 'connected', label: '🟢 Connectés', count: stats.connectedUsers },
              { id: 'pro', label: 'Pro', count: models.length },
              { id: 'beginner', label: 'Débutants', count: beginnerStudents.length }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-pm-gold text-pm-dark'
                    : 'bg-pm-dark/50 text-pm-off-white/70 border border-pm-gold/20 hover:border-pm-gold/50'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* User List */}
        <div className="mt-8 space-y-4">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-pm-dark/30 border border-pm-gold/20 rounded-lg p-6 hover:border-pm-gold/40 transition-colors">
              <div className="flex items-start justify-between gap-4">
                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-pm-off-white">{user.name}</h3>
                    {user.connected && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                        <SignalIcon className="w-3 h-3 animate-pulse" />
                        En ligne
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.type === 'pro' 
                        ? 'bg-pm-gold/20 text-pm-gold border border-pm-gold/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {user.type === 'pro' ? 'Pro' : 'Débutant'}
                    </span>
                  </div>

                  {user.email && <p className="text-pm-off-white/60 text-sm mb-4">{user.email}</p>}

                  {/* Quiz Scores Grid */}
                  {user.totalQuizzes > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(user.quizScores).map(([chapterSlug, quiz]) => {
                        const percentage = Math.round((quiz.score / quiz.total) * 100);
                        const passed = percentage >= 50;
                        
                        return (
                          <div key={chapterSlug} className="bg-pm-dark/50 border border-pm-gold/10 rounded p-3">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <p className="text-xs text-pm-off-white/70 line-clamp-2 flex-1">
                                {chapterSlug.replace(/-/g, ' ')}
                              </p>
                              {passed ? (
                                <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                              ) : (
                                <XCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-end justify-between">
                              <span className={`text-2xl font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>
                                {percentage}%
                              </span>
                              <span className="text-xs text-pm-off-white/50">
                                {quiz.score}/{quiz.total}
                              </span>
                            </div>
                            {quiz.timesLeft !== undefined && quiz.timesLeft < 3 && (
                              <p className="text-xs text-orange-400 mt-1">
                                {quiz.timesLeft} essai(s) restant(s)
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-pm-off-white/50 text-sm">
                      Aucun quiz complété
                    </div>
                  )}
                </div>

                {/* Stats Summary */}
                <div className="flex flex-col gap-3 min-w-[150px]">
                  <div className="bg-pm-dark/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-pm-off-white/60 mb-1">Score Moyen</p>
                    <p className={`text-2xl font-bold ${
                      user.averageScore >= 75 ? 'text-green-400' :
                      user.averageScore >= 50 ? 'text-pm-gold' : 'text-red-400'
                    }`}>
                      {user.averageScore}%
                    </p>
                  </div>
                  
                  <div className="bg-pm-dark/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-pm-off-white/60 mb-1">Quiz Réussis</p>
                    <p className="text-lg font-bold text-pm-gold">
                      {user.passedQuizzes}/{user.totalQuizzes}
                    </p>
                  </div>

                  {user.lastActivity && (
                    <div className="bg-pm-dark/50 rounded-lg p-3">
                      <p className="text-xs text-pm-off-white/60 mb-1 flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        Dernière activité
                      </p>
                      <p className="text-xs text-pm-off-white">
                        {new Date(user.lastActivity).toLocaleDateString('fr-FR', { 
                          day: '2-digit', 
                          month: 'short' 
                        })}
                      </p>
                      <p className="text-xs text-pm-off-white/70">
                        {new Date(user.lastActivity).toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center py-16 text-pm-off-white/60">
              <UserGroupIcon className="w-16 h-16 mx-auto mb-4 text-pm-gold/30" />
              <p className="text-lg">Aucun mannequin trouvé</p>
              <p className="text-sm mt-2">Essayez de modifier vos filtres de recherche</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminClassroomProgress;

