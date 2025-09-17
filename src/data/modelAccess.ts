// FICHIER CENTRALISÉ - NOUVELLES COORDONNÉES 2025
// Tous les mannequins (pros et débutants) avec de nouveaux identifiants unifiés

export interface ModelAccess {
  id: string;
  name: string;
  type: 'pro' | 'beginner';
  username: string; // Identifiant de connexion unifié
  password: string; // Nouveau mot de passe
  matricule?: string; // Pour les débutants
  email?: string;
  phone?: string;
  city?: string;
  instagram?: string;
}

// ACCÈS MANNEQUINS PROFESSIONNELS - COORDONNÉES EXISTANTES DEPUIS FIREBASE
export const proModelAccess: ModelAccess[] = [
  {
    id: 'aj-caramela',
    name: 'AJ Caramela',
    type: 'pro',
    username: 'aj.caramela',
    password: 'aj2025', // Mot de passe existant
    email: 'jeanliciadihiba@gmail.com',
    phone: '062882465'
  },
  {
    id: 'akoma-ayo-rosnel',
    name: 'Akoma Ayo Rosnel',
    type: 'pro',
    username: 'akoma.ayo.rosnel',
    password: 'akoma2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: '119-allili-casting-1757115581400',
    name: 'Alli li 19',
    type: 'pro',
    username: 'allili.19',
    password: 'allili2025', // Mot de passe existant
    email: 'alliancentsame@gmail.com',
    phone: '062840141'
  },
  {
    id: 'anani-donatien',
    name: 'Anani Donatien',
    type: 'pro',
    username: 'anani.donatien',
    password: 'anani2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'annie-flora',
    name: 'Annie Flora',
    type: 'pro',
    username: 'annie.flora',
    password: 'annie2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'benga-sadia',
    name: 'Benga Sadia',
    type: 'pro',
    username: 'benga.sadia',
    password: 'benga2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'cassandra-ibouanga',
    name: 'Cassandra Ibouanga',
    type: 'pro',
    username: 'cassandra.ibouanga',
    password: 'cassandra2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'cegolaine',
    name: 'Cegolaine',
    type: 'pro',
    username: 'cegolaine',
    password: 'cegolaine2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'danara-prefna',
    name: 'Danara Prefna',
    type: 'pro',
    username: 'danara.prefna',
    password: 'danara2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'davy',
    name: 'Davy',
    type: 'pro',
    username: 'davy',
    password: 'davy2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'diane-vanessa',
    name: 'Diane Vanessa',
    type: 'pro',
    username: 'diane.vanessa',
    password: 'diane2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'essono-lea-danielle',
    name: 'Essono Lea Danielle',
    type: 'pro',
    username: 'essono.lea.danielle',
    password: 'essono2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'eunice',
    name: 'Eunice',
    type: 'pro',
    username: 'eunice',
    password: 'eunice2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'hurielle-kerenne',
    name: 'Hurielle Kerenne',
    type: 'pro',
    username: 'hurielle.kerenne',
    password: 'hurielle2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'kendra-mebiame',
    name: 'Kendra Mebiame',
    type: 'pro',
    username: 'kendra.mebiame',
    password: 'kendra2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'khelany-allogho',
    name: 'Khelany Allogho',
    type: 'pro',
    username: 'khelany.allogho',
    password: 'khelany2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'lesly-zomo',
    name: 'Lesly Zomo',
    type: 'pro',
    username: 'lesly.zomo',
    password: 'lesly2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'mbazoghe-latifa-nynelle',
    name: 'Mbazoghe Latifa Nynelle',
    type: 'pro',
    username: 'mbazoghe.latifa.nynelle',
    password: 'mbazoghe2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'medza-mirabelle',
    name: 'Medza Mirabelle',
    type: 'pro',
    username: 'medza.mirabelle',
    password: 'medza2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'moussavou-darlyne',
    name: 'Moussavou Darlyne',
    type: 'pro',
    username: 'moussavou.darlyne',
    password: 'moussavou2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'moustapha',
    name: 'Moustapha',
    type: 'pro',
    username: 'moustapha',
    password: 'moustapha2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'niel-merveille-aworet',
    name: 'Niel-Merveille Aworet',
    type: 'pro',
    username: 'niel.merveille.aworet',
    password: 'niel-merveille2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'noe-maks',
    name: 'Noé Mak\'s',
    type: 'pro',
    username: 'noe.maks',
    password: 'noe2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'noemi-kim',
    name: 'Noemi Kim',
    type: 'pro',
    username: 'noemi.kim',
    password: 'noemi2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'nyamete-towene-ruth-jussy',
    name: 'NYAMETE TOWENE Ruth Jussy',
    type: 'pro',
    username: 'nyamete.towene.ruth.jussy',
    password: 'nyamete2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'osee-jn',
    name: 'Osée Jn',
    type: 'pro',
    username: 'osee.jn',
    password: 'osee2025', // Mot de passe existant
    email: 'oseejasmin32@gmail.com',
    phone: '74041760 / 66401094'
  },
  {
    id: 'patricia-sally',
    name: 'Patricia Sally',
    type: 'pro',
    username: 'patricia.sally',
    password: 'patricia2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'raida-katsini-1757111463425',
    name: 'Raida Katsini',
    type: 'pro',
    username: 'raida.katsini',
    password: 'raida2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'eyabiyogho-roslyemmanuel-casting-1757118388990',
    name: 'Rosly Emmanuel Eya biyogho',
    type: 'pro',
    username: 'rosly.emmanuel.eya.biyogho',
    password: 'roslyemmanuel2025', // Mot de passe existant
    email: 'rosly.biyogho@gmail.com',
    phone: '076219132'
  },
  {
    id: 'ella-ruth-casting-1757110863258',
    name: 'Ruth Ella',
    type: 'pro',
    username: 'ruth.ella',
    password: 'ruth2025', // Mot de passe existant
    email: 'divinetrichi241@gmail.com',
    phone: '065292541'
  },
  {
    id: 'abongobiang-samantha-casting-1757117669023',
    name: 'Samantha Abong obiang',
    type: 'pro',
    username: 'samantha.abong.obiang',
    password: 'samantha2025', // Mot de passe existant
    email: 'samanthaobiang@gmail.com',
    phone: '+241 62818227'
  },
  {
    id: 'sephora-nawelle',
    name: 'Sephora Nawelle',
    type: 'pro',
    username: 'sephora.nawelle',
    password: 'sephora2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'stecy-glappier',
    name: 'Stecy Glappier',
    type: 'pro',
    username: 'stecy.glappier',
    password: 'stecy2025', // Mot de passe existant
    email: undefined,
    phone: undefined
  },
  {
    id: 'boumso-ursula-reg-1757165165045',
    name: 'Ursula BOUMSO',
    type: 'pro',
    username: 'ursula.boumso',
    password: 'ursula2025', // Mot de passe existant
    email: undefined,
    phone: '074647206'
  },
  {
    id: 'dorcas-saphou',
    name: 'Dorcas SAPHOU',
    type: 'pro',
    username: 'dorcas.saphou',
    password: 'dorcas2025', // Mot de passe existant
    email: 'dorcas.saphou@example.com',
    phone: '+241077000004'
  }
];

