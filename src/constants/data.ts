// FIX: Changed NavLink import to come from types.ts to resolve circular dependency.
import { Model, Service, AchievementCategory, ModelDistinction, Testimonial, ContactInfo, SiteImages, Partner, ApiKeys, CastingApplication, FashionDayApplication, NewsItem, FashionDayEvent, ForumThread, ForumReply, ArticleComment, RecoveryRequest, JuryMember, RegistrationStaff, BookingRequest, ContactMessage, BeginnerStudent, SocialLinks, FAQCategory, Absence, MonthlyPayment, PhotoshootBrief, NavLink, AccountingTransaction, AccountingCategory, AdminUser, AdminPermission, TeamMember, SocialUser, SocialPost, SocialNotification } from '../types';

export const siteConfig = {
  logo: 'https://via.placeholder.com/200x200/D4AF37/FFFFFF?text=PMM',
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
    // Hero backgrounds for main sections
    servicesHero: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelK2wS0Pz/hero-bg.jpg',
    modelsHero: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model3WfK9Xg/about-img.jpg',
    magazineHero: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelC5rcPJHz/titostyle-53.jpg',
    galleryHero: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModeljH0YvJg/agency-history.jpg',
    contactHero: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelTBt9FBSv/AJC-4630.jpg',
    agencyHero: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Modelz5TzL2M/casting-bg.jpg',
    castingHero: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelK2wS0Pz/hero-bg.jpg',
};

