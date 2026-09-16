import mongoose from 'mongoose';

const NoticeBoardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetRoles: [
      {
        type: String,
        enum: ['admin', 'teacher', 'staff', 'student', 'all'],
      },
    ],
    category: {
      type: String,
      enum: ['general', 'academic', 'event', 'exam', 'holiday', 'urgent', 'other'],
      default: 'general',
    },
    attachments: [String],
    isPinned: {
      type: Boolean,
      default: false,
    },
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validUntil: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const NoticeBoard = mongoose.model('NoticeBoard', NoticeBoardSchema);
