
// FIX: Removed BeginnerStudent from import as the type is deprecated.
import { Service, AchievementCategory, ModelDistinction, Testimonial, ContactInfo, SiteImages, Partner, ApiKeys, CastingApplication, FashionDayApplication, NewsItem, FashionDayEvent, ForumThread, ForumReply, ArticleComment, RecoveryRequest, JuryMember, RegistrationStaff, BookingRequest, ContactMessage, SocialLinks, FAQCategory, Absence, MonthlyPayment, PhotoshootBrief, NavLink, HeroSlide, FashionDayReservation } from '../types';

export const siteConfig = {
  logo: "https://i.ibb.co/NdrpzGpm/blob.jpg"
};

export const navLinks: NavLink[] = [
  {
    id: "0",
    inFooter: true,
    label: "Accueil",
    path: "/"
  },
  {
    id: "1",
    inFooter: true,
    label: "Agence",
    path: "/agence"
  },
  {
    id: "2",
    inFooter: true,
    label: "Mannequins",
    path: "/mannequins"
  },
  {
    id: "3",
    footerLabel: "Perfect Fashion Day",
    inFooter: true,
    label: "PFD",
    path: "/fashion-day"
  },
  {
    id: "4",
    inFooter: true,
    label: "Magazine",
    path: "/magazine"
  },
  {
    id: "5",
    inFooter: true,
    label: "Galerie",
    path: "/galerie"
  },
  {
    id: "6",
    inFooter: true,
    label: "Services",
    path: "/services"
  },
  {
    id: "7",
    inFooter: true,
    label: "Contact",
    path: "/contact"
  },
  {
    id: "8",
    inFooter: false,
    label: "Classroom",
    path: "/formations"
  }
];

export const socialLinks: SocialLinks = {
  facebook: "https://www.facebook.com/perfectmodels.ga/",
  instagram: "https://www.instagram.com/perfectmodels.ga/",
  youtube: "https://www.youtube.com/@PMM241"
};

export const contactInfo: ContactInfo = {
  address: "Ancien Sobraga, Libreville, Gabon",
  email: "Contact@perfectmodels.ga",
  phone: "+241 077507950"
};

export const siteImages: SiteImages = {
  about: "https://i.ibb.co/jH0YvJg/agency-history.jpg",
  agencyHistory: "https://i.ibb.co/jH0YvJg/agency-history.jpg",
  castingBg: "https://i.ibb.co/z5TzL2M/casting-bg.jpg",
  classroomBg: "https://i.ibb.co/WpyDyqGM/480764039-617423107808701-5578356664870683876-n.jpg",
  contactBg: "https://i.ibb.co/WpyDyqGM/480764039-617423107808701-5578356664870683876-n.jpg",
  fashionDayBg: "https://i.ibb.co/C5rcPJHz/titostyle-53.jpg",
  hero: "https://i.ibb.co/z5TzL2M/casting-bg.jpg",
  magazineBg: "https://i.ibb.co/C5rcPJHz/titostyle-53.jpg",
  modelsBg: "https://i.postimg.cc/k5skXhC2/NR-09474.jpg",
  servicesBg: "https://i.ibb.co/ksdXSfpY/474134983-590912627126416-4665446951991920838-n.jpg"
};

export const apiKeys: ApiKeys = {
  // Configured via environment variables (VITE_RESEND_API_KEY, etc.)
  // See .env.example
  resendApiKey: import.meta.env.VITE_RESEND_API_KEY || '',
  formspreeEndpoint: import.meta.env.VITE_FORMSPREE_ENDPOINT || '',
  firebaseDynamicLinks: {
    webApiKey: import.meta.env.VITE_FIREBASE_DYNAMIC_LINKS_API_KEY || '',
    domainUriPrefix: import.meta.env.VITE_FIREBASE_DYNAMIC_LINKS_DOMAIN || ''
  },
  imgbbApiKey: import.meta.env.VITE_IMGBB_API_KEY || '',
  brevoApiKey: import.meta.env.VITE_BREVO_API_KEY || ''
};

export const juryMembers: JuryMember[] = [
  {
    id: "jury1",
    name: "Martelly",
    password: "password2025",
    username: "jury1"
  },
  {
    id: "jury2",
    name: "Darain",
    password: "password2025",
    username: "jury2"
  },
  {
    id: "jury4",
    name: "Sadia",
    password: "password2025",
    username: "jury4"
  },
  {
    id: "jury1",
    name: "Martelly",
    password: "password2025",
    username: "jury1"
  },
  {
    id: "jury2",
    name: "Darain",
    password: "password2025",
    username: "jury2"
  },
  {
    id: "jury4",
    name: "Sadia",
    password: "password2025",
    username: "jury4"
  }
];

export const registrationStaff: RegistrationStaff[] = [
  {
    id: "reg1",
    name: "Sephora",
    password: "password2025",
    username: "enregistrement1"
  },
  {
    id: "reg2",
    name: "Aimée",
    password: "password2025",
    username: "enregistrement2"
  },
  {
    id: "reg3",
    name: "Duchesse",
    password: "password2025",
    username: "enregistrement3"
  },
  {
    id: "reg4",
    name: "Sephra",
    password: "password2025",
    username: "enregistrement4"
  },
  {
    id: "reg1",
    name: "Sephora",
    password: "password2025",
    username: "enregistrement1"
  },
  {
    id: "reg2",
    name: "Aimée",
    password: "password2025",
    username: "enregistrement2"
  },
  {
    id: "reg3",
    name: "Duchesse",
    password: "password2025",
    username: "enregistrement3"
  },
  {
    id: "reg4",
    name: "Sephra",
    password: "password2025",
    username: "enregistrement4"
  }
];

export { models } from './modelsData';

