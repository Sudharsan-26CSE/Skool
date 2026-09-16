import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userType: {
      type: String,
      enum: ['student', 'teacher', 'staff'],
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassManagement',
      // Class is optional for staff/teachers
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'half-day', 'excused'],
      required: true,
    },
    remarks: String,
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// One attendance record per user per date
AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model('Attendance', AttendanceSchema);
