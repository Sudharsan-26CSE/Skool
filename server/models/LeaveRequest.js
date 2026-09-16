import mongoose from 'mongoose';

const LeaveRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    leaveType: {
      type: String,
      enum: ['sick', 'casual', 'earned', 'maternity', 'paternity', 'other'],
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    totalDays: Number,
    reason: {
      type: String,
      required: true,
    },
    attachments: [String],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedDate: Date,
    adminRemarks: String,
  },
  { timestamps: true }
);

// Auto-calculate total days
LeaveRequestSchema.pre('save', function (next) {
  if (this.fromDate && this.toDate) {
    const diffMs = this.toDate - this.fromDate;
    this.totalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
  }
  next();
});

export const LeaveRequest = mongoose.model('LeaveRequest', LeaveRequestSchema);
