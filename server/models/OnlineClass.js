import mongoose from 'mongoose';

const OnlineClassSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
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
    meetingLink: {
      type: String,
      required: true,
    },
    meetingId: String,
    passcode: String,
    platform: {
      type: String,
      enum: ['zoom', 'google-meet', 'teams', 'other'],
      default: 'zoom',
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    duration: Number, // minutes
    recordingLink: String,
    status: {
      type: String,
      enum: ['scheduled', 'live', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    attendees: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        joinedAt: Date,
        leftAt: Date,
      },
    ],
  },
  { timestamps: true }
);

export const OnlineClass = mongoose.model('OnlineClass', OnlineClassSchema);
