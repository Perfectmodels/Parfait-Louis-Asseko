import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ClipboardDocumentIcon, CheckIcon, CheckBadgeIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { BeginnerStudent, Model } from '../types';

const AdminBeginnerStudents: React.FC = () => {
    const { data, saveData } = useData();
    const students = data?.beginnerStudents || [];
    const [copiedMatricule, setCopiedMatricule] = useState<string | null>(null);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [isPromotingBatch, setIsPromotingBatch] = useState(false);

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
    
    const createModelFromStudent = (studentToPromote: BeginnerStudent, existingModels: any[]) => {
        const originalApplication = (data?.castingApplications || []).find(app => app.id === studentToPromote.id);
        const currentYear = new Date().getFullYear();
        const sanitizeForPassword = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f\']/g, "").replace(/[^a-z0-9-]/g, "");
        
        const firstName = studentToPromote.name.split(' ')[0] || 'new';
        const initial = firstName.charAt(0).toUpperCase();
        
        const modelsWithSameInitial = existingModels.filter(m => m.username && m.username.startsWith(`Man-PMM${initial}`));
        const existingNumbers = modelsWithSameInitial.map(m => {
            const numPart = m.username?.replace(`Man-PMM${initial}`, '') || '0';
            return parseInt(numPart, 10) || 0;
        });
        const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
        
        const username = `Man-PMM${initial}${String(nextNumber).padStart(2, '0')}`;
        const password = `${sanitizeForPassword(firstName)}${currentYear}`;
        const id = `${sanitizeForPassword(studentToPromote.name.split(' ').join('-'))}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        return {
            model: {
                id,
                name: studentToPromote.name,
                username,
                password,
                email: originalApplication?.email || studentToPromote.email || '',
                phone: originalApplication?.phone || studentToPromote.phone || '',
                age: originalApplication?.birthDate ? new Date().getFullYear() - new Date(originalApplication.birthDate).getFullYear() : 0,
                height: originalApplication?.height ? `${originalApplication.height}cm` : '',
                gender: originalApplication?.gender || 'Femme',
                location: '',
                imageUrl: originalApplication?.photos?.[0] || '',
                portfolioImages: originalApplication?.photos || [],
                distinctions: [],
                isPublic: false,
                level: 'Pro',
                measurements: {
                    chest: originalApplication?.chest ? String(originalApplication.chest) : originalApplication?.bust ? String(originalApplication.bust) : '',
                    waist: originalApplication?.waist ? String(originalApplication.waist) : '',
                    hips: originalApplication?.hips ? String(originalApplication.hips) : '',
                    shoeSize: originalApplication?.shoeSize ? String(originalApplication.shoeSize) : '',
                },
                categories: ['Fashion', 'Promu du Classroom'],
                experience: 'Promu depuis le Classroom Débutant. Programme de formation complété avec succès.',
                journey: 'Formation complète dans le programme débutant de Perfect Models Management.',
                quizScores: studentToPromote.quizScores || {},
                lastLogin: studentToPromote.lastLogin,
                lastActivity: new Date().toISOString(),
            },
            credentials: { username, password }
        };
    };

    const handlePromote = async (studentToPromote: BeginnerStudent) => {
        if (!data || !window.confirm(`Êtes-vous sûr de vouloir promouvoir ${studentToPromote.name} au niveau Professionnel ? Un nouveau profil Pro sera créé et l'étudiant sera retiré de cette liste.`)) return;

        const { model: newProModel, credentials } = createModelFromStudent(studentToPromote, data.models || []);

        const updatedBeginnerStudents = data.beginnerStudents.filter(s => s.id !== studentToPromote.id);
        const updatedModels = [...(data.models || []), newProModel];

        try {
            await saveData({ ...data, beginnerStudents: updatedBeginnerStudents, models: updatedModels });
            alert(`✅ ${studentToPromote.name} a été promu(e) au statut Professionnel !\n\n🔑 Identifiants:\nUsername: ${credentials.username}\nMot de passe: ${credentials.password}\n\nCes informations sont disponibles dans "Accès Mannequins Pro".`);
        } catch (error) {
            console.error("Failed to promote student:", error);
            alert("❌ Une erreur est survenue lors de la promotion. Veuillez réessayer.");
        }
    };

    const handleBatchPromote = async () => {
        if (!data || selectedStudents.length === 0) return;
        
        if (!window.confirm(`Êtes-vous sûr de vouloir promouvoir ${selectedStudents.length} mannequin(s) au niveau Professionnel ?\n\nCette action créera ${selectedStudents.length} nouveaux profils Pro.`)) return;

        setIsPromotingBatch(true);
        
        try {
            const studentsToPromote = data.beginnerStudents.filter(s => selectedStudents.includes(s.id));
            const promotedModels: any[] = [];
            const credentialsList: Array<{ name: string; username: string; password: string }> = [];
            let currentModels = [...(data.models || [])];

            // Créer tous les nouveaux profils
            studentsToPromote.forEach(student => {
                const { model, credentials } = createModelFromStudent(student, currentModels);
                promotedModels.push(model);
                currentModels.push(model); // Pour éviter les doublons de username
                credentialsList.push({
                    name: student.name,
                    username: credentials.username,
                    password: credentials.password
                });
            });

            // Mettre à jour les données
            const updatedBeginnerStudents = data.beginnerStudents.filter(s => !selectedStudents.includes(s.id));
            const updatedModels = [...(data.models || []), ...promotedModels];

            await saveData({ ...data, beginnerStudents: updatedBeginnerStudents, models: updatedModels });

            // Créer un récapitulatif
            const summary = credentialsList.map((cred, index) => 
                `${index + 1}. ${cred.name}\n   Username: ${cred.username}\n   Password: ${cred.password}`
            ).join('\n\n');

            // Télécharger un fichier CSV avec les identifiants
            const csvContent = [
                ['Nom', 'Username', 'Mot de passe', 'Date de promotion'].join(','),
                ...credentialsList.map(cred => [
                    cred.name,
                    cred.username,
                    cred.password,
                    new Date().toLocaleDateString('fr-FR')
                ].join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `promotions-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            alert(`✅ ${selectedStudents.length} mannequin(s) promu(s) avec succès !\n\n📋 Identifiants:\n\n${summary}\n\n💾 Un fichier CSV avec tous les identifiants a été téléchargé.`);
            
            setSelectedStudents([]);
        } catch (error) {
            console.error("Failed to promote students:", error);
            alert("❌ Une erreur est survenue lors de la promotion par lot. Veuillez réessayer.");
        } finally {
            setIsPromotingBatch(false);
        }
    };

    const toggleSelectStudent = (studentId: string) => {
        setSelectedStudents(prev => 
            prev.includes(studentId) 
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedStudents.length === students.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(students.map(s => s.id));
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
                    <div className="flex flex-wrap gap-2">
                        {selectedStudents.length > 0 && (
                            <button 
                                onClick={handleBatchPromote} 
                                disabled={isPromotingBatch}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold uppercase tracking-widest text-sm rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <CheckBadgeIcon className="w-5 h-5"/>
                                {isPromotingBatch ? 'Promotion...' : `Promouvoir (${selectedStudents.length})`}
                            </button>
                        )}
                        <button onClick={handleDownloadCSV} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full hover:bg-pm-gold hover:text-pm-dark">
                            <ArrowDownTrayIcon className="w-5 h-5"/> Télécharger CSV
                        </button>
                    </div>
                </div>

                <div className="admin-section-wrapper !p-2 sm:!p-4 mt-8">
                     <table className="w-full text-left">
                        <thead className="bg-pm-dark/50">
                            <tr className="border-b border-pm-gold/20">
                                <th className="p-4 w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectedStudents.length === students.length && students.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-pm-gold/50 bg-pm-dark text-pm-gold focus:ring-pm-gold"
                                        title="Tout sélectionner"
                                    />
                                </th>
                                <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Nom</th>
                                <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Matricule & Accès</th>
                                <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id} className={`border-b border-pm-dark hover:bg-pm-dark/50 transition-colors ${selectedStudents.includes(student.id) ? 'bg-pm-gold/10' : ''}`}>
                                    <td className="p-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.includes(student.id)}
                                            onChange={() => toggleSelectStudent(student.id)}
                                            className="w-4 h-4 rounded border-pm-gold/50 bg-pm-dark text-pm-gold focus:ring-pm-gold"
                                        />
                                    </td>
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
                                                disabled={isPromotingBatch}
                                                className="action-btn bg-green-500/10 text-green-300 border-green-500/50 hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed" 
                                                title="Promouvoir en Pro"
                                            >
                                                <CheckBadgeIcon className="w-5 h-5"/>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(student.id)}
                                                disabled={isPromotingBatch}
                                                className="action-btn bg-red-500/10 text-red-300 border-red-500/50 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed" 
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