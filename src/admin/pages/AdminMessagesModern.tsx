import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { ContactMessage } from '../../types';
import { TrashIcon, EyeIcon, CheckCircleIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { 
    AdminPageHeader, 
    AdminTable, 
    AdminButton, 
    AdminModal,
    AdminInput,
    AdminTextarea
} from '../components';
import { formatDateTime, formatStatus } from '../utils/formatters';
import SEO from '../../components/SEO';

type StatusFilter = 'Toutes' | 'Nouveau' | 'Lu' | 'Archivé';

const AdminMessagesModern: React.FC = () => {
    const { data, saveData } = useData();
    const [filter, setFilter] = useState<StatusFilter>('Toutes');
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const messages = useMemo(() => {
        return [...(data?.contactMessages || [])].sort((a, b) => 
            new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
        );
    }, [data?.contactMessages]);

    const filteredMessages = useMemo(() => {
        if (filter === 'Toutes') return messages;
        return messages.filter(msg => msg.status === filter);
    }, [filter, messages]);

    const handleUpdateStatus = async (messageId: string, status: ContactMessage['status']) => {
        if (!data) return;
        const updatedMessages = messages.map(msg => 
            msg.id === messageId ? { ...msg, status } : msg
        );
        await saveData({ ...data, contactMessages: updatedMessages });
    };

    const handleDelete = async (messageId: string) => {
        if (!data || !window.confirm("Supprimer ce message ?")) return;
        const updatedMessages = messages.filter(msg => msg.id !== messageId);
        await saveData({ ...data, contactMessages: updatedMessages });
    };

    const handleViewMessage = (message: ContactMessage) => {
        setSelectedMessage(message);
        setIsModalOpen(true);
        
        // Marquer comme lu si nouveau
        if (message.status === 'Nouveau') {
            handleUpdateStatus(message.id, 'Lu');
        }
    };

    const columns = [
        {
            key: 'status',
            label: 'Statut',
            render: (status: string) => {
                const { text, color } = formatStatus(status);
                return (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
                        {text}
                    </span>
                );
            }
        },
        {
            key: 'subject',
            label: 'Sujet',
            render: (subject: string) => (
                <span className="font-medium text-pm-off-white">{subject}</span>
            )
        },
        {
            key: 'name',
            label: 'Expéditeur',
            render: (name: string, message: ContactMessage) => (
                <div>
                    <div className="font-medium text-pm-off-white">{name}</div>
                    <div className="text-sm text-pm-off-white/60">{message.email}</div>
                </div>
            )
        },
        {
            key: 'submissionDate',
            label: 'Date',
            render: (date: string) => (
                <span className="text-sm text-pm-off-white/70">
                    {formatDateTime(date)}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_: any, message: ContactMessage) => (
                <div className="flex items-center space-x-2">
                    <AdminButton
                        size="sm"
                        variant="outline"
                        icon={EyeIcon}
                        onClick={() => handleViewMessage(message)}
                    >
                        Voir
                    </AdminButton>
                    {message.status === 'Nouveau' && (
                        <AdminButton
                            size="sm"
                            variant="secondary"
                            icon={CheckCircleIcon}
                            onClick={() => handleUpdateStatus(message.id, 'Lu')}
                        >
                            Marquer lu
                        </AdminButton>
                    )}
                    {message.status !== 'Archivé' && (
                        <AdminButton
                            size="sm"
                            variant="secondary"
                            icon={ArchiveBoxIcon}
                            onClick={() => handleUpdateStatus(message.id, 'Archivé')}
                        >
                            Archiver
                        </AdminButton>
                    )}
                    <AdminButton
                        size="sm"
                        variant="danger"
                        icon={TrashIcon}
                        onClick={() => handleDelete(message.id)}
                    >
                        Supprimer
                    </AdminButton>
                </div>
            )
        }
    ];

    const filterButtons = (
        <div className="flex items-center space-x-2">
            {(['Toutes', 'Nouveau', 'Lu', 'Archivé'] as const).map(f => (
                <AdminButton
                    key={f}
                    size="sm"
                    variant={filter === f ? 'primary' : 'outline'}
                    onClick={() => setFilter(f)}
                >
                    {f}
                </AdminButton>
            ))}
        </div>
    );

    return (
        <div className="space-y-6">
            <SEO title="Admin - Messages de Contact" noIndex />
            
            <AdminPageHeader
                title="Messages de Contact"
                subtitle="Gérez les messages reçus via le formulaire de contact public"
                actions={filterButtons}
            />

            <AdminTable
                data={filteredMessages}
                columns={columns}
                emptyMessage="Aucun message dans cette catégorie"
            />

            {/* Modal de détail du message */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedMessage ? `Message de ${selectedMessage.name}` : ''}
                size="lg"
                actions={
                    selectedMessage && (
                        <div className="flex items-center space-x-3">
                            {selectedMessage.status !== 'Archivé' && (
                                <AdminButton
                                    variant="secondary"
                                    icon={ArchiveBoxIcon}
                                    onClick={() => {
                                        handleUpdateStatus(selectedMessage.id, 'Archivé');
                                        setIsModalOpen(false);
                                    }}
                                >
                                    Archiver
                                </AdminButton>
                            )}
                            <AdminButton
                                variant="danger"
                                icon={TrashIcon}
                                onClick={() => {
                                    handleDelete(selectedMessage.id);
                                    setIsModalOpen(false);
                                }}
                            >
                                Supprimer
                            </AdminButton>
                            <AdminButton
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Fermer
                            </AdminButton>
                        </div>
                    )
                }
            >
                {selectedMessage && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <AdminInput
                                label="Nom"
                                value={selectedMessage.name}
                                readOnly
                            />
                            <AdminInput
                                label="Email"
                                value={selectedMessage.email}
                                readOnly
                            />
                        </div>
                        
                        <AdminInput
                            label="Sujet"
                            value={selectedMessage.subject}
                            readOnly
                        />
                        
                        <AdminInput
                            label="Date de réception"
                            value={formatDateTime(selectedMessage.submissionDate)}
                            readOnly
                        />
                        
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-pm-off-white/70">Statut:</span>
                            {(() => {
                                const { text, color } = formatStatus(selectedMessage.status);
                                return (
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
                                        {text}
                                    </span>
                                );
                            })()}
                        </div>
                        
                        <AdminTextarea
                            label="Message"
                            value={selectedMessage.message}
                            rows={8}
                            readOnly
                        />
                    </div>
                )}
            </AdminModal>
        </div>
    );
};

export default AdminMessagesModern;