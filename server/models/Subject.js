import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassManagement',
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['theory', 'practical', 'both'],
      default: 'theory',
    },
    passMarks: {
      type: Number,
      default: 35,
    },
    fullMarks: {
      type: Number,
      default: 100,
    },
    description: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Subject = mongoose.model('Subject', SubjectSchema);
