import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class RouteErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Route Error Boundary caught an error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-pm-dark flex flex-col items-center justify-center gap-6 p-4">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-red-500 mb-4">Erreur de Chargement</h1>
                        <p className="text-pm-off-white/70 text-lg mb-6">
                            Une erreur s'est produite lors du chargement de cette page.
                        </p>
                        <div className="space-y-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                            >
                                Recharger la page
                            </button>
                            <div>
                                <Link
                                    to="/"
                                    className="px-6 py-3 border border-pm-gold text-pm-gold font-bold rounded-lg hover:bg-pm-gold hover:text-pm-dark transition-colors"
                                >
                                    Retour à l'accueil
                                </Link>
                            </div>
                        </div>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-8 text-left max-w-2xl">
                                <summary className="text-pm-gold cursor-pointer mb-2">Détails de l'erreur (développement)</summary>
                                <pre className="bg-black/50 p-4 rounded-lg text-red-400 text-sm overflow-auto">
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default RouteErrorBoundary;
