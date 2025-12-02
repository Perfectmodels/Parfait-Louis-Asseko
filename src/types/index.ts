export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'model' | 'client' | 'agency';
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgencyMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'model' | 'client' | 'agency';
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image' | 'casting_update' | 'booking_confirm' | 'urgent';
  status: 'sent' | 'delivered' | 'read';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  metadata?: {
    castingId?: string;
    bookingId?: string;
    modelId?: string;
    deadline?: Date;
  };
}

export interface AgencyConversation {
  id: string;
  title: string;
  type: 'model_chat' | 'client_discussion' | 'casting_coordination' | 'booking_management' | 'team_communication' | 'casting_followup' | 'contract_negotiation';
  participants: Array<{
    id: string;
    name: string;
    role: 'admin' | 'model' | 'client' | 'agency';
    avatar?: string;
    isOnline: boolean;
    lastSeen?: Date;
  }>;
  lastMessage?: {
    id: string;
    content: string;
    senderName: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
  };
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  priority: 'low' | 'normal' | 'high';
  status: 'active' | 'pending' | 'closed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  metadata?: {
    relatedCasting?: string;
    relatedBooking?: string;
    relatedModel?: string;
    deadline?: Date;
  };
  settings?: {
    notifications: boolean;
    muteUntil?: Date;
    customColor?: string;
  };
}
