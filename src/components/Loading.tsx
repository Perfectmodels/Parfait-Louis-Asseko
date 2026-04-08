import React from 'react';

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Loading: React.FC<LoadingProps> = ({ 
  fullScreen = true, 
  text = 'Chargement...',
  size = 'lg'
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50'
    : 'w-full h-full min-h-[200px]';

  return (
    <div className={`${containerClasses} flex items-center justify-center bg-pm-dark`}>
      <div className="flex flex-col items-center gap-4">
        <span className={`loading loading-ring text-pm-gold loading-${size}`}></span>
        <p className="text-pm-gold text-sm font-montserrat animate-pulse">{text}</p>
      </div>
    </div>
  );
};

export default Loading;
