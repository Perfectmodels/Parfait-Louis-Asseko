import React, { useEffect, useMemo, useState } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const AdminApiKeys: React.FC = () => {
  const { data, saveData, isInitialized } = useData();
  const navigate = useNavigate();
  const [localKeys, setLocalKeys] = useState(data?.apiKeys);
  const [reveal, setReveal] = useState<{ [k: string]: boolean }>({});

  const currentAdmin = useMemo(() => {
    const id = sessionStorage.getItem('admin_id');
    return (data?.adminUsers || []).find((a) => a.id === id) || null;
  }, [data?.adminUsers]);

  useEffect(() => {
    if (isInitialized && data?.apiKeys) setLocalKeys(JSON.parse(JSON.stringify(data.apiKeys)));
  }, [isInitialized, data?.apiKeys]);

  if (!data || !localKeys) return <div className="min-h-screen bg-pm-dark" />;

  const canManage = !currentAdmin || currentAdmin.role === 'SuperAdmin' || currentAdmin.permissions?.canManageAdmins;

  const handleSave = async () => {
    if (!canManage) {
      alert("Accès refusé: permissions insuffisantes.");
      return;
    }
    await saveData({ ...data, apiKeys: localKeys });
    alert('Clés API mises à jour.');
  };

  const MaskField: React.FC<{label: string; value: string; path: (keys: any, v: string) => void; name: string; placeholder?: string; type?: 'text' | 'password';}> = ({ label, value, path, name, placeholder = '', type = 'text' }) => (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="admin-label !mb-0">{label}</label>
        <button type="button" className="text-xs text-pm-gold/70 hover:text-pm-gold inline-flex items-center gap-1" onClick={() => setReveal(r => ({ ...r, [name]: !r[name] }))}>
          {reveal[name] ? <EyeSlashIcon className="w-4 h-4"/> : <EyeIcon className="w-4 h-4"/>}
          {reveal[name] ? 'Masquer' : 'Afficher'}
        </button>
      </div>
      <input
        type={reveal[name] ? 'text' : (type === 'password' ? 'password' : 'password')}
        value={value || ''}
        onChange={(e) => {
          const v = e.target.value;
          const clone = JSON.parse(JSON.stringify(localKeys));
          path(clone, v);
          setLocalKeys(clone);
        }}
        placeholder={placeholder}
        className="admin-input"
      />
    </div>
  );

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Clés API" noIndex />
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="admin-page-header">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
              <ChevronLeftIcon className="w-5 h-5" />
              Retour au Dashboard
            </Link>
            <h1 className="admin-page-title">Clés API du Site</h1>
            <p className="admin-page-subtitle">Configurez les intégrations externes et services.</p>
          </div>
          <button onClick={handleSave} className="px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-lg shadow-pm-gold/30">
            Enregistrer
          </button>
        </div>

        <div className="space-y-8">
          <div className="admin-section-wrapper">
            <h2 className="admin-section-title">Emailing & Formulaires</h2>
            <div className="space-y-4">
              <MaskField
                label="Resend API Key"
                name="resend"
                value={localKeys.resendApiKey}
                path={(k, v) => (k.resendApiKey = v)}
                placeholder="re_..."
              />
              <div>
                <label className="admin-label">Formspree Endpoint</label>
                <input type="text" value={localKeys.formspreeEndpoint || ''} onChange={(e) => setLocalKeys({ ...localKeys, formspreeEndpoint: e.target.value })} className="admin-input" placeholder="https://formspree.io/f/..." />
              </div>
            </div>
          </div>

          <div className="admin-section-wrapper">
            <h2 className="admin-section-title">liens dynamiques Firebase</h2>
            <div className="space-y-4">
              <MaskField
                label="Web API Key"
                name="dynlink"
                value={localKeys.firebaseDynamicLinks?.webApiKey || ''}
                path={(k, v) => (k.firebaseDynamicLinks = { ...(k.firebaseDynamicLinks || {}), webApiKey: v, domainUriPrefix: k.firebaseDynamicLinks?.domainUriPrefix || '' })}
                placeholder="AIza..."
              />
              <div>
                <label className="admin-label">Domain URI Prefix</label>
                <input type="text" value={localKeys.firebaseDynamicLinks?.domainUriPrefix || ''} onChange={(e) => setLocalKeys({ ...localKeys, firebaseDynamicLinks: { ...(localKeys.firebaseDynamicLinks || {}), domainUriPrefix: e.target.value } })} className="admin-input" placeholder="https://xxx.page.link" />
              </div>
            </div>
          </div>

          <div className="admin-section-wrapper">
            <h2 className="admin-section-title">Stockage Images</h2>
            <div className="space-y-4">
              <MaskField
                label="imgbb API Key"
                name="imgbb"
                value={localKeys.imgbbApiKey || ''}
                path={(k, v) => (k.imgbbApiKey = v)}
                placeholder="59f0..."
              />
              <p className="text-xs text-pm-off-white/60">Le panel utilise imgbb pour l'upload des images. Assurez-vous que la clé est valide.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminApiKeys;
