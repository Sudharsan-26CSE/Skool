import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'teacher', 'staff', 'student'],
      default: 'student',
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'India' },
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    profileImage: String,
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    settings: {
      language: { type: String, default: 'en' },
      theme: { type: String, default: 'light' },
      notifications: { type: Boolean, default: true },
      emailAlerts: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', UserSchema);
