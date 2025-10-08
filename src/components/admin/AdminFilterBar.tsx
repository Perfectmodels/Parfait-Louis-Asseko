import React from 'react';

interface AdminFilterBarProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  labels?: Partial<Record<T, string>>;
}

const AdminFilterBar = <T extends string,>({ options, value, onChange, labels }: AdminFilterBarProps<T>) => {
  // Guard contre les options undefined
  if (!options || !Array.isArray(options)) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 mb-6 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
            value === opt
              ? 'bg-pm-gold text-pm-dark border-pm-gold'
              : 'border-pm-off-white/50 text-pm-off-white hover:bg-pm-gold/20'
          }`}
        >
          {labels?.[opt] ?? (opt as string)}
        </button>
      ))}
    </div>
  );
};

export default AdminFilterBar;


