export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  logo: string;
  defaultImage: string;
  keywords: string;
  author: string;
  twitterHandle: string;
}

export interface Model {
  id: string;
  name: string;
  username: string;
  password: string;
  email?: string;
  phone?: string;
  age?: number;
  height: string;
  gender: 'Homme' | 'Femme';
  location?: string;
  imageUrl: string;
  portfolioImages?: string[];
  distinctions?: ModelDistinction[];
  isPublic?: boolean;
  level?: 'Pro' | 'Débutant';
  measurements: {
    chest: string;
    waist: string;
    hips: string;
    shoeSize: string;
  };
  categories: string[];
  experience: string;
  journey: string;
  quizScores: {
    [chapterSlug: string]: {
      score: number;
      total: number;
      timesLeft: number;
      timestamp: string;
    }
  };
  lastLogin?: string;
  lastActivity?: string;
}

// Gallery Types
export interface Photo {
  id: string;
  url: string;
  caption: string;
  date: string;
  photographer: string;
  tags: string[];
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description: string;
  category: 'shooting' | 'défilé' | 'événement' | 'backstage' | 'portrait' | 'autre';
  coverImage: string;
  photos: Photo[];
  date: string;
  location?: string;
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Stylist {
  name: string;
  description: string;
  images: string[];
}

export interface Artist {
  name: string;
  description: string;
  images: string[];
}

export interface FashionDayEvent {
  edition: number;
  date: string;
  theme: string;
  location?: string;
  mc?: string;
  promoter?: string;
  stylists?: Stylist[];
  featuredModels?: string[];
  artists?: Artist[];
  partners?: { type: string; name: string }[];
  description: string;
  pricingPackages?: {
    category: string;
    items: {
      name: string;
      capacity: string;
      contents: string;
      price: string;
    }[];
  }[];
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  ctaLink: string;
  order: number;
  isActive: boolean;
}

export interface Service {
  slug: string;
  icon: string;
  title: string;
  category: 'Services Mannequinat' | 'Services Mode et Stylisme' | 'Services Événementiels';
  description: string;
  details?: {
    title: string;
    points: string[];
  };
  buttonText: string;
  buttonLink: string;
  isComingSoon?: boolean;
}

export interface AchievementCategory {
  name: string;
  items: string[];
}

export interface ModelDistinction {
  name: string;
  titles: string[];
}

export type ArticleContent =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'image'; src: string; alt: string; caption?: string };

export interface Article {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  date: string;
  content: ArticleContent[];
  tags?: string[];
  isFeatured?: boolean;
  viewCount?: number;
  reactions?: {
    likes: number;
    dislikes: number;
  };
}


export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Chapter {
  slug: string;
  title: string;
  content: string;
}

export interface Module {
  slug: string;
  title: string;
  chapters: Chapter[];
  quiz: QuizQuestion[];
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  imageUrl: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  excerpt: string;
  link?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  notificationEmail?: string;
}

export interface SiteImages {
  hero: string;
  about: string;
  fashionDayBg: string;
  agencyHistory: string;
  classroomBg: string;
  castingBg: string;
}

export interface Partner {
  name: string;
}

export interface ApiKeys {
  resendApiKey: string;
  formspreeEndpoint: string;
  firebaseDynamicLinks?: {
    webApiKey?: string;
    domainUriPrefix: string;
  };
  imgbbApiKey?: string;
  brevoApiKey?: string;
}

export type CastingApplicationStatus = 'Nouveau' | 'Présélectionné' | 'Accepté' | 'Refusé';

export interface JuryScore {
  physique: number;
  presence: number;
  photogenie: number;
  potentiel: number;
  notes?: string;
  overall: number;
}

export interface JuryMember {
  id: string;
  name: string;
  username: string;
  password: string;
}

export interface RegistrationStaff {
  id: string;
  name: string;
  username: string;
  password: string;
}

export interface CastingApplication {
  id: string;
  submissionDate: string;
  status: CastingApplicationStatus;

  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  nationality: string;
  city: string;
  gender: 'Homme' | 'Femme';
  height: string;
  weight: string;
  chest: string;
  waist: string;
  hips: string;
  shoeSize: string;
  eyeColor: string;
  hairColor: string;
  experience: string;
  instagram: string;
  portfolioLink: string;

  photoPortraitUrl?: string | null;
  photoFullBodyUrl?: string | null;
  photoProfileUrl?: string | null;

  scores?: {
    [juryId: string]: JuryScore;
  };

  passageNumber?: number;
}

