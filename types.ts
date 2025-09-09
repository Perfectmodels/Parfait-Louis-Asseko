import React from 'react';

export interface Model {
  id: string;
  name: string; // Nom complet du modèle
  firstName?: string; // Prénom (optionnel, peut être extrait de name si nécessaire)
  lastName?: string;  // Nom de famille (optionnel, peut être extrait de name si nécessaire)
  username: string;
  password: string;
  isPublic?: boolean; // Si le profil du modèle est visible publiquement
  email?: string;
  phone?: string;
  age?: number;
  height: string;
  gender: 'Homme' | 'Femme';
  location?: string;
  imageUrl: string;
  images?: string[]; // Pour les images supplémentaires du modèle
  portfolioImages?: string[];
  distinctions?: ModelDistinction[];
  level?: 'Pro' | 'Débutant';
  category?: string; // Catégorie du modèle (ex: Femme, Homme, Enfant)
  
  // Mesures du modèle
  measurements: {
    chest: string;
    waist: string;
    hips: string;
    shoeSize: string;
    bust?: string; // Ajout de la propriété bust pour la poitrine
  };
  
  // Informations supplémentaires
  categories: string[];
  experience: string;
  journey: string;
  quizScores: { [quizId: string]: number };
  
  // Pour la compatibilité avec l'ancien système
  [key: string]: any;
}

// FIX: Add BeginnerStudent interface to be used by the beginner classroom and admin pages.
export interface BeginnerStudent {
  id: string; // Corresponds to the CastingApplication ID
  name: string;
  matricule: string;
  password: string;
  quizScores: { [moduleSlug: string]: number }; // Score out of 20
}

export interface Stylist {
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
  artists?: string[];
  partners?: { type: string; name: string }[];
  description: string;
}

// Liens vers les réseaux sociaux de l'agence
export interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
}

export interface Service {
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

// Types for Magazine Feature
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


// Types for Classroom feature
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

// Types for Site Settings
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
  
  // From form
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

  // Photo URLs from storage
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
  authorName: string; // "Anonyme" or model name
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

// FIX: Add AIAssistantProps interface to be used by the AI assistant components.
export interface AIAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    onInsertContent: (content: string) => void;
    fieldName: string;
    initialPrompt: string;
    jsonSchema?: any;
}