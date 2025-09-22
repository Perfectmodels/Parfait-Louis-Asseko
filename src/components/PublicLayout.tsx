import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import SEO from './SEO';

interface PublicLayoutProps {
	title?: string;
	description?: string;
	children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ title, description, children }) => {
	return (
		<div className="min-h-screen bg-pm-dark text-pm-off-white flex flex-col">
			{title && <SEO title={title} description={description} />}

			{/* Header */}
			<header className="sticky top-0 z-40 bg-black/70 backdrop-blur border-b border-pm-gold/10">
				<div className="container mx-auto px-6 h-16 flex items-center justify-between">
					<Link to="/" className="text-pm-gold font-playfair text-xl">Perfect Models</Link>
					<nav className="hidden md:flex items-center gap-6 text-sm">
						<NavLink to="/models" className={({isActive}) => `hover:text-pm-gold transition-colors ${isActive ? 'text-pm-gold' : 'text-pm-off-white/80'}`}>Modèles</NavLink>
						<NavLink to="/magazine" className={({isActive}) => `hover:text-pm-gold transition-colors ${isActive ? 'text-pm-gold' : 'text-pm-off-white/80'}`}>Magazine</NavLink>
						<NavLink to="/gallery" className={({isActive}) => `hover:text-pm-gold transition-colors ${isActive ? 'text-pm-gold' : 'text-pm-off-white/80'}`}>Galerie</NavLink>
						<NavLink to="/casting" className={({isActive}) => `hover:text-pm-gold transition-colors ${isActive ? 'text-pm-gold' : 'text-pm-off-white/80'}`}>Casting</NavLink>
						<NavLink to="/contact" className={({isActive}) => `hover:text-pm-gold transition-colors ${isActive ? 'text-pm-gold' : 'text-pm-off-white/80'}`}>Contact</NavLink>
					</nav>
					<Link to="/contact" className="hidden md:inline-flex items-center px-4 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors">Nous contacter</Link>
				</div>
			</header>

			{/* Main */}
			<main className="flex-1">
				{children}
			</main>

			{/* Footer */}
			<footer className="mt-16 bg-black border-t border-pm-gold/10">
				<div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<h3 className="text-pm-gold font-semibold mb-3">Perfect Models</h3>
						<p className="text-sm text-pm-off-white/70">Agence de management de talents. Excellence, professionnalisme et créativité.</p>
					</div>
					<div>
						<h4 className="text-sm font-semibold text-pm-off-white mb-3">Navigation</h4>
						<ul className="space-y-2 text-sm text-pm-off-white/70">
							<li><Link to="/models" className="hover:text-pm-gold">Modèles</Link></li>
							<li><Link to="/magazine" className="hover:text-pm-gold">Magazine</Link></li>
							<li><Link to="/gallery" className="hover:text-pm-gold">Galerie</Link></li>
							<li><Link to="/casting" className="hover:text-pm-gold">Casting</Link></li>
							<li><Link to="/contact" className="hover:text-pm-gold">Contact</Link></li>
						</ul>
					</div>
					<div>
						<h4 className="text-sm font-semibold text-pm-off-white mb-3">Légal</h4>
						<ul className="space-y-2 text-sm text-pm-off-white/70">
							<li><Link to="/privacy" className="hover:text-pm-gold">Confidentialité</Link></li>
							<li><Link to="/terms" className="hover:text-pm-gold">Conditions</Link></li>
						</ul>
					</div>
					<div>
						<h4 className="text-sm font-semibold text-pm-off-white mb-3">Contact</h4>
						<ul className="space-y-2 text-sm text-pm-off-white/70">
							<li>Contact@perfectmodels.ga</li>
							<li>Studio: Libreville</li>
						</ul>
					</div>
				</div>
				<div className="border-t border-pm-gold/10 py-4 text-center text-xs text-pm-off-white/50">© {new Date().getFullYear()} Perfect Models Management</div>
			</footer>
		</div>
	);
};

export default PublicLayout;
