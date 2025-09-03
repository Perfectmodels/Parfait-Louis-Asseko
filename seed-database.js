myappimport { MongoClient, ServerApiVersion } from 'mongodb';

// MongoDB connection
const uri = "mongodb+srv://asseko19_db_user:LRQRvcaqr2S04U1X@pmm.qee6uss.mongodb.net/?retryWrites=true&w=majority&appName=pmm";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Sample data for seeding
const sampleModels = [
  {
    id: 'rosnel-akoma-ayo',
    name: 'Akoma Ayo Rosnel',
    age: 23,
    height: "1m90",
    gender: 'Homme',
    location: 'Charbonnage',
    imageUrl: 'https://i.ibb.co/7FcrvPf/AJC-4643.jpg',
    distinctions: ['Mannequin Professionnel', 'Top Model Gabon'],
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'seed',
    status: 'active'
  },
  {
    id: 'marie-claire-model',
    name: 'Marie Claire Nzamba',
    age: 21,
    height: "1m75",
    gender: 'Femme',
    location: 'Libreville',
    imageUrl: 'https://i.ibb.co/placeholder-female.jpg',
    distinctions: ['Miss Élégance 2023', 'Mannequin de l\'année'],
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'seed',
    status: 'active'
  },
  {
    id: 'jean-paul-fashion',
    name: 'Jean-Paul Mbeng',
    age: 25,
    height: "1m85",
    gender: 'Homme',
    location: 'Port-Gentil',
    imageUrl: 'https://i.ibb.co/placeholder-male.jpg',
    distinctions: ['Mannequin International', 'Fashion Week Paris 2023'],
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'seed',
    status: 'active'
  }
];

