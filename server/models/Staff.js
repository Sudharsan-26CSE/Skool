import mongoose from 'mongoose';

const StaffSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    qualification: String,
    experience: {
      type: Number, // years
      default: 0,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    salary: {
      type: Number,
      default: 0,
    },
    bankAccount: {
      bankName: String,
      accountNo: String,
      ifscCode: String,
    },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Staff = mongoose.model('Staff', StaffSchema);
