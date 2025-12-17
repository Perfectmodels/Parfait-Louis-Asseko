/**
 * PrivacyPolicy Page
 * 
 * Page de politique de confidentialité conforme RGPD
 * Explique comment Perfect Models Management collecte, utilise et protège les données personnelles
 * 
 * Sections:
 * - Introduction
 * - Données collectées
 * - Utilisation des données
 * - Cookies
 * - Droits des utilisateurs
 * - Sécurité
 * - Contact
 * 
 * @author Perfect Models Management
 * @version 1.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { ShieldCheckIcon, LockClosedIcon, UserGroupIcon, DocumentTextIcon, EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const PrivacyPolicy: React.FC = () => {
    const lastUpdated = "17 décembre 2025";

    return (
        <>
            <SEO
                title="Politique de Confidentialité | Perfect Models Management"
                description="Découvrez comment Perfect Models Management collecte, utilise et protège vos données personnelles. Politique de confidentialité conforme RGPD."
                keywords="politique de confidentialité, RGPD, protection des données, Perfect Models"
            />

            <div className="bg-black text-white min-h-screen py-24">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Retour */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-pm-gold mb-12 hover:underline tracking-widest uppercase text-xs font-bold"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Retour à l'accueil
                    </Link>

                    {/* Header */}
                    <header className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-pm-gold/10 rounded-full mb-6">
                            <ShieldCheckIcon className="w-10 h-10 text-pm-gold" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-playfair text-white mb-4">
                            Politique de Confidentialité
                        </h1>
                        <p className="text-gray-400">
                            Dernière mise à jour : {lastUpdated}
                        </p>
                    </header>

                    {/* Introduction */}
                    <section className="mb-12 p-6 bg-pm-gold/5 border border-pm-gold/20 rounded-xl">
                        <p className="text-lg text-gray-300 leading-relaxed">
                            Chez <strong className="text-white">Perfect Models Management</strong>, nous prenons très au sérieux
                            la protection de vos données personnelles. Cette politique de confidentialité explique comment nous
                            collectons, utilisons, partageons et protégeons vos informations personnelles conformément au
                            Règlement Général sur la Protection des Données (RGPD).
                        </p>
                    </section>

                    {/* Sections */}
                    <div className="space-y-12">
                        {/* 1. Données collectées */}
                        <Section
                            icon={DocumentTextIcon}
                            title="1. Données que nous collectons"
                            content={
                                <>
                                    <p className="mb-4">Nous collectons les types de données suivants :</p>

                                    <h4 className="text-lg font-bold text-white mb-3">Données fournies directement par vous :</h4>
                                    <ul className="list-disc list-inside space-y-2 mb-6 text-gray-300">
                                        <li><strong>Candidatures de casting :</strong> Nom, prénom, date de naissance, sexe, mensurations, photos, vidéos, coordonnées (email, téléphone, adresse)</li>
                                        <li><strong>Réservations d'événements :</strong> Nom, prénom, email, téléphone, informations de paiement</li>
                                        <li><strong>Formulaires de contact :</strong> Nom, email, téléphone, message</li>
                                        <li><strong>Commentaires :</strong> Nom, email (optionnel), contenu du commentaire</li>
                                        <li><strong>Compte mannequin Pro :</strong> Informations de profil, progression de formation, paiements</li>
                                    </ul>

                                    <h4 className="text-lg font-bold text-white mb-3">Données collectées automatiquement :</h4>
                                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                                        <li><strong>Cookies :</strong> Préférences de navigation, consentement aux cookies</li>
                                        <li><strong>Données de navigation :</strong> Pages visitées, durée de visite, appareil utilisé</li>
                                        <li><strong>Adresse IP :</strong> Pour des raisons de sécurité et d'analyse</li>
                                        <li><strong>Analytics :</strong> Statistiques d'utilisation du site (Google Analytics)</li>
                                    </ul>
                                </>
                            }
                        />

                        {/* 2. Utilisation des données */}
                        <Section
                            icon={UserGroupIcon}
                            title="2. Comment nous utilisons vos données"
                            content={
                                <>
                                    <p className="mb-4">Nous utilisons vos données personnelles pour :</p>
                                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                                        <li><strong>Traiter vos candidatures :</strong> Évaluer votre profil pour nos castings et opportunités</li>
                                        <li><strong>Gérer les réservations :</strong> Confirmer et organiser votre participation aux événements</li>
                                        <li><strong>Communiquer avec vous :</strong> Répondre à vos demandes, vous informer des opportunités</li>
                                        <li><strong>Améliorer nos services :</strong> Analyser l'utilisation du site pour l'optimiser</li>
                                        <li><strong>Respecter nos obligations légales :</strong> Comptabilité, fiscalité, etc.</li>
                                        <li><strong>Marketing (avec consentement) :</strong> Vous envoyer des newsletters et actualités</li>
                                    </ul>
                                </>
                            }
                        />

                        {/* 3. Cookies */}
                        <Section
                            icon={DocumentTextIcon}
                            title="3. Cookies et technologies similaires"
                            content={
                                <>
                                    <p className="mb-4">Nous utilisons des cookies pour améliorer votre expérience. Types de cookies :</p>

                                    <div className="space-y-4">
                                        <div className="bg-white/5 p-4 rounded-lg">
                                            <h5 className="font-bold text-white mb-2">Cookies essentiels</h5>
                                            <p className="text-gray-300 text-sm">
                                                Nécessaires au fonctionnement du site (authentification, panier, préférences).
                                                Ces cookies ne peuvent pas être désactivés.
                                            </p>
                                        </div>

                                        <div className="bg-white/5 p-4 rounded-lg">
                                            <h5 className="font-bold text-white mb-2">Cookies analytiques</h5>
                                            <p className="text-gray-300 text-sm">
                                                Nous aident à comprendre comment vous utilisez le site (Google Analytics).
                                                Vous pouvez les refuser via notre bannière de cookies.
                                            </p>
                                        </div>

                                        <div className="bg-white/5 p-4 rounded-lg">
                                            <h5 className="font-bold text-white mb-2">Cookies de marketing</h5>
                                            <p className="text-gray-300 text-sm">
                                                Utilisés pour afficher des publicités pertinentes.
                                                Vous pouvez les refuser via notre bannière de cookies.
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm text-gray-400">
                                        Vous pouvez gérer vos préférences de cookies à tout moment en cliquant sur le lien
                                        "Paramètres des cookies" en bas de page.
                                    </p>
                                </>
                            }
                        />

                        {/* 4. Partage des données */}
                        <Section
                            icon={UserGroupIcon}
                            title="4. Partage de vos données"
                            content={
                                <>
                                    <p className="mb-4">Nous ne vendons jamais vos données personnelles. Nous pouvons les partager avec :</p>
                                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                                        <li><strong>Clients professionnels :</strong> Avec votre consentement, pour des opportunités de mannequinat</li>
                                        <li><strong>Prestataires de services :</strong> Hébergement web, paiement en ligne, email marketing (sous contrat strict)</li>
                                        <li><strong>Autorités légales :</strong> Si requis par la loi ou pour protéger nos droits</li>
                                    </ul>
                                    <p className="mt-4 text-sm text-gray-400">
                                        Tous nos prestataires sont tenus de respecter le RGPD et de protéger vos données.
                                    </p>
                                </>
                            }
                        />

                        {/* 5. Vos droits */}
                        <Section
                            icon={ShieldCheckIcon}
                            title="5. Vos droits (RGPD)"
                            content={
                                <>
                                    <p className="mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-pm-gold/5 p-4 rounded-lg border border-pm-gold/20">
                                            <h5 className="font-bold text-pm-gold mb-2">✓ Droit d'accès</h5>
                                            <p className="text-gray-300 text-sm">
                                                Obtenir une copie de vos données personnelles
                                            </p>
                                        </div>

                                        <div className="bg-pm-gold/5 p-4 rounded-lg border border-pm-gold/20">
                                            <h5 className="font-bold text-pm-gold mb-2">✓ Droit de rectification</h5>
                                            <p className="text-gray-300 text-sm">
                                                Corriger des données inexactes ou incomplètes
                                            </p>
                                        </div>

                                        <div className="bg-pm-gold/5 p-4 rounded-lg border border-pm-gold/20">
                                            <h5 className="font-bold text-pm-gold mb-2">✓ Droit à l'effacement</h5>
                                            <p className="text-gray-300 text-sm">
                                                Demander la suppression de vos données
                                            </p>
                                        </div>

                                        <div className="bg-pm-gold/5 p-4 rounded-lg border border-pm-gold/20">
                                            <h5 className="font-bold text-pm-gold mb-2">✓ Droit d'opposition</h5>
                                            <p className="text-gray-300 text-sm">
                                                Vous opposer au traitement de vos données
                                            </p>
                                        </div>

                                        <div className="bg-pm-gold/5 p-4 rounded-lg border border-pm-gold/20">
                                            <h5 className="font-bold text-pm-gold mb-2">✓ Droit à la portabilité</h5>
                                            <p className="text-gray-300 text-sm">
                                                Recevoir vos données dans un format structuré
                                            </p>
                                        </div>

                                        <div className="bg-pm-gold/5 p-4 rounded-lg border border-pm-gold/20">
                                            <h5 className="font-bold text-pm-gold mb-2">✓ Droit de limitation</h5>
                                            <p className="text-gray-300 text-sm">
                                                Limiter le traitement de vos données
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-6 text-gray-300">
                                        Pour exercer vos droits, contactez-nous à :
                                        <a href="mailto:privacy@perfectmodels.cm" className="text-pm-gold hover:underline ml-2">
                                            privacy@perfectmodels.cm
                                        </a>
                                    </p>
                                </>
                            }
                        />

                        {/* 6. Sécurité */}
                        <Section
                            icon={LockClosedIcon}
                            title="6. Sécurité de vos données"
                            content={
                                <>
                                    <p className="mb-4">Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données :</p>
                                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                                        <li><strong>Chiffrement SSL/TLS :</strong> Toutes les communications sont cryptées</li>
                                        <li><strong>Accès restreint :</strong> Seul le personnel autorisé peut accéder aux données</li>
                                        <li><strong>Sauvegardes régulières :</strong> Pour prévenir la perte de données</li>
                                        <li><strong>Mises à jour de sécurité :</strong> Systèmes régulièrement mis à jour</li>
                                        <li><strong>Surveillance :</strong> Détection des activités suspectes</li>
                                    </ul>
                                    <p className="mt-4 text-sm text-gray-400">
                                        Malgré nos efforts, aucun système n'est 100% sécurisé. En cas de violation de données,
                                        nous vous en informerons conformément au RGPD.
                                    </p>
                                </>
                            }
                        />

                        {/* 7. Conservation des données */}
                        <Section
                            icon={DocumentTextIcon}
                            title="7. Durée de conservation"
                            content={
                                <>
                                    <p className="mb-4">Nous conservons vos données personnelles uniquement le temps nécessaire :</p>
                                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                                        <li><strong>Candidatures :</strong> 3 ans à compter de la dernière interaction</li>
                                        <li><strong>Comptes mannequins :</strong> Durée du contrat + 5 ans (obligations légales)</li>
                                        <li><strong>Réservations :</strong> 10 ans (obligations comptables)</li>
                                        <li><strong>Messages de contact :</strong> 1 an après traitement</li>
                                        <li><strong>Cookies :</strong> 13 mois maximum</li>
                                    </ul>
                                    <p className="mt-4 text-sm text-gray-400">
                                        Passé ces délais, vos données sont supprimées ou anonymisées.
                                    </p>
                                </>
                            }
                        />

                        {/* 8. Mineurs */}
                        <Section
                            icon={ShieldCheckIcon}
                            title="8. Protection des mineurs"
                            content={
                                <>
                                    <p className="text-gray-300">
                                        Notre site est accessible aux mineurs de plus de 13 ans. Pour les candidatures de mannequinat
                                        de mineurs, nous exigeons le consentement parental explicite. Les parents/tuteurs légaux peuvent
                                        exercer tous les droits RGPD au nom de leur enfant.
                                    </p>
                                </>
                            }
                        />

                        {/* 9. Modifications */}
                        <Section
                            icon={DocumentTextIcon}
                            title="9. Modifications de cette politique"
                            content={
                                <>
                                    <p className="text-gray-300">
                                        Nous pouvons mettre à jour cette politique de confidentialité occasionnellement.
                                        La date de "Dernière mise à jour" en haut de cette page indique quand cette politique
                                        a été révisée pour la dernière fois. Nous vous encourageons à consulter régulièrement
                                        cette page pour rester informé de nos pratiques.
                                    </p>
                                </>
                            }
                        />

                        {/* 10. Contact */}
                        <Section
                            icon={EnvelopeIcon}
                            title="10. Nous contacter"
                            content={
                                <>
                                    <p className="mb-4 text-gray-300">
                                        Pour toute question concernant cette politique de confidentialité ou vos données personnelles :
                                    </p>

                                    <div className="bg-pm-gold/5 p-6 rounded-xl border border-pm-gold/20">
                                        <h5 className="font-bold text-white mb-4">Perfect Models Management</h5>
                                        <div className="space-y-2 text-gray-300">
                                            <p><strong>Email :</strong> <a href="mailto:privacy@perfectmodels.cm" className="text-pm-gold hover:underline">privacy@perfectmodels.cm</a></p>
                                            <p><strong>Téléphone :</strong> +237 XXX XXX XXX</p>
                                            <p><strong>Adresse :</strong> Yaoundé, Cameroun</p>
                                        </div>
                                    </div>

                                    <p className="mt-6 text-sm text-gray-400">
                                        Vous avez également le droit de déposer une plainte auprès de l'autorité de protection
                                        des données de votre pays si vous estimez que vos droits n'ont pas été respectés.
                                    </p>
                                </>
                            }
                        />
                    </div>

                    {/* Footer */}
                    <div className="mt-16 pt-8 border-t border-white/10 text-center">
                        <p className="text-gray-400 mb-4">
                            Cette politique de confidentialité est conforme au RGPD (Règlement Général sur la Protection des Données)
                        </p>
                        <Link
                            to="/terms-of-use"
                            className="text-pm-gold hover:underline text-sm"
                        >
                            Consulter nos Conditions d'Utilisation →
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

/**
 * Composant Section pour organiser le contenu
 */
interface SectionProps {
    icon: React.ElementType;
    title: string;
    content: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ icon: Icon, title, content }) => (
    <section className="scroll-mt-24">
        <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-pm-gold/10 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-pm-gold" />
            </div>
            <h2 className="text-2xl md:text-3xl font-playfair text-white pt-2">
                {title}
            </h2>
        </div>
        <div className="pl-16 text-gray-300 leading-relaxed">
            {content}
        </div>
    </section>
);

export default PrivacyPolicy;
