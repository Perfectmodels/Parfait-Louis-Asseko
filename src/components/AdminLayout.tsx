import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import SEO from './SEO';
import {
	HomeIcon,
	UsersIcon,
	CreditCardIcon,
	ClipboardDocumentListIcon,
	BookOpenIcon,
	ChatBubbleLeftRightIcon,
	Cog6ToothIcon,
	ServerIcon,
	ArrowRightOnRectangleIcon,
	ChevronDownIcon,
	SignalIcon,
	Bars3Icon,
	XMarkIcon,
	UserGroupIcon,
	CurrencyDollarIcon,
	MegaphoneIcon,
	SparklesIcon,
	PhotoIcon,
	AcademicCapIcon,
	ShieldCheckIcon,
	EnvelopeIcon,
	ShoppingCartIcon,
	BriefcaseIcon,
	DocumentTextIcon,
	WrenchScrewdriverIcon,
	ChartBarIcon
} from '@heroicons/react/24/outline';

// Définition de la structure de navigation
const navigationSections = [
	{
		title: "GESTION CENTRALE",
		links: [
			{ name: "Tableau de Bord", path: "/admin", icon: HomeIcon, exact: true },
			{ name: "Informations Agence", path: "/admin/agency", icon: UserGroupIcon },
			{ name: "Gestion de l'Équipe", path: "/admin/team", icon: UsersIcon },
		]
	},
	{
		title: "MANNEQUINS & ACCÈS",
		links: [
			{ name: "Accès Débutants", path: "/admin/beginner-students-access", icon: AcademicCapIcon },
			{ name: "Accès Modèles Pro", path: "/admin/model-access", icon: SparklesIcon },
			{ name: "Suivi & Performance", path: "/admin/model-tracking", icon: SignalIcon },
		]
	},
	{
		title: "FINANCES & COMMANDES",
		links: [
			{ name: "Gestion des Services", path: "/admin/services", icon: BriefcaseIcon },
			{ name: "Commandes de Services", path: "/admin/service-orders", icon: ShoppingCartIcon },
			{ name: "Comptabilité", path: "/admin/accounting", icon: CurrencyDollarIcon },
			{ name: "Gestion des Paiements", path: "/admin/payments", icon: CreditCardIcon },
			{ name: "Soumissions de Paiement", path: "/admin/payment-submissions", icon: EnvelopeIcon },
		]
	},
	{
		title: "ÉVÉNEMENTS & CASTING",
		links: [
			{ name: "Candidatures Casting", path: "/admin/casting-applications", icon: ClipboardDocumentListIcon },
			{ name: "Résultats Casting", path: "/admin/casting-results", icon: MegaphoneIcon },
			{ name: "Candidatures Fashion Day", path: "/admin/fashion-day-applications", icon: ClipboardDocumentListIcon },
			{ name: "Événements Fashion Day", path: "/admin/fashion-day-events", icon: SparklesIcon },
		]
	},
	{
		title: "CONTENU & FORMATION",
		links: [
			{ name: "Gestion du Magazine", path: "/admin/magazine", icon: BookOpenIcon },
			{ name: "Gestion de la Galerie", path: "/admin/gallery", icon: PhotoIcon },
			{ name: "Gestion 'Classroom'", path: "/admin/classroom", icon: AcademicCapIcon },
			{ name: "Progrès 'Classroom'", path: "/admin/classroom-progress", icon: SignalIcon },
			{ name: "Direction Artistique", path: "/admin/artistic-direction", icon: SparklesIcon },
		]
	},
	{
		title: "COMMUNICATION & EMAILS",
		links: [
			{ name: "Messages de Contact", path: "/admin/messages", icon: EnvelopeIcon },
			{ name: "Gestion des Emails", path: "/admin/email-management", icon: ChartBarIcon },
			{ name: "Modèles d'Emails", path: "/admin/email-templates", icon: DocumentTextIcon },
			{ name: "Diagnostic Email", path: "/admin/email-diagnostic", icon: WrenchScrewdriverIcon },
			{ name: "Modération Commentaires", path: "/admin/comments", icon: ChatBubbleLeftRightIcon },
			{ name: "Gestion des Contacts CRM", path: "/admin/contact-management", icon: UserGroupIcon },
			{ name: "Campagnes Marketing", path: "/admin/marketing-campaigns", icon: MegaphoneIcon },
		]
	},
	{
		title: "CONFIGURATION",
		links: [
			{ name: "Paramètres Généraux", path: "/admin/settings", icon: Cog6ToothIcon },
			{ name: "Gestion Utilisateurs", path: "/admin/user-management", icon: UsersIcon },
			{ name: "Sécurité", path: "/admin/security", icon: ShieldCheckIcon },
			{ name: "Clés API", path: "/admin/api-keys", icon: Cog6ToothIcon },
		]
	},
	{
		title: "SYSTÈME & TECHNIQUE",
		links: [
			{ name: "État du Serveur", path: "/admin/server", icon: ServerIcon },
			{ name: "Base de Données", path: "/admin/database", icon: ServerIcon },
			{ name: "Test des Liens", path: "/admin/link-test", icon: ShieldCheckIcon },
		]
	},
];

