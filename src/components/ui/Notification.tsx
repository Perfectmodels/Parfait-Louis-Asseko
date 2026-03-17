
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { NotificationType } from '../../contexts/NotificationContext';

interface NotificationProps {
    message: string;
    type: NotificationType;
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
    const config = {
        success: {
            icon: CheckCircleIcon,
            color: 'text-green-400',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20'
        },
        error: {
            icon: ExclamationCircleIcon,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20'
        },
        warning: {
            icon: ExclamationTriangleIcon,
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/20'
        },
        info: {
            icon: InformationCircleIcon,
            color: 'text-pm-gold',
            bg: 'bg-pm-gold/10',
            border: 'border-pm-gold/20'
        }
    };

    const Icon = config[type].icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className={`pointer-events-auto flex items-center gap-4 p-4 rounded-xl border ${config[type].border} ${config[type].bg} backdrop-blur-md shadow-2xl`}
        >
            <Icon className={`w-6 h-6 ${config[type].color} shrink-0`} />
            <p className="text-sm font-medium text-white flex-1">{message}</p>
            <button
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
                <XMarkIcon className="w-4 h-4 text-white/40" />
            </button>
        </motion.div>
    );
};

export default Notification;