export const testimonials: Testimonial[] = [
  {
    id: "0",
    imageUrl: "https://i.ibb.co/mCcD1Gfq/DSC-0272.jpg",
    name: "Noemi Kim",
    quote: "Perfect Models Management n'est pas juste une agence, c'est une famille. L'encadrement et les formations m'ont permis de prendre confiance en moi et de viser l'international. Je leur dois beaucoup.",
    role: "Mannequin Phare"
  },
  {
    id: "1",
    imageUrl: "https://i.ibb.co/b5LgVZgr/DSC-0090.jpg",
    name: "Donatien Bonoukpo Anani",
    quote: "Grâce à la discipline et au professionnalisme inculqués par l'agence, j'ai pu participer à des défilés majeurs. C'est un tremplin incroyable pour tout jeune qui veut réussir dans ce métier.",
    role: "Mannequin Homme"
  },
  {
    id: "2",
    imageUrl: "https://i.ibb.co/Rk1fG3ph/farelmd-37.jpg",
    name: "Farel MD",
    quote: "Collaborer avec Perfect Models Management sur le Perfect Fashion Day a été une expérience exceptionnelle. Leurs mannequins sont d'un professionnalisme rare et savent sublimer chaque création.",
    role: "Styliste Partenaire"
  },
  {
    id: "3",
    imageUrl: "https://i.ibb.co/WpyDyqGM/480764039_617423107808701_5578356664870683876_n.jpg",
    name: "AJ Caramela",
    quote: "L'agence nous pousse à donner le meilleur de nous-mêmes, tout en veillant à notre bien-être. Le Classroom est un outil de formation incroyable qui nous prépare à tous les aspects du métier.",
    role: "Mannequin Femme"
  },
  {
    id: "4",
    imageUrl: "https://i.ibb.co/LDm73BY2/ventex-44.jpg",
    name: "La Gare du Nord",
    quote: "Accueillir le Perfect Fashion Day a été un honneur. L'organisation était impeccable et l'événement a apporté un vent de fraîcheur et d'élégance. Nous sommes fiers de soutenir PMM.",
    role: "Partenaire Événementiel"
  },
  {
    id: "5",
    imageUrl: "https://i.ibb.co/ksdXSfpY/474134983_590912627126416_4665446951991920838_n.jpg",
    name: "Kendra Mebiame",
    quote: "Être reconnue 'Meilleur Mannequin Espoir' a été possible grâce au soutien constant de l'agence. Ils croient en nous et nous donnent les outils pour réaliser nos rêves.",
    role: "Meilleur Mannequin Espoir 2022"
  },
  {
    id: "6",
    imageUrl: "https://i.ibb.co/CKS5WvvW/jinayah-conceptstore-03-07-2025-0003.jpg",
    name: "Cassandra IBOUANGA",
    quote: "Perfect Models Management m'a vraiement permis de me decouvrir, j'ai reussi a me surpasser et remporter le concours Edydy Gabon grace a leur suivi.",
    role: "Mannequin PMM"
  },
  {
    id: "doc_1769191870607",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    name: "Nadia K.",
    quote: "L'agence a un œil incroyable pour dénicher des talents uniques. Leur catalogue est diversifié et répond perfectly aux besoins créatifs de nos campagnes publicitaires.",
    role: "Directrice Artistique"
  },
  {
    id: "doc_1769191870608",
    imageUrl: "https://placehold.co/400x600/101010/D4AF37?text=Noemi+Kim",
    name: "Noemi Kim",
    quote: "PMM est bien plus qu'une agence, c'est une famille qui nous pousse à donner le meilleur de nous-mêmes. La formation et l'encadrement sont exceptionnels.",
    role: "Mannequin de l'agence"
  },
  {
    id: "doc_1769191927911",
    imageUrl: "https://placehold.co/400x600/101010/D4AF37?text=Noemi+Kim",
    name: "Noemi Kim",
    quote: "PMM est bien plus qu'une agence, c'est une famille qui nous pousse à donner le meilleur de nous-mêmes. La formation et l'encadrement sont exceptionnels.",
    role: "Mannequin de l'agence"
  }
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
  {
    id: "dorcas-moira-saphou-pmm-son-ticket-pour-top-models-fima-est-valid-1760533360327",
    date: "2025-10-15",
    excerpt: "\nC'est officiel : le ticket de Dorcas Moira SAPHOU (PMM) pour la prestigieuse compétition Top Models FIMA est validé, marquant une étape clé dans son parcours.\ntionale venant d'être validé.",
    imageUrl: "https://i.ibb.co/kgdYYP5/559155589-797412703143073-47429732447466306-n.jpg",
    link: "",
    title: "Dorcas Moira SAPHOU (PMM) : Son ticket pour Top Models FIMA est validé"
  },
  {
    id: "1",
    date: "2025-09-06",
    excerpt: "Nous recherchons les prochains visages de la mode. Préparez-vous pour notre grand casting national.",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    link: "/casting-formulaire",
    title: "Grand Casting Annuel"
  },
  {
    id: "2",
    date: "2025-02-08",
    excerpt: "La seconde édition de notre événement mode phare approche à grands pas. Découvrez le thème et les créateurs.",
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177f4547d4c?q=80&w=1000&auto=format&fit=crop",
    link: "/fashion-day",
    title: "Perfect Fashion Day Édition 2"
  },
  {
    id: "3",
    date: "2024-08-15",
    excerpt: "L'agence est fière d'accueillir trois nouveaux mannequins prometteurs dans ses rangs.",
    imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop",
    link: "/mannequins",
    title: "Nouveaux Talents 2024"
  },
  {
    id: "aj-caramela-nr-picture",
    date: "2024-07-04",
    excerpt: "Notre mannequin AJ Caramela a participé à une séance photo iconique avec le célèbre studio NR Picture. Découvrez les clichés dans notre dernier article de magazine.",
    imageUrl: "https://i.postimg.cc/k5skXhC2/NR-09474.jpg",
    link: "/magazine/aj-caramela-nr-picture-collaboration",
    title: "Collaboration Explosive : AJ Caramela & NR Picture"
  },
  {
    id: "casting-2025-annonce",
    date: "2024-09-04",
    excerpt: "Les inscriptions sont officiellement ouvertes pour notre grand casting annuel ! Nous recherchons les prochains visages qui définiront la mode de demain. Préparez-vous.",
    imageUrl: "https://i.ibb.co/nMxLMTG/1004396322.png",
    link: "/casting",
    title: "Annonce du Grand Casting National 2025"
  },
  {
    id: "dorcas-moira-saphou-pmm-son-ticket-pour-top-models-fima-est-valid-1760533360327",
    date: "2025-10-15",
    excerpt: "\nC'est officiel : le ticket de Dorcas Moira SAPHOU (PMM) pour la prestigieuse compétition Top Models FIMA est validé, marquant une étape clé dans son parcours.\ntionale venant d'être validé.",
    imageUrl: "https://i.ibb.co/kgdYYP5/559155589-797412703143073-47429732447466306-n.jpg",
    link: "",
    title: "Dorcas Moira SAPHOU (PMM) : Son ticket pour Top Models FIMA est validé"
  },
  {
    id: "fashion-day-2-annonce",
    date: "2024-07-15",
    excerpt: "La deuxième édition de notre événement phare est annoncée. Stylistes, mannequins, partenaires : rejoignez-nous pour une célébration inoubliable de la mode.",
    imageUrl: "https://i.ibb.co/LDm73BY/ventex-44.jpg",
    link: "/fashion-day",
    title: "Perfect Fashion Day 2 : L’Art de Se Révéler"
  }
];

