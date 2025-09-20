import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Mettre à jour l'état pour afficher l'UI de fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log l'erreur pour le debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Optionnel: envoyer l'erreur à un service de monitoring
    // this.logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // UI de fallback personnalisée
      return this.props.fallback || (
        <div className="min-h-screen bg-pm-dark flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-black/50 border border-pm-gold/20 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h2 className="text-xl font-bold text-pm-gold mb-2">
              Une erreur s'est produite
            </h2>
            
            <p className="text-pm-off-white/70 mb-4">
              Le chargement de la page a échoué. Cela peut être dû à un problème de cache ou de script.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 text-left">
                <summary className="text-pm-gold cursor-pointer mb-2">
                  Détails de l'erreur (développement)
                </summary>
                <div className="bg-pm-dark-light p-3 rounded text-xs text-red-300 font-mono overflow-auto">
                  <div className="mb-2">
                    <strong>Erreur:</strong> {this.state.error.message}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-pm-gold/20 border border-pm-gold/40 rounded-lg text-pm-gold hover:bg-pm-gold/30 transition-colors"
              >
                Réessayer
              </button>
              
              <button
                onClick={this.handleReload}
                className="px-4 py-2 bg-pm-gold text-black rounded-lg hover:bg-pm-gold/90 transition-colors font-medium"
              >
                Recharger la page
              </button>
            </div>

            <div className="mt-4 text-xs text-pm-off-white/50">
              <p>Si le problème persiste, essayez de :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Vider le cache de votre navigateur</li>
                <li>Désactiver les extensions</li>
                <li>Utiliser la navigation privée</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
