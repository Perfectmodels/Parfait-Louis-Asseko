import express from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
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
    db = client.db('myapp');
    console.log('Connected to MongoDB!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Routes

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.collection('users').find({}).toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const newUser = {
      name,
      email,
      age: age || null,
      createdAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);
    const user = await db.collection('users').findOne({ _id: result.insertedId });
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    
    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(age !== undefined && { age }),
      updatedAt: new Date()
    };

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve HTML page
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Start server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);