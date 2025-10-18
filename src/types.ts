import React from 'react';

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

export interface BeginnerStudent {
  id: string; 
  name: string;
  matricule: string;
  password: string;
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
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
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
  storachaApiKey?: string;
  ddownloadApiKey?: string;
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

export interface ContactMessage {
  id: string;
  submissionDate: string;
  status: 'Nouveau' | 'Lu' | 'Archivé';
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ================== INTERNAL MESSAGING ==================
export type UserKind = 'admin' | 'model' | 'beginner' | 'jury' | 'registration';

export interface InternalAttachment {
  filename: string;
  contentType: string;
  contentBase64?: string; // used for email sending; avoid very large payloads
  url?: string; // optional URL if uploaded elsewhere
}

export interface InternalParticipant {
  kind: UserKind;
  id: string;
  name: string;
  email?: string;
}

export interface InternalMessage {
  id: string;
  createdAt: string;
  from: InternalParticipant;
  to: InternalParticipant[]; // support multi-recipient
  subject: string;
  body: string;
  attachments?: InternalAttachment[];
  readBy?: string[]; // user ids who read
}

// ================== GALLERY ==================
export interface GalleryItem {
  id: string;
  url: string;
  title?: string;
  category?: string;
  createdAt: string;
  order?: number;
}

export type GalleryAlbumCategory = 'Défilé' | 'Shooting' | 'Collaboration' | 'Autre';

export interface GalleryAlbum {
  id: string;
  title: string;
  description?: string;
  category?: GalleryAlbumCategory | string;
  coverUrl?: string;
  images: string[];
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

// ================== ADMIN PLATFORM EXTENSIONS ==================
export interface FeatureFlags {
  globalSearch: boolean;
  notificationsCenter: boolean;
  auditLog: boolean;
  reports: boolean;
  calendar: boolean;
}

export type AuditLogAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'PUBLISH'
  | 'APPROVE'
  | 'REJECT'
  | 'PAYMENT_RECORD'
  | 'BOOKING_STATUS_CHANGE';

export interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO date
  actor: {
    id: string;
    name: string;
    role: AdminRole | 'System';
  };
  action: AuditLogAction;
  entity: {
    type: string; // e.g., 'Model', 'Article', 'Booking', 'Message'
    id?: string;
    name?: string;
  };
  details?: string;
}

export interface AIAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    onInsertContent: (content: string) => void;
    fieldName: string;
    initialPrompt: string;
    jsonSchema?: any;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  category: string;
  items: FAQItem[];
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

export type PaymentCategory =
  | 'Cotisation mensuelle'
  | "Frais d'inscription"
  | 'Cotisation + Inscription'
  | 'Avance cotisation'
  | 'Autre';

export interface MonthlyPayment {
  id: string; // e.g., 'payment-<timestamp>'
  modelId: string;
  modelName: string;
  month: string; // 'YYYY-MM'
  amount: number;
  paymentDate: string; // ISO date or datetime (YYYY-MM-DD or YYYY-MM-DDTHH:mm)
  method: 'Virement' | 'Espèces' | 'Autre';
  status: 'Payé' | 'En attente' | 'En retard';
  category?: PaymentCategory; // nature du paiement
  notes?: string;
}

export type AccountingEntryKind = 'income' | 'expense';

export interface AccountingEntry {
  id: string;
  kind: AccountingEntryKind; // income or expense
  category: string; // e.g., Commission, Collaboration, Location, Marketing, Autre
  label: string; // short description
  amount: number;
  dateTime: string; // ISO datetime
  method?: 'Virement' | 'Espèces' | 'Autre';
  relatedModelId?: string;
  relatedModelName?: string;
  notes?: string;
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

// ================== ADMIN & PERMISSIONS ==================
export type AdminRole = 'SuperAdmin' | 'Formations' | 'Marketing' | 'Communication' | 'Discipline';

export interface AdminPermissions {
  canEditContent: boolean;
  canPublishContent: boolean;
  canManageModels: boolean;
  canManagePayments: boolean;
  canModerateComments: boolean;
  canManageAdmins: boolean;
}

export interface AdminDeputy {
  id: string; // generated id for deputy
  name: string;
  email?: string;
  phone?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  password: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  role: AdminRole;
  permissions: AdminPermissions;
  deputies?: AdminDeputy[];
  active?: boolean;
}
