import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { UserGroupIcon, NewspaperIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const Admin: React.FC = () => {
  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin Dashboard" description="Admin panel for Perfect Models Management." />
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-playfair text-pm-gold text-center mb-4">Panel d'Administration</h1>
        <p className="text-center max-w-2xl mx-auto text-pm-off-white/80 mb-12">
          Gérez le contenu du site web de Perfect Models Management.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <AdminCard
            icon={UserGroupIcon}
            title="Gérer les Mannequins"
            description="Ajouter, modifier ou supprimer des profils de mannequins."
            link="/admin/mannequins"
          />
          <AdminCard
            icon={NewspaperIcon}
            title="Gérer le Magazine"
            description="Créer, éditer ou supprimer des articles du magazine."
            link="/admin/magazine"
          />
          <AdminCard
            icon={AcademicCapIcon}
            title="Gérer le Classroom"
            description="Mettre à jour le contenu des modules et chapitres de formation."
            link="/admin/classroom"
          />
        </div>
      </div>
    </div>
  );
};

interface AdminCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
}

const AdminCard: React.FC<AdminCardProps> = ({ icon: Icon, title, description, link }) => (
  <Link to={link} className="group block bg-black p-8 border border-pm-gold/20 text-center transition-all duration-300 hover:border-pm-gold hover:shadow-2xl hover:shadow-pm-gold/20 hover:-translate-y-2">
    <Icon className="w-16 h-16 text-pm-gold mx-auto mb-6 transition-transform duration-300 group-hover:scale-110" />
    <h2 className="text-2xl font-playfair text-pm-gold mb-3">{title}</h2>
    <p className="text-pm-off-white/70">{description}</p>
  </Link>
);


export default Admin;
