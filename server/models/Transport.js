import mongoose from 'mongoose';

const TransportSchema = new mongoose.Schema(
  {
    routeName: {
      type: String,
      required: true,
      trim: true,
    },
    routeNo: {
      type: String,
      unique: true,
      trim: true,
    },
    vehicleNo: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleType: {
      type: String,
      enum: ['bus', 'van', 'mini-bus', 'other'],
      default: 'bus',
    },
    capacity: {
      type: Number,
      required: true,
    },
    driverName: {
      type: String,
      required: true,
      trim: true,
    },
    driverPhone: {
      type: String,
      required: true,
    },
    driverLicense: String,
    helperName: String,
    helperPhone: String,
    stops: [
      {
        name: { type: String, required: true },
        time: String,
        order: Number,
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    monthlyFee: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Transport = mongoose.model('Transport', TransportSchema);
