
import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';

const Admin: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-10 text-center space-y-4">
        <h1 className="text-3xl font-playfair text-pm-gold">Tableau de bord</h1>
        <p className="text-pm-off-white/70">
          Bienvenue dans le panneau d'administration. Certaines fonctionnalités sont actuellement en cours de maintenance.
        </p>
        <div className="bg-pm-dark/50 border border-pm-gold/20 p-6 rounded-lg max-w-2xl mx-auto mt-8">
            <h2 className="text-xl text-pm-gold mb-4">Accès Rapide</h2>
            <div className="grid grid-cols-2 gap-4 text-left">
                <a href="#/admin/settings" className="p-4 bg-black/40 hover:bg-pm-gold/10 rounded border border-gray-800 hover:border-pm-gold transition-colors">
                    <span className="block font-bold text-white">Paramètres du Site</span>
                    <span className="text-sm text-gray-400">Gérer les images et le carrousel</span>
                </a>
                <a href="#/admin/models" className="p-4 bg-black/40 hover:bg-pm-gold/10 rounded border border-gray-800 hover:border-pm-gold transition-colors">
                    <span className="block font-bold text-white">Mannequins</span>
                    <span className="text-sm text-gray-400">Gérer les profils (En construction)</span>
                </a>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;