export const fashionDayEvents: FashionDayEvent[] = [
  {
    id: "0",
    artists: [
      {
        description: "Poétesse slameuse, a ouvert la soirée avec un slam inédit intitulé « Racines et Modernité ».",
        images: [
          "https://i.ibb.co/Gfxgf00/agstyle-42.jpg",
          "https://i.ibb.co/4g4x6Dk/agstyle-41.jpg",
          "https://i.ibb.co/0y7Pqv9/agstyle-36.jpg",
          "https://i.ibb.co/yc5kxJK/agstyle-33.jpg",
          "https://i.ibb.co/8DTp4Qq/agstyle-28.jpg",
          "https://i.ibb.co/DfF1Z4T/agstyle-23.jpg",
          "https://i.ibb.co/h1mPDBy/agstyle-21.jpg",
          "https://i.ibb.co/d4D6QLn/agstyle-17.jpg",
          "https://i.ibb.co/60RSnzx/agstyle-13.jpg",
          "https://i.ibb.co/hR9Sfy5/agstyle-15.jpg",
          "https://i.ibb.co/KpRpVrg/agstyle-7.jpg"
        ],
        name: "Lady Riaba"
      },
      {
        description: "Parade spéciale.",
        images: [
          "https://i.ibb.co/xqxq0t4/faran-72.jpg",
          "https://i.ibb.co/5WRGVpN/faran-63.jpg",
          "https://i.ibb.co/C3rMvpR/faran-62.jpg",
          "https://i.ibb.co/ccTm9fq/faran-45.jpg",
          "https://i.ibb.co/W4JbLKP/faran-31.jpg",
          "https://i.ibb.co/kVvx62C/faran-7.jpg",
          "https://i.ibb.co/1fpzHFC/faran-18.jpg"
        ],
        name: "Délégation des Miss du Gabon"
      }
    ],
    date: "Samedi 25 janvier 2025",
    description: "La première édition de notre événement phare, célébrant l'union entre l'héritage culturel et l'innovation dans la mode gabonaise.",
    edition: 1,
    featuredModels: [
      "Pablo Zapatero",
      "Donatien",
      "Moustapha",
      "Osée Jn",
      "Rosnel",
      "Noemi Kim",
      "Diane Vanessa",
      "Juliana Jodelle",
      "Danara",
      "Mirabelle (Miss Tourisme)",
      "Aimée",
      "Priscilia",
      "Merveille",
      "Venusia",
      "Kendra",
      "Flora",
      "Stecy",
      "Lyne",
      "Dolphie",
      "Sadia",
      "Stecya",
      "Léa Danielle",
      "Cassandra",
      "Aria",
      "Sephora"
    ],
    imageUrl: "https://i.ibb.co/PzjSSk5/482986573-631604006390611-5475849692479591284-n.jpg",
    location: "La Gare du Nord, Libreville",
    mc: "Parfait Asseko",
    partners: [
      {
        name: "La Gare du Nord",
        type: "Golden Partenaire"
      },
      {
        name: "Darain Visuals",
        type: "Photographe principal"
      },
      {
        name: "Indi Hair",
        type: "Institut de Beauté"
      },
      {
        name: "Legrand Agency",
        type: "Agence de communication"
      },
      {
        name: "Lady Riaba",
        type: "Styliste / Slameuse"
      }
    ],
    promoter: "Parfait Asseko",
    stylists: [
      {
        description: "Un mélange parfait de tradition et de modernité.",
        images: [
          "https://i.ibb.co/Gfxgf00/agstyle-42.jpg",
          "https://i.ibb.co/4g4x6Dk/agstyle-41.jpg",
          "https://i.ibb.co/0y7Pqv9/agstyle-36.jpg",
          "https://i.ibb.co/yc5kxJK/agstyle-33.jpg",
          "https://i.ibb.co/8DTp4Qq/agstyle-28.jpg",
          "https://i.ibb.co/DfF1Z4T/agstyle-23.jpg",
          "https://i.ibb.co/h1mPDBy/agstyle-21.jpg",
          "https://i.ibb.co/d4D6QLn/agstyle-17.jpg",
          "https://i.ibb.co/60RSnzx/agstyle-13.jpg",
          "https://i.ibb.co/hR9Sfy5/agstyle-15.jpg",
          "https://i.ibb.co/KpRpVrg/agstyle-7.jpg",
          "https://i.ibb.co/vCNg8h6/AG-Style.jpg"
        ],
        name: "AG Style"
      },
      {
        description: "Élégance masculine & attitude.",
        images: [
          "https://i.ibb.co/mC32jrD/farelmd-31.jpg",
          "https://i.ibb.co/Rk1fG3p/farelmd-37.jpg",
          "https://i.ibb.co/Z6LnsF9/farelmd-33.jpg",
          "https://i.ibb.co/0yVgwzx/farelmd-28.jpg",
          "https://i.ibb.co/bZWLkcw/farelmd-30.jpg",
          "https://i.ibb.co/LDjkT30/farelmd-21.jpg",
          "https://i.ibb.co/rKm9BH3/farelmd-26.jpg",
          "https://i.ibb.co/KpY1tHH/farelmd-10.jpg",
          "https://i.ibb.co/tp51KKM/farelmd-16.jpg",
          "https://i.ibb.co/fTrvQht/farelmd-5.jpg"
        ],
        name: "Farel MD"
      },
      {
        description: "Une prestation haute en audace et en style.",
        images: [
          "https://i.ibb.co/LDm73BY/ventex-44.jpg",
          "https://i.ibb.co/LXj51t0/ventex-43.jpg",
          "https://i.ibb.co/hRnhS3g/ventex-31.jpg",
          "https://i.ibb.co/fdM74zW/ventex-36.jpg",
          "https://i.ibb.co/HTb9F9r/ventex-21.jpg",
          "https://i.ibb.co/bjWPHcc/ventex-28.jpg",
          "https://i.ibb.co/JW2VY4J/ventex-18.jpg",
          "https://i.ibb.co/6JwgLJk/ventex-4.jpg",
          "https://i.ibb.co/vvYkS6n/ventex-14.jpg",
          "https://i.ibb.co/ch7Fxy8/ventex-7.jpg"
        ],
        name: "Ventex Custom"
      },
      {
        description: "La finesse sur-mesure.",
        images: [
          "https://i.ibb.co/R4j44vx/miguel-25.jpg",
          "https://i.ibb.co/DF36zP1/miguel-24.jpg",
          "https://i.ibb.co/5hHnGSg/miguel-23.jpg",
          "https://i.ibb.co/KccH1yV/miguel-21.jpg",
          "https://i.ibb.co/tTwH0qk/miguel-19.jpg",
          "https://i.ibb.co/PztGS4c/miguel-13.jpg",
          "https://i.ibb.co/HfHQDqs/miguel-12.jpg",
          "https://i.ibb.co/DPbZq0X/miguel-6.jpg",
          "https://i.ibb.co/fYzb35q/miguel-10.jpg"
        ],
        name: "Miguel Fashion Style"
      },
      {
        description: "Parade des Miss du Gabon.",
        images: [
          "https://i.ibb.co/xqxq0t4/faran-72.jpg",
          "https://i.ibb.co/5WRGVpN/faran-63.jpg",
          "https://i.ibb.co/C3rMvpR/faran-62.jpg",
          "https://i.ibb.co/ccTm9fq/faran-45.jpg",
          "https://i.ibb.co/W4JbLKP/faran-31.jpg",
          "https://i.ibb.co/kVvx62C/faran-7.jpg",
          "https://i.ibb.co/1fpzHFC/faran-18.jpg"
        ],
        name: "Faran"
      },
      {
        description: "Une allure élégante et intemporelle.",
        images: [
          "https://i.ibb.co/TM8Zvfw/madameluc-35.jpg",
          "https://i.ibb.co/N2n3N64/madameluc-27.jpg",
          "https://i.ibb.co/HfGP2hf/madameluc-23.jpg",
          "https://i.ibb.co/v4bptyd/madameluc-14.jpg",
          "https://i.ibb.co/Nk9JnK8/madameluc-10.jpg",
          "https://i.ibb.co/wN3028x/madameluc-1.jpg",
          "https://i.ibb.co/Z64LbfN/madameluc-4.jpg"
        ],
        name: "Madame Luc / Abiale"
      },
      {
        description: "Une énergie flamboyante au podium.",
        images: [
          "https://i.ibb.co/jkztFFQ/brando-50.jpg",
          "https://i.ibb.co/Mxvqp92/brando-45.jpg",
          "https://i.ibb.co/b5NYjLq/brando-39.jpg",
          "https://i.ibb.co/mFGznJJ/brando-34.jpg",
          "https://i.ibb.co/pjQ61C7/brando-28.jpg",
          "https://i.ibb.co/mrj3sfP/brando-26.jpg",
          "https://i.ibb.co/GQfNYbH/brando-25.jpg",
          "https://i.ibb.co/bgJd82z/brando-24.jpg",
          "https://i.ibb.co/GQzzgTZ/brando-22.jpg",
          "https://i.ibb.co/4gNj73v/brando-17.jpg",
          "https://i.ibb.co/spywFpR/brando-13.jpg",
          "https://i.ibb.co/GfYXkKV/brando-11.jpg",
          "https://i.ibb.co/ymw3cwt/brando-10.jpg"
        ],
        name: "Brand’O"
      },
      {
        description: "Audace urbaine & inspiration afro.",
        images: [
          "https://i.ibb.co/C5rcPJH/titostyle-53.jpg",
          "https://i.ibb.co/gMf55YY/titostyle-51.jpg",
          "https://i.ibb.co/8Ty8sGT/titostyle-50.jpg",
          "https://i.ibb.co/d0tXVs0/titostyle-45.jpg",
          "https://i.ibb.co/21VQys2/titostyle-43.jpg",
          "https://i.ibb.co/wNPRTQr/titostyle-41.jpg",
          "https://i.ibb.co/vvc0k6T/titostyle-36.jpg",
          "https://i.ibb.co/PGP9HTr/titostyle-33.jpg",
          "https://i.ibb.co/QvjHXZF/titostyle-19.jpg",
          "https://i.ibb.co/21cjYs2/titostyle-25.jpg",
          "https://i.ibb.co/ynCg04L/titostyle-17.jpg",
          "https://i.ibb.co/cXkw3bt/titostyle-4.jpg",
          "https://i.ibb.co/qY64DbG/titostyle-12.jpg"
        ],
        name: "Tito Style"
      },
      {
        description: "Le final tout en poésie.",
        images: [
          "https://i.ibb.co/N26jYJC/edelea-40.jpg",
          "https://i.ibb.co/zhtZj7w/edelea-38.jpg",
          "https://i.ibb.co/BKwMNJB/edelea-31.jpg",
          "https://i.ibb.co/mVJhr45/edelea-24.jpg",
          "https://i.ibb.co/35dDJXp/edelea-22.jpg",
          "https://i.ibb.co/Xx03RWJ/edelea-16.jpg",
          "https://i.ibb.co/Tq77XgY/edelea-3.jpg"
        ],
        name: "Edele A"
      }
    ],
    theme: "Racines & Modernité"
  },
  {
    id: "1",
    date: "Samedi 31 janvier 2026",
    description: "Après une première édition marquante, riche en émotions et en élégance, Perfect Models Management est fier d’annoncer le retour de la Perfect Fashion Day pour une deuxième édition inédite. Cette nouvelle rencontre mettra à l’honneur une mode profondément enracinée dans la culture, l’histoire personnelle et l’affirmation de soi.",
    edition: 2,
    imageUrl: "https://i.ibb.co/Z6FhzMM/Google-AI-Studio-2025-09-14-T19-03-15-639-Z.png",
    location: "À Définir ",
    promoter: "Perfect Models Management ",
    theme: "L'art de se révéler "
  },
  {
    id: "doc_1769191870604",
    artists: [
      {
        description: "Slam poétique intitulé « Racines et Modernité » en ouverture de soirée.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ],
        name: "Lady Riaba"
      }
    ],
    date: "2025-01-25T18:00:00",
    description: "La 1ère Édition de la Perfect Fashion Day a tenu toutes ses promesses en réunissant mode, art, culture et professionnalisme. Le thème « Racines et Modernité » a permis d’explorer la richesse de la culture gabonaise tout en ouvrant un dialogue avec les tendances contemporaines, posant ainsi les bases solides d’un événement de référence pour la mode gabonaise.",
    edition: 0,
    featuredModels: [
      "Juliana Jodelle",
      "Noemi Kim",
      "Stecya",
      "Lyne",
      "Cassandra",
      "Merveille",
      "Osée Jn",
      "Donatien",
      "Pablo Zapatero",
      "Rosnel",
      "Moustapha"
    ],
    location: "La Gare du Nord – Hôtel Restaurant Bar Casino, Carrefour Acaé",
    partners: [
      {
        name: "La Gare du Nord",
        type: "Golden Partenaire Officiel"
      },
      {
        name: "Indi Hair",
        type: "Golden Partenaire"
      },
      {
        name: "Darain Visuals",
        type: "Golden Partenaire"
      },
      {
        name: "Femmes Belles Ambitieuses et Dynamiques",
        type: "Golden Partenaire"
      }
    ],
    promoter: "Parfait Asseko",
    stylists: [
      {
        description: "Un mélange parfait de tradition et de modernité.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ],
        name: "AG Style"
      },
      {
        description: "Élégance masculine & attitude.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ],
        name: "Farel MD"
      },
      {
        description: "Une prestation haute en audace et en style.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ],
        name: "Ventex Custom"
      },
      {
        description: "La finesse sur-mesure.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ],
        name: "Miguel Fashion Style"
      },
      {
        description: "Parade des Miss du Gabon.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ],
        name: "Faran"
      },
      {
        description: "Une allure élégante et intemporelle.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ],
        name: "Madame Luc (Abiale)"
      },
      {
        description: "Une énergie flamboyante au podium.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ],
        name: "Brand’O"
      },
      {
        description: "Audace urbaine & inspiration afro.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ],
        name: "Tito Style"
      },
      {
        description: "Le final tout en poésie.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ],
        name: "Edele A"
      }
    ],
    theme: "Racines et Modernité"
  },
  {
    id: "doc_1769191870606",
    artists: [
      {
        description: "Maîtresse de Cérémonie & Performance Slam",
        name: "Lady Riaba"
      },
      {
        description: "",
        name: "Tracy MC"
      },
      {
        description: "",
        name: "ESSI Ngomane"
      }
    ],
    date: "2026-01-31T20:00:00",
    description: "Cette édition symbolise le passage de la chrysalide au papillon. C'est le moment précis où l'on décide de laisser tomber les masques sociaux pour laisser transparaître son identité profonde. Une odyssée authentique célébrant l'audace créative et l'excellence.",
    edition: 2,
    location: "Gare du Nord, Libreville",
    partners: [
      {
        name: "Yarden Hotel",
        type: "Partenaire Officiel"
      },
      {
        name: "Legrand TV",
        type: "Partenaire Officiel"
      },
      {
        name: "Darain Visuals",
        type: "Partenaire Officiel"
      },
      {
        name: "Symbiose",
        type: "Partenaire Officiel"
      },
      {
        name: "Vitri Clean",
        type: "Partenaire Officiel"
      },
      {
        name: "Indi Hair",
        type: "Partenaire Officiel"
      }
    ],
    promoter: "Parfait Asseko",
    stylists: [
      {
        description: "Bloc 1 : L'Éveil",
        name: "Najmi"
      },
      {
        description: "Bloc 1 : L'Éveil",
        name: "Pretty Little Hook"
      },
      {
        description: "Bloc 2 : L'Éclosion",
        name: "Ventex"
      },
      {
        description: "Bloc 2 : L'Éclosion",
        name: "Rab's Collection"
      },
      {
        description: "Bloc 2 : L'Éclosion",
        name: "Maeva Creations"
      },
      {
        description: "Bloc 3 : L'Expression",
        name: "Miguel Fashion Style"
      },
      {
        description: "Bloc 3 : L'Expression",
        name: "Cyrlie Fashion"
      },
      {
        description: "Bloc 4 : L'Apothéose",
        name: "Tito Style"
      },
      {
        description: "Invitée d'Honneur",
        name: "Edele A"
      }
    ],
    theme: "L’Art de se révéler"
  },
  {
    id: "doc_1769191927907",
    artists: [
      {
        description: "Slam poétique intitulé « Racines et Modernité » en ouverture de soirée.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ],
        name: "Lady Riaba"
      }
    ],
    date: "2025-01-25T18:00:00",
    description: "La 1ère Édition de la Perfect Fashion Day a tenu toutes ses promesses en réunissant mode, art, culture et professionnalisme. Le thème « Racines et Modernité » a permis d’explorer la richesse de la culture gabonaise tout en ouvrant un dialogue avec les tendances contemporaines, posant ainsi les bases solides d’un événement de référence pour la mode gabonaise.",
    edition: 1,
    featuredModels: [
      "Juliana Jodelle",
      "Noemi Kim",
      "Stecya",
      "Lyne",
      "Cassandra",
      "Merveille",
      "Osée Jn",
      "Donatien",
      "Pablo Zapatero",
      "Rosnel",
      "Moustapha"
    ],
    location: "La Gare du Nord – Hôtel Restaurant Bar Casino, Carrefour Acaé",
    partners: [
      {
        name: "La Gare du Nord",
        type: "Golden Partenaire Officiel"
      },
      {
        name: "Indi Hair",
        type: "Golden Partenaire"
      },
      {
        name: "Darain Visuals",
        type: "Golden Partenaire"
      },
      {
        name: "Femmes Belles Ambitieuses et Dynamiques",
        type: "Golden Partenaire"
      }
    ],
    promoter: "Parfait Asseko",
    stylists: [
      {
        description: "Un mélange parfait de tradition et de modernité.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ],
        name: "AG Style"
      },
      {
        description: "Élégance masculine & attitude.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ],
        name: "Farel MD"
      },
      {
        description: "Une prestation haute en audace et en style.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ],
        name: "Ventex Custom"
      },
      {
        description: "La finesse sur-mesure.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ],
        name: "Miguel Fashion Style"
      },
      {
        description: "Parade des Miss du Gabon.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ],
        name: "Faran"
      },
      {
        description: "Une allure élégante et intemporelle.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ],
        name: "Madame Luc (Abiale)"
      },
      {
        description: "Une énergie flamboyante au podium.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ],
        name: "Brand’O"
      },
      {
        description: "Audace urbaine & inspiration afro.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ],
        name: "Tito Style"
      },
      {
        description: "Le final tout en poésie.",
        images: [
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day",
          "https://placehold.co/400x600/202020/D4AF37?text=Fashion+Day"
        ],
        name: "Edele A"
      }
    ],
    theme: "Racines et Modernité"
  },
  {
    id: "doc_1769191927910",
    artists: [
      {
        description: "Maîtresse de Cérémonie & Performance Slam",
        name: "Lady Riaba"
      },
      {
        description: "",
        name: "Tracy MC"
      },
      {
        description: "",
        name: "ESSI Ngomane"
      }
    ],
    date: "2026-01-31T20:00:00",
    description: "Cette édition symbolise le passage de la chrysalide au papillon. C'est le moment précis où l'on décide de laisser tomber les masques sociaux pour laisser transparaître son identité profonde. Une odyssée authentique célébrant l'audace créative et l'excellence.",
    edition: 2,
    location: "Gare du Nord, Libreville",
    partners: [
      {
        name: "Yarden Hotel",
        type: "Partenaire Officiel"
      },
      {
        name: "Legrand TV",
        type: "Partenaire Officiel"
      },
      {
        name: "Darain Visuals",
        type: "Partenaire Officiel"
      },
      {
        name: "Symbiose",
        type: "Partenaire Officiel"
      },
      {
        name: "Vitri Clean",
        type: "Partenaire Officiel"
      },
      {
        name: "Indi Hair",
        type: "Partenaire Officiel"
      }
    ],
    promoter: "Parfait Asseko",
    stylists: [
      {
        description: "Bloc 1 : L'Éveil",
        name: "Najmi"
      },
      {
        description: "Bloc 1 : L'Éveil",
        name: "Pretty Little Hook"
      },
      {
        description: "Bloc 2 : L'Éclosion",
        name: "Ventex"
      },
      {
        description: "Bloc 2 : L'Éclosion",
        name: "Rab's Collection"
      },
      {
        description: "Bloc 2 : L'Éclosion",
        name: "Maeva Creations"
      },
      {
        description: "Bloc 3 : L'Expression",
        name: "Miguel Fashion Style"
      },
      {
        description: "Bloc 3 : L'Expression",
        name: "Cyrlie Fashion"
      },
      {
        description: "Bloc 4 : L'Apothéose",
        name: "Tito Style"
      },
      {
        description: "Invitée d'Honneur",
        name: "Edele A"
      }
    ],
    theme: "L’Art de se révéler"
  }
];

