const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  applicant:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  leaveType:   { type: String, enum: ['sick', 'casual', 'earned', 'maternity', 'other'], required: true },
  fromDate:    { type: Date, required: true },
  toDate:      { type: Date, required: true },
  totalDays:   { type: Number },
  reason:      { type: String, required: true },
  status:      { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  remarks:     { type: String },
}, { timestamps: true });

leaveSchema.pre('save', function (next) {
  if (this.fromDate && this.toDate) {
    const diff = (new Date(this.toDate) - new Date(this.fromDate)) / (1000 * 60 * 60 * 24);
    this.totalDays = Math.ceil(diff) + 1;
  }
  next();
});

module.exports = mongoose.model('Leave', leaveSchema);
