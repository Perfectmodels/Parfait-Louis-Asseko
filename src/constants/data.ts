// FIX: Changed NavLink import to come from types.ts to resolve circular dependency.
import { Model, Service, AchievementCategory, ModelDistinction, Testimonial, ContactInfo, SiteImages, Partner, ApiKeys, CastingApplication, FashionDayApplication, NewsItem, FashionDayEvent, ForumThread, ForumReply, ArticleComment, RecoveryRequest, JuryMember, RegistrationStaff, BookingRequest, ContactMessage, BeginnerStudent, SocialLinks, FAQCategory, Absence, MonthlyPayment, PhotoshootBrief, NavLink, AccountingTransaction, AccountingCategory, AdminUser, AdminPermission, TeamMember, SocialUser, SocialPost, SocialNotification } from '../types';

export const siteConfig = {
  logo: 'https://via.placeholder.com/200x200/D4AF37/FFFFFF?text=PMM',
  name: 'Perfect Models Management',
  description: "L'agence de mannequins de référence à Libreville, Gabon. Perfect Models Management révèle les talents, organise des événements mode d'exception et façonne l'avenir du mannequinat africain."
};

export const navLinks: NavLink[] = [
  { path: '/agence', label: 'Agence', inFooter: true },
  { path: '/mannequins', label: 'Mannequins', inFooter: true },
  { path: '/fashion-day', label: 'PFD', inFooter: true, footerLabel: 'Perfect Fashion Day' },
  { path: '/magazine', label: 'Magazine', inFooter: true },
  { path: '/galerie', label: 'Galerie', inFooter: true },
  { path: '/services', label: 'Services', inFooter: true },
  { path: '/contact', label: 'Contact', inFooter: true },
  { path: '/formations', label: 'Classroom', inFooter: false },
];

export const socialLinks: SocialLinks = {
    facebook: 'https://www.facebook.com/PerfectModels241',
    instagram: 'https://www.instagram.com/perfectmodelsmanagement_/',
    youtube: 'https://www.youtube.com/@perfectmodelsmanagement6013',
};

export const contactInfo: ContactInfo = {
    email: 'contact@perfectmodels.ga',
    phone: '+241 077 00 00 00',
    address: 'Libreville, Gabon',
    notificationEmail: 'contact@perfectmodels.ga',
};

export const siteImages: SiteImages = {
    hero: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelK2wS0Pz/hero-bg.jpg',
    about: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model3WfK9Xg/about-img.jpg',
    fashionDayBg: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelC5rcPJHz/titostyle-53.jpg',
    agencyHistory: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModeljH0YvJg/agency-history.jpg',
    classroomBg: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelTBt9FBSv/AJC-4630.jpg',
    castingBg: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Modelz5TzL2M/casting-bg.jpg',
};

export const apiKeys: ApiKeys = {
    resendApiKey: 're_12345678_abcdefghijklmnopqrstuvwxyz',
    formspreeEndpoint: 'https://formspree.io/f/xovnyqnz',
    firebaseDynamicLinks: {
        webApiKey: "AIzaSyB_jjJEXU7yvJv49aiPCJqEZgiyfJEJzrg",
        domainUriPrefix: 'https://perfectmodels.page.link'
    },
    imgbbApiKey: '59f0176178bae04b1f2cbd7f5bc03614',
};

export const juryMembers: JuryMember[] = [
    { id: 'jury1', name: 'Martelly', username: 'jury1', password: 'password2025' },
    { id: 'jury2', name: 'Darain', username: 'jury2', password: 'password2025' },
    { id: 'jury3', name: 'David', username: 'jury3', password: 'password2025' },
    { id: 'jury4', name: 'Sadia', username: 'jury4', password: 'password2025' },
];

export const registrationStaff: RegistrationStaff[] = [
    { id: 'reg1', name: 'Sephora', username: 'enregistrement1', password: 'password2025' },
    { id: 'reg2', name: 'Aimée', username: 'enregistrement2', password: 'password2025' },
    { id: 'reg3', name: 'Duchesse', username: 'enregistrement3', password: 'password2025' },
    { id: 'reg4', name: 'Sephra', username: 'enregistrement4', password: 'password2025' },
];

