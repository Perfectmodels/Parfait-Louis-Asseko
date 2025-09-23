import React from 'react';
import { getStatusColor, getStatusText } from '../../utils/status';
import { 
    CheckCircleIcon, 
    ExclamationTriangleIcon, 
    CogIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

interface StatusCardProps {
    title: string;
    status: string;
    description?: string;
    icon?: React.ReactNode;
    className?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ 
    title, 
    status, 
    description, 
    icon,
    className = ""
}) => {
    return (
        <div className={`bg-black/50 border border-pm-gold/20 rounded-xl p-6 hover:shadow-lg hover:shadow-pm-gold/10 transition-all duration-300 ${className}`}>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-pm-off-white">{title}</h3>
                <div className={`p-2 rounded-full ${getStatusColor(status)}`}>
                    {icon || (() => {
                        const iconName = getStatusIcon(status);
                        switch (iconName) {
                            case 'CheckCircleIcon':
                                return <CheckCircleIcon className="w-5 h-5" />;
                            case 'ExclamationTriangleIcon':
                                return <ExclamationTriangleIcon className="w-5 h-5" />;
                            case 'XCircleIcon':
                                return <XCircleIcon className="w-5 h-5" />;
                            default:
                                return <CogIcon className="w-5 h-5" />;
                        }
                    })()}
                </div>
            </div>
            {description ? (
                <p className="text-sm text-pm-off-white/60">{description}</p>
            ) : (
                <p className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${getStatusColor(status)}`}>
                    {getStatusText(status)}
                </p>
            )}
        </div>
    );
};

export default StatusCard;
