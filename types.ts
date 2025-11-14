
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

// FIX: Removed BeginnerStudent interface as the feature is deprecated.

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
  // Nouveaux champs pour magazine avancé
  status?: 'draft' | 'review' | 'published' | 'archived';
  publishedAt?: string;
  scheduledAt?: string;
  authorId?: string;
  editorId?: string;
  reviewerId?: string;
  featuredModels?: string[];
  editorialTheme?: string;
  season?: string;
  estimatedReadTime?: number;
  seoTitle?: string;
  seoDescription?: string;
  socialMediaImage?: string;
  priority?: 'low' | 'medium' | 'high';
  language?: 'fr' | 'en';
  translationOf?: string;
  gallery?: string[];
  videoUrl?: string;
  relatedArticles?: string[];
  sponsoredContent?: boolean;
  sponsorName?: string;
  callToAction?: {
    text: string;
    link: string;
    type: 'primary' | 'secondary';
  };
}

// Types pour la gestion des utilisateurs du magazine
export interface MagazineUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: MagazineRole;
  avatar?: string;
  bio?: string;
  specializations?: string[];
  isActive: boolean;
  permissions: MagazinePermission[];
  createdAt: string;
  lastLoginAt?: string;
  articlesCount: number;
  publishedArticlesCount: number;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
}

export type MagazineRole = 
  | 'editor-in-chief'
  | 'senior-editor'
  | 'editor'
  | 'junior-editor'
  | 'photographer'
  | 'journalist'
  | 'contributor'
  | 'translator'
  | 'social-media-manager';

export type MagazinePermission = 
  | 'create-article'
  | 'edit-own-article'
  | 'edit-any-article'
  | 'publish-article'
  | 'schedule-article'
  | 'delete-article'
  | 'manage-users'
  | 'approve-article'
  | 'feature-article'
  | 'manage-calendar'
  | 'access-analytics'
  | 'manage-gallery'
  | 'translate-article';

// Types pour le calendrier éditorial
export interface EditorialCalendar {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'in-progress' | 'completed' | 'cancelled';
  articles: string[]; // article slugs
  assignedUsers: string[]; // user ids
  theme: string;
  season: string;
  priority: 'low' | 'medium' | 'high';
  budget?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Types pour les campagnes de promotion
export interface PromotionCampaign {
  id: string;
  name: string;
  description: string;
  type: 'magazine-issue' | 'collection-launch' | 'model-feature' | 'event-promotion';
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  targetAudience: string[];
  featuredModels: string[]; // model ids
  featuredArticles: string[]; // article slugs
  socialMediaPosts: SocialMediaPost[];
  budget?: number;
  metrics: {
    reach: number;
    engagement: number;
    clicks: number;
    conversions: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SocialMediaPost {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok';
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  scheduledAt?: string;
  publishedAt?: string;
  status: 'draft' | 'scheduled' | 'published';
  metrics?: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
  };
}

// Types pour les galeries de photos
export interface PhotoGallery {
  id: string;
  title: string;
  description?: string;
  category: 'editorial' | 'behind-scenes' | 'runway' | 'portrait' | 'campaign';
  photographer?: string;
  models: string[]; // model ids
  images: GalleryImage[];
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  tags?: string[];
  featuredModel?: string; // model id
  metadata?: {
    camera?: string;
    lens?: string;
    settings?: string;
    location?: string;
    date?: string;
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
  role?: string;
  imageUrl?: string;
  id?: string;
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

// FIX: Added MonthlyPayment interface to standardize financial data types.
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
