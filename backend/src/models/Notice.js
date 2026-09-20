const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  content:    { type: String, required: true },
  category:   { type: String, enum: ['Academic', 'Event', 'Meeting', 'Library', 'Finance', 'General'], default: 'General' },
  validFrom:  { type: Date, default: Date.now },
  validUntil: { type: Date },
  audience:   { type: [String], enum: ['all', 'student', 'teacher', 'staff', 'admin'], default: ['all'] },
  postedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPinned:   { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
