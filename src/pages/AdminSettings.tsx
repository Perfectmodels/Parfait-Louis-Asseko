import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import AdminCard from '../components/admin/AdminCard';

const AdminSettings: React.FC = () => {
  const { data, saveData } = useData();
  const [settings, setSettings] = useState({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    apiKey: '',
    analyticsId: ''
  });

    useEffect(() => {
    if (data?.settings) {
      setSettings(data.settings);
        }
  }, [data?.settings]);
    
    const handleSave = () => {
    if (!data) return;
    saveData({ ...data, settings });
    alert('Paramètres sauvegardés avec succès !');
  };

    return (
    <AdminLayout>
      <AdminPageHeader 
        title="Paramètres" 
        subtitle="Configurer les paramètres du site"
      />

      <div className="space-y-6">
        <AdminSection title="Informations Générales">
          <AdminCard>
                        <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom du site</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
                        </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  rows={3}
                />
                        </div>
                    </div>
          </AdminCard>
        </AdminSection>
                    
        <AdminSection title="Contact">
          <AdminCard>
                        <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
                        </div>
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
                    </div>
              <div>
                <label className="block text-sm font-medium mb-1">Adresse</label>
                <textarea
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  rows={2}
                            />
                        </div>
                    </div>
          </AdminCard>
        </AdminSection>
                    
        <AdminSection title="Réseaux Sociaux">
          <AdminCard>
                        <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Facebook</label>
                <input
                  type="url"
                  value={settings.facebook}
                  onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Instagram</label>
                <input
                  type="url"
                  value={settings.instagram}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="https://instagram.com/..."
                            />
                        </div>
              <div>
                <label className="block text-sm font-medium mb-1">Twitter</label>
                <input
                  type="url"
                  value={settings.twitter}
                  onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="https://twitter.com/..."
                />
                    </div>
              <div>
                <label className="block text-sm font-medium mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={settings.linkedin}
                  onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="https://linkedin.com/..."
                />
                </div>
              <div>
                <label className="block text-sm font-medium mb-1">YouTube</label>
                <input
                  type="url"
                  value={settings.youtube}
                  onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="https://youtube.com/..."
                />
            </div>
        </div>
          </AdminCard>
        </AdminSection>

        <AdminSection title="API & Analytics">
          <AdminCard>
            <div className="space-y-4">
    <div>
                <label className="block text-sm font-medium mb-1">Clé API</label>
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
    </div>
    <div>
                <label className="block text-sm font-medium mb-1">Google Analytics ID</label>
                <input
                  type="text"
                  value={settings.analyticsId}
                  onChange={(e) => setSettings({ ...settings, analyticsId: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="G-XXXXXXXXXX"
                />
        </div>
    </div>
          </AdminCard>
        </AdminSection>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-pm-gold text-white rounded hover:bg-pm-gold/90"
          >
            Enregistrer les paramètres
                    </button>
                            </div>
                        </div>
    </AdminLayout>
    );
};

export default AdminSettings;

