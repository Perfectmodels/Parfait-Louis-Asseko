/**
 * TermsOfUse Page
 * 
 * Page des conditions d'utilisation du site Perfect Models Management
 * Définit les règles et conditions d'utilisation des services
 * 
 * Sections:
 * - Acceptation des conditions
 * - Services proposés
 * - Inscription et compte
 * - Propriété intellectuelle
 * - Contenu utilisateur
 * - Responsabilités
 * - Paiements
 * - Résiliation
 * - Modifications
 * - Contact
 * 
 * @author Perfect Models Management
 * @version 1.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import {
    DocumentTextIcon,
    UserCircleIcon,
    ShieldCheckIcon,
    CreditCardIcon,
    ExclamationTriangleIcon,
    ArrowLeftIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const TermsOfUse: React.FC = () => {
    const lastUpdated = "17 décembre 2025";

    return (
        <>
            <SEO
                title="Conditions d'Utilisation | Perfect Models Management"
                description="Consultez les conditions d'utilisation des services de Perfect Models Management. Règles, droits et obligations."
                keywords="conditions d'utilisation, CGU, règlement, Perfect Models"
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
                            <DocumentTextIcon className="w-10 h-10 text-pm-gold" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-playfair text-white mb-4">
                            Conditions d'Utilisation
                        </h1>
                        <p className="text-gray-400">
                            Dernière mise à jour : {lastUpdated}
                        </p>
                    </header>

                    {/* Introduction */}
                    <section className="mb-12 p-6 bg-pm-gold/5 border border-pm-gold/20 rounded-xl">
                        <p className="text-lg text-gray-300 leading-relaxed">
                            Bienvenue sur le site de <strong className="text-white">Perfect Models Management</strong>.
                            En accédant et en utilisant ce site, vous acceptez d'être lié par les présentes conditions d'utilisation.
                            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.
                        </p>
                    </section>

                    {/* Sections */}
                    <div className="space-y-12">
                        {/* 1. Acceptation des conditions */}
                        <Section
                            icon={CheckCircleIcon}
                            title="1. Acceptation des conditions"
                            content={
                                <>
                                    <p className="mb-4">
                                        En utilisant ce site web, vous reconnaissez avoir lu, compris et accepté les présentes
                                        conditions d'utilisation ainsi que notre <Link to="/privacy-policy" className="text-pm-gold hover:underline">Politique de Confidentialité</Link>.
                                    </p>
                                    <p className="text-gray-300">
                                        Ces conditions s'appliquent à tous les visiteurs, utilisateurs et autres personnes qui
                                        accèdent ou utilisent le service.
                                    </p>
                                </>
                            }
                        />

                        {/* 2. Services proposés */}
                        <Section
                            icon={DocumentTextIcon}
                            title="2. Services proposés"
                            content={
                                <>
                                    <p className="mb-4">Perfect Models Management propose les services suivants :</p>
                                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                                        <li><strong>Agence de mannequins :</strong> Représentation et gestion de carrières de mannequins</li>
                                        <li><strong>Casting :</strong> Organisation et participation à des castings professionnels</li>
                                        <li><strong>Formation :</strong> Programme de formation professionnelle pour mannequins (Perfect Models Pro)</li>
                                        <li><strong>Événementiel :</strong> Organisation d'événements de mode (Perfect Fashion Day)</li>
                                        <li><strong>Hôtessariat :</strong> Mise à disposition d'hôtes et hôtesses pour événements</li>
                                        <li><strong>Production :</strong> Services de production photo et vidéo</li>
                                        <li><strong>Magazine :</strong> Publication de contenu éditorial sur la mode</li>
                                    </ul>
                                </>
                            }
                        />

                        {/* 3. Inscription et compte */}
                        <Section
                            icon={UserCircleIcon}
                            title="3. Inscription et compte utilisateur"
                            content={
                                <>
                                    <h4 className="text-lg font-bold text-white mb-3">Création de compte</h4>
                                    <p className="mb-4 text-gray-300">
                                        Pour accéder à certains services (espace mannequin Pro, réservations), vous devez créer un compte.
                                        Vous vous engagez à :
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 mb-6 text-gray-300">
                                        <li>Fournir des informations exactes, complètes et à jour</li>
                                        <li>Maintenir la sécurité de votre mot de passe</li>
                                        <li>Ne pas partager votre compte avec des tiers</li>
                                        <li>Nous informer immédiatement de toute utilisation non autorisée</li>
                                        <li>Être responsable de toutes les activités sur votre compte</li>
                                    </ul>

                                    <h4 className="text-lg font-bold text-white mb-3">Âge minimum</h4>
                                    <p className="text-gray-300">
                                        Vous devez avoir au moins 13 ans pour utiliser ce site. Les mineurs de moins de 18 ans
                                        doivent obtenir le consentement de leurs parents ou tuteurs légaux pour créer un compte
                                        et soumettre des candidatures.
                                    </p>
                                </>
                            }
                        />

                        {/* 4. Propriété intellectuelle */}
                        <Section
                            icon={ShieldCheckIcon}
                            title="4. Propriété intellectuelle"
                            content={
                                <>
                                    <h4 className="text-lg font-bold text-white mb-3">Contenu du site</h4>
                                    <p className="mb-4 text-gray-300">
                                        Tout le contenu présent sur ce site (textes, images, logos, vidéos, graphiques, code source)
                                        est la propriété de Perfect Models Management ou de ses partenaires et est protégé par les
                                        lois sur la propriété intellectuelle.
                                    </p>

                                    <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg mb-4">
                                        <p className="text-red-300 text-sm">
                                            <strong>Interdictions :</strong> Vous ne pouvez pas copier, reproduire, distribuer,
                                            modifier, créer des œuvres dérivées, afficher publiquement ou exploiter commercialement
                                            le contenu sans autorisation écrite préalable.
                                        </p>
                                    </div>

                                    <h4 className="text-lg font-bold text-white mb-3">Marques</h4>
                                    <p className="text-gray-300">
                                        "Perfect Models Management", "Perfect Fashion Day", "Perfect Models Pro" et tous les logos
                                        associés sont des marques déposées. Toute utilisation non autorisée est strictement interdite.
                                    </p>
                                </>
                            }
                        />

                        {/* 5. Contenu utilisateur */}
                        <Section
                            icon={DocumentTextIcon}
                            title="5. Contenu soumis par les utilisateurs"
                            content={
                                <>
                                    <h4 className="text-lg font-bold text-white mb-3">Vos soumissions</h4>
                                    <p className="mb-4 text-gray-300">
                                        En soumettant du contenu (photos, vidéos, commentaires, candidatures), vous :
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 mb-6 text-gray-300">
                                        <li>Garantissez que vous détenez tous les droits sur ce contenu</li>
                                        <li>Accordez à Perfect Models Management une licence mondiale, non exclusive, pour utiliser ce contenu</li>
                                        <li>Autorisez l'utilisation de votre image à des fins promotionnelles (avec consentement explicite)</li>
                                        <li>Vous engagez à ne pas soumettre de contenu illégal, offensant ou inapproprié</li>
                                    </ul>

                                    <h4 className="text-lg font-bold text-white mb-3">Modération</h4>
                                    <p className="text-gray-300">
                                        Nous nous réservons le droit de refuser, modifier ou supprimer tout contenu qui viole
                                        ces conditions ou que nous jugeons inapproprié.
                                    </p>
                                </>
                            }
                        />

                        {/* 6. Comportement interdit */}
                        <Section
                            icon={ExclamationTriangleIcon}
                            title="6. Comportements interdits"
                            content={
                                <>
                                    <p className="mb-4">Vous vous engagez à ne pas :</p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-red-500/5 p-4 rounded-lg border border-red-500/20">
                                            <p className="text-red-300 text-sm">❌ Violer des lois ou règlements</p>
                                        </div>
                                        <div className="bg-red-500/5 p-4 rounded-lg border border-red-500/20">
                                            <p className="text-red-300 text-sm">❌ Usurper l'identité d'autrui</p>
                                        </div>
                                        <div className="bg-red-500/5 p-4 rounded-lg border border-red-500/20">
                                            <p className="text-red-300 text-sm">❌ Harceler ou menacer d'autres utilisateurs</p>
                                        </div>
                                        <div className="bg-red-500/5 p-4 rounded-lg border border-red-500/20">
                                            <p className="text-red-300 text-sm">❌ Diffuser des virus ou codes malveillants</p>
                                        </div>
                                        <div className="bg-red-500/5 p-4 rounded-lg border border-red-500/20">
                                            <p className="text-red-300 text-sm">❌ Collecter des données d'autres utilisateurs</p>
                                        </div>
                                        <div className="bg-red-500/5 p-4 rounded-lg border border-red-500/20">
                                            <p className="text-red-300 text-sm">❌ Utiliser des robots ou scrapers automatisés</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm text-gray-400">
                                        Toute violation peut entraîner la suspension ou la résiliation de votre compte.
                                    </p>
                                </>
                            }
                        />

                        {/* 7. Paiements */}
                        <Section
                            icon={CreditCardIcon}
                            title="7. Paiements et remboursements"
                            content={
                                <>
                                    <h4 className="text-lg font-bold text-white mb-3">Services payants</h4>
                                    <p className="mb-4 text-gray-300">
                                        Certains services sont payants (formation Pro, réservations événements). Les prix sont
                                        indiqués en FCFA et incluent toutes les taxes applicables.
                                    </p>

                                    <h4 className="text-lg font-bold text-white mb-3">Modalités de paiement</h4>
                                    <ul className="list-disc list-inside space-y-2 mb-6 text-gray-300">
                                        <li>Paiement par Mobile Money (MTN, Orange)</li>
                                        <li>Virement bancaire</li>
                                        <li>Espèces (sur place uniquement)</li>
                                    </ul>

                                    <h4 className="text-lg font-bold text-white mb-3">Politique de remboursement</h4>
                                    <div className="bg-pm-gold/5 p-4 rounded-lg border border-pm-gold/20">
                                        <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                                            <li><strong>Formation Pro :</strong> Remboursement possible dans les 7 jours suivant l'inscription (si aucun cours n'a été consulté)</li>
                                            <li><strong>Événements :</strong> Remboursement jusqu'à 48h avant l'événement (frais de 10% retenus)</li>
                                            <li><strong>Services sur mesure :</strong> Conditions définies au contrat</li>
                                        </ul>
                                    </div>
                                </>
                            }
                        />

                        {/* 8. Limitation de responsabilité */}
                        <Section
                            icon={ShieldCheckIcon}
                            title="8. Limitation de responsabilité"
                            content={
                                <>
                                    <p className="mb-4 text-gray-300">
                                        Perfect Models Management s'efforce de fournir des services de qualité, mais :
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 mb-6 text-gray-300">
                                        <li>Le site est fourni "tel quel" sans garantie d'aucune sorte</li>
                                        <li>Nous ne garantissons pas que le site sera toujours disponible ou sans erreur</li>
                                        <li>Nous ne sommes pas responsables des dommages indirects ou consécutifs</li>
                                        <li>Nous ne garantissons pas l'obtention de contrats ou d'opportunités professionnelles</li>
                                        <li>Les résultats de formation ou de casting ne sont pas garantis</li>
                                    </ul>

                                    <div className="bg-pm-gold/10 border border-pm-gold/30 p-4 rounded-lg">
                                        <p className="text-pm-gold text-sm">
                                            <strong>Important :</strong> Notre responsabilité est limitée au montant payé pour le service concerné.
                                        </p>
                                    </div>
                                </>
                            }
                        />

                        {/* 9. Résiliation */}
                        <Section
                            icon={ExclamationTriangleIcon}
                            title="9. Résiliation"
                            content={
                                <>
                                    <h4 className="text-lg font-bold text-white mb-3">Par vous</h4>
                                    <p className="mb-4 text-gray-300">
                                        Vous pouvez fermer votre compte à tout moment en nous contactant à
                                        <a href="mailto:support@perfectmodels.cm" className="text-pm-gold hover:underline ml-1">
                                            support@perfectmodels.cm
                                        </a>
                                    </p>

                                    <h4 className="text-lg font-bold text-white mb-3">Par nous</h4>
                                    <p className="mb-4 text-gray-300">
                                        Nous pouvons suspendre ou résilier votre compte immédiatement, sans préavis, en cas de :
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                                        <li>Violation de ces conditions d'utilisation</li>
                                        <li>Comportement frauduleux ou illégal</li>
                                        <li>Non-paiement des services</li>
                                        <li>Inactivité prolongée (plus de 2 ans)</li>
                                    </ul>
                                </>
                            }
                        />

                        {/* 10. Liens externes */}
                        <Section
                            icon={DocumentTextIcon}
                            title="10. Liens vers des sites tiers"
                            content={
                                <>
                                    <p className="text-gray-300">
                                        Notre site peut contenir des liens vers des sites web tiers. Nous ne sommes pas responsables
                                        du contenu, des politiques de confidentialité ou des pratiques de ces sites. Nous vous
                                        encourageons à lire les conditions d'utilisation de chaque site que vous visitez.
                                    </p>
                                </>
                            }
                        />

                        {/* 11. Modifications */}
                        <Section
                            icon={DocumentTextIcon}
                            title="11. Modifications des conditions"
                            content={
                                <>
                                    <p className="mb-4 text-gray-300">
                                        Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications
                                        entreront en vigueur dès leur publication sur cette page.
                                    </p>
                                    <p className="text-gray-300">
                                        Votre utilisation continue du site après les modifications constitue votre acceptation
                                        des nouvelles conditions. Nous vous encourageons à consulter régulièrement cette page.
                                    </p>
                                </>
                            }
                        />

                        {/* 12. Droit applicable */}
                        <Section
                            icon={ShieldCheckIcon}
                            title="12. Droit applicable et juridiction"
                            content={
                                <>
                                    <p className="mb-4 text-gray-300">
                                        Ces conditions sont régies par les lois du Cameroun. Tout litige relatif à ces conditions
                                        sera soumis à la juridiction exclusive des tribunaux de Yaoundé, Cameroun.
                                    </p>
                                    <p className="text-gray-300">
                                        En cas de litige, nous vous encourageons à nous contacter d'abord pour tenter de résoudre
                                        le problème à l'amiable.
                                    </p>
                                </>
                            }
                        />

                        {/* 13. Contact */}
                        <Section
                            icon={DocumentTextIcon}
                            title="13. Nous contacter"
                            content={
                                <>
                                    <p className="mb-4 text-gray-300">
                                        Pour toute question concernant ces conditions d'utilisation :
                                    </p>

                                    <div className="bg-pm-gold/5 p-6 rounded-xl border border-pm-gold/20">
                                        <h5 className="font-bold text-white mb-4">Perfect Models Management</h5>
                                        <div className="space-y-2 text-gray-300">
                                            <p><strong>Email :</strong> <a href="mailto:support@perfectmodels.cm" className="text-pm-gold hover:underline">support@perfectmodels.cm</a></p>
                                            <p><strong>Téléphone :</strong> +237 XXX XXX XXX</p>
                                            <p><strong>Adresse :</strong> Yaoundé, Cameroun</p>
                                            <p><strong>Horaires :</strong> Lundi - Vendredi, 9h - 18h</p>
                                        </div>
                                    </div>
                                </>
                            }
                        />
                    </div>

                    {/* Footer */}
                    <div className="mt-16 pt-8 border-t border-white/10 text-center">
                        <p className="text-gray-400 mb-4">
                            En utilisant ce site, vous acceptez ces conditions d'utilisation
                        </p>
                        <Link
                            to="/privacy-policy"
                            className="text-pm-gold hover:underline text-sm"
                        >
                            Consulter notre Politique de Confidentialité →
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

export default TermsOfUse;
