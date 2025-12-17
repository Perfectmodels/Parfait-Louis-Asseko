import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    PlusIcon,
    UserPlusIcon,
    NewspaperIcon,
    CalendarDaysIcon,
    SparklesIcon,
    EnvelopeIcon,
    CurrencyDollarIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';

interface QuickAction {
    title: string;
    description: string;
    icon: React.ElementType;
    link: string;
    color: string;
}

const quickActions: QuickAction[] = [
    {
        title: 'Ajouter un Mannequin',
        description: 'Créer un nouveau profil',
        icon: UserPlusIcon,
        link: '/admin/models',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        title: 'Nouvel Article',
        description: 'Publier dans le magazine',
        icon: NewspaperIcon,
        link: '/admin/magazine',
        color: 'from-purple-500 to-pink-500'
    },
    {
        title: 'Créer un Événement',
        description: 'Nouveau Perfect Fashion Day',
        icon: CalendarDaysIcon,
        link: '/admin/fashion-day-events',
        color: 'from-orange-500 to-red-500'
    },
    {
        title: 'Générer une Image',
        description: 'Créer avec l\'IA',
        icon: SparklesIcon,
        link: '/admin/generer-image',
        color: 'from-pm-gold to-yellow-500'
    },
    {
        title: 'Envoyer un Email',
        description: 'Campagne de mailing',
        icon: EnvelopeIcon,
        link: '/admin/mailing',
        color: 'from-green-500 to-emerald-500'
    },
    {
        title: 'Enregistrer un Paiement',
        description: 'Nouvelle transaction',
        icon: CurrencyDollarIcon,
        link: '/admin/payments',
        color: 'from-teal-500 to-cyan-500'
    }
];

interface QuickActionsMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-4xl bg-pm-dark border border-pm-gold/30 rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-pm-gold/20 bg-gradient-to-r from-pm-dark to-black">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-pm-gold/20 rounded-lg">
                            <PlusIcon className="w-6 h-6 text-pm-gold" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-pm-off-white">Actions Rapides</h2>
                            <p className="text-sm text-pm-off-white/60">Accédez rapidement aux fonctionnalités principales</p>
                        </div>
                    </div>
                </div>

                {/* Actions Grid */}
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickActions.map((action, index) => (
                        <motion.div
                            key={action.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                to={action.link}
                                onClick={onClose}
                                className="group block p-5 bg-black border border-pm-gold/20 rounded-xl hover:border-pm-gold/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pm-gold/10"
                            >
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} p-2.5 mb-4 group-hover:scale-110 transition-transform`}>
                                    <action.icon className="w-full h-full text-white" />
                                </div>
                                <h3 className="font-bold text-pm-off-white mb-1 group-hover:text-pm-gold transition-colors">
                                    {action.title}
                                </h3>
                                <p className="text-sm text-pm-off-white/60">
                                    {action.description}
                                </p>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-pm-gold/20 bg-black/30 text-center">
                    <p className="text-xs text-pm-off-white/50">
                        Appuyez sur <kbd className="px-2 py-1 bg-pm-dark border border-pm-gold/20 rounded text-pm-gold">Esc</kbd> pour fermer
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default QuickActionsMenu;
