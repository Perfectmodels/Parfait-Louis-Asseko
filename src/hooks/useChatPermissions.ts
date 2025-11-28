import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MessagingPermission, MESSAGING_ROLE_PERMISSIONS } from '../types';

export const useMessagingPermissions = () => {
  const { user } = useAuth();

  const userPermissions = useMemo(() => {
    if (!user) return [];
    
    // Obtenir les permissions basées sur le rôle
    const rolePermissions = MESSAGING_ROLE_PERMISSIONS[user.role] || [];
    
    // Ajouter les permissions personnalisées si elles existent
    const customPermissions = user.permissions || [];
    
    // Combiner et dédupliquer
    return [...new Set([...rolePermissions, ...customPermissions])];
  }, [user]);

  const hasPermission = (permission: MessagingPermission): boolean => {
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: MessagingPermission[]): boolean => {
    return permissions.some(permission => userPermissions.includes(permission));
  };

  const hasAllPermissions = (permissions: MessagingPermission[]): boolean => {
    return permissions.every(permission => userPermissions.includes(permission));
  };

  const canViewMessaging = (): boolean => {
    return hasPermission(MessagingPermission.VIEW_MESSAGING);
  };

  const canSendMessage = (): boolean => {
    return hasPermission(MessagingPermission.SEND_MESSAGES);
  };

  const canManageConversations = (): boolean => {
    return hasPermission(MessagingPermission.MANAGE_CONVERSATIONS);
  };

  const canDeleteMessages = (): boolean => {
    return hasPermission(MessagingPermission.DELETE_MESSAGES);
  };

  const canAccessAllConversations = (): boolean => {
    return hasPermission(MessagingPermission.ACCESS_ALL_CONVERSATIONS);
  };

  const canManageTemplates = (): boolean => {
    return hasPermission(MessagingPermission.MANAGE_TEMPLATES);
  };

  const canManageAutomation = (): boolean => {
    return hasPermission(MessagingPermission.MANAGE_AUTOMATION);
  };

  const canViewAnalytics = (): boolean => {
    return hasPermission(MessagingPermission.VIEW_ANALYTICS);
  };

  const canExportConversations = (): boolean => {
    return hasPermission(MessagingPermission.EXPORT_CONVERSATIONS);
  };

  const canSendUrgentMessages = (): boolean => {
    return hasPermission(MessagingPermission.URGENT_MESSAGES);
  };

  // Vérifier si l'utilisateur peut accéder à une conversation spécifique
  const canAccessConversation = (conversationParticipants: Array<{ id: string; role: string }>): boolean => {
    if (!user) return false;
    
    // Si l'utilisateur a la permission d'accéder à toutes les conversations
    if (hasPermission(MessagingPermission.ACCESS_ALL_CONVERSATIONS)) {
      return true;
    }
    
    // Si l'utilisateur est un participant de la conversation
    const isParticipant = conversationParticipants.some(p => p.id === user.id);
    return isParticipant;
  };

  // Vérifier si l'utilisateur peut modifier une conversation
  const canEditConversation = (conversationCreatorId?: string): boolean => {
    if (!user) return false;
    
    return hasPermission(MessagingPermission.MANAGE_CONVERSATIONS) || 
           (conversationCreatorId === user.id && hasPermission(MessagingPermission.SEND_MESSAGES));
  };

  // Vérifier si l'utilisateur peut supprimer un message
  const canDeleteMessage = (messageSenderId: string): boolean => {
    if (!user) return false;
    
    return hasPermission(MessagingPermission.DELETE_MESSAGES) || 
           (messageSenderId === user.id && hasPermission(MessagingPermission.SEND_MESSAGES));
  };

  return {
    permissions: userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    // Permissions spécifiques
    canViewMessaging,
    canSendMessage,
    canManageConversations,
    canDeleteMessages,
    canAccessAllConversations,
    canManageTemplates,
    canManageAutomation,
    canViewAnalytics,
    canExportConversations,
    canSendUrgentMessages,
    // Vérifications contextuelles
    canAccessConversation,
    canEditConversation,
    canDeleteMessage
  };
};
