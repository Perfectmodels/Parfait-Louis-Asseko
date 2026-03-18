import React from 'react';

type BadgeVariant = 'gold' | 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  pulse?: boolean;
  size?: 'sm' | 'md';
}

const variantClasses: Record<BadgeVariant, string> = {
  gold:   'bg-pm-gold/15 text-pm-gold border-pm-gold/30',
  blue:   'bg-blue-500/15 text-blue-300 border-blue-500/30',
  green:  'bg-green-500/15 text-green-300 border-green-500/30',
  red:    'bg-red-500/15 text-red-300 border-red-500/30',
  yellow: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  gray:   'bg-white/5 text-white/50 border-white/10',
};

const dotColors: Record<BadgeVariant, string> = {
  gold:   'bg-pm-gold',
  blue:   'bg-blue-400',
  green:  'bg-green-400',
  red:    'bg-red-400',
  yellow: 'bg-yellow-400',
  purple: 'bg-purple-400',
  gray:   'bg-white/40',
};

const Badge: React.FC<BadgeProps> = ({ children, variant = 'gray', dot = false, pulse = false, size = 'md' }) => (
  <span className={`inline-flex items-center gap-1.5 font-bold border rounded-full ${variantClasses[variant]} ${size === 'sm' ? 'px-2 py-0.5 text-[10px] tracking-wider' : 'px-2.5 py-1 text-xs tracking-wide'}`}>
    {dot && (
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]} ${pulse ? 'animate-pulse' : ''}`} />
    )}
    {children}
  </span>
);

export default Badge;
