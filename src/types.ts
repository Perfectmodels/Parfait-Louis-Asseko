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
  level?: 'Mannequin';
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
  paymentStatus?: PaymentStatus;
  adminAccess?: boolean;
}

export interface PaymentStatus {
  isUpToDate?: boolean;
  lastPaymentDate?: string;
  nextDueDate?: string;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  notes?: string;
  warnings?: PaymentWarning[];
  paymentType?: 'cotisation' | 'inscription' | 'avance' | 'cotisation_inscription';
  description?: string;
}

export interface PaymentWarning {
  id: string;
  type: 'overdue' | 'reminder' | 'final_notice';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface PaymentSubmission {
  id: string;
  modelId: string;
  modelName: string;
  amount: number;
  currency: string;
  paymentType: 'cotisation' | 'inscription' | 'avance' | 'cotisation_inscription';
  description: string;
  paymentMethod: string;
  notes: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  approvedAt?: string;
  approvedBy?: string;
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
  paymentStatus?: PaymentStatus;
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
  imageUrl?: string;
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
  // Hero backgrounds for main sections
  servicesHero: string;
  modelsHero: string;
  magazineHero: string;
  galleryHero: string;
  contactHero: string;
  agencyHero: string;
  castingHero: string;
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
  geminiApiKey?: string;
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
  // Nouveaux champs enrichis
  age?: number;
  gender?: 'Homme' | 'Femme';
  location?: string;
  experience?: string;
  portfolioUrl?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  availability?: string;
  motivation?: string;
  previousParticipation?: boolean;
  specialRequirements?: string;
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

// Types pour le système comptable
export interface AccountingTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  category: 'revenue' | 'expense';
  subcategory: string;
  amount: number;
  currency: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'mobile_money' | 'check' | 'other';
  reference?: string; // Numéro de facture, référence, etc.
  notes?: string;
  relatedModelId?: string; // Si lié à un mannequin
  relatedModelName?: string;
  createdBy: string; // Admin qui a créé la transaction
  createdAt: string;
}

export interface AccountingCategory {
  id: string;
  name: string;
  type: 'revenue' | 'expense';
  subcategories: string[];
  description?: string;
}

export interface AccountingBalance {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  currency: string;
  period: string; // YYYY-MM
}

export interface PaymentList {
  id: string;
  title: string;
  type: 'cotisations' | 'inscriptions' | 'custom';
  date: string;
  transactions: AccountingTransaction[];
  totalAmount: number;
  currency: string;
  generatedBy: string;
  generatedAt: string;
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

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  name: string;
  email?: string;
  role: 'admin' | 'manager' | 'staff';
  permissions: AdminPermission[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  createdBy: string;
}

export interface AdminPermission {
  id: string;
  name: string;
  description: string;
  category: 'models' | 'content' | 'accounting' | 'system' | 'reports';
  actions: string[]; // ['read', 'write', 'delete', 'export']
}

export interface Photo {
  id: string;
  url: string;
  title?: string;
  description?: string;
  alt?: string;
  uploadedAt: string;
  uploadedBy: string;
  tags?: string[];
  featured?: boolean;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  theme: string;
  coverImage: string;
  photos: Photo[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isPublic: boolean;
  featured?: boolean;
  tags?: string[];
  location?: string;
  date?: string;
  models?: string[]; // IDs des mannequins présents
  stylists?: string[];
  photographers?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  role: 'founder' | 'director' | 'trainer' | 'stylist' | 'photographer' | 'coordinator' | 'other';
  description: string;
  imageUrl?: string;
  email?: string;
  phone?: string;
  socialLinks?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  isPublic: boolean;
  order: number; // Pour l'ordre d'affichage
  createdAt: string;
  updatedAt: string;
}

export interface ModelActivity {
  id: string;
  modelId: string;
  type: 'login' | 'quiz_completed' | 'payment_submitted' | 'profile_updated' | 'booking_requested' | 'casting_applied' | 'forum_post' | 'classroom_access';
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    quizScore?: number;
    quizChapter?: string;
    paymentAmount?: number;
    bookingDetails?: string;
    castingEvent?: string;
    forumThread?: string;
  };
  isRead: boolean;
}

export interface ModelPerformance {
  modelId: string;
  totalQuizAttempts: number;
  averageQuizScore: number;
  totalLoginDays: number;
  lastLoginDate: string;
  totalBookings: number;
  totalCastings: number;
  forumPosts: number;
  paymentCompliance: number; // Pourcentage de paiements à jour
  overallScore: number; // Score global de performance
  lastUpdated: string;
}

export interface ModelTrackingData {
  modelId: string;
  activities: ModelActivity[];
  performance: ModelPerformance;
  notes: string;
  tags: string[];
  status: 'active' | 'inactive' | 'suspended' | 'graduated';
  lastAdminReview: string;
  nextReviewDate: string;
  createdAt: string;
  updatedAt: string;
}

// Types pour le système social/forum
export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  content: string;
  images?: string[];
  type: 'text' | 'image' | 'video' | 'poll' | 'event';
  category: 'general' | 'tips' | 'inspiration' | 'question' | 'achievement' | 'news';
  tags: string[];
  mentions: string[]; // IDs des utilisateurs mentionnés
  likes: string[]; // IDs des utilisateurs qui ont liké
  shares: string[]; // IDs des utilisateurs qui ont partagé
  comments: SocialComment[];
  isPublic: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  editedAt?: string;
  location?: string;
  mood?: 'happy' | 'excited' | 'grateful' | 'proud' | 'motivated' | 'inspired';
}

export interface SocialComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  content: string;
  likes: string[];
  replies: SocialComment[];
  createdAt: string;
  updatedAt: string;
  editedAt?: string;
  isEdited: boolean;
}

export interface SocialReaction {
  id: string;
  postId: string;
  userId: string;
  type: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
  createdAt: string;
}

export interface SocialShare {
  id: string;
  originalPostId: string;
  sharedBy: string;
  sharedByName: string;
  comment?: string; // Commentaire ajouté lors du partage
  createdAt: string;
}

export interface SocialNotification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'share' | 'mention' | 'follow' | 'achievement';
  title: string;
  message: string;
  relatedPostId?: string;
  relatedUserId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SocialUser {
  id: string;
  name: string;
  username: string;
  imageUrl?: string;
  bio?: string;
  followers: string[];
  following: string[];
  postsCount: number;
  isVerified: boolean;
  isOnline: boolean;
  lastSeen: string;
  badges: string[]; // Badges d'achievement
  privacy: {
    showOnlineStatus: boolean;
    allowMentions: boolean;
    allowDirectMessages: boolean;
  };
}

export interface SocialPoll {
  id: string;
  postId: string;
  question: string;
  options: {
    id: string;
    text: string;
    votes: string[]; // IDs des utilisateurs qui ont voté
  }[];
  allowMultipleVotes: boolean;
  expiresAt?: string;
  totalVotes: number;
  createdAt: string;
}
