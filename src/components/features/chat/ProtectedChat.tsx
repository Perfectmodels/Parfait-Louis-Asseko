import React from 'react';
import { MessagingPermission } from '../../../types';
import { useChatPermissions } from '../../../hooks/useChatPermissions';

interface ProtectedMessagingProps {
  children: React.ReactNode;
  permission?: MessagingPermission;
  permissions?: MessagingPermission[];
  fallback?: React.ReactNode;
  requireAll?: boolean;
}

export const ProtectedChat: React.FC<ProtectedMessagingProps> = ({
  children,
  permission,
  permissions = [],
  fallback = <div className="text-pm-off-white/50 text-center p-4">Accès non autorisé</div>,
  requireAll = false
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useChatPermissions();

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions.length > 0) {
    hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
  } else {
    // Par défaut, vérifier si l'utilisateur peut voir la messagerie
    hasAccess = hasPermission(MessagingPermission.VIEW_MESSAGING);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

// Composant pour vérifier l'accès à une conversation spécifique
interface ConversationAccessProps {
  children: React.ReactNode;
  conversationParticipants: Array<{ id: string; role: string }>;
  fallback?: React.ReactNode;
}

export const ConversationAccess: React.FC<ConversationAccessProps> = ({
  children,
  conversationParticipants,
  fallback = <div className="text-pm-off-white/50 text-center p-4">Conversation privée</div>
}) => {
  const { canAccessConversation } = useChatPermissions();

  const hasAccess = canAccessConversation(conversationParticipants);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

// Composant pour vérifier la permission d'envoi de message
interface MessageSenderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const MessageSender: React.FC<MessageSenderProps> = ({
  children,
  fallback = <div className="text-pm-off-white/50 text-center p-4">Vous ne pouvez pas envoyer de messages</div>
}) => {
  const { canSendMessage } = useChatPermissions();

  return canSendMessage() ? <>{children}</> : <>{fallback}</>;
};

// Composant pour vérifier la permission de gestion des conversations
interface ConversationManagerProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ConversationManager: React.FC<ConversationManagerProps> = ({
  children,
  fallback = <div className="text-pm-off-white/50 text-center p-4">Fonctionnalité de gestion non disponible</div>
}) => {
  const { canManageConversations } = useChatPermissions();

  return canManageConversations() ? <>{children}</> : <>{fallback}</>;
};

// Composant pour vérifier la permission de gestion des templates
interface TemplateManagerProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  children,
  fallback = <div className="text-pm-off-white/50 text-center p-4">Gestion des templates non disponible</div>
}) => {
  const { canManageTemplates } = useChatPermissions();

  return canManageTemplates() ? <>{children}</> : <>{fallback}</>;
};

// Composant pour vérifier la permission d'envoi de messages urgents
interface UrgentMessengerProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const UrgentMessenger: React.FC<UrgentMessengerProps> = ({
  children,
  fallback = <div className="text-pm-off-white/50 text-center p-4">Envoi de messages urgents non autorisé</div>
}) => {
  const { canSendUrgentMessages } = useChatPermissions();

  return canSendUrgentMessages() ? <>{children}</> : <>{fallback}</>;
};

// Hook pour créer des composants protégés personnalisés
export const useProtectedChat = () => {
  const { hasPermission } = useChatPermissions();

  const createProtectedComponent = (permission: MessagingPermission) => {
    return ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
      <ProtectedChat permission={permission} fallback={fallback}>
        {children}
      </ProtectedChat>
    );
  };

  return {
    hasPermission,
    createProtectedComponent,
    ProtectedChat,
    ConversationAccess,
    MessageSender,
    ConversationManager,
    TemplateManager,
    UrgentMessenger
  };
};
