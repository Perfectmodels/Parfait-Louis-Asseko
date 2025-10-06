
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

export interface NavLink {
    path: string;
    label: string;
    inFooter: boolean;
    footerLabel?: string;
}

export interface EmailRecipient {
    email: string;
    name?: string;
}

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    htmlContent: string;
    textContent?: string;
    sender: {
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface EmailCampaign {
    id: string;
    name: string;
    subject: string;
    htmlContent: string;
    textContent?: string;
    sender: {
        name: string;
        email: string;
    };
    recipients: EmailRecipient[];
    scheduledAt?: string;
    status: 'draft' | 'scheduled' | 'sent' | 'failed';
    createdAt: string;
    sentAt?: string;
    openRate?: number;
    clickRate?: number;
    messageId?: string;
}

export interface EmailStats {
    totalSent: number;
    totalDelivered: number;
    totalOpened: number;
    totalClicked: number;
    totalBounced: number;
    totalBlocked: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
}

// Types pour le système de paiements
export interface PaymentSubmission {
    id: string;
    submissionDate: string;
    modelId: string;
    modelName: string;
    amount: number;
    type: 'cotisation' | 'inscription';
    method: 'Virement' | 'Espèces' | 'Mobile Money' | 'Autre';
    paymentMethod?: 'full' | 'installments' | 'advance' | 'bank_transfer' | 'mobile_money' | 'cash';
    proofImageUrl?: string;
    notes?: string;
    status: 'En attente' | 'Approuvé' | 'Rejeté';
    processedBy?: string;
    processedAt?: string;
    // Nouvelles propriétés pour les paiements avancés
    installmentCount?: number;
    advanceMonths?: number;
    totalAmount?: number;
    remainingAmount?: number;
    nextPaymentDate?: string;
    createdAt?: string;
}

export interface AccountingTransaction {
    id: string;
    date: string;
    type: 'revenu' | 'depense';
    category: string;
    description: string;
    amount: number;
    paymentMethod: string;
    reference?: string;
    notes?: string;
    createdBy: string;
    createdAt: string;
}

// Types pour la messagerie interne
export interface InternalMessage {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    senderRole: 'admin' | 'model' | 'beginner';
    recipientId: string;
    recipientName: string;
    recipientRole: 'admin' | 'model' | 'beginner';
    content: string;
    timestamp: string;
    isRead: boolean;
    messageType: 'text' | 'image' | 'file';
    replyTo?: string;
}

export interface Conversation {
    id: string;
    participant: {
        id: string;
        name: string;
        role: 'model' | 'beginner';
        imageUrl?: string;
    };
    lastMessage?: InternalMessage;
    unreadCount: number;
    updatedAt: string;
}

// Types pour la galerie
export interface Album {
    id: string;
    title: string;
    description?: string;
    coverImage: string;
    images: string[];
    category: 'mannequins' | 'evenements' | 'fashion-day' | 'casting' | 'formations' | 'agence';
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

// Types pour l'équipe
export interface TeamMember {
    id: string;
    name: string;
    role: string;
    position: string;
    bio: string;
    imageUrl: string;
    email?: string;
    phone?: string;
    socialLinks?: {
        linkedin?: string;
        instagram?: string;
        facebook?: string;
    };
    order: number;
    isActive: boolean;
}

// Types pour les rapports
export interface FinancialReport {
    id: string;
    title: string;
    period: {
        start: string;
        end: string;
    };
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    transactions: AccountingTransaction[];
    generatedAt: string;
    generatedBy: string;
}

// Types pour les notifications
export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    createdAt: string;
    actionUrl?: string;
}

export interface AbsenceRequest {
    id: string;
    modelId: string;
    modelName: string;
    date: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    documents?: string[];
    adminNotes?: string;
}

export interface PhotoSession {
    id: string;
    title: string;
    theme: string;
    description: string;
    assignedModels: string[];
    date: string;
    location: string;
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
    requirements: string[];
    createdBy: string;
    createdAt: string;
}

// Interface principale pour les données de l'application
export interface AppData {
    // Données de base
    models: Model[];
    beginnerStudents: BeginnerStudent[];
    juryMembers: any[];
    registrationStaff: any[];
    
    // Applications et candidatures
    castingApplications: CastingApplication[];
    fashionDayApplications: FashionDayApplication[];
    recoveryRequests: RecoveryRequest[];
    bookingRequests: any[];
    contactMessages: any[];
    
    // Contenu et médias
    articles: any[];
    newsItems: any[];
    testimonials: any[];
    agencyServices: any[];
    fashionDayEvents: any[];
    faqData: any[];
    siteImages: Record<string, string>;
    
    // Configuration du site
    siteConfig: any;
    navLinks: NavLink[];
    socialLinks: SocialLinks;
    contactInfo: any;
    agencyInfo: any;
    modelDistinctions: any[];
    agencyTimeline: any[];
    agencyAchievements: any[];
    agencyPartners: any[];
    
    // Système de messagerie
    internalMessages: InternalMessage[];
    conversations: Conversation[];
    
    // Système de paiement
    paymentSubmissions: PaymentSubmission[];
    accountingTransactions: AccountingTransaction[];
    monthlyPayments: any[];
    
    // Gestion des médias
    albums: Album[];
    teamMembers: TeamMember[];
    mediaItems: any[];
    
    // Rapports et notifications
    financialReports: FinancialReport[];
    notifications: Notification[];
    
    // Gestion du contenu
    pageContents: PageContent[];
    contentPages: any[];
    
    // Gestion des utilisateurs
    users: any[];
    technicalSettings: any[];
    
    // Système d'emails
    emailTemplates: EmailTemplate[];
    emailCampaigns: EmailCampaign[];
    emailStats: EmailStats;
    sentEmails: any[];
    receivedEmails: any[];
    
    // Gestion des absences et sessions
    absenceRequests: AbsenceRequest[];
    photoSessions: PhotoSession[];
    castingSessions: CastingSession[];
    
    // Données de cours
    courseData: any[];
    beginnerCourseData: any[];
    trainingModules: any[];
    
    // Clés API
    apiKeys: any;
}

export interface PageContent {
    id: string;
    page: string;
    slug: string;
    title: string;
    content: string;
    metaDescription: string;
    featuredImage: string;
    isPublished: boolean;
    lastModified: string;
    modifiedBy: string;
}

export interface CastingSession {
    id: string;
    title: string;
    status: 'scheduled' | 'live' | 'ended';
    startTime: string;
    endTime?: string;
    participants: string[];
    currentParticipant?: string;
    notes: string;
    createdAt: string;
}