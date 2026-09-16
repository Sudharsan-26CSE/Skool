import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    admissionNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassManagement',
    },
    section: {
      type: String,
      trim: true,
    },
    rollNo: String,
    parentName: {
      type: String,
      trim: true,
    },
    parentPhone: {
      type: String,
      trim: true,
    },
    parentEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    parentOccupation: String,
    guardianName: String,
    guardianPhone: String,
    guardianRelation: String,
    previousSchool: String,
    feeStatus: {
      type: String,
      enum: ['paid', 'partial', 'unpaid'],
      default: 'unpaid',
    },
    transportRoute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transport',
    },
    hostelRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Student = mongoose.model('Student', StudentSchema);
