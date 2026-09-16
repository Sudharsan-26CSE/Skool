import mongoose from 'mongoose';

const AdminSettingsSchema = new mongoose.Schema(
  {
    // School Identity
    schoolName: {
      type: String,
      default: 'PreSkool International Academy',
      trim: true,
    },
    academicYear: {
      type: String,
      default: '2025 - 2026',
      trim: true,
    },
    schoolEmail: {
      type: String,
      default: '',
      lowercase: true,
      trim: true,
    },
    schoolPhone: {
      type: String,
      default: '',
      trim: true,
    },
    schoolAddress: {
      type: String,
      default: '',
      trim: true,
    },
    schoolWebsite: {
      type: String,
      default: '',
      trim: true,
    },

    // Appearance & Language
    defaultLanguage: {
      type: String,
      default: 'en',
    },
    defaultTheme: {
      type: String,
      default: 'light',
    },

    // Module Toggles
    modules: {
      students: { type: Boolean, default: true },
      teachers: { type: Boolean, default: true },
      staff: { type: Boolean, default: true },
      classes: { type: Boolean, default: true },
      subjects: { type: Boolean, default: true },
      timetable: { type: Boolean, default: true },
      examResults: { type: Boolean, default: true },
      assignments: { type: Boolean, default: true },
      onlineClasses: { type: Boolean, default: true },
      attendance: { type: Boolean, default: true },
      leaveManagement: { type: Boolean, default: true },
      feeManagement: { type: Boolean, default: true },
      payroll: { type: Boolean, default: true },
      accounts: { type: Boolean, default: true },
      noticeBoard: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      notifications: { type: Boolean, default: true },
      library: { type: Boolean, default: true },
      transport: { type: Boolean, default: true },
      hostel: { type: Boolean, default: true },
      inventory: { type: Boolean, default: true },
      calendar: { type: Boolean, default: true },
      reports: { type: Boolean, default: true },
    },

    // Attendance Settings
    attendanceSettings: {
      defaultMarkingTime: { type: String, default: '09:00' },
      gracePeriodMinutes: { type: Number, default: 15 },
      autoMarkAbsent: { type: Boolean, default: false },
    },

    // Fee Settings
    feeSettings: {
      currency: { type: String, default: '₹' },
      currencySymbol: { type: String, default: '₹' },
      lateFeePercentage: { type: Number, default: 5 },
      reminderDaysBefore: { type: Number, default: 7 },
      enableOnlinePayment: { type: Boolean, default: false },
    },

    // Notification Settings
    notificationSettings: {
      emailEnabled: { type: Boolean, default: true },
      smsEnabled: { type: Boolean, default: false },
      pushEnabled: { type: Boolean, default: true },
    },

    // Singleton marker
    isSingleton: {
      type: Boolean,
      default: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// Ensure only one document exists (singleton pattern)
AdminSettingsSchema.index({ isSingleton: 1 }, { unique: true });

export const AdminSettings = mongoose.model('AdminSettings', AdminSettingsSchema);
