import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

const AdminArtisticDirection: React.FC = () => (
  <div className="bg-pm-dark min-h-screen text-pm-off-white">
    <SEO title="Admin — Direction Artistique" noIndex />
    <div className="page-container">
      <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold/60 hover:text-pm-gold text-xs uppercase tracking-widest font-black mb-12 transition-colors">
        <ChevronLeftIcon className="w-4 h-4" /> Tableau de Bord
      </Link>
      <h1 className="text-4xl font-playfair font-black italic mb-8">A d m i n —  D i r e c t i o n  A r t i s t i q u e</h1>
      <p className="text-white/40">Section en cours de développement.</p>
    </div>
  </div>
);

export default AdminArtisticDirection;
