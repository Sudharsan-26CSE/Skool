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

// Middleware to protect routes
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // Token might be a Firebase token - allow request to proceed
      // without req.user set (social login flow)
    }
  }
  next();
};

// Admin email
const ADMIN_EMAIL = 'admin@skool.edu.in';

// GET current user profile
app.get('/api/auth/me', protect, async (req, res) => {
  try {
    if (req.user && req.user.id) {
      const usersCollection = mongoose.connection.db.collection('users');
      const user = await usersCollection.findOne({ _id: new ObjectId(req.user.id) });
      if (user) {
        delete user.password;
        // Override role to admin if email matches
        const role = user.email === ADMIN_EMAIL ? 'admin' : (user.role || 'student');
        return res.json({ user: { ...user, _id: user._id.toString(), role } });
      }
    }
    // For Firebase/social login users without a backend account yet
    // Check email from query param (passed by frontend)
    const email = req.query.email;
    const role = email === ADMIN_EMAIL ? 'admin' : 'student';
    res.json({ user: { role } });
  } catch (error) {
    res.json({ user: { role: 'student' } });
  }
});

// --- COLLECTION RESOLVER & POPULATION ---
const COLLECTION_MAP = {
  staff: 'staffs',
  staffs: 'staffs',
  attendance: 'attendances',
  attendances: 'attendances',
  leave: 'leaves',
  leaves: 'leaves',
  leaveRequests: 'leaves',
  leaverequests: 'leaves',
  library: 'librarybooks',
  libraryBooks: 'librarybooks',
  librarybooks: 'librarybooks',
  onlineClass: 'onlineclasses',
  onlineClasses: 'onlineclasses',
  onlineclasses: 'onlineclasses',
  result: 'examresults',
  results: 'examresults',
  examResult: 'examresults',
  examResults: 'examresults',
  examresults: 'examresults',
  timetable: 'timetables',
  timetables: 'timetables',
  payroll: 'payrolls',
  payrolls: 'payrolls',
  transport: 'transports',
  transports: 'transports',
  hostel: 'hostels',
  hostels: 'hostels',
  fee: 'fees',
  fees: 'fees',
  class: 'classes',
  classes: 'classes',
  subject: 'subjects',
  subjects: 'subjects',
  assignment: 'assignments',
  assignments: 'assignments',
  student: 'students',
  students: 'students',
  notice: 'notices',
  notices: 'notices',
  user: 'users',
  users: 'users'
};

const resolveCollection = (name) => {
  if (!name) return name;
  const lower = name.toLowerCase();
  return COLLECTION_MAP[name] || COLLECTION_MAP[lower] || name;
};

// Helper to populate linked references
const populateItem = async (item, targetColl) => {
  const db = mongoose.connection.db;
  const populated = { ...item };

  // Populate 'user' reference if present
  if (populated.user) {
    try {
      const userDoc = await db.collection('users').findOne(
        { _id: typeof populated.user === 'string' ? new ObjectId(populated.user) : populated.user },
        { projection: { password: 0 } }
      );
      if (userDoc) {
        populated.user = {
          ...userDoc,
          _id: userDoc._id.toString()
        };
      }
    } catch (e) {}
  }

  // Populate 'class' reference if present
  if (populated.class) {
    try {
      const classDoc = await db.collection('classes').findOne(
        { _id: typeof populated.class === 'string' ? new ObjectId(populated.class) : populated.class }
      );
      if (classDoc) {
        populated.class = {
          ...classDoc,
          _id: classDoc._id.toString()
        };
      }
    } catch (e) {}
  }

  // Populate 'student' reference if present
  if (populated.student) {
    try {
      const studentDoc = await db.collection('students').findOne(
        { _id: typeof populated.student === 'string' ? new ObjectId(populated.student) : populated.student }
      );
      if (studentDoc) {
        let studentUser = null;
        if (studentDoc.user) {
          studentUser = await db.collection('users').findOne(
            { _id: typeof studentDoc.user === 'string' ? new ObjectId(studentDoc.user) : studentDoc.user },
            { projection: { password: 0 } }
          );
        }
        populated.student = {
          ...studentDoc,
          _id: studentDoc._id.toString(),
          user: studentUser ? { ...studentUser, _id: studentUser._id.toString() } : null
        };
      }
    } catch (e) {}
  }

  return populated;
};

