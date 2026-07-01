// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT BADGE DE FORMATION
// ═══════════════════════════════════════════════════════════════════════════

import { Award, Star, Trophy, Flame, Target } from 'lucide-react';
import { TRAINING_CONFIG } from '../config/trainingConfig';

interface TrainingBadgeProps {
  badgeId: string;
  earned?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function TrainingBadge({ 
  badgeId, 
  earned = false, 
  size = 'md',
  showLabel = true 
}: TrainingBadgeProps) {
  
  const badge = TRAINING_CONFIG.BADGES[badgeId as keyof typeof TRAINING_CONFIG.BADGES];
  
  if (!badge) return null;

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 40
  };

  const getIcon = () => {
    switch (badgeId) {
      case 'firstChapter':
        return <Target size={iconSizes[size]} />;
      case 'firstModule':
        return <Award size={iconSizes[size]} />;
      case 'perfectScore':
        return <Star size={iconSizes[size]} />;
      case 'allModules':
        return <Trophy size={iconSizes[size]} />;
      case 'weekStreak':
        return <Flame size={iconSizes[size]} />;
      default:
        return <Award size={iconSizes[size]} />;
    }
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${!earned && 'opacity-40'}`}>
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all ${
          earned
            ? 'bg-gradient-to-br from-pm-gold to-yellow-500 text-white shadow-lg shadow-pm-gold/30'
            : 'bg-white/10 text-white/30 border-2 border-dashed border-white/20'
        }`}
      >
        {earned ? (
          <div className="relative">
            {getIcon()}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
        ) : (
          getIcon()
        )}
      </div>
      
      {showLabel && (
        <div className="text-center">
          <p className={`text-sm font-bold ${earned ? 'text-white' : 'text-white/40'}`}>
            {badge.icon} {badge.name}
          </p>
          <p className="text-xs text-white/40 max-w-[120px]">
            {badge.description}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Composant pour afficher tous les badges
 */
export function BadgeCollection({ earnedBadges }: { earnedBadges: string[] }) {
  const allBadges = Object.keys(TRAINING_CONFIG.BADGES);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-playfair font-bold text-white">
          Badges & Récompenses
        </h3>
        <span className="text-sm text-white/40">
          {earnedBadges.length}/{allBadges.length}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {allBadges.map(badgeId => (
          <TrainingBadge
            key={badgeId}
            badgeId={badgeId}
            earned={earnedBadges.includes(badgeId)}
            size="md"
            showLabel={true}
          />
        ))}
      </div>

      {earnedBadges.length === 0 && (
        <div className="text-center py-8">
          <p className="text-white/40 text-sm">
            Complétez des chapitres et des modules pour gagner des badges !
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Composant pour afficher un badge récemment gagné (notification)
 */
export function BadgeNotification({ 
  badgeId, 
  onClose 
}: { 
  badgeId: string; 
  onClose: () => void;
}) {
  const badge = TRAINING_CONFIG.BADGES[badgeId as keyof typeof TRAINING_CONFIG.BADGES];
  
  if (!badge) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-gradient-to-br from-pm-gold/20 to-yellow-500/20 backdrop-blur-xl border border-pm-gold/30 rounded-2xl p-6 shadow-2xl max-w-sm">
        <div className="flex items-start gap-4">
          <TrainingBadge badgeId={badgeId} earned={true} size="md" showLabel={false} />
          
          <div className="flex-1">
            <p className="text-white font-bold mb-1">
              🎉 Nouveau Badge !
            </p>
            <p className="text-pm-gold font-bold text-lg mb-1">
              {badge.icon} {badge.name}
            </p>
            <p className="text-white/60 text-sm">
              {badge.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