export const apiKeys: ApiKeys = {
    resendApiKey: 're_12345678_abcdefghijklmnopqrstuvwxyz',
    formspreeEndpoint: 'https://formspree.io/f/xovnyqnz',
    firebaseDynamicLinks: {
        webApiKey: "AIzaSyB_jjJEXU7yvJv49aiPCJqEZgiyfJEJzrg",
        domainUriPrefix: 'https://perfectmodels.page.link'
    },
    imgbbApiKey: '59f0176178bae04b1f2cbd7f5bc03614',
    geminiApiKey: 'AIzaSyCEVGrbdck61n5l0kl5uGMUwiolTfl1yM4',
    brevoApiKey: process.env.VITE_BREVO_API_KEY || '',
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
        level: 'Mannequin',
        email: 'noemi.kim@example.com',
        phone: '+241077000001',
        age: 22,
        height: '1m78',
        gender: 'Femme',
        location: 'Libreville',
        imageUrl: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelmCcD1Gfq/DSC-0272.jpg',
        isPublic: true,
        portfolioImages: [
            'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Modelz5TzL2M/casting-bg.jpg',
            'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelK2wS0Pz/hero-bg.jpg',
            'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelC5rcPJHz/titostyle-53.jpg',
        ],
        distinctions: [
            { name: "Palmarès National & International", titles: ["Miss Gabon 2022", "Top Model Afrique Centrale 2023"] }
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
    {
        id: 'aj-caramela',
        name: 'AJ Caramela',
        username: 'Man-PMMA01',
        password: 'caramela2024',
        level: 'Mannequin',
        height: '1m75',
        gender: 'Femme',
        imageUrl: 'https://i.postimg.cc/k5skXhC2/NR-09474.jpg',
        isPublic: true,
        portfolioImages: [
            'https://i.postimg.cc/Xv24Dvp1/NR-09484.jpg',
            'https://i.postimg.cc/59Qbnb1p/NR-09503-Modifier.jpg',
            'https://i.postimg.cc/k5skXhC2/NR-09474.jpg',
        ],
        distinctions: [
            { name: "Reconnaissance Artistique", titles: ["Visage de l'Année - Gabon Fashion Awards 2023", "Meilleure Collaboration Photo avec NR Picture"] }
        ],
        measurements: { chest: '82cm', waist: '60cm', hips: '88cm', shoeSize: '39' },
        categories: ['Défilé', 'Commercial', 'Éditorial'],
        experience: "Avec son regard perçant et sa polyvalence, AJ excelle dans les shootings éditoriaux et les campagnes publicitaires. Elle a collaboré avec de nombreuses marques locales et photographes de renom.",
        journey: "AJ a rejoint PMM avec une passion pour la photographie. Son aisance devant l'objectif et sa capacité à se transformer lui ont rapidement ouvert les portes des projets les plus créatifs.",
        quizScores: { 
            'module-1-les-fondamentaux-du-mannequinat': { score: 3, total: 3, timesLeft: 1, timestamp: '2024-07-03T10:00:00Z' }, 
            'module-3-photographie-et-expression-corporelle': { score: 2, total: 2, timesLeft: 0, timestamp: '2024-07-04T10:00:00Z' } 
        },
    },
    {
        id: 'yann-aubin',
        name: 'Yann Aubin',
        username: 'Man-PMMY01',
        password: 'yann2024',
        level: 'Mannequin',
        height: '1m88',
        gender: 'Homme',
        imageUrl: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelRk1fG3ph/farelmd-37.jpg',
        isPublic: true,
        portfolioImages: [
             'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelTBt9FBSv/AJC-4630.jpg',
        ],
        distinctions: [
            { name: "Podiums Masculins", titles: ["Mannequin Homme de l'Année - PFD Awards 2025", "Prix de l'Élégance Masculine - Libreville Fashion Week"] }
        ],
        measurements: { chest: '98cm', waist: '78cm', hips: '95cm', shoeSize: '44' },
        categories: ['Défilé', 'Costume', 'Sportswear'],
        experience: "Spécialiste du prêt-à-porter masculin, Yann est reconnu pour sa démarche puissante et son élégance naturelle. Il est un choix privilégié pour les défilés de créateurs de costumes.",
        journey: "Ancien athlète, Yann a apporté sa discipline et sa prestance au monde du mannequinat. Il s'est rapidement imposé comme une figure incontournable de la mode masculine au Gabon.",
        quizScores: { 
            'module-2-techniques-de-podium-catwalk': { score: 2, total: 2, timesLeft: 0, timestamp: '2024-07-05T10:00:00Z' } 
        },
    },
    {
        id: 'dorcas-saphou',
        name: 'Dorcas SAPHOU',
        username: 'Man-PMMD01',
        password: 'dorcas2024',
        level: 'Mannequin',
        email: 'dorcas.saphou@example.com',
        phone: '+241077000004',
        age: 24,
        height: '1m76',
        gender: 'Femme',
        location: 'Libreville',
        imageUrl: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelmCcD1Gfq/DSC-0272.jpg',
        isPublic: true,
        portfolioImages: [
            'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Modelz5TzL2M/casting-bg.jpg',
            'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelK2wS0Pz/hero-bg.jpg',
            'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelC5rcPJHz/titostyle-53.jpg',
        ],
        distinctions: [
            { name: "Nouvelle Révélation", titles: ["Découverte de l'Année - PMM 2024", "Meilleure Débutante - Fashion Week Libreville"] }
        ],
        measurements: { chest: '84cm', waist: '61cm', hips: '89cm', shoeSize: '39' },
        categories: ['Défilé', 'Éditorial', 'Beauté'],
        experience: "Dorcas est une nouvelle recrue prometteuse de l'agence. Avec son charisme naturel et sa détermination, elle s'impose rapidement comme un talent à suivre dans l'univers de la mode gabonaise.",
        journey: "Découverte lors d'un casting organisé par l'agence, Dorcas a immédiatement séduit par son potentiel et sa personnalité. Elle suit actuellement une formation intensive pour perfectionner ses techniques.",
        quizScores: { 
            'module-1-les-fondamentaux-du-mannequinat': { score: 2, total: 3, timesLeft: 1, timestamp: '2024-07-07T10:00:00Z' } 
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
    {
        name: 'Nadia K.',
        role: 'Directrice Artistique',
        quote: "L'agence a un œil incroyable pour dénicher des talents uniques. Leur catalogue est diversifié et répond perfectly aux besoins créatifs de nos campagnes publicitaires.",
        imageUrl: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Modely4x9Y8X/testimonial-2.jpg',
    },
    {
        name: 'Noemi Kim',
        role: 'Mannequin de l\'agence',
        quote: "PMM est bien plus qu'une agence, c'est une famille qui nous pousse à donner le meilleur de nous-mêmes. La formation et l'encadrement sont exceptionnels.",
        imageUrl: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelmCcD1Gfq/DSC-0272.jpg',
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

// Données comptables initiales
export const accountingCategories: AccountingCategory[] = [
    {
        id: 'cat-revenue-1',
        name: 'Cotisations mensuelles',
        type: 'revenue',
        subcategories: ['Cotisations mensuelles', 'Paiements en avance'],
        description: 'Revenus provenant des cotisations mensuelles des mannequins'
    },
    {
        id: 'cat-revenue-2',
        name: 'Frais d\'inscription',
        type: 'revenue',
        subcategories: ['Frais d\'inscription', 'Cotisations + Inscriptions'],
        description: 'Revenus provenant des frais d\'inscription'
    },
    {
        id: 'cat-revenue-3',
        name: 'Services clients',
        type: 'revenue',
        subcategories: ['Séances photo', 'Événements', 'Défilés', 'Formations'],
        description: 'Revenus provenant des services rendus aux clients'
    },
    {
        id: 'cat-expense-1',
        name: 'Salaires et charges',
        type: 'expense',
        subcategories: ['Salaires équipe', 'Charges sociales', 'Formations équipe'],
        description: 'Dépenses liées aux ressources humaines'
    },
    {
        id: 'cat-expense-2',
        name: 'Fonctionnement',
        type: 'expense',
        subcategories: ['Loyer', 'Électricité', 'Internet', 'Téléphone', 'Fournitures'],
        description: 'Dépenses de fonctionnement quotidien'
    },
    {
        id: 'cat-expense-3',
        name: 'Marketing et communication',
        type: 'expense',
        subcategories: ['Publicité', 'Photos', 'Site web', 'Réseaux sociaux'],
        description: 'Dépenses de marketing et communication'
    },
    {
        id: 'cat-expense-4',
        name: 'Équipement et matériel',
        type: 'expense',
        subcategories: ['Caméras', 'Éclairage', 'Accessoires', 'Ordinateurs'],
        description: 'Dépenses d\'équipement et de matériel'
    }
];

export const accountingTransactions: AccountingTransaction[] = [];
export const beginnerStudents: BeginnerStudent[] = [
    {
        id: 'casting-1720000000001',
        name: "Alicia Dubois",
        matricule: "DEB-2025-001",
        password: "alicia2025",
        email: "alicia.dubois@email.com",
        phone: "+241 01 23 45 67",
        city: "Libreville",
        instagram: "@alicia_dubois",
        quizScores: {},
        lastLogin: new Date().toISOString(),
        lastActivity: new Date().toISOString()
    },
    {
        id: 'casting-1720000000002',
        name: "Jordan Lefebvre",
        matricule: "DEB-2025-002",
        password: "jordan2025",
        email: "jordan.lefebvre@email.com",
        phone: "+241 02 34 56 78",
        city: "Libreville",
        instagram: "@jordan_lefebvre",
        quizScores: { 
            'module-1-decouverte-du-mannequinat': { score: 2, total: 3, timesLeft: 0, timestamp: '2024-07-06T10:00:00Z' } 
        },
        lastLogin: new Date().toISOString(),
        lastActivity: new Date().toISOString()
    },
    {
        id: 'casting-1720000000003',
        name: "Chloé Moreau",
        matricule: "DEB-2025-003",
        password: "chloe2025",
        email: "chloe.moreau@email.com",
        phone: "+241 03 45 67 89",
        city: "Libreville",
        instagram: "@chloe_moreau",
        quizScores: {},
        lastLogin: new Date().toISOString(),
        lastActivity: new Date().toISOString()
    },
    {
        id: 'casting-1720000000004',
        name: "Lucas Girard",
        matricule: "DEB-2025-004",
        password: "lucas2025",
        email: "lucas.girard@email.com",
        phone: "+241 04 56 78 90",
        city: "Libreville",
        instagram: "@lucas_girard",
        quizScores: {},
        lastLogin: new Date().toISOString(),
        lastActivity: new Date().toISOString()
    }
];


export const newsItems: NewsItem[] = [
    { id: '1', title: "Grand Casting Annuel", date: '2025-09-06', imageUrl: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Modelz5TzL2M/casting-bg.jpg', excerpt: "Nous recherchons les prochains visages de la mode. Préparez-vous pour notre grand casting national.", link: '/casting-formulaire' },
    { id: '2', title: "Perfect Fashion Day Édition 2", date: '2026-01-31', imageUrl: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelZpc4WJVF/L-art-de-se-reveler-080-Z.png', excerpt: "La seconde édition de notre événement mode phare approche à grands pas. Découvrez le thème et les créateurs.", link: '/fashion-day' },
    { id: '3', title: "Nouveaux Talents 2024", date: '2024-08-15', imageUrl: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model3WfK9Xg/about-img.jpg', excerpt: "L'agence est fière d'accueillir trois nouveaux mannequins prometteurs dans ses rangs.", link: '/mannequins' },
];

export const fashionDayEvents: FashionDayEvent[] = [
    {
      edition: 1,
      date: "2025-01-25T18:00:00",
      theme: "Racines et Modernité",
      location: "La Gare du Nord – Hôtel Restaurant Bar Casino, Carrefour Acaé",
      imageUrl: "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model35tKdsRr/482986573-631604006390611-5475849692479591284-n.jpg",
      promoter: "Parfait Asseko",
      description: "La 1ère Édition de la Perfect Fashion Day a tenu toutes ses promesses en réunissant mode, art, culture et professionnalisme. Le thème « Racines et Modernité » a permis d'explorer la richesse de la culture gabonaise tout en ouvrant un dialogue avec les tendances contemporaines, posant ainsi les bases solides d'un événement de référence pour la mode gabonaise.",
      stylists: [
        {
          name: "AG Style",
          description: "Un mélange parfait de tradition et de modernité.",
          images: [
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelGfxgf00z/agstyle-42.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model4g4x6Dkp/agstyle-41.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model0y7Pqv9y/agstyle-36.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Modelyc5kxJKT/agstyle-33.jpg",
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model8DTp4Qqy/agstyle-28.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelDfF1Z4T9/agstyle-23.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Modelh1mPDBy4/agstyle-21.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Modeld4D6QLnf/agstyle-17.jpg",
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model60RSnzxY/agstyle-13.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelhR9Sfy5Q/agstyle-15.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelKpRpVrg3/agstyle-7.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelvCNg8h6j/AG-Style.jpg"
          ]
        },
        {
          name: "Farel MD",
          description: "Élégance masculine & attitude.",
          images: [
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelmC32jrDj/farelmd-31.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelRk1fG3ph/farelmd-37.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelZ6LnsF9F/farelmd-33.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model0yVgwzxH/farelmd-28.jpg",
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelbZWLkcw/farelmd-30.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelLDjkT30K/farelmd-21.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelrKm9BH3j/farelmd-26.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelKpY1tHHg/farelmd-10.jpg",
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Modeltp51KKMX/farelmd-16.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelfTrvQht/farelmd-5.jpg"
          ]
        },
        {
          name: "Ventex Custom",
          description: "Une prestation haute en audace et en style.",
          images: [
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelLDm73BY2/ventex-44.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelLXj51t0G/ventex-43.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelhRnhS3gP/ventex-31.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelfdM74zWJ/ventex-36.jpg",
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelHTb9F9rc/ventex-21.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelbjWPHcc3/ventex-28.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelJW2VY4JY/ventex-18.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model6JwgLJk2/ventex-4.jpg",
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelvvYkS6nQ/ventex-14.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Modelch7Fxy8J/ventex-7.jpg"
          ]
        },
        {
          name: "Miguel Fashion Style",
          description: "La finesse sur-mesure.",
          images: [
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelR4j44vxH/miguel-25.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelDF36zP1/miguel-24.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model5hHnGSgR/miguel-23.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelKccH1yVW/miguel-21.jpg",
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModeltTwH0qkd/miguel-19.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelPztGS4cG/miguel-13.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelHfHQDqs9/miguel-12.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelDPbZq0X5/miguel-6.jpg",
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelfYzb35qV/miguel-10.jpg"
          ]
        },
        {
          name: "Faran",
          description: "Parade des Miss du Gabon.",
          images: [
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Modelxqxq0t42/faran-72.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model5WRGVpN2/faran-63.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelC3rMvpRH/faran-62.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelccTm9fqZ/faran-45.jpg",
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelW4JbLKPY/faran-31.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelkVvx62Cd/faran-7.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model1fpzHFCR/faran-18.jpg"
          ]
        },
        {
          name: "Madame Luc (Abiale)",
          description: "Une allure élégante et intemporelle.",
          images: [
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelTM8ZvfwY/madameluc-35.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelN2n3N649/madameluc-27.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelHfGP2hfY/madameluc-23.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Modelv4bptydm/madameluc-14.jpg",
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelNk9JnK8/madameluc-10.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelwN3028xM/madameluc-1.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelZ64LbfNr/madameluc-4.jpg"
          ]
        },
        {
          name: "Brand’O",
          description: "Une énergie flamboyante au podium.",
          images: [
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModeljkztFFQV/brando-50.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelMxvqp922/brando-45.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Modelb5NYjLqm/brando-39.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelmFGznJJd/brando-34.jpg",
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelpjQ61C7X/brando-28.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Modelmrj3sfP7/brando-26.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelGQfNYbHh/brando-25.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelbgJd82zf/brando-24.jpg",
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelGQzzgTZw/brando-22.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model4gNj73vP/brando-17.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelspywFpR6/brando-13.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelGfYXkKVK/brando-11.jpg",
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Modelymw3cwt9/brando-10.jpg"
          ]
        },
        {
          name: "Tito Style",
          description: "Audace urbaine & inspiration afro.",
          images: [
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelC5rcPJHz/titostyle-53.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelgMf55YY9/titostyle-51.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model8Ty8sGT/titostyle-50.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Modeld0tXVs0v/titostyle-45.jpg",
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model21VQys2y/titostyle-43.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelwNPRTQrS/titostyle-41.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Modelvvc0k6TQ/titostyle-36.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelPGP9HTrw/titostyle-33.jpg",
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelQvjHXZFY/titostyle-19.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model21cjYs2K/titostyle-25.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelynCg04LR/titostyle-17.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelcXkw3btJ/titostyle-4.jpg",
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelqY64DbG0/titostyle-12.jpg"
          ]
        },
        {
          name: "Edele A",
          description: "Le final tout en poésie.",
          images: [
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelN26jYJCm/edelea-40.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelzhtZj7wG/edelea-38.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelBKwMNJBw/edelea-31.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelmVJhr45j/edelea-24.jpg",
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model35dDJXpV/edelea-22.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelXx03RWJx/edelea-16.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelTq77XgYg/edelea-3.jpg"
          ]
        }
      ],
      featuredModels: [
        "Juliana Jodelle", "Noemi Kim", "Stecya", "Lyne", "Cassandra", "Merveille",
        "Osée Jn", "Donatien", "Pablo Zapatero", "Rosnel", "Moustapha"
      ],
      artists: [
        {
          name: "Lady Riaba",
          description: "Slam poétique intitulé « Racines et Modernité » en ouverture de soirée.",
          images: [
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelWCYYHQ1/ladyriaba-28.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelrfLBb0t3/ladyriaba-26.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelhRFn9tyT/ladyriaba-22.jpg",
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelCs3pHkbD/ladyriaba-20.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelCp50mQwn/ladyriaba-14.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelFq4NQ0gN/ladyriaba-10.jpg",
            "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Modelzhj0xKNN/ladyriaba-8.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Modelx8mGQcCG/ladyriaba-6.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelKx1WMT87/ladyriaba-5.jpg", "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelJRs6P128/ladyriaba-1.jpg"
          ]
        }
      ],
      partners: [
        { type: "Golden Partenaire Officiel", name: "La Gare du Nord" },
        { type: "Golden Partenaire", name: "Indi Hair" },
        { type: "Golden Partenaire", name: "Darain Visuals" },
        { type: "Golden Partenaire", name: "Femmes Belles Ambitieuses et Dynamiques" }
      ]
    },
    {
      edition: 2,
      date: "2026-01-31T18:00:00",
      theme: "L'Art de se révéler",
      location: "Complexe Hôtelier Le Nalys, Angondjé (à confirmer)",
      imageUrl: "https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelZpc4WJVF/L-art-de-se-reveler-080-Z.png",
      description: "Après une première édition marquante, riche en émotions et en élégance, Perfect Models Management est fier d'annoncer le retour de la Perfect Fashion Day pour une deuxième édition inédite. Cette nouvelle rencontre mettra à l'honneur une mode profondément enracinée dans la culture, l'histoire personnelle et l'affirmation de soi.",
      stylists: [],
      featuredModels: [],
      artists: [
        { 
            name: 'Lady Riaba (Poésie)', 
            description: 'Slam introductif sur le thème "L\'Art de se révéler"', 
            images: [] 
        }
      ],
      partners: []
    }
];

export const agencyTimeline = [
    { year: '2021', event: 'Création de l\'agence Perfect Models Management' },
    { year: '2022', event: 'Lancement du programme de formation "PMM Classroom"' },
    { year: '2023', event: 'Nos mannequins participent à la Libreville Fashion Week' },
    { year: '2025', event: 'Première édition du Perfect Fashion Day' },
];

export const agencyInfo = {
    about: {
        p1: "Fondée en 2021 par Parfait Asseko, Perfect Models Management est née d'une vision : créer une agence de mannequins d'élite au Gabon, capable de rivaliser avec les standards internationaux. Nous sommes plus qu'une simple agence ; nous sommes un berceau de talents, une plateforme de développement et un acteur clé de l'écosystème de la mode en Afrique Centrale.",
        p2: "Notre mission est de découvrir, former et propulser les futurs visages de la mode, tout en offrant à nos clients un service irréprochable et des profils adaptés à leurs besoins les plus exigeants. L'élégance, le professionnalisme et la passion sont les piliers de notre identité."
    },
    values: [
        { name: 'Excellence', description: 'Nous visons les plus hauts standards dans tout ce que nous entreprenons.' },
        { name: 'Intégrité', description: 'Nous opérons avec transparence et respect envers nos talents et nos clients.' },
        { name: 'Développement', description: 'Nous investissons dans la formation continue de nos mannequins.' },
    ],
};

export const modelDistinctions: ModelDistinction[] = [
    { name: 'Miss Gabon', titles: ['Lauréate 2022', '1ère Dauphine 2021'] },
    { name: 'Top Model Afrique', titles: ['Gagnant Catégorie Homme 2023'] },
    { name: 'Elite Model Look', titles: ['Finaliste Gabon 2023'] },
    { name: 'Libreville Fashion Week', titles: ['Mannequin de l\'année 2024'] }
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
  {
    slug: "booking-mannequins",
    title: "Booking Mannequins",
    description: "Réservation de mannequins pour événements, shootings ou campagnes publicitaires.",
    details: {
      title: "Ce que nous proposons",
      points: [
        "Mannequins professionnels pour tous types de projets",
        "Flexibilité selon vos besoins (durée, lieu, type de prestation)",
        "Suivi personnalisé avant et pendant le projet"
      ]
    },
    icon: "UserGroupIcon",
    buttonText: "Réserver ce service",
    buttonLink: "/contact?service=Booking+Mannequins",
    category: "Services Mannequinat"
  },
  {
    slug: "mannequins-pour-defiles",
    title: "Mannequins pour Défilés",
    description: "Des mannequins professionnels pour vos défilés, avec coaching sur la posture et la démarche.",
    details: {
      title: "Inclus",
      points: [
        "Présentation élégante et harmonieuse de vos créations",
        "Maîtrise parfaite du passage sur podium",
        "Coordination avec votre équipe pour un spectacle mémorable"
      ]
    },
    icon: "AcademicCapIcon",
    buttonText: "Réserver ce service",
    buttonLink: "/contact?service=Mannequins+pour+D%C3%A9fil%C3%A9s",
    category: "Services Mannequinat"
  },
  {
    slug: "mannequins-publicite-audiovisuel",
    title: "Mannequins Publicité / Audiovisuel",
    description: "Mannequins pour publicité, clips et projets audiovisuels.",
    details: {
      title: "Inclus",
      points: [
        "Mise en scène adaptée à vos besoins",
        "Mannequins expressifs et professionnels",
        "Accompagnement par notre équipe de production si nécessaire"
      ]
    },
    icon: "VideoCameraIcon",
    buttonText: "Réserver ce service",
    buttonLink: "/contact?service=Mannequins+Publicit%C3%A9+%2F+Audiovisuel",
    category: "Services Mannequinat"
  },
  {
    slug: "mannequins-photo",
    title: "Mannequins Photo",
    description: "Shooting photo pour catalogues, lookbooks ou réseaux sociaux.",
    details: {
      title: "Ce que nous offrons",
      points: [
        "Photographie en studio ou extérieur",
        "Mannequins adaptés au style de votre marque",
        "Collaboration avec maquilleurs, stylistes et photographes professionnels"
      ]
    },
    icon: "PhotoIcon",
    buttonText: "Réserver ce service",
    buttonLink: "/contact?service=Mannequins+Photo",
    category: "Services Mannequinat"
  },
  {
    slug: "mannequins-figurants",
    title: "Mannequins Figurants",
    description: "Figurants pour clips, films ou événements nécessitant un public.",
    details: {
      title: "Avantages",
      points: [
        "Figurants sélectionnés selon vos besoins spécifiques",
        "Gestion complète de la logistique et présence sur site"
      ]
    },
    icon: "UsersIcon",
    buttonText: "Réserver ce service",
    buttonLink: "/contact?service=Mannequins+Figurants",
    category: "Services Mannequinat"
  },
  {
    slug: "formation-mannequins",
    title: "Formation Mannequins",
    description: "Coaching complet pour mannequins : posture, démarche, expressions et présence scénique.",
    details: {
      title: "Objectifs",
      points: [
        "Optimisation de la performance en casting ou sur podium",
        "Développement de confiance et professionnalisme"
      ]
    },
    icon: "AcademicCapIcon",
    buttonText: "Réserver ce service",
    buttonLink: "/contact?service=Formation+Mannequins",
    category: "Services Mannequinat"
  },
  {
    slug: "conseil-image-style",
    title: "Conseil en Image et Style",
    description: "Accompagnement pour look, coiffure, maquillage et style vestimentaire.",
    details: {
      title: "Avantages",
      points: [
        "Image cohérente et professionnelle",
        "Adaptation au projet ou événement",
        "Recommandations personnalisées pour un impact visuel fort"
      ]
    },
    icon: "IdentificationIcon",
    buttonText: "Réserver ce service",
    buttonLink: "/contact?service=Conseil+en+Image+et+Style",
    category: "Services Mannequinat"
  },
  {
    slug: "creation-tenues-sur-mesure",
    title: "Création de Tenues Sur-Mesure",
    description: "Tenues sur-mesure pour femmes, hommes et enfants, en accord avec vos goûts et votre identité.",
    details: {
      title: "Inclus",
      points: [
        "Couture à la main et finitions parfaites",
        "Utilisation de tissus haut de gamme (wax, satin, mousseline, dentelle, tulle)",
        "Designs uniques et personnalisés"
      ]
    },
    icon: "ScissorsIcon",
    buttonText: "Réserver ce service",
    buttonLink: "/contact?service=Cr%C3%A9ation+de+Tenues+Sur-Mesure",
    category: "Services Mode et Stylisme"
  },
  {
    slug: "location-tenues-mode",
    title: "Location de Tenues de Mode",
    description: "Accédez à notre collection de tenues pour vos défilés, shootings ou événements spéciaux.",
    details: {
      title: "Avantages",
      points: [
        "Choix parmi une large gamme de styles et tailles",
        "Tenues disponibles pour une période flexible"
      ]
    },
    icon: "BriefcaseIcon",
    buttonText: "Réserver ce service",
    buttonLink: "/contact?service=Location+de+Tenues+de+Mode",
    category: "Services Mode et Stylisme"
  },
  {
    slug: "styling-conseil-mode",
    title: "Styling & Conseil Mode",
    description: "Création de looks parfaits pour campagnes, shootings ou événements.",
    details: {
      title: "Avantages",
      points: [
        "Coordination totale des couleurs et accessoires",
        "Conseils mode personnalisés selon vos objectifs"
      ]
    },
    icon: "PaintBrushIcon",
    buttonText: "Réserver ce service",
    buttonLink: "/contact?service=Styling+%26+Conseil+Mode",
    category: "Services Mode et Stylisme"
  },
  {
    slug: "organisation-defiles-mode",
    title: "Organisation Défilés de Mode",
    description: "Planification et exécution complète du défilé : mannequins, scénographie, musique, mise en scène.",
    details: {
      title: "Inclus",
      points: [
        "Événement professionnel et mémorable",
        "Coordination complète avec stylistes et partenaires",
        "Expérience exceptionnelle pour vos invités et participants"
      ]
    },
    icon: "PresentationChartLineIcon",
    buttonText: "Réserver ce service",
    buttonLink: "/contact?service=Organisation+D%C3%A9fil%C3%A9s+de+Mode",
    category: "Services Mode et Stylisme"
  },
  {
    slug: "conseil-creatif-branding",
    title: "Conseil Créatif et Branding",
    description: "Développement de l’identité visuelle et de la présence de votre marque.",
    details: {
      title: "Avantages",
      points: [
        "Conception de l’identité visuelle (logo, charte graphique)",
        "Développement de votre style unique pour vos collections",
        "Conseils sur marketing et communication"
      ]
    },
    icon: "SparklesIcon",
    buttonText: "Réserver ce service",
    buttonLink: "/contact?service=Conseil+Cr%C3%A9atif+et+Branding",
    category: "Services Mode et Stylisme"
  },
  {
    slug: "shooting-mode-professionnel",
    title: "Shooting Mode Professionnel",
    description: "Organisation complète de shootings en studio ou extérieur avec photographe, styliste et maquilleur.",
    details: {
      title: "Inclus",
      points: [
        "Photos de haute qualité pour vos catalogues ou réseaux sociaux",
        "Coordination totale pour un résultat harmonieux",
        "Accompagnement personnalisé selon votre projet"
      ]
    },
    icon: "CameraIcon",
    buttonText: "Réserver ce service",
    buttonLink: "/contact?service=Shooting+Mode+Professionnel",
    category: "Services Mode et Stylisme"
  },
  {
    slug: "accessoires-lookbook",
    title: "Accessoires et Lookbook",
    description: "Création ou fourniture d’accessoires pour compléter vos collections et shootings.",
    details: {
      title: "Inclus",
      points: [
        "Sélection harmonisée avec vos tenues",
        "Conseil styling pour un look complet et percutant"
      ]
    },
    icon: "StarIcon",
    buttonText: "Réserver ce service",
    buttonLink: "/contact?service=Accessoires+et+Lookbook",
    category: "Services Mode et Stylisme"
  },
  {
    slug: "animation-shows-defiles",
    title: "Animation de Shows / Défilés",
    description: "Animation complète de vos événements mode pour captiver votre public.",
    details: {
      title: "Inclus",
      points: [
        "Coordination des mannequins et performances artistiques",
        "Gestion du rythme et de la mise en scène"
      ]
    },
    icon: "MegaphoneIcon",
    buttonText: "Réserver ce service",
    buttonLink: "/contact?service=Animation+de+Shows+%2F+D%C3%A9fil%C3%A9s",
    category: "Services Événementiels"
  },
  {
    slug: "presentateurs-hotes",
    title: "Présentateurs / Hôtes de Cérémonie",
    description: "Hôtes professionnels pour introduire vos défilés et événements.",
    icon: "MicrophoneIcon",
    buttonText: "Réserver ce service",
    buttonLink: "/contact?service=Pr%C3%A9sentateurs+%2F+H%C3%B4tes+de+C%C3%A9r%C3%A9monie",
    category: "Services Événementiels"
  },
  {
    slug: "promotion-communication",
    title: "Promotion et Communication",
    description: "Couverture complète de vos événements et projets sur réseaux sociaux et médias partenaires.",
    icon: "ChatBubbleLeftRightIcon",
    buttonText: "Réserver ce service",
    buttonLink: "/contact?service=Promotion+et+Communication",
    category: "Services Événementiels"
  },
  {
    slug: "partenariat-marques",
    title: "Partenariat avec Marques",
    description: "Mise en relation de marques avec mannequins, créateurs et stylistes pour des collaborations impactantes.",
    icon: "BuildingStorefrontIcon",
    buttonText: "Réserver ce service",
    buttonLink: "/contact?service=Partenariat+avec+Marques",
    category: "Services Événementiels"
  }
];

export const agencyAchievements: AchievementCategory[] = [
    { name: 'Défilés de Mode', items: ['Libreville Fashion Week', 'Black Fashion Week Paris (Représentation)', 'FIMA Niger (Représentation)'] },
    { name: 'Campagnes Publicitaires', items: ['Airtel Gabon', 'BGFI Bank', 'Sobebra', 'Canal+'] },
    { name: 'Magazines', items: ['Gabon Magazine', 'Afropolitan', 'Elle Côte d\'Ivoire (Édito)'] },
];

export const agencyPartners: Partner[] = [
    { name: 'G Store' },
    { name: 'NR Picture' },
    { name: 'Tito Style' },
    { name: 'La Gare du Nord' },
    { name: 'Miguel Fashion Style' }
];

export const faqData: FAQCategory[] = [
    {
        category: 'Devenir Mannequin',
        items: [
            {
                question: "Quels sont les critères pour devenir mannequin chez PMM ?",
                answer: "Nous recherchons des profils variés. Pour les défilés, les critères de taille sont généralement de 1m70 minimum pour les femmes et 1m80 pour les hommes. Cependant, nous encourageons tous les talents, y compris pour le mannequinat commercial et beauté, à postuler via notre page Casting."
            },
            {
                question: "Dois-je avoir de l'expérience pour postuler ?",
                answer: "Non, l'expérience n'est pas obligatoire. Perfect Models Management est aussi une agence de développement. Nous organisons des castings pour dénicher de nouveaux talents que nous formons ensuite via notre 'Classroom Débutant'."
            },
            {
                question: "Comment se déroule le processus de casting ?",
                answer: "Après avoir postulé en ligne, les profils présélectionnés sont invités à un casting physique. Vous serez évalué sur votre démarche, votre photogénie et votre personnalité par un jury de professionnels. Les candidats retenus intègrent ensuite notre programme de formation."
            }
        ]
    },
    {
        category: 'Nos Services',
        items: [
            {
                question: "Comment puis-je booker un mannequin pour mon projet ?",
                answer: "C'est très simple. Vous pouvez nous contacter via notre page Contact ou remplir directement le formulaire de demande de booking. Précisez la nature de votre projet, les dates, et le(s) profil(s) recherché(s), et notre équipe vous répondra dans les plus brefs délais."
            },
            {
                question: "Organisez-vous des shootings pour des particuliers ?",
                answer: "Oui, via notre service 'Shooting Mode Professionnel'. Nous pouvons organiser une séance photo complète pour vous, que ce soit pour un book personnel ou simplement pour le plaisir, en collaboration avec nos photographes, stylistes et maquilleurs partenaires."
            }
        ]
    },
    {
        category: 'Événements',
        items: [
            {
                question: "Comment puis-je participer au Perfect Fashion Day en tant que créateur ?",
                answer: "Nous ouvrons les candidatures pour les créateurs plusieurs mois avant chaque édition. Vous pouvez soumettre votre dossier via le formulaire de candidature dédié sur la page 'Perfect Fashion Day' lorsque les inscriptions sont ouvertes."
            },
            {
                question: "Vendez-vous des billets pour assister à vos défilés ?",
                answer: "L'accès à nos événements comme le Perfect Fashion Day se fait généralement sur invitation. Cependant, nous organisons parfois des concours sur nos réseaux sociaux pour faire gagner des places. Suivez-nous pour ne rien manquer !"
            },
            {
                question: "Comment devenir partenaire de vos événements ?",
                answer: "Nous sommes toujours ouverts à des collaborations avec des marques et entreprises qui partagent nos valeurs. Veuillez nous contacter via notre page Contact pour discuter des opportunités de partenariat pour nos prochains événements."
            }
        ]
    }
];

// Données par défaut pour le système comptable
export const defaultAccountingCategories: AccountingCategory[] = [
    {
        id: 'revenue-cotisations',
        name: 'Cotisations Mannequins',
        type: 'revenue',
        subcategories: ['Cotisations mensuelles', 'Cotisations annuelles', 'Frais d\'inscription'],
        description: 'Revenus provenant des cotisations des mannequins'
    },
    {
        id: 'revenue-services',
        name: 'Services',
        type: 'revenue',
        subcategories: ['Booking mannequins', 'Organisation événements', 'Formation', 'Photographie'],
        description: 'Revenus provenant des services de l\'agence'
    },
    {
        id: 'revenue-partenariats',
        name: 'Partenariats',
        type: 'revenue',
        subcategories: ['Sponsors', 'Collaborations', 'Publicité'],
        description: 'Revenus provenant des partenariats'
    },
    {
        id: 'expense-location',
        name: 'Location & Infrastructure',
        type: 'expense',
        subcategories: ['Loyer bureau', 'Électricité', 'Internet', 'Téléphone'],
        description: 'Dépenses liées à l\'infrastructure'
    },
    {
        id: 'expense-marketing',
        name: 'Marketing & Communication',
        type: 'expense',
        subcategories: ['Publicité', 'Réseaux sociaux', 'Matériel promotionnel', 'Événements'],
        description: 'Dépenses de marketing et communication'
    },
    {
        id: 'expense-personnel',
        name: 'Personnel',
        type: 'expense',
        subcategories: ['Salaires', 'Formation', 'Équipement', 'Déplacements'],
        description: 'Dépenses liées au personnel'
    },
    {
        id: 'expense-divers',
        name: 'Divers',
        type: 'expense',
        subcategories: ['Fournitures', 'Maintenance', 'Assurance', 'Autres'],
        description: 'Autres dépenses'
    }
];

export const defaultAccountingTransactions: AccountingTransaction[] = [
    // Quelques transactions d'exemple
    {
        id: 'trans-1',
        date: '2024-01-15',
        description: 'Cotisation mensuelle - Marie Dubois',
        category: 'revenue',
        subcategory: 'Cotisations mensuelles',
        amount: 50000,
        currency: 'FCFA',
        paymentMethod: 'bank_transfer',
        reference: 'COT-2024-001',
        relatedModelId: 'model-1',
        relatedModelName: 'Marie Dubois',
        createdBy: 'admin',
        createdAt: '2024-01-15T10:00:00Z'
    },
    {
        id: 'trans-2',
        date: '2024-01-20',
        description: 'Loyer bureau - Janvier 2024',
        category: 'expense',
        subcategory: 'Loyer bureau',
        amount: 150000,
        currency: 'FCFA',
        paymentMethod: 'bank_transfer',
        reference: 'LOY-2024-01',
        createdBy: 'admin',
        createdAt: '2024-01-20T14:30:00Z'
    }
];

// Permissions par défaut pour les utilisateurs administrateurs
export const defaultAdminPermissions: AdminPermission[] = [
    // Gestion des mannequins
    { id: 'models-read', name: 'Voir les mannequins', description: 'Consulter la liste des mannequins', category: 'models', actions: ['read'] },
    { id: 'models-write', name: 'Modifier les mannequins', description: 'Ajouter, modifier ou supprimer des mannequins', category: 'models', actions: ['read', 'write', 'delete'] },
    { id: 'models-export', name: 'Exporter les mannequins', description: 'Exporter les données des mannequins', category: 'models', actions: ['read', 'export'] },
    
    // Gestion du contenu
    { id: 'content-read', name: 'Voir le contenu', description: 'Consulter les articles et le magazine', category: 'content', actions: ['read'] },
    { id: 'content-write', name: 'Modifier le contenu', description: 'Créer et modifier les articles', category: 'content', actions: ['read', 'write', 'delete'] },
    { id: 'news-write', name: 'Gérer les actualités', description: 'Créer et modifier les actualités', category: 'content', actions: ['read', 'write', 'delete'] },
    
    // Comptabilité
    { id: 'accounting-read', name: 'Voir la comptabilité', description: 'Consulter les transactions et bilans', category: 'accounting', actions: ['read'] },
    { id: 'accounting-write', name: 'Gérer la comptabilité', description: 'Ajouter des transactions et paiements', category: 'accounting', actions: ['read', 'write'] },
    { id: 'accounting-export', name: 'Exporter la comptabilité', description: 'Générer des rapports PDF', category: 'accounting', actions: ['read', 'export'] },
    
    // Système
    { id: 'system-users', name: 'Gérer les utilisateurs', description: 'Créer et modifier les comptes administrateurs', category: 'system', actions: ['read', 'write', 'delete'] },
    { id: 'system-settings', name: 'Paramètres système', description: 'Modifier les paramètres du site', category: 'system', actions: ['read', 'write'] },
    { id: 'system-backup', name: 'Sauvegarde', description: 'Accès aux fonctions de sauvegarde', category: 'system', actions: ['read', 'write'] },
    
    // Rapports
    { id: 'reports-basic', name: 'Rapports de base', description: 'Consulter les rapports standards', category: 'reports', actions: ['read'] },
    { id: 'reports-advanced', name: 'Rapports avancés', description: 'Créer des rapports personnalisés', category: 'reports', actions: ['read', 'write', 'export'] }
];

// Utilisateurs administrateurs par défaut
export const defaultAdminUsers: AdminUser[] = [
    {
        id: 'admin-1',
        username: 'admin',
        password: 'admin123',
        name: 'Administrateur Principal',
        email: 'admin@perfectmodels.ga',
        role: 'admin',
        permissions: defaultAdminPermissions,
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: 'system'
    }
];

export const defaultAlbums = [
    {
        id: 'album-1',
        title: 'Shooting Mode Élégante',
        description: 'Une collection de photos mettant en valeur l\'élégance et le raffinement de nos mannequins dans des tenues sophistiquées.',
        theme: 'Mode Élégante',
        coverImage: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelmCcD1Gfq/DSC-0272.jpg',
        photos: [
            {
                id: 'photo-1-1',
                url: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelmCcD1Gfq/DSC-0272.jpg',
                title: 'Portrait Élégant',
                description: 'Portrait en noir et blanc mettant en valeur les traits fins',
                uploadedAt: new Date().toISOString(),
                uploadedBy: 'admin',
                featured: true
            },
            {
                id: 'photo-1-2',
                url: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelK2wS0Pz/hero-bg.jpg',
                title: 'Pose Sophistiquée',
                description: 'Pose classique dans un environnement moderne',
                uploadedAt: new Date().toISOString(),
                uploadedBy: 'admin',
                featured: false
            }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin',
        isPublic: true,
        featured: true,
        tags: ['élégance', 'sophistication', 'portrait'],
        location: 'Studio PMM, Libreville',
        date: '2024-01-15',
        models: ['noemi-kim'],
        stylists: ['Styliste Principal'],
        photographers: ['Photographe PMM']
    },
    {
        id: 'album-2',
        title: 'Nature & Beauté',
        description: 'Shooting en extérieur mettant en harmonie la beauté naturelle de nos mannequins avec les paysages gabonais.',
        theme: 'Nature',
        coverImage: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelC5rcPJHz/titostyle-53.jpg',
        photos: [
            {
                id: 'photo-2-1',
                url: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=ModelC5rcPJHz/titostyle-53.jpg',
                title: 'Harmonie Naturelle',
                description: 'Mise en valeur de la beauté naturelle',
                uploadedAt: new Date().toISOString(),
                uploadedBy: 'admin',
                featured: true
            }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin',
        isPublic: true,
        featured: false,
        tags: ['nature', 'extérieur', 'beauté'],
        location: 'Parc National, Libreville',
        date: '2024-02-20',
        models: ['aj-caramela'],
        stylists: ['Équipe Nature'],
        photographers: ['Photographe Nature']
    }
];

// Données d'équipe par défaut
export const defaultTeamMembers: TeamMember[] = [
    {
        id: 'team-1',
        name: 'Parfait Asseko',
        position: 'Fondateur & Directeur',
        role: 'founder',
        description: 'Visionnaire passionné, Parfait Asseko a créé Perfect Models Management avec l\'ambition de révolutionner la mode gabonaise et de former les futurs talents de l\'industrie.',
        imageUrl: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model3yD48r0J/480946208-616728137878198-6925216743970681454-n.jpg',
        email: 'parfait@perfectmodelsmanagement.ga',
        phone: '+241 XX XX XX XX',
        socialLinks: {
            linkedin: 'https://linkedin.com/in/parfait-asseko',
            instagram: 'https://instagram.com/parfait_asseko'
        },
        isPublic: true,
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'team-2',
        name: 'Équipe de Formation',
        position: 'Formateurs Professionnels',
        role: 'trainer',
        description: 'Nos formateurs expérimentés accompagnent chaque mannequin dans son développement personnel et professionnel, garantissant une formation de qualité internationale.',
        isPublic: true,
        order: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'team-3',
        name: 'Direction Artistique',
        position: 'Créateurs & Stylistes',
        role: 'stylist',
        description: 'Notre équipe artistique travaille en étroite collaboration avec les créateurs pour offrir des prestations exceptionnelles et des événements mémorables.',
        isPublic: true,
        order: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Données initiales pour le mini réseau social
export const defaultSocialUsers: SocialUser[] = [
    {
        id: 'social-user-1',
        name: 'Parfait Louis Asseko',
        username: 'parfait',
        email: 'contact@perfectmodels.ga',
        bio: 'Fondateur de Perfect Models Management',
        followers: [],
        following: [],
        postsCount: 0,
        isVerified: true,
        isOnline: false,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        badges: [],
        privacy: {
            profileVisibility: 'public',
            showEmail: false,
            showLastSeen: true
        }
    },
    {
        id: 'social-user-2',
        name: 'Marie Claire',
        username: 'marie',
        email: 'marie@perfectmodels.ga',
        bio: 'Formatrice et experte en mannequinat',
        followers: [],
        following: [],
        postsCount: 0,
        isVerified: true,
        isOnline: false,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        badges: [],
        privacy: {
            profileVisibility: 'public',
            showEmail: false,
            showLastSeen: true
        }
    }
];

export const defaultSocialPosts: SocialPost[] = [
    {
        id: 'post-1',
        authorId: 'social-user-1',
        authorName: 'Parfait Louis Asseko',
        authorImage: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model3yD48r0J/480946208-616728137878198-6925216743970681454-n.jpg',
        content: 'Bienvenue dans la communauté Perfect Models Management ! 🎉 Partagez vos expériences, posez vos questions et connectez-vous avec d\'autres talents de la mode.',
        type: 'text',
        category: 'general',
        tags: ['bienvenue', 'communauté', 'mode'],
        mentions: [],
        likes: ['social-user-2'],
        shares: [],
        comments: [],
        isPublic: true,
        isPinned: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'post-2',
        authorId: 'social-user-2',
        authorName: 'Marie Claire',
        authorImage: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model3yD48r0J/480946208-616728137878198-6925216743970681454-n.jpg',
        content: 'Conseil du jour : La confiance en soi est la clé du succès en mannequinat. Travaillez votre posture et votre présence ! 💪',
        type: 'text',
        category: 'tips',
        tags: ['conseils', 'confiance', 'mannequinat'],
        mentions: [],
        mood: 'motivated',
        likes: ['social-user-1'],
        shares: [],
        comments: [],
        isPublic: true,
        isPinned: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 jour plus tôt
        updatedAt: new Date(Date.now() - 86400000).toISOString()
    }
];

export const defaultSocialNotifications: SocialNotification[] = [];

// Données initiales pour le forum
export const defaultForumThreads: ForumThread[] = [
    {
        id: 'thread-1',
        title: 'Bienvenue dans le forum PMM !',
        initialPost: 'Ce forum est un espace d\'échange pour tous les membres de la communauté Perfect Models Management. N\'hésitez pas à poser vos questions et partager vos expériences !',
        authorId: 'social-user-1',
        authorName: 'Parfait Louis Asseko',
        createdAt: new Date().toISOString()
    },
    {
        id: 'thread-2',
        title: 'Conseils pour débuter en mannequinat',
        initialPost: 'Partagez vos conseils et expériences pour aider les nouveaux mannequins à bien commencer leur parcours.',
        authorId: 'social-user-2',
        authorName: 'Marie Claire',
        createdAt: new Date(Date.now() - 172800000).toISOString() // 2 jours plus tôt
    }
];