const sampleArticles = [
  {
    slug: 'tendances-mode-2024',
    title: 'Les Tendances Mode 2024 au Gabon',
    category: 'Mode',
    excerpt: 'Découvrez les dernières tendances qui façonnent la mode gabonaise en 2024.',
    imageUrl: 'https://i.ibb.co/placeholder-fashion.jpg',
    author: 'Perfect Models Team',
    date: '2024-01-15',
    content: [
      { type: 'heading', level: 2, text: 'La Mode Gabonaise en 2024' },
      { type: 'paragraph', text: 'Cette année marque un tournant dans l\'industrie de la mode au Gabon avec l\'émergence de nouveaux talents et de tendances innovantes.' },
      { type: 'heading', level: 3, text: 'Couleurs Dominantes' },
      { type: 'paragraph', text: 'Les tons terreux et les couleurs vives dominent les podiums gabonais cette année.' },
      { type: 'quote', text: 'La mode gabonaise trouve son identité unique en mélangeant tradition et modernité.', author: 'Louis Parfait Asseko' }
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    source: 'seed',
    status: 'published',
    views: 150,
    likes: 25
  },
  {
    slug: 'perfect-fashion-day-2024',
    title: 'Perfect Fashion Day 2024 : Un Succès Retentissant',
    category: 'Événements',
    excerpt: 'Retour sur la dernière édition du Perfect Fashion Day qui a marqué les esprits.',
    imageUrl: 'https://i.ibb.co/placeholder-event.jpg',
    author: 'PMM Editorial',
    date: '2024-02-10',
    content: [
      { type: 'heading', level: 2, text: 'Une Édition Mémorable' },
      { type: 'paragraph', text: 'Le Perfect Fashion Day 2024 a une fois de plus démontré l\'excellence de la mode gabonaise sur la scène internationale.' },
      { type: 'paragraph', text: 'Plus de 500 invités ont assisté à cet événement exceptionnel qui a mis en lumière nos plus beaux talents.' }
    ],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date(),
    source: 'seed',
    status: 'published',
    views: 320,
    likes: 45
  }
];

const sampleFashionDayEvents = [
  {
    edition: 5,
    date: '2024-09-06',
    theme: 'Renaissance Africaine',
    location: 'Palais des Congrès, Libreville',
    mc: 'Stevy Mahy',
    promoter: 'Perfect Models Management',
    featuredModels: ['Akoma Ayo Rosnel', 'Marie Claire Nzamba', 'Jean-Paul Mbeng'],
    artists: ['Patience Dabany', 'Annie Flore Batchiellilys'],
    description: 'Une célébration de la mode africaine contemporaine avec les plus grands talents du continent.',
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'seed',
    status: 'published'
  },
  {
    edition: 4,
    date: '2023-09-15',
    theme: 'Élégance Tropicale',
    location: 'Hôtel Radisson Blu, Libreville',
    mc: 'Claudia Tagbo',
    promoter: 'Perfect Models Management',
    featuredModels: ['Ruth Jussy', 'Divine Grace', 'Akoma Ayo Rosnel'],
    artists: ['Mylmo', 'Shan\'L'],
    description: 'Un défilé exceptionnel célébrant la beauté et l\'élégance de la mode tropicale.',
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'seed',
    status: 'published'
  }
];

const sampleCourseModules = [
  {
    slug: 'introduction-mannequinat',
    title: 'Introduction au Mannequinat',
    chapters: [
      {
        slug: 'histoire-mode',
        title: 'Histoire de la Mode',
        content: 'La mode est un art qui évolue constamment. Dans ce chapitre, nous explorons l\'histoire de la mode depuis ses origines jusqu\'à nos jours, en mettant l\'accent sur l\'influence africaine et gabonaise.'
      },
      {
        slug: 'bases-mannequinat',
        title: 'Les Bases du Mannequinat',
        content: 'Découvrez les fondamentaux du métier de mannequin : posture, démarche, expression faciale, et présence scénique. Ces éléments sont essentiels pour réussir dans l\'industrie de la mode.'
      }
    ],
    quiz: [
      {
        question: 'Quelle est la première qualité d\'un bon mannequin ?',
        options: ['La beauté', 'La confiance en soi', 'La taille', 'L\'âge'],
        correctAnswer: 'La confiance en soi'
      },
      {
        question: 'Combien de temps dure généralement un défilé de mode ?',
        options: ['5-10 minutes', '15-20 minutes', '30-45 minutes', '1 heure'],
        correctAnswer: '15-20 minutes'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'seed',
    status: 'active',
    enrolledStudents: 0
  },
  {
    slug: 'techniques-avancees',
    title: 'Techniques Avancées',
    chapters: [
      {
        slug: 'photo-professionnelle',
        title: 'Photographie Professionnelle',
        content: 'Apprenez les techniques de pose pour la photographie de mode. Comprendre l\'éclairage, les angles et l\'expression est crucial pour créer des images impactantes.'
      },
      {
        slug: 'defile-haute-couture',
        title: 'Défilé Haute Couture',
        content: 'Les défilés haute couture demandent une préparation particulière. Découvrez les spécificités de ce type de présentation et comment vous y préparer.'
      }
    ],
    quiz: [
      {
        question: 'Quel est l\'élément le plus important lors d\'un shooting photo ?',
        options: ['Le maquillage', 'L\'éclairage', 'Les vêtements', 'Le décor'],
        correctAnswer: 'L\'éclairage'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'seed',
    status: 'active',
    enrolledStudents: 0
  }
];

const sampleTestimonials = [
  {
    name: 'Ruth Jussy',
    role: 'Mannequin Professionnel',
    quote: 'Perfect Models Management m\'a donné l\'opportunité de réaliser mes rêves. Grâce à leur accompagnement professionnel, j\'ai pu participer à des événements internationaux.',
    imageUrl: 'https://i.ibb.co/placeholder-testimonial1.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'seed',
    status: 'active',
    featured: true
  },
  {
    name: 'Divine Grace',
    role: 'Top Model',
    quote: 'L\'équipe de PMM est exceptionnelle. Ils m\'ont aidée à développer ma confiance en moi et à perfectionner mes techniques. Je recommande vivement cette agence.',
    imageUrl: 'https://i.ibb.co/placeholder-testimonial2.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'seed',
    status: 'active',
    featured: true
  }
];

const sampleAgencySettings = {
  siteConfig: {
    logo: "https://i.ibb.co/dKqY7b4/PMM-logo-2024.png"
  },
  navLinks: [
    { path: '/', label: 'Accueil', inFooter: false },
    { path: '/agency', label: 'L\'Agence', inFooter: true },
    { path: '/models', label: 'Nos Mannequins', inFooter: true },
    { path: '/fashion-day', label: 'Fashion Day', inFooter: true },
    { path: '/magazine', label: 'Magazine', inFooter: true },
    { path: '/casting', label: 'Casting', inFooter: false },
    { path: '/contact', label: 'Contact', inFooter: true }
  ],
  socialLinks: {
    facebook: "https://www.facebook.com/perfectmodels.ga/",
    instagram: "https://www.instagram.com/perfectmodels.ga/",
    youtube: "https://www.youtube.com/@perfectmodelsmanagement"
  },
  agencyInfo: {
    about: {
      title: "Perfect Models Management",
      description: "Agence de mannequins leader au Gabon, spécialisée dans la découverte et le développement de talents exceptionnels.",
      mission: "Révéler et accompagner les talents de demain dans l'industrie de la mode."
    }
  },
  agencyPartners: [
    "La Gare du Nord",
    "Radisson Blu Okoume Palace",
    "Gabon Fashion Week",
    "Africa Fashion Week"
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  source: 'seed',
  version: '1.0'
};

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Début du peuplement de la base de données...\n');
    
    // Connect to MongoDB
    await client.connect();
    const db = client.db('perfectmodels');
    console.log('✅ Connexion à MongoDB établie\n');
    
    // Clear existing data
    console.log('🧹 Nettoyage des collections existantes...');
    await db.collection('models').deleteMany({});
    await db.collection('articles').deleteMany({});
    await db.collection('fashionDayEvents').deleteMany({});
    await db.collection('courseModules').deleteMany({});
    await db.collection('testimonials').deleteMany({});
    await db.collection('agencySettings').deleteMany({});
    console.log('✅ Collections nettoyées\n');
    
    // Insert sample data
    console.log('📝 Insertion des données d\'exemple...');
    
    const modelsResult = await db.collection('models').insertMany(sampleModels);
    console.log(`✅ ${modelsResult.insertedCount} mannequins ajoutés`);
    
    const articlesResult = await db.collection('articles').insertMany(sampleArticles);
    console.log(`✅ ${articlesResult.insertedCount} articles ajoutés`);
    
    const eventsResult = await db.collection('fashionDayEvents').insertMany(sampleFashionDayEvents);
    console.log(`✅ ${eventsResult.insertedCount} événements Fashion Day ajoutés`);
    
    const modulesResult = await db.collection('courseModules').insertMany(sampleCourseModules);
    console.log(`✅ ${modulesResult.insertedCount} modules de formation ajoutés`);
    
    const testimonialsResult = await db.collection('testimonials').insertMany(sampleTestimonials);
    console.log(`✅ ${testimonialsResult.insertedCount} témoignages ajoutés`);
    
    const settingsResult = await db.collection('agencySettings').insertOne(sampleAgencySettings);
    console.log(`✅ Paramètres de l'agence ajoutés (ID: ${settingsResult.insertedId})`);
    
    // Create indexes
    console.log('\n🔄 Création des index...');
    await db.collection('models').createIndex({ name: 1 });
    await db.collection('models').createIndex({ gender: 1 });
    await db.collection('models').createIndex({ status: 1 });
    
    await db.collection('articles').createIndex({ slug: 1 }, { unique: true });
    await db.collection('articles').createIndex({ category: 1 });
    await db.collection('articles').createIndex({ status: 1 });
    await db.collection('articles').createIndex({ createdAt: -1 });
    
    await db.collection('fashionDayEvents').createIndex({ edition: 1 }, { unique: true });
    await db.collection('fashionDayEvents').createIndex({ date: -1 });
    
    await db.collection('courseModules').createIndex({ slug: 1 }, { unique: true });
    await db.collection('courseModules').createIndex({ status: 1 });
    
    console.log('✅ Index créés');
    
    // Display summary
    console.log('\n📊 RÉSUMÉ DU PEUPLEMENT:');
    console.log('================================');
    
    const collections = ['models', 'articles', 'fashionDayEvents', 'courseModules', 'testimonials', 'agencySettings'];
    for (const collectionName of collections) {
      const count = await db.collection(collectionName).countDocuments();
      console.log(`${collectionName}: ${count} documents`);
    }
    
    console.log('\n🎉 Base de données peuplée avec succès!');
    console.log('💡 Vous pouvez maintenant tester l\'API avec des données réelles.');
    
  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

// Run seeding
seedDatabase();