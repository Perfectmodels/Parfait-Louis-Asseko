import React, { useMemo, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { CastingApplication, CastingApplicationStatus, Model, JuryScore, JuryMember } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, CheckBadgeIcon, XCircleIcon, ArrowPathIcon, PrinterIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const generateCastingSheetHtml = (app: CastingApplication, juryMembers: JuryMember[], siteConfig: any): string => {
    const calculateAge = (birthDate: string): string => {
        if (!birthDate) return 'N/A';
        const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
        return `${age} ans`;
    };

    const juryScores: [string, JuryScore][] = app.scores ? Object.entries(app.scores) : [];
    const overallScores = juryScores.map(([, score]) => score.overall);
    const averageScore = overallScores.length > 0 ? (overallScores.reduce((a, b) => a + b, 0) / overallScores.length) : 0;
    const decision = averageScore >= 5 ? 'Présélectionné' : 'Recalé';

    const scoreRows = juryScores.map(([juryId, score]) => {
        const jury = juryMembers.find(j => j.id === juryId);
        return `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px; font-weight: bold;">${jury?.name || juryId}</td>
                <td style="padding: 8px; text-align: center;">${score.physique.toFixed(1)}</td>
                <td style="padding: 8px; text-align: center;">${score.presence.toFixed(1)}</td>
                <td style="padding: 8px; text-align: center;">${score.photogenie.toFixed(1)}</td>
                <td style="padding: 8px; text-align: center;">${score.potentiel.toFixed(1)}</td>
                <td style="padding: 8px; text-align: center; font-weight: bold; color: #D4AF37; background-color: #111;">${score.overall.toFixed(1)}</td>
            </tr>
        `;
    }).join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; }
                .sheet { padding: 40px; }
                .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ccc; padding-bottom: 16px; }
                .header h1 { font-size: 36px; margin: 0; }
                .header img { height: 70px; }
                .title { font-size: 56px; font-weight: bold; color: #D4AF37; }
                .passage-box { text-align: center; background-color: #111; color: white; padding: 16px; }
                .passage-box p { margin: 0; }
                .passage-num { font-size: 80px; font-weight: bold; color: #D4AF37; line-height: 1; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
                th { background-color: #f2f2f2; padding: 10px 8px; border-bottom: 2px solid #ccc; }
                .decision { font-weight: bold; font-size: 40px; ${decision === 'Présélectionné' ? 'color: green;' : 'color: red;'} }
            </style>
        </head>
        <body>
            <div class="sheet">
                <header class="header">
                    <div>
                        <h1>Fiche Candidat</h1>
                        <p>Casting Perfect Models Management</p>
                    </div>
                    ${siteConfig?.logo ? `<img src="${siteConfig.logo}" alt="Logo" />` : ''}
                </header>
                <section style="margin-top: 24px; display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
                    <div>
                        <h2 class="title">${app.firstName} ${app.lastName}</h2>
                        <div style="margin-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 18px;">
                            <p><strong>├ége:</strong> ${calculateAge(app.birthDate)}</p>
                            <p><strong>Genre:</strong> ${app.gender}</p>
                            <p><strong>Taille:</strong> ${app.height} cm</p>
                            <p><strong>Poids:</strong> ${app.weight} kg</p>
                            <p><strong>Téléphone:</strong> ${app.phone}</p>
                            <p><strong>Email:</strong> ${app.email}</p>
                        </div>
                    </div>
                    <div class="passage-box">
                        <p style="font-size: 14px; text-transform: uppercase;">Numéro de Passage</p>
                        <p class="passage-num">#${String(app.passageNumber).padStart(3, '0')}</p>
                    </div>
                </section>
                <section style="margin-top: 24px;">
                    <h3>├ëvaluation du Jury</h3>
                    <table>
                        <thead><tr><th>Jury</th><th>Physique</th><th>Présence</th><th>Photogénie</th><th>Potentiel</th><th>Globale</th></tr></thead>
                        <tbody>${scoreRows}</tbody>
                    </table>
                </section>
                <section style="margin-top: 32px; padding-top: 16px; border-top: 2px solid #ccc; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3>Moyenne Générale</h3>
                        <p style="font-size: 60px; font-weight: bold; color: #D4AF37; margin:0;">${averageScore.toFixed(2)} <span style="font-size: 30px; color: #333;">/ 10</span></p>
                    </div>
                    <div>
                        <h3>Décision Provisoire</h3>
                        <p class="decision">${decision}</p>
                    </div>
                </section>
            </div>
        </body>
        </html>
    `;
};


const AdminCastingResults: React.FC = () => {
    const { data, addDocument, updateDocument } = useData();
    const [filter, setFilter] = useState<CastingApplicationStatus | 'AllScored'>('AllScored');

    const applicantsWithScores = useMemo(() => {
        const juryMembers: JuryMember[] = data?.juryMembers || [];
        return (data?.castingApplications || [])
            .filter(app => app.scores && Object.keys(app.scores).length > 0)
            .map(app => {
                const scores = Object.values(app.scores!);
                const averageScore = scores.reduce((sum, s) => sum + (s as JuryScore).overall, 0) / scores.length;

                const scoredJuryIds = Object.keys(app.scores || {});
                const missingJuries = juryMembers.filter(j => !scoredJuryIds.includes(j.id));
                const isFullyScored = missingJuries.length === 0 && juryMembers.length > 0;

                return { ...app, averageScore, juryVotes: scores.length, missingJuries, isFullyScored };
            })
            .sort((a, b) => b.averageScore - a.averageScore);
    }, [data?.castingApplications, data?.juryMembers]);

    const filteredApplicants = useMemo(() => {
        if (filter === 'AllScored') return applicantsWithScores;
        return applicantsWithScores.filter(app => app.status === filter);
    }, [filter, applicantsWithScores]);

    const handleUpdateStatus = async (appId: string, newStatus: CastingApplicationStatus) => {
        try {
            await updateDocument('castingApplications', appId, { status: newStatus });
        } catch (error) {
            console.error(error);
        }
    };

    const handleValidateAndCreateModel = async (app: CastingApplication) => {
        if (!data) return;

        if (app.status === 'Accepté') {
            alert("Ce candidat a déjà été accepté et un profil a été créé.");
            return;
        }

        // Prepare portfolio images from casting photos
        const castingPhotos = [app.photoPortraitUrl, app.photoFullBodyUrl, app.portfolioLink]
            .filter(url => url && (url.startsWith('http') || url.startsWith('data:image'))) as string[];

        const existingModelIndex = data.models.findIndex(m => m.name.toLowerCase() === `${app.firstName} ${app.lastName}`.toLowerCase());

        if (existingModelIndex !== -1) {
            if (window.confirm(`Un mannequin nommé "${app.firstName} ${app.lastName}" existe déjà. Voulez-vous ├ëCRASER ses données existantes avec celles de ce casting (contact, mensurations, photos) ?`)) {
                const existingModel = data.models[existingModelIndex];

                // Merge portfolio images
                const updatedPortfolioImages = [...(existingModel.portfolioImages || []), ...castingPhotos];
                // Remove duplicates
                const uniquePortfolioImages = Array.from(new Set(updatedPortfolioImages));

                const updatedModel: Model = {
                    ...existingModel,
                    email: app.email || existingModel.email,
                    phone: app.phone || existingModel.phone,
                    height: app.height ? `${app.height}cm` : existingModel.height,
                    weight: app.weight ? `${app.weight}kg` : existingModel.weight,
                    hairColor: app.hairColor || existingModel.hairColor,
                    eyeColor: app.eyeColor || existingModel.eyeColor,
                    instagram: app.instagram || existingModel.instagram,
                    measurements: {
                        chest: app.chest ? `${app.chest}cm` : existingModel.measurements.chest,
                        waist: app.waist ? `${app.waist}cm` : existingModel.measurements.waist,
                        hips: app.hips ? `${app.hips}cm` : existingModel.measurements.hips,
                        shoeSize: app.shoeSize || existingModel.measurements.shoeSize,
                    },
                    location: app.city || existingModel.location,
                    age: app.birthDate ? new Date().getFullYear() - new Date(app.birthDate).getFullYear() : existingModel.age,
                    portfolioImages: uniquePortfolioImages,
                    // We don't overwrite experience/journey unless it's empty, or we append it?
                    // Let's append casting experience info if useful, or leave as is.
                    // User said "overwrite", so maybe we should set it if provided?
                    // Casting app has 'experience' field.
                    experience: app.experience ? `${existingModel.experience || ''}\n\n[Casting Update]: ${app.experience}`.trim() : existingModel.experience,
                };

                const updatedModels = [...data.models];
                updatedModels[existingModelIndex] = updatedModel;

                const updatedApps = data.castingApplications.map(localApp => localApp.id === app.id ? { ...localApp, status: 'Accepté' as const } : localApp);

                try {
                    await updateDocument('models', existingModel.id, updatedModel);
                    await updateDocument('castingApplications', app.id, { status: 'Accepté' });
                    alert(`Le profil de ${updatedModel.name} a été mis à jour (écrasé) avec succès.`);
                } catch (error) {
                    console.error("Erreur lors de la mise à jour du profil:", error);
                    alert("Une erreur est survenue lors de la sauvegarde.");
                }
            } else {
                if (window.confirm("Voulez-vous marquer la candidature comme 'Accepté' SANS modifier le profil existant ?")) {
                    await handleUpdateStatus(app.id, 'Accepté');
                }
            }
            return;
        }

        const currentYear = new Date().getFullYear();
        const sanitizeForPassword = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f']/g, "").replace(/[^a-z0-9-]/g, "");

        const initial = app.firstName.charAt(0).toUpperCase();
        const modelsWithSameInitial = data.models.filter(m => m.username && m.username.startsWith(`Man-PMM${initial}`));
        const existingNumbers = modelsWithSameInitial.map(m => parseInt(m.username.replace(`Man-PMM${initial}`, ''), 10) || 0);
        const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
        const username = `Man-PMM${initial}${String(nextNumber).padStart(2, '0')}`;
        const password = `${sanitizeForPassword(app.firstName)}${currentYear}`;
        const id = `${sanitizeForPassword(app.lastName)}-${sanitizeForPassword(app.firstName)}-${app.id.slice(-4)}`;

        const age = app.birthDate ? new Date().getFullYear() - new Date(app.birthDate).getFullYear() : undefined;

        const newModel: Model = {
            id, name: `${app.firstName} ${app.lastName}`, username, password, level: 'Débutant',
            email: app.email, phone: app.phone, age,
            height: `${app.height}cm`,
            weight: `${app.weight}kg`,
            hairColor: app.hairColor,
            eyeColor: app.eyeColor,
            instagram: app.instagram,
            gender: app.gender, location: app.city,
            imageUrl: app.photoPortraitUrl || `https://i.ibb.co/fVBxPNTP/T-shirt.png`,
            isPublic: false, distinctions: [],
            portfolioImages: castingPhotos,
            measurements: {
                chest: `${app.chest || '0'}cm`, waist: `${app.waist || '0'}cm`,
                hips: `${app.hips || '0'}cm`, shoeSize: `${app.shoeSize || '0'}`,
            },
            categories: [],
            experience: app.experience || 'Nouveau mannequin issu du casting.',
            journey: 'Profil créé automatiquement après validation du casting.', quizScores: {}
        };

        try {
            await addDocument('models', newModel);
            await updateDocument('castingApplications', app.id, { status: 'Accepté' });
            alert(`Le profil débutant pour ${newModel.name} a été créé avec succès (Identifiant: ${username}). La candidature a été marquée comme "Accepté".`);
        } catch (error) {
            console.error("Erreur lors de la création du profil débutant:", error);
            alert("Une erreur est survenue lors de la sauvegarde.");
        }
    };

    const handleBulkCreateModels = async () => {
        if (!data) return;

        console.log('🔍 Debug - Total applicantsWithScores:', applicantsWithScores.length);
        console.log('🔍 Debug - Premier candidat (si existe):', applicantsWithScores[0]);

        // Filtrer tous les candidats qui ont au moins une note
        // ET qui n'ont PAS encore de profil créé (même s'ils sont déjà marqués 'Accepté')
        const eligibleCandidates = applicantsWithScores.filter(app => {
            const hasVotes = app.juryVotes > 0;

            // Vérifier si un modèle existe déjà avec ce nom
            const modelExists = data.models.some(m =>
                m.name.toLowerCase() === `${app.firstName} ${app.lastName}`.toLowerCase()
            );

            console.log(`👤 ${app.firstName} ${app.lastName} -> Votes: ${app.juryVotes}, Existe déjà: ${modelExists}, Éligible: ${hasVotes && !modelExists}`);

            // Éligible si a des votes ET n'a pas de profil existant
            return hasVotes && !modelExists;
        });

        console.log('📊 Candidats éligibles:', eligibleCandidates.length);

        if (eligibleCandidates.length === 0) {
            alert(`Aucun candidat éligible.\n\nTotal analysé: ${applicantsWithScores.length}\n\nTous les candidats notés ont déjà un profil existant dans la base de données.`);
            return;
        }

        const confirmMessage = `Vous êtes sur le point de créer ${eligibleCandidates.length} profil(s) de mannequin(s) :\n\n${eligibleCandidates.map(app => `- ${app.firstName} ${app.lastName} (${app.averageScore.toFixed(2)}/10)`).join('\n')}\n\nConfirmer ?`;

        if (!confirm(confirmMessage)) return;

        const currentYear = new Date().getFullYear();
        const sanitizeForPassword = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f']/g, "").replace(/[^a-z0-9-]/g, "");

        const newModels: Model[] = [];
        const updatedApplicationIds: string[] = [];
        let skippedCount = 0;

        for (const app of eligibleCandidates) {
            const modelExists = data.models.some(m => m.name.toLowerCase() === `${app.firstName} ${app.lastName}`.toLowerCase());
            if (modelExists) {
                skippedCount++;
                updatedApplicationIds.push(app.id);
                continue;
            }

            const initial = app.firstName.charAt(0).toUpperCase();
            const modelsWithSameInitial = [...data.models, ...newModels].filter(m => m.username && m.username.startsWith(`Man-PMM${initial}`));
            const existingNumbers = modelsWithSameInitial.map(m => parseInt(m.username.replace(`Man-PMM${initial}`, ''), 10) || 0);
            const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
            const username = `Man-PMM${initial}${String(nextNumber).padStart(2, '0')}`;
            const password = `${sanitizeForPassword(app.firstName)}${currentYear}`;
            const id = `${sanitizeForPassword(app.lastName)}-${sanitizeForPassword(app.firstName)}-${app.id.slice(-4)}`;

            const age = app.birthDate ? new Date().getFullYear() - new Date(app.birthDate).getFullYear() : undefined;

            const newModel: Model = {
                id, name: `${app.firstName} ${app.lastName}`, username, password, level: 'Débutant',
                email: app.email, phone: app.phone, age, height: `${app.height}cm`, gender: app.gender, location: app.city,
                imageUrl: app.photoPortraitUrl || `https://i.ibb.co/fVBxPNTP/T-shirt.png`,
                isPublic: false, distinctions: [], portfolioImages: app.photoFullBodyUrl ? [app.photoFullBodyUrl] : [],
                measurements: {
                    chest: `${app.chest || '0'}cm`, waist: `${app.waist || '0'}cm`,
                    hips: `${app.hips || '0'}cm`, shoeSize: `${app.shoeSize || '0'}`,
                },
                categories: [], experience: `Nouveau mannequin issu du casting. Score: ${app.averageScore.toFixed(2)}/10`,
                journey: 'Profil créé automatiquement après validation du casting.', quizScores: {}
            };

            newModels.push(newModel);
            updatedApplicationIds.push(app.id);
        }

        if (newModels.length === 0 && skippedCount > 0) {
            alert(`Tous les ${skippedCount} candidat(s) ont déjà un profil existant.`);
            return;
        }

        try {
            // Création des modèles en parallèle
            const modelPromises = newModels.map(m => addDocument('models', m));
            await Promise.all(modelPromises);

            // Mise à jour des statuts en parallèle
            const appPromises = updatedApplicationIds.map(id => updateDocument('castingApplications', id, { status: 'Accepté' }));
            await Promise.all(appPromises);

            let message = `✅ ${newModels.length} profil(s) créé(s) avec succès !\n\n`;
            message += newModels.map(m => `- ${m.name} (${m.username})`).join('\n');
            if (skippedCount > 0) {
                message += `\n\n⚠️ ${skippedCount} candidat(s) ignoré(s) (profil déjà existant)`;
            }
            alert(message);
        } catch (error) {
            console.error("Erreur lors de la création en masse:", error);
            alert("Une erreur est survenue lors de la sauvegarde. Certains profils ont peut-être été créés partiellement.");
        }
    };


    const handlePrint = (app: CastingApplication) => {
        if (!data?.juryMembers || !data.siteConfig) return;
        const html = generateCastingSheetHtml(app, data.juryMembers, data.siteConfig);
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
        } else {
            alert("Veuillez autoriser les pop-ups pour imprimer la fiche.");
        }
    };

    const getStatusColor = (status: CastingApplicationStatus) => {
        switch (status) {
            case 'Nouveau': return 'bg-blue-500/20 text-blue-300 border-blue-500';
            case 'Présélectionné': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
            case 'Accepté': return 'bg-green-500/20 text-green-300 border-green-500';
            case 'Refusé': return 'bg-red-500/20 text-red-300 border-red-500';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 7.5) return 'text-green-400';
        if (score >= 5) return 'text-yellow-400';
        return 'text-red-400';
    };

    const filterOptions: { value: CastingApplicationStatus | 'AllScored', label: string }[] = [
        { value: 'AllScored', label: 'Tous les Notés' },
        { value: 'Présélectionné', label: 'Présélectionnés' },
        { value: 'Accepté', label: 'Acceptés' },
        { value: 'Refusé', label: 'Refusés' }
    ];

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Résultats & Validation Casting" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Tableau de Bord
                </Link>
                <h1 className="text-4xl font-playfair text-pm-gold">Résultats & Validation Casting</h1>
                <p className="text-pm-off-white/70 mt-2 mb-4">
                    Consultez les moyennes des candidats et validez leur entrée dans l'agence.
                </p>

                <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
                    <div className="flex items-center gap-4 flex-wrap">
                        {filterOptions.map(f => (
                            <button key={f.value} onClick={() => setFilter(f.value)} className={`px-4 py-1.5 text-sm uppercase tracking-wider rounded-full transition-all duration-300 ${filter === f.value ? 'bg-pm-gold text-pm-dark' : 'bg-black border border-pm-gold text-pm-gold hover:bg-pm-gold/20'}`}>
                                {f.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleBulkCreateModels}
                        className="flex items-center gap-2 px-6 py-3 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-pm-gold/90 transition-all duration-300 shadow-lg shadow-pm-gold/20 hover:scale-105"
                        title="Créer automatiquement des profils pour tous les candidats notés"
                    >
                        <UserPlusIcon className="w-5 h-5" />
                        Créer tous les profils
                    </button>
                </div>

                <div className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden shadow-lg shadow-black/30">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-pm-dark/50">
                                <tr className="border-b border-pm-gold/20">
                                    <th className="p-4 uppercase text-xs tracking-wider">Passage</th>
                                    <th className="p-4 uppercase text-xs tracking-wider">Candidat</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-center">Votes Jury</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-center">Moyenne</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-center">Statut</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplicants.map(app => {
                                    const missingJuryNames = app.missingJuries.map(j => j.name).join(', ');
                                    const tooltip = app.isFullyScored
                                        ? "Toutes les notes ont été enregistrées."
                                        : `Notes manquantes: ${missingJuryNames}`;
                                    return (
                                        <tr key={app.id} className={`border-b border-pm-dark hover:bg-pm-dark/50 ${app.isFullyScored ? 'bg-pm-dark border-l-4 border-l-pm-gold' : ''}`}>
                                            <td className="p-4 font-bold text-pm-gold">#${String(app.passageNumber).padStart(3, '0')}</td>
                                            <td className="p-4 font-semibold">{app.firstName} ${app.lastName}</td>
                                            <td className="p-4 text-center" title={tooltip}>
                                                {app.juryVotes} / {data?.juryMembers.length || 4}
                                                {!app.isFullyScored && <span className="text-red-500 ml-1">*</span>}
                                            </td>
                                            <td className={`p-4 text-center font-bold text-lg ${getScoreColor(app.averageScore)}`}>{app.averageScore.toFixed(2)}</td>
                                            <td className="p-4 text-center"><span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusColor(app.status)}`}>{app.status}</span></td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handlePrint(app)}
                                                        className="action-btn bg-blue-500/10 text-blue-300 border-blue-500/50 hover:bg-blue-500/20"
                                                        title="Télécharger la fiche PDF"
                                                    >
                                                        <PrinterIcon className="w-5 h-5" />
                                                    </button>
                                                    {app.status === 'Présélectionné' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleValidateAndCreateModel(app)}
                                                                className="action-btn bg-green-500/10 text-green-300 border-green-500/50 hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title={app.isFullyScored ? "Accepter & Créer le profil" : "En attente de toutes les notes"}
                                                                disabled={!app.isFullyScored}
                                                            >
                                                                <CheckBadgeIcon className="w-5 h-5" />
                                                            </button>
                                                            <button onClick={() => handleUpdateStatus(app.id, 'Refusé')} className="action-btn bg-red-500/10 text-red-300 border-red-500/50 hover:bg-red-500/20" title="Refuser">
                                                                <XCircleIcon className="w-5 h-5" />
                                                            </button>
                                                        </>
                                                    )}
                                                    {app.status === 'Accepté' && (
                                                        <span className="text-xs text-green-400">Profil Créé</span>
                                                    )}
                                                    {app.status === 'Refusé' && (
                                                        <button onClick={() => handleUpdateStatus(app.id, 'Présélectionné')} className="action-btn bg-yellow-500/10 text-yellow-300 border-yellow-500/50 hover:bg-yellow-500/20" title="Annuler le refus">
                                                            <ArrowPathIcon className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {filteredApplicants.length === 0 && <p className="text-center p-8 text-pm-off-white/60">Aucun candidat ne correspond à ce filtre.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCastingResults;
