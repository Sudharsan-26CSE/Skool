import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'cheque', 'bank-transfer', 'online', 'upi', 'card'],
    },
    referenceNo: String,
    attachments: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    academicYear: String,
    remarks: String,
  },
  { timestamps: true }
);

export const Account = mongoose.model('Account', AccountSchema);
