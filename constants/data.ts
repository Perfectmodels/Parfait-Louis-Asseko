// FIX: Replaced placeholder text with actual data structures and exports.
import { 
    Model, 
    FashionDayEvent, 
    Service, 
    AchievementCategory, 
    ModelDistinction, 
    Testimonial, 
    ContactInfo, 
    SiteImages, 
    Partner, 
    ApiKeys, 
    CastingApplication, 
    FashionDayApplication, 
    NewsItem, 
    ForumThread, 
    ForumReply, 
    ArticleComment 
} from '../types';
import { NavLink } from '../hooks/useDataStore';

export const siteConfig = {
  logo: 'https://i.ibb.co/6y3641Y/PMM-Logo-Transparent-Gold.png'
};

export const navLinks: NavLink[] = [
  { path: '/', label: 'Accueil', inFooter: true, footerLabel: 'Accueil' },
  { path: '/agence', label: 'Agence', inFooter: true, footerLabel: "L'Agence" },
  { path: '/mannequins', label: 'Mannequins', inFooter: true, footerLabel: 'Nos Mannequins' },
  { path: '/fashion-day', label: 'Fashion Day', inFooter: true, footerLabel: 'Perfect Fashion Day' },
  { path: '/magazine', label: 'Magazine', inFooter: true, footerLabel: 'Magazine' },
  { path: '/services', label: 'Services', inFooter: true, footerLabel: 'Nos Services' },
  { path: '/formations', label: 'Classroom', inFooter: false },
  { path: '/contact', label: 'Contact', inFooter: true, footerLabel: 'Contact' },
];

export const socialLinks = {
  facebook: 'https://www.facebook.com/perfectmodelsmanagement',
  instagram: 'https://www.instagram.com/perfectmodelsmanagement',
  youtube: 'https://www.youtube.com/@perfectmodelsmanagementtv'
};

export const contactInfo: ContactInfo = {
  email: 'contact@perfectmodels.ga',
  phone: '+241 74 00 00 00',
  address: 'Libreville, Gabon (Ancien Sobraga)'
};

export const siteImages: SiteImages = {
  hero: 'https://i.ibb.co/TBt9FBSv/AJC-4630.jpg',
  about: 'https://i.ibb.co/mCcD1Gfq/DSC-0272.jpg',
  fashionDayBg: 'https://i.ibb.co/C5rcPJHz/titostyle-53.jpg',
  agencyHistory: 'https://i.ibb.co/M8Vv9yH/team-photo.jpg',
  classroomBg: 'https://i.ibb.co/Q8QfV5D/classroom-bg.jpg',
  castingBg: 'https://i.ibb.co/9vGzGz5/casting-poster.jpg',
};

export const apiKeys: ApiKeys = {
  resendApiKey: ''
};

export const agencyInfo = {
  about: {
    p1: "Fondée en 2021 à Libreville par Parfait Asseko, Perfect Models Management est bien plus qu'une simple agence. C'est un berceau de talents, une plateforme dédiée à la valorisation et à l'accompagnement des mannequins qui façonneront l'avenir de la mode africaine.",
    p2: "Notre mission est de découvrir, former et propulser des profils uniques sur la scène nationale et internationale, en alliant professionnalisme, éthique et une profonde compréhension des enjeux de l'industrie."
  },
  values: [
    { name: 'Excellence', description: 'Nous visons les plus hauts standards dans tout ce que nous entreprenons.' },
    { name: 'Intégrité', description: 'Nous opérons avec transparence, honnêteté et respect.' },
    { name: 'Développement', description: 'Nous nous engageons à former et faire grandir nos talents.' },
    { name: 'Passion', description: "La mode est notre passion, et nous la partageons avec énergie." }
  ]
};

export const modelDistinctions: ModelDistinction[] = [
  { name: "Miss Gabon", titles: ["Noemi Kim - Miss Gabon 2024"] },
  { name: "Mister Gabon", titles: ["Andy Boussengui - 2ème Dauphin 2024"] },
  { name: "Miss Supranational", titles: ["Noemi Kim - Représentante du Gabon"] },
  { name: "Top Model International", titles: ["Plusieurs de nos mannequins finalistes"] }
];

export const agencyTimeline = [
  { year: "2021", event: "Création de l'agence Perfect Models Management." },
  { year: "2022", event: "Première participation majeure à un événement de mode national." },
  { year: "2024", event: "Lancement de la plateforme de formation 'PMM Classroom'." },
  { year: "2025", event: "Organisation de la première édition du Perfect Fashion Day." }
];