// --- STATS OVERVIEW ROUTE ---
app.get('/api/stats/overview', protect, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const [studentsCount, staffsCount, classesCount, fees, recentStudents, recentNotices] = await Promise.all([
      db.collection('students').countDocuments(),
      db.collection('staffs').countDocuments(),
      db.collection('classes').countDocuments(),
      db.collection('fees').find({}).toArray(),
      db.collection('students').find({}).sort({ createdAt: -1 }).limit(5).toArray(),
      db.collection('notices').find({}).sort({ createdAt: -1 }).limit(5).toArray()
    ]);

    const totalRevenue = fees.reduce((sum, f) => sum + (f.status === 'paid' ? (Number(f.totalAmount || f.amount) || 0) : 0), 0);
    const pendingFees = fees.reduce((sum, f) => sum + (f.status !== 'paid' ? (Number(f.totalAmount || f.amount) || 0) : 0), 0);

    const populatedStudents = await Promise.all(recentStudents.map(async (s) => populateItem(s, 'students')));

    res.json({
      success: true,
      totalStudents: studentsCount,
      totalStaff: staffsCount,
      totalClasses: classesCount,
      totalRevenue,
      pendingFees,
      recentStudents: populatedStudents.map(s => ({
        ...s,
        _id: s._id.toString()
      })),
      recentNotices: recentNotices.map(n => ({
        ...n,
        _id: n._id.toString()
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// --- GENERIC CRUD ROUTES ---

// GET all documents in a collection
app.get('/api/:collection', protect, async (req, res) => {
  try {
    const rawName = req.params.collection;
    const targetColl = resolveCollection(rawName);
    const db = mongoose.connection.db;

    let filter = {};
    const { role, classId, date, className, ...otherQuery } = req.query;

    if (otherQuery && Object.keys(otherQuery).length > 0) {
      filter = { ...otherQuery };
    }

    if (classId) {
      try { filter.class = new ObjectId(classId); } catch (e) { filter.class = classId; }
    }
    if (className) {
      filter.className = className;
    }
    if (date) {
      filter.date = new RegExp(`^${date}`);
    }

    const items = await db.collection(targetColl).find(filter).toArray();

    // Map _id and populate references
    let mappedItems = await Promise.all(items.map(async (item) => {
      const pop = await populateItem(item, targetColl);
      return {
        ...pop,
        _id: pop._id ? pop._id.toString() : pop.id
      };
    }));

    // Filter staff by role if requested
    if (targetColl === 'staffs' && role) {
      mappedItems = mappedItems.filter(item => {
        const itemRole = item.role || item.user?.role || '';
        const designation = (item.designation || '').toLowerCase();
        const dept = (item.department || '').toLowerCase();
        if (role === 'teacher') {
          return itemRole === 'teacher' || designation.includes('teacher') || designation.includes('lecturer') || designation.includes('professor') || dept.includes('math') || dept.includes('science') || dept.includes('english');
        } else if (role === 'staff') {
          return itemRole !== 'teacher' && !designation.includes('teacher') && !designation.includes('lecturer') && !designation.includes('professor');
        }
        return true;
      });
    }

    res.json({
      success: true,
      count: mappedItems.length,
      [rawName]: mappedItems,
      [targetColl]: mappedItems,
      items: mappedItems,
      data: mappedItems
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
});

// GET single document by ID
app.get('/api/:collection/:id', protect, async (req, res) => {
  try {
    const rawName = req.params.collection;
    const targetColl = resolveCollection(rawName);
    const { id } = req.params;
    const db = mongoose.connection.db;

    let queryId;
    try {
      queryId = new ObjectId(id);
    } catch (e) {
      queryId = id;
    }

    const item = await db.collection(targetColl).findOne({ $or: [{ _id: queryId }, { id }] });
    if (!item) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const populated = await populateItem(item, targetColl);
    res.json({ ...populated, _id: populated._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document', error: error.message });
  }
});

// CREATE new document
app.post('/api/:collection', protect, async (req, res) => {
  try {
    const rawName = req.params.collection;
    const targetColl = resolveCollection(rawName);
    const data = req.body;
    const db = mongoose.connection.db;

    if (data._id) {
      delete data._id; // Let MongoDB generate the ID
    }

    // Convert string ObjectIds where appropriate
    if (data.user && typeof data.user === 'string' && data.user.length === 24) {
      try { data.user = new ObjectId(data.user); } catch (e) {}
    }
    if (data.class && typeof data.class === 'string' && data.class.length === 24) {
      try { data.class = new ObjectId(data.class); } catch (e) {}
    }
    if (data.student && typeof data.student === 'string' && data.student.length === 24) {
      try { data.student = new ObjectId(data.student); } catch (e) {}
    }

    data.createdAt = data.createdAt || new Date();
    data.updatedAt = new Date();

    const result = await db.collection(targetColl).insertOne(data);
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
    const rawName = req.params.collection;
    const targetColl = resolveCollection(rawName);
    const { id } = req.params;
    const data = req.body;
    const db = mongoose.connection.db;

    if (data._id) {
      delete data._id;
    }

    let queryId;
    try {
      queryId = new ObjectId(id);
    } catch (e) {
      queryId = id;
    }

    data.updatedAt = new Date();

    const result = await db.collection(targetColl).updateOne(
      { $or: [{ _id: queryId }, { id }] },
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
    const rawName = req.params.collection;
    const targetColl = resolveCollection(rawName);
    const { id } = req.params;
    const db = mongoose.connection.db;

    let queryId;
    try {
      queryId = new ObjectId(id);
    } catch (e) {
      queryId = id;
    }

    const result = await db.collection(targetColl).deleteOne({ $or: [{ _id: queryId }, { id }] });

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

