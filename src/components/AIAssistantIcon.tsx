import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface AIAssistantIconProps {
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const AIAssistantIcon: React.FC<AIAssistantIconProps> = ({ 
  onClick, 
  className = '', 
  size = 'md',
  disabled = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-1 
        ${textSizeClasses[size]} 
        text-pm-gold/70 hover:text-pm-gold 
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      title="Assistant IA"
    >
      <SparklesIcon className={sizeClasses[size]} />
      <span>Assister</span>
    </button>
  );
};

export default AIAssistantIcon;