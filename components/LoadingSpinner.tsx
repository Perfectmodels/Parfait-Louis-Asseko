import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg';
type SpinnerColor = 'white' | 'gold';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

const colorClasses = {
  white: 'border-white',
  gold: 'border-pm-gold border-t-transparent',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'gold',
  className = '',
}) => {
  return (
    <div className={`inline-block ${sizeClasses[size]} ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 ${colorClasses[color]} h-full w-full`}
        role="status"
      >
        <span className="sr-only">Chargement...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
