import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { siteConfig, fashionDayEvents } from '../constants/data';

interface PressbookGeneratorProps {
  onClose: () => void;
}

const PressbookGenerator: React.FC<PressbookGeneratorProps> = ({ onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generatePressbook = async () => {
    setIsGenerating(true);
    setProgress(0);

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      // Fonction pour charger une image
      const loadImage = (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = url;
        });
      };

      // 1. Page de couverture
      setProgress(10);
      
      // Logo de l'agence
      try {
        const logo = await loadImage(siteConfig.logo);
        const logoWidth = 40;
        const logoHeight = (logo.height * logoWidth) / logo.width;
        doc.addImage(logo, 'JPEG', margin, margin, logoWidth, logoHeight);
      } catch (error) {
        console.warn('Impossible de charger le logo:', error);
      }

      // Titre principal
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(212, 175, 55); // Couleur dorée
      doc.text('PERFECT FASHION DAY', pageWidth / 2, 80, { align: 'center' });
      
      doc.setFontSize(20);
      doc.setTextColor(100, 100, 100);
      doc.text('ÉDITION 2', pageWidth / 2, 95, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setTextColor(50, 50, 50);
      doc.text('"L\'Art de Se Révéler"', pageWidth / 2, 110, { align: 'center' });

      // Date et lieu
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('31 Janvier 2026', pageWidth / 2, 130, { align: 'center' });
      doc.text('Complexe Hôtelier Le Nalys, Angondjé', pageWidth / 2, 140, { align: 'center' });

      // Image de l'édition 2
      try {
        const edition2Event = fashionDayEvents.find(e => e.edition === 2);
        if (edition2Event?.imageUrl) {
          const eventImage = await loadImage(edition2Event.imageUrl);
          const imgWidth = 120;
          const imgHeight = (eventImage.height * imgWidth) / eventImage.width;
          const imgX = (pageWidth - imgWidth) / 2;
          const imgY = 150;
          doc.addImage(eventImage, 'JPEG', imgX, imgY, imgWidth, imgHeight);
        }
      } catch (error) {
        console.warn('Impossible de charger l\'image de l\'édition 2:', error);
      }

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text('Perfect Models Management - Libreville, Gabon', pageWidth / 2, pageHeight - 15, { align: 'center' });

      setProgress(30);

      // 2. Page de présentation de l'agence
      doc.addPage();
      setProgress(40);

      // Logo en haut
      try {
        const logo = await loadImage(siteConfig.logo);
        const logoWidth = 30;
        const logoHeight = (logo.height * logoWidth) / logo.width;
        doc.addImage(logo, 'JPEG', margin, margin, logoWidth, logoHeight);
      } catch (error) {
        console.warn('Impossible de charger le logo:', error);
      }

      // Titre de section
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(212, 175, 55);
      doc.text('PERFECT MODELS MANAGEMENT', margin, 50);

      // Description de l'agence
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      const agencyText = `Fondée en 2021 par Parfait Asseko, Perfect Models Management est née d'une vision : créer une agence de mannequins d'élite au Gabon, capable de rivaliser avec les standards internationaux.

Notre mission est de découvrir, former et propulser les futurs visages de la mode, tout en offrant à nos clients un service irréprochable et des profils adaptés à leurs besoins les plus exigeants.

L'élégance, le professionnalisme et la passion sont les piliers de notre identité.`;

      const splitText = doc.splitTextToSize(agencyText, contentWidth);
      doc.text(splitText, margin, 70);

      // Statistiques de l'agence
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(212, 175, 55);
      doc.text('NOS RÉALISATIONS', margin, 120);

      const stats = [
        { label: 'Mannequins formés', value: '50+' },
        { label: 'Événements organisés', value: '10+' },
        { label: 'Partenaires', value: '20+' },
        { label: 'Années d\'expérience', value: '4' }
      ];

      stats.forEach((stat, index) => {
        const x = margin + (index % 2) * (contentWidth / 2);
        const y = 140 + Math.floor(index / 2) * 20;
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(212, 175, 55);
        doc.text(stat.value, x, y);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(stat.label, x, y + 8);
      });

      setProgress(50);

      // 3. Page de rétrospective de l'édition 1
      doc.addPage();
      setProgress(60);

      // Titre de section
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(212, 175, 55);
      doc.text('ÉDITION 1 - RÉTROSPECTIVE', margin, 30);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      doc.text('"Racines et Modernité" - 25 Janvier 2025', margin, 45);

      // Description de l'édition 1
      const edition1Text = `La première édition du Perfect Fashion Day a été un véritable succès, réunissant créateurs, mannequins et spectateurs autour du thème "Racines et Modernité".

Cet événement a permis d'explorer la richesse de la culture gabonaise tout en ouvrant un dialogue avec les tendances contemporaines, posant ainsi les bases solides d'un événement de référence pour la mode gabonaise.`;

      const splitEdition1Text = doc.splitTextToSize(edition1Text, contentWidth);
      doc.text(splitEdition1Text, margin, 60);

      // Statistiques de l'édition 1
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(212, 175, 55);
      doc.text('CHIFFRES CLÉS', margin, 100);

      const edition1Stats = [
        { label: 'Créateurs participants', value: '8' },
        { label: 'Mannequins sur scène', value: '20+' },
        { label: 'Spectateurs', value: '150+' },
        { label: 'Taux de satisfaction', value: '100%' }
      ];

      edition1Stats.forEach((stat, index) => {
        const x = margin + (index % 2) * (contentWidth / 2);
        const y = 120 + Math.floor(index / 2) * 20;
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(212, 175, 55);
        doc.text(stat.value, x, y);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(stat.label, x, y + 7);
      });

      // Images de l'édition 1
      const edition1Event = fashionDayEvents.find(e => e.edition === 1);
      if (edition1Event?.stylists && edition1Event.stylists.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(212, 175, 55);
        doc.text('CRÉATEURS PARTICIPANTS', margin, 180);

        // Afficher quelques images de créateurs
        let yPos = 190;
        const stylistsToShow = edition1Event.stylists.slice(0, 3);
        
        for (const stylist of stylistsToShow) {
          if (stylist.images && stylist.images.length > 0) {
            try {
              const stylistImage = await loadImage(stylist.images[0]);
              const imgWidth = 40;
              const imgHeight = (stylistImage.height * imgWidth) / stylistImage.width;
              
              if (yPos + imgHeight > pageHeight - margin) {
                doc.addPage();
                yPos = margin;
              }
              
              doc.addImage(stylistImage, 'JPEG', margin, yPos, imgWidth, imgHeight);
              
              doc.setFontSize(10);
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(50, 50, 50);
              doc.text(stylist.name, margin + 45, yPos + 10);
              
              doc.setFontSize(8);
              doc.setFont('helvetica', 'normal');
              doc.setTextColor(100, 100, 100);
              const desc = doc.splitTextToSize(stylist.description, contentWidth - 50);
              doc.text(desc, margin + 45, yPos + 20);
              
              yPos += imgHeight + 15;
            } catch (error) {
              console.warn(`Impossible de charger l'image de ${stylist.name}:`, error);
            }
          }
        }
      }

      setProgress(80);

      // 4. Page de présentation de l'édition 2
      doc.addPage();
      setProgress(85);

      // Titre de section
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(212, 175, 55);
      doc.text('ÉDITION 2 - L\'AVENIR', margin, 30);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      doc.text('"L\'Art de Se Révéler" - 31 Janvier 2026', margin, 45);

      // Description de l'édition 2
      const edition2Text = `Après une première édition marquante, riche en émotions et en élégance, Perfect Models Management est fier d'annoncer le retour de la Perfect Fashion Day pour une deuxième édition inédite.

Cette nouvelle rencontre mettra à l'honneur une mode profondément enracinée dans la culture, l'histoire personnelle et l'affirmation de soi. Nous recherchons des talents visionnaires pour donner vie à ce thème exceptionnel.`;

      const splitEdition2Text = doc.splitTextToSize(edition2Text, contentWidth);
      doc.text(splitEdition2Text, margin, 60);

      // Objectifs de l'édition 2
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(212, 175, 55);
      doc.text('NOS OBJECTIFS', margin, 100);

      const objectives = [
        '• Réunir 15+ créateurs talentueux',
        '• Présenter 30+ mannequins sur scène',
        '• Accueillir 300+ spectateurs',
        '• Créer un événement de référence en Afrique Centrale'
      ];

      objectives.forEach((objective, index) => {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        doc.text(objective, margin, 120 + (index * 15));
      });

      // Appel à la participation
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(212, 175, 55);
      doc.text('REJOIGNEZ-NOUS', margin, 200);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      const callToAction = `Que vous soyez mannequin, styliste, partenaire, photographe ou que vous ayez un autre talent à partager, nous vous invitons à rejoindre cette célébration de la mode.

Contactez-nous dès maintenant pour participer à cette aventure exceptionnelle !`;

      const splitCallToAction = doc.splitTextToSize(callToAction, contentWidth);
      doc.text(splitCallToAction, margin, 220);

      setProgress(95);

      // 5. Page de contact
      doc.addPage();
      setProgress(98);

      // Titre de section
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(212, 175, 55);
      doc.text('CONTACT & INFORMATIONS', margin, 30);

      // Informations de contact
      const contactInfo = [
        { label: 'Agence', value: 'Perfect Models Management' },
        { label: 'Fondateur', value: 'Parfait Asseko' },
        { label: 'Email', value: 'contact@perfectmodelsmanagement.ga' },
        { label: 'Téléphone', value: '+241 XX XX XX XX' },
        { label: 'Adresse', value: 'Libreville, Gabon' },
        { label: 'Site web', value: 'www.perfectmodelsmanagement.ga' }
      ];

      contactInfo.forEach((info, index) => {
        const y = 60 + (index * 20);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text(info.label + ':', margin, y);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        doc.text(info.value, margin + 40, y);
      });

      // Logo final
      try {
        const logo = await loadImage(siteConfig.logo);
        const logoWidth = 50;
        const logoHeight = (logo.height * logoWidth) / logo.width;
        const logoX = (pageWidth - logoWidth) / 2;
        doc.addImage(logo, 'JPEG', logoX, 200, logoWidth, logoHeight);
      } catch (error) {
        console.warn('Impossible de charger le logo:', error);
      }

      // Footer final
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text('Perfect Fashion Day Édition 2 - "L\'Art de Se Révéler"', pageWidth / 2, pageHeight - 20, { align: 'center' });
      doc.text('31 Janvier 2026 - Complexe Hôtelier Le Nalys, Angondjé', pageWidth / 2, pageHeight - 15, { align: 'center' });

      setProgress(100);

      // Sauvegarder le PDF
      doc.save('Perfect-Fashion-Day-Edition-2-Pressbook.pdf');
      
    } catch (error) {
      console.error('Erreur lors de la génération du pressbook:', error);
      alert('Erreur lors de la génération du pressbook. Veuillez réessayer.');
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-pm-dark border border-pm-gold/20 rounded-xl p-8 max-w-md w-full">
        <div className="text-center">
          <h3 className="text-2xl font-playfair text-pm-gold mb-4">
            Pressbook Édition 2
          </h3>
          <p className="text-pm-off-white/80 mb-6">
            Téléchargez notre pressbook complet pour découvrir la prochaine édition du Perfect Fashion Day.
          </p>
          
          {isGenerating ? (
            <div className="space-y-4">
              <div className="w-full bg-pm-dark border border-pm-gold/20 rounded-full h-2">
                <div 
                  className="bg-pm-gold h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-pm-gold text-sm">
                Génération en cours... {progress}%
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-left text-sm text-pm-off-white/70 space-y-2">
                <p>• Présentation de l'agence</p>
                <p>• Rétrospective de l'édition 1</p>
                <p>• Présentation de l'édition 2</p>
                <p>• Photos des créateurs</p>
                <p>• Informations de contact</p>
              </div>
              
              <button
                onClick={generatePressbook}
                className="w-full px-6 py-3 bg-pm-gold text-pm-dark font-bold rounded-full hover:bg-white transition-colors"
              >
                Télécharger le Pressbook
              </button>
            </div>
          )}
          
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="mt-4 px-4 py-2 text-pm-off-white/60 hover:text-pm-gold transition-colors text-sm"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default PressbookGenerator;
