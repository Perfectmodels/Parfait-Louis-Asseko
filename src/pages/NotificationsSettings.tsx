import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationsManager from '../components/NotificationsManager';
import SEO from '../components/SEO';
import Layout from '../components/icons/Layout';

const NotificationsSettings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <SEO 
        title="Paramètres des Notifications | Perfect Models Management"
        description="Configurez vos préférences de notifications push pour rester informé des bookings, actualités et événements."
        keywords="notifications push, alertes booking, perfect models, gabon"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900">
              Paramètres des Notifications
            </h1>
            <p className="mt-2 text-gray-600">
              Configurez vos préférences pour recevoir les notifications importantes de Perfect Models Management.
            </p>
          </div>

          {/* Notifications Manager */}
          <NotificationsManager />

          {/* Informations supplémentaires */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              À propos des notifications
            </h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <strong>Alertes de booking :</strong> Soyez notifié instantanément lorsqu'un client vous contacte pour un booking.
                </div>
              </div>
              
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <strong>Actualités :</strong> Restez informé des dernières nouvelles et mises à jour de l'agence.
                </div>
              </div>
              
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <strong>Événements :</strong> Recevez des rappels pour les Perfect Fashion Day et autres événements.
                </div>
              </div>
              
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <strong>Mises à jour de profil :</strong> Soyez alerté des changements importants dans votre profil mannequin.
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-8 bg-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Questions fréquentes
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800">Comment activer les notifications ?</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Cliquez sur le bouton "Activer les notifications" et autorisez les notifications dans votre navigateur.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800">Puis-je désactiver certains types de notifications ?</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Oui, une fois les notifications activées, vous pouvez choisir quels types d'alertes recevoir.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800">Mes notifications ne fonctionnent pas ?</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Vérifiez que votre navigateur autorise les notifications et que vous n'êtes pas en mode navigation privée.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotificationsSettings;
