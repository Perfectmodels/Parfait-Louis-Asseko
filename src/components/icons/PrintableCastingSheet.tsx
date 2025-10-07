import React, { useEffect } from 'react';
import { CastingApplication } from '../../types';

interface PrintableCastingSheetProps {
  app: CastingApplication;
  juryMembers: any[];
  onDonePrinting: () => void;
}

const PrintableCastingSheet: React.FC<PrintableCastingSheetProps> = ({ app, juryMembers, onDonePrinting }) => {
  useEffect(() => {
    // Auto-print when component mounts
    window.print();
  }, []);

  return (
    <div className="p-8 bg-white print:p-0">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onDonePrinting}
          className="mb-4 px-4 py-2 bg-pm-gold text-white rounded hover:bg-pm-gold/90 print:hidden"
        >
          Fermer
        </button>

        <div className="border-2 border-gray-300 p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Fiche de Casting</h1>
            <p className="text-gray-600">Perfect Models Management</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="font-bold text-lg mb-3 border-b pb-1">Informations Personnelles</h2>
              <div className="space-y-2">
                <p><span className="font-semibold">Nom:</span> {app.lastName}</p>
                <p><span className="font-semibold">Prénom:</span> {app.firstName}</p>
                <p><span className="font-semibold">Email:</span> {app.email}</p>
                <p><span className="font-semibold">Téléphone:</span> {app.phone}</p>
                <p><span className="font-semibold">Date de naissance:</span> {app.birthDate}</p>
                <p><span className="font-semibold">Ville:</span> {app.city}</p>
              </div>
            </div>

            <div>
              <h2 className="font-bold text-lg mb-3 border-b pb-1">Mesures</h2>
              <div className="space-y-2">
                <p><span className="font-semibold">Taille:</span> {app.height} cm</p>
                <p><span className="font-semibold">Poids:</span> {app.weight} kg</p>
                <p><span className="font-semibold">Tour de poitrine:</span> {app.bust} cm</p>
                <p><span className="font-semibold">Tour de taille:</span> {app.waist} cm</p>
                <p><span className="font-semibold">Tour de hanches:</span> {app.hips} cm</p>
                <p><span className="font-semibold">Pointure:</span> {app.shoeSize}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-bold text-lg mb-3 border-b pb-1">Expérience</h2>
            <p className="whitespace-pre-wrap">{app.experience || 'Aucune expérience mentionnée'}</p>
          </div>

          {app.motivation && (
            <div className="mb-6">
              <h2 className="font-bold text-lg mb-3 border-b pb-1">Motivation</h2>
              <p className="whitespace-pre-wrap">{app.motivation}</p>
            </div>
          )}

          <div className="mb-6">
            <h2 className="font-bold text-lg mb-3 border-b pb-1">Évaluation du Jury</h2>
            <div className="grid grid-cols-3 gap-4">
              {juryMembers.map((member) => (
                <div key={member.id} className="border p-3">
                  <p className="font-semibold mb-2">{member.name}</p>
                  <div className="space-y-1">
                    <p className="text-sm">Note: ___/10</p>
                    <p className="text-sm">Commentaire:</p>
                    <div className="border-b border-gray-300 mt-1"></div>
                    <div className="border-b border-gray-300 mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-bold text-lg mb-3 border-b pb-1">Décision Finale</h2>
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>Accepté</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>Refusé</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>Présélectionné</span>
              </label>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t">
            <p className="text-sm text-gray-600">Date d'impression: {new Date().toLocaleDateString('fr-FR')}</p>
            <p className="text-sm text-gray-600">Référence: {app.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableCastingSheet;

