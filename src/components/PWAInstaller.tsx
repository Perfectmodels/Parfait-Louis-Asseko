import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstaller: React.FC = () => {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!visible || !prompt) return null;

  const install = async () => {
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-pm-dark border border-pm-gold/20 p-4 shadow-2xl max-w-xs">
      <p className="text-xs font-black uppercase tracking-widest text-white mb-3">
        Installer l'application
      </p>
      <div className="flex gap-3">
        <button onClick={install} className="btn-premium !py-2 !px-4 !text-[9px]">Installer</button>
        <button onClick={() => setVisible(false)} className="text-white/30 hover:text-white text-xs transition-colors">Plus tard</button>
      </div>
    </div>
  );
};
