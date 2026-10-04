const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  staff:         { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  month:         { type: Number, required: true, min: 1, max: 12 },
  year:          { type: Number, required: true },
  basicSalary:   { type: Number, default: 0 },
  allowances:    { type: Number, default: 0 },
  deductions:    { type: Number, default: 0 },
  netPay:        { type: Number },
  status:        { type: String, enum: ['pending', 'paid', 'on-hold'], default: 'pending' },
  paidDate:      { type: Date },
  paymentMode:   { type: String, enum: ['bank-transfer', 'cash', 'cheque'], default: 'bank-transfer' },
  processedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

payrollSchema.pre('save', function (next) {
  this.netPay = (this.basicSalary + this.allowances) - this.deductions;
  next();
});

module.exports = mongoose.model('Payroll', payrollSchema);
