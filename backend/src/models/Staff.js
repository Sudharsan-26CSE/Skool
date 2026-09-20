const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  employeeId:   { type: String, unique: true },
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department:   { type: String, required: true },
  designation:  { type: String, required: true },
  qualification:{ type: String },
  experience:   { type: String },
  joiningDate:  { type: Date, default: Date.now },
  salary:       { type: Number, default: 0 },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

staffSchema.pre('save', async function (next) {
  if (!this.employeeId) {
    const count = await mongoose.model('Staff').countDocuments();
    this.employeeId = `EMP-${String(count + 101).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Staff', staffSchema);