export const agencyTimeline = [
  {
    event: "Fondation de Perfect Models Management le 12 septembre par Louis Parfait Asseko.",
    id: "0",
    year: "2021"
  },
  {
    event: "Participation à notre premier événement de mode, le défilé \"K'elle pour Elle\" ",
    id: "1",
    year: "2021"
  },
  {
    event: "Lancement des formations hebdomadaires et coaching en développement personnel pour nos talents.",
    id: "2",
    year: "2022"
  },
  {
    event: "Collaboration avec des marques internationales comme Maysah (Cote d'Ivoire) et Muni Design (Kenya).",
    id: "3",
    year: "2023"
  },
  {
    event: "Organisation de la première édition réussie du \"Perfect Fashion Day\".",
    id: "4",
    year: "2025"
  },
  {
    event: "Expansion des services avec la section \"International & Prestige\" pour une représentation mondiale en développement.",
    id: "5",
    year: "2025"
  }
];

export const agencyInfo = {
  about: {
    p1: "Fondée le 12 septembre 2021 par Parfait ASSEKO, Perfect Models Management (PMM) est une agence de mannequins qui redéfinit les standards du mannequinat au Gabon.\nBasée à Libreville, l’agence se positionne comme une véritable plateforme de formation, de promotion et d’épanouissement pour les jeunes talents, qu’ils soient masculins ou féminins.\n",
    p2: "Perfect Models Management (PMM) accompagne ses mannequins à chaque étape de leur carrière — de la formation au conseil, jusqu’au placement professionnel dans les domaines de la mode (défilés, castings, shootings), de la publicité (audiovisuel et print) et de la figuration (clips, télévision, cinéma).\n\nNotre mission : révéler et sublimer la beauté africaine, tout en promouvant l’excellence artistique à travers des projets locaux et internationaux.\n\nChez PMM, nous croyons en une Afrique qui inspire, en des talents qui s’imposent, et en une vision du mannequinat moderne, inclusive et ambitieuse."
  },
  values: [
    {
      description: "Une éthique de travail rigoureuse et un engagement total envers nos clients et nos mannequins.",
      name: "Professionnalisme"
    },
    {
      description: "La clé de la réussite sur les podiums et en dehors. Nous inculquons la rigueur et la persévérance.",
      name: "Discipline"
    },
    {
      description: "Nous veillons à l'image de nos talents et de nos partenaires avec le plus grand soin.",
      name: "Respect de l’image"
    },
    {
      description: "Nous poussons chaque talent à atteindre son plein potentiel créatif et artistique.",
      name: "Excellence artistique"
    },
    {
      description: "Fiers de nos racines, nous mettons en valeur le patrimoine et la créativité du Gabon.",
      name: "Culture Gabonaise"
    }
  ]
};

