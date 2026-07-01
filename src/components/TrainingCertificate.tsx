// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT CERTIFICAT DE FORMATION
// ═══════════════════════════════════════════════════════════════════════════

import { Award, Download, Share2 } from 'lucide-react';

interface TrainingCertificateProps {
  studentName: string;
  moduleName: string;
  completionDate: string;
  score: number;
  certificateId: string;
}

export default function TrainingCertificate({
  studentName,
  moduleName,
  completionDate,
  score,
  certificateId
}: TrainingCertificateProps) {
  
  const handleDownload = () => {
    // Logique pour télécharger le certificat en PDF
    console.log('Téléchargement du certificat...');
  };

  const handleShare = () => {
    // Logique pour partager le certificat
    if (navigator.share) {
      navigator.share({
        title: 'Mon Certificat Perfect Models Management',
        text: `J'ai complété le module "${moduleName}" avec un score de ${score}% !`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="relative bg-white rounded-3xl p-12 shadow-2xl max-w-4xl mx-auto">
      {/* Bordure décorative */}
      <div className="absolute inset-4 border-4 border-pm-gold/20 rounded-2xl pointer-events-none" />
      
      {/* Contenu */}
      <div className="relative z-10 text-center space-y-8">
        {/* Logo et titre */}
        <div>
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-pm-gold/10 flex items-center justify-center">
            <Award size={48} className="text-pm-gold" />
          </div>
          <h1 className="text-4xl font-playfair font-black text-pm-dark mb-2">
            Certificat de Formation
          </h1>
          <p className="text-pm-dark/60 text-lg">
            Perfect Models Management
          </p>
        </div>

        {/* Texte principal */}
        <div className="space-y-4">
          <p className="text-pm-dark/70 text-lg">
            Certifie que
          </p>
          <h2 className="text-5xl font-playfair font-black text-pm-dark">
            {studentName}
          </h2>
          <p className="text-pm-dark/70 text-lg">
            a complété avec succès le module
          </p>
          <h3 className="text-3xl font-playfair font-bold text-pm-gold">
            {moduleName}
          </h3>
        </div>

        {/* Détails */}
        <div className="flex items-center justify-center gap-12 text-pm-dark/60">
          <div>
            <p className="text-sm uppercase tracking-wider mb-1">Date de complétion</p>
            <p className="text-lg font-bold text-pm-dark">
              {new Date(completionDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
          <div className="w-px h-12 bg-pm-dark/10" />
          <div>
            <p className="text-sm uppercase tracking-wider mb-1">Score final</p>
            <p className="text-lg font-bold text-pm-gold">{score}%</p>
          </div>
        </div>

        {/* Signature */}
        <div className="pt-8 border-t border-pm-dark/10">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="w-48 h-px bg-pm-dark/20 mb-2" />
              <p className="text-sm text-pm-dark/60">Direction Pédagogique</p>
              <p className="text-xs text-pm-dark/40 mt-1">Perfect Models Management</p>
            </div>
          </div>
        </div>

        {/* ID du certificat */}
        <div className="text-xs text-pm-dark/40">
          Certificat N° {certificateId}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 pt-6">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-pm-gold text-white font-bold hover:bg-pm-gold/90 transition-all"
          >
            <Download size={18} />
            Télécharger
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-pm-dark/10 text-pm-dark font-bold hover:bg-pm-dark/20 transition-all"
          >
            <Share2 size={18} />
            Partager
          </button>
        </div>
      </div>

      {/* Motifs décoratifs */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-pm-gold/20 rounded-tl-2xl" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-pm-gold/20 rounded-tr-2xl" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-pm-gold/20 rounded-bl-2xl" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-pm-gold/20 rounded-br-2xl" />
    </div>
  );
}
