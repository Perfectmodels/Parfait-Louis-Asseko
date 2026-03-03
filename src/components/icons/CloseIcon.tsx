import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export const CloseIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <XMarkIcon className={className} />
);

export default CloseIcon;
