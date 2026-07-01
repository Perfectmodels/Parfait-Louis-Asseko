// ═══════════════════════════════════════════════════════════════════════════
// TABLEAU DE BORD DE PROGRESSION UTILISATEUR
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { 
  BookOpen, 
  Award, 
  TrendingUp, 
  Calendar,
  Download,
  Upload,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { useTrainingProgress } from '../hooks/useTrainingProgress';
import { TRAINING_MODULES } from '../data/trainingModules';
import { calculateTrainingStats } from '../utils/trainingHelpers';
import ProgressRing, { ProgressBar } from './ProgressRing';
import { BadgeCollection } from './TrainingBadge';

export default function UserProgressDashboard() {
  const {
    allProgress,
    loading,
    earnedBadges,
    resetAllProgress,
    exportProgress,
    importProgress
  } = useTrainingProgress();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <img src="/logo.svg" alt="PMM" className="w-16 h-16 animate-pulse" />
      </div>
    );
  }

  const stats = calculateTrainingStats(allProgress);

  const handleExport = () => {
    const data = exportProgress();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formation-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = importProgress(content);
      
      if (success) {
        setImportError(null);
        alert('Progression importée avec succès !');
      } else {
        setImportError('Erreur lors de l\'importation. Vérifiez le format du fichier.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (showResetConfirm) {
      resetAllProgress();
      setShowResetConfirm(false);
      alert('Progression réinitialisée avec succès.');
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 5000);
    }
  };

  const overallProgress = stats.totalChapters > 0
    ? (stats.completedChapters / stats.totalChapters) * 100
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-playfair font-black text-white mb-2">
          Votre Progression
        </h2>
        <p className="text-white/60">
          Suivez votre parcours de formation et vos accomplissements
        </p>
      </div>

      {/* Overall Progress */}
      <div className="bg-gradient-to-br from-pm-gold/10 to-purple-500/10 border border-pm-gold/20 rounded-3xl p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <ProgressRing
            progress={overallProgress}
            size={160}
            strokeWidth={12}
            showPercentage={true}
            label="Progression globale"
          />
          
          <div className="flex-1 space-y-4 w-full">
            <div className="grid grid-cols-2 gap-4">
              <StatBox
                icon={BookOpen}
                label="Chapitres"
                value={`${stats.completedChapters}/${stats.totalChapters}`}
                color="blue"
              />
              <StatBox
                icon={Award}
                label="Modules"
                value={`${stats.completedModules}/${stats.totalModules}`}
                color="green"
              />
              <StatBox
                icon={TrendingUp}
                label="Score moyen"
                value={`${stats.averageQuizScore.toFixed(0)}%`}
                color="purple"
              />
              <StatBox
                icon={Calendar}
                label="Certificats"
                value={stats.certificatesEarned.toString()}
                color="yellow"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Module Progress */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-playfair font-bold text-white mb-6">
          Progression par Module
        </h3>
        
        <div className="space-y-4">
          {TRAINING_MODULES.map(module => {
            const moduleProgress = allProgress.find(p => p.moduleId === module.num);
            const completedChapters = moduleProgress?.completedChapters.length || 0;
            const totalChapters = module.chapters.length;
            const progress = (completedChapters / totalChapters) * 100;
            const isCompleted = completedChapters === totalChapters;

            return (
              <div key={module.num} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                      isCompleted
                        ? 'bg-green-500/20 text-green-400'
                        : progress > 0
                        ? 'bg-pm-gold/20 text-pm-gold'
                        : 'bg-white/10 text-white/40'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={20} /> : module.num}
                    </div>
                    <div>
                      <p className="text-white font-bold">{module.title}</p>
                      <p className="text-white/40 text-sm">
                        {completedChapters}/{totalChapters} chapitres
                      </p>
                    </div>
                  </div>
                  <span className="text-white/60 text-sm font-bold">
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <ProgressBar progress={progress} height={6} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <BadgeCollection earnedBadges={earnedBadges} />

      {/* Actions */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-playfair font-bold text-white mb-4">
          Gestion de la Progression
        </h3>
        
        {importError && (
          <div className="mb-4 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
            {importError}
          </div>
        )}
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all font-bold"
          >
            <Download size={18} />
            Exporter
          </button>
          
          <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all font-bold cursor-pointer">
            <Upload size={18} />
            Importer
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          
          <button
            onClick={handleReset}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
              showResetConfirm
                ? 'bg-red-500 text-white'
                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            }`}
          >
            <Trash2 size={18} />
            {showResetConfirm ? 'Confirmer la réinitialisation' : 'Réinitialiser'}
          </button>
        </div>
        
        <p className="text-white/40 text-xs mt-4">
          Exportez votre progression pour la sauvegarder ou la transférer sur un autre appareil.
        </p>
      </div>
    </div>
  );
}

function StatBox({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400',
    green: 'bg-green-500/10 text-green-400',
    purple: 'bg-purple-500/10 text-purple-400',
    yellow: 'bg-yellow-500/10 text-yellow-400'
  };

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} />
        <span className="text-xs font-bold uppercase tracking-wider opacity-70">
          {label}
        </span>
      </div>
      <div className="text-2xl font-black">
        {value}
      </div>
    </div>
  );
}
