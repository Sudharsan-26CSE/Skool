import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';

// Route imports
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import staffRoutes from './routes/staff.js';
import classRoutes from './routes/classes.js';
import subjectRoutes from './routes/subjects.js';
import timetableRoutes from './routes/timetable.js';
import examResultRoutes from './routes/examResults.js';
import assignmentRoutes from './routes/assignments.js';
import onlineClassRoutes from './routes/onlineClasses.js';
import attendanceRoutes from './routes/attendance.js';
import leaveRequestRoutes from './routes/leaveRequests.js';
import feeRoutes from './routes/fees.js';
import payrollRoutes from './routes/payroll.js';
import accountRoutes from './routes/accounts.js';
import noticeBoardRoutes from './routes/noticeBoard.js';
import messageRoutes from './routes/messages.js';
import notificationRoutes from './routes/notifications.js';
import libraryRoutes from './routes/library.js';
import transportRoutes from './routes/transport.js';
import hostelRoutes from './routes/hostel.js';
import inventoryRoutes from './routes/inventory.js';
import calendarRoutes from './routes/calendar.js';
import reportRoutes from './routes/reports.js';
import profileRoutes from './routes/profile.js';
import settingsRoutes from './routes/settings.js';
import adminSettingsRoutes from './routes/adminSettings.js';
import { setupCronJobs } from './jobs/cronJobs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Setup cron jobs
setupCronJobs();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/exam-results', examResultRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/online-classes', onlineClassRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave-requests', leaveRequestRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/notices', noticeBoardRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/hostel', hostelRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin-settings', adminSettingsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    routes: {
      auth: '/api/auth',
      students: '/api/students',
      staff: '/api/staff',
      classes: '/api/classes',
      subjects: '/api/subjects',
      timetable: '/api/timetable',
      examResults: '/api/exam-results',
      assignments: '/api/assignments',
      onlineClasses: '/api/online-classes',
      attendance: '/api/attendance',
      leaveRequests: '/api/leave-requests',
      fees: '/api/fees',
      payroll: '/api/payroll',
      accounts: '/api/accounts',
      notices: '/api/notices',
      messages: '/api/messages',
      notifications: '/api/notifications',
      library: '/api/library',
      transport: '/api/transport',
      hostel: '/api/hostel',
      inventory: '/api/inventory',
      calendar: '/api/calendar',
      reports: '/api/reports',
      profile: '/api/profile',
      settings: '/api/settings',
    },
  });
});

// Start server and connect to MongoDB
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 PreSkool API Server running at: http://localhost:${PORT}`);
    console.log(`📡 Auth routes available at: http://localhost:${PORT}/api/auth`);
    console.log(`📋 All API routes available at: http://localhost:${PORT}/api/health`);
  });
};

startServer();