export const agencyServices: Service[] = [
  { icon: 'UserGroupIcon', title: 'Management de Mannequins', description: 'Gestion de carrière complète, booking et placement national et international.' },
  { icon: 'AcademicCapIcon', title: 'Formation Professionnelle', description: 'Programme PMM Classroom pour maîtriser toutes les facettes du métier.' },
  { icon: 'CameraIcon', title: 'Production de Contenus', description: "Organisation de shootings, lookbooks et campagnes publicitaires." },
  { icon: 'SparklesIcon', title: 'Direction Événementielle', description: "Conception et organisation d'événements de mode (défilés, lancements)." },
  { icon: 'ScaleIcon', title: 'Conseil en Image', description: 'Accompagnement personnalisé pour développer le personal branding de nos talents.' },
  { icon: 'GlobeAltIcon', title: 'Scouting & Casting', description: "Détection de nouveaux talents et organisation de castings sur mesure." }
];

export const agencyAchievements: AchievementCategory[] = [
    { name: 'Défilés de Mode', items: ['Fashion Week de Libreville', 'Gabon Fashion Tour', 'N’Koussou Fashion Show', 'Black and white Fashion Show'] },
    { name: 'Collaborations Marques', items: ['Brand’O', 'AG Style', 'Farel MD', 'Miguel Fashion Style', 'Tito Style', 'Jek Style'] },
    { name: 'Campagnes Publicitaires', items: ['Airtel Gabon', 'Castel Beer', 'Prime-Rose', 'Prestige'] },
    { name: 'Événementiel', items: ["Organisation du Perfect Fashion Day", "Prestations d'hôtesses pour conférences", "Participation aux événements culturels majeurs"] }
];

export const agencyPartners: Partner[] = [
  { name: "La Cour des Grands" },
  { name: "Le Boti" },
  { name: "La Voie du Mannequinat" },
  { name: "Trace Gabon" },
  { name: "NR Picture" }
];

export const testimonials: Testimonial[] = [
  { name: 'Noemi Kim', role: 'Mannequin & Miss Gabon 2024', quote: 'PMM a été un véritable tremplin. Leur formation et leur soutien m\'ont permis d\'atteindre des objectifs que je n\'osais même pas imaginer.', imageUrl: 'https://i.ibb.co/mCcD1Gfq/DSC-0272.jpg' },
  { name: 'Farel MD', role: 'Créateur de Mode', quote: "Travailler avec les mannequins de Perfect Models est un gage de professionnalisme. Ils comprennent la vision du créateur et savent sublimer chaque pièce.", imageUrl: 'https://i.ibb.co/Rk1fG3ph/farelmd-37.jpg' },
  { name: 'NR Picture', role: 'Photographe de Mode', quote: 'La rigueur et la polyvalence des modèles de l\'agence facilitent grandement le processus créatif. Chaque shooting est une réussite.', imageUrl: 'https://i.ibb.co/5LqH5jP/nrpicture-logo.jpg' }
];

