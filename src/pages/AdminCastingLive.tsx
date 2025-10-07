import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import AdminCard from '../components/admin/AdminCard';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const AdminCastingLive: React.FC = () => {
  const { data, saveData } = useData();
  const [applications, setApplications] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liveMode, setLiveMode] = useState(false);

  useEffect(() => {
    if (data?.castingApplications) {
      const pending = data.castingApplications.filter(app => app.status === 'Nouveau');
      setApplications(pending);
    }
  }, [data?.castingApplications]);

  const currentApp = applications[currentIndex];

  const handleDecision = (decision: 'Accepté' | 'Refusé' | 'Présélectionné') => {
    if (!currentApp || !data) return;

    const updated = data.castingApplications?.map(app =>
      app.id === currentApp.id ? { ...app, status: decision } : app
    );

    saveData({ ...data, castingApplications: updated });

    // Move to next application
    if (currentIndex < applications.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setLiveMode(false);
      alert('Toutes les candidatures ont été traitées !');
    }
  };

  const handleSkip = () => {
    if (currentIndex < applications.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <AdminLayout>
      <AdminPageHeader 
        title="Mode Casting Live" 
        subtitle="Traiter les candidatures en temps réel lors d'un casting"
      />

      {!liveMode ? (
        <AdminSection title="Démarrer une Session">
          <AdminCard>
            <div className="text-center py-12">
              <ClockIcon className="w-16 h-16 text-pm-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">
                {applications.length} candidature(s) en attente
              </h3>
              <p className="text-gray-600 mb-6">
                Le mode casting live vous permet de traiter les candidatures une par une rapidement.
              </p>
              {applications.length > 0 ? (
                <button
                  onClick={() => setLiveMode(true)}
                  className="px-8 py-3 bg-pm-gold text-white rounded-lg hover:bg-pm-gold/90 font-semibold"
                >
                  Démarrer le Mode Live
                </button>
              ) : (
                <p className="text-gray-500">Aucune candidature à traiter pour le moment.</p>
              )}
            </div>
          </AdminCard>
        </AdminSection>
      ) : (
        <>
          <div className="mb-6 flex justify-between items-center bg-gray-100 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Progression</p>
              <p className="text-xl font-bold text-pm-gold">
                {currentIndex + 1} / {applications.length}
              </p>
            </div>
            <button
              onClick={() => setLiveMode(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Quitter le Mode Live
            </button>
          </div>

          {currentApp ? (
            <AdminSection title={`Candidat ${currentIndex + 1}`}>
              <AdminCard>
                <div className="space-y-6">
                  {/* Informations personnelles */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-bold mb-4">
                        {currentApp.firstName} {currentApp.lastName}
                      </h3>
                      <div className="space-y-2">
                        <p><span className="font-semibold">Email:</span> {currentApp.email}</p>
                        <p><span className="font-semibold">Téléphone:</span> {currentApp.phone}</p>
                        <p><span className="font-semibold">Âge:</span> {currentApp.age} ans</p>
                        <p><span className="font-semibold">Ville:</span> {currentApp.city}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold mb-3">Mesures</h4>
                      <div className="space-y-2">
                        <p><span className="font-semibold">Taille:</span> {currentApp.height} cm</p>
                        <p><span className="font-semibold">Poids:</span> {currentApp.weight} kg</p>
                        <p><span className="font-semibold">Tour de poitrine:</span> {currentApp.bust} cm</p>
                        <p><span className="font-semibold">Tour de taille:</span> {currentApp.waist} cm</p>
                        <p><span className="font-semibold">Tour de hanches:</span> {currentApp.hips} cm</p>
                        <p><span className="font-semibold">Pointure:</span> {currentApp.shoeSize}</p>
                      </div>
                    </div>
                  </div>

                  {/* Expérience */}
                  {currentApp.experience && (
                    <div>
                      <h4 className="font-bold mb-2">Expérience</h4>
                      <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                        {currentApp.experience}
                      </p>
                    </div>
                  )}

                  {/* Photos */}
                  {currentApp.photos && currentApp.photos.length > 0 && (
                    <div>
                      <h4 className="font-bold mb-2">Photos</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {currentApp.photos.map((photo: string, idx: number) => (
                          <img
                            key={idx}
                            src={photo}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-48 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Boutons de décision */}
                  <div className="flex gap-4 pt-6 border-t">
                    <button
                      onClick={() => handleDecision('Accepté')}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-lg"
                    >
                      <CheckCircleIcon className="w-6 h-6" />
                      Accepter
                    </button>
                    <button
                      onClick={() => handleDecision('Présélectionné')}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg"
                    >
                      <ClockIcon className="w-6 h-6" />
                      Présélectionner
                    </button>
                    <button
                      onClick={() => handleDecision('Refusé')}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-lg"
                    >
                      <XCircleIcon className="w-6 h-6" />
                      Refuser
                    </button>
                  </div>

                  <button
                    onClick={handleSkip}
                    className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Passer (traiter plus tard)
                  </button>
                </div>
              </AdminCard>
            </AdminSection>
          ) : (
            <AdminCard>
              <div className="text-center py-12">
                <p className="text-xl">Aucune candidature restante</p>
              </div>
            </AdminCard>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default AdminCastingLive;

