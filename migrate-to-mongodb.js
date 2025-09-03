import { MongoClient, ServerApiVersion } from 'mongodb';
import fs from 'fs';
import path from 'path';

// MongoDB connection
const uri = "mongodb+srv://asseko19_db_user:LRQRvcaqr2S04U1X@pmm.qee6uss.mongodb.net/?retryWrites=true&w=majority&appName=pmm";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Function to read and parse TypeScript data files
async function readDataFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Remove TypeScript imports and exports to get just the data
    const cleanContent = content
      .replace(/import.*from.*['"];/g, '')
      .replace(/export\s+const\s+(\w+)\s*[:=]/g, 'const $1 =')
      .replace(/:\s*\w+\[\]\s*=/g, ' =')
      .replace(/:\s*\w+\s*=/g, ' =');
    
    // Create a temporary file to evaluate
    const tempFile = path.join(process.cwd(), 'temp-data.js');
    fs.writeFileSync(tempFile, cleanContent);
    
    // Import the data
    const dataModule = await import(`file://${tempFile}`);
    
    // Clean up temp file
    fs.unlinkSync(tempFile);
    
    return dataModule;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return {};
  }
}

// Migration functions
async function migrateModels(db, models) {
  console.log('🔄 Migration des mannequins...');
  
  if (!models || models.length === 0) {
    console.log('⚠️  Aucun mannequin à migrer');
    return;
  }

  const collection = db.collection('models');
  
  // Clear existing data
  await collection.deleteMany({});
  
  // Add metadata to each model
  const modelsWithMetadata = models.map(model => ({
    ...model,
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'migration',
    status: 'active'
  }));
  
  const result = await collection.insertMany(modelsWithMetadata);
  console.log(`✅ ${result.insertedCount} mannequins migrés`);
}

async function migrateArticles(db, articles) {
  console.log('🔄 Migration des articles...');
  
  if (!articles || articles.length === 0) {
    console.log('⚠️  Aucun article à migrer');
    return;
  }

  const collection = db.collection('articles');
  
  // Clear existing data
  await collection.deleteMany({});
  
  // Add metadata to each article
  const articlesWithMetadata = articles.map(article => ({
    ...article,
    createdAt: new Date(article.date),
    updatedAt: new Date(),
    source: 'migration',
    status: 'published',
    views: 0,
    likes: 0
  }));
  
  const result = await collection.insertMany(articlesWithMetadata);
  console.log(`✅ ${result.insertedCount} articles migrés`);
}

async function migrateFashionDayEvents(db, events) {
  console.log('🔄 Migration des événements Fashion Day...');
  
  if (!events || events.length === 0) {
    console.log('⚠️  Aucun événement à migrer');
    return;
  }

  const collection = db.collection('fashionDayEvents');
  
  // Clear existing data
  await collection.deleteMany({});
  
  // Add metadata to each event
  const eventsWithMetadata = events.map(event => ({
    ...event,
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'migration',
    status: 'published'
  }));
  
  const result = await collection.insertMany(eventsWithMetadata);
  console.log(`✅ ${result.insertedCount} événements Fashion Day migrés`);
}

async function migrateCourseData(db, courseData) {
  console.log('🔄 Migration des données de formation...');
  
  if (!courseData || courseData.length === 0) {
    console.log('⚠️  Aucune donnée de formation à migrer');
    return;
  }

  const collection = db.collection('courseModules');
  
  // Clear existing data
  await collection.deleteMany({});
  
  // Add metadata to each module
  const modulesWithMetadata = courseData.map(module => ({
    ...module,
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'migration',
    status: 'active',
    enrolledStudents: 0
  }));
  
  const result = await collection.insertMany(modulesWithMetadata);
  console.log(`✅ ${result.insertedCount} modules de formation migrés`);
}

async function migrateAgencyData(db, agencyData) {
  console.log('🔄 Migration des données de l\'agence...');
  
  const collection = db.collection('agencySettings');
  
  // Clear existing data
  await collection.deleteMany({});
  
  // Combine all agency-related data into one document
  const agencyDocument = {
    ...agencyData,
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'migration',
    version: '1.0'
  };
  
  const result = await collection.insertOne(agencyDocument);
  console.log(`✅ Données de l'agence migrées (ID: ${result.insertedId})`);
}

async function migrateTestimonials(db, testimonials) {
  console.log('🔄 Migration des témoignages...');
  
  if (!testimonials || testimonials.length === 0) {
    console.log('⚠️  Aucun témoignage à migrer');
    return;
  }

  const collection = db.collection('testimonials');
  
  // Clear existing data
  await collection.deleteMany({});
  
  // Add metadata to each testimonial
  const testimonialsWithMetadata = testimonials.map(testimonial => ({
    ...testimonial,
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'migration',
    status: 'active',
    featured: true
  }));
  
  const result = await collection.insertMany(testimonialsWithMetadata);
  console.log(`✅ ${result.insertedCount} témoignages migrés`);
}

// Main migration function
async function runMigration() {
  try {
    console.log('🚀 Début de la migration vers MongoDB...\n');
    
    // Connect to MongoDB
    await client.connect();
    const db = client.db('perfectmodels');
    console.log('✅ Connexion à MongoDB établie\n');
    
    // Read data files
    console.log('📖 Lecture des fichiers de données...');
    const constantsData = await readDataFile('./constants/data.ts');
    const magazineData = await readDataFile('./constants/magazineData.ts');
    const courseData = await readDataFile('./constants/courseData.ts');
    console.log('✅ Fichiers de données lus\n');
    
    // Migrate each data type
    await migrateModels(db, constantsData.models);
    await migrateArticles(db, magazineData.articles);
    await migrateFashionDayEvents(db, constantsData.fashionDayEvents);
    await migrateCourseData(db, courseData.courseData);
    await migrateTestimonials(db, constantsData.testimonials);
    
    // Migrate agency settings (combine all agency-related data)
    const agencyData = {
      siteConfig: constantsData.siteConfig,
      navLinks: constantsData.navLinks,
      socialLinks: constantsData.socialLinks,
      agencyTimeline: constantsData.agencyTimeline,
      agencyInfo: constantsData.agencyInfo,
      modelDistinctions: constantsData.modelDistinctions,
      agencyServices: constantsData.agencyServices,
      agencyAchievements: constantsData.agencyAchievements,
      agencyPartners: constantsData.agencyPartners
    };
    await migrateAgencyData(db, agencyData);
    
    // Create indexes for better performance
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
    
    // Display migration summary
    console.log('\n📊 RÉSUMÉ DE LA MIGRATION:');
    console.log('================================');
    
    const collections = ['models', 'articles', 'fashionDayEvents', 'courseModules', 'testimonials', 'agencySettings'];
    for (const collectionName of collections) {
      const count = await db.collection(collectionName).countDocuments();
      console.log(`${collectionName}: ${count} documents`);
    }
    
    console.log('\n🎉 Migration terminée avec succès!');
    console.log('💡 Vous pouvez maintenant utiliser MongoDB comme source de données principale.');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

// Run migration
runMigration();