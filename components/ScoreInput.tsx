import React, { useMemo } from 'react';

interface ScoreInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
}

const ScoreInput: React.FC<ScoreInputProps> = ({ label, value, onChange }) => {
    
    const handleIncrement = () => onChange(Math.min(10, value + 0.5));
    const handleDecrement = () => onChange(Math.max(0, value - 0.5));

    const description = useMemo(() => {
        if (value >= 9) return 'Excellent';
        if (value >= 7) return 'Bon';
        if (value >= 4) return 'Moyen';
        return 'Insuffisant';
    }, [value]);

    return (
        <div className="bg-pm-dark p-4 rounded-lg border border-pm-off-white/10">
            <div className="flex justify-between items-center mb-2">
                <label className="font-semibold text-pm-off-white/80">{label}</label>
                <p className={`text-sm font-medium ${
                    value >= 9 ? 'text-green-400' :
                    value >= 7 ? 'text-yellow-400' :
                    value >= 4 ? 'text-orange-400' :
                    'text-red-400'
                }`}>{description}</p>
            </div>
            <div className="flex items-center gap-4">
                <button type="button" onClick={handleDecrement} disabled={value <= 0} className="px-3 py-1 bg-black rounded-full disabled:opacity-50 text-lg font-bold">-</button>
                <span className="flex-grow text-center text-2xl font-bold text-pm-gold tabular-nums">{value.toFixed(1)}</span>
                <button type="button" onClick={handleIncrement} disabled={value >= 10} className="px-3 py-1 bg-black rounded-full disabled:opacity-50 text-lg font-bold">+</button>
            </div>
            <div className="w-full bg-black rounded-full h-1.5 mt-2">
                <div className="bg-pm-gold h-1.5 rounded-full" style={{ width: `${(value / 10) * 100}%` }}></div>
            </div>
        </div>
    );
};

export default ScoreInput;
