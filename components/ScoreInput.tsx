import React, { useMemo } from 'react';

interface ScoreInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
}

const SCORES = Array.from({ length: 21 }, (_, i) => i * 0.5); // [0, 0.5, 1, ..., 10]

const ScoreInput: React.FC<ScoreInputProps> = ({ label, value, onChange }) => {
    
    const description = useMemo(() => {
        if (value >= 9) return 'Excellent';
        if (value >= 7.5) return 'Très Bon';
        if (value >= 6) return 'Bon';
        if (value >= 5) return 'Moyen';
        if (value >= 3) return 'Faible';
        return 'Insuffisant';
    }, [value]);
    
    const descriptionColor = useMemo(() => {
        if (value >= 9) return 'text-green-400';
        if (value >= 7.5) return 'text-yellow-400';
        if (value >= 6) return 'text-orange-400';
        return 'text-red-400';
    }, [value]);

    return (
        <div className="bg-pm-dark/50 p-4 rounded-lg border border-pm-off-white/10">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <label className="font-semibold text-pm-off-white/90 text-lg">{label}</label>
                    <p className={`text-sm font-medium ${descriptionColor}`}>{description}</p>
                </div>
                <p className="text-3xl font-bold text-pm-gold tabular-nums">{value.toFixed(1)}</p>
            </div>

            <div className="flex flex-wrap gap-1.5 justify-center">
                {SCORES.map(score => {
                    const isSelected = value === score;
                    const isHalfPoint = score % 1 !== 0;

                    return (
                        <button
                            key={score}
                            type="button"
                            onClick={() => onChange(score)}
                            className={`w-9 h-9 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-xs font-mono transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pm-gold focus:ring-offset-2 focus:ring-offset-pm-dark ${
                                isSelected 
                                    ? 'bg-pm-gold text-pm-dark font-bold shadow-lg shadow-pm-gold/30' 
                                    : isHalfPoint 
                                        ? 'bg-black text-pm-off-white/50 border border-pm-off-white/20' 
                                        : 'bg-pm-dark text-pm-off-white border border-pm-off-white/30'
                            }`}
                            aria-label={`Note ${score}`}
                            aria-pressed={isSelected}
                        >
                            {isHalfPoint ? '' : score}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ScoreInput;
