import mongoose from 'mongoose';

const PayrollSchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    basicSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    allowances: {
      hra: { type: Number, default: 0 },
      da: { type: Number, default: 0 },
      ta: { type: Number, default: 0 },
      medical: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    deductions: {
      pf: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      insurance: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    totalAllowances: Number,
    totalDeductions: Number,
    netPay: Number,
    paymentDate: Date,
    paymentMethod: {
      type: String,
      enum: ['bank-transfer', 'cheque', 'cash'],
      default: 'bank-transfer',
    },
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'processed', 'paid'],
      default: 'pending',
    },
    remarks: String,
  },
  { timestamps: true }
);

// One payroll entry per staff per month
PayrollSchema.index({ staff: 1, month: 1, year: 1 }, { unique: true });

// Auto-calculate totals
PayrollSchema.pre('save', function (next) {
  const a = this.allowances || {};
  this.totalAllowances = (a.hra || 0) + (a.da || 0) + (a.ta || 0) + (a.medical || 0) + (a.other || 0);
  const d = this.deductions || {};
  this.totalDeductions = (d.pf || 0) + (d.tax || 0) + (d.insurance || 0) + (d.other || 0);
  this.netPay = this.basicSalary + this.totalAllowances - this.totalDeductions;
  next();
});

export const Payroll = mongoose.model('Payroll', PayrollSchema);
