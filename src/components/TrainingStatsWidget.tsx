// ═══════════════════════════════════════════════════════════════════════════
// WIDGET STATISTIQUES DE FORMATION - POUR DASHBOARD ADMIN
// ═══════════════════════════════════════════════════════════════════════════

import { BookOpen, Users, Award, TrendingUp, Clock, Target } from 'lucide-react';
import { UserProgress } from '../types/training';
import { TRAINING_MODULES } from '../data/trainingModules';

interface TrainingStatsWidgetProps {
  allProgress?: UserProgress[];
}

export default function TrainingStatsWidget({ allProgress = [] }: TrainingStatsWidgetProps) {
  
  // Calculer les statistiques globales
  const totalUsers = allProgress.length;
  const totalModules = TRAINING_MODULES.length;
  const totalChapters = TRAINING_MODULES.reduce((sum, m) => sum + m.chapters.length, 0);
  
  const activeUsers = allProgress.filter(p => {
    const lastAccess = new Date(p.lastAccessedAt);
    const daysSinceAccess = (Date.now() - lastAccess.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceAccess <= 7; // Actif dans les 7 derniers jours
  }).length;
  
  const completedModules = allProgress.reduce((sum, p) => {
    const module = TRAINING_MODULES.find(m => m.num === p.moduleId);
    if (!module) return sum;
    return sum + (p.completedChapters.length === module.chapters.length ? 1 : 0);
  }, 0);
  
  const totalQuizAttempts = allProgress.reduce((sum, p) => {
    return sum + Object.values(p.quizScores).reduce((s, q) => s + q.attempts, 0);
  }, 0);
  
  const averageScore = allProgress.reduce((sum, p) => {
    const scores = Object.values(p.quizScores).map(q => (q.score / q.total) * 100);
    const userAvg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    return sum + userAvg;
  }, 0) / (totalUsers || 1);
  
  const certificatesEarned = allProgress.filter(p => p.certificateEarned).length;
  
  const completionRate = totalUsers > 0 
    ? (completedModules / (totalUsers * totalModules)) * 100 
    : 0;

  const stats = [
    {
      icon: Users,
      label: 'Utilisateurs actifs',
      value: activeUsers,
      total: totalUsers,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: BookOpen,
      label: 'Modules complétés',
      value: completedModules,
      total: totalUsers * totalModules,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: Target,
      label: 'Taux de complétion',
      value: `${completionRate.toFixed(1)}%`,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Award,
      label: 'Certificats délivrés',
      value: certificatesEarned,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    {
      icon: TrendingUp,
      label: 'Score moyen',
      value: `${averageScore.toFixed(1)}%`,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    },
    {
      icon: Clock,
      label: 'Tentatives de quiz',
      value: totalQuizAttempts,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10'
    }
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-playfair font-bold text-white">
          Statistiques de Formation
        </h3>
        <span className="text-xs text-white/40">
          {totalUsers} utilisateur{totalUsers > 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={`${stat.label}-${idx}`}
            className={`${stat.bgColor} border border-white/10 rounded-xl p-4`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon size={20} className={stat.color} />
              </div>
            </div>
            <div className="text-2xl font-black text-white mb-1">
              {stat.value}
              {stat.total && (
                <span className="text-sm text-white/40 font-normal ml-1">
                  / {stat.total}
                </span>
              )}
            </div>
            <div className="text-xs text-white/60">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Module breakdown */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">
          Progression par module
        </h4>
        <div className="space-y-3">
          {TRAINING_MODULES.map(module => {
            const moduleProgress = allProgress.filter(p => p.moduleId === module.num);
            const completed = moduleProgress.filter(p => 
              p.completedChapters.length === module.chapters.length
            ).length;
            const inProgress = moduleProgress.filter(p => 
              p.completedChapters.length > 0 && p.completedChapters.length < module.chapters.length
            ).length;
            const notStarted = totalUsers - completed - inProgress;

            return (
              <div key={module.num} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Module {module.num}: {module.title}</span>
                  <span className="text-white/40">
                    {completed}/{totalUsers}
                  </span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full flex">
                    <div
                      className="bg-green-500"
                      style={{ width: `${(completed / (totalUsers || 1)) * 100}%` }}
                    />
                    <div
                      className="bg-yellow-500"
                      style={{ width: `${(inProgress / (totalUsers || 1)) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    {completed} complété{completed > 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    {inProgress} en cours
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    {notStarted} non commencé{notStarted > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
