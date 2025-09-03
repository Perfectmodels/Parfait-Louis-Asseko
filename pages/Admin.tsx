import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { UserGroupIcon, NewspaperIcon, AcademicCapIcon, ClipboardDocumentIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

const DataExporter: React.FC = () => {
    const { data } = useData();
    const [copiedFile, setCopiedFile] = useState<string | null>(null);

    if (!data) return null;

    const copyToClipboard = (text: string, fileName: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedFile(fileName);
            setTimeout(() => setCopiedFile(null), 2000);
        }, (err) => {
            console.error('Could not copy text: ', err);
            alert('Erreur lors de la copie.');
        });
    };
    
    const formatConstantsData = () => {
        const dataToFormat = { ...data };
        delete (dataToFormat as any).articles;
        delete (dataToFormat as any).courseData;
        const content = `import { Model, Stylist, FashionDayEvent, Service, AchievementCategory, ModelDistinction, Testimonial } from '../types';
import { AcademicCapIcon, CameraIcon, FilmIcon, GlobeAltIcon, HeartIcon, ScaleIcon, SparklesIcon, UserGroupIcon } from '@heroicons/react/24/outline';

${Object.entries(dataToFormat).map(([key, value]) => `export const ${key} = ${JSON.stringify(value, null, 2)};`).join('\n\n')}
        `.trim();
        return content;
    };

    const formatMagazineData = () => `import { Article } from '../types';\n\nexport const articles: Article[] = ${JSON.stringify(data.articles, null, 2)};`;
    const formatCourseData = () => `import { Module } from '../types';\n\nexport const courseData: Module[] = ${JSON.stringify(data.courseData, null, 2)};`;

    const dataFiles = [
        { name: 'constants/data.ts', content: formatConstantsData() },
        { name: 'constants/magazineData.ts', content: formatMagazineData() },
        { name: 'constants/courseData.ts', content: formatCourseData() },
    ];

    return (
        <div className="mt-16 max-w-5xl mx-auto">
            <h2 className="text-3xl font-playfair text-pm-gold text-center mb-8">Exporter les Données</h2>
            <p className="text-center text-pm-off-white/80 max-w-3xl mx-auto mb-10">
                Après avoir modifié le contenu du site, vous pouvez exporter les données à jour ici. Copiez le code généré et collez-le dans les fichiers correspondants de votre projet pour rendre les changements permanents.
            </p>
            <div className="space-y-8">
                {dataFiles.map(file => (
                    <div key={file.name} className="bg-black/50 border border-pm-gold/20 rounded-lg overflow-hidden shadow-lg shadow-black/30">
                        {/* Editor Header */}
                        <div className="bg-pm-dark p-3 flex justify-between items-center border-b border-pm-gold/20">
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                <p className="font-mono text-sm text-pm-off-white/70 ml-4">{file.name}</p>
                            </div>
                            <button
                                onClick={() => copyToClipboard(file.content, file.name)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold text-xs font-bold uppercase tracking-widest rounded-full hover:bg-pm-gold hover:text-pm-dark"
                            >
                                <ClipboardDocumentIcon className="w-4 h-4" />
                                {copiedFile === file.name ? 'Copié !' : 'Copier le Code'}
                            </button>
                        </div>
                        <textarea
                            readOnly
                            value={file.content}
                            className="w-full h-64 bg-pm-dark font-mono text-xs p-4 text-pm-off-white/80 border-none outline-none resize-none"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const Admin: React.FC = () => {
  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin Dashboard" description="Admin panel for Perfect Models Management." />
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-playfair text-pm-gold text-center mb-4">Panel d'Administration</h1>
        <p className="text-center max-w-2xl mx-auto text-pm-off-white/80 mb-12">
          Gérez le contenu du site web de Perfect Models Management.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
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
           <AdminCard
            icon={Cog6ToothIcon}
            title="Paramètres du Site"
            description="Modifier le logo, la navigation, les textes et les partenaires."
            link="/admin/parametres"
          />
        </div>

        <DataExporter />

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
  <Link to={link} className="group block bg-gradient-to-br from-black to-pm-dark p-8 border border-pm-gold/20 text-center shadow-lg shadow-black/30 hover:border-pm-gold hover:shadow-2xl hover:shadow-pm-gold/20 transform hover:-translate-y-2 hover:-rotate-1 transition-all duration-300">
    <Icon className="w-16 h-16 text-pm-gold mx-auto mb-6 transition-transform duration-300 group-hover:scale-110" />
    <h2 className="text-2xl font-playfair text-pm-gold mb-3">{title}</h2>
    <p className="text-pm-off-white/70">{description}</p>
  </Link>
);


export default Admin;