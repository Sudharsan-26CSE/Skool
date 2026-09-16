import mongoose from 'mongoose';

const HostelSchema = new mongoose.Schema(
  {
    hostelName: {
      type: String,
      required: true,
      trim: true,
    },
    hostelType: {
      type: String,
      enum: ['boys', 'girls', 'co-ed'],
      required: true,
    },
    roomNo: {
      type: String,
      required: true,
      trim: true,
    },
    roomType: {
      type: String,
      enum: ['single', 'double', 'triple', 'dormitory'],
      default: 'double',
    },
    floor: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    occupants: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        joinedDate: { type: Date, default: Date.now },
        leftDate: Date,
      },
    ],
    amenities: [String],
    monthlyFee: {
      type: Number,
      default: 0,
    },
    warden: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Unique room per hostel
HostelSchema.index({ hostelName: 1, roomNo: 1 }, { unique: true });

export const Hostel = mongoose.model('Hostel', HostelSchema);
