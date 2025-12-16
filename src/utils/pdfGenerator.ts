import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CastingApplication } from '../types';

// Extend jsPDF interface for autotable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
        lastAutoTable: { finalY: number };
    }
}

export const generateCastingPDF = (data: CastingApplication) => {
    const doc = new jsPDF();
    const goldColor = '#D4AF37';
    const darkColor = '#111111';

    // Header Background
    doc.setFillColor(darkColor);
    doc.rect(0, 0, 210, 40, 'F');

    // Logo Text (or placeholder if image loading is complex)
    doc.setTextColor(goldColor);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('PERFECT MODELS MANAGEMENT', 105, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('FICHE DE CANDIDATURE', 105, 30, { align: 'center' });

    // Date
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date de soumission : ${new Date(data.submissionDate).toLocaleDateString('fr-FR')}`, 14, 50);

    // Sections Helper
    let currentY = 60;

    const addSectionTitle = (title: string, y: number) => {
        doc.setFillColor(goldColor);
        doc.roundedRect(14, y - 6, 182, 8, 1, 1, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(title.toUpperCase(), 17, y - 1);
        return y + 10;
    };

    // --- INFORMATIONS PERSONNELLES ---
    currentY = addSectionTitle('Informations Personnelles', currentY);

    doc.autoTable({
        startY: currentY,
        head: [],
        body: [
            ['Nom', data.lastName.toUpperCase(), 'Prénom', data.firstName],
            ['Date de naissance', data.birthDate, 'Nationalité', data.nationality],
            ['Email', data.email, 'Téléphone', data.phone],
            ['Ville', data.city, 'Genre', data.gender]
        ],
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 3, font: 'helvetica' },
        columnStyles: {
            0: { fontStyle: 'bold', width: 40, textColor: [100, 100, 100] }, // Label color
            1: { width: 55 },
            2: { fontStyle: 'bold', width: 40, textColor: [100, 100, 100] }, // Label color
        },
    });

    currentY = doc.lastAutoTable.finalY + 15;

    // --- MENSURATIONS ---
    currentY = addSectionTitle('Mensurations & Physique', currentY);

    doc.autoTable({
        startY: currentY,
        head: [],
        body: [
            ['Taille', `${data.height} cm`, 'Poids', `${data.weight} kg`],
            ['Poitrine', `${data.chest || '-'} cm`, 'Taille', `${data.waist || '-'} cm`],
            ['Hanches', `${data.hips || '-'} cm`, 'Pointure', data.shoeSize],
            ['Yeux', data.eyeColor || '-', 'Cheveux', data.hairColor || '-']
        ],
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 3, font: 'helvetica' },
        columnStyles: {
            0: { fontStyle: 'bold', width: 40, textColor: [100, 100, 100] },
            1: { width: 55 },
            2: { fontStyle: 'bold', width: 40, textColor: [100, 100, 100] },
        },
    });

    currentY = doc.lastAutoTable.finalY + 15;

    // --- EXPÉRIENCE ---
    currentY = addSectionTitle('Expérience & Réseaux', currentY);

    const experienceMap: Record<string, string> = {
        'none': 'Aucune expérience',
        'beginner': 'Débutant(e)',
        'intermediate': 'Intermédiaire',
        'professional': 'Professionnel(le)'
    };

    doc.autoTable({
        startY: currentY,
        head: [],
        body: [
            ['Niveau', experienceMap[data.experience] || data.experience, '', ''],
            ['Instagram', data.instagram || '-', 'Portfolio', data.portfolioLink || '-']
        ],
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 3, font: 'helvetica' },
        columnStyles: {
            0: { fontStyle: 'bold', width: 40, textColor: [100, 100, 100] },
            1: { width: 55 },
            2: { fontStyle: 'bold', width: 40, textColor: [100, 100, 100] },
        },
    });

    // --- FOOTER ---
    const pageHeight = doc.internal.pageSize.height;
    doc.setDrawColor(200, 200, 200);
    doc.line(14, pageHeight - 20, 196, pageHeight - 20); // Divider

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text('Ce document résume votre candidature chez Perfect Models Management.', 14, pageHeight - 15);
    doc.text(`ID: ${data.id}`, 14, pageHeight - 10);

    doc.text('perfectmodels.ga', 196, pageHeight - 15, { align: 'right' });

    // Save with a clean name
    doc.save(`Candidature_PMM_${data.lastName.replace(/\s+/g, '_')}_${data.firstName.replace(/\s+/g, '_')}.pdf`);
};
