import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_change_in_production';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// --- AUTHENTICATION ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role, ...otherData } = req.body;
    const usersCollection = mongoose.connection.db.collection('users');

    // Check if user exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user object
    const newUser = {
      email,
      password: hashedPassword,
      role: role || 'user',
      createdAt: new Date(),
      ...otherData
    };

    const result = await usersCollection.insertOne(newUser);

    // Generate token
    const token = jwt.sign({ id: result.insertedId, email: newUser.email, role: newUser.role }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      user: { _id: result.insertedId, email: newUser.email, role: newUser.role, ...otherData },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usersCollection = mongoose.connection.db.collection('users');

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d'
    });

    // Remove password from response
    delete user.password;

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Middleware to protect routes (optional, can be used later)
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // For this migration, we'll allow unauthenticated requests since Firebase allowed some,
    // but typically you'd return 401 here. We will just proceed without req.user.
    next();
  }
};

// --- GENERIC CRUD ROUTES ---

// GET all documents in a collection
app.get('/api/:collection', protect, async (req, res) => {
  try {
    const collName = req.params.collection;
    const items = await mongoose.connection.db.collection(collName).find({}).toArray();

    // Map _id to string for frontend compatibility if needed
    const mappedItems = items.map(item => ({
      ...item,
      _id: item._id.toString()
    }));

    res.json(mappedItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
});

// GET single document by ID
app.get('/api/:collection/:id', protect, async (req, res) => {
  try {
    const { collection, id } = req.params;
    const item = await mongoose.connection.db.collection(collection).findOne({ _id: new ObjectId(id) });
    if (!item) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json({ ...item, _id: item._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document', error: error.message });
  }
});

// CREATE new document
app.post('/api/:collection', protect, async (req, res) => {
  try {
    const { collection } = req.params;
    const data = req.body;

    if (data._id) {
      delete data._id; // Let MongoDB generate the ID
    }

    const result = await mongoose.connection.db.collection(collection).insertOne(data);
    res.status(201).json({
      message: 'Document created successfully',
      _id: result.insertedId.toString(),
      ...data
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating document', error: error.message });
  }
});

// UPDATE document
app.put('/api/:collection/:id', protect, async (req, res) => {
  try {
    const { collection, id } = req.params;
    const data = req.body;

    if (data._id) {
      delete data._id; // Prevent updating the _id field
    }

    const result = await mongoose.connection.db.collection(collection).updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ message: 'Document updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating document', error: error.message });
  }
});

// DELETE document
app.delete('/api/:collection/:id', protect, async (req, res) => {
  try {
    const { collection, id } = req.params;
    const result = await mongoose.connection.db.collection(collection).deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document', error: error.message });
  }
});

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

// Start Server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

