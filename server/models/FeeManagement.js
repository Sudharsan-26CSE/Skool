import mongoose from 'mongoose';

const FeeManagementSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    feeType: {
      type: String,
      enum: ['tuition', 'admission', 'exam', 'transport', 'hostel', 'library', 'lab', 'sports', 'other'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    fine: {
      type: Number,
      default: 0,
    },
    totalAmount: Number,
    paidAmount: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paidDate: Date,
    paymentMethod: {
      type: String,
      enum: ['cash', 'cheque', 'online', 'upi', 'card', 'other'],
    },
    transactionId: String,
    receiptNo: String,
    status: {
      type: String,
      enum: ['paid', 'partial', 'unpaid', 'overdue'],
      default: 'unpaid',
    },
    academicYear: {
      type: String,
      required: true,
    },
    remarks: String,
  },
  { timestamps: true }
);

// Auto-calculate totalAmount
FeeManagementSchema.pre('save', function (next) {
  this.totalAmount = this.amount - (this.discount || 0) + (this.fine || 0);
  next();
});

export const FeeManagement = mongoose.model('FeeManagement', FeeManagementSchema);
