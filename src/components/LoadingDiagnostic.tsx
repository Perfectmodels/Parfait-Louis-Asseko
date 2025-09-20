import React, { useState, useEffect } from 'react';
import { useCacheManagement } from '../hooks/useCacheManagement';
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  suggestion?: string;
}

const LoadingDiagnostic: React.FC = () => {
  const { cacheStatus, forceCacheUpdate, getCacheInfo } = useCacheManagement();
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: DiagnosticResult[] = [];

    // Test 1: Vérifier la connectivité
    try {
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      results.push({
        test: 'Connectivité serveur',
        status: response.ok ? 'success' : 'warning',
        message: response.ok ? 'Serveur accessible' : 'Problème de connectivité',
        suggestion: response.ok ? undefined : 'Vérifiez votre connexion internet'
      });
    } catch (error) {
      results.push({
        test: 'Connectivité serveur',
        status: 'error',
        message: 'Impossible de contacter le serveur',
        suggestion: 'Vérifiez votre connexion internet et réessayez'
      });
    }

    // Test 2: Vérifier les scripts externes
    const externalScripts = [
      'https://www.googletagmanager.com/gtag/js',
      'https://elfsightcdn.com/platform.js'
    ];

    for (const script of externalScripts) {
      try {
        const response = await fetch(script, { 
          method: 'HEAD',
          mode: 'no-cors'
        });
        results.push({
          test: `Script externe: ${script.split('/')[2]}`,
          status: 'success',
          message: 'Script accessible'
        });
      } catch (error) {
        results.push({
          test: `Script externe: ${script.split('/')[2]}`,
          status: 'warning',
          message: 'Script potentiellement bloqué',
          suggestion: 'Vérifiez les bloqueurs de publicité ou les extensions'
        });
      }
    }

    // Test 3: Vérifier le cache navigateur
    const cacheInfo = getCacheInfo();
    results.push({
      test: 'Cache navigateur',
      status: cacheStatus.needsRefresh ? 'warning' : 'success',
      message: cacheStatus.needsRefresh ? 'Cache obsolète détecté' : 'Cache à jour',
      suggestion: cacheStatus.needsRefresh ? 'Vider le cache et recharger' : undefined
    });

    // Test 4: Vérifier les erreurs JavaScript
    const hasJsErrors = window.performance.getEntriesByType('resource')
      .some(entry => entry.name.includes('.js') && entry.transferSize === 0);
    
    results.push({
      test: 'Chargement JavaScript',
      status: hasJsErrors ? 'error' : 'success',
      message: hasJsErrors ? 'Erreurs de chargement JS détectées' : 'Scripts chargés correctement',
      suggestion: hasJsErrors ? 'Vider le cache et recharger la page' : undefined
    });

    // Test 5: Vérifier les performances
    const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
    
    results.push({
      test: 'Temps de chargement',
      status: loadTime > 3000 ? 'warning' : 'success',
      message: `Temps de chargement: ${Math.round(loadTime)}ms`,
      suggestion: loadTime > 3000 ? 'Le chargement est lent, vérifiez votre connexion' : undefined
    });

    // Test 6: Vérifier les ressources bloquées
    const blockedResources = window.performance.getEntriesByType('resource')
      .filter(entry => entry.transferSize === 0 && entry.name.includes('http'));
    
    results.push({
      test: 'Ressources bloquées',
      status: blockedResources.length > 0 ? 'warning' : 'success',
      message: blockedResources.length > 0 ? `${blockedResources.length} ressource(s) bloquée(s)` : 'Toutes les ressources chargées',
      suggestion: blockedResources.length > 0 ? 'Vérifiez les bloqueurs de publicité' : undefined
    });

    setDiagnostics(results);
    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-400" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-500/20 bg-green-500/5';
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/5';
      case 'error':
        return 'border-red-500/20 bg-red-500/5';
      default:
        return 'border-gray-500/20 bg-gray-500/5';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-pm-gold">Diagnostic de Chargement</h3>
        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-pm-gold/10 border border-pm-gold/20 rounded-lg text-pm-gold hover:bg-pm-gold/20 transition-colors disabled:opacity-50"
        >
          <ArrowPathIcon className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Diagnostic...' : 'Relancer'}
        </button>
      </div>

      <div className="space-y-3">
        {diagnostics.map((diagnostic, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getStatusColor(diagnostic.status)}`}
          >
            <div className="flex items-start gap-3">
              {getStatusIcon(diagnostic.status)}
              <div className="flex-1">
                <p className="font-medium text-pm-off-white">{diagnostic.test}</p>
                <p className="text-sm text-pm-off-white/70 mt-1">{diagnostic.message}</p>
                {diagnostic.suggestion && (
                  <p className="text-sm text-pm-gold mt-2">{diagnostic.suggestion}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {cacheStatus.needsRefresh && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
            <div className="flex-1">
              <p className="font-medium text-yellow-400">Cache obsolète détecté</p>
              <p className="text-sm text-pm-off-white/70 mt-1">
                Une mise à jour du cache est recommandée pour de meilleures performances.
              </p>
            </div>
            <button
              onClick={forceCacheUpdate}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-500/20 border border-yellow-500/40 rounded-lg text-yellow-400 hover:bg-yellow-500/30 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
              Vider le cache
            </button>
          </div>
        </div>
      )}

      <div className="text-xs text-pm-off-white/50 space-y-1">
        <p><strong>Conseils généraux :</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Videz le cache de votre navigateur (Ctrl+F5)</li>
          <li>Désactivez temporairement les extensions</li>
          <li>Testez en navigation privée</li>
          <li>Vérifiez votre connexion internet</li>
        </ul>
      </div>
    </div>
  );
};

export default LoadingDiagnostic;
