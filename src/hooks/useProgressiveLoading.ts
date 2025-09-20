import { useState, useEffect, useCallback } from 'react';

interface LoadingState {
  data: boolean;
  images: boolean;
  components: boolean;
  complete: boolean;
}

interface LoadingMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage: number;
  networkSpeed: number;
}

export const useProgressiveLoading = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    data: false,
    images: false,
    components: false,
    complete: false
  });
  
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState<LoadingMetrics>({
    loadTime: 0,
    renderTime: 0,
    interactionTime: 0,
    memoryUsage: 0,
    networkSpeed: 0
  });
  
  const [startTime] = useState(performance.now());
  
  // Simuler le chargement progressif
  const startLoading = useCallback(async () => {
    try {
      // Étape 1: Chargement des données (25%)
      setLoadingState(prev => ({ ...prev, data: true }));
      setProgress(25);
      
      // Simuler le chargement des données critiques
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Étape 2: Préchargement des images (50%)
      setLoadingState(prev => ({ ...prev, images: true }));
      setProgress(50);
      
      // Précharger les images critiques
      await preloadCriticalImages();
      
      // Étape 3: Chargement des composants (75%)
      setLoadingState(prev => ({ ...prev, components: true }));
      setProgress(75);
      
      // Charger les composants non critiques
      await loadNonCriticalComponents();
      
      // Étape 4: Finalisation (100%)
      setLoadingState(prev => ({ ...prev, complete: true }));
      setProgress(100);
      
      // Calculer les métriques
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      setMetrics(prev => ({
        ...prev,
        loadTime,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
        networkSpeed: calculateNetworkSpeed()
      }));
      
    } catch (error) {
      console.error('Erreur lors du chargement progressif:', error);
    }
  }, [startTime]);
  
  // Précharger les images critiques
  const preloadCriticalImages = async () => {
    const criticalImages = [
      '/logo-seo.svg',
      '/favicon.ico'
    ];
    
    const preloadPromises = criticalImages.map(src => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Continue même en cas d'erreur
        img.src = src;
      });
    });
    
    await Promise.all(preloadPromises);
  };
  
  // Charger les composants non critiques
  const loadNonCriticalComponents = async () => {
    // Simuler le chargement des composants non critiques
    await new Promise(resolve => setTimeout(resolve, 200));
  };
  
  // Calculer la vitesse réseau
  const calculateNetworkSpeed = () => {
    const connection = (navigator as any).connection;
    if (connection) {
      return connection.downlink || 0;
    }
    return 0;
  };
  
  // Démarrer le chargement automatiquement
  useEffect(() => {
    startLoading();
  }, [startLoading]);
  
  return {
    loadingState,
    progress,
    metrics,
    startLoading,
    isComplete: loadingState.complete
  };
};