const AdminLayout: React.FC = () => {
	const location = useLocation();
	const [openSection, setOpenSection] = useState<string | null>(() => {
		for (const section of navigationSections) {
			if (section.links.some(link => location.pathname.startsWith(link.path) && (location.pathname === link.path || !link.exact))) {
				return section.title;
			}
		}
		return "GESTION CENTRALE";
	});
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const toggleSection = (sectionTitle: string) => {
		setOpenSection(prevOpenSection => (prevOpenSection === sectionTitle ? null : sectionTitle));
	};

	const handleLogout = () => {
		console.log("Déconnexion");
	};

	const NavLink: React.FC<{ link: typeof navigationSections[0]['links'][0] }> = ({ link }) => {
		const isActive = link.exact
			? location.pathname === link.path
			: location.pathname.startsWith(link.path);

		return (
			<Link
				to={link.path}
				onClick={() => setSidebarOpen(false)}
				className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
					isActive
						? 'bg-pm-gold text-pm-dark font-bold'
						: 'text-pm-off-white/70 hover:bg-pm-dark/50 hover:text-white'
				}`}
			>
				<link.icon className="w-5 h-5 flex-shrink-0" />
				<span className="truncate">{link.name}</span>
			</Link>
		);
	};

	return (
		<div className="min-h-screen bg-pm-dark text-pm-off-white flex">
			<SEO title="Admin Panel" noIndex />

			{/* Sidebar pour grands écrans */}
			<aside className="hidden lg:flex flex-col w-72 bg-black border-r border-pm-gold/10">
				<div className="flex items-center justify-center h-20 border-b border-pm-gold/10">
					<h1 className="text-2xl font-playfair text-pm-gold">Perfect Models</h1>
				</div>
				<nav className="flex-1 p-4 space-y-2 overflow-y-auto">
					{navigationSections.map((section) => (
						<div key={section.title}>
							<button
								onClick={() => toggleSection(section.title)}
								className="w-full flex justify-between items-center text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-pm-gold/60 hover:text-pm-gold"
							>
								<span>{section.title}</span>
								<ChevronDownIcon
									className={`w-4 h-4 transition-transform ${
										openSection === section.title ? 'rotate-180' : ''
									}`}
								/>
							</button>
							{openSection === section.title && (
								<div className="mt-2 pl-3 border-l border-pm-gold/20 space-y-1.5">
									{section.links.map((link) => (
										<NavLink key={link.path} link={link} />
									))}
								</div>
							)}
						</div>
					))}
				</nav>
				<div className="p-4 border-t border-pm-gold/10">
					<button
						onClick={handleLogout}
						className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-pm-off-white/70 hover:bg-red-500/20 hover:text-white transition-colors"
					>
						<ArrowRightOnRectangleIcon className="w-5 h-5" />
						<span>Déconnexion</span>
					</button>
				</div>
			</aside>

			{/* Sidebar pour mobile */}
			{sidebarOpen && (
				<div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
			)}
			<aside className={`fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-black border-r border-pm-gold/10 transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
				<div className="flex items-center justify-between h-20 border-b border-pm-gold/10 px-4">
					<h1 className="text-2xl font-playfair text-pm-gold">Perfect Models</h1>
					<button onClick={() => setSidebarOpen(false)} className="p-2">
						<XMarkIcon className="w-6 h-6 text-pm-off-white"/>
					</button>
				</div>
				<nav className="flex-1 p-4 space-y-2 overflow-y-auto">
					{navigationSections.map((section) => (
						<div key={section.title}>
							<button
								onClick={() => toggleSection(section.title)}
								className="w-full flex justify_between items-center text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-pm-gold/60 hover:text-pm-gold"
							>
								<span>{section.title}</span>
								<ChevronDownIcon className={`w-4 h-4 transition-transform ${openSection === section.title ? 'rotate-180' : ''}`} />
							</button>
							{openSection === section.title && (
								<div className="mt-2 pl-3 border-l border-pm-gold/20 space-y-1.5">
									{section.links.map((link) => (
										<NavLink key={link.path} link={link} />
									))}
								</div>
							)}
						</div>
					))}
				</nav>
				<div className="p-4 border-t border-pm-gold/10">
					<button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-pm-off_white/70 hover:bg-red-500/20 hover:text-white transition-colors">
						<ArrowRightOnRectangleIcon className="w-5 h-5" />
						<span>Déconnexion</span>
					</button>
				</div>
			</aside>

			{/* Contenu principal */}
			<div className="flex-1 flex flex-col">
				<header className="flex items-center h-20 px-6 lg:hidden border-b border-pm-dark/50">
					<button onClick={() => setSidebarOpen(true)} className="p-2">
						<Bars3Icon className="w-6 h-6 text-pm-off-white" />
					</button>
				</header>
				<main className="flex-1 p-6 lg:p-10 overflow-y-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default AdminLayout;
