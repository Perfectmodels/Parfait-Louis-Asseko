import React, { useState, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { Newsletter, EmailTemplate } from '../../types';
import { Mail, Send, Users, Eye, MousePointer, TrendingUp, Plus, Edit, Trash2, Paperclip, X } from 'lucide-react';

const AdminNewsletter: React.FC = () => {
  const { data, updateData } = useData();
  const [activeTab, setActiveTab] = useState<'newsletters' | 'templates'>('newsletters');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const newsletters: Newsletter[] = data?.newsletters || [];
  const templates: EmailTemplate[] = data?.emailTemplates || [];
  const models = data?.models || [];

  const stats = {
    totalSent: newsletters.filter(n => n.status === 'sent').length,
    totalOpens: newsletters.reduce((sum, n) => sum + (n.stats?.opened || 0), 0),
    totalClicks: newsletters.reduce((sum, n) => sum + (n.stats?.clicked || 0), 0),
    avgOpenRate: newsletters.length > 0
      ? (newsletters.reduce((sum, n) => {
          const sent = n.stats?.sent || 1;
          const opened = n.stats?.opened || 0;
          return sum + (opened / sent);
        }, 0) / newsletters.filter(n => n.stats).length) * 100
      : 0
  };

  const handleCreateNewsletter = (fromTemplate?: EmailTemplate) => {
    const newNewsletter: Newsletter = {
      id: `newsletter-${Date.now()}`,
      subject: fromTemplate?.subject || '',
      content: fromTemplate?.content || '',
      recipientType: 'all',
      status: 'draft',
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    };
    setEditingNewsletter(newNewsletter);
    setShowCreateModal(true);
  };

  const handleSaveNewsletter = () => {
    if (!editingNewsletter) return;

    const updatedNewsletters = newsletters.find(n => n.id === editingNewsletter.id)
      ? newsletters.map(n => n.id === editingNewsletter.id ? editingNewsletter : n)
      : [...newsletters, editingNewsletter];

    updateData({ newsletters: updatedNewsletters });
    setShowCreateModal(false);
    setEditingNewsletter(null);
  };

  // =============== Import contacts (CSV/VCF/JSON/TXT) → emails =================
  const validateEmail = (email: string) => {
    const e = String(email || '').trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return re.test(e);
  };

  const extractEmailsFromText = (text: string): string[] => {
    if (!text) return [];
    const regex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
    const found = text.match(regex) || [];
    return found
      .map(e => e.trim())
      .filter(validateEmail)
      .map(e => e.toLowerCase());
  };

  const parseCSV = (content: string): string[] => {
    const lines = content.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return [];
    const delimiter = lines[0].includes(';') && !lines[0].includes(',') ? ';' : ',';
    const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase());
    const emailIdx = headers.findIndex(h => ['email', 'e-mail', 'courriel', 'mail'].includes(h));
    const emails: string[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(delimiter);
      if (emailIdx >= 0 && cols[emailIdx]) {
        const e = cols[emailIdx].trim();
        if (validateEmail(e)) emails.push(e.toLowerCase());
      } else {
        emails.push(...extractEmailsFromText(lines[i]));
      }
    }
    return emails;
  };

  const parseVCF = (content: string): string[] => {
    const emails = Array.from(content.matchAll(/EMAIL[^:]*:([^\r\n]+)/gi)).map(m => (m[1] || '').trim());
    return emails.filter(validateEmail).map(e => e.toLowerCase());
  };

  const parseJSON = (content: string): string[] => {
    try {
      const data = JSON.parse(content);
      const emails: string[] = [];
      const walk = (obj: any) => {
        if (!obj) return;
        if (Array.isArray(obj)) { obj.forEach(walk); return; }
        if (typeof obj === 'object') {
          for (const k of Object.keys(obj)) {
            const v = (obj as any)[k];
            if (['email', 'mail', 'courriel'].includes(k.toLowerCase()) && typeof v === 'string') {
              if (validateEmail(v)) emails.push(v.toLowerCase());
            } else {
              walk(v);
            }
          }
        }
      };
      walk(data);
      return emails;
    } catch {
      return [];
    }
  };

  const handleImportContacts = async (file: File) => {
    if (!editingNewsletter) return;
    const text = await file.text();
    const ext = file.name.split('.').pop()?.toLowerCase();
    let emails: string[] = [];
    if (ext === 'csv') emails = parseCSV(text);
    else if (ext === 'vcf' || ext === 'vcard') emails = parseVCF(text);
    else if (ext === 'json') emails = parseJSON(text);
    else emails = extractEmailsFromText(text); // txt or unknown

    const unique = Array.from(new Set([...(editingNewsletter.recipientIds || []), ...emails]));
    setEditingNewsletter({ ...editingNewsletter, recipientType: 'custom', recipientIds: unique });
    alert(`${emails.length} emails trouvés. Total dans la liste: ${unique.length}.`);
  };

  const handleSendNewsletter = async (newsletter: Newsletter) => {
    // Déterminer les destinataires à partir des données
    let recipientEmails: string[] = [];

    if (newsletter.recipientType === 'all' || newsletter.recipientType === 'models') {
      recipientEmails = models.map(m => m.email).filter((e): e is string => Boolean(e));
    } else if (newsletter.recipientType === 'custom') {
      // newsletter.recipientIds est supposé contenir des emails dans ce mode
      recipientEmails = (newsletter.recipientIds || []).filter(Boolean);
    } else if (newsletter.recipientType === 'clients') {
      const clients = data?.clients || [];
      recipientEmails = clients.map(c => c.email).filter((e): e is string => Boolean(e));
    } else if (newsletter.recipientType === 'subscribers') {
      // Pas de table subscribers pour l'instant → aucun envoi réel
      recipientEmails = [];
    }

    // Si aucune adresse trouvée, ne pas envoyer et garder l'état
    if (recipientEmails.length === 0) {
      const updatedNewsletter: Newsletter = {
        ...newsletter,
        status: 'sent',
        sentAt: new Date().toISOString(),
        stats: {
          sent: 0,
          opened: 0,
          clicked: 0,
          bounced: 0
        }
      };
      updateData({ newsletters: newsletters.map(n => n.id === newsletter.id ? updatedNewsletter : n) });
      return;
    }

    // Envoi par lots minimal via l'endpoint serverless
    const results = await Promise.allSettled(
      recipientEmails.map(email =>
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            subject: newsletter.subject,
            html: newsletter.content,
            attachments: (newsletter.attachments || []).map(a => ({
              filename: a.filename,
              type: a.mimeType,
              content: a.base64
            }))
          })
        })
      )
    );

    const successes = results.filter(r => r.status === 'fulfilled').length;
    const failures = recipientEmails.length - successes;

    const updatedNewsletter: Newsletter = {
      ...newsletter,
      status: 'sent',
      sentAt: new Date().toISOString(),
      stats: {
        sent: recipientEmails.length,
        opened: 0,
        clicked: 0,
        bounced: failures
      }
    };

    updateData({ newsletters: newsletters.map(n => n.id === newsletter.id ? updatedNewsletter : n) });
  };

  const handleDeleteNewsletter = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette newsletter ?')) {
      updateData({
        newsletters: newsletters.filter(n => n.id !== id)
      });
    }
  };

  const defaultTemplates: EmailTemplate[] = [
    {
      id: 'template-welcome',
      name: 'Email de Bienvenue',
      subject: 'Bienvenue chez Perfect Models Management',
      type: 'welcome',
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #D4AF37;">Bienvenue {name}!</h1>
          <p>Nous sommes ravis de vous accueillir dans la famille Perfect Models Management.</p>
          <p>Votre parcours dans le monde du mannequinat commence maintenant!</p>
        </div>
      `,
      variables: ['name'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'template-casting',
      name: 'Notification de Casting',
      subject: 'Nouveau Casting Disponible',
      type: 'custom',
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #D4AF37;">Nouvelle Opportunité!</h2>
          <p>Bonjour {name},</p>
          <p>Un nouveau casting est disponible et correspond à votre profil.</p>
          <p><strong>Détails:</strong> {castingDetails}</p>
        </div>
      `,
      variables: ['name', 'castingDetails'],
      createdAt: new Date().toISOString()
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Newsletter & Marketing</h1>
            <button
              onClick={() => handleCreateNewsletter()}
              className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition"
            >
              <Plus className="w-5 h-5" />
              Nouvelle Newsletter
            </button>
          </div>
          <p className="text-gray-600">Créez et envoyez des newsletters à vos contacts</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Envoyées</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ouvertures</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalOpens}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MousePointer className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Clics</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalClicks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Taux d'ouverture</p>
                <p className="text-2xl font-bold text-orange-600">{stats.avgOpenRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-xl shadow-md">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('newsletters')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'newsletters'
                  ? 'border-b-2 border-pm-gold text-pm-gold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Newsletters ({newsletters.length})
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'templates'
                  ? 'border-b-2 border-pm-gold text-pm-gold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Templates ({templates.length + defaultTemplates.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'newsletters' ? (
          <div className="bg-white rounded-b-xl shadow-md p-6">
            <div className="space-y-4">
              {newsletters.map(newsletter => {
                const openRate = newsletter.stats
                  ? ((newsletter.stats.opened / newsletter.stats.sent) * 100).toFixed(1)
                  : 0;
                const clickRate = newsletter.stats
                  ? ((newsletter.stats.clicked / newsletter.stats.sent) * 100).toFixed(1)
                  : 0;

                return (
                  <div key={newsletter.id} className="border rounded-xl p-6 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{newsletter.subject}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            newsletter.status === 'sent' ? 'bg-green-100 text-green-800' :
                            newsletter.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {newsletter.status === 'sent' ? 'Envoyée' :
                             newsletter.status === 'scheduled' ? 'Programmée' :
                             'Brouillon'}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {newsletter.recipientType === 'all' ? 'Tous' : 'Personnalisé'}
                          </span>
                          <span>•</span>
                          <span>
                            {newsletter.sentAt
                              ? `Envoyée le ${new Date(newsletter.sentAt).toLocaleDateString('fr-FR')}`
                              : `Créée le ${new Date(newsletter.createdAt).toLocaleDateString('fr-FR')}`
                            }
                          </span>
                        </div>

                        {newsletter.stats && (
                          <div className="grid grid-cols-4 gap-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-600">Envoyées</p>
                              <p className="text-lg font-bold text-gray-900">{newsletter.stats.sent}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                              <p className="text-xs text-gray-600">Ouvertures</p>
                              <p className="text-lg font-bold text-green-600">
                                {newsletter.stats.opened} ({openRate}%)
                              </p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-3">
                              <p className="text-xs text-gray-600">Clics</p>
                              <p className="text-lg font-bold text-purple-600">
                                {newsletter.stats.clicked} ({clickRate}%)
                              </p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-3">
                              <p className="text-xs text-gray-600">Rebonds</p>
                              <p className="text-lg font-bold text-red-600">{newsletter.stats.bounced}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {newsletter.status === 'draft' && (
                          <>
                            <button
                              onClick={() => {
                                setEditingNewsletter(newsletter);
                                setShowCreateModal(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Modifier"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleSendNewsletter(newsletter)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Envoyer"
                            >
                              <Send className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteNewsletter(newsletter.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {newsletters.length === 0 && (
                <div className="text-center py-12">
                  <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-4">Aucune newsletter créée</p>
                  <button
                    onClick={() => handleCreateNewsletter()}
                    className="px-6 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition"
                  >
                    Créer votre première newsletter
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-b-xl shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...templates, ...defaultTemplates].map(template => (
                <div key={template.id} className="border rounded-xl p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {template.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{template.subject}</p>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Variables:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map(variable => (
                        <span key={variable} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {`{${variable}}`}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCreateNewsletter(template)}
                    className="w-full px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition"
                  >
                    Utiliser ce template
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && editingNewsletter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingNewsletter.id.startsWith('newsletter-') && !newsletters.find(n => n.id === editingNewsletter.id)
                  ? 'Nouvelle Newsletter'
                  : 'Modifier la Newsletter'
                }
              </h2>

              <div className="space-y-4">
                {editingNewsletter && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.vcf,.vcard,.json,.txt"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleImportContacts(f);
                        e.currentTarget.value = '';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 bg-black text-white rounded-md border border-gray-300 hover:bg-gray-900"
                    >
                      Importer contacts (CSV/VCF/JSON/TXT)
                    </button>
                    <AttachmentUploader
                      newsletter={editingNewsletter}
                      onChange={(attachments) => setEditingNewsletter({ ...editingNewsletter, attachments })}
                    />
                    {editingNewsletter.recipientType === 'custom' && (
                      <span className="text-xs text-gray-600">
                        {editingNewsletter.recipientIds?.length || 0} destinataires
                      </span>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
                  <input
                    type="text"
                    value={editingNewsletter.subject}
                    onChange={(e) => setEditingNewsletter({ ...editingNewsletter, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                    placeholder="Sujet de l'email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contenu (HTML)</label>
                  <textarea
                    value={editingNewsletter.content}
                    onChange={(e) => setEditingNewsletter({ ...editingNewsletter, content: e.target.value })}
                    rows={12}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent font-mono text-sm"
                    placeholder="Contenu HTML de l'email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destinataires</label>
                  <select
                    value={editingNewsletter.recipientType}
                    onChange={(e) => setEditingNewsletter({ ...editingNewsletter, recipientType: e.target.value as Newsletter['recipientType'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
                  >
                    <option value="all">Tous les utilisateurs</option>
                    <option value="models">Mannequins uniquement</option>
                    <option value="clients">Clients uniquement</option>
                    <option value="subscribers">Abonnés newsletter</option>
                    <option value="custom">Liste personnalisée</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingNewsletter(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveNewsletter}
                  className="flex-1 px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Small inline component for attachments upload/preview
const AttachmentUploader: React.FC<{
  newsletter: Newsletter;
  onChange: (attachments: NonNullable<Newsletter['attachments']>) => void;
}> = ({ newsletter, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const maxSize = 5 * 1024 * 1024; // 5MB per file

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const current = [...(newsletter.attachments || [])];
    for (const file of Array.from(files)) {
      if (file.size > maxSize) {
        alert(`${file.name}: dépasse 5MB (ignoré)`);
        continue;
      }
      const buf = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
      current.push({ filename: file.name, mimeType: file.type || 'application/octet-stream', base64, size: file.size });
    }
    onChange(current);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeAt = (idx: number) => {
    const next = [...(newsletter.attachments || [])];
    next.splice(idx, 1);
    onChange(next);
  };

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        accept="application/pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="px-3 py-2 bg-white text-gray-800 rounded-md border border-gray-300 hover:bg-gray-50 inline-flex items-center gap-2"
        title="Ajouter des pièces jointes"
      >
        <Paperclip className="w-4 h-4" />
        Pièces jointes
      </button>

      {(newsletter.attachments?.length || 0) > 0 && (
        <div className="flex flex-wrap gap-2">
          {newsletter.attachments!.map((a, i) => (
            <span key={`${a.filename}-${i}`} className="flex items-center gap-2 text-xs px-2 py-1 bg-white border rounded">
              {a.filename}
              <button onClick={() => removeAt(i)} className="text-red-600 hover:text-red-800" title="Retirer">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNewsletter;

