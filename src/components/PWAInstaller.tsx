import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownTrayIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

// This event is not typed in standard TS libs yet
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstaller: React.FC = () => {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

    useEffect(() => {
        const handleInstallPrompt = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e as BeforeInstallPromptEvent);
        };
        
        window.addEventListener('beforeinstallprompt', handleInstallPrompt);

        // Logic for service worker updates
        const onUpdate = (registration: ServiceWorkerRegistration) => {
            setWaitingWorker(registration.waiting);
            setUpdateAvailable(true);
        };

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                if (registration.waiting) {
                    onUpdate(registration);
                }
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                onUpdate(registration);
                            }
                        });
                    }
                });
            });
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
        };
    }, []);

    const handleInstallClick = () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        installPrompt.userChoice.then(() => {
            setInstallPrompt(null);
        });
    };

    const handleRefreshClick = () => {
        waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    };

    const handleDismissInstall = () => {
        setInstallPrompt(null);
    };
    
    const bannerVariants = {
        hidden: { y: '100%', opacity: 0 },
        visible: { y: '0%', opacity: 1 },
    };

    return (
        <AnimatePresence>
            {updateAvailable && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={bannerVariants}
                    transition={{ ease: 'easeInOut', duration: 0.5 }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-pm-gold text-pm-dark p-4 shadow-lg print-hide"
                >
                    <div className="container mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <ArrowPathIcon className="w-6 h-6" />
                            <div>
                                <h3 className="font-bold">Nouvelle Version Disponible</h3>
                                <p className="text-sm">Rechargez pour profiter des dernières améliorations.</p>
                            </div>
                        </div>
                        <button onClick={handleRefreshClick} className="px-4 py-2 bg-pm-dark text-pm-gold font-bold uppercase text-xs rounded-full hover:bg-black">
                            Recharger
                        </button>
                    </div>
                </motion.div>
            )}
            {!updateAvailable && installPrompt && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={bannerVariants}
                    transition={{ ease: 'easeInOut', duration: 0.5 }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-pm-gold/20 p-4 shadow-lg print-hide"
                >
                    <div className="container mx-auto flex justify-between items-center gap-4">
                         <img src="https://placehold.co/100x100/000000/D4AF37?text=PMM" alt="Logo" className="h-10 w-10 hidden sm:block" />
                        <div>
                            <h3 className="font-bold text-pm-gold">Installer l'Application</h3>
                            <p className="text-sm text-pm-off-white/80">Pour une expérience optimale, ajoutez PMM à votre écran d'accueil.</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={handleInstallClick} className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark font-bold uppercase text-xs rounded-full hover:bg-white">
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                Installer
                            </button>
                             <button onClick={handleDismissInstall} className="text-pm-off-white/50 hover:text-white p-2">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