// ACCÈS MANNEQUINS DÉBUTANTS - COORDONNÉES EXISTANTES DEPUIS FIREBASE
export const beginnerModelAccess: ModelAccess[] = [
  {
    id: 'demoted-mounguengui-lorielna-reg-1757169191129',
    name: 'Lorielna MOUNGUENGUI',
    type: 'beginner',
    username: 'lorielna.mounguengui',
    password: 'lorielna2025', // Mot de passe existant
    matricule: 'DEB-2025-005',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-ntsame-rana-reg-1757166949589',
    name: 'Raïna NTSAME',
    type: 'beginner',
    username: 'raina.ntsame',
    password: 'raina2025', // Mot de passe existant
    matricule: 'DEB-2025-007',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-mboumba-sarah-reg-1757174728282',
    name: 'Sarah MBOUMBA',
    type: 'beginner',
    username: 'sarah.mboumba',
    password: 'sarah2025', // Mot de passe existant
    matricule: 'DEB-2025-008',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-abeme-ophlie-reg-1757174939400',
    name: 'Ophélie ABEME',
    type: 'beginner',
    username: 'ophelie.abeme',
    password: 'ophelie2025', // Mot de passe existant
    matricule: 'DEB-2025-009',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-kone-aurore-reg-1757170213003',
    name: 'Aurore KONE',
    type: 'beginner',
    username: 'aurore.kone',
    password: 'aurore2025', // Mot de passe existant
    matricule: 'DEB-2025-010',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-tchibnda-diane-reg-1757169520842',
    name: 'Diane TCHIBNDA',
    type: 'beginner',
    username: 'diane.tchibnda',
    password: 'diane2025', // Mot de passe existant
    matricule: 'DEB-2025-011',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-mondjo-rava-reg-1757168983658',
    name: 'Raïva MONDJO',
    type: 'beginner',
    username: 'raiva.mondjo',
    password: 'raiva2025', // Mot de passe existant
    matricule: 'DEB-2025-012',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-obiang-darcy-reg-1757168866152',
    name: 'Darcy OBIANG',
    type: 'beginner',
    username: 'darcy.obiang',
    password: 'darcy2025', // Mot de passe existant
    matricule: 'DEB-2025-013',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-klomegan-sarah-reg-1757168295533',
    name: 'Sarah KLOMEGAN',
    type: 'beginner',
    username: 'sarah.klomegan',
    password: 'sarah2025', // Mot de passe existant
    matricule: 'DEB-2025-014',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-moundeni-hawa-reg-1757168191718',
    name: 'Hawa MOUNDENI',
    type: 'beginner',
    username: 'hawa.moundeni',
    password: 'hawa2025', // Mot de passe existant
    matricule: 'DEB-2025-015',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-ntosang-chancia-reg-1757169411960',
    name: 'Chancia NTOSANG',
    type: 'beginner',
    username: 'chancia.ntosang',
    password: 'chancia2025', // Mot de passe existant
    matricule: 'DEB-2025-016',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-esapi-esther-reg-1757170634485',
    name: 'Esther Esapie',
    type: 'beginner',
    username: 'esther.esapie',
    password: 'esther2025', // Mot de passe existant
    matricule: 'DEB-2025-017',
    email: 'esapietecyesther@gmail.com',
    phone: '074483549',
    city: 'Libreville',
    instagram: 'Esthe.r7955'
  },
  {
    id: 'demoted-momoh-chancelle-reg-1757169300067',
    name: 'Chancelle MOMOH',
    type: 'beginner',
    username: 'chancelle.momoh',
    password: 'chancelle2025', // Mot de passe existant
    matricule: 'DEB-2025-018',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-bivigou-marisca-reg-1757166828498',
    name: 'Marisca BIVIGOU',
    type: 'beginner',
    username: 'marisca.bivigou',
    password: 'marisca2025', // Mot de passe existant
    matricule: 'DEB-2025-019',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-ossagha-chancelia-reg-1757167085109',
    name: 'Chancelia OSSAGHA',
    type: 'beginner',
    username: 'chancelia.ossagha',
    password: 'chancelia2025', // Mot de passe existant
    matricule: 'DEB-2025-020',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-bouanga-lauretta-reg-1757167461018',
    name: 'Lauretta BOUANGA',
    type: 'beginner',
    username: 'lauretta.bouanga',
    password: 'lauretta2025', // Mot de passe existant
    matricule: 'DEB-2025-021',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-diallo-mariam-reg-1757168409202',
    name: 'Mariam DIALLO',
    type: 'beginner',
    username: 'mariam.diallo',
    password: 'mariam2025', // Mot de passe existant
    matricule: 'DEB-2025-022',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-ngoua-christy-reg-1757169803417',
    name: 'Christy NGOUA',
    type: 'beginner',
    username: 'christy.ngoua',
    password: 'christy2025', // Mot de passe existant
    matricule: 'DEB-2025-023',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-seke-laure-reg-1757167539127',
    name: 'Laure SEKE',
    type: 'beginner',
    username: 'laure.seke',
    password: 'laure2025', // Mot de passe existant
    matricule: 'DEB-2025-024',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-nsa-carine-reg-1757166607694',
    name: 'Carine NSA',
    type: 'beginner',
    username: 'carine.nsa',
    password: 'carine2025', // Mot de passe existant
    matricule: 'DEB-2025-025',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-mickala-anna-reg-1757166173546',
    name: 'Anna MICKALA',
    type: 'beginner',
    username: 'anna.mickala',
    password: 'anna2025', // Mot de passe existant
    matricule: 'DEB-2025-026',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-ndombi-stephie-reg-1757165900023',
    name: 'Stephie NDOMBI',
    type: 'beginner',
    username: 'stephie.ndombi',
    password: 'stephie2025', // Mot de passe existant
    matricule: 'DEB-2025-027',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-lloret-ismael-reg-1757165783910',
    name: 'Ismael LLORET',
    type: 'beginner',
    username: 'ismael.lloret',
    password: 'ismael2025', // Mot de passe existant
    matricule: 'DEB-2025-028',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-mabila-nahoumie-reg-1757165673362',
    name: 'Nahoumie MABILA',
    type: 'beginner',
    username: 'nahoumie.mabila',
    password: 'nahoumie2025', // Mot de passe existant
    matricule: 'DEB-2025-029',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-aubian-olivia-reg-1757166080814',
    name: 'Olivia AUBIAN',
    type: 'beginner',
    username: 'olivia.aubian',
    password: 'olivia2025', // Mot de passe existant
    matricule: 'DEB-2025-030',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-moutsinga-styna-reg-1757166269970',
    name: 'Styna MOUTSINGA',
    type: 'beginner',
    username: 'styna.moutsinga',
    password: 'styna2025', // Mot de passe existant
    matricule: 'DEB-2025-031',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-ngo-charis-reg-1757167213008',
    name: 'Charis NGO',
    type: 'beginner',
    username: 'charis.ngo',
    password: 'charis2025', // Mot de passe existant
    matricule: 'DEB-2025-032',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-mbina-esther-reg-1757166512963',
    name: 'Esther MBINA',
    type: 'beginner',
    username: 'esther.mbina',
    password: 'esther2025', // Mot de passe existant
    matricule: 'DEB-2025-033',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-sendze-lucresse-reg-1757165465454',
    name: 'Lucresse SENDZE',
    type: 'beginner',
    username: 'lucresse.sendze',
    password: 'lucresse2025', // Mot de passe existant
    matricule: 'DEB-2025-034',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-eyui-thyrelle-reg-1757165275082',
    name: 'Thyrelle EYUI',
    type: 'beginner',
    username: 'thyrelle.eyui',
    password: 'thyrelle2025', // Mot de passe existant
    matricule: 'DEB-2025-035',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-alix-abessolo-reg-1757164861779',
    name: 'ABESSOLO Alix',
    type: 'beginner',
    username: 'alix.abessolo',
    password: 'abessolo2025', // Mot de passe existant
    matricule: 'DEB-2025-036',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-arselia-gniobo-reg-1757165061845',
    name: 'GNIOBO Arselia',
    type: 'beginner',
    username: 'arselia.gniobo',
    password: 'gniobo2025', // Mot de passe existant
    matricule: 'DEB-2025-037',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-luciana-atchedji-reg-1757164975608',
    name: 'AÏTCHEDJI Luciana',
    type: 'beginner',
    username: 'luciana.aitchedji',
    password: 'aitchedji2025', // Mot de passe existant
    matricule: 'DEB-2025-038',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-mengue-alicia-reg-1757166692449',
    name: 'Alicia MENGUE',
    type: 'beginner',
    username: 'alicia.mengue',
    password: 'alicia2025', // Mot de passe existant
    matricule: 'DEB-2025-039',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  },
  {
    id: 'demoted-padou-anne-reg-1757165364038',
    name: 'Anne PADOU',
    type: 'beginner',
    username: 'anne.padou',
    password: 'anne2025', // Mot de passe existant
    matricule: 'DEB-2025-040',
    email: undefined,
    phone: undefined,
    city: undefined,
    instagram: undefined
  }
];

