import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ClipboardDocumentIcon, CheckIcon, CheckBadgeIcon, TrashIcon, ArrowDownTrayIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { BeginnerStudent, Model } from '../types';

const AdminBeginnerStudents: React.FC = () => {
    const { data, saveData } = useData();
    const students = data?.beginnerStudents || [];
    const [copiedMatricule, setCopiedMatricule] = useState<string | null>(null);

    const handleCopy = (textToCopy: string, matricule: string) => {
        navigator.clipboard.writeText(textToCopy);
        setCopiedMatricule(matricule);
        setTimeout(() => setCopiedMatricule(null), 2000);
    };

    const handleDownloadCSV = () => {
        if (!students || students.length === 0) {
            alert("Aucune donnée à télécharger.");
            return;
        }

        const headers = ["Nom du Mannequin", "Matricule", "Mot de passe"];
        const csvContent = [
            headers.join(','),
            ...students.map(student => 
                [
                    `"${student.name.replace(/"/g, '""')}"`, // Escape double quotes
                    student.matricule,
                    student.password
                ].join(',')
            )
        ].join('\n');

        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' }); // Add BOM for Excel compatibility
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "acces-mannequins-debutants.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };
    
    const handlePromote = async (studentToPromote: BeginnerStudent) => {
        if (!data || !window.confirm(`Êtes-vous sûr de vouloir promouvoir ${studentToPromote.name} au niveau Professionnel ? Un nouveau profil Pro sera créé et l'étudiant sera retiré de cette liste.`)) return;

        const originalApplication = (data.castingApplications || []).find(app => app.id === studentToPromote.id);

        const currentYear = new Date().getFullYear();
        const sanitizeForPassword = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f\']/g, "").replace(/[^a-z0-9-]/g, "");
        
        const firstName = studentToPromote.name.split(' ')[0] || 'new';
        const initial = firstName.charAt(0).toUpperCase();
        
        const modelsWithSameInitial = (data.models || []).filter(m => m.username && m.username.startsWith(`Man-PMM${initial}`));
        const existingNumbers = modelsWithSameInitial.map(m => {
            const numPart = m.username.replace(`Man-PMM${initial}`, '');
            return parseInt(numPart, 10) || 0;
        });
        const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
        
        const username = `Man-PMM${initial}${String(nextNumber).padStart(2, '0')}`;
        const password = `${sanitizeForPassword(firstName)}${currentYear}`;
        const id = `${sanitizeForPassword(studentToPromote.name.split(' ').join('-'))}-${Date.now()}`;
        
        const newProModel: Model = {
            id,
            name: studentToPromote.name,
            username,
            password,
            level: 'Mannequin',
            isPublic: false,
            gender: originalApplication?.gender || 'Femme',
            height: originalApplication ? `${originalApplication.height}cm` : 'N/A',
            imageUrl: 'https://i.ibb.co/3yD48r0J/480946208-616728137878198-6925216743970681454-n.jpg',
            measurements: originalApplication ? {
                chest: `${originalApplication.chest || '0'}cm`,
                waist: `${originalApplication.waist || '0'}cm`,
                hips: `${originalApplication.hips || '0'}cm`,
                shoeSize: originalApplication.shoeSize || '0',
            } : { chest: '0cm', waist: '0cm', hips: '0cm', shoeSize: '0' },
            categories: [],
            experience: 'Promu depuis le Classroom Débutant. Mettre à jour l\'expérience.',
            journey: 'Profil créé suite à la promotion depuis le programme débutant.',
            quizScores: {},
            distinctions: [],
            portfolioImages: [],
            email: originalApplication?.email || '',
            phone: originalApplication?.phone || '',
            age: originalApplication?.birthDate ? new Date().getFullYear() - new Date(originalApplication.birthDate).getFullYear() : undefined,
            location: originalApplication?.city || ''
        };

        const updatedBeginnerStudents = data.beginnerStudents.filter(s => s.id !== studentToPromote.id);
        const updatedModels = [...(data.models || []), newProModel];

        try {
            await saveData({ ...data, beginnerStudents: updatedBeginnerStudents, models: updatedModels });
            alert(`${studentToPromote.name} a été promu(e) au statut Professionnel avec succès !`);
        } catch (error) {
            console.error("Failed to promote student:", error);
            alert("Une erreur est survenue lors de la promotion.");
        }
    };
    
    const handleDelete = async (studentId: string) => {
        if (!data || !window.confirm("Êtes-vous sûr de vouloir supprimer cet étudiant débutant ? Cette action est irréversible.")) return;
        
        const updatedStudents = data.beginnerStudents.filter(s => s.id !== studentId);
        try {
            await saveData({ ...data, beginnerStudents: updatedStudents });
            alert("Étudiant supprimé avec succès.");
        } catch (error) {
            console.error("Failed to delete student:", error);
            alert("Une erreur est survenue lors de la suppression.");
        }
    };


    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Gérer les Débutants" noIndex />
            <div className="container mx-auto px-6">
                <div className="admin-page-header">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Tableau de Bord
                        </Link>
                        <h1 className="admin-page-title">Gérer les Mannequins Débutants</h1>
                        <p className="admin-page-subtitle">
                            Gérez les profils des mannequins en formation et promouvez-les au niveau professionnel.
                        </p>
                    </div>
                     <button onClick={handleDownloadCSV} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full hover:bg-pm-gold hover:text-pm-dark">
                        <ArrowDownTrayIcon className="w-5 h-5"/> Télécharger en CSV
                    </button>
                </div>

                <div className="admin-section-wrapper !p-2 sm:!p-4 mt-8">
                     <table className="w-full text-left">
                        <thead className="bg-pm-dark/50">
                            <tr className="border-b border-pm-gold/20">
                                <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Nom</th>
                                <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Matricule & Accès</th>
                                <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id} className="border-b border-pm-dark hover:bg-pm-dark/50">
                                    <td className="p-4 font-semibold">{student.name}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs text-pm-gold/80">{student.matricule} / {student.password}</span>
                                            <button onClick={() => handleCopy(student.password, student.matricule)} className="text-pm-off-white/60 hover:text-pm-gold">
                                                {copiedMatricule === student.matricule ? <CheckIcon className="w-4 h-4 text-green-500" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handlePromote(student)}
                                                className="action-btn bg-green-500/10 text-green-300 border-green-500/50 hover:bg-green-500/20" 
                                                title="Promouvoir en Pro"
                                            >
                                                <CheckBadgeIcon className="w-5 h-5"/>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(student.id)} 
                                                className="action-btn bg-red-500/10 text-red-300 border-red-500/50 hover:bg-red-500/20" 
                                                title="Supprimer"
                                            >
                                                <TrashIcon className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                     </table>
                     {students.length === 0 && <p className="text-center p-8 text-pm-off-white/60">Aucun mannequin débutant trouvé.</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminBeginnerStudents;