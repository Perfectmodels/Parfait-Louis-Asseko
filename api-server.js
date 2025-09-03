import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// MongoDB connection
const uri = "mongodb+srv://asseko19_db_user:LRQRvcaqr2S04U1X@pmm.qee6uss.mongodb.net/?retryWrites=true&w=majority&appName=pmm";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    db = client.db('perfectmodels');
    console.log('✅ Connected to MongoDB!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// ==================== MODELS ROUTES ====================

// GET all models
app.get('/api/models', async (req, res) => {
  try {
    const { gender, status = 'active' } = req.query;
    const filter = { status };
    
    if (gender && gender !== 'Tous') {
      filter.gender = gender;
    }
    
    const models = await db.collection('models').find(filter).toArray();
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET model by ID
app.get('/api/models/:id', async (req, res) => {
  try {
    const model = await db.collection('models').findOne({ 
      $or: [
        { _id: new ObjectId(req.params.id) },
        { id: req.params.id }
      ]
    });
    
    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }
    res.json(model);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new model
app.post('/api/models', async (req, res) => {
  try {
    const { name, email, phone, age, height, gender, location, imageUrl, distinctions } = req.body;
    
    if (!name || !height || !gender || !imageUrl) {
      return res.status(400).json({ error: 'Name, height, gender, and imageUrl are required' });
    }

    const newModel = {
      id: name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      name,
      email: email || null,
      phone: phone || null,
      age: age || null,
      height,
      gender,
      location: location || null,
      imageUrl,
      distinctions: distinctions || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'api',
      status: 'active'
    };

    const result = await db.collection('models').insertOne(newModel);
    const model = await db.collection('models').findOne({ _id: result.insertedId });
    
    res.status(201).json(model);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE model
app.put('/api/models/:id', async (req, res) => {
  try {
    const { name, email, phone, age, height, gender, location, imageUrl, distinctions, status } = req.body;
    
    const updateData = {
      ...(name && { name }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
      ...(age !== undefined && { age }),
      ...(height && { height }),
      ...(gender && { gender }),
      ...(location !== undefined && { location }),
      ...(imageUrl && { imageUrl }),
      ...(distinctions !== undefined && { distinctions }),
      ...(status && { status }),
      updatedAt: new Date()
    };

    const result = await db.collection('models').updateOne(
      { 
        $or: [
          { _id: new ObjectId(req.params.id) },
          { id: req.params.id }
        ]
      },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Model not found' });
    }

    const model = await db.collection('models').findOne({ 
      $or: [
        { _id: new ObjectId(req.params.id) },
        { id: req.params.id }
      ]
    });
    res.json(model);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE model
app.delete('/api/models/:id', async (req, res) => {
  try {
    const result = await db.collection('models').deleteOne({ 
      $or: [
        { _id: new ObjectId(req.params.id) },
        { id: req.params.id }
      ]
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Model not found' });
    }

    res.json({ message: 'Model deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ARTICLES ROUTES ====================

// GET all articles
app.get('/api/articles', async (req, res) => {
  try {
    const { category, status = 'published' } = req.query;
    const filter = { status };
    
    if (category) {
      filter.category = category;
    }
    
    const articles = await db.collection('articles')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET article by slug
app.get('/api/articles/:slug', async (req, res) => {
  try {
    const article = await db.collection('articles').findOne({ slug: req.params.slug });
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    // Increment views
    await db.collection('articles').updateOne(
      { slug: req.params.slug },
      { $inc: { views: 1 } }
    );
    
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new article
app.post('/api/articles', async (req, res) => {
  try {
    const { title, category, excerpt, imageUrl, author, content } = req.body;
    
    if (!title || !category || !excerpt || !imageUrl || !author || !content) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    const newArticle = {
      slug,
      title,
      category,
      excerpt,
      imageUrl,
      author,
      date: new Date().toISOString().split('T')[0],
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'api',
      status: 'published',
      views: 0,
      likes: 0
    };

    const result = await db.collection('articles').insertOne(newArticle);
    const article = await db.collection('articles').findOne({ _id: result.insertedId });
    
    res.status(201).json(article);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Article with this slug already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// ==================== FASHION DAY EVENTS ROUTES ====================

// GET all fashion day events
app.get('/api/fashion-day-events', async (req, res) => {
  try {
    const events = await db.collection('fashionDayEvents')
      .find({ status: 'published' })
      .sort({ edition: -1 })
      .toArray();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET fashion day event by edition
app.get('/api/fashion-day-events/:edition', async (req, res) => {
  try {
    const event = await db.collection('fashionDayEvents').findOne({ 
      edition: parseInt(req.params.edition) 
    });
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== COURSE MODULES ROUTES ====================

// GET all course modules
app.get('/api/course-modules', async (req, res) => {
  try {
    const modules = await db.collection('courseModules')
      .find({ status: 'active' })
      .toArray();
    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET course module by slug
app.get('/api/course-modules/:slug', async (req, res) => {
  try {
    const module = await db.collection('courseModules').findOne({ 
      slug: req.params.slug 
    });
    
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }
    res.json(module);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET chapter by module and chapter slug
app.get('/api/course-modules/:moduleSlug/chapters/:chapterSlug', async (req, res) => {
  try {
    const module = await db.collection('courseModules').findOne({ 
      slug: req.params.moduleSlug 
    });
    
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }
    
    const chapter = module.chapters.find(c => c.slug === req.params.chapterSlug);
    
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    res.json({ module: { title: module.title, slug: module.slug }, chapter });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== TESTIMONIALS ROUTES ====================

// GET all testimonials
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await db.collection('testimonials')
      .find({ status: 'active' })
      .toArray();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== AGENCY SETTINGS ROUTES ====================

// GET agency settings
app.get('/api/agency-settings', async (req, res) => {
  try {
    const settings = await db.collection('agencySettings').findOne({});
    
    if (!settings) {
      return res.status(404).json({ error: 'Agency settings not found' });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== COMBINED DATA ROUTE (for compatibility) ====================

// GET all data (for React app compatibility)
app.get('/api/data', async (req, res) => {
  try {
    const [models, articles, fashionDayEvents, courseData, testimonials, agencySettings] = await Promise.all([
      db.collection('models').find({ status: 'active' }).toArray(),
      db.collection('articles').find({ status: 'published' }).sort({ createdAt: -1 }).toArray(),
      db.collection('fashionDayEvents').find({ status: 'published' }).sort({ edition: -1 }).toArray(),
      db.collection('courseModules').find({ status: 'active' }).toArray(),
      db.collection('testimonials').find({ status: 'active' }).toArray(),
      db.collection('agencySettings').findOne({})
    ]);

    const combinedData = {
      models,
      articles,
      fashionDayEvents,
      courseData,
      testimonials,
      ...(agencySettings || {})
    };

    res.json(combinedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== STATISTICS ROUTES ====================

// GET dashboard statistics
app.get('/api/stats', async (req, res) => {
  try {
    const [modelsCount, articlesCount, eventsCount, modulesCount] = await Promise.all([
      db.collection('models').countDocuments({ status: 'active' }),
      db.collection('articles').countDocuments({ status: 'published' }),
      db.collection('fashionDayEvents').countDocuments({ status: 'published' }),
      db.collection('courseModules').countDocuments({ status: 'active' })
    ]);

    const stats = {
      models: modelsCount,
      articles: articlesCount,
      events: eventsCount,
      modules: modulesCount,
      lastUpdated: new Date()
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', async (req, res) => {
  try {
    await db.admin().ping();
    res.json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error.message,
      timestamp: new Date()
    });
  }
});

// Serve React app (if built)
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'dist' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 API Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📈 Statistics: http://localhost:${PORT}/api/stats`);
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await client.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

startServer().catch(console.error);