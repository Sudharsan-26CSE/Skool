import mongoose from 'mongoose';

const SchoolCalendarSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    date: {
      type: Date,
      required: true,
    },
    endDate: Date,
    type: {
      type: String,
      enum: ['holiday', 'exam', 'event', 'meeting', 'sports', 'cultural', 'parent-meeting', 'other'],
      required: true,
    },
    targetRoles: [
      {
        type: String,
        enum: ['admin', 'teacher', 'staff', 'student', 'all'],
      },
    ],
    color: {
      type: String,
      default: '#4F46E5',
    },
    isFullDay: {
      type: Boolean,
      default: true,
    },
    startTime: String,
    endTime: String,
    location: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const SchoolCalendar = mongoose.model('SchoolCalendar', SchoolCalendarSchema);