export type FashionDayApplicationRole = 'Mannequin' | 'Styliste' | 'Partenaire' | 'Photographe' | 'MUA' | 'Autre';
export type FashionDayApplicationStatus = 'Nouveau' | 'En attente' | 'Accepté' | 'Refusé';

export interface FashionDayApplication {
  id: string;
  submissionDate: string;
  name: string;
  email: string;
  phone: string;
  role: FashionDayApplicationRole;
  message: string;
  status: FashionDayApplicationStatus;
}

export interface ForumThread {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  initialPost: string;
}

export interface ForumReply {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  content: string;
}

export interface ArticleComment {
  id: string;
  articleSlug: string;
  authorName: string;
  createdAt: string;
  content: string;
}

export interface RecoveryRequest {
  id: string;
  modelName: string;
  phone: string;
  timestamp: string;
  status: 'Nouveau' | 'Traité';
}

export interface BookingRequest {
  id: string;
  submissionDate: string;
  status: 'Nouveau' | 'Confirmé' | 'Annulé';
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  requestedModels: string;
  startDate?: string;
  endDate?: string;
  message: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  category: string;
  items: FAQItem[];
}

// Permissions pour le système de messagerie
export enum MessagingPermission {
  VIEW_MESSAGING = 'VIEW_MESSAGING',
  SEND_MESSAGES = 'SEND_MESSAGES',
  MANAGE_CONVERSATIONS = 'MANAGE_CONVERSATIONS',
  DELETE_MESSAGES = 'DELETE_MESSAGES',
  ACCESS_ALL_CONVERSATIONS = 'ACCESS_ALL_CONVERSATIONS',
  MANAGE_TEMPLATES = 'MANAGE_TEMPLATES',
  MANAGE_AUTOMATION = 'MANAGE_AUTOMATION',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  EXPORT_CONVERSATIONS = 'EXPORT_CONVERSATIONS',
  URGENT_MESSAGES = 'URGENT_MESSAGES'
}

// Mapping des permissions par rôle pour la messagerie
export const MESSAGING_ROLE_PERMISSIONS: Record<string, MessagingPermission[]> = {
  admin: [
    MessagingPermission.VIEW_MESSAGING,
    MessagingPermission.SEND_MESSAGES,
    MessagingPermission.MANAGE_CONVERSATIONS,
    MessagingPermission.DELETE_MESSAGES,
    MessagingPermission.ACCESS_ALL_CONVERSATIONS,
    MessagingPermission.MANAGE_TEMPLATES,
    MessagingPermission.MANAGE_AUTOMATION,
    MessagingPermission.VIEW_ANALYTICS,
    MessagingPermission.EXPORT_CONVERSATIONS,
    MessagingPermission.URGENT_MESSAGES
  ],
  booking_manager: [
    MessagingPermission.VIEW_MESSAGING,
    MessagingPermission.SEND_MESSAGES,
    MessagingPermission.MANAGE_CONVERSATIONS,
    MessagingPermission.ACCESS_ALL_CONVERSATIONS,
    MessagingPermission.MANAGE_TEMPLATES,
    MessagingPermission.VIEW_ANALYTICS,
    MessagingPermission.URGENT_MESSAGES
  ],
  event_manager: [
    MessagingPermission.VIEW_MESSAGING,
    MessagingPermission.SEND_MESSAGES,
    MessagingPermission.MANAGE_CONVERSATIONS,
    MessagingPermission.ACCESS_ALL_CONVERSATIONS,
    MessagingPermission.MANAGE_TEMPLATES,
    MessagingPermission.VIEW_ANALYTICS,
    MessagingPermission.URGENT_MESSAGES
  ],
  content_manager: [
    MessagingPermission.VIEW_MESSAGING,
    MessagingPermission.SEND_MESSAGES,
    MessagingPermission.MANAGE_TEMPLATES
  ],
  model: [
    MessagingPermission.VIEW_MESSAGING,
    MessagingPermission.SEND_MESSAGES
  ]
};

