const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  code:        { type: String, unique: true, required: true },
  name:        { type: String, required: true },
  category:    { type: String },
  credits:     { type: Number, default: 3 },
  description: { type: String },
  teacher:     { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
