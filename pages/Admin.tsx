import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { UserGroupIcon, NewspaperIcon, AcademicCapIcon, Cog6ToothIcon, ClipboardDocumentListIcon, SparklesIcon, BuildingStorefrontIcon, CalendarDaysIcon, PresentationChartLineIcon, KeyIcon, MegaphoneIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

const Admin: React.FC = () => {
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }

  const modelCount = data.models.length;
  const newCastingCount = data.castingApplications.filter(app => app.status === 'Nouveau').length;
  const newFashionDayCount = data.fashionDayApplications.filter(app => app.status === 'Nouveau').length;
  const newRecoveryCount = data.recoveryRequests?.filter(req => req.status === 'Nouveau').length || 0;

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin Dashboard" description="Admin panel for Perfect Models Management." noIndex />
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-playfair text-pm-gold text-center mb-4">Tableau de Bord</h1>
        <p className="text-center max-w-3xl mx-auto text-pm-off-white/80 mb-12">
          Bienvenue sur votre centre de commandement. Visualisez les statistiques clés et accédez aux sections de gestion de votre site.
        </p>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <StatCard icon={UserGroupIcon} value={modelCount} label="Mannequins Actifs" />
            <StatCard icon={ClipboardDocumentListIcon} value={newCastingCount} label="Candidatures Casting" link="/admin/candidatures-casting" />
            <StatCard icon={SparklesIcon} value={newFashionDayCount} label="Candidatures PFD" link="/admin/fashion-day-apps" />
            <StatCard icon={QuestionMarkCircleIcon} value={newRecoveryCount} label="Demandes Récupération" link="/admin/recuperation" />
        </div>

        {/* Management Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <AdminCard
            icon={UserGroupIcon}
            title="Gérer les Mannequins"
            description="Ajouter, modifier ou supprimer des profils de mannequins."
            link="/admin/mannequins"
          />
          <AdminCard
            icon={KeyIcon}
            title="Accès Mannequins"
            description="Consulter les identifiants de connexion de chaque mannequin."
            link="/admin/acces-mannequins"
          />
           <AdminCard
            icon={BuildingStorefrontIcon}
            title="Gérer l'Agence"
            description="Modifier les textes, la timeline, les services et les réalisations."
            link="/admin/agence"
          />
           <AdminCard
            icon={CalendarDaysIcon}
            title="Gérer les Événements PFD"
            description="Éditer les détails des éditions du Perfect Fashion Day."
            link="/admin/pfd-events"
          />
          <AdminCard
            icon={NewspaperIcon}
            title="Gérer le Magazine"
            description="Créer, éditer ou supprimer des articles du magazine."
            link="/admin/magazine"
          />
           <AdminCard
            icon={MegaphoneIcon}
            title="Gérer les Actualités"
            description="Ajouter des actualités et événements sur la page d'accueil."
            link="/admin/actualites"
          />
          <AdminCard
            icon={AcademicCapIcon}
            title="Gérer le Classroom"
            description="Mettre à jour le contenu des modules et chapitres de formation."
            link="/admin/classroom"
          />
           <AdminCard
            icon={PresentationChartLineIcon}
            title="Suivi Classroom"
            description="Consulter les notes et la progression des mannequins."
            link="/admin/suivi-classroom"
          />
           <AdminCard
            icon={ClipboardDocumentListIcon}
            title="Candidatures Casting"
            description="Consulter et gérer les candidatures des mannequins."
            link="/admin/candidatures-casting"
          />
          <AdminCard
            icon={SparklesIcon}
            title="Candidatures PFD"
            description="Gérer les postulants pour l'événement (stylistes, etc.)."
            link="/admin/fashion-day-apps"
          />
           <AdminCard
            icon={QuestionMarkCircleIcon}
            title="Demandes Récupération"
            description="Traiter les demandes de coordonnées oubliées des mannequins."
            link="/admin/recuperation"
          />
           <AdminCard
            icon={Cog6ToothIcon}
            title="Paramètres Généraux"
            description="Modifier logo, images, contact, partenaires et témoignages."
            link="/admin/parametres"
          />
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
    icon: React.ElementType;
    value: number | string;
    label: string;
    link?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label, link }) => {
    const content = (
        <div className="group bg-black p-6 border border-pm-gold/20 text-center shadow-lg shadow-black/30 h-full flex flex-col justify-center items-center transform transition-transform duration-300 hover:-translate-y-2">
            <Icon className="w-12 h-12 text-pm-gold mb-4 transition-transform duration-300 group-hover:scale-110" />
            <p className="text-5xl font-playfair text-white font-bold">{value}</p>
            <p className="text-sm uppercase tracking-wider text-pm-off-white/60 mt-2">{label}</p>
        </div>
    );

    return link ? <Link to={link}>{content}</Link> : <div>{content}</div>;
}


interface AdminCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
}

const AdminCard: React.FC<AdminCardProps> = ({ icon: Icon, title, description, link }) => (
  <Link to={link} className="group block bg-gradient-to-br from-black to-pm-dark p-8 border border-pm-gold/20 text-center shadow-lg shadow-black/30 hover:border-pm-gold hover:shadow-2xl hover:shadow-pm-gold/20 transform hover:-translate-y-2 hover:-rotate-1 transition-all duration-300">
    <Icon className="w-16 h-16 text-pm-gold mx-auto mb-6 transition-transform duration-300 group-hover:scale-110" />
    <h2 className="text-2xl font-playfair text-pm-gold mb-3">{title}</h2>
    <p className="text-pm-off-white/70">{description}</p>
  </Link>
);


export default Admin;