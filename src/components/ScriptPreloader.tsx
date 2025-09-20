import React, { useEffect, useState } from 'react';

interface ScriptPreloaderProps {
  children: React.ReactNode;
}

const ScriptPreloader: React.FC<ScriptPreloaderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const preloadScripts = async () => {
      const scripts = [
        // Scripts externes critiques
        'https://www.googletagmanager.com/gtag/js?id=G-03XW3FWG7L',
        'https://elfsightcdn.com/platform.js'
      ];

      let loadedCount = 0;
      const totalScripts = scripts.length;

      const loadScript = (src: string): Promise<void> => {
        return new Promise((resolve, reject) => {
          // Vérifier si le script est déjà chargé
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
          }

          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.onload = () => {
            loadedCount++;
            setLoadingProgress((loadedCount / totalScripts) * 100);
            resolve();
          };
          script.onerror = () => {
            console.warn(`Failed to load script: ${src}`);
            loadedCount++;
            setLoadingProgress((loadedCount / totalScripts) * 100);
            resolve(); // Continue même si un script échoue
          };
          document.head.appendChild(script);
        });
      };

      try {
        // Précharger tous les scripts en parallèle
        await Promise.all(scripts.map(loadScript));
        
        // Attendre que le DOM soit prêt
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            setIsLoaded(true);
          });
        } else {
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Error preloading scripts:', error);
        setIsLoaded(true); // Continuer même en cas d'erreur
      }
    };

    preloadScripts();
  }, []);

  // Afficher un indicateur de chargement pendant le préchargement
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-pm-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pm-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-pm-gold text-lg mb-2">Chargement des ressources...</p>
          <div className="w-64 bg-pm-dark-light rounded-full h-2 mx-auto">
            <div 
              className="bg-pm-gold h-2 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p className="text-pm-off-white/60 text-sm mt-2">
            {Math.round(loadingProgress)}% chargé
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ScriptPreloader;
