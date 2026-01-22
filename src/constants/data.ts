
// FIX: Removed BeginnerStudent from import as the type is deprecated.
import { Service, AchievementCategory, ModelDistinction, Testimonial, ContactInfo, SiteImages, Partner, ApiKeys, CastingApplication, FashionDayApplication, NewsItem, FashionDayEvent, ForumThread, ForumReply, ArticleComment, RecoveryRequest, JuryMember, RegistrationStaff, BookingRequest, ContactMessage, SocialLinks, FAQCategory, Absence, MonthlyPayment, PhotoshootBrief, NavLink, HeroSlide, FashionDayReservation } from '../types';

export const siteConfig = {
  logo: 'https://placehold.co/200x80/000000/D4AF37?text=PMM',
};

export const navLinks: NavLink[] = [
  { path: '/', label: 'Accueil', inFooter: true },
  { path: '/agence', label: 'Agence', inFooter: true },
  { path: '/mannequins', label: 'Mannequins', inFooter: true },
  { path: '/galerie', label: 'Galerie', inFooter: true },
  { path: '/fashion-day', label: 'PFD', inFooter: true, footerLabel: 'Perfect Fashion Day' },
  { path: '/magazine', label: 'Magazine', inFooter: true },
  { path: '/services', label: 'Services', inFooter: true },
  { path: '/contact', label: 'Contact', inFooter: true },
  { path: '/formations', label: 'Classroom', inFooter: false },
];

export const socialLinks: SocialLinks = {
  facebook: 'https://www.facebook.com/perfectmodels.ga/',
  instagram: 'https://www.instagram.com/perfectmodels.ga/',
  youtube: 'https://www.youtube.com/@PMM241',
};

export const contactInfo: ContactInfo = {
  email: 'contact@perfectmodels.ga',
  phone: '+241 77 50 79 50',
  address: 'Libreville, Gabon',
  notificationEmail: 'contact@perfectmodels.ga',
};

export const siteImages: SiteImages = {
  hero: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1920&auto=format&fit=crop',
  about: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop',
  fashionDayBg: 'https://images.unsplash.com/photo-1509631179647-0177f4547d4c?q=80&w=1000&auto=format&fit=crop',
  agencyHistory: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop',
  classroomBg: 'https://images.unsplash.com/photo-1540206276207-3af25c08abc4?q=80&w=1000&auto=format&fit=crop',
  castingBg: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
};