export const models: Model[] = [
    {
      id: 'noemi-kim-1',
      name: 'Noemi Kim',
      username: 'Man-PMMN01',
      password: 'noemi2024',
      email: 'noemi.kim@example.com',
      age: 22,
      height: '1m78',
      gender: 'Femme',
      location: 'Libreville',
      imageUrl: 'https://i.ibb.co/mCcD1Gfq/DSC-0272.jpg',
      distinctions: ['Miss Gabon 2024', 'Finaliste Miss Supranational'],
      measurements: { chest: '85cm', waist: '62cm', hips: '90cm', shoeSize: '40' },
      categories: ['Défilé', 'Éditorial', 'Beauté'],
      experience: 'Mannequin international avec une expérience significative dans les défilés de haute couture et les campagnes beauté. A représenté le Gabon dans plusieurs compétitions internationales.',
      journey: 'Découverte lors d\'un casting national, Noemi a rapidement gravi les échelons grâce à sa discipline et sa présence captivante. Elle est aujourd\'hui une figure emblématique de la mode gabonaise.',
      quizScores: { 'module-1-les-fondamentaux-du-mannequinat': 100, 'module-2-techniques-de-podium-catwalk': 95 }
    },
    {
      id: 'aj-caramela-2',
      name: 'AJ Caramela',
      username: 'Man-PMMA01',
      password: 'aj2024',
      email: 'aj.caramela@example.com',
      age: 24,
      height: '1m75',
      gender: 'Femme',
      location: 'Libreville',
      imageUrl: 'https://i.postimg.cc/k5skXhC2/NR-09474.jpg',
      distinctions: ['Top Model Afrique Centrale 2023'],
      measurements: { chest: '88cm', waist: '64cm', hips: '94cm', shoeSize: '39' },
      categories: ['Commercial', 'Éditorial'],
      experience: 'Spécialisée dans les éditoriaux de mode audacieux et les campagnes publicitaires à fort impact. Connue pour sa polyvalence et son expressionnisme devant l\'objectif.',
      journey: 'AJ a commencé sa carrière en tant que mannequin commercial avant de se distinguer par son style unique qui a séduit les photographes de mode les plus en vue.',
      quizScores: { 'module-1-les-fondamentaux-du-mannequinat': 90 }
    },
];
export const castingApplications: CastingApplication[] = [];
export const fashionDayApplications: FashionDayApplication[] = [];
export const newsItems: NewsItem[] = [
    {
        id: 'pfd-edition-2',
        title: "Lancement des candidatures pour le Perfect Fashion Day - Édition 2",
        date: "2025-07-15",
        imageUrl: "https://i.ibb.co/C5rcPJHz/titostyle-53.jpg",
        excerpt: "Stylistes, photographes, partenaires : l'aventure de la deuxième édition du Perfect Fashion Day commence maintenant. Rejoignez-nous pour célébrer la mode gabonaise !",
        link: "/fashion-day"
    },
    {
        id: 'grand-casting-2025',
        title: "Grand Casting National 2025 : Saisissez votre chance !",
        date: "2025-08-01",
        imageUrl: "https://i.ibb.co/9vGzGz5/casting-poster.jpg",
        excerpt: "Perfect Models Management recherche ses nouveaux visages. Découvrez les dates, lieux et conditions pour lancer votre carrière de mannequin.",
        link: "/casting"
    },
    {
        id: 'noemi-kim-miss-gabon',
        title: "Félicitations à Noemi Kim, Miss Gabon 2024 !",
        date: "2024-11-20",
        imageUrl: "https://i.ibb.co/mCcD1Gfq/DSC-0272.jpg",
        excerpt: "Toute l'agence est fière de notre mannequin Noemi Kim, couronnée Miss Gabon 2024. Une reconnaissance de son talent, de sa discipline et de sa grâce.",
        link: "/magazine/noemi-kim-au-dela-du-podium"
    }
];
export const fashionDayEvents: FashionDayEvent[] = [
    {
        edition: 2,
        date: "Février 2026 (Date à confirmer)",
        theme: "L'Art de Se Révéler",
        description: "La deuxième édition du Perfect Fashion Day explorera l'identité, la transformation et l'affirmation de soi à travers la mode. Un voyage introspectif et audacieux au cœur de la création gabonaise. Nous sommes à la recherche de talents visionnaires pour donner vie à ce thème puissant.",
        location: "Lieu à confirmer",
        promoter: "Parfait Asseko"
    },
    {
        edition: 1,
        date: "10 Février 2025",
        theme: "Racines & Modernité",
        location: "La Gare du Nord, Libreville",
        mc: "Marius CK",
        promoter: "Parfait Asseko",
        stylists: [
            { name: "AG Style", description: "L'élégance ethnique revisitée", images: ['https://i.ibb.co/sKqS0gH/agstyle-1.jpg', 'https://i.ibb.co/Y0cGJQf/agstyle-2.jpg'] },
            { name: "Brand’O", description: "L'énergie flamboyante du streetwear de luxe", images: ['https://i.ibb.co/9gJ2dY5/brando-1.jpg'] },
            { name: "Miguel Fashion Style", description: "Le sur-mesure masculin sublimé", images: ['https://i.ibb.co/Wc17t7p/miguel-1.jpg'] }
        ],
        featuredModels: ["Noemi Kim", "AJ Caramela", "Andy Boussengui"],
        artists: ["Lady Riaba", "Les Miss du Gabon"],
        partners: [{ type: "Sponsor Principal", name: "Trace Gabon" }, { type: "Partenaire Média", name: "Gabon 24" }],
        description: "La première édition a célébré le talent des créateurs locaux et la beauté des mannequins de l'agence, en explorant le dialogue entre héritage culturel et esthétique contemporaine."
    }
];

export const forumThreads: ForumThread[] = [];
export const forumReplies: ForumReply[] = [];
export const articleComments: ArticleComment[] = [];