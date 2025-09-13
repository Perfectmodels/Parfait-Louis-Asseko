// FIX: Add BeginnerStudent to import
import { Model, Service, AchievementCategory, ModelDistinction, Testimonial, ContactInfo, SiteImages, Partner, ApiKeys, CastingApplication, FashionDayApplication, NewsItem, FashionDayEvent, ForumThread, ForumReply, ArticleComment, RecoveryRequest, JuryMember, RegistrationStaff, BookingRequest, ContactMessage, BeginnerStudent, SocialLinks, Artist } from '../types';
import { NavLink } from '../hooks/useDataStore';
// FIX: Import beginner course data
import { beginnerCourseData } from './beginnerCourseData';

export const siteConfig = {
  logo: '/assets/t-shirt.png',
};

export const navLinks: NavLink[] = [
  { path: '/', label: 'Accueil', inFooter: true },
  { path: '/agence', label: 'Agence', inFooter: true },
  { path: '/mannequins', label: 'Mannequins', inFooter: true },
  { path: '/fashion-day', label: 'PFD', inFooter: true, footerLabel: 'Perfect Fashion Day' },
  { path: '/magazine', label: 'Magazine', inFooter: true },
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
    hero: '/assets/hero-bg.jpg',
    about: '/assets/about-img.jpg',
    fashionDayBg: '/assets/titostyle-53.jpg',
    agencyHistory: '/assets/agency-history.jpg',
    classroomBg: '/assets/ajc-4630.jpg',
    castingBg: '/assets/casting-bg.jpg',
};

export const apiKeys: ApiKeys = {
    resendApiKey: 're_12345678_abcdefghijklmnopqrstuvwxyz',
    formspreeEndpoint: 'https://formspree.io/f/xovnyqnz',
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
        // FIX: Add level property for data consistency.
        level: 'Pro',
        email: 'noemi.kim@example.com',
        phone: '+241077000001',
        age: 22,
        height: '1m78',
        gender: 'Femme',
        location: 'Libreville',
        imageUrl: '/assets/dsc-0272.jpg',
        portfolioImages: [
            '/assets/casting-bg.jpg',
            '/assets/hero-bg.jpg',
            '/assets/titostyle-53.jpg',
        ],
        distinctions: [
            { name: "Palmarès National & International", titles: ["Miss Gabon 2022", "Top Model Afrique Centrale 2023"] }
        ],
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
        // FIX: Add level property for data consistency.
        level: 'Pro',
        height: '1m75',
        gender: 'Femme',
        imageUrl: '/assets/nr-09474.jpg',
        portfolioImages: [
            '/assets/nr-09484.jpg',
            '/assets/nr-09503-modifier.jpg',
            '/assets/nr-09474.jpg',
        ],
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
        // FIX: Add level property for data consistency.
        level: 'Pro',
        height: '1m88',
        gender: 'Homme',
        imageUrl: '/assets/farelmd-37.jpg',
        portfolioImages: [
             '/assets/ajc-4630.jpg',
        ],
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
        imageUrl: '/assets/testimonial-1.jpg',
    },
    {
        name: 'Nadia K.',
        role: 'Directrice Artistique',
        quote: "L'agence a un œil incroyable pour dénicher des talents uniques. Leur catalogue est diversifié et répond parfaitement aux besoins créatifs de nos campagnes publicitaires.",
        imageUrl: '/assets/testimonial-2.jpg',
    },
    {
        name: 'Noemi Kim',
        role: 'Mannequin de l\'agence',
        quote: "PMM est bien plus qu'une agence, c'est une famille qui nous pousse à donner le meilleur de nous-mêmes. La formation et l'encadrement sont exceptionnels.",
        imageUrl: '/assets/dsc-0272.jpg',
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
// FIX: Add beginnerStudents array and export beginnerCourseData
export const beginnerStudents: BeginnerStudent[] = [];
export { beginnerCourseData };


export const newsItems: NewsItem[] = [
    { id: '1', title: "Grand Casting Annuel", date: '2025-09-06', imageUrl: '/assets/casting-bg.jpg', excerpt: "Nous recherchons les prochains visages de la mode. Préparez-vous pour notre grand casting national.", link: '/casting-formulaire' },
    { id: '2', title: "Perfect Fashion Day Édition 2", date: '2025-02-08', imageUrl: '/assets/titostyle-53.jpg', excerpt: "La seconde édition de notre événement mode phare approche à grands pas. Découvrez le thème et les créateurs.", link: '/fashion-day' },
    { id: '3', title: "Nouveaux Talents 2024", date: '2024-08-15', imageUrl: '/assets/about-img.jpg', excerpt: "L'agence est fière d'accueillir trois nouveaux mannequins prometteurs dans ses rangs.", link: '/mannequins' },
];

export const fashionDayEvents: FashionDayEvent[] = [
  {
    edition: 1,
    date: '8 Février 2025',
    theme: 'Racines & Modernité',
    location: 'La Gare du Nord, Libreville',
    description: 'La première édition du Perfect Fashion Day a célébré le talent des créateurs locaux et la beauté des mannequins de l\'agence dans un cadre prestigieux.',
    stylists: [
        { name: 'AG Style', description: 'Tradition revisitée', images: ['/assets/about-img.jpg'] },
        { name: 'Brand’O', description: 'Énergie flamboyante', images: [] },
        { name: 'Miguel Fashion Style', description: 'Finesse sur-mesure', images: [] }
    ],
    featuredModels: ['Noemi Kim', 'AJ Caramela', 'Yann Aubin'],
    artists: [
        { 
            name: 'Lady Riaba (Poésie)', 
            description: 'Performance poétique envoûtante', 
            images: [
                'https://i.ibb.co/JRs6P128/ladyriaba-1.jpg',
                'https://i.ibb.co/Kx1WMT87/ladyriaba-5.jpg',
                'https://i.ibb.co/x8mGQcCG/ladyriaba-6.jpg',
                'https://i.ibb.co/zhj0xKNN/ladyriaba-8.jpg',
                'https://i.ibb.co/Fq4NQ0gN/ladyriaba-10.jpg',
                'https://i.ibb.co/Cp50mQwn/ladyriaba-14.jpg',
                'https://i.ibb.co/Cs3pHkbD/ladyriaba-20.jpg',
                'https://i.ibb.co/hRFn9tyT/ladyriaba-22.jpg',
                'https://i.ibb.co/rfLBb0t3/ladyriaba-26.jpg',
                'https://i.ibb.co/WCYYHQ1/ladyriaba-28.jpg'
            ] 
        }
    ],
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

// FIX: Replace the old agencyServices array with a more detailed and categorized version for the new Services page.
export const agencyServices: Service[] = [
  // ----------- Services Mannequinat ----------- //
  {
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

  // ----------- Services Mode et Stylisme ----------- //
  {
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

  // ----------- Services Événementiels ----------- //
  {
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
    title: "Présentateurs / Hôtes de Cérémonie",
    description: "Hôtes professionnels pour introduire vos défilés et événements.",
    icon: "MicrophoneIcon",
    buttonText: "Réserver ce service",
    buttonLink: "/contact?service=Pr%C3%A9sentateurs+%2F+H%C3%B4tes+de+C%C3%A9r%C3%A9monie",
    category: "Services Événementiels"
  },
  {
    title: "Promotion et Communication",
    description: "Couverture complète de vos événements et projets sur réseaux sociaux et médias partenaires.",
    icon: "ChatBubbleLeftRightIcon",
    buttonText: "Réserver ce service",
    buttonLink: "/contact?service=Promotion+et+Communication",
    category: "Services Événementiels"
  },
  {
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