import React, { useState, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminCard from '../components/admin/AdminCard';
import { StatCard } from '../components/admin/AdminStats';
import { 
    ChatBubbleLeftRightIcon, EnvelopeIcon, KeyIcon, CalendarIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

const AdminCommunication: React.FC = () => {
    const { data } = useData();
    const [activeSection, setActiveSection] = useState<'messages' | 'emails' | 'recovery' | 'comments'>('messages');

    // ---- Comptage notifications ----
    const newMessages = useMemo(() => (data as any)?.contactMessages?.filter((m: any) => m.status === 'Nouveau').length || 0, [data]);
    const newRecoveryRequests = useMemo(() => (data as any)?.recoveryRequests?.filter((r: any) => r.status === 'Nouveau').length || 0, [data]);
    const newBookingRequests = useMemo(() => (data as any)?.bookingRequests?.filter((b: any) => b.status === 'Nouveau').length || 0, [data]);
    const totalComments = useMemo(() => (data as any)?.comments?.length || 0, [data]);

    const sections = [
        { id: 'messages', label: 'Messages Contact', icon: ChatBubbleLeftRightIcon, count: newMessages },
        { id: 'emails', label: 'Campagnes Email', icon: EnvelopeIcon, count: 0 },
        { id: 'recovery', label: 'Demandes Récupération', icon: KeyIcon, count: newRecoveryRequests },
        { id: 'comments', label: 'Commentaires', icon: ChatBubbleLeftRightIcon, count: totalComments },
    ];

    return (
        <AdminLayout 
            title="Communication & Messagerie" 
            description="Gérer les communications avec les utilisateurs et les campagnes"
            breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'Communication', href: '/admin/communication' }
            ]}
        >
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Messages Non Lus"
                    value={newMessages}
                    icon={ChatBubbleLeftRightIcon}
                    color="green"
                />
                <StatCard
                    title="Demandes Récupération"
                    value={newRecoveryRequests}
                    icon={KeyIcon}
                    color="orange"
                />
                <StatCard
                    title="Réservations En Attente"
                    value={newBookingRequests}
                    icon={CalendarIcon}
                    color="blue"
                />
                <StatCard
                    title="Commentaires"
                    value={totalComments}
                    icon={ChatBubbleLeftRightIcon}
                    color="purple"
                />
            </div>

            {/* Navigation des sections */}
            <div className="mb-8">
                <nav className="flex space-x-1 bg-black/30 p-1 rounded-lg">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id as any)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeSection === section.id
                                    ? 'bg-pm-gold text-black'
                                    : 'text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10'
                            }`}
                        >
                            <section.icon className="w-4 h-4" />
                            {section.label}
                            {section.count > 0 && (
                                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                                    {section.count}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AdminCard 
                    title="Nouvelle Campagne Email" 
                    icon={EnvelopeIcon} 
                    description="Créer une nouvelle campagne email marketing."
                    color="blue"
                    onClick={() => {/* TODO: Ouvrir modal campagne */}}
                />
                <AdminCard 
                    title="Template Email" 
                    icon={EnvelopeIcon} 
                    description="Créer ou modifier un template d'email."
                    color="purple"
                    onClick={() => {/* TODO: Ouvrir modal template */}}
                />
                <AdminCard 
                    title="Messagerie Interne" 
                    icon={ChatBubbleLeftRightIcon} 
                    description="Envoyer un message aux mannequins."
                    color="green"
                    onClick={() => {/* TODO: Ouvrir modal messagerie */}}
                />
                <AdminCard 
                    title="Notification Push" 
                    icon={ExclamationTriangleIcon} 
                    description="Envoyer une notification à tous les utilisateurs."
                    color="orange"
                    onClick={() => {/* TODO: Ouvrir modal notification */}}
                />
            </div>

            {/* Contenu selon la section active */}
            {activeSection === 'messages' && (
                <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                    <h3 className="text-xl font-playfair text-pm-gold mb-4">
                        Messages de Contact ({newMessages} non lus)
                    </h3>
                    
                    {newMessages === 0 ? (
                        <div className="text-center py-12">
                            <ChatBubbleLeftRightIcon className="w-16 h-16 text-pm-gold/50 mx-auto mb-4" />
                            <p className="text-pm-off-white/70 text-lg">
                                Aucun nouveau message de contact.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(data as any)?.contactMessages?.slice(0, 10).map((message: any, index: number) => (
                                <div key={index} className={`p-4 rounded-lg border ${
                                    message.status === 'Nouveau' 
                                        ? 'border-pm-gold/40 bg-pm-gold/5' 
                                        : 'border-pm-gold/10 bg-black/30'
                                }`}>
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="text-pm-gold font-medium">{message.name || 'Anonyme'}</h4>
                                            <p className="text-pm-off-white/70 text-sm">{message.email}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                message.status === 'Nouveau' 
                                                    ? 'bg-red-500/20 text-red-400' 
                                                    : 'bg-green-500/20 text-green-400'
                                            }`}>
                                                {message.status}
                                            </span>
                                            <span className="text-pm-off-white/50 text-xs">
                                                {new Date(message.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-pm-off-white/80 mb-3">{message.message}</p>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-pm-gold/20 text-pm-gold text-xs rounded hover:bg-pm-gold/30">
                                            Marquer comme lu
                                        </button>
                                        <button className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded hover:bg-blue-500/30">
                                            Répondre
                                        </button>
                                        <button className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded hover:bg-red-500/30">
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeSection === 'emails' && (
                <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                    <h3 className="text-xl font-playfair text-pm-gold mb-4">
                        Campagnes Email
                    </h3>
                    <div className="text-center py-12">
                        <EnvelopeIcon className="w-16 h-16 text-pm-gold/50 mx-auto mb-4" />
                        <p className="text-pm-off-white/70 text-lg mb-4">
                            Gestion des campagnes email à implémenter
                        </p>
                        <button className="px-6 py-2 bg-pm-gold text-black rounded-lg hover:bg-pm-gold/90 transition-colors">
                            Créer une campagne
                        </button>
                    </div>
                </div>
            )}

            {activeSection === 'recovery' && (
                <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                    <h3 className="text-xl font-playfair text-pm-gold mb-4">
                        Demandes de Récupération ({newRecoveryRequests} en attente)
                    </h3>
                    
                    {newRecoveryRequests === 0 ? (
                        <div className="text-center py-12">
                            <KeyIcon className="w-16 h-16 text-pm-gold/50 mx-auto mb-4" />
                            <p className="text-pm-off-white/70 text-lg">
                                Aucune demande de récupération en attente.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(data as any)?.recoveryRequests?.slice(0, 10).map((request: any, index: number) => (
                                <div key={index} className="p-4 rounded-lg border border-pm-gold/10 bg-black/30">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="text-pm-gold font-medium">{request.email}</h4>
                                            <p className="text-pm-off-white/70 text-sm">
                                                Demande le {new Date(request.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className="px-2 py-1 text-xs rounded-full bg-orange-500/20 text-orange-400">
                                            {request.status}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-pm-gold/20 text-pm-gold text-xs rounded hover:bg-pm-gold/30">
                                            Envoyer lien
                                        </button>
                                        <button className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded hover:bg-green-500/30">
                                            Marquer traité
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeSection === 'comments' && (
                <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                    <h3 className="text-xl font-playfair text-pm-gold mb-4">
                        Commentaires ({totalComments})
                    </h3>
                    
                    {totalComments === 0 ? (
                        <div className="text-center py-12">
                            <ChatBubbleLeftRightIcon className="w-16 h-16 text-pm-gold/50 mx-auto mb-4" />
                            <p className="text-pm-off-white/70 text-lg">
                                Aucun commentaire à modérer.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(data as any)?.comments?.slice(0, 10).map((comment: any, index: number) => (
                                <div key={index} className="p-4 rounded-lg border border-pm-gold/10 bg-black/30">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="text-pm-gold font-medium">{comment.author || 'Anonyme'}</h4>
                                            <p className="text-pm-off-white/70 text-sm">
                                                Sur: {comment.articleTitle || 'Article'}
                                            </p>
                                        </div>
                                        <span className="text-pm-off-white/50 text-xs">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-pm-off-white/80 mb-3">{comment.content}</p>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded hover:bg-green-500/30">
                                            Approuver
                                        </button>
                                        <button className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded hover:bg-red-500/30">
                                            Supprimer
                                        </button>
                                        <button className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded hover:bg-yellow-500/30">
                                            Modérer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminCommunication;