export const models: Model[] = [
    {
        id: 'noemi-kim',
        name: 'Noemi Kim',
        username: 'Man-PMMN01',
        password: 'noemi2024',
        email: 'noemi.kim@example.com',
        phone: '+241077000001',
        age: 22,
        height: '1m78',
        gender: 'Femme',
        location: 'Libreville',
        imageUrl: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelmCcD1Gfq/DSC-0272.jpg',
        isPublic: true,
        level: 'Pro',
        portfolioImages: [
            'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Modelz5TzL2M/casting-bg.jpg',
            'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelK2wS0Pz/hero-bg.jpg',
            'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelC5rcPJHz/titostyle-53.jpg',
        ],
        distinctions: [
            { name: "Miss Gabon", titles: ["Lauréate 2022", "1ère Dauphine 2021"] },
            { name: "Top Model Afrique", titles: ["Gagnant Catégorie Homme 2023"] }
        ],
        measurements: { chest: '85cm', waist: '62cm', hips: '90cm', shoeSize: '40' },
        categories: ['Défilé', 'Éditorial', 'Beauté'],
        experience: "Mannequin vedette de l'agence, Noemi a défilé pour les plus grands créateurs gabonais et a été le visage de plusieurs campagnes nationales. Son professionnalisme et sa démarche captivante en font une référence.",
        journey: "Découverte lors d'un casting sauvage, Noemi a rapidement gravi les échelons grâce à sa détermination. Formée au sein de la PMM Classroom, elle incarne aujourd'hui l'excellence et l'ambition de l'agence.",
        quizScores: { 
            'module-1-les-fondamentaux-du-mannequinat': { score: 3, total: 3, timesLeft: 0, timestamp: '2024-07-01T10:00:00Z' }, 
            'module-2-techniques-de-podium-catwalk': { score: 2, total: 2, timesLeft: 0, timestamp: '2024-07-02T10:00:00Z' } 
        },
    },
];

export const testimonials: Testimonial[] = [
    {
        name: 'Franck B.',
        role: 'Créateur de Mode',
        quote: "Collaborer avec Perfect Models Management est un gage de professionnalisme. Leurs mannequins sont non seulement magnifiques mais aussi incroyablement bien formés et ponctuels. Un vrai plaisir.",
        imageUrl: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Models5zW7gZ/testimonial-1.jpg',
    },
];

export const castingApplications: CastingApplication[] = [];
export const fashionDayApplications: FashionDayApplication[] = [];
export const forumThreads: ForumThread[] = [];
export const forumReplies: ForumReply[] = [];
export const articleComments: ArticleComment[] = [];
export const recoveryRequests: RecoveryRequest[] = [];
export const bookingRequests: BookingRequest[] = [];
export const contactMessages: ContactMessage[] = [];
export const absences: Absence[] = [];
export const monthlyPayments: MonthlyPayment[] = [];
export const photoshootBriefs: PhotoshootBrief[] = [];
export const accountingCategories: AccountingCategory[] = [];
export const accountingTransactions: AccountingTransaction[] = [];
export const beginnerStudents: BeginnerStudent[] = [];
export const newsItems: NewsItem[] = [];
export const fashionDayEvents: FashionDayEvent[] = [];
export const agencyTimeline = [];
export const agencyInfo = {};
export const agencyAchievements: AchievementCategory[] = [];
export const agencyPartners: Partner[] = [];
export const faqData: FAQCategory[] = [];
export const defaultAdminPermissions: AdminPermission[] = [];
export const defaultAdminUsers: AdminUser[] = [];
export const defaultAlbums = [];
export const defaultTeamMembers: TeamMember[] = [];
export const defaultSocialUsers: SocialUser[] = [];
export const defaultSocialPosts: SocialPost[] = [];
export const defaultSocialNotifications: SocialNotification[] = [];
export const defaultForumThreads: ForumThread[] = [];

export const modelDistinctions: ModelDistinction[] = [
    { name: 'Miss Gabon', titles: ['Lauréate', '1ère Dauphine', '2ème Dauphine', 'Finaliste'] },
    { name: 'Top Model Afrique', titles: ['Gagnant Catégorie Homme', 'Gagnant Catégorie Femme', 'Finaliste'] },
    { name: 'Elite Model Look', titles: ['Finaliste National', 'Représentant International'] },
    { name: 'Libreville Fashion Week', titles: ["Mannequin de l'année", 'Révélation de l’année'] },
    { name: 'Gabon Fashion Awards', titles: ["Visage de l'Année", "Mannequin Commercial de l'Année", "Meilleur Espoir"] },
    { name: 'PFD Awards (Perfect Fashion Day)', titles: ["Mannequin de l'Édition", "Meilleure Démarche", "Prix de l'Élégance", "Prix de la Photogénie"] },
    { name: 'PMM Awards (Agence)', titles: ["Révélation de l'Année", 'Mannequin le plus Professionnel', 'Meilleure Progression'] },
    { name: 'Reconnaissance Artistique', titles: ['Meilleure Collaboration Photo', 'Couverture Magazine', 'Campagne Publicitaire Majeure'] }
];

export const agencyServices: Service[] = [
  {
    slug: "casting-mannequins",
    title: "Casting Mannequins",
    description: "Organisation de castings professionnels pour défilés, shootings, publicités et clips.",
    details: {
      title: "Avantages du service",
      points: [
        "Sélection rigourouse de mannequins adaptés à votre projet",
        "Gestion complète de la logistique et communication avec les candidats",
        "Accès à notre base de mannequins expérimentés"
      ]
    },
    icon: "UsersIcon",
    buttonText: "Réserver ce service",
    buttonLink: "/contact?service=Casting+Mannequins",
    category: "Services Mannequinat"
  },
];
