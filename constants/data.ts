

import { Model, Stylist, FashionDayEvent, Service, AchievementCategory, ModelDistinction, Testimonial, ContactInfo, SiteImages, Partner, ApiKeys, CastingApplication, FashionDayApplication, NewsItem } from '../types';
import { AcademicCapIcon, CameraIcon, FilmIcon, GlobeAltIcon, HeartIcon, ScaleIcon, SparklesIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export const siteConfig = {
  logo: "https://i.ibb.co/dKqY7b4/PMM-logo-2024.png"
};

export const contactInfo: ContactInfo = {
    email: "Contact@perfectmodels.ga",
    phone: "+241 074066461",
    address: "Ancien Sobraga, Libreville, Gabon"
};

export const siteImages: SiteImages = {
    hero: "https://i.ibb.co/vvc0k6TQ/titostyle-36.jpg",
    about: "https://i.ibb.co/hR9Sfy5Q/agstyle-15.jpg",
    fashionDayBg: "https://i.ibb.co/LDm73BY2/ventex-44.jpg",
    agencyHistory: "https://i.ibb.co/hR9Sfy5Q/agstyle-15.jpg",
    classroomBg: "https://i.ibb.co/b5LgVZgr/DSC-0090.jpg",
    castingBg: "https://scontent.flbv4-1.fna.fbcdn.net/v/t39.30808-6/514264614_759289996955344_5265340269840402279_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=sHlbDXhATdoQ7kNvwFNMON0&_nc_oc=Adn6E0CBc-ktIORu8wXsZYEVX2NHwhr-i6a8_-HrnHG7KFvZmBwwipx9U-45LsTgHQQ&_nc_zt=23&_nc_ht=scontent.flbv4-1.fna&_nc_gid=U7zZZJjuuJK94I7YBa38Dw&oh=00_AfYPvNJbdSgcqD19D2NYVeRiIXkPGj0hzkoDVL8VDw49Dg&oe=68BD4C7A"
};

export const apiKeys: ApiKeys = {
    resendApiKey: ""
};

export const castingApplications: CastingApplication[] = [];

export const fashionDayApplications: FashionDayApplication[] = [];

export const newsItems: NewsItem[] = [
  {
    id: 'casting-2025-annonce',
    title: 'Annonce du Grand Casting National 2025',
    date: '2024-08-01',
    imageUrl: 'https://scontent.flbv4-1.fna.fbcdn.net/v/t39.30808-6/514264614_759289996955344_5265340269840402279_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=sHlbDXhATdoQ7kNvwFNMON0&_nc_oc=Adn6E0CBc-ktIORu8wXsZYEVX2NHwhr-i6a8_-HrnHG7KFvZmBwwipx9U-45LsTgHQQ&_nc_zt=23&_nc_ht=scontent.flbv4-1.fna&_nc_gid=U7zZZJjuuJK94I7YBa38Dw&oh=00_AfYPvNJbdSgcqD19D2NYVeRiIXkPGj0hzkoDVL8VDw49Dg&oe=68BD4C7A',
    excerpt: 'Les inscriptions sont officiellement ouvertes pour notre grand casting annuel ! Nous recherchons les prochains visages qui définiront la mode de demain. Préparez-vous.',
    link: '/casting'
  },
  {
    id: 'aj-caramela-nr-picture',
    title: 'Collaboration Explosive : AJ Caramela & NR Picture',
    date: '2024-07-28',
    imageUrl: 'https://i.postimg.cc/k5skXhC2/NR-09474.jpg',
    excerpt: 'Notre mannequin AJ Caramela a participé à une séance photo iconique avec le célèbre studio NR Picture. Découvrez les clichés dans notre dernier article de magazine.',
    link: '/magazine/aj-caramela-nr-picture-collaboration'
  },
  {
    id: 'fashion-day-2-annonce',
    title: 'Perfect Fashion Day 2 : L’Art de Se Révéler',
    date: '2024-07-15',
    imageUrl: 'https://i.ibb.co/LDm73BY2/ventex-44.jpg',
    excerpt: "La deuxième édition de notre événement phare est annoncée. Stylistes, mannequins, partenaires : rejoignez-nous pour une célébration inoubliable de la mode.",
    link: '/fashion-day'
  }
];

export const navLinks = [
  { path: '/', label: 'Accueil', inFooter: false },
  { path: '/agence', label: "L'Agence", inFooter: true, footerLabel: "L'Agence" },
  { path: '/mannequins', label: 'Mannequins', inFooter: true, footerLabel: 'Nos Mannequins' },
  { path: '/fashion-day', label: 'Perfect Fashion Day', inFooter: true, footerLabel: 'Perfect Fashion Day' },
  { path: '/magazine', label: 'Magazine', inFooter: false },
  { path: '/formations', label: 'Classroom', inFooter: true, footerLabel: 'Classroom' },
  { path: '/casting', label: 'Casting', inFooter: true, footerLabel: 'Casting 2025' },
  { path: '/contact', label: 'Contact', inFooter: true, footerLabel: 'Contact' },
];

const currentYear = new Date().getFullYear();

const defaultModelData = {
  measurements: { chest: '0cm', waist: '0cm', hips: '0cm', shoeSize: '0' },
  categories: ['Défilé', 'Commercial'],
  experience: 'Expérience à renseigner par l\'administrateur.',
  journey: 'Parcours à renseigner par l\'administrateur.',
  quizScores: {}
};

export const models: Model[] = [
    { ...defaultModelData, id: 'akoma-ayo-rosnel', name: 'Akoma Ayo Rosnel', username: 'Man-PMMA01', password: `akoma${currentYear}`, age: 23, height: "1m90", gender: 'Homme', location: 'Charbonnage', imageUrl: 'https://i.ibb.co/7FcrvPf/AJC-4643.jpg' },
    { ...defaultModelData, id: 'medza-mirabelle', name: 'Medza Mirabelle', username: 'Man-PMMM01', password: `medza${currentYear}`, age: 27, height: "1m70", gender: 'Femme', location: 'Nzeng-Ayong', imageUrl: 'https://i.ibb.co/Pv0JsH4m/AJC-4593.jpg' },
    { ...defaultModelData, id: 'nyamete-towene-ruth-jussy', name: 'NYAMETE TOWENE Ruth Jussy', username: 'Man-PMMN01', password: `nyamete${currentYear}`, age: 21, height: "1m77", gender: 'Femme', location: 'PG2', imageUrl: 'https://scontent.flbv4-1.fna.fbcdn.net/v/t39.30808-6/537102148_750023657946208_7470252981010894424_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=y3xrXvqRLMsQ7kNvwGjJ5ey&_nc_oc=AdkqYW7diBLapILLcS2EgxwUz91-WJk0e3B6V9_fMxguwpgNnYJ1jtX-iRIrfXYB8tc&_nc_zt=23&_nc_ht=scontent.flbv4-1.fna&_nc_gid=A_NYPexj8khKOfvNNeSzTw&oh=00_AfagAHRqA9PyPsPr5QIt_brhQxetRzNpCab0Nbd3lavS-A&oe=68BD9296', distinctions: ['Meilleur Mannequin Espoir du Gabon', 'Miss Tourisme Ogooué-Maritime', 'Deuxième dauphine Miss Tourisme Gabon'] },
    { ...defaultModelData, id: 'benga-sadia', name: 'Benga Sadia', username: 'Man-PMMB01', password: `benga${currentYear}`, age: 22, height: "1m68", gender: 'Femme', location: 'Alibandeng', imageUrl: 'https://i.ibb.co/1t6zbJm3/484135904_630949926456019_7069478021622378576_n.jpg' },
    { ...defaultModelData, id: 'annie-flora', name: 'Annie Flora', username: 'Man-PMMA02', password: `annie${currentYear}`, age: 24, height: "1m78", gender: 'Femme', location: 'Awoungou', imageUrl: 'https://i.ibb.co/4n4W615B/AJC-4537.jpg' },
    { ...defaultModelData, id: 'essono-lea-danielle', name: 'Essono Lea Danielle', username: 'Man-PMME01', password: `essono${currentYear}`, age: 20, height: "1m76", gender: 'Femme', location: 'Ondogo', imageUrl: 'https://i.ibb.co/1GgZSPcG/MG-9621-2.jpg' },
    { ...defaultModelData, id: 'mbazoghe-latifa-nynelle', name: 'Mbazoghe Latifa Nynelle', username: 'Man-PMMM02', password: `mbazoghe${currentYear}`, age: 21, height: '1m72', gender: 'Femme', location: 'Belle Vue 2', imageUrl: 'https://scontent.flbv4-1.fna.fbcdn.net/v/t39.30808-6/487401066_660439293229802_6598838965572788442_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_ohc=eMx2S59kM7oQ7kNvwG_VK1B&_nc_oc=AdlK7GyHezToifvKJbetbz31JX55AMtdNhpZQlMVeZUolSJ0UVe7a2ewzo-GMY-RRqI&_nc_zt=23&_nc_ht=scontent.flbv4-1.fna&_nc_gid=45mr7ZYAGOAeQssTcCwi9Q&oh=00_AfbMvrU-r3fR2NM2xE7Gy5xOUHHNbz8Q3N2DWa2eUr4naA&oe=68BD6E59', distinctions: ['Première dauphine Miss Casino Croisette', 'Mannequin vedette'] },
    { ...defaultModelData, id: 'olery-triphene', name: 'Olery Triphène', username: 'Man-PMMO01', password: `olery${currentYear}`, age: 19, height: "1m75", gender: 'Femme', location: 'Château d’Angondjé', imageUrl: 'https://picsum.photos/800/1200?random=10' },
    { ...defaultModelData, id: 'anani-donatien', name: 'Anani Donatien', username: 'Man-PMMA03', password: `anani${currentYear}`, age: 27, height: "1m84", gender: 'Homme', location: 'Ozangué', imageUrl: 'https://i.ibb.co/b5LgVZgr/DSC-0090.jpg' },
    { ...defaultModelData, id: 'moussavou-darlyne', name: 'Moussavou Darlyne', username: 'Man-PMMM03', password: `moussavou${currentYear}`, age: 23, height: "1m75", gender: 'Femme', location: 'Cocotier', imageUrl: 'https://i.ibb.co/7xwhF4Qq/DSC-0203.jpg' },
    { ...defaultModelData, id: 'sephora-nawelle', name: 'Sephora Nawelle', username: 'Man-PMMS01', password: `sephora${currentYear}`, age: 21, height: "1m67", gender: 'Femme', location: 'Charbonnage', imageUrl: 'https://i.ibb.co/kgdjvvN9/DSC01394-Modifier.jpg' },
    { ...defaultModelData, id: 'niel-merveille-aworet', name: 'Niel-Merveille Aworet', username: 'Man-PMMN02', password: `niel-merveille${currentYear}`, age: 18, height: "1m76", gender: 'Femme', location: 'Libreville', imageUrl: 'https://i.ibb.co/tnMZ3NJ/MG-0666.jpg' },
    { ...defaultModelData, id: 'diane-vanessa', name: 'Diane Vanessa', username: 'Man-PMMD01', password: `diane${currentYear}`, height: '1m81', gender: 'Femme', imageUrl: 'https://i.ibb.co/TBt9FBSv/AJC-4630.jpg' },
    { ...defaultModelData, id: 'cassandra-ibouanga', name: 'Cassandra Ibouanga', username: 'Man-PMMC01', password: `cassandra${currentYear}`, height: '1m83', gender: 'Femme', imageUrl: 'https://i.ibb.co/LGYkqzc/AJC-4601.jpg' },
    { ...defaultModelData, id: 'hurielle-kerenne', name: 'Hurielle Kerenne', username: 'Man-PMMH01', password: `hurielle${currentYear}`, height: '1m81', gender: 'Femme', imageUrl: 'https://i.ibb.co/R4VNc7Ng/AJC-4528.jpg' },
    { ...defaultModelData, id: 'lesly-zomo', name: 'Lesly Zomo', username: 'Man-PMML01', password: `lesly${currentYear}`, height: '1m75', gender: 'Femme', imageUrl: 'https://i.ibb.co/B5ZY82CW/DSC-0312.jpg' },
    { ...defaultModelData, id: 'noemi-kim', name: 'Noemi Kim', username: 'Man-PMMN03', password: `noemi${currentYear}`, height: '1m75', gender: 'Femme', imageUrl: 'https://i.ibb.co/mCcD1Gfq/DSC-0272.jpg', distinctions: ['Mannequin phare de l’agence'] },
    { ...defaultModelData, id: 'patricia-sally', name: 'Patricia Sally', username: 'Man-PMMP01', password: `patricia${currentYear}`, height: '1m78', gender: 'Femme', imageUrl: 'https://i.ibb.co/dw0rSZw1/DSC-0220.jpg' },
    { ...defaultModelData, id: 'khelany-allogho', name: 'Khelany Allogho', username: 'Man-PMMK01', password: `khelany${currentYear}`, height: '1m79', gender: 'Femme', imageUrl: 'https://i.ibb.co/bgW2TwP3/DSC-0457.jpg' },
    { ...defaultModelData, id: 'cegolaine', name: 'Cegolaine', username: 'Man-PMMC02', password: `cegolaine${currentYear}`, height: '1m85', gender: 'Femme', imageUrl: 'https://i.ibb.co/LzrGBNyd/DSC-0402.jpg' },
    { ...defaultModelData, id: 'davy', name: 'Davy', username: 'Man-PMMD02', password: `davy${currentYear}`, height: '1m86', gender: 'Homme', imageUrl: 'https://i.ibb.co/LD3Bg4Rf/DSC-0297.jpg' },
    { ...defaultModelData, id: 'stecy-glappier', name: 'Stecy Glappier', username: 'Man-PMMS02', password: `stecy${currentYear}`, height: '1m73', gender: 'Femme', imageUrl: 'https://i.ibb.co/rGztyrP4/1L4A9705.jpg' },
    { ...defaultModelData, id: 'osee-jn', name: 'Osée Jn', username: 'Man-PMMO02', password: `osee${currentYear}`, height: '1m80', gender: 'Homme', imageUrl: 'https://i.ibb.co/7tk4pKvr/474620403_594457843438561_7313394165363117491_n.jpg' },
    { ...defaultModelData, id: 'danara-prefna', name: 'Danara Prefna', username: 'Man-PMMD03', password: `danara${currentYear}`, height: '1m73', gender: 'Femme', imageUrl: 'https://i.ibb.co/mCwz8JYy/483828066_629699233247755_7611737956009481678_n.jpg' },
    { ...defaultModelData, id: 'moustapha', name: 'Moustapha', username: 'Man-PMMM04', password: `moustapha${currentYear}`, height: '1m73', gender: 'Homme', imageUrl: 'https://i.ibb.co/C5Z1N6Zp/481335188_618392171045128_1143329793191383014_n.jpg' },
    { ...defaultModelData, id: 'noe-maks', name: 'Noé Mak\'s', username: 'Man-PMMN04', password: `noe${currentYear}`, height: '1m77', gender: 'Homme', imageUrl: 'https://i.ibb.co/4ncX4Brk/481054309_617829164434762_185712014482056867_n.jpg' },
    { ...defaultModelData, id: 'aj-caramela', name: 'AJ Caramela', username: 'Man-PMMA04', password: `aj${currentYear}`, height: '1m68', gender: 'Femme', imageUrl: 'https://i.ibb.co/WpyDyqGM/480764039_617423107808701_5578356664870683876_n.jpg' },
    { ...defaultModelData, id: 'eunice', name: 'Eunice', username: 'Man-PMME02', password: `eunice${currentYear}`, height: '1m71', gender: 'Femme', imageUrl: 'https://i.ibb.co/8nq5gBTW/485976709_640513238697791_5779836737383586501_n.jpg' },
    { ...defaultModelData, id: 'kendra-mebiame', name: 'Kendra Mebiame', username: 'Man-PMMK02', password: `kendra${currentYear}`, height: '1m85', gender: 'Femme', imageUrl: 'https://i.ibb.co/ksdXSfpY/474134983_590912627126416_4665446951991920838_n.jpg', distinctions: ['Meilleur Mannequin Espoir du Gabon (édition 2022)'] },
    { ...defaultModelData, id: 'pablo-zapatero', name: 'Pablo Zapatero', username: 'Man-PMMP02', password: `pablo${currentYear}`, height: '1m89', gender: 'Homme', imageUrl: 'https://picsum.photos/800/1200?random=32' },
    { ...defaultModelData, id: 'billy-le-gamin', name: 'Billy Le Gamin', username: 'Man-PMMB02', password: `billy${currentYear}`, height: '1m83', gender: 'Homme', imageUrl: 'https://picsum.photos/800/1200?random=34' }
];

const stylistsPfd1: Stylist[] = [
  { name: 'AG Style', description: "Un mélange parfait de tradition et de modernité.", images: ['https://i.ibb.co/Gfxgf00z/agstyle-42.jpg', 'https://i.ibb.co/4g4x6Dkp/agstyle-41.jpg', 'https://i.ibb.co/0y7Pqv9y/agstyle-36.jpg', 'https://i.ibb.co/yc5kxJKT/agstyle-33.jpg', 'https://i.ibb.co/8DTp4Qqy/agstyle-28.jpg', 'https://i.ibb.co/DfF1Z4T9/agstyle-23.jpg', 'https://i.ibb.co/h1mPDBy4/agstyle-21.jpg', 'https://i.ibb.co/d4D6QLnf/agstyle-17.jpg', 'https://i.ibb.co/60RSnzxY/agstyle-13.jpg', 'https://i.ibb.co/hR9Sfy5Q/agstyle-15.jpg', 'https://i.ibb.co/KpRpVrg3/agstyle-7.jpg', 'https://i.ibb.co/vCNg8h6j/AG-Style.jpg'] },
  { name: 'Farel MD', description: "Élégance masculine & attitude.", images: ['https://i.ibb.co/mC32jrDj/farelmd-31.jpg', 'https://i.ibb.co/Rk1fG3ph/farelmd-37.jpg', 'https://i.ibb.co/Z6LnsF9F/farelmd-33.jpg', 'https://i.ibb.co/0yVgwzxH/farelmd-28.jpg', 'https://i.ibb.co/bZWLkcw/farelmd-30.jpg', 'https://i.ibb.co/LDjkT30K/farelmd-21.jpg', 'https://i.ibb.co/rKm9BH3j/farelmd-26.jpg', 'https://i.ibb.co/KpY1tHHg/farelmd-10.jpg', 'https://i.ibb.co/tp51KKMX/farelmd-16.jpg', 'https://i.ibb.co/fTrvQht/farelmd-5.jpg'] },
  { name: 'Ventex Custom', description: "Une prestation haute en audace et en style.", images: ['https://i.ibb.co/LDm73BY2/ventex-44.jpg', 'https://i.ibb.co/LXj51t0G/ventex-43.jpg', 'https://i.ibb.co/hRnhS3gP/ventex-31.jpg', 'https://i.ibb.co/fdM74zWJ/ventex-36.jpg', 'https://i.ibb.co/HTb9F9rc/ventex-21.jpg', 'https://i.ibb.co/bjWPHcc3/ventex-28.jpg', 'https://i.ibb.co/JW2VY4JY/ventex-18.jpg', 'https://i.ibb.co/6JwgLJk2/ventex-4.jpg', 'https://i.ibb.co/vvYkS6nQ/ventex-14.jpg', 'https://i.ibb.co/ch7Fxy8J/ventex-7.jpg'] },
  { name: 'Miguel Fashion Style', description: "La finesse sur-mesure.", images: ['https://i.ibb.co/R4j44vxH/miguel-25.jpg', 'https://i.ibb.co/DF36zP1/miguel-24.jpg', 'https://i.ibb.co/5hHnGSgR/miguel-23.jpg', 'https://i.ibb.co/KccH1yVW/miguel-21.jpg', 'https://i.ibb.co/tTwH0qkd/miguel-19.jpg', 'https://i.ibb.co/PztGS4cG/miguel-13.jpg', 'https://i.ibb.co/HfHQDqs9/miguel-12.jpg', 'https://i.ibb.co/DPbZq0X5/miguel-6.jpg', 'https://i.ibb.co/fYzb35qV/miguel-10.jpg'] },
  { name: 'Faran', description: "Parade des Miss du Gabon.", images: ['https://i.ibb.co/xqxq0t42/faran-72.jpg', 'https://i.ibb.co/5WRGVpN2/faran-63.jpg', 'https://i.ibb.co/C3rMvpRH/faran-62.jpg', 'https://i.ibb.co/ccTm9fqZ/faran-45.jpg', 'https://i.ibb.co/W4JbLKPY/faran-31.jpg', 'https://i.ibb.co/kVvx62Cd/faran-7.jpg', 'https://i.ibb.co/1fpzHFCR/faran-18.jpg'] },
  { name: 'Madame Luc / Abiale', description: "Une allure élégante et intemporelle.", images: ['https://i.ibb.co/TM8ZvfwY/madameluc-35.jpg', 'https://i.ibb.co/N2n3N649/madameluc-27.jpg', 'https://i.ibb.co/HfGP2hfY/madameluc-23.jpg', 'https://i.ibb.co/v4bptydm/madameluc-14.jpg', 'https://i.ibb.co/Nk9JnK8/madameluc-10.jpg', 'https://i.ibb.co/wN3028xM/madameluc-1.jpg', 'https://i.ibb.co/Z64LbfNr/madameluc-4.jpg'] },
  { name: 'Brand’O', description: "Une énergie flamboyante au podium.", images: ['https://i.ibb.co/jkztFFQV/brando-50.jpg', 'https://i.ibb.co/Mxvqp922/brando-45.jpg', 'https://i.ibb.co/b5NYjLqm/brando-39.jpg', 'https://i.ibb.co/mFGznJJd/brando-34.jpg', 'https://i.ibb.co/pjQ61C7X/brando-28.jpg', 'https://i.ibb.co/mrj3sfP7/brando-26.jpg', 'https://i.ibb.co/GQfNYbHh/brando-25.jpg', 'https://i.ibb.co/bgJd82zf/brando-24.jpg', 'https://i.ibb.co/GQzzgTZw/brando-22.jpg', 'https://i.ibb.co/4gNj73vP/brando-17.jpg', 'https://i.ibb.co/spywFpR6/brando-13.jpg', 'https://i.ibb.co/GfYXkKVK/brando-11.jpg', 'https://i.ibb.co/ymw3cwt9/brando-10.jpg'] },
  { name: 'Tito Style', description: "Audace urbaine & inspiration afro.", images: ['https://i.ibb.co/C5rcPJHz/titostyle-53.jpg', 'https://i.ibb.co/gMf55YY9/titostyle-51.jpg', 'https://i.ibb.co/8Ty8sGT/titostyle-50.jpg', 'https://i.ibb.co/d0tXVs0v/titostyle-45.jpg', 'https://i.ibb.co/21VQys2y/titostyle-43.jpg', 'https://i.ibb.co/wNPRTQrS/titostyle-41.jpg', 'https://i.ibb.co/vvc0k6TQ/titostyle-36.jpg', 'https://i.ibb.co/PGP9HTrw/titostyle-33.jpg', 'https://i.ibb.co/QvjHXZFY/titostyle-19.jpg', 'https://i.ibb.co/21cjYs2K/titostyle-25.jpg', 'https://i.ibb.co/ynCg04LR/titostyle-17.jpg', 'https://i.ibb.co/cXkw3btJ/titostyle-4.jpg', 'https://i.ibb.co/qY64DbG0/titostyle-12.jpg'] },
  { name: 'Edele A', description: "Le final tout en poésie.", images: ['https://i.ibb.co/N26jYJCm/edelea-40.jpg', 'https://i.ibb.co/zhtZj7wG/edelea-38.jpg', 'https://i.ibb.co/BKwMNJBw/edelea-31.jpg', 'https://i.ibb.co/mVJhr45j/edelea-24.jpg', 'https://i.ibb.co/35dDJXpV/edelea-22.jpg', 'https://i.ibb.co/Xx03RWJx/edelea-16.jpg', 'https://i.ibb.co/Tq77XgYg/edelea-3.jpg'] },
];

export const fashionDayEvents: FashionDayEvent[] = [
    {
        edition: 1,
        date: "Samedi 25 janvier 2025",
        theme: "Racines & Modernité",
        location: "La Gare du Nord, Libreville",
        mc: "Parfait Asseko",
        promoter: "Parfait Asseko",
        stylists: stylistsPfd1,
        featuredModels: ["Juliana Jodelle", "AJ Caramela", "Osée Jn", "Noemi Kim", "Flora Hinda", "Sadia", "Lyne", "Diane Vanessa", "Donatien", "Cassandra", "Pablo Zapatero", "Sephora Hons", "Billy Le Gamin"],
        artists: ["Lady Riaba, poétesse slameuse, a ouvert la soirée avec un slam inédit intitulé « Racines et Modernité ».", "Parade spéciale avec la délégation des Miss du Gabon."],
        partners: [{ type: "Golden Partenaire", name: "La Gare du Nord" }, { type: "Photographe principal", name: "Darain Visuals" }],
        description: "La première édition de notre événement phare, célébrant l'union entre l'héritage culturel et l'innovation dans la mode gabonaise."
    },
    {
        edition: 2,
        date: "Samedi 31 janvier 2026",
        theme: "L’Art de Se Révéler",
        description: "Après une première édition marquante, riche en émotions et en élégance, Perfect Models Management est fier d’annoncer le retour de la Perfect Fashion Day pour une deuxième édition inédite. Cette nouvelle rencontre mettra à l’honneur une mode profondément enracinée dans la culture, l’histoire personnelle et l’affirmation de soi."
    }
];

export const socialLinks = {
  facebook: "https://www.facebook.com/perfectmodels.ga/",
  instagram: "https://www.instagram.com/perfectmodels.ga/",
  youtube: "https://www.youtube.com/@PMM241",
};

export const agencyTimeline = [
  { year: '2021', event: 'Fondation de Perfect Models Management le 12 septembre par Louis Parfait Asseko.' },
  { year: '2021', event: 'Participation à notre premier événement de mode, le défilé "Bye Bye Vacances" par Alban Design.' },
  { year: '2022', event: 'Lancement des formations hebdomadaires et coaching en développement personnel pour nos talents.' },
  // FIX: Changed single quotes to double quotes to avoid syntax error from unescaped apostrophe. Also corrected spelling.
  { year: '2023', event: "Collaboration avec des marques internationales comme Maysah (Cote d'Ivoire) et Muni Design (Kenya)." },
  { year: '2025', event: 'Organisation de la première édition réussie du "Perfect Fashion Day".' },
  { year: '2025', event: 'Expansion des services avec la section "International & Prestige" pour une représentation mondiale en développement.' },
];

export const agencyInfo = {
    about: {
        p1: "Fondée le 12 septembre 2021 par Parfait ASSEKO, Perfect Models Management (PMM) est une agence de mannequins hommes et femmes située à Libreville, au Gabon. Elle est née d’une volonté de structurer le secteur du mannequinat local et de donner une plateforme professionnelle aux jeunes talents.",
        p2: "PMM assure la formation, le conseil, et le placement de mannequins dans le domaine de la mode (défilés, cabine, photo), de la publicité (audiovisuel et papier) et de la figuration (clips vidéo, TV, cinéma). Notre mission est de valoriser la beauté africaine et de promouvoir l'excellence artistique."
    },
    values: [
        { name: "Professionnalisme", description: "Une éthique de travail rigoureuse et un engagement total envers nos clients et nos mannequins." },
        { name: "Discipline", description: "La clé de la réussite sur les podiums et en dehors. Nous inculquons la rigueur et la persévérance." },
        { name: "Respect de l’image", description: "Nous veillons à l'image de nos talents et de nos partenaires avec le plus grand soin." },
        { name: "Excellence artistique", description: "Nous poussons chaque talent à atteindre son plein potentiel créatif et artistique." },
        { name: "Culture Gabonaise", description: "Fiers de nos racines, nous mettons en valeur le patrimoine et la créativité du Gabon." }
    ]
};

export const modelDistinctions: ModelDistinction[] = [
    { name: "Ruth Jussy", titles: ["Meilleur Mannequin Espoir du Gabon", "Miss Tourisme Ogooué-Maritime", "Deuxième dauphine Miss Tourisme Gabon"] },
    { name: "Kendra Mebiame", titles: ["Meilleur Mannequin Espoir du Gabon (édition 2022)"] },
    { name: "Noémie Kim", titles: ["Mannequin phare de l’agence"] },
    { name: "Nynelle Mbazoghe", titles: ["Première dauphine Miss Casino Croisette", "Mannequin vedette"] },
     { name: "Akoma Ayo Rosnel", titles: ["Mister Akae Beach"] },
];

export const agencyServices: Service[] = [
    { icon: "UserGroupIcon", title: "Développement de carrière", description: "Recrutement, encadrement, élaboration de plans de carrière et création de books professionnels." },
    { icon: "AcademicCapIcon", title: "Formations & Coaching", description: "Ateliers de défilé, posture, expression corporelle, confiance en soi et mentorat personnalisé." },
    { icon: "CameraIcon", title: "Production Photo & Vidéo", description: "Organisation de shootings, réalisation de portraits éditoriaux et création de contenu promotionnel." },
    { icon: "SparklesIcon", title: "Événementiel & Défilés", description: "Organisation de castings, défilés, concours de beauté et coordination de prestations artistiques." },
    { icon: "ScaleIcon", title: "Services aux Entreprises", description: "Location de mannequins pour campagnes publicitaires, partenariat avec stylistes et marques." },
    { icon: "GlobeAltIcon", title: "International & Prestige", description: "Représentation de nos mannequins à l’international et castings pour des marques de luxe (en développement)." },
];

export const agencyAchievements: AchievementCategory[] = [
    { name: "Défilés de Mode", items: ["Défilé Bye Bye Vacances", "K’elle POUR ELLE (2, 3 & 4)", "Défilé Nouvelle Vision", "Festival International des Talents d’Exception", "O'Fashion Évent", "After Work Fashion", "Edele A 2022", "Sorties Officielles des Femmes Actives du Gabon", "FEMOGA (1 & 2)", "Musée Éphémère Iconique", "EDYDY Concours", "Pink Woman Show (1 & 2)", "Fashionshowchou / Awards de la Mode Gabonaise", "Vernissage Symbiose Concept Store", "Inauguration House Of Design", "Festival de l'Indépendance", "Issée Fashion Show"] },
    { name: "Figuration & Clip Vidéo", items: ["King Ben – Cotelet", "Donzer – Ovengo", "Orfee Lashka – Je sais que tu mens", "Communauté Black – Même pas un KOKOKO", "Petit Jesus International – Y’a pas l’argent dedans", "Monsieur Oyone – Le collectionneur de pain", "Pléiade Gabon", "Paf paf"] },
    { name: "Collaborations Photo", items: ["Edele A – Collection Un Air d’été", "Tito Style – Collection Africa", "Vanella Fashion", "Vi Design", "Alban Design", "Issée by Lita", "Muni Design (Kenya)", "Maysah (Côte d’Ivoire)", "Angèle Epouta", "Angelina Créations", "Joha Fashion", "Traxel (Dakar)"] }
];

export const agencyPartners: Partner[] = [
  { name: "La Gare du Nord" },
  { name: "Darain Visuals" },
  { name: "AG Style" },
  { name: "Farel MD" },
  { name: "Ventex Custom" },
  { name: "Miguel Fashion Style" },
  { name: "Tito Style" },
  { name: "Alban Design" }
];

export const testimonials: Testimonial[] = [
  {
    name: 'Noemi Kim',
    role: 'Mannequin Phare',
    quote: "Perfect Models Management n'est pas juste une agence, c'est une famille. L'encadrement et les formations m'ont permis de prendre confiance en moi et de viser l'international. Je leur dois beaucoup.",
    imageUrl: 'https://i.ibb.co/mCcD1Gfq/DSC-0272.jpg'
  },
  {
    name: 'Donatien Bonoukpo Anani',
    role: 'Mannequin Homme',
    quote: "Grâce à la discipline et au professionnalisme inculqués par l'agence, j'ai pu participer à des défilés majeurs. C'est un tremplin incroyable pour tout jeune qui veut réussir dans ce métier.",
    imageUrl: 'https://i.ibb.co/b5LgVZgr/DSC-0090.jpg'
  },
  {
    name: 'Farel MD',
    role: 'Styliste Partenaire',
    quote: "Collaborer avec Perfect Models Management sur le Perfect Fashion Day a été une expérience exceptionnelle. Leurs mannequins sont d'un professionnalisme rare et savent sublimer chaque création.",
    imageUrl: 'https://i.ibb.co/Rk1fG3ph/farelmd-37.jpg'
  },
  {
    name: 'AJ Caramela',
    role: 'Mannequin Femme',
    quote: "L'agence nous pousse à donner le meilleur de nous-mêmes, tout en veillant à notre bien-être. Le Classroom est un outil de formation incroyable qui nous prépare à tous les aspects du métier.",
    imageUrl: 'https://i.ibb.co/WpyDyqGM/480764039_617423107808701_5578356664870683876_n.jpg'
  },
  {
    name: 'La Gare du Nord',
    role: 'Partenaire Événementiel',
    quote: "Accueillir le Perfect Fashion Day a été un honneur. L'organisation était impeccable et l'événement a apporté un vent de fraîcheur et d'élégance. Nous sommes fiers de soutenir PMM.",
    imageUrl: 'https://i.ibb.co/LDm73BY2/ventex-44.jpg'
  },
  {
    name: 'Kendra Mebiame',
    role: 'Meilleur Mannequin Espoir 2022',
    quote: "Être reconnue 'Meilleur Mannequin Espoir' a été possible grâce au soutien constant de l'agence. Ils croient en nous et nous donnent les outils pour réaliser nos rêves.",
    imageUrl: 'https://i.ibb.co/ksdXSfpY/474134983_590912627126416_4665446951991920838_n.jpg'
  }
];