export const modelDistinctions: ModelDistinction[] = [
  {
    id: "0",
    name: "Ruth Jussy",
    titles: [
      "Meilleur Mannequin Espoir du Gabon",
      "Miss Tourisme Ogooué-Maritime",
      "Deuxième dauphine Miss Tourisme Gabon"
    ]
  },
  {
    id: "1",
    name: "Kendra Mebiame",
    titles: [
      "Meilleur Mannequin Espoir du Gabon (édition 2022)"
    ]
  },
  {
    id: "2",
    name: "Noémie Kim",
    titles: [
      "Mannequin phare de l’agence"
    ]
  },
  {
    id: "3",
    name: "Nynelle Mbazoghe",
    titles: [
      "Première dauphine Miss Casino Croisette",
      "Mannequin vedette"
    ]
  },
  {
    id: "4",
    name: "Akoma Ayo Rosnel",
    titles: [
      "Mister Akae Beach"
    ]
  }
];

export const agencyServices: Service[] = [
  {
    buttonLink: "/contact?service=Casting+Mannequins",
    buttonText: "Réserver ce service",
    category: "Services Mannequinat",
    description: "Organisation de castings professionnels pour défilés, shootings, publicités et clips.",
    details: {
      points: [
        "Sélection rigourouse de mannequins adaptés à votre projet",
        "Gestion complète de la logistique et communication avec les candidats",
        "Accès à notre base de mannequins expérimentés"
      ],
      title: "Avantages du service"
    },
    icon: "UsersIcon",
    id: "0",
    slug: "casting-mannequins",
    title: "Casting Mannequins"
  },
  {
    buttonLink: "/contact?service=Booking+Mannequins",
    buttonText: "Réserver ce service",
    category: "Services Mannequinat",
    description: "Réservation de mannequins pour événements, shootings ou campagnes publicitaires.",
    details: {
      points: [
        "Mannequins professionnels pour tous types de projets",
        "Flexibilité selon vos besoins (durée, lieu, type de prestation)",
        "Suivi personnalisé avant et pendant le projet"
      ],
      title: "Ce que nous proposons"
    },
    icon: "UserGroupIcon",
    id: "1",
    slug: "booking-mannequins",
    title: "Booking Mannequins"
  },
  {
    buttonLink: "/contact?service=Mannequins+pour+D%C3%A9fil%C3%A9s",
    buttonText: "Réserver ce service",
    category: "Services Mannequinat",
    description: "Des mannequins professionnels pour vos défilés, avec coaching sur la posture et la démarche.",
    details: {
      points: [
        "Présentation élégante et harmonieuse de vos créations",
        "Maîtrise parfaite du passage sur podium",
        "Coordination avec votre équipe pour un spectacle mémorable"
      ],
      title: "Inclus"
    },
    icon: "AcademicCapIcon",
    id: "2",
    slug: "mannequins-pour-defiles",
    title: "Mannequins pour Défilés"
  },
  {
    buttonLink: "/contact?service=Mannequins+Publicit%C3%A9+%2F+Audiovisuel",
    buttonText: "Réserver ce service",
    category: "Services Mannequinat",
    description: "Mannequins pour publicité, clips et projets audiovisuels.",
    details: {
      points: [
        "Mise en scène adaptée à vos besoins",
        "Mannequins expressifs et professionnels",
        "Accompagnement par notre équipe de production si nécessaire"
      ],
      title: "Inclus"
    },
    icon: "VideoCameraIcon",
    id: "3",
    slug: "mannequins-publicite-audiovisuel",
    title: "Mannequins Publicité / Audiovisuel"
  },
  {
    buttonLink: "/contact?service=Mannequins+Photo",
    buttonText: "Réserver ce service",
    category: "Services Mannequinat",
    description: "Shooting photo pour catalogues, lookbooks ou réseaux sociaux.",
    details: {
      points: [
        "Photographie en studio ou extérieur",
        "Mannequins adaptés au style de votre marque",
        "Collaboration avec maquilleurs, stylistes et photographes professionnels"
      ],
      title: "Ce que nous offrons"
    },
    icon: "PhotoIcon",
    id: "4",
    slug: "mannequins-photo",
    title: "Mannequins Photo"
  },
  {
    buttonLink: "/contact?service=Mannequins+Figurants",
    buttonText: "Réserver ce service",
    category: "Services Mannequinat",
    description: "Figurants pour clips, films ou événements nécessitant un public.",
    details: {
      points: [
        "Figurants sélectionnés selon vos besoins spécifiques",
        "Gestion complète de la logistique et présence sur site"
      ],
      title: "Avantages"
    },
    icon: "UsersIcon",
    id: "5",
    slug: "mannequins-figurants",
    title: "Mannequins Figurants"
  },
  {
    buttonLink: "/contact?service=Formation+Mannequins",
    buttonText: "Réserver ce service",
    category: "Services Mannequinat",
    description: "Coaching complet pour mannequins : posture, démarche, expressions et présence scénique.",
    details: {
      points: [
        "Optimisation de la performance en casting ou sur podium",
        "Développement de confiance et professionnalisme"
      ],
      title: "Objectifs"
    },
    icon: "AcademicCapIcon",
    id: "6",
    slug: "formation-mannequins",
    title: "Formation Mannequins"
  },
  {
    buttonLink: "/contact?service=Conseil+en+Image+et+Style",
    buttonText: "Réserver ce service",
    category: "Services Mannequinat",
    description: "Accompagnement pour look, coiffure, maquillage et style vestimentaire.",
    details: {
      points: [
        "Image cohérente et professionnelle",
        "Adaptation au projet ou événement",
        "Recommandations personnalisées pour un impact visuel fort"
      ],
      title: "Avantages"
    },
    icon: "IdentificationIcon",
    id: "7",
    slug: "conseil-image-style",
    title: "Conseil en Image et Style"
  },
  {
    buttonLink: "/contact?service=Cr%C3%A9ation+de+Tenues+Sur-Mesure",
    buttonText: "Réserver ce service",
    category: "Services Mode et Stylisme",
    description: "Tenues sur-mesure pour femmes, hommes et enfants, en accord avec vos goûts et votre identité.",
    details: {
      points: [
        "Couture à la main et finitions parfaites",
        "Utilisation de tissus haut de gamme (wax, satin, mousseline, dentelle, tulle)",
        "Designs uniques et personnalisés"
      ],
      title: "Inclus"
    },
    icon: "ScissorsIcon",
    id: "8",
    slug: "creation-tenues-sur-mesure",
    title: "Création de Tenues Sur-Mesure"
  },
  {
    buttonLink: "/contact?service=Location+de+Tenues+de+Mode",
    buttonText: "Réserver ce service",
    category: "Services Mode et Stylisme",
    description: "Accédez à notre collection de tenues pour vos défilés, shootings ou événements spéciaux.",
    details: {
      points: [
        "Choix parmi une large gamme de styles et tailles",
        "Tenues disponibles pour une période flexible"
      ],
      title: "Avantages"
    },
    icon: "BriefcaseIcon",
    id: "9",
    slug: "location-tenues-mode",
    title: "Location de Tenues de Mode"
  },
  {
    buttonLink: "/contact?service=Styling+%26+Conseil+Mode",
    buttonText: "Réserver ce service",
    category: "Services Mode et Stylisme",
    description: "Création de looks parfaits pour campagnes, shootings ou événements.",
    details: {
      points: [
        "Coordination totale des couleurs et accessoires",
        "Conseils mode personnalisés selon vos objectifs"
      ],
      title: "Avantages"
    },
    icon: "PaintBrushIcon",
    id: "10",
    slug: "styling-conseil-mode",
    title: "Styling & Conseil Mode"
  },
  {
    buttonLink: "/contact?service=Organisation+D%C3%A9fil%C3%A9s+de+Mode",
    buttonText: "Réserver ce service",
    category: "Services Mode et Stylisme",
    description: "Planification et exécution complète du défilé : mannequins, scénographie, musique, mise en scène.",
    details: {
      points: [
        "Événement professionnel et mémorable",
        "Coordination complète avec stylistes et partenaires",
        "Expérience exceptionnelle pour vos invités et participants"
      ],
      title: "Inclus"
    },
    icon: "PresentationChartLineIcon",
    id: "11",
    slug: "organisation-defiles-mode",
    title: "Organisation Défilés de Mode"
  },
  {
    buttonLink: "/contact?service=Conseil+Cr%C3%A9atif+et+Branding",
    buttonText: "Réserver ce service",
    category: "Services Mode et Stylisme",
    description: "Développement de l’identité visuelle et de la présence de votre marque.",
    details: {
      points: [
        "Conception de l’identité visuelle (logo, charte graphique)",
        "Développement de votre style unique pour vos collections",
        "Conseils sur marketing et communication"
      ],
      title: "Avantages"
    },
    icon: "SparklesIcon",
    id: "12",
    slug: "conseil-creatif-branding",
    title: "Conseil Créatif et Branding"
  },
  {
    buttonLink: "/contact?service=Shooting+Mode+Professionnel",
    buttonText: "Réserver ce service",
    category: "Services Mode et Stylisme",
    description: "Organisation complète de shootings en studio ou extérieur avec photographe, styliste et maquilleur.",
    details: {
      points: [
        "Photos de haute qualité pour vos catalogues ou réseaux sociaux",
        "Coordination totale pour un résultat harmonieux",
        "Accompagnement personnalisé selon votre projet"
      ],
      title: "Inclus"
    },
    icon: "CameraIcon",
    id: "13",
    slug: "shooting-mode-professionnel",
    title: "Shooting Mode Professionnel"
  },
  {
    buttonLink: "/contact?service=Accessoires+et+Lookbook",
    buttonText: "Réserver ce service",
    category: "Services Mode et Stylisme",
    description: "Création ou fourniture d’accessoires pour compléter vos collections et shootings.",
    details: {
      points: [
        "Sélection harmonisée avec vos tenues",
        "Conseil styling pour un look complet et percutant"
      ],
      title: "Inclus"
    },
    icon: "StarIcon",
    id: "14",
    slug: "accessoires-lookbook",
    title: "Accessoires et Lookbook"
  },
  {
    buttonLink: "/contact?service=Animation+de+Shows+%2F+D%C3%A9fil%C3%A9s",
    buttonText: "Réserver ce service",
    category: "Services Événementiels",
    description: "Animation complète de vos événements mode pour captiver votre public.",
    details: {
      points: [
        "Coordination des mannequins et performances artistiques",
        "Gestion du rythme et de la mise en scène"
      ],
      title: "Inclus"
    },
    icon: "MegaphoneIcon",
    id: "15",
    slug: "animation-shows-defiles",
    title: "Animation de Shows / Défilés"
  },
  {
    buttonLink: "/contact?service=Pr%C3%A9sentateurs+%2F+H%C3%B4tes+de+C%C3%A9r%C3%A9monie",
    buttonText: "Réserver ce service",
    category: "Services Événementiels",
    description: "Hôtes professionnels pour introduire vos défilés et événements.",
    icon: "MicrophoneIcon",
    id: "16",
    slug: "presentateurs-hotes",
    title: "Présentateurs / Hôtes de Cérémonie"
  },
  {
    buttonLink: "/contact?service=Promotion+et+Communication",
    buttonText: "Réserver ce service",
    category: "Services Événementiels",
    description: "Couverture complète de vos événements et projets sur réseaux sociaux et médias partenaires.",
    icon: "ChatBubbleLeftRightIcon",
    id: "17",
    slug: "promotion-communication",
    title: "Promotion et Communication"
  },
  {
    buttonLink: "/contact?service=Partenariat+avec+Marques",
    buttonText: "Réserver ce service",
    category: "Services Événementiels",
    description: "Mise en relation de marques avec mannequins, créateurs et stylistes pour des collaborations impactantes.",
    icon: "BuildingStorefrontIcon",
    id: "18",
    slug: "partenariat-marques",
    title: "Partenariat avec Marques"
  }
];

