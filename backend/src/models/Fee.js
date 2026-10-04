const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  invoiceNo:   { type: String, unique: true },
  student:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  feeType:     { type: String, required: true },
  amount:      { type: Number, required: true },
  discount:    { type: Number, default: 0 },
  totalAmount: { type: Number },
  dueDate:     { type: Date, required: true },
  paidDate:    { type: Date },
  status:      { type: String, enum: ['pending', 'paid', 'overdue', 'partial'], default: 'pending' },
  paymentMode: { type: String, enum: ['cash', 'card', 'bank-transfer', 'online'], default: 'cash' },
  notes:       { type: String },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

feeSchema.pre('save', async function (next) {
  if (!this.invoiceNo) {
    const count = await mongoose.model('Fee').countDocuments();
    const year = new Date().getFullYear();
    this.invoiceNo = `INV-${year}-${String(count + 1).padStart(3, '0')}`;
  }
  this.totalAmount = this.amount - (this.discount || 0);
  next();
});

module.exports = mongoose.model('Fee', feeSchema);
