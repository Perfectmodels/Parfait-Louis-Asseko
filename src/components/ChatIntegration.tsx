import React, { useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useData } from '../contexts/DataContext';
import { AgencyConversation, AgencyMessage } from '../types';

interface AgencyMessagingIntegrationProps {
  children: React.ReactNode;
}

export const ChatIntegration: React.FC<AgencyMessagingIntegrationProps> = ({ children }) => {
  const { createConversation, sendMessage, useTemplate } = useChat();
  const { data } = useData();

  // Créer automatiquement des conversations pour les nouveaux castings
  useEffect(() => {
    if (!data?.castingApplications) return;

    data.castingApplications.forEach(async (application) => {
      // Vérifier si une conversation existe déjà pour ce casting
      const existingConversationId = `casting-${application.id}`;
      
      // Créer une conversation pour chaque nouvelle candidature
      if (application.status === 'Nouveau') {
        try {
          const conversation: Omit<AgencyConversation, 'id' | 'createdAt' | 'updatedAt'> = {
            title: `${application.firstName} ${application.lastName} - Casting ${application.eventName || 'Nouveau'}`,
            type: 'casting_coordination',
            participants: [
              {
                id: application.id,
                name: `${application.firstName} ${application.lastName}`,
                role: 'model',
                isOnline: false,
                permissions: {
                  canSendMessages: true,
                  canAddMembers: false,
                  canRemoveMembers: false,
                  canEditInfo: false,
                  canDeleteMessages: false
                }
              },
              {
                id: 'admin-system',
                name: 'Système Perfect Models',
                role: 'admin',
                isOnline: true,
                permissions: {
                  canSendMessages: true,
                  canAddMembers: true,
                  canRemoveMembers: true,
                  canEditInfo: true,
                  canDeleteMessages: true
                }
              }
            ],
            unreadCount: 1,
            isPinned: true,
            isArchived: false,
            isMuted: false,
            isFavorite: false,
            priority: 'high',
            status: 'pending',
            tags: ['casting', 'nouveau', application.eventType || 'general'],
            metadata: {
              relatedCasting: application.id,
              relatedModel: application.id,
              deadline: application.submissionDate ? new Date(application.submissionDate) : undefined,
              nextAction: 'Examiner la candidature',
              nextActionDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
            },
            settings: {
              autoDelete: 0,
              encryption: 'basic',
              allowScreenshots: true,
              allowForwarding: false,
              requireConfirmation: false
            }
          };

          const createdConversation = await createConversation(conversation);

          // Envoyer un message de bienvenue automatique
          const welcomeMessage = useTemplate('casting-confirmation', {
            modelName: `${application.firstName} ${application.lastName}`,
            castingTitle: application.eventName || 'Casting',
            date: new Date().toLocaleDateString('fr-FR'),
            time: 'À définir',
            address: 'À confirmer',
            agencyName: 'Perfect Models'
          });

          await sendMessage(createdConversation.id, welcomeMessage, 'casting_update');

        } catch (error) {
          console.error('Erreur lors de la création de la conversation de casting:', error);
        }
      }
    });
  }, [data?.castingApplications, createConversation, sendMessage, useTemplate]);

  // Créer des conversations pour les nouvelles demandes de booking
  useEffect(() => {
    if (!data?.bookingRequests) return;

    data.bookingRequests.forEach(async (booking) => {
      if (booking.status === 'Nouveau') {
        try {
          const conversation: Omit<AgencyConversation, 'id' | 'createdAt' | 'updatedAt'> = {
            title: `${booking.clientName} - Booking ${booking.projectName || 'Projet'}`,
            type: 'booking_management',
            participants: [
              {
                id: `client-${booking.id}`,
                name: booking.clientName,
                role: 'client',
                isOnline: false,
                permissions: {
                  canSendMessages: true,
                  canAddMembers: false,
                  canRemoveMembers: false,
                  canEditInfo: false,
                  canDeleteMessages: false
                }
              },
              {
                id: 'admin-system',
                name: 'Système Perfect Models',
                role: 'admin',
                isOnline: true,
                permissions: {
                  canSendMessages: true,
                  canAddMembers: true,
                  canRemoveMembers: true,
                  canEditInfo: true,
                  canDeleteMessages: true
                }
              }
            ],
            unreadCount: 1,
            isPinned: true,
            isArchived: false,
            isMuted: false,
            isFavorite: false,
            priority: 'high',
            status: 'pending',
            tags: ['booking', 'client', booking.projectType || 'general'],
            metadata: {
              relatedBooking: booking.id,
              relatedClient: `client-${booking.id}`,
              budget: booking.budget ? parseFloat(booking.budget.replace(/[^0-9.-]/g, '')) : undefined,
              nextAction: 'Contacter le client',
              nextActionDate: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2h
            },
            settings: {
              autoDelete: 0,
              encryption: 'basic',
              allowScreenshots: true,
              allowForwarding: false,
              requireConfirmation: true
            }
          };

          const createdConversation = await createConversation(conversation);

          // Envoyer un message de confirmation automatique
          const confirmationMessage = useTemplate('booking-confirmation', {
            clientName: booking.clientName,
            modelName: 'À déterminer',
            projectName: booking.projectName || 'Projet',
            dates: booking.startDate || 'À définir',
            location: booking.location || 'À confirmer',
            budget: booking.budget || 'À définir',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
            agencyName: 'Perfect Models'
          });

          await sendMessage(createdConversation.id, confirmationMessage, 'booking_confirm');

        } catch (error) {
          console.error('Erreur lors de la création de la conversation de booking:', error);
        }
      }
    });
  }, [data?.bookingRequests, createConversation, sendMessage, useTemplate]);

  // Créer des conversations de suivi pour les castings confirmés
  useEffect(() => {
    if (!data?.castingApplications) return;

    data.castingApplications.forEach(async (application) => {
      if (application.status === 'Confirmé') {
        try {
          const conversation: Omit<AgencyConversation, 'id' | 'createdAt' | 'updatedAt'> = {
            title: `Suivi - ${application.firstName} ${application.lastName} - ${application.eventName}`,
            type: 'casting_followup',
            participants: [
              {
                id: application.id,
                name: `${application.firstName} ${application.lastName}`,
                role: 'model',
                isOnline: false,
                permissions: {
                  canSendMessages: true,
                  canAddMembers: false,
                  canRemoveMembers: false,
                  canEditInfo: false,
                  canDeleteMessages: false
                }
              },
              {
                id: 'admin-system',
                name: 'Équipe Perfect Models',
                role: 'admin',
                isOnline: true,
                permissions: {
                  canSendMessages: true,
                  canAddMembers: true,
                  canRemoveMembers: true,
                  canEditInfo: true,
                  canDeleteMessages: true
                }
              }
            ],
            unreadCount: 0,
            isPinned: false,
            isArchived: false,
            isMuted: false,
            isFavorite: false,
            priority: 'normal',
            status: 'active',
            tags: ['suivi', 'casting-confirmé', application.eventName],
            metadata: {
              relatedCasting: application.id,
              relatedModel: application.id,
              nextAction: 'Préparation du casting',
              nextActionDate: application.eventDate ? new Date(application.eventDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            },
            settings: {
              autoDelete: 0,
              encryption: 'basic',
              allowScreenshots: true,
              allowForwarding: true,
              requireConfirmation: false
            }
          };

          await createConversation(conversation);

          // Envoyer un message de suivi
          const followUpMessage = `Félicitations ${application.firstName} ! 🎉\n\nVotre candidature pour "${application.eventName}" a été confirmée.\n\nProchaines étapes :\n• Vous recevrez les détails logistiques sous 48h\n• Préparez votre book et vos tenues\n• Restez disponible pour les communications\n\nN'hésitez pas à nous contacter si vous avez des questions.`;

          await sendMessage(conversation.id, followUpMessage, 'text');

        } catch (error) {
          console.error('Erreur lors de la création de la conversation de suivi:', error);
        }
      }
    });
  }, [data?.castingApplications, createConversation, sendMessage]);

  return <>{children}</>;
};

// Hook utilitaire pour intégrer la messagerie avec les autres composants
export const useChatIntegration = () => {
  const { createConversation, sendMessage, useTemplate } = useChat();
  const { data } = useData();

  // Créer une conversation pour un modèle spécifique
  const createModelConversation = async (modelId: string, subject?: string) => {
    const model = data?.models.find(m => m.id === modelId);
    if (!model) throw new Error('Modèle non trouvé');

    const conversation: Omit<AgencyConversation, 'id' | 'createdAt' | 'updatedAt'> = {
      title: `${model.name} - ${subject || 'Discussion générale'}`,
      type: 'model_chat',
      participants: [
        {
          id: modelId,
          name: model.name,
          role: 'model',
          isOnline: false,
          permissions: {
            canSendMessages: true,
            canAddMembers: false,
            canRemoveMembers: false,
            canEditInfo: false,
            canDeleteMessages: false
          }
        },
        {
          id: 'admin-current',
          name: 'Équipe Perfect Models',
          role: 'admin',
          isOnline: true,
          permissions: {
            canSendMessages: true,
            canAddMembers: true,
            canRemoveMembers: true,
            canEditInfo: true,
            canDeleteMessages: true
          }
        }
      ],
      unreadCount: 0,
      isPinned: false,
      isArchived: false,
      isMuted: false,
      isFavorite: false,
      priority: 'normal',
      status: 'active',
      tags: ['model', 'communication'],
      metadata: {
        relatedModel: modelId
      },
      settings: {
        autoDelete: 0,
        encryption: 'basic',
        allowScreenshots: true,
        allowForwarding: true,
        requireConfirmation: false
      }
    };

    return await createConversation(conversation);
  };

  // Envoyer une notification urgente
  const sendUrgentNotification = async (conversationId: string, message: string, deadline?: Date) => {
    const urgentContent = deadline 
      ? `🚨 URGENT - Deadline ${deadline.toLocaleDateString('fr-FR')} 🚨\n\n${message}\n\nMerci de traiter en priorité.`
      : `🚨 URGENT 🚨\n\n${message}\n\nMerci de traiter en priorité.`;

    return await sendMessage(conversationId, urgentContent, 'urgent');
  };

  // Envoyer une mise à jour de casting
  const sendCastingUpdate = async (conversationId: string, update: string, castingId?: string) => {
    const content = `📅 MISE À JOUR CASTING\n\n${update}`;
    
    const message: Partial<AgencyMessage> = {
      type: 'casting_update',
      metadata: {
        castingId,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
      }
    };

    return await sendMessage(conversationId, content, 'casting_update');
  };

  // Envoyer une confirmation de booking
  const sendBookingConfirmation = async (conversationId: string, details: {
    modelName: string;
    projectName: string;
    dates: string;
    location: string;
    budget: string;
  }) => {
    const content = useTemplate('booking-confirmation', {
      ...details,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
      agencyName: 'Perfect Models'
    });

    return await sendMessage(conversationId, content, 'booking_confirm');
  };

  return {
    createModelConversation,
    sendUrgentNotification,
    sendCastingUpdate,
    sendBookingConfirmation
  };
};