export const agencyAchievements: AchievementCategory[] = [
  {
    id: "0",
    items: [
      "Défilé Bye Bye Vacances",
      "K’elle POUR ELLE (2, 3 & 4)",
      "Défilé Nouvelle Vision",
      "Festival International des Talents d’Exception",
      "O'Fashion Évent",
      "After Work Fashion",
      "Edele A 2022",
      "Sorties Officielles des Femmes Actives du Gabon",
      "FEMOGA (1 & 2)",
      "Musée Éphémère Iconique",
      "EDYDY Concours",
      "Pink Woman Show (1 & 2)",
      "Fashionshowchou / Awards de la Mode Gabonaise",
      "Vernissage Symbiose Concept Store",
      "Inauguration House Of Design",
      "Festival de l'Indépendance",
      "Issée Fashion Show"
    ],
    name: "Défilés de Mode"
  },
  {
    id: "1",
    items: [
      "King Ben – Cotelet",
      "Donzer – Ovengo",
      "Orfee Lashka – Je sais que tu mens",
      "Communauté Black – Même pas un KOKOKO",
      "Petit Jesus International – Y’a pas l’argent dedans",
      "Monsieur Oyone – Le collectionneur de pain",
      "Pléiade Gabon",
      "Paf paf"
    ],
    name: "Figuration & Clip Vidéo"
  },
  {
    id: "2",
    items: [
      "Edele A – Collection Un Air d’été",
      "Tito Style – Collection Africa",
      "Vanella Fashion",
      "Vi Design",
      "Alban Design",
      "Issée by Lita",
      "Muni Design (Kenya)",
      "Maysah (Côte d’Ivoire)",
      "Angèle Epouta",
      "Angelina Créations",
      "Joha Fashion",
      "Traxel (Dakar)"
    ],
    name: "Collaborations Photo"
  },
  {
    id: "3",
    items: [
      "FEMOGA ",
      "Perfect Fashion Day",
      "O'Fashion Event",
      "l'appel de la Forêt ",
      ""
    ],
    name: "Direction artistique"
  }
];