// Types pour la messagerie avancée de l'agence
export interface AgencyMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'model' | 'client' | 'agency';
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image' | 'casting_update' | 'booking_confirm' | 'urgent' | 'voice_note' | 'location' | 'contact_card';
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    thumbnail?: string;
  }>;
  reactions?: Array<{
    emoji: string;
    userId: string;
    timestamp: Date;
  }>;
  replyTo?: string;
  forwarded?: boolean;
  edited?: boolean;
  deleted?: boolean;
  metadata?: {
    castingId?: string;
    bookingId?: string;
    modelId?: string;
    clientId?: string;
    deadline?: Date;
    location?: {
      lat: number;
      lng: number;
      address: string;
    };
    contactCard?: {
      name: string;
      phone?: string;
      email?: string;
      company?: string;
      position?: string;
    };
    voiceNote?: {
      url: string;
      duration: number;
      waveform: number[];
      transcribed?: boolean;
    };
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
    permissions: {
      canSendMessages: boolean;
      canAddMembers: boolean;
      canRemoveMembers: boolean;
      canEditInfo: boolean;
      canDeleteMessages: boolean;
    };
  }>;
  lastMessage?: AgencyMessage;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  isMuted: boolean;
  isFavorite: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'active' | 'pending' | 'closed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  metadata?: {
    relatedCasting?: string;
    relatedBooking?: string;
    relatedModel?: string;
    relatedClient?: string;
    deadline?: Date;
    budget?: number;
    location?: string;
    contractStatus?: 'draft' | 'sent' | 'signed' | 'rejected';
    nextAction?: string;
    nextActionDate?: Date;
  };
  settings: {
    autoDelete: number; // en heures, 0 = désactivé
    encryption: 'none' | 'basic' | 'end-to-end';
    allowScreenshots: boolean;
    allowForwarding: boolean;
    requireConfirmation: boolean;
  };
}

export interface AgencyMessagingStats {
  totalConversations: number;
  activeConversations: number;
  unreadMessages: number;
  urgentMessages: number;
  pendingActions: number;
  todayActivity: {
    messagesSent: number;
    messagesReceived: number;
    newConversations: number;
    resolvedConversations: number;
  };
  weeklyTrend: {
    date: string;
    messages: number;
    conversations: number;
  }[];
  typeDistribution: {
    model_chat: number;
    client_discussion: number;
    casting_coordination: number;
    booking_management: number;
    team_communication: number;
  };
  priorityDistribution: {
    urgent: number;
    high: number;
    normal: number;
    low: number;
  };
}

export interface MessagingTemplate {
  id: string;
  name: string;
  category: 'casting' | 'booking' | 'contract' | 'general' | 'urgent';
  content: string;
  variables: Array<{
    name: string;
    type: 'text' | 'date' | 'number' | 'boolean';
    required: boolean;
    defaultValue?: string;
  }>;
  isSystem: boolean;
  createdBy: string;
  createdAt: Date;
  usageCount: number;
}

export interface MessagingAutomation {
  id: string;
  name: string;
  trigger: 'new_booking' | 'casting_confirmed' | 'deadline_approaching' | 'message_received' | 'no_reply';
  conditions: Array<{
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
    value: string | number;
  }>;
  actions: Array<{
    type: 'send_template' | 'assign_to' | 'change_priority' | 'send_notification' | 'create_task';
    parameters: Record<string, any>;
  }>;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  lastTriggered?: Date;
  triggerCount: number;
}

export interface Absence {
  id: string;
  modelId: string;
  modelName: string;
  date: string; // YYYY-MM-DD
  reason: 'Maladie' | 'Personnel' | 'Non justifié' | 'Autre';
  notes?: string;
  isExcused: boolean;
}

// FIX: Replaced Transaction with MonthlyPayment to standardize financial data types.
export interface MonthlyPayment {
  id: string; // e.g., 'modelId-YYYY-MM'
  modelId: string;
  modelName: string;
  month: string; // 'YYYY-MM'
  amount: number;
  paymentDate: string; // YYYY-MM-DD
  method: 'Virement' | 'Espèces' | 'Autre';
  status: 'Payé' | 'En attente' | 'En retard';
  notes?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'Nouveau' | 'Lu' | 'Répondu';
  priority: 'normal' | 'urgent';
}

export interface PhotoshootBrief {
  id: string;
  modelId: string;
  modelName: string;
  theme: string;
  clothingStyle: string;
  accessories: string;
  location: string;
  dateTime: string; // ISO string format for date and time
  createdAt: string; // ISO string format
  status: 'Nouveau' | 'Lu' | 'Archivé';
}

export interface NavLink {
  path: string;
  label: string;
  inFooter: boolean;
  footerLabel?: string;
}

export type FashionDayTicketType = 'VIP' | 'Standard' | 'Table' | 'Autre';
export type FashionDayReservationStatus = 'En attente' | 'Confirmée' | 'Payée' | 'Annulée';

export interface FashionDayReservation {
  id: string;
  submissionDate: string;
  name: string;
  email: string;
  phone: string;
  ticketType: FashionDayTicketType;
  numberOfTickets: number;
  totalAmount: number;
  status: FashionDayReservationStatus;
  paymentMethod?: 'Mobile Money' | 'Virement' | 'Espèces' | 'Carte';
  paymentReference?: string;
  specialRequests?: string;
  edition: number; // Fashion Day edition number
}

