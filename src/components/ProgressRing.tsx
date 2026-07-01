// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT ANNEAU DE PROGRESSION
// ═══════════════════════════════════════════════════════════════════════════

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  label?: string;
}

export default function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#D4AF37',
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
  showPercentage = true,
  label
}: ProgressRingProps) {
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className="text-2xl font-black text-white">
            {Math.round(progress)}%
          </span>
        )}
        {label && (
          <span className="text-xs text-white/60 mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Composant pour afficher plusieurs anneaux de progression
 */
export function MultiProgressRing({ 
  items 
}: { 
  items: Array<{ label: string; progress: number; color: string }> 
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      {items.map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <ProgressRing
            progress={item.progress}
            color={item.color}
            size={100}
            strokeWidth={6}
            showPercentage={true}
          />
          <span className="text-sm text-white/70 font-medium">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Composant de barre de progression linéaire
 */
export function ProgressBar({
  progress,
  height = 8,
  color = '#D4AF37',
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
  showPercentage = false,
  animated = true
}: {
  progress: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  animated?: boolean;
}) {
  return (
    <div className="w-full">
      <div 
        className="w-full rounded-full overflow-hidden"
        style={{ 
          height: `${height}px`,
          backgroundColor 
        }}
      >
        <div
          className={`h-full rounded-full ${animated ? 'transition-all duration-500 ease-out' : ''}`}
          style={{
            width: `${progress}%`,
            backgroundColor: color
          }}
        />
      </div>
      
      {showPercentage && (
        <div className="flex items-center justify-between mt-2 text-xs text-white/60">
          <span>Progression</span>
          <span className="font-bold text-white">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
}

/**
 * Composant de progression par étapes
 */
export function StepProgress({
  steps,
  currentStep
}: {
  steps: string[];
  currentStep: number;
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  index < currentStep
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                    ? 'bg-pm-gold text-pm-dark'
                    : 'bg-white/10 text-white/40'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className={`text-xs mt-2 text-center max-w-[80px] ${
                index <= currentStep ? 'text-white' : 'text-white/40'
              }`}>
                {step}
              </span>
            </div>

            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    index < currentStep ? 'bg-green-500 w-full' : 'w-0'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