export const agencyPartners: Partner[] = [
  {
    id: "0",
    name: "La Gare du Nord"
  },
  {
    id: "1",
    name: "Darain Visuals"
  },
  {
    id: "2",
    name: "AG Style"
  },
  {
    id: "3",
    name: "Farel MD"
  },
  {
    id: "4",
    name: "Ventex Custom"
  },
  {
    id: "5",
    name: "Miguel Fashion Style"
  },
  {
    id: "6",
    name: "Tito Style"
  },
  {
    id: "7",
    name: "Le Wap"
  },
  {
    id: "8",
    name: "Yarden Hotel Appart"
  },
  {
    id: "9",
    name: "Le Nalis"
  },
  {
    id: "10",
    name: "K'elle Collection"
  },
  {
    id: "11",
    name: "Femme Belle Ambitieuse et Dynamique"
  },
  {
    id: "12",
    name: "Association des Miss du Gabon"
  },
  {
    id: "13",
    name: "LeGrand Product"
  },
  {
    id: "14",
    name: "Graphik Studio"
  },
  {
    id: "15",
    name: "Fédération Gabonaise de Mode"
  },
  {
    id: "16",
    name: "Beitch Faro"
  },
  {
    id: "17",
    name: "CLOFAS 241"
  },
  {
    id: "18",
    name: "Edele A"
  },
  {
    id: "19",
    name: "Symbiose Concept Store"
  },
  {
    id: "20",
    name: "Amplitude Libreville"
  },
  {
    id: "21",
    name: "Le Passage"
  },
  {
    id: "22",
    name: "BADU Creations"
  },
  {
    id: "23",
    name: "Femme Belle Ambitieuse et Dynamique "
  },
  {
    id: "24",
    name: "Complexe Eli "
  },
  {
    id: "25",
    name: "Casino Croisette "
  },
  {
    id: "26",
    name: "Sabo Fashion"
  }
];

