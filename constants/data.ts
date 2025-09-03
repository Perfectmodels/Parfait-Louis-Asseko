import { Model, Stylist, FashionDayEvent, Service, AchievementCategory, ModelDistinction, Testimonial } from '../types';
import { AcademicCapIcon, CameraIcon, FilmIcon, GlobeAltIcon, HeartIcon, ScaleIcon, SparklesIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export const siteConfig = {
  logo: "https://i.ibb.co/dKqY7b4/PMM-logo-2024.png"
};

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

export const models: Model[] = [
    { id: 'rosnel-akoma-ayo', name: 'Akoma Ayo Rosnel', age: 23, height: "1m90", gender: 'Homme', location: 'Charbonnage', imageUrl: 'https://i.ibb.co/7FcrvPf/AJC-4643.jpg' },
    { id: 'mirabelle-medza', name: 'Medza Mirabelle', age: 27, height: "1m70", gender: 'Femme', location: 'Nzeng-Ayong', imageUrl: 'https://i.ibb.co/Pv0JsH4m/AJC-4593.jpg' },
    { id: 'ruth-jussy-nyamete-towene', name: 'NYAMETE TOWENE Ruth Jussy', age: 21, height: "1m77", gender: 'Femme', location: 'PG2', imageUrl: 'https://scontent.flbv4-1.fna.fbcdn.net/v/t39.30808-6/537102148_750023657946208_7470252981010894424_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=y3xrXvqRLMsQ7kNvwGjJ5ey&_nc_oc=AdkqYW7diBLapILLcS2EgxwUz91-WJk0e3B6V9_fMxguwpgNnYJ1jtX-iRIrfXYB8tc&_nc_zt=23&_nc_ht=scontent.flbv4-1.fna&_nc_gid=A_NYPexj8khKOfvNNeSzTw&oh=00_AfagAHRqA9PyPsPr5QIt_brhQxetRzNpCab0Nbd3lavS-A&oe=68BD9296', distinctions: ['Meilleur Mannequin Espoir du Gabon', 'Miss Tourisme Ogooué-Maritime', 'Deuxième dauphine Miss Tourisme Gabon'] },
    { id: 'sadia-benga-eneme', name: 'Benga Sadia', age: 22, height: "1m68", gender: 'Femme', location: 'Alibandeng', imageUrl: 'https://i.ibb.co/1t6zbJm3/484135904-630949926456019-7069478021622378576-n.jpg' },
    { id: 'annie-flora-okamba-pembe', name: ' Annie Flora', age: 24, height: "1m78", gender: 'Femme', location: 'Awoungou', imageUrl: 'https://i.ibb.co/4n4W615B/AJC-4537.jpg' },
    { id: 'lea-danielle-mekui-messono', name: 'Essono Lea Danielle', age: 20, height: "1m76", gender: 'Femme', location: 'Ondogo', imageUrl: 'https://i.ibb.co/1GgZSPcG/MG-9621-2.jpg' },
    { id: 'nynelle-mbazoghe', name: 'Mbazoghe Latifa Nynelle', age: 21, height: '1m72', gender: 'Femme', location: 'Belle Vue 2', imageUrl: 'https://scontent.flbv4-1.fna.fbcdn.net/v/t39.30808-6/487401066_660439293229802_6598838965572788442_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_ohc=eMx2S59kM7oQ7kNvwG_VK1B&_nc_oc=AdlK7GyHezToifvKJbetbz31JX55AMtdNhpZQlMVeZUolSJ0UVe7a2ewzo-GMY-RRqI&_nc_zt=23&_nc_ht=scontent.flbv4-1.fna&_nc_gid=45mr7ZYAGOAeQssTcCwi9Q&oh=00_AfbMvrU-r3fR2NM2xE7Gy5xOUHHNbz8Q3N2DWa2eUr4naA&oe=68BD6E59', distinctions: ['Première dauphine Miss Casino Croisette', 'Mannequin vedette'] },
    { id: 'triphène-olery-nnegue-obame', name: 'Olery Triphène', age: 19, height: "1m75", gender: 'Femme', location: 'Château d’Angondjé', imageUrl: 'https://picsum.photos/800/1200?random=10' },
    { id: 'donatien-bonoukpo-anani', name: ' Anani Donatien', age: 27, height: "1m84", gender: 'Homme', location: 'Ozangué', imageUrl: 'https://i.ibb.co/b5LgVZgr/DSC-0090.jpg' },
    { id: 'darlyne-patchelie-moussavou', name: 'Moussavou Darlyne ', age: 23, height: "1m75", gender: 'Femme', location: 'Cocotier', imageUrl: 'https://i.ibb.co/7xwhF4Qq/DSC-0203.jpg' },
    { id: 'sephora-nawelle-okome-houssa', name: 'Sephora Nawelle', age: 21, height: "1m67", gender: 'Femme', location: 'Charbonnage', imageUrl: 'https://i.ibb.co/kgdjvvN9/DSC01394-Modifier.jpg' },
    { id: 'merveille-aworet-niel', name: 'Niel-Merveille Aworet', age: 18, height: "1m76", gender: 'Femme', location: 'Libreville', imageUrl: 'https://i.ibb.co/tnMZ3NJ/MG-0666.jpg' },
    { id: 'diane-vanessa', name: 'Diane Vanessa', height: '1m81', gender: 'Femme', imageUrl: 'https://i.ibb.co/TBt9FBSv/AJC-4630.jpg' },
    { id: 'cassandra', name: 'Cassandra Ibouanga', height: '1m83', gender: 'Femme', imageUrl: 'https://i.ibb.co/LGYkqzc/AJC-4601.jpg' },
    { id: 'hurielle', name: 'Hurielle Kerenne', height: '1m81', gender: 'Femme', imageUrl: 'https://i.ibb.co/R4VNc7Ng/AJC-4528.jpg' },
    { id: 'lesly', name: 'Lesly Zomo', height: '1m75', gender: 'Femme', imageUrl: 'https://i.ibb.co/B5ZY82CW/DSC-0312.jpg' },
    { id: 'noemi-kim', name: 'Noemi Kim', height: '1m75', gender: 'Femme', imageUrl: 'https://i.ibb.co/mCcD1Gfq/DSC-0272.jpg', distinctions: ['Mannequin phare de l’agence'] },
    { id: 'patricia', name: 'Patricia Sally', height: '1m78', gender: 'Femme', imageUrl: 'https://i.ibb.co/dw0rSZw1/DSC-0220.jpg' },
    { id: 'khelany', name: 'Khelany Allogho', height: '1m79', gender: 'Femme', imageUrl: 'https://i.ibb.co/bgW2TwP3/DSC-0457.jpg' },
    { id: 'cegolaine', name: 'Cegolaine', height: '1m85', gender: 'Femme', imageUrl: 'https://i.ibb.co/LzrGBNyd/DSC-0402.jpg' },
    { id: 'davy', name: 'Davy', height: '1m86', gender: 'Homme', imageUrl: 'https://i.ibb.co/LD3Bg4Rf/DSC-0297.jpg' },
    { id: 'stecy', name: 'Stecy Glappier', height: '1m73', gender: 'Femme', imageUrl: 'https://i.ibb.co/rGztyrP4/1L4A9705.jpg' },
    { id: 'osee', name: 'Osée Jn', height: '1m80', gender: 'Homme', imageUrl: 'https://i.ibb.co/7tk4pKvr/474620403-594457843438561-7313394165363117491-n.jpg' },
    { id: 'danara', name: 'Danara Prefna', height: '1m73', gender: 'Femme', imageUrl: 'https://i.ibb.co/mCwz8JYy/483828066-629699233247755-7611737956009481678-n.jpg' },
    { id: 'moustapha', name: 'Moustapha', height: '1m73', gender: 'Homme', imageUrl: 'https://i.ibb.co/C5Z1N6Zp/481335188-618392171045128-1143329793191383014-n.jpg' },
    { id: 'noe-maks', name: 'Noé Mak\'s', height: '1m77', gender: 'Homme', imageUrl: 'https://i.ibb.co/4ncX4Brk/481054309-617829164434762-185712014482056867-n.jpg' },
    { id: 'aj-caramela', name: 'AJ Caramela', height: '1m68', gender: 'Femme', imageUrl: 'https://i.ibb.co/WpyDyqGM/480764039-617423107808701-5578356664870683876-n.jpg' },
    { id: 'eunice', name: 'Eunice', height: '1m71', gender: 'Femme', imageUrl: 'https://i.ibb.co/8nq5gBTW/485976709-640513238697791-5779836737383586501-n.jpg' },
    { id: 'kendra-mebiame', name: 'Kendra Mebiame', height: '1m85', gender: 'Femme', imageUrl: 'https://i.ibb.co/ksdXSfpY/474134983-590912627126416-4665446951991920838-n.jpg', distinctions: ['Meilleur Mannequin Espoir du Gabon (édition 2022)'] },
    { id: 'pablo-zapatero', name: 'Pablo Zapatero', height: '1m89', gender: 'Homme', imageUrl: 'https://picsum.photos/800/1200?random=32' },
    { id: 'billy-le-gamin', name: 'Billy Le Gamin', height: '1m83', gender: 'Homme', imageUrl: 'https://picsum.photos/800/1200?random=34' }
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
    { icon: UserGroupIcon, title: "Développement de carrière", description: "Recrutement, encadrement, élaboration de plans de carrière et création de books professionnels." },
    { icon: AcademicCapIcon, title: "Formations & Coaching", description: "Ateliers de défilé, posture, expression corporelle, confiance en soi et mentorat personnalisé." },
    { icon: CameraIcon, title: "Production Photo & Vidéo", description: "Organisation de shootings, réalisation de portraits éditoriaux et création de contenu promotionnel." },
    { icon: SparklesIcon, title: "Événementiel & Défilés", description: "Organisation de castings, défilés, concours de beauté et coordination de prestations artistiques." },
    { icon: ScaleIcon, title: "Services aux Entreprises", description: "Location de mannequins pour campagnes publicitaires, partenariat avec stylistes et marques." },
    { icon: GlobeAltIcon, title: "International & Prestige", description: "Représentation de nos mannequins à l’international et castings pour des marques de luxe (en développement)." },
];

export const agencyAchievements: AchievementCategory[] = [
    { name: "Défilés de Mode", items: ["Défilé Bye Bye Vacances", "K’elle POUR ELLE (2, 3 & 4)", "Défilé Nouvelle Vision", "Festival International des Talents d’Exception", "O'Fashion Évent", "After Work Fashion", "Edele A 2022", "Sorties Officielles des Femmes Actives du Gabon", "FEMOGA (1 & 2)", "Musée Éphémère Iconique", "EDYDY Concours", "Pink Woman Show (1 & 2)", "Fashionshowchou / Awards de la Mode Gabonaise", "Vernissage Symbiose Concept Store", "Inauguration House Of Design", "Festival de l'Indépendance", "Issée Fashion Show"] },
    { name: "Figuration & Clip Vidéo", items: ["King Ben – Cotelet", "Donzer – Ovengo", "Orfee Lashka – Je sais que tu mens", "Communauté Black – Même pas un KOKOKO", "Petit Jesus International – Y’a pas l’argent dedans", "Monsieur Oyone – Le collectionneur de pain", "Pléiade Gabon", "Paf paf"] },
    { name: "Collaborations Photo", items: ["Edele A – Collection Un Air d’été", "Tito Style – Collection Africa", "Vanella Fashion", "Vi Design", "Alban Design", "Issée by Lita", "Muni Design (Kenya)", "Maysah (Côte d’Ivoire)", "Angèle Epouta", "Angelina Créations", "Joha Fashion", "Traxel (Dakar)"] }
];

// FIX: Added missing agencyPartners export to resolve import errors.
export const agencyPartners: string[] = [
  "La Gare du Nord",
  "Darain Visuals",
  "AG Style",
  "Farel MD",
  "Ventex Custom",
  "Miguel Fashion Style",
  "Tito Style",
  "Alban Design"
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
    imageUrl: 'https://i.ibb.co/WpyDyqGM/480764039-617423107808701-5578356664870683876-n.jpg'
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
    imageUrl: 'https://i.ibb.co/ksdXSfpY/474134983-590912627126416-4665446951991920838-n.jpg'
  }
];