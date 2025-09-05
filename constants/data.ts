import { Model, Service, AchievementCategory, ModelDistinction, Testimonial, ContactInfo, SiteImages, Partner, ApiKeys, CastingApplication, FashionDayApplication, NewsItem, FashionDayEvent, ForumThread, ForumReply, ArticleComment, RecoveryRequest } from '../types';
import { NavLink } from '../hooks/useDataStore';

export const siteConfig = {
  logo: 'https://i.ibb.co/L9hVbYf/logo-pm-gold.png',
};

export const navLinks: NavLink[] = [
  { path: '/', label: 'Accueil', inFooter: true },
  { path: '/agence', label: 'Agence', inFooter: true },
  { path: '/mannequins', label: 'Mannequins', inFooter: true },
  { path: '/fashion-day', label: 'Fashion Day', inFooter: true, footerLabel: 'Perfect Fashion Day' },
  { path: '/magazine', label: 'Magazine', inFooter: true },
  { path: '/services', label: 'Services', inFooter: true },
  { path: '/contact', label: 'Contact', inFooter: true },
  { path: '/formations', label: 'Classroom', inFooter: false },
];

export const socialLinks = {
    facebook: 'https://www.facebook.com/PerfectModels241',
    instagram: 'https://www.instagram.com/perfectmodelsmanagement_/',
    youtube: 'https://www.youtube.com/@perfectmodelsmanagement6013',
};

export const contactInfo: ContactInfo = {
    email: 'contact@perfectmodels.ga',
    phone: '+241 077 00 00 00',
    address: 'Libreville, Gabon',
};

export const siteImages: SiteImages = {
    hero: 'https://i.ibb.co/K2wS0Pz/hero-bg.jpg',
    about: 'https://i.ibb.co/3WfK9Xg/about-img.jpg',
    fashionDayBg: 'https://i.ibb.co/C5rcPJHz/titostyle-53.jpg',
    agencyHistory: 'https://i.ibb.co/jH0YvJg/agency-history.jpg',
    classroomBg: 'https://i.ibb.co/TBt9FBSv/AJC-4630.jpg',
    castingBg: 'https://i.ibb.co/z5TzL2M/casting-bg.jpg',
};

export const apiKeys: ApiKeys = {
    resendApiKey: 're_12345678_abcdefghijklmnopqrstuvwxyz',
};

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
        imageUrl: 'https://i.ibb.co/mCcD1Gfq/DSC-0272.jpg',
        distinctions: ["Miss Gabon 2022", "Top Model Afrique Centrale 2023"],
        measurements: { chest: '85cm', waist: '62cm', hips: '90cm', shoeSize: '40' },
        categories: ['Défilé', 'Éditorial', 'Beauté'],
        experience: "Mannequin vedette de l'agence, Noemi a défilé pour les plus grands créateurs gabonais et a été le visage de plusieurs campagnes nationales. Son professionnalisme et sa démarche captivante en font une référence.",
        journey: "Découverte lors d'un casting sauvage, Noemi a rapidement gravi les échelons grâce à sa détermination. Formée au sein de la PMM Classroom, elle incarne aujourd'hui l'excellence et l'ambition de l'agence.",
        quizScores: { 'module-1-les-fondamentaux-du-mannequinat': 100, 'module-2-techniques-de-podium-catwalk': 95 },
    },
    {
        id: 'aj-caramela',
        name: 'AJ Caramela',
        username: 'Man-PMMA01',
        password: 'caramela2024',
        height: '1m75',
        gender: 'Femme',
        imageUrl: 'https://i.postimg.cc/k5skXhC2/NR-09474.jpg',
        measurements: { chest: '82cm', waist: '60cm', hips: '88cm', shoeSize: '39' },
        categories: ['Défilé', 'Commercial', 'Éditorial'],
        experience: "Avec son regard perçant et sa polyvalence, AJ excelle dans les shootings éditoriaux et les campagnes publicitaires. Elle a collaboré avec de nombreuses marques locales et photographes de renom.",
        journey: "AJ a rejoint PMM avec une passion pour la photographie. Son aisance devant l'objectif et sa capacité à se transformer lui ont rapidement ouvert les portes des projets les plus créatifs.",
        quizScores: { 'module-1-les-fondamentaux-du-mannequinat': 90, 'module-3-photographie-et-expression-corporelle': 100 },
    },
    {
        id: 'yann-aubin',
        name: 'Yann Aubin',
        username: 'Man-PMMY01',
        password: 'yann2024',
        height: '1m88',
        gender: 'Homme',
        imageUrl: 'https://i.ibb.co/Rk1fG3ph/farelmd-37.jpg',
        measurements: { chest: '98cm', waist: '78cm', hips: '95cm', shoeSize: '44' },
        categories: ['Défilé', 'Costume', 'Sportswear'],
        experience: "Spécialiste du prêt-à-porter masculin, Yann est reconnu pour sa démarche puissante et son élégance naturelle. Il est un choix privilégié pour les défilés de créateurs de costumes.",
        journey: "Ancien athlète, Yann a apporté sa discipline et sa prestance au monde du mannequinat. Il s'est rapidement imposé comme une figure incontournable de la mode masculine au Gabon.",
        quizScores: { 'module-2-techniques-de-podium-catwalk': 90 },
    },
];

