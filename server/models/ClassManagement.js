import mongoose from 'mongoose';

const ClassManagementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    section: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      default: 40,
    },
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    academicYear: {
      type: String,
      required: true,
      trim: true,
    },
    roomNo: String,
    description: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compound unique index: one section per class per year
ClassManagementSchema.index({ name: 1, section: 1, academicYear: 1 }, { unique: true });

export const ClassManagement = mongoose.model('ClassManagement', ClassManagementSchema);
