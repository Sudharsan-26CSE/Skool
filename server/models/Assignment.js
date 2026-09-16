import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  content: String,
  attachments: [String],
  grade: String,
  marks: Number,
  feedback: String,
  status: {
    type: String,
    enum: ['submitted', 'graded', 'returned'],
    default: 'submitted',
  },
});

const AssignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassManagement',
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    totalMarks: {
      type: Number,
      default: 100,
    },
    attachments: [String],
    submissions: [SubmissionSchema],
    status: {
      type: String,
      enum: ['draft', 'published', 'closed'],
      default: 'published',
    },
  },
  { timestamps: true }
);

export const Assignment = mongoose.model('Assignment', AssignmentSchema);