export const testimonials: Testimonial[] = [
    {
        name: 'Franck B.',
        role: 'Créateur de Mode',
        quote: "Collaborer avec Perfect Models Management est un gage de professionnalisme. Leurs mannequins sont non seulement magnifiques mais aussi incroyablement bien formés et ponctuels. Un vrai plaisir.",
        imageUrl: 'https://i.ibb.co/s5zW7gZ/testimonial-1.jpg',
    },
    {
        name: 'Nadia K.',
        role: 'Directrice Artistique',
        quote: "L'agence a un œil incroyable pour dénicher des talents uniques. Leur catalogue est diversifié et répond parfaitement aux besoins créatifs de nos campagnes publicitaires.",
        imageUrl: 'https://i.ibb.co/y4x9Y8X/testimonial-2.jpg',
    },
    {
        name: 'Noemi Kim',
        role: 'Mannequin de l\'agence',
        quote: "PMM est bien plus qu'une agence, c'est une famille qui nous pousse à donner le meilleur de nous-mêmes. La formation et l'encadrement sont exceptionnels.",
        imageUrl: 'https://i.ibb.co/mCcD1Gfq/DSC-0272.jpg',
    },
];

export const castingApplications: CastingApplication[] = [];
export const fashionDayApplications: FashionDayApplication[] = [];
export const forumThreads: ForumThread[] = [];
export const forumReplies: ForumReply[] = [];
export const articleComments: ArticleComment[] = [];
export const recoveryRequests: RecoveryRequest[] = [];

export const newsItems: NewsItem[] = [
    { id: '1', title: "Grand Casting Annuel", date: '2025-09-06', imageUrl: 'https://i.ibb.co/z5TzL2M/casting-bg.jpg', excerpt: "Nous recherchons les prochains visages de la mode. Préparez-vous pour notre grand casting national.", link: '/casting-formulaire' },
    { id: '2', title: "Perfect Fashion Day Édition 2", date: '2025-02-08', imageUrl: 'https://i.ibb.co/C5rcPJHz/titostyle-53.jpg', excerpt: "La seconde édition de notre événement mode phare approche à grands pas. Découvrez le thème et les créateurs.", link: '/fashion-day' },
    { id: '3', title: "Nouveaux Talents 2024", date: '2024-08-15', imageUrl: 'https://i.ibb.co/3WfK9Xg/about-img.jpg', excerpt: "L'agence est fière d'accueillir trois nouveaux mannequins prometteurs dans ses rangs.", link: '/mannequins' },
];

export const fashionDayEvents: FashionDayEvent[] = [
  {
    edition: 1,
    date: '8 Février 2025',
    theme: 'Racines & Modernité',
    location: 'La Gare du Nord, Libreville',
    description: 'La première édition du Perfect Fashion Day a célébré le talent des créateurs locaux et la beauté des mannequins de l\'agence dans un cadre prestigieux.',
    stylists: [
        { name: 'AG Style', description: 'Tradition revisitée', images: ['https://i.ibb.co/3WfK9Xg/about-img.jpg'] },
        { name: 'Brand’O', description: 'Énergie flamboyante', images: [] },
        { name: 'Miguel Fashion Style', description: 'Finesse sur-mesure', images: [] }
    ],
    featuredModels: ['Noemi Kim', 'AJ Caramela', 'Yann Aubin'],
    artists: ['Lady Riaba (Poésie)'],
    partners: [{type: 'Principal', name: 'G Store'}]
  },
  {
    edition: 2,
    date: 'Prévu pour 2026',
    theme: 'L’Art de Se Révéler',
    description: 'La prochaine édition explorera l\'expression de soi à travers la mode. Nous recherchons des talents visionnaires pour donner vie à ce thème.',
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
    { icon: 'UserGroupIcon', title: 'Gestion de Carrière de Mannequins', description: 'Nous offrons un management complet et personnalisé, de la création du book à la négociation des contrats. Notre objectif est de construire des carrières durables en identifiant les meilleures opportunités nationales et internationales pour nos talents.' },
    { icon: 'AcademicCapIcon', title: 'Formation & Coaching (PMM Classroom)', description: 'Notre programme exclusif "PMM Classroom" dispense une formation théorique et pratique de haut niveau. Nous couvrons tous les aspects du métier : démarche, pose, nutrition, gestion d\'image et éthique professionnelle pour former des mannequins complets.' },
    { icon: 'CameraIcon', title: 'Production de Shootings & Éditoriaux', description: 'Nous gérons l\'intégralité de vos productions visuelles, du concept créatif à la post-production. Nous assemblons les meilleures équipes (photographes, stylistes, MUA) pour créer des campagnes publicitaires, lookbooks et éditoriaux percutants.' },
    { icon: 'SparklesIcon', title: 'Direction de Casting & Événementiel', description: 'Nous trouvons les visages parfaits pour vos projets. Que ce soit pour un défilé, une campagne publicitaire ou un film, nous gérons le processus de casting de A à Z. Nous organisons également des événements mode clés en main, comme le Perfect Fashion Day.' },
    { icon: 'ScaleIcon', title: 'Prestige & Conseil en Image', description: 'Nous façonnons des marques personnelles fortes pour nos talents et clients. Ce service inclut le media training, le développement du style personnel et des stratégies de communication pour un positionnement haut de gamme et une visibilité accrue.', isComingSoon: true },
    { icon: 'GlobeAltIcon', title: 'Placement International', description: 'Grâce à notre réseau en expansion, nous préparons et positionnons nos mannequins les plus prometteurs sur les marchés internationaux. Notre objectif est de leur ouvrir les portes des grandes capitales de la mode : Paris, Milan, New York et Londres.', isComingSoon: true },
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