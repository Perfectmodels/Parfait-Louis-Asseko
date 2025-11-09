
import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { ContactMessage } from '../../types';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, CheckCircleIcon, EyeIcon } from '@heroicons/react/24/outline';

type StatusFilter = 'Toutes' | 'Nouveau' | 'Lu' | 'Archivé';

const AdminMessages: React.FC = () => {
    const { data, saveData } = useData();
    const [filter, setFilter] = useState<StatusFilter>('Toutes');

    const messages = useMemo(() => {
        return [...(data?.contactMessages || [])].sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
    }, [data?.contactMessages]);

    const filteredMessages = useMemo(() => {
        if (filter === 'Toutes') return messages;
        return messages.filter(req => req.status === filter);
    }, [filter, messages]);

    const handleUpdateStatus = async (messageId: string, status: ContactMessage['status']) => {
        if (!data) return;
        const updatedMessages = messages.map(msg => msg.id === messageId ? { ...msg, status } : msg);
        await saveData({ ...data, contactMessages: updatedMessages });
    };

    const handleDelete = async (messageId: string) => {
        if (!data || !window.confirm("Supprimer ce message ?")) return;
        const updatedMessages = messages.filter(msg => msg.id !== messageId);
        await saveData({ ...data, contactMessages: updatedMessages });
    };

    const getStatusColor = (status: ContactMessage['status']) => {
        switch (status) {
            case 'Nouveau': return 'bg-blue-500/20 text-blue-300 border-blue-500';
            case 'Lu': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
            case 'Archivé': return 'bg-gray-500/20 text-gray-400 border-gray-500';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };
    
    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Messages de Contact" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Dashboard
                </Link>
                <h1 className="text-4xl font-playfair text-pm-gold">Messages de Contact</h1>
                <p className="text-pm-off-white/70 mt-2 mb-8">Gérez les messages reçus via le formulaire de contact public.</p>

                <div className="flex items-center gap-4 mb-8 flex-wrap">
                    {(['Toutes', 'Nouveau', 'Lu', 'Archivé'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 text-sm uppercase tracking-wider rounded-full transition-all ${filter === f ? 'bg-pm-gold text-pm-dark' : 'bg-black border border-pm-gold text-pm-gold hover:bg-pm-gold/20'}`}>
                            {f}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {filteredMessages.map(msg => (
                        <div key={msg.id} className="bg-black p-4 border border-pm-gold/10 rounded-lg">
                            <div className="flex justify-between items-start flex-wrap gap-4">
                                <div>
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusColor(msg.status)}`}>{msg.status}</span>
                                    <h2 className="text-xl font-bold text-pm-gold mt-2">{msg.subject}</h2>
                                    <p className="text-sm text-pm-off-white/80">de <span className="font-semibold">{msg.name}</span> ({msg.email})</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xs text-pm-off-white/60">Reçu le {new Date(msg.submissionDate).toLocaleString('fr-FR')}</p>
                                </div>
                            </div>
                            <p className="mt-4 pt-3 border-t border-pm-gold/10 text-sm text-pm-off-white/90 whitespace-pre-wrap bg-pm-dark/50 p-3 rounded-md">
                                {msg.message}
                            </p>
                            <div className="mt-4 flex justify-end items-center gap-2">
                                {msg.status === 'Nouveau' && (
                                    <button onClick={() => handleUpdateStatus(msg.id, 'Lu')} className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-yellow-500 text-yellow-300 rounded-full hover:bg-yellow-500/20">
                                        Marquer comme Lu
                                    </button>
                                )}
                                {msg.status !== 'Archivé' && (
                                     <button onClick={() => handleUpdateStatus(msg.id, 'Archivé')} className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-gray-500 text-gray-400 rounded-full hover:bg-gray-500/20">
                                        Archiver
                                    </button>
                                )}
                                <button onClick={() => handleDelete(msg.id)} className="text-red-500/70 hover:text-red-500 p-1"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    ))}
                     {filteredMessages.length === 0 && (
                        <div className="text-center p-16 bg-black rounded-lg border border-pm-gold/10">
                            <EyeIcon className="w-16 h-16 mx-auto text-pm-off-white/30 mb-4"/>
                            <p className="text-pm-off-white/70">Aucun message dans cette catégorie.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminMessages;