export const faqData: FAQCategory[] = [
  {
    category: "Devenir Mannequin",
    id: "0",
    items: [
      {
        answer: "Nous recherchons des profils variés. Pour les défilés, les critères de taille sont généralement de 1m70 minimum pour les femmes et 1m80 pour les hommes. Cependant, nous encourageons tous les talents, y compris pour le mannequinat commercial et beauté, à postuler via notre page Casting.",
        question: "Quels sont les critères pour devenir mannequin chez PMM ?"
      },
      {
        answer: "Non, l'expérience n'est pas obligatoire. Perfect Models Management est aussi une agence de développement. Nous organisons des castings pour dénicher de nouveaux talents que nous formons ensuite via notre 'Classroom Débutant'.",
        question: "Dois-je avoir de l'expérience pour postuler ?"
      },
      {
        answer: "Après avoir postulé en ligne, les profils présélectionnés sont invités à un casting physique. Vous serez évalué sur votre démarche, votre photogénie et votre personnalité par un jury de professionnels. Les candidats retenus intègrent ensuite notre programme de formation.",
        question: "Comment se déroule le processus de casting ?"
      }
    ]
  },
  {
    category: "Nos Services",
    id: "1",
    items: [
      {
        answer: "C'est très simple. Vous pouvez nous contacter via notre page Contact ou remplir directement le formulaire de demande de booking. Précisez la nature de votre projet, les dates, et le(s) profil(s) recherché(s), et notre équipe vous répondra dans les plus brefs délais.",
        question: "Comment puis-je booker un mannequin pour mon projet ?"
      },
      {
        answer: "Oui, via notre service 'Shooting Mode Professionnel'. Nous pouvons organiser une séance photo complète pour vous, que ce soit pour un book personnel ou simplement pour le plaisir, en collaboration avec nos photographes, stylistes et maquilleurs partenaires.",
        question: "Organisez-vous des shootings pour des particuliers ?"
      }
    ]
  },
  {
    category: "Événements",
    id: "2",
    items: [
      {
        answer: "Nous ouvrons les candidatures pour les créateurs plusieurs mois avant chaque édition. Vous pouvez soumettre votre dossier via le formulaire de candidature dédié sur la page 'Perfect Fashion Day' lorsque les inscriptions sont ouvertes.",
        question: "Comment puis-je participer au Perfect Fashion Day en tant que créateur ?"
      },
      {
        answer: "L'accès à nos événements comme le Perfect Fashion Day se fait généralement sur invitation. Cependant, nous organisons parfois des concours sur nos réseaux sociaux pour faire gagner des places. Suivez-nous pour ne rien manquer !",
        question: "Vendez-vous des billets pour assister à vos défilés ?"
      },
      {
        answer: "Nous sommes toujours ouverts à des collaborations avec des marques et entreprises qui partagent nos valeurs. Veuillez nous contacter via notre page Contact pour discuter des opportunités de partenariat pour nos prochains événements.",
        question: "Comment devenir partenaire de vos événements ?"
      }
    ]
  }
];

export const heroSlides: HeroSlide[] = [
  {
    buttonLink: "/casting-formulaire",
    buttonText: "Devenir Mannequin",
    id: "1",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1920&auto=format&fit=crop",
    order: 1,
    secondButtonLink: "/agence",
    secondButtonText: "Découvrir l'Agence",
    subtitle: "Au cœur de la mode africaine, nous sculptons les carrières et célébrons la beauté sous toutes ses formes.",
    title: "L'Élégance Redéfinie"
  }
];


export const fashionDayReservations: FashionDayReservation[] = [];