// ACCÈS UNIFIÉS - TOUS LES MANNEQUINS
export const allModelAccess: ModelAccess[] = [
  ...proModelAccess,
  ...beginnerModelAccess
];

// Fonction utilitaire pour trouver un accès par identifiant et mot de passe
export const findModelAccess = (username: string, password: string): ModelAccess | null => {
  const normalizedUsername = username.toLowerCase().trim();
  
  console.log('🔍 Recherche d\'accès:', { username, normalizedUsername, password });
  
  const result = allModelAccess.find(access => {
    // Vérifier le mot de passe d'abord
    if (access.password !== password) return false;
    
    // Vérifier les différents types d'identifiants
    const usernameMatch = access.username.toLowerCase() === normalizedUsername;
    const nameMatch = access.name.toLowerCase() === normalizedUsername;
    const matriculeMatch = access.matricule && access.matricule.toLowerCase() === normalizedUsername;
    
    console.log(`🔍 ${access.name}:`, { usernameMatch, nameMatch, matriculeMatch, passwordMatch: true });
    
    return usernameMatch || nameMatch || matriculeMatch;
  }) || null;
  
  console.log('🔍 Résultat:', result ? `✅ Trouvé: ${result.name}` : '❌ Non trouvé');
  return result;
};

// Fonction pour obtenir les accès par type
export const getAccessByType = (type: 'pro' | 'beginner'): ModelAccess[] => {
  return allModelAccess.filter(access => access.type === type);
};

