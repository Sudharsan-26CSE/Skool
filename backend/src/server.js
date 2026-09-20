require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const morgan       = require('morgan');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const path         = require('path');
const fs           = require('fs');
const connectDB    = require('./config/db');
const { errorHandler, notFound } = require('./middleware/error');

// ── Connect DB ───────────────────────────────────────────────────
connectDB();

const app = express();

// ── Create upload directories ────────────────────────────────────
['uploads/assignments', 'uploads/avatars'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ── Security Middleware ──────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 500,
  message: 'Too many requests, please try again later.',
}));

// ── General Middleware ───────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── Static uploads ───────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── Health Check ─────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🏫 Skool API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ───────────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/students',    require('./routes/students'));
app.use('/api/staff',       require('./routes/staff'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/attendance',  require('./routes/attendance'));
app.use('/api/results',     require('./routes/examResults'));
app.use('/api/finance',     require('./routes/finance'));
app.use('/api/library',     require('./routes/library'));
app.use('/api/notices',     require('./routes/notices'));
app.use('/api',             require('./routes/facilities'));   // /api/classes, /api/subjects, /api/timetable, /api/transport, /api/hostel, /api/leave, /api/online-classes

// ── Error Handlers ───────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Skool Backend running on http://localhost:${PORT}`);
  console.log(`📖 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌱 Seed DB:      npm run seed\n`);
});