export const apiKeys: ApiKeys = {
  resendApiKey: 're_12345678_abcdefghijklmnopqrstuvwxyz',
  formspreeEndpoint: 'https://formspree.io/f/xovnyqnz',
  firebaseDynamicLinks: {
    webApiKey: "AIzaSyB_jjJEXU7yvJv49aiPCJqEZgiyfJEJzrg",
    domainUriPrefix: 'https://perfectmodels.page.link'
  },
  imgbbApiKey: '59f0176178bae04b1f2cbd7f5bc03614',
  brevoApiKey: 'VOTRE_CLÉ_API_BREVO_ICI',
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

export { models } from './modelsData';

export const testimonials: Testimonial[] = [
  {
    name: 'Franck B.',
    role: 'Créateur de Mode',
    quote: "Collaborer avec Perfect Models Management est un gage de professionnalisme. Leurs mannequins sont non seulement magnifiques mais aussi incroyablement bien formés et ponctuels. Un vrai plaisir.",
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Nadia K.',
    role: 'Directrice Artistique',
    quote: "L'agence a un œil incroyable pour dénicher des talents uniques. Leur catalogue est diversifié et répond perfectly aux besoins créatifs de nos campagnes publicitaires.",
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Noemi Kim',
    role: 'Mannequin de l\'agence',
    quote: "PMM est bien plus qu'une agence, c'est une famille qui nous pousse à donner le meilleur de nous-mêmes. La formation et l'encadrement sont exceptionnels.",
    imageUrl: 'https://placehold.co/400x600/101010/D4AF37?text=Noemi+Kim',
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
// FIX: Removed beginnerStudents array as the feature is deprecated.



export const newsItems: NewsItem[] = [
  { id: '1', title: "Grand Casting Annuel", date: '2025-09-06', imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop', excerpt: "Nous recherchons les prochains visages de la mode. Préparez-vous pour notre grand casting national.", link: '/casting-formulaire' },
  { id: '2', title: "Perfect Fashion Day Édition 2", date: '2025-02-08', imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177f4547d4c?q=80&w=1000&auto=format&fit=crop', excerpt: "La seconde édition de notre événement mode phare approche à grands pas. Découvrez le thème et les créateurs.", link: '/fashion-day' },
  { id: '3', title: "Nouveaux Talents 2024", date: '2024-08-15', imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop', excerpt: "L'agence est fière d'accueillir trois nouveaux mannequins prometteurs dans ses rangs.", link: '/mannequins' },
];

export const fashionDayEvents: FashionDayEvent[] = [
  {
    edition: 1,
    date: "2025-01-25T18:00:00",
    theme: "Racines et Modernité",
    location: "La Gare du Nord – Hôtel Restaurant Bar Casino, Carrefour Acaé",
    promoter: "Parfait Asseko",
    description: "La 1ère Édition de la Perfect Fashion Day a tenu toutes ses promesses en réunissant mode, art, culture et professionnalisme. Le thème « Racines et Modernité » a permis d’explorer la richesse de la culture gabonaise tout en ouvrant un dialogue avec les tendances contemporaines, posant ainsi les bases solides d’un événement de référence pour la mode gabonaise.",
    stylists: [
      {
        name: "AG Style",
        description: "Un mélange parfait de tradition et de modernité.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ]
      },
      {
        name: "Farel MD",
        description: "Élégance masculine & attitude.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ]
      },
      {
        name: "Ventex Custom",
        description: "Une prestation haute en audace et en style.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ]
      },
      {
        name: "Miguel Fashion Style",
        description: "La finesse sur-mesure.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ]
      },
      {
        name: "Faran",
        description: "Parade des Miss du Gabon.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ]
      },
      {
        name: "Madame Luc (Abiale)",
        description: "Une allure élégante et intemporelle.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ]
      },
      {
        name: "Brand’O",
        description: "Une énergie flamboyante au podium.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ]
      },
      {
        name: "Tito Style",
        description: "Audace urbaine & inspiration afro.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ]
      },
      {
        name: "Edele A",
        description: "Le final tout en poésie.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
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
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day", "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
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
    date: "2026-01-31T20:00:00",
    theme: "L’Art de se révéler",
    location: "Gare du Nord, Libreville",
    promoter: "Parfait Asseko",
    description: "Cette édition symbolise le passage de la chrysalide au papillon. C'est le moment précis où l'on décide de laisser tomber les masques sociaux pour laisser transparaître son identité profonde. Une odyssée authentique célébrant l'audace créative et l'excellence.",
    stylists: [
      { name: "Rabibi", description: "Bloc 1 : L'Éveil", images: [] },
      { name: "Najmi", description: "Bloc 1 : L'Éveil", images: [] },
      { name: "Pretty Little Hook", description: "Bloc 1 : L'Éveil", images: [] },
      { name: "Ventex", description: "Bloc 2 : L'Éclosion", images: [] },
      { name: "Racines", description: "Bloc 2 : L'Éclosion", images: [] },
      { name: "Maeva Creations", description: "Bloc 2 : L'Éclosion", images: [] },
      { name: "Miguel Fashion Style", description: "Bloc 3 : L'Expression", images: [] },
      { name: "Nan's Ethnik", description: "Bloc 3 : L'Expression", images: [] },
      { name: "Cyrlie Fashion", description: "Bloc 3 : L'Expression", images: [] },
      { name: "BKD Empire", description: "Bloc 4 : L'Apothéose", images: [] },
      { name: "Tito Style", description: "Bloc 4 : L'Apothéose", images: [] },
      { name: "Edele A", description: "Invitée d'Honneur", images: [] }
    ],
    featuredModels: [],
    artists: [
      {
        name: 'Lady Riaba',
        description: 'Maîtresse de Cérémonie & Performance Slam',
        images: []
      }
    ],
    partners: [
      { type: "Partenaire Officiel", name: "Yarden Hotel" },
      { type: "Partenaire Officiel", name: "Legrand TV" },
      { type: "Partenaire Officiel", name: "Darain Visuals" },
      { type: "Partenaire Officiel", name: "Symbiose" },
      { type: "Partenaire Officiel", name: "Vitri Clean" },
      { type: "Partenaire Officiel", name: "Indi Hair" }
    ]
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

export const heroSlides: HeroSlide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1920&auto=format&fit=crop',
    title: 'L\'Élégance Redéfinie',
    subtitle: 'Au cœur de la mode africaine, nous sculptons les carrières et célébrons la beauté sous toutes ses formes.',
    buttonText: 'Devenir Mannequin',
    buttonLink: '/casting-formulaire',
    secondButtonText: 'Découvrir l\'Agence',
    secondButtonLink: '/agence',
    order: 1
  }
];


export const fashionDayReservations: FashionDayReservation[] = [];
