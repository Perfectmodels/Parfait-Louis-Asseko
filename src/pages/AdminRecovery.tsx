import React from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, CheckCircleIcon, XCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { RecoveryRequest } from '../../types';

const AdminRecovery: React.FC = () => {
  const { data, saveData } = useData();

  const requests = data?.recoveryRequests?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) || [];
  const models = data?.models || [];

  const handleUpdateStatus = async (requestId: string, status: 'Nouveau' | 'Traité') => {
    if (!data) return;
    const updatedRequests = requests.map(req => req.id === requestId ? { ...req, status } : req);
    await saveData({ ...data, recoveryRequests: updatedRequests });
  };

  const handleDelete = async (requestId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) {
      if (!data) return;
      const updatedRequests = requests.filter(req => req.id !== requestId);
      await saveData({ ...data, recoveryRequests: updatedRequests });
    }
  };
  
  const getStatusColor = (status: 'Nouveau' | 'Traité') => {
    return status === 'Nouveau' ? 'bg-blue-500/20 text-blue-300 border-blue-500' : 'bg-green-500/20 text-green-300 border-green-500';
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Demandes de Récupération" noIndex />
      <div className="container mx-auto px-6">
        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
          <ChevronLeftIcon className="w-5 h-5" />
          Retour au Dashboard
        </Link>
        <h1 className="text-4xl font-playfair text-pm-gold">Demandes de Récupération</h1>
        <p className="text-pm-off-white/70 mt-2 mb-8">
          Gérez les demandes de coordonnées oubliées soumises par les mannequins.
        </p>

        <div className="bg-black border border-pm-gold/20 rounded-lg shadow-lg shadow-black/30">
            {requests.map(req => {
                const modelExists = models.some(m => m.name.toLowerCase() === req.modelName.toLowerCase());
                return (
                    <div key={req.id} className="p-4 border-b border-pm-dark flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-pm-dark/50">
                        <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${getStatusColor(req.status)}`}>{req.status}</span>
                                <h2 className="font-bold text-lg text-pm-off-white">{req.modelName}</h2>
                            </div>
                            <p className="text-sm text-pm-off-white/70">Téléphone: <span className="font-mono">{req.phone}</span></p>
                            <p className="text-xs text-pm-off-white/50 mt-1">
                                Demandé le: {new Date(req.timestamp).toLocaleString('fr-FR')}
                            </p>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="flex-grow md:flex-grow-0">
                                {modelExists ? (
                                    <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircleIcon className="w-4 h-4" /> Mannequin trouvé</span>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs text-red-400"><XCircleIcon className="w-4 h-4" /> Mannequin inconnu</span>
                                )}
                            </div>
                            {req.status === 'Nouveau' && (
                                <button onClick={() => handleUpdateStatus(req.id, 'Traité')} className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-green-500 text-green-300 rounded-full hover:bg-green-500/20">
                                    Marquer comme Traité
                                </button>
                            )}
                            <button onClick={() => handleDelete(req.id)} className="text-red-500/70 hover:text-red-500 p-1"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    </div>
                )
            })}
             {requests.length === 0 && (
                <div className="text-center p-16">
                    <QuestionMarkCircleIcon className="w-16 h-16 mx-auto text-pm-off-white/30 mb-4"/>
                    <p className="text-pm-off-white/70">Aucune demande de récupération pour le moment.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminRecovery;
