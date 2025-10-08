/* Types file: no React usage required */

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
    // Ancien schéma
    name?: string;
    titles?: string[];
    // Nouveau schéma (utilisé par AdminDistinctions)
    title?: string;
    year?: number;
    category?: 'international' | 'national' | 'regional' | 'special' | string;
    description?: string;
    icon?: string;
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

// FIX: Added NavLink interface to centralize type definitions and resolve circular dependencies.
export interface NavLink {
    path: string;
    label: string;
    inFooter: boolean;
    footerLabel?: string;
}

// ===== NOUVEAUX TYPES POUR FONCTIONNALITÉS AVANCÉES =====

// Analytics & KPIs
export interface DashboardKPI {
  title: string;
  value: number | string;
  change?: number; // Pourcentage de changement
  trend?: 'up' | 'down' | 'stable';
  icon?: string;
  color?: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

// Calendrier & Planning
export interface CalendarEvent {
  id: string;
  title: string;
  type: 'casting' | 'fashion-day' | 'photoshoot' | 'formation' | 'meeting' | 'absence' | 'other';
  startDate: string; // ISO format
  endDate: string; // ISO format
  allDay?: boolean;
  location?: string;
  description?: string;
  participants?: string[]; // IDs des mannequins/staff
  color?: string;
  status?: 'planned' | 'confirmed' | 'completed' | 'cancelled';
  relatedId?: string; // ID lié (casting, event, etc.)
}

// CRM & Clients
export interface Client {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  address?: string;
  type: 'Agency' | 'Brand' | 'Photographer' | 'Individual' | 'Other';
  status: 'Active' | 'Inactive' | 'VIP';
  tags?: string[];
  notes?: string;
  createdAt: string;
  lastContactDate?: string;
  totalRevenue?: number;
  projectCount?: number;
  contacts?: ClientContact[];
}

export interface ClientContact {
  id: string;
  date: string;
  type: 'Email' | 'Phone' | 'Meeting' | 'Other';
  subject: string;
  notes: string;
  userId: string; // Admin qui a fait le contact
}

export interface Project {
  id: string;
  clientId: string;
  title: string;
  description: string;
  type: 'Photoshoot' | 'Fashion Show' | 'Commercial' | 'Editorial' | 'Other';
  status: 'Proposal' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  startDate: string;
  endDate?: string;
  budget?: number;
  actualCost?: number;
  assignedModels?: string[]; // IDs des mannequins
  notes?: string;
  createdAt: string;
}

// Contrats
export interface ContractTemplate {
  id: string;
  name: string;
  type: 'Model' | 'Client' | 'Photographer' | 'Stylist' | 'Other';
  content: string; // HTML/Markdown du template
  variables: string[]; // Variables à remplacer (ex: {modelName}, {date})
  createdAt: string;
  updatedAt: string;
}

export interface Contract {
  id: string;
  templateId?: string;
  title: string;
  type: 'Model' | 'Client' | 'Photographer' | 'Stylist' | 'Other';
  parties: {
    partyA: { name: string; role: string; signature?: string; signedAt?: string };
    partyB: { name: string; role: string; signature?: string; signedAt?: string };
  };
  content: string;
  startDate: string;
  endDate?: string;
  value?: number;
  status: 'Draft' | 'Pending' | 'Signed' | 'Active' | 'Expired' | 'Terminated';
  signedDocument?: string; // URL du document signé
  createdAt: string;
  updatedAt: string;
  relatedEntityId?: string; // ID du mannequin/client concerné
}

// Notifications
export interface Notification {
  id: string;
  userId: string; // Destinataire
  type: 'info' | 'success' | 'warning' | 'error' | 'casting' | 'payment' | 'event' | 'message';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
  expiresAt?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface PushSubscription {
  id: string;
  userId: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdAt: string;
}

// Newsletter & Marketing
export interface Newsletter {
  id: string;
  subject: string;
  content: string; // HTML
  recipientType: 'all' | 'models' | 'clients' | 'subscribers' | 'custom';
  recipientIds?: string[]; // Pour custom
  status: 'draft' | 'scheduled' | 'sent';
  scheduledFor?: string;
  sentAt?: string;
  attachments?: {
    filename: string;
    mimeType: string;
    base64: string; // base64 (sans préfixe data:)
    size: number;
  }[];
  stats?: {
    sent: number;
    opened: number;
    clicked: number;
    bounced: number;
  };
  createdAt: string;
  createdBy: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string; // HTML
  type: 'welcome' | 'casting-acceptance' | 'payment-reminder' | 'newsletter' | 'custom';
  variables: string[];
  createdAt: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'sms' | 'mixed';
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  budget?: number;
  targetAudience: string;
  goals?: string;
  metrics?: {
    reach: number;
    engagement: number;
    conversions: number;
    roi?: number;
  };
  createdAt: string;
}

// Social Media
export interface SocialPost {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok';
  content: string;
  mediaUrls?: string[];
  scheduledFor?: string;
  publishedAt?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  hashtags?: string[];
  mentions?: string[];
  stats?: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
  createdBy: string;
}

// Certifications & Évaluations
export interface Certification {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  badgeImageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ModelCertification {
  id: string;
  modelId: string;
  certificationId: string;
  obtainedAt: string;
  expiresAt?: string;
  certificateUrl?: string;
  score?: number;
}

export interface ModelEvaluation {
  id: string;
  modelId: string;
  modelName: string;
  projectId?: string;
  evaluatorId: string;
  evaluatorName: string;
  date: string;
  type: 'project' | 'training' | 'casting' | 'general';
  criteria: {
    professionalism: number; // 1-5
    punctuality: number;
    performance: number;
    attitude: number;
    appearance: number;
  };
  overallScore: number;
  strengths?: string;
  improvements?: string;
  comments?: string;
}

export interface ClientFeedback {
  id: string;
  clientId: string;
  projectId: string;
  modelIds: string[];
  rating: number; // 1-5
  feedback: string;
  date: string;
  wouldRecommend: boolean;
}

// Gestion de Paie Avancée
export interface PayrollPeriod {
  id: string;
  period: string; // 'YYYY-MM'
  startDate: string;
  endDate: string;
  status: 'open' | 'processing' | 'approved' | 'paid' | 'closed';
  totalAmount: number;
  processedBy?: string;
  processedAt?: string;
  notes?: string;
}

export interface ModelPayslip {
  id: string;
  modelId: string;
  modelName: string;
  period: string; // 'YYYY-MM'
  baseAmount: number;
  projectEarnings: ProjectEarning[];
  bonuses?: { description: string; amount: number }[];
  deductions?: { description: string; amount: number }[];
  commission: number; // % ou montant fixe
  totalGross: number;
  totalNet: number;
  paymentDate?: string;
  paymentMethod?: string;
  status: 'pending' | 'approved' | 'paid';
  pdfUrl?: string;
  createdAt: string;
}

export interface ProjectEarning {
  projectId: string;
  projectName: string;
  date: string;
  amount: number;
  hours?: number;
  rate?: number;
}

export interface Commission {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  appliesTo: 'all' | 'category' | 'model';
  categoryOrModelId?: string;
  isActive: boolean;
}

// Audit & Logs
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string; // 'model', 'article', 'payment', etc.
  entityId?: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  severity?: 'info' | 'warning' | 'critical';
}

export interface LoginLog {
  id: string;
  userId: string;
  userName: string;
  success: boolean;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  failureReason?: string;
}

// Droits d'image
export interface ImageRights {
  id: string;
  modelId: string;
  modelName: string;
  consentGiven: boolean;
  consentDate?: string;
  expiryDate?: string;
  restrictions?: string[];
  allowedUses: ('editorial' | 'commercial' | 'social-media' | 'portfolio' | 'all')[];
  signatureUrl?: string;
  documentUrl?: string;
  status: 'active' | 'expired' | 'revoked';
  notes?: string;
}

// Portfolio Management
export interface PortfolioCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
}

export interface PortfolioImage {
  id: string;
  modelId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  categories: string[];
  tags?: string[];
  photographer?: string;
  shootDate?: string;
  location?: string;
  isFeatured: boolean;
  isPublic: boolean;
  order: number;
  uploadedAt: string;
  metadata?: {
    width: number;
    height: number;
    size: number;
    format: string;
  };
}

export interface CompCard {
  id: string;
  modelId: string;
  templateId: string;
  images: string[];
  info: {
    name: string;
    measurements: string;
    contact: string;
  };
  generatedUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Matching & Recommendations
export interface CastingMatch {
  castingId: string;
  modelId: string;
  matchScore: number; // 0-100
  reasons: string[];
  criteria: {
    heightMatch: boolean;
    genderMatch: boolean;
    categoryMatch: boolean;
    availabilityMatch: boolean;
    experienceMatch: boolean;
  };
  recommended: boolean;
}

// Trésorerie
export interface CashFlow {
  id: string;
  period: string; // 'YYYY-MM'
  openingBalance: number;
  totalIncome: number;
  totalExpenses: number;
  closingBalance: number;
  projectedIncome?: number;
  projectedExpenses?: number;
  notes?: string;
}

export interface FinancialAlert {
  id: string;
  type: 'overdue-payment' | 'low-cash' | 'high-expense' | 'unpaid-invoice';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  relatedEntityId?: string;
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}