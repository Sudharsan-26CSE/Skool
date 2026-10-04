const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name:         { type: String, required: true },   // e.g. "Grade 10"
  section:      { type: String, required: true },   // e.g. "A"
  classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  subjects:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  capacity:     { type: Number, default: 40 },
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
