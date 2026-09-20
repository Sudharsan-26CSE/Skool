const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  admissionNo: { type: String, unique: true },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  class:       { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  parentName:  { type: String },
  parentPhone: { type: String },
  parentEmail: { type: String },
  dateOfBirth: { type: Date },
  gender:      { type: String, enum: ['male', 'female', 'other'] },
  address:     { type: String },
  bloodGroup:  { type: String },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate admissionNo before saving
studentSchema.pre('save', async function (next) {
  if (!this.admissionNo) {
    const count = await mongoose.model('Student').countDocuments();
    this.admissionNo = `STU-${String(count + 1001).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);
