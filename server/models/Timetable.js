import mongoose from 'mongoose';

const TimetableSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassManagement',
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true,
    },
    period: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    roomNo: String,
    academicYear: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent double-booking: one slot per class per day per period
TimetableSchema.index({ class: 1, day: 1, period: 1, academicYear: 1 }, { unique: true });

export const Timetable = mongoose.model('Timetable', TimetableSchema);