// Fonction pour obtenir tous les accès
export const getAllAccess = (): ModelAccess[] => {
  return allModelAccess;
};

// Fonction pour synchroniser les mannequins du système centralisé avec les données principales
export const syncModelAccessWithData = (data: any) => {
  const updatedData = { ...data };
  
  // Synchroniser les mannequins professionnels
  proModelAccess.forEach(access => {
    const existingModel = updatedData.models.find((m: any) => m.id === access.id);
    if (!existingModel) {
      // Créer un nouveau modèle professionnel
      const newModel = {
        id: access.id,
        name: access.name,
        username: access.username,
        password: access.password,
        email: access.email || '',
        phone: access.phone || '',
        age: 0,
        height: '',
        gender: 'Femme',
        location: '',
        imageUrl: '',
        isPublic: true,
        portfolioImages: [],
        categories: ['Défilé', 'Commercial'],
        experience: 'Expérience à renseigner par l\'administrateur.',
        journey: 'Parcours à renseigner par l\'administrateur.',
        measurements: {
          chest: '0cm',
          hips: '0cm',
          shoeSize: '0',
          waist: '0cm'
        },
        distinctions: [],
        quizScores: {}
      };
      updatedData.models.push(newModel);
    }
  });
  
  // Synchroniser les mannequins débutants
  beginnerModelAccess.forEach(access => {
    const existingBeginner = updatedData.beginnerStudents.find((bs: any) => bs.id === access.id);
    if (!existingBeginner) {
      // Créer un nouveau mannequin débutant
      const newBeginner = {
        id: access.id,
        name: access.name,
        username: access.username,
        password: access.password,
        email: access.email || '',
        phone: access.phone || '',
        city: access.city || '',
        instagram: access.instagram || '',
        matricule: access.matricule || '',
        age: 0,
        height: '',
        gender: 'Femme',
        location: '',
        imageUrl: '',
        isPublic: true,
        portfolioImages: [],
        categories: ['Défilé', 'Commercial'],
        experience: 'Expérience à renseigner par l\'administrateur.',
        journey: 'Parcours à renseigner par l\'administrateur.',
        measurements: {
          chest: '0cm',
          hips: '0cm',
          shoeSize: '0',
          waist: '0cm'
        },
        distinctions: [],
        quizScores: {}
      };
      updatedData.beginnerStudents.push(newBeginner);
    }
  });
  
  return updatedData;
};
