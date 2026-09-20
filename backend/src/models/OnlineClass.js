const mongoose = require('mongoose');

const onlineClassSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  teacher:     { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  class:       { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  subject:     { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  meetingLink: { type: String },
  startTime:   { type: String },
  endTime:     { type: String },
  scheduledAt: { type: Date },
  status:      { type: String, enum: ['scheduled', 'live', 'completed', 'cancelled'], default: 'scheduled' },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('OnlineClass', onlineClassSchema);